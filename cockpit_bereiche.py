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
#   Kann der Bau eine Quelle nicht erreichen, zeigt der Bereich, was das
#   Cockpit schon weiß, und führt in das bisherige Tool. So ist kein Bereich
#   eine Sackgasse.
#
#   Seit 0.2.0 ist die Flotte eingezogen: FLOTTE_JS hängt den Komponenten-
#   Planer ein. Dessen Quelle bleibt im Repo StarCitizen-Schiffskauf-Planer
#   (eine Stelle für neue Schiffe), der Bau holt sie von dort. Seit 0.3.0
#   hängt FRACHT_JS genauso das Fracht-Logbuch aus dem Repo
#   StarCitizen-Handels-Planer ein, seit 0.5.0 PILOT_JS dessen Reiter Ruf
#   und Sitzungen. Ist eine Quelle beim Bau nicht erreichbar, bleibt für den
#   Bereich der Wegweiser aus BEREICHE.
#
#   Seit 0.6.0 hängt WERKSTATT_JS den Bauplan- und den Wikelo-Planer ein.
#   Die beiden sind ganze Seiten aus einer Vorlage, mit globalen Stilen und
#   einfachen ids, keine Bausteine. Statt sie umzuschreiben, kommt jede
#   fertige Seite in einen eigenen Shadow Root: Stile und ids bleiben dort,
#   das Seitenskript läuft mit einem Ersatz-``document``. An den beiden Tools
#   ändert sich dafür nichts; der Bau nimmt ihre veröffentlichte Seite.
#
#   Seit 0.7.0 zeigt GUIDES_JS die Übersicht der Guide-Seite (sc-guides) auf
#   dieselbe Weise und öffnet einen gewählten Guide in einem Leserahmen. Die
#   Guides sind Dokumente, keine Werkzeuge; ein Rahmen auf die veröffentlichte
#   Seite ist für sie die passende Form. Damit sind alle Bereiche eingezogen.
#
#   Seit 0.9.0 sind Routen und Waren des Handels-Planers, der Screenshot-
#   Auswerter (Unterreiter von Fracht) und der Schiffskauf (Unterreiter von
#   Flotte) eingezogen: jeweils als ganzes Werkzeug in einer eigenen Datei
#   bereiche/tool_<key>.js, die die Hülle beim ersten Öffnen lädt
#   (Cockpit.tool). tool_script() schreibt diese Dateien.
# =============================================================================
"""Area scripts of the cockpit; each becomes its own lazily loaded file under bereiche/."""
from __future__ import annotations

import json

#: Addresses of the tools themselves, for "open in the existing tool". The plain address of each of the
#: five planners forwards to the cockpit; the tool's own page is ``app.html`` next to it.
URL = {
    "schiffskauf": "https://jaegerfeld.github.io/StarCitizen-Schiffskauf-Planer/app.html",
    "handel": "https://jaegerfeld.github.io/StarCitizen-Handels-Planer/app.html",
    "auswerter": "https://jaegerfeld.github.io/StarCitizen-Screenshot-Auswerter/app.html",
    "bauplan": "https://jaegerfeld.github.io/StarCitizen-Bauplan-Planer/app.html",
    "wikelo": "https://jaegerfeld.github.io/StarCitizen-Wikelo-Planer/app.html",
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
    return `<div class="ck-grp"><div class="ck-grph"><b>${k?'📍 '+(first?(first.loc?C.jump('loc',first.loc,k):C.jump('shop',first.shop,k)):esc(k)):T('Ohne Ort','No place')}</b>${sum?`<span>${nf(sum)} aUEC</span>`:''}</div>
      <ul class="ck-ml">${list.map(m=>{const f=m.ship!=null?fleet.find(s=>s.id===m.ship):null;
        const meta=[f?'🚀 '+C.jump('ship',f.id,f.name||f.model):'',m.shop?esc(String(m.shop).split(' - ')[0]):'',m.price?`${nf(m.price*(m.n||1))} aUEC`:''].filter(Boolean).join(' · ');
        return `<li><label><input type="checkbox" data-id="${esc(m.id)}"> <span>${m.n>1?esc(m.n)+' × ':''}${esc(m.text)}</span></label>${meta?`<small>${meta}</small>`:''}</li>`;}).join('')}</ul></div>`;}).join('');}

// Fleet: every ship with what is known about it across the areas.
function flotte(){const fleet=window.SCFleet?SCFleet.read().ships:[], led=read('scha_ledger_v1'), kp=read('scsk_kp'), open=SCData.open();
  if(!fleet.length) return `<p class="ck-pempty">${T('Noch kein Schiff. Unter „Flotte“ wählst du deine Schiffe.','No ship yet. Pick your ships under “Fleet”.')}</p>`;
  const rows=fleet.slice(0,6).map(f=>{const scu=(led&&Array.isArray(led.stock)?led.stock:[]).filter(p=>p&&p.l==='s:'+f.id).reduce((a,p)=>a+(+p.z||0)*(+p.n||0),0);
    const fit=kp&&kp.fit&&kp.fit[f.id]?Object.keys(kp.fit[f.id]).length:0, mk=open.filter(m=>m.ship===f.id).length;
    const bits=[fit?T(`${fit} ${fit===1?'Teil':'Teile'} getauscht`,`${fit} ${fit===1?'part':'parts'} swapped`):'',scu?`${nf(scu)} SCU ${T('an Bord','aboard')}`:'',mk?`☑ ${mk} ${T('Merker',mk===1?'reminder':'reminders')}`:''].filter(Boolean);
    return `<li><b>${C.jump('ship',f.id,f.name||f.model)}</b>${f.name?`<small>${esc(f.model)}</small>`:''}<span>${bits.length?bits.join(' · '):T('Standard, leer','stock, empty')}</span></li>`;}).join('');
  return `<ul class="ck-plist">${rows}</ul>${fleet.length>6?`<p class="ck-pmore">${T(`und ${fleet.length-6} weitere`,`and ${fleet.length-6} more`)}</p>`:''}`;}

// Cargo: totals and the places holding the most.
function fracht(){const led=read('scha_ledger_v1'), stock=(led&&Array.isArray(led.stock)?led.stock:[]).filter(p=>p&&p.n>0);
  const notes=led&&led.notes?Object.keys(led.notes).filter(k=>String(led.notes[k]||'').trim()).length:0;
  if(!stock.length) return `<p class="ck-pempty">${T('Keine Fracht im Logbuch.','No cargo in the ledger.')}${notes?` ${nf(notes)} ${T(notes===1?'Notiz':'Notizen',notes===1?'note':'notes')}.`:''}</p>`;
  const by={}; for(const p of stock) by[p.l]=(by[p.l]||0)+p.z*p.n;
  const total=Object.values(by).reduce((a,b)=>a+b,0), top=Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const name=l=>{if(l[0]==='s'){const s=(led.ships||[]).find(x=>'s:'+x.id===l); return '🚀 '+C.jump('loc',l,s?s.n:'?');} return '📍 '+C.jump('loc',l,l.slice(2).split('|').pop());};
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
  return `<ul class="ck-plist">${list.map(r=>`<li><b>${r.fav?'★ ':''}${C.jump('org',r.org,r.org)}</b><small>${esc(r.rank||'')}${r.next?` → ${esc(r.next)}`:''}</small><span>${r.pct==null?T('höchster Rang','top rank'):'≈ '+r.pct+' %'}</span></li>`).join('')}</ul>
    <p class="ck-pmore">${T('Schätzung, Stand','Estimate, as of')} ${esc(when(d.t))}.</p>`;}

// Important items of the ledger's items view: how many, and the five with the most pieces.
function dinge(){const led=read('scha_ledger_v1'), it=(led&&Array.isArray(led.items)?led.items:[]).filter(x=>x&&x.n&&x.c>0);
  if(!it.length) return `<p class="ck-pempty">${T('Noch kein Gegenstand eingetragen. Unter „Fracht → Gegenstände“ hältst du fest, wo Medaillen, Scrips und Ressourcen liegen.','No item entered yet. Under “Cargo → Items” you note where medals, scrip and resources are.')}</p>`;
  const by={}; for(const x of it){const k=String(x.n).toLowerCase(), g=by[k]||(by[k]={n:x.n,c:0,l:new Set()}); g.c+=+x.c||0; g.l.add(x.l);}
  const all=Object.values(by), places=new Set(it.map(x=>x.l)).size, top=all.sort((a,b)=>b.c-a.c||a.n.localeCompare(b.n)).slice(0,5);
  return `<p class="ck-big">${nf(all.length)} <small>${T(all.length===1?'Gegenstand':'Gegenstände',all.length===1?'item':'items')} ${T('an','at')} ${nf(places)} ${T(places===1?'Ort':'Orten',places===1?'place':'places')}</small></p>
    <ul class="ck-plist">${top.map(g=>`<li><b>${C.jump('item',g.n,g.n)}</b><span>${nf(g.c)} ${T('Stück',g.c===1?'piece':'pieces')} · ${nf(g.l.size)} ${T(g.l.size===1?'Ort':'Orte',g.l.size===1?'place':'places')}</span></li>`).join('')}</ul>
    ${all.length>5?`<p class="ck-pmore">${T(`und ${all.length-5} weitere`,`and ${all.length-5} more`)}</p>`:''}`;}

const panel=(cls,title,body,key,linkTxt)=>`<section class="ck-panel ${cls}"><h2>${esc(title)}</h2>${body}${key?`<a class="ck-plink" href="#/${key}">${esc(linkTxt)} <span aria-hidden="true">→</span></a>`:''}</section>`;
function render(el){const first=!SCData.items().length&&!(window.SCFleet&&SCFleet.read().ships.length)&&!read('scha_ledger_v1');
  el.innerHTML=`<h1>${T('Übersicht','Overview')}</h1>
    <p class="ck-lede">${T('Dein Lagebild: was zu erledigen ist, wie es um Flotte und Fracht steht, und wo du zuletzt warst.','Your status board: what there is to do, how fleet and cargo stand, and where you last were.')}</p>
    ${first?`<p class="ck-note">${T('Hier steht noch nichts von dir. Wähl unter „Flotte“ deine Schiffe oder leg rechts einen ersten Merker an. Online teilt das Cockpit die Daten mit den bisherigen Tools.','Nothing of yours is here yet. Pick your ships under “Fleet” or add a first reminder on the right. Online the cockpit shares its data with the existing tools.')}</p><br>`:''}
    <div class="ck-board">
      ${panel('ck-ptodo',T('Zu erledigen','To do')+(SCData.open().length?` (${SCData.open().length})`:''),todo())}
      ${panel('',T('Flotte','Fleet'),flotte(),'flotte',T('Zur Flotte','To the fleet'))}
      ${panel('',T('Fracht','Cargo'),fracht(),'fracht',T('Zum Logbuch','To the ledger'))}
      ${panel('',T('Gegenstände','Items'),dinge(),'fracht/items',T('Zu den Gegenständen','To the items'))}
      ${panel('ck-psess',T('Letzte Sitzung','Last session'),sitzung(),'pilot',T('Zu den Sitzungen','To the sessions'))}
      ${panel('',T('Ruf','Reputation'),ruf(),'pilot',T('Zum Ruf','To the reputation'))}
      ${panel('',T('Werkstatt','Workshop'),`<p class="ck-pempty">${T('Baupläne planen und den Tauschhandel bei Wikelo verfolgen.','Plan blueprints and track the trade with Wikelo.')}</p>`,'werkstatt',T('Zur Werkstatt','To the workshop'))}
      ${panel('','Guides',`<p class="ck-pempty">${T('Flyer und Karten zum Lesen und Ausdrucken.','Flyers and maps to read and to print.')}</p>`,'guides',T('Zu den Guides','To the guides'))}
    </div>`;
  // Tick a reminder; the board is drawn again by the change, so focus goes to the next open one.
  el.querySelector('.ck-board').addEventListener('change',e=>{const c=e.target.closest('input[data-id]'); if(!c) return;
    SCData.toggle(c.dataset.id,true); (document.querySelector('#ck-main .ck-ptodo input[data-id]')||document.querySelector('#ck-main h1'))?.focus({preventScroll:true});});
  // The session panel's link opens the sessions tab of the pilot. Names are jump points (Cockpit.jump).
  el.querySelector('.ck-board').addEventListener('click',e=>{if(e.target.closest('.ck-psess .ck-plink')) C.intent={tab:'sessions'};});}
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
/* ---------- workshop: fallback when the two planners could not be built ---------- */
Cockpit.register('werkstatt',{render(el){Cockpit.placeholder(el,{title:['Werkstatt','Workshop'],
    lede:['Baupläne und der Tauschhandel bei Wikelo: was du brauchst, was du hast, was noch fehlt.','Blueprints and the trade with Wikelo: what you need, what you have, what is still missing.'],
    tools:[{ico:'🛠️',name:['Bauplan-Planer','Blueprint planner'],what:['Baupläne wählen, Material und Bestand gegenrechnen.','Pick blueprints, set material against stock.'],url:'__bauplan__'},
      {ico:'🧮',name:['Wikelo-Planer','Wikelo planner'],what:['Wikelo-Tauschgeschäfte planen und den Fortschritt verfolgen.','Plan Wikelo trades and track the progress.'],url:'__wikelo__'}]});}});
""",
    "guides": r"""
/* ---------- guides: fallback when the guide index could not be built ---------- */
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
  <p class="ck-lede"><span class="de">Deine Schiffe und ihre Bestückung. „Schiffe …“ öffnet die Liste aller Schiffe und deine Flotte; die Einkaufsliste unten kannst du als Merker übernehmen. Unter „Schiffskauf“ stehen Preise und Standorte kaufbarer Schiffe.</span><span class="en">Your ships and their loadouts. “Ships …” opens the list of all ships and your fleet; you can take the shopping list at the bottom over as reminders.</span></p>`;
// Sub-tabs: the planner itself, and the ship purchase planner as a whole tool (loaded on first use).
const TABS=`<div class="ck-subtabs" role="tablist" aria-label="Flotte / Fleet">
  <button type="button" role="tab" data-t="kp"><span class="de">Meine Schiffe</span><span class="en">My ships</span></button>
  <button type="button" role="tab" data-t="schiffskauf"><span class="de">Schiffskauf</span><span class="en">Ship purchase</span></button></div>`;
const PANES={kp:null,schiffskauf:{de:'Schiffskauf',en:'Ship purchase',url:'__schiffskauf__'}};
let pane='kp';
function show(p){pane=p in PANES?p:'kp';
  node.querySelectorAll('[data-pane]').forEach(h=>{h.hidden=h.dataset.pane!==pane;});
  node.querySelectorAll('.ck-subtabs [data-t]').forEach(x=>x.setAttribute('aria-selected',String(x.dataset.t===pane)));
  if(PANES[pane]) Cockpit.tool(node.querySelector(`[data-pane="${pane}"]`),pane,PANES[pane]);}
// Storage helpers the planner expects from its page.
function load(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch(e){return null;}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function boot(){
/*KP_JS*/
}
function start(el){
  const st=document.createElement('style'); st.textContent=/*KP_CSS*/''+CSS_HOST; document.head.appendChild(st);
  node=document.createElement('div'); node.className='ck-kp'; node.innerHTML=HEAD+TABS+'<div data-pane="kp">'+/*KP_HTML*/''+'</div><div data-pane="schiffskauf" hidden></div>';
  el.replaceChildren(node);
  node.querySelector('.ck-subtabs').addEventListener('click',e=>{const x=e.target.closest('[data-t]'); if(x) show(x.dataset.t);});
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
Cockpit.register('flotte',{render(el){if(!node) start(el); else if(node.parentNode!==el) el.replaceChildren(node);
  const it=Cockpit.intent; if(it&&it.pane){pane=it.pane; Cockpit.intent=null;}
  // A jump from a ship's name: open that ship in the planner; ships without a top view only open the fleet.
  if(it&&it.ship!=null){Cockpit.intent=null; pane='kp';
    if(!(window.KPX&&KPX.open(it.ship))) Cockpit.toast(Cockpit.T('Für dieses Schiff gibt es hier noch keine Draufsicht. Unter „Schiffe …“ steht es in deiner Flotte.','There is no top view for this ship here yet. It is listed in your fleet under “Ships …”.'));}
  show(pane);}});
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
  <p class="ck-lede"><span class="de">Dein Fracht-Logbuch: was wo liegt, Notizen je Ort und Schiff, und was dort zu erledigen ist. Unter „Gegenstände“ hältst du fest, wo Medaillen, Scrips und Ressourcen liegen. Kaufmerker aus der Flotte erscheinen am Ort ihres Händlers. Daneben: Routen und Waren, und der Auswerter für Konsolen-Screenshots.</span><span class="en">Your cargo ledger: what is where, notes per place and ship, and what there is to do. Under “Items” you note where medals, scrip and resources are. Purchase reminders from the fleet appear at the place of their shop.</span></p>`;
// Sub-tabs: the ledger itself; routes and commodities and the screenshot reader as whole tools (loaded on first use).
const TABS=`<div class="ck-subtabs" role="tablist" aria-label="Fracht / Cargo">
  <button type="button" role="tab" data-t="lb"><span class="de">Logbuch</span><span class="en">Ledger</span></button>
  <button type="button" role="tab" data-t="items"><span class="de">Gegenstände</span><span class="en">Items</span></button>
  <button type="button" role="tab" data-t="handel"><span class="de">Routen &amp; Waren</span><span class="en">Routes &amp; commodities</span></button>
  <button type="button" role="tab" data-t="auswerter"><span class="de">Auswerter</span><span class="en">Screenshot reader</span></button></div>`;
const PANES={lb:null,items:null,handel:{de:'Routen & Waren',en:'Routes & commodities',url:'__handel__'},
  auswerter:{de:'Auswerter',en:'Screenshot reader',url:'__auswerter__'}};
let pane='lb';
// "Gegenstände" is the ledger's second view (important items); it lives in the ledger's own pane.
const marks=()=>node.querySelectorAll('.ck-subtabs [data-t]').forEach(x=>x.setAttribute('aria-selected',String(x.dataset.t===pane)));
function show(p){pane=p in PANES?p:'lb'; const host=pane==='items'?'lb':pane;
  node.querySelectorAll('[data-pane]').forEach(h=>{h.hidden=h.dataset.pane!==host;});
  marks();
  if(host==='lb'&&LBX&&LBX.mode) LBX.mode(pane==='items'?'items':'cargo');
  if(PANES[pane]) Cockpit.tool(node.querySelector(`[data-pane="${pane}"]`),pane,PANES[pane]);}
// A ledger sent with "To the phone": decode it and hand it to the ledger (it asks before replacing a state).
function recv(code){const bad=()=>Cockpit.toast(Cockpit.T('Der Link ist unvollständig oder beschädigt – bitte am PC neu erzeugen.','The link is incomplete or damaged – please create it again on the PC.'));
  if(typeof HY==='undefined'){bad(); return;}
  HY._dec(code).then(d=>{try{LBX.fromHandy(d);}catch(e){bad();}},bad);}
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
  .ck-lb #view-ledger .lb-mode{display:none}
  .ck-lb.midw #view-ledger .lb-grid{grid-template-columns:210px minmax(0,1fr) 230px}
  .ck-lb.narrow #view-ledger .lb-grid{grid-template-columns:minmax(0,1fr)}
  .ck-lb.narrow #view-ledger .lb-mid{order:-1}`;
function start(el){
  const st=document.createElement('style'); st.textContent=/*LB_CSS*/''+CSS_HOST; document.head.appendChild(st);
  node=document.createElement('div'); node.className='ck-lb'; node.innerHTML=HEAD+TABS+'<div data-pane="lb">'+/*LB_HTML*/''+'</div><div data-pane="handel" hidden></div><div data-pane="auswerter" hidden></div>';
  el.replaceChildren(node);
  node.querySelector('#view-ledger').classList.remove('hide');
  node.querySelector('.ck-subtabs').addEventListener('click',e=>{const x=e.target.closest('[data-t]'); if(x) show(x.dataset.t);});
  LBX=boot();
  // The ledger changed its view itself (a jump between cargo and items): the sub-tabs follow.
  node.addEventListener('lb-mode',e=>{const want=e.detail==='items'?'items':'lb'; if((pane==='lb'||pane==='items')&&pane!==want){pane=want; marks();}});
  new ResizeObserver(()=>{const w=node.clientWidth; if(!w) return; node.classList.toggle('narrow',w<720); node.classList.toggle('midw',w<980);}).observe(node);
}
// Every draw (language, reminders, fleet) takes over fleet changes and redraws the ledger.
Cockpit.register('fracht',{render(el){if(!node) start(el); else if(node.parentNode!==el) el.replaceChildren(node);
  if(!LBX){show(pane); return;}
  // A jump from the overview ("In the ledger"): select that place, found by its id or by the shop text.
  // A jump from an item's name opens the items view filtered to that name.
  let find=null;
  const it=Cockpit.intent; if(it){Cockpit.intent=null; if(it.pane) pane=it.pane;
    if(it.handy&&it.handy.kind==='lb'){pane='lb'; recv(it.handy.code);}
    const loc=it.loc||(LBX.shopPlace?LBX.shopPlace(it.shop):null); if(loc){pane='lb'; LBX.openLoc(loc);}
    if(it.item!=null){pane='items'; find=it.item;}}
  show(pane); if(find!=null&&LBX.findItem) LBX.findItem(find); if(LBX.sync) LBX.sync(); LBX.render();}});
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
  // "To the phone" needs the phone module (HY) the cockpit page carries.
  const h=node.querySelector('#rf-handy'); if(h) h.hidden=typeof HY==='undefined';
  X=boot();
  node.querySelector('.ck-subtabs').addEventListener('click',e=>{const b=e.target.closest('[data-t]'); if(b) show(b.dataset.t);});
  node.addEventListener('click',summary); node.addEventListener('change',summary);
}
Cockpit.register('pilot',{render(el){if(!node) start(el); else if(node.parentNode!==el) el.replaceChildren(node);
  const it=Cockpit.intent; if(it&&it.tab){tab=it.tab; Cockpit.intent=null;}
  // A reputation state sent with "To the phone": the tab shows it as the state from the PC.
  if(it&&it.handy&&it.handy.kind==='ruf'){tab='rep'; Cockpit.intent=null; const bad=()=>Cockpit.toast(Cockpit.T('Der Link ist unvollständig oder beschädigt – bitte am PC neu erzeugen.','The link is incomplete or damaged – please create it again on the PC.'));
    if(typeof HY==='undefined') bad(); else HY._dec(it.handy.code).then(d=>{try{X.RF.fromHandy(d); summary();}catch(e){bad();}},bad);}
  show(tab);
  // A jump from an organisation's name: bring its card into view and mark it for a moment.
  if(it&&it.org){Cockpit.intent=null; requestAnimationFrame(()=>{const c=[...node.querySelectorAll('#view-rep [data-org]')].find(x=>x.dataset.org===it.org);
    if(!c) return; const g=c.closest('details'); if(g) g.open=true; c.scrollIntoView({block:'center'}); c.classList.add('ck-hit'); setTimeout(()=>c.classList.remove('ck-hit'),2200);});}}});
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


#: Workshop area with the blueprint planner and the Wikelo planner. Both are whole pages of their own
#: (one template each, with global styles and plain ids), not panels. Each one is therefore mounted from
#: its finished page into its own shadow root: styles and ids stay inside, and the page script runs with
#: a stand-in ``document`` that points at that root. Nothing in the two tools has to change for this.
WERKSTATT_JS = r"""
/* ---------- workshop: blueprint planner and Wikelo planner, each in its own shadow root ---------- */
(function(){
const C=Cockpit;
// Per tool: styles (with :root/html/body mapped to .sc-root), body markup, attributes of its <html>, and
// its page script as a function of the stand-in document.
const TOOLS={
/*TOOLS*/
};
// Inside the cockpit the tool's own title, language and theme switches and its links to the other tools
// are not needed; its action row (manual, what's new, tool actions) stays.
const EXTRA=`
  .sc-root{background:transparent!important;min-height:0!important;overflow:visible!important}
  .hazard,.fh .fh-eyebrow,.fh .fh-title,.fh .fh-lede,.fh .fh-navd,.fh .fh-seg,.fh #themeBtn{display:none!important}
  .fh{padding:0 0 6px!important} .fh .fh-actions{margin-top:0!important}
  .wrap,.fhwrap,main{max-width:none!important;padding-left:0!important;padding-right:0!important}`;
let node=null, tab='bauplan';
const M={};
const html=document.documentElement;
// Stand-in for `document` inside a tool: lookups and listeners go to the shadow root, <html> and <body>
// are the tool's root element, everything else is the real document.
function standIn(root,el){return {
  getElementById:id=>root.getElementById(id), querySelector:s=>root.querySelector(s), querySelectorAll:s=>root.querySelectorAll(s),
  addEventListener:(t,f,o)=>root.addEventListener(t,f,o), removeEventListener:(t,f,o)=>root.removeEventListener(t,f,o),
  createElement:t=>document.createElement(t), createElementNS:(n,t)=>document.createElementNS(n,t),
  createTextNode:t=>document.createTextNode(t), createDocumentFragment:()=>document.createDocumentFragment(),
  get documentElement(){return el;}, get body(){return el;}, get head(){return document.head;},
  get activeElement(){return root.activeElement;}, readyState:'complete',
  get title(){return document.title;}, set title(v){}, get hidden(){return document.hidden;}, get visibilityState(){return document.visibilityState;}};}
// The tool follows the cockpit: theme as an attribute on its root, language through its own switch
// (so its script redraws and remembers the language as usual).
function follow(key){const m=M[key]; if(!m||m.failed) return;
  m.el.setAttribute('data-theme',html.getAttribute('data-theme')||'dark');
  const want=C.lang(), cur=(m.el.getAttribute('data-lang')||m.el.getAttribute('lang')||'de').slice(0,2);
  if(cur!==want){const b=m.root.querySelector(`.fh-seg [data-lang="${want}"]`); if(b) b.click();}}
function mount(key){const t=TOOLS[key], host=node.querySelector(`[data-tool="${key}"]`), root=host.attachShadow({mode:'open'});
  const st=document.createElement('style'); st.textContent=t.css+EXTRA; root.appendChild(st);
  const el=document.createElement('div'); el.className='sc-root'; for(const k in t.attrs) el.setAttribute(k,t.attrs[k]);
  el.setAttribute('data-theme',html.getAttribute('data-theme')||'dark'); el.innerHTML=t.html; root.appendChild(el);
  M[key]={root,el};
  try{t.boot(standIn(root,el));}
  catch(e){M[key].failed=true; console.error(e);
    el.innerHTML=`<p style="color:var(--muted);padding:20px 4px">${C.esc(C.T('Dieses Werkzeug ließ sich hier nicht starten:','This tool could not be started here:'))} ${C.esc(e.message)}. <a href="${C.esc(t.url)}" target="_blank" rel="noopener" style="color:var(--accent2)">${C.esc(C.T('Im bisherigen Tool öffnen ↗','Open in the existing tool ↗'))}</a></p>`;}
  follow(key);}
function show(k){tab=TOOLS[k]?k:'bauplan';
  node.querySelectorAll('[data-tool]').forEach(h=>{h.hidden=h.dataset.tool!==tab;});
  node.querySelectorAll('.ck-subtabs [data-t]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.t===tab)));
  if(!M[tab]) mount(tab); else follow(tab);}
function start(el){
  node=document.createElement('div'); node.className='ck-werk';
  node.innerHTML=`<h1><span class="de">Werkstatt</span><span class="en">Workshop</span></h1>
    <p class="ck-lede"><span class="de">Baupläne und der Tauschhandel bei Wikelo: was du brauchst, was du hast, was noch fehlt.</span><span class="en">Blueprints and the trade with Wikelo: what you need, what you have, what is still missing.</span></p>
    <div class="ck-subtabs" role="tablist" aria-label="Werkstatt / Workshop">
      <button type="button" role="tab" data-t="bauplan"><span class="de">Baupläne</span><span class="en">Blueprints</span></button>
      <button type="button" role="tab" data-t="wikelo">Wikelo</button></div>
    <div data-tool="bauplan"></div><div data-tool="wikelo" hidden></div>`;
  el.replaceChildren(node);
  node.querySelector('.ck-subtabs').addEventListener('click',e=>{const b=e.target.closest('[data-t]'); if(b) show(b.dataset.t);});
  // The theme button of the cockpit does not redraw the areas; follow the attribute directly.
  new MutationObserver(()=>{for(const k in M) follow(k);}).observe(html,{attributes:true,attributeFilter:['data-theme']});
}
Cockpit.register('werkstatt',{render(el){if(!node) start(el); else if(node.parentNode!==el) el.replaceChildren(node);
  // A jump names the tool as {tool}; an address "#/werkstatt/<tool>" arrives as {pane}.
  const it=Cockpit.intent; if(it&&(it.tool||it.pane)){tab=it.tool||it.pane; Cockpit.intent=null;}
  show(tab); for(const k in M) follow(k);}});
})();
"""


def werkstatt_script(tools: dict[str, dict]) -> str:
    """Return the workshop area script with the given tool pages built in.

    Args:
        tools: Tool key -> ``{"css", "html", "attrs", "js", "url"}`` as produced by the build.

    Returns:
        JavaScript source of ``bereiche/werkstatt.js``.

    Raises:
        ValueError: If the template mark is missing.
    """
    dump = lambda v: json.dumps(v, ensure_ascii=False)  # noqa: E731
    parts = [f"{key}:{{css:{dump(t['css'])},html:{dump(t['html'])},attrs:{dump(t['attrs'])},url:{dump(t['url'])},\n"
             f"boot:function(document){{\n{t['js']}\n}}}}" for key, t in tools.items()]
    if WERKSTATT_JS.count("/*TOOLS*/") != 1:
        raise ValueError("Marke /*TOOLS*/ fehlt in der Werkstatt-Vorlage")
    return WERKSTATT_JS.replace("/*TOOLS*/", ",\n".join(parts)).strip() + "\n"


def tool_script(key: str, tool: dict) -> str:
    """Return the script of one whole tool; the shell loads it on first use and mounts it in a shadow root.

    Args:
        key: Tool key (file ``bereiche/tool_<key>.js``).
        tool: ``{"css", "html", "attrs", "js", "url", "ext"}`` as produced by the build.

    Returns:
        JavaScript source that puts the tool into ``Cockpit.TOOLS``.
    """
    dump = lambda v: json.dumps(v, ensure_ascii=False)  # noqa: E731
    return (f"/* ---------- whole tool for the cockpit: {key} ---------- */\n"
            f"Cockpit.TOOLS[{dump(key)}]={{css:{dump(tool['css'])},html:{dump(tool['html'])},attrs:{dump(tool['attrs'])},"
            f"url:{dump(tool['url'])},ext:{dump(tool.get('ext', []))},\n"
            f"boot:function(document,location,history){{\n{tool['js']}\n}}}};\n")


#: Guides area: the index of the guide site in a shadow root (its cards, in its own styles), and a reader
#: that shows a chosen guide inside the cockpit. Guides are documents, so the reader is a frame on the
#: published guide page; flyers and PDFs open in a new tab.
GUIDES_JS = r"""
/* ---------- guides: index of the guide site and a reader (source: sc-guides) ---------- */
(function(){
const C=Cockpit, T=C.T, html=document.documentElement;
const PAGE={css:/*CSS*/'',html:/*HTML*/'',attrs:/*ATTRS*/{},url:/*URL*/''};
// The index's own header (title, language and theme switches) is replaced by the cockpit's.
const EXTRA=`.sc-root{background:transparent!important;min-height:0!important}
  header,.hazard{display:none!important} .wrap,main{max-width:none!important;padding-left:0!important;padding-right:0!important}`;
let node=null, el=null, open=null;
// The index follows language and theme through the attributes its styles look at.
function follow(){if(!el) return; el.setAttribute('data-theme',html.getAttribute('data-theme')||'dark');
  if(C.lang()==='en'){el.setAttribute('data-lang','en'); el.setAttribute('lang','en');} else {el.removeAttribute('data-lang'); el.setAttribute('lang','de');}}
// Reader: the chosen guide in a frame, with the way back and the way out next to its title.
function reader(){const r=node.querySelector('.ck-reader'), idx=node.querySelector('[data-idx]');
  idx.hidden=!!open; r.hidden=!open; if(!open){r.innerHTML=''; return;}
  if(r.dataset.url!==open.url){r.dataset.url=open.url;
    r.innerHTML=`<div class="ck-readbar"><button type="button" class="btn" data-back>← <span class="de">Alle Guides</span><span class="en">All guides</span></button>
      <b></b><a class="btn" target="_blank" rel="noopener"><span class="de">In neuem Tab</span><span class="en">In a new tab</span> <span aria-hidden="true">↗</span></a></div>
      <iframe referrerpolicy="no-referrer"></iframe>`;
    r.querySelector('b').textContent=open.title; r.querySelector('a').href=open.url;
    const f=r.querySelector('iframe'); f.title=open.title; f.src=open.url;}}
function start(host){
  node=document.createElement('div'); node.className='ck-guides';
  node.innerHTML=`<h1>Guides</h1>
    <p class="ck-lede"><span class="de">Feldhandbücher und Flyer. Ein Klick auf eine Karte öffnet den Guide hier; Flyer und PDFs öffnen in einem neuen Tab.</span><span class="en">Field handbooks and flyers. A click on a card opens the guide here; flyers and PDFs open in a new tab.</span></p>
    <div data-idx></div><div class="ck-reader" hidden></div>`;
  host.replaceChildren(node);
  const root=node.querySelector('[data-idx]').attachShadow({mode:'open'});
  const st=document.createElement('style'); st.textContent=PAGE.css+EXTRA; root.appendChild(st);
  el=document.createElement('div'); el.className='sc-root'; for(const k in PAGE.attrs) el.setAttribute(k,PAGE.attrs[k]);
  el.innerHTML=PAGE.html; root.appendChild(el);
  // The index also lists the planners; inside the cockpit they are the areas of the sidebar.
  for(const h of el.querySelectorAll('h2')) if(/Planer|Planners|Tools/.test(h.textContent)){h.hidden=true; if(h.nextElementSibling) h.nextElementSibling.hidden=true;}
  // Guide pages open in the reader; everything else (flyers, PDFs, other sites) leaves in a new tab.
  root.addEventListener('click',e=>{const a=e.target.closest('a[href]'); if(!a) return;
    const u=a.href; if(/^https:\/\/jaegerfeld\.github\.io\/sc-guides\/[^/?#]+\.html$/.test(u)){e.preventDefault();
      open={url:u,title:(a.querySelector('h3')||a).textContent.trim()}; reader(); node.querySelector('[data-back]').focus(); window.scrollTo({top:0});}
    else {a.target='_blank'; a.rel='noopener';}});
  node.querySelector('.ck-reader').addEventListener('click',e=>{if(e.target.closest('[data-back]')){open=null; reader(); window.scrollTo({top:0});}});
  new MutationObserver(follow).observe(html,{attributes:true,attributeFilter:['data-theme']});
}
Cockpit.register('guides',{render(host){if(!node) start(host); else if(node.parentNode!==host) host.replaceChildren(node);
  follow(); reader();}});
})();
"""


def guides_script(page: dict) -> str:
    """Return the guides area script with the index page of the guide site built in.

    Args:
        page: ``{"css", "html", "attrs", "url"}`` of the index page, as produced by the build.

    Returns:
        JavaScript source of ``bereiche/guides.js``.

    Raises:
        ValueError: If a mark of the template is missing.
    """
    js = GUIDES_JS
    for mark, key in [("/*CSS*/''", "css"), ("/*HTML*/''", "html"), ("/*ATTRS*/{}", "attrs"), ("/*URL*/''", "url")]:
        if js.count(mark) != 1:
            raise ValueError(f"Marke {mark} fehlt in der Guides-Vorlage")
        js = js.replace(mark, json.dumps(page[key], ensure_ascii=False))
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
