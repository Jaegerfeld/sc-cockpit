# =============================================================================
# Autor:          Robert Seebauer
# Repository:     https://github.com/Jaegerfeld/sc-cockpit
# KI-Unterstützung: Erstellt mit Unterstützung von Claude (Anthropic)
# Erstellt:       26.11.2026
# Geändert:       26.11.2026
# Lizenz:         BSD-3-Clause (siehe LICENSE)
#
# Fachliche Funktion:
#   Die Bereiche des Cockpits. Jeder Eintrag wird beim Bauen eine eigene Datei
#   bereiche/<schlüssel>.js, die die Hülle erst beim ersten Öffnen lädt.
#
#   Die Übersicht ist seit 0.4.0 das Lagebild: „Zu erledigen“ (offene Merker
#   nach Ort gruppiert, zum Abhaken, mit Sprung zum Ort im Logbuch), Flotte,
#   Fracht und die letzte gelesene Sitzung. Sie liest nur den Browser-Speicher
#   der Bereiche und lädt deren große Dateien nicht. Namen von Waren und der
#   Lagerwert stehen deshalb nur im Logbuch selbst.
#
#   Bereiche, die noch nicht eingezogen sind (Werkstatt, Guides),
#   zeigen, was das Cockpit schon weiß, und führen in das bisherige Tool. So
#   ist kein Bereich eine Sackgasse, solange der Umzug läuft.
#
#   Seit 0.2.0 ist die Flotte eingezogen: FLOTTE_JS hängt den Komponenten-
#   Planer ein. Dessen Quelle bleibt im Repo StarCitizen-Schiffskauf-Planer
#   (eine Stelle für neue Schiffe), der Bau holt sie von dort. Seit 0.3.0
#   hängt FRACHT_JS genauso das Fracht-Logbuch aus dem Repo
#   StarCitizen-Handels-Planer ein, seit 0.5.0 PILOT_JS dessen Reiter Ruf
#   und Sitzungen. Ist eine Quelle beim Bau nicht erreichbar, bleibt für den
#   Bereich der Wegweiser aus BEREICHE.
#
#   Reihenfolge des weiteren Umzugs: Werkstatt und Guides; Routen und Waren
#   folgen dem Logbuch.
# =============================================================================
"""Area scripts of the cockpit; each becomes its own lazily loaded file under bereiche/."""
from __future__ import annotations

import json

#: Addresses of the existing tools that still do the work of an area.
URL = {
    "schiffskauf": "https://jaegerfeld.github.io/StarCitizen-Schiffskauf-Planer/",
    "handel": "https://jaegerfeld.github.io/StarCitizen-Handels-Planer/",
    "auswerter": "https://jaegerfeld.github.io/StarCitizen-Screenshot-Auswerter/",
    "bauplan": "https://jaegerfeld.github.io/StarCitizen-Bauplan-Planer/",
    "wikelo": "https://jaegerfeld.github.io/StarCitizen-Wikelo-Planer/",
    "guides": "https://jaegerfeld.github.io/sc-guides/",
}

#: Area key -> script. Every script registers itself with Cockpit.register(key, {render}).
BEREICHE: dict[str, str] = {
    "uebersicht": r"""
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
""",
    "flotte": r"""
/* ---------- fleet: fallback when the component planner could not be built ---------- */
Cockpit.register('flotte',{render(el){const C=Cockpit, s=SCData.summary();
  C.placeholder(el,{title:['Flotte','Fleet'],
    lede:['Deine Schiffe mit eigenen Namen, ihre Bestückung im Komponenten-Planer und der Schiffskauf. Die Daten des Komponenten-Planers waren beim letzten Bau nicht erreichbar; der nächste Bau holt sie neu.','Your ships with their own names, their loadout in the component planner, and ship purchase. The component planner data was unavailable at the last build; the next build fetches it again.'],
    facts:[C.fact(s.ships,s.ships===1?'Schiff in deiner Flotte':'Schiffe in deiner Flotte',s.ships===1?'ship in your fleet':'ships in your fleet')],
    tools:[{ico:'🚀',name:['Schiffskauf-Planer','Ship purchase planner'],what:['Reiter „Komponenten“: Schiffe ansehen, Teile tauschen, Einkaufsliste. Dazu Preise und Standorte kaufbarer Schiffe.','“Components” tab: view ships, swap parts, shopping list. Plus prices and locations of buyable ships.'],url:'__schiffskauf__'}],
    note:['Die Flotte ist schon gemeinsam: Schiffe, die du im Schiffskauf-Planer oder im Fracht-Logbuch anlegst, zählt das Cockpit online mit.','The fleet is already shared: online the cockpit counts the ships you add in the ship purchase planner or the cargo ledger.']});}});
""",
    "fracht": r"""
/* ---------- cargo: fallback when the cargo ledger could not be built ---------- */
Cockpit.register('fracht',{render(el){const C=Cockpit, s=SCData.summary();
  C.placeholder(el,{title:['Fracht','Cargo'],
    lede:['Das Fracht-Logbuch mit Notizen je Ort und Schiff, Handelsrouten, Warenlisten und der Screenshot-Auswerter für Handelskonsolen.','The cargo ledger with notes per place and ship, trade routes, commodity lists and the screenshot reader for trade consoles.'],
    facts:[C.fact(s.scu,'SCU im Logbuch','SCU in the ledger'),C.fact(s.places,s.places===1?'Ort mit Fracht':'Orte mit Fracht',s.places===1?'place with cargo':'places with cargo'),
      C.fact(s.notes,s.notes===1?'Notiz':'Notizen',s.notes===1?'note':'notes'),C.fact(s.cargoShips,s.cargoShips===1?'Frachtschiff':'Frachtschiffe',s.cargoShips===1?'cargo ship':'cargo ships')],
    tools:[{ico:'📈',name:['Handels-Planer','Trade planner'],what:['Fracht-Logbuch mit Notizen, Routen, alle Waren, Kauf- und Verkaufsorte.','Cargo ledger with notes, routes, all commodities, buy and sell places.'],url:'__handel__'},
      {ico:'📷',name:['Screenshot-Auswerter','Screenshot reader'],what:['Liest Preise aus Screenshots der Handelskonsolen.','Reads prices from screenshots of the trade consoles.'],url:'__auswerter__'}],
    note:['Die Daten des Fracht-Logbuchs waren beim letzten Bau nicht erreichbar; der nächste Bau holt sie neu. Bis dahin führst du das Logbuch im Handels-Planer.','The cargo ledger data was unavailable at the last build; the next build fetches it again. Until then keep the ledger in the trade planner.']});}});
""",
    "werkstatt": r"""
/* ---------- workshop (not moved in yet) ---------- */
Cockpit.register('werkstatt',{render(el){Cockpit.placeholder(el,{title:['Werkstatt','Workshop'],
    lede:['Baupläne und der Tauschhandel bei Wikelo: was du brauchst, was du hast, was noch fehlt.','Blueprints and the trade with Wikelo: what you need, what you have, what is still missing.'],
    tools:[{ico:'🛠️',name:['Bauplan-Planer','Blueprint planner'],what:['Baupläne wählen, Material und Bestand gegenrechnen.','Pick blueprints, set material against stock.'],url:'__bauplan__'},
      {ico:'🧮',name:['Wikelo-Planer','Wikelo planner'],what:['Wikelo-Tauschgeschäfte planen und den Fortschritt verfolgen.','Plan Wikelo trades and track the progress.'],url:'__wikelo__'}]});}});
""",
    "guides": r"""
/* ---------- guides (not moved in yet) ---------- */
Cockpit.register('guides',{render(el){Cockpit.placeholder(el,{title:['Guides','Guides'],
    lede:['Flyer und Karten zu Schiffen, Orten und Spielweisen, zum Lesen und Ausdrucken.','Flyers and maps on ships, places and play styles, to read and to print.'],
    tools:[{ico:'📚',name:['Guides-Übersicht','Guides overview'],what:['Alle Guides auf Deutsch und Englisch, als Seite und PDF.','All guides in German and English, as page and PDF.'],url:'__guides__'}]});}});
""",
    "pilot": r"""
/* ---------- pilot: fallback when reputation and sessions could not be built ---------- */
Cockpit.register('pilot',{render(el){Cockpit.placeholder(el,{title:['Pilot','Pilot'],
    lede:['Was an dir als Spieler hängt: der Ruf je Organisation und deine Spielsitzungen mit Shard, Ort, Schiff und Absturz.','What belongs to you as a player: reputation per organisation and your play sessions with shard, place, ship and crash.'],
    tools:[{ico:'📈',name:['Handels-Planer','Trade planner'],what:['Reiter „Ruf“ und „Sitzungen“. Beide lesen deine Spiel-Logs nur auf deinem Rechner.','“Reputation” and “Sessions” tabs. Both read your game logs on your computer only.'],url:'__handel__'}]});}});
""",
}


#: Fleet area with the component planner. The planner itself (markup, styles, script, data) comes from
#: the StarCitizen-Schiffskauf-Planer sources at build time; this wrapper gives it what its own page
#: provided: the storage helpers ``load``/``save`` and a place in the document.
FLOTTE_JS = r"""
/* ---------- fleet: my ships and the component planner (source: StarCitizen-Schiffskauf-Planer) ---------- */
(function(){
// The planner binds its handlers to its own elements once, so its node is built once and re-attached on
// every render instead of being drawn again.
let node=null;
const HEAD=`<h1><span class="de">Flotte</span><span class="en">Fleet</span></h1>
  <p class="ck-lede"><span class="de">Deine Schiffe und ihre Bestückung. „Schiffe …“ öffnet die Liste aller Schiffe und deine Flotte; die Einkaufsliste unten kannst du als Merker übernehmen.</span><span class="en">Your ships and their loadouts. “Ships …” opens the list of all ships and your fleet; you can take the shopping list at the bottom over as reminders.</span></p>`;
const FOOT=`<h2 class="ck-h2"><span class="de">Noch im bisherigen Tool</span><span class="en">Still in the existing tool</span></h2>
  <div class="ck-tools"><div class="ck-tool"><b><span aria-hidden="true">🚀</span> <span class="de">Schiffskauf-Planer</span><span class="en">Ship purchase planner</span></b>
    <p><span class="de">Preise und Standorte kaufbarer Schiffe, Merkliste mit Budget.</span><span class="en">Prices and locations of buyable ships, wish list with budget.</span></p>
    <a class="btn" href="__schiffskauf__" target="_blank" rel="noopener"><span class="de">Öffnen</span><span class="en">Open</span> <span aria-hidden="true">↗</span><span class="ck-sr"> (<span class="de">neuer Tab</span><span class="en">new tab</span>)</span></a></div></div>`;
// Storage helpers the planner expects from its page.
function load(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch(e){return null;}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function boot(){
/*KP_JS*/
}
function start(el){
  const st=document.createElement('style'); st.textContent=/*KP_CSS*/''+CSS_HOST; document.head.appendChild(st);
  node=document.createElement('div'); node.className='ck-kp'; node.innerHTML=HEAD+/*KP_HTML*/''+FOOT;
  el.replaceChildren(node);
  boot();
  // The planner switches to one column by window width; inside the cockpit its column is narrower than
  // the window, so the switch follows the width of the planner itself.
  new ResizeObserver(()=>{const w=node.clientWidth; if(!w) return; node.classList.toggle('narrow',w<860); node.classList.toggle('midw',w<960);}).observe(node);
  // A loadout link ("#kp=…") has been taken over by the planner; show the area's own address again.
  if(!/^#\//.test(location.hash)) history.replaceState(null,'','#/flotte');
}
// What the planner's page styled for it (table, notes), the one-column layout by own width, and the
// drawer, which must not push the page aside here.
const CSS_HOST=`
  #kpPanel{display:block}
  .ck-kp table{width:100%;border-collapse:collapse;background:var(--panel)}
  .ck-kp th,.ck-kp td{padding:8px 10px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top;font-size:14px}
  .ck-kp th{font-family:var(--disp);font-size:13.5px;color:var(--muted);background:var(--panel2);white-space:nowrap}
  .ck-kp td.num,.ck-kp th.num{text-align:right;white-space:nowrap}
  .ck-kp .note{color:var(--muted);font-size:12.5px}
  .ck-kp #kpPanel h2{font-size:20px}
  .ck-kp.narrow #kpPanel .kp-stage,.ck-kp.midw #kpPanel .kp-stage.wide{grid-template-columns:minmax(0,1fr)}
  .ck-kp.narrow #kpPanel .kp-ship,.ck-kp.midw #kpPanel .kp-stage.wide .kp-ship{order:-1;max-width:420px;width:100%;margin:0 auto}
  .ck-kp.narrow #kp-wires,.ck-kp.midw .kp-stage.wide #kp-wires{display:none}
  .ck-kp.narrow #kpPanel .kp-sd{display:inline}
  body.kp-open{padding-right:0!important}`;
Cockpit.register('flotte',{render(el){if(!node) start(el); else if(node.parentNode!==el) el.replaceChildren(node);}});
})();
"""


def flotte_script(kp_html: str, kp_css: str, kp_js: str) -> str:
    """Return the fleet area script with the component planner built in.

    Args:
        kp_html: Panel markup of the planner (``KP_HTML`` of the Schiffskauf-Planer).
        kp_css: Its styles (``KP_CSS``).
        kp_js: Its script with the data already inserted (``KP_JS``).

    Returns:
        JavaScript source of ``bereiche/flotte.js``.

    Raises:
        ValueError: If a mark of the template is missing.
    """
    js = FLOTTE_JS
    for mark, value in [("/*KP_CSS*/''", json.dumps(kp_css, ensure_ascii=False)),
                        ("/*KP_HTML*/''", json.dumps(kp_html, ensure_ascii=False)),
                        ("/*KP_JS*/", kp_js), ("__schiffskauf__", URL["schiffskauf"])]:
        if js.count(mark) != 1:
            raise ValueError(f"Marke {mark} fehlt in der Flotten-Vorlage")
        js = js.replace(mark, value)
    return js.strip() + "\n"


#: Cargo area with the cargo ledger. The ledger itself (markup, styles, script, master data) comes from
#: the StarCitizen-Handels-Planer sources at build time; this wrapper stands in for its page: the toast,
#: the view switch (not needed here) and a place in the document.
FRACHT_JS = r"""
/* ---------- cargo: the cargo ledger with notes and reminders (source: StarCitizen-Handels-Planer) ---------- */
(function(){
// The ledger binds its handlers to its own elements once, so its node is built once and re-attached.
let node=null, LBX=null;
const HEAD=`<h1><span class="de">Fracht</span><span class="en">Cargo</span></h1>
  <p class="ck-lede"><span class="de">Dein Fracht-Logbuch: was wo liegt, Notizen je Ort und Schiff, und was dort zu erledigen ist. Kaufmerker aus der Flotte erscheinen am Ort ihres Händlers.</span><span class="en">Your cargo ledger: what is where, notes per place and ship, and what there is to do. Purchase reminders from the fleet appear at the place of their shop.</span></p>`;
const FOOT=`<h2 class="ck-h2"><span class="de">Noch im bisherigen Tool</span><span class="en">Still in the existing tool</span></h2>
  <div class="ck-tools"><div class="ck-tool"><b><span aria-hidden="true">📈</span> <span class="de">Handels-Planer</span><span class="en">Trade planner</span></b>
    <p><span class="de">Routen, alle Waren, Kauf- und Verkaufsorte, „Aufs Handy“. Dort nennt das Logbuch auch den besten Verkaufsort je Ware.</span><span class="en">Routes, all commodities, buy and sell places, “To the phone”. There the ledger also names the best sell place per commodity.</span></p>
    <a class="btn" href="__handel__" target="_blank" rel="noopener"><span class="de">Öffnen</span><span class="en">Open</span> <span aria-hidden="true">↗</span><span class="ck-sr"> (<span class="de">neuer Tab</span><span class="en">new tab</span>)</span></a></div>
  <div class="ck-tool"><b><span aria-hidden="true">📷</span> <span class="de">Screenshot-Auswerter</span><span class="en">Screenshot reader</span></b>
    <p><span class="de">Liest Preise aus Screenshots der Handelskonsolen.</span><span class="en">Reads prices from screenshots of the trade consoles.</span></p>
    <a class="btn" href="__auswerter__" target="_blank" rel="noopener"><span class="de">Öffnen</span><span class="en">Open</span> <span aria-hidden="true">↗</span><span class="ck-sr"> (<span class="de">neuer Tab</span><span class="en">new tab</span>)</span></a></div></div>`;
// What the ledger expects from its page.
function toast(m){Cockpit.toast(m);}
function showView(){}
function boot(){
/*LB_JS*/
return LB;
}
// The ledger's columns follow its own width here (inside the cockpit its column is narrower than the window).
const CSS_HOST=`
  .ck-lb #view-ledger{display:block}
  .ck-lb.midw #view-ledger .lb-grid{grid-template-columns:210px minmax(0,1fr) 230px}
  .ck-lb.narrow #view-ledger .lb-grid{grid-template-columns:minmax(0,1fr)}
  .ck-lb.narrow #view-ledger .lb-mid{order:-1}`;
function start(el){
  const st=document.createElement('style'); st.textContent=/*LB_CSS*/''+CSS_HOST; document.head.appendChild(st);
  node=document.createElement('div'); node.className='ck-lb'; node.innerHTML=HEAD+/*LB_HTML*/''+FOOT;
  el.replaceChildren(node);
  node.querySelector('#view-ledger').classList.remove('hide');
  LBX=boot();
  new ResizeObserver(()=>{const w=node.clientWidth; if(!w) return; node.classList.toggle('narrow',w<720); node.classList.toggle('midw',w<980);}).observe(node);
}
// Every draw (language, reminders, fleet) takes over fleet changes and redraws the ledger.
Cockpit.register('fracht',{render(el){if(!node) start(el); else if(node.parentNode!==el) el.replaceChildren(node);
  if(!LBX) return;
  // A jump from the overview ("In the ledger"): select that place, found by its id or by the shop text.
  const it=Cockpit.intent; if(it){Cockpit.intent=null; const loc=it.loc||(LBX.shopPlace?LBX.shopPlace(it.shop):null); if(loc) LBX.openLoc(loc);}
  if(LBX.sync) LBX.sync(); LBX.render();}});
})();
"""


def fracht_script(lb_html: str, lb_css: str, lb_js: str) -> str:
    """Return the cargo area script with the cargo ledger built in.

    Args:
        lb_html: Panel markup of the ledger (``LB_HTML`` of the Handels-Planer).
        lb_css: Its styles (``LB_CSS``).
        lb_js: Its script with the master data already inserted (``LB_JS``).

    Returns:
        JavaScript source of ``bereiche/fracht.js``.

    Raises:
        ValueError: If a mark of the template is missing.
    """
    js = FRACHT_JS
    for mark, value in [("/*LB_CSS*/''", json.dumps(lb_css, ensure_ascii=False)),
                        ("/*LB_HTML*/''", json.dumps(lb_html, ensure_ascii=False)),
                        ("/*LB_JS*/", lb_js), ("__handel__", URL["handel"]), ("__auswerter__", URL["auswerter"])]:
        if js.count(mark) != 1:
            raise ValueError(f"Marke {mark} fehlt in der Fracht-Vorlage")
        js = js.replace(mark, value)
    return js.strip() + "\n"


#: Pilot area with reputation and sessions. Both tabs (markup, styles, script, reputation table) come from
#: the StarCitizen-Handels-Planer sources at build time. The wrapper gives them the two things they took
#: from their page: the places of the cargo ledger (to name the last place of a session) and the jump there.
PILOT_JS = r"""
/* ---------- pilot: reputation and sessions (source: StarCitizen-Handels-Planer) ---------- */
(function(){
let node=null, X=null, tab='rep', sumTimer=0;
const HEAD=`<h1>Pilot</h1>
  <p class="ck-lede"><span class="de">Dein Ruf je Organisation und deine Spielsitzungen. Beide lesen deine Spiel-Logs nur auf deinem Rechner; es wird nichts hochgeladen.</span><span class="en">Your reputation per organisation and your play sessions. Both read your game logs on your computer only; nothing is uploaded.</span></p>
  <div class="ck-subtabs" role="tablist" aria-label="Pilot">
    <button type="button" role="tab" data-t="rep"><span class="de">Ruf</span><span class="en">Reputation</span></button>
    <button type="button" role="tab" data-t="sessions"><span class="de">Sitzungen</span><span class="en">Sessions</span></button></div>`;
// Stand-in for the cargo ledger of the trade planner page: its places, and "open this place" as a jump to Cargo.
const LB={places:/*PLACES*/[], openLoc(loc){Cockpit.intent={loc}; Cockpit.go('fracht');}};
function boot(){
/*SZ_JS*/
/*RF_JS*/
return {SZ,RF};
}
function show(t){tab=t==='sessions'?'sessions':'rep';
  node.querySelector('#view-rep').classList.toggle('hide',tab!=='rep'); node.querySelector('#view-sessions').classList.toggle('hide',tab!=='sessions');
  node.querySelectorAll('.ck-subtabs [data-t]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.t===tab)));
  if(tab==='rep') X.RF.render(); else X.SZ.render(); summary();}
// Short reputation state for the status board of the overview (aligned organisations with rank and estimate).
// Written a moment after every interaction, because reading the logs changes the estimate later.
function summary(){clearTimeout(sumTimer); sumTimer=setTimeout(()=>{try{const d=X.RF.handyData(); if(d&&d.o) localStorage.setItem('sc_cockpit_ruf',JSON.stringify(d));}catch(e){}},800);}
function start(el){
  const st=document.createElement('style'); st.textContent=/*CSS*/''; document.head.appendChild(st);
  node=document.createElement('div'); node.className='ck-pilot'; node.innerHTML=HEAD+/*HTML*/'';
  el.replaceChildren(node);
  // "To the phone" needs the phone module of the trade planner page.
  const h=node.querySelector('#rf-handy'); if(h) h.hidden=true;
  X=boot();
  node.querySelector('.ck-subtabs').addEventListener('click',e=>{const b=e.target.closest('[data-t]'); if(b) show(b.dataset.t);});
  node.addEventListener('click',summary); node.addEventListener('change',summary);
}
Cockpit.register('pilot',{render(el){if(!node) start(el); else if(node.parentNode!==el) el.replaceChildren(node);
  const it=Cockpit.intent; if(it&&it.tab){tab=it.tab; Cockpit.intent=null;}
  show(tab);}});
})();
"""


def pilot_script(html: str, css: str, sz_js: str, rf_js: str, places: list) -> str:
    """Return the pilot area script with the reputation and sessions tabs built in.

    Args:
        html: Markup of both panels (``SZ_HTML`` + ``RF_HTML`` of the Handels-Planer).
        css: Their styles.
        sz_js: Script of the sessions tab (``SZ_JS``).
        rf_js: Script of the reputation tab with its table already inserted (``RF_JS``).
        places: Places of the cargo ledger, for naming the last place of a session.

    Returns:
        JavaScript source of ``bereiche/pilot.js``.

    Raises:
        ValueError: If a mark of the template is missing.
    """
    js = PILOT_JS
    for mark, value in [("/*CSS*/''", json.dumps(css, ensure_ascii=False)), ("/*HTML*/''", json.dumps(html, ensure_ascii=False)),
                        ("/*PLACES*/[]", json.dumps(places, ensure_ascii=False, separators=(",", ":"))),
                        ("/*SZ_JS*/", sz_js), ("/*RF_JS*/", rf_js)]:
        if js.count(mark) != 1:
            raise ValueError(f"Marke {mark} fehlt in der Pilot-Vorlage")
        js = js.replace(mark, value)
    return js.strip() + "\n"


def scripts() -> dict[str, str]:
    """Return the area scripts with the tool addresses filled in.

    Returns:
        Area key -> JavaScript source of ``bereiche/<key>.js``.
    """
    out = {}
    for key, js in BEREICHE.items():
        for name, url in URL.items():
            js = js.replace(f"__{name}__", url)
        out[key] = js.strip() + "\n"
    return out
