/* ---------- overview: status board from the shared data ---------- */
(function(){
const C=Cockpit, T=C.T, esc=C.esc, nf=C.nf;
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null');}catch(e){return null;}};
// Place of a reminder as text: the ledger place, else the place part of the shop text ("… - Port Tressler (Stanton)").
const placeTxt=m=>m.loc?String(m.loc).replace(/^p:/,'').split('|').pop():m.shop?String(m.shop).split(' - ').pop().replace(/\s*\([^()]*\)$/,''):'';
const pretty=raw=>String(raw||'').replace(/^RR_/,'').replace(/_/g,' ').replace(/([a-z])([A-Z])/g,'$1 $2').trim();
const when=s=>{const d=new Date(String(s||'').replace(/^<|>$/g,'')); return isNaN(d)?'':d.toLocaleString(C.lang()==='en'?'en-GB':'de-DE',{dateStyle:'short',timeStyle:'short'});};

// "To do": open reminders grouped by place, so one stop shows everything to get there.
function todo(){const open=SCData.open(), fleet=window.SCFleet?SCFleet.read().ships:[];
  if(!open.length) return `<p class="ck-pempty">${SCData.items().length?T('Alles erledigt.','All done.'):T('Nichts offen. Merker entstehen aus der Einkaufsliste eines Schiffs (Flotte), an einem Ort im Logbuch (Fracht) oder rechts in der Leiste.','Nothing open. Reminders come from the shopping list of a ship (Fleet), from a place in the ledger (Cargo) or from the rail on the right.')}</p>`;
  const groups=new Map(); for(const m of open){const k=placeTxt(m); if(!groups.has(k)) groups.set(k,[]); groups.get(k).push(m);}
  const keys=[...groups.keys()].sort((a,b)=>(a==='')-(b==='')||a.localeCompare(b));
  return keys.map(k=>{const list=groups.get(k), sum=list.reduce((a,m)=>a+(m.price?m.price*(m.n||1):0),0), first=list.find(m=>m.loc||m.shop);
    return `<div class="ck-grp"><div class="ck-grph"><b>${k?'📍 '+esc(k):T('Ohne Ort','No place')}</b>${sum?`<span>${nf(sum)} aUEC</span>`:''}
      ${first?`<button type="button" class="btn ck-open" data-loc="${esc(first.loc||'')}" data-shop="${esc(first.shop||'')}">${T('Im Logbuch','In the ledger')} <span aria-hidden="true">→</span><span class="ck-sr"> ${esc(k)}</span></button>`:''}</div>
      <ul class="ck-ml">${list.map(m=>{const f=m.ship!=null?fleet.find(s=>s.id===m.ship):null;
        const meta=[f?'🚀 '+esc(f.name||f.model):'',m.shop?esc(String(m.shop).split(' - ')[0]):'',m.price?`${nf(m.price*(m.n||1))} aUEC`:''].filter(Boolean).join(' · ');
        return `<li><label><input type="checkbox" data-id="${esc(m.id)}"> <span>${m.n>1?esc(m.n)+' × ':''}${esc(m.text)}</span></label>${meta?`<small>${meta}</small>`:''}</li>`;}).join('')}</ul></div>`;}).join('');}

// Fleet: every ship with what is known about it across the areas.
function flotte(){const fleet=window.SCFleet?SCFleet.read().ships:[], led=read('scha_ledger_v1'), kp=read('scsk_kp'), open=SCData.open();
  if(!fleet.length) return `<p class="ck-pempty">${T('Noch kein Schiff. Unter „Flotte“ wählst du deine Schiffe.','No ship yet. Pick your ships under “Fleet”.')}</p>`;
  const rows=fleet.slice(0,6).map(f=>{const scu=(led&&Array.isArray(led.stock)?led.stock:[]).filter(p=>p&&p.l==='s:'+f.id).reduce((a,p)=>a+(+p.z||0)*(+p.n||0),0);
    const fit=kp&&kp.fit&&kp.fit[f.id]?Object.keys(kp.fit[f.id]).length:0, mk=open.filter(m=>m.ship===f.id).length;
    const bits=[fit?T(`${fit} ${fit===1?'Teil':'Teile'} getauscht`,`${fit} ${fit===1?'part':'parts'} swapped`):'',scu?`${nf(scu)} SCU ${T('an Bord','aboard')}`:'',mk?`☑ ${mk} ${T('Merker',mk===1?'reminder':'reminders')}`:''].filter(Boolean);
    return `<li><b>${esc(f.name||f.model)}</b>${f.name?`<small>${esc(f.model)}</small>`:''}<span>${bits.length?bits.join(' · '):T('Standard, leer','stock, empty')}</span></li>`;}).join('');
  return `<ul class="ck-plist">${rows}</ul>${fleet.length>6?`<p class="ck-pmore">${T(`und ${fleet.length-6} weitere`,`and ${fleet.length-6} more`)}</p>`:''}`;}

// Cargo: totals and the places holding the most.
function fracht(){const led=read('scha_ledger_v1'), stock=(led&&Array.isArray(led.stock)?led.stock:[]).filter(p=>p&&p.n>0);
  const notes=led&&led.notes?Object.keys(led.notes).filter(k=>String(led.notes[k]||'').trim()).length:0;
  if(!stock.length) return `<p class="ck-pempty">${T('Keine Fracht im Logbuch.','No cargo in the ledger.')}${notes?` ${nf(notes)} ${T(notes===1?'Notiz':'Notizen',notes===1?'note':'notes')}.`:''}</p>`;
  const by={}; for(const p of stock) by[p.l]=(by[p.l]||0)+p.z*p.n;
  const total=Object.values(by).reduce((a,b)=>a+b,0), top=Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const name=l=>{if(l[0]==='s'){const s=(led.ships||[]).find(x=>'s:'+x.id===l); return '🚀 '+esc(s?s.n:'?');} return '📍 '+esc(l.slice(2).split('|').pop());};
  return `<p class="ck-big">${nf(total)} SCU <small>${T('an','at')} ${nf(Object.keys(by).length)} ${T(Object.keys(by).length===1?'Ort':'Orten',Object.keys(by).length===1?'place':'places')}${notes?` · ${nf(notes)} ${T(notes===1?'Notiz':'Notizen',notes===1?'note':'notes')}`:''}</small></p>
    <ul class="ck-plist">${top.map(([l,s])=>`<li><b>${name(l)}</b><span>${nf(s)} SCU</span></li>`).join('')}</ul>`;}

// Last session the sessions tab of the trade planner has read (its cache holds archived logs, not the running one).
function sitzung(){const c=read('scha_sessions_cache_v2'), all=c&&typeof c==='object'?Object.values(c).filter(s=>s&&s.start):[];
  if(!all.length) return `<p class="ck-pempty">${T('Noch keine Sitzung gelesen. Unter „Pilot“ liest der Reiter „Sitzungen“ deine Spiel-Logs, nur auf deinem Rechner.','No session read yet. Under “Pilot” the “Sessions” tab reads your game logs, on your computer only.')}</p>`;
  const s=all.sort((a,b)=>String(b.start).localeCompare(String(a.start)))[0], j=Array.isArray(s.joins)&&s.joins.length?s.joins[s.joins.length-1]:null;
  const end={crash:['⚠ Absturz','⚠ crash'],ok:['normal beendet','ended normally'],open:['offen','open']}[s.ended]||['',''];
  return `<ul class="ck-plist"><li><b>${esc(when(s.start)||'–')}</b><span>${esc(T(...end))}</span></li>
    ${s.loc?`<li><b>📍 ${esc(pretty(s.loc.raw))}</b><span>${T('letzter Ort','last place')}</span></li>`:''}
    ${s.ship?`<li><b>🚀 ${esc(pretty(s.ship.raw))}</b><span>${T('letztes Schiff','last ship')}</span></li>`:''}
    ${j&&j.shard?`<li><b>${esc(j.shard)}</b><span>Shard</span></li>`:''}</ul>
    <p class="ck-pmore">${T('Stand der zuletzt gelesenen, abgeschlossenen Sitzung.','State of the last finished session that was read.')}</p>`;}

// Reputation as the pilot area last saw it: favourites first, then whoever is closest to the next rank.
function ruf(){const d=read('sc_cockpit_ruf'), rows=d&&Array.isArray(d.o)?d.o:[];
  if(!rows.length) return `<p class="ck-pempty">${T('Noch kein Ruf abgeglichen. Unter „Pilot“ gleichst du einmal Rang und Balken aus dem mobiGlas ab.','No reputation aligned yet. Under “Pilot” you align rank and bar from the mobiGlas once.')}</p>`;
  const list=rows.map(([org,rank,cur,next,nxp,lo,hi,fav])=>{const mid=(lo+hi)/2, pct=next&&nxp>cur?Math.max(0,Math.min(100,Math.round((mid-cur)/(nxp-cur)*100))):null; return {org,rank,next,pct,fav};})
    .sort((a,b)=>b.fav-a.fav||(b.pct??-1)-(a.pct??-1)).slice(0,5);
  return `<ul class="ck-plist">${list.map(r=>`<li><b>${r.fav?'★ ':''}${esc(r.org)}</b><small>${esc(r.rank||'')}${r.next?` → ${esc(r.next)}`:''}</small><span>${r.pct==null?T('höchster Rang','top rank'):'≈ '+r.pct+' %'}</span></li>`).join('')}</ul>
    <p class="ck-pmore">${T('Schätzung, Stand','Estimate, as of')} ${esc(when(d.t))}.</p>`;}

const panel=(cls,title,body,key,linkTxt)=>`<section class="ck-panel ${cls}"><h2>${esc(title)}</h2>${body}${key?`<a class="ck-plink" href="#/${key}">${esc(linkTxt)} <span aria-hidden="true">→</span></a>`:''}</section>`;
function render(el){const first=!SCData.items().length&&!(window.SCFleet&&SCFleet.read().ships.length)&&!read('scha_ledger_v1');
  el.innerHTML=`<h1>${T('Übersicht','Overview')}</h1>
    <p class="ck-lede">${T('Dein Lagebild: was zu erledigen ist, wie es um Flotte und Fracht steht, und wo du zuletzt warst.','Your status board: what there is to do, how fleet and cargo stand, and where you last were.')}</p>
    ${first?`<p class="ck-note">${T('Hier steht noch nichts von dir. Wähl unter „Flotte“ deine Schiffe oder leg rechts einen ersten Merker an. Online teilt das Cockpit die Daten mit den bisherigen Tools.','Nothing of yours is here yet. Pick your ships under “Fleet” or add a first reminder on the right. Online the cockpit shares its data with the existing tools.')}</p><br>`:''}
    <div class="ck-board">
      ${panel('ck-ptodo',T('Zu erledigen','To do')+(SCData.open().length?` (${SCData.open().length})`:''),todo())}
      ${panel('',T('Flotte','Fleet'),flotte(),'flotte',T('Zur Flotte','To the fleet'))}
      ${panel('',T('Fracht','Cargo'),fracht(),'fracht',T('Zum Logbuch','To the ledger'))}
      ${panel('ck-psess',T('Letzte Sitzung','Last session'),sitzung(),'pilot',T('Zu den Sitzungen','To the sessions'))}
      ${panel('',T('Ruf','Reputation'),ruf(),'pilot',T('Zum Ruf','To the reputation'))}
      ${panel('',T('Werkstatt','Workshop'),`<p class="ck-pempty">${T('Baupläne und Wikelo sind noch im bisherigen Tool.','Blueprints and Wikelo are still in the existing tool.')}</p>`,'werkstatt',T('Zur Werkstatt','To the workshop'))}
      ${panel('','Guides',`<p class="ck-pempty">${T('Flyer und Karten zum Lesen und Ausdrucken.','Flyers and maps to read and to print.')}</p>`,'guides',T('Zu den Guides','To the guides'))}
    </div>`;
  // Tick a reminder; the board is drawn again by the change, so focus goes to the next open one.
  el.querySelector('.ck-board').addEventListener('change',e=>{const c=e.target.closest('input[data-id]'); if(!c) return;
    SCData.toggle(c.dataset.id,true); (document.querySelector('#ck-main .ck-ptodo input[data-id]')||document.querySelector('#ck-main h1'))?.focus({preventScroll:true});});
  // Open the place of a group in the cargo ledger; the session panel's link opens the sessions tab of the pilot.
  el.querySelector('.ck-board').addEventListener('click',e=>{if(e.target.closest('.ck-psess .ck-plink')){C.intent={tab:'sessions'}; return;}
    const b=e.target.closest('.ck-open'); if(!b) return;
    C.intent={loc:b.dataset.loc||null,shop:b.dataset.shop||null}; C.go('fracht');});}
Cockpit.register('uebersicht',{render});
})();
