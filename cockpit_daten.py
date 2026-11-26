# =============================================================================
# Autor:          Robert Seebauer
# Repository:     https://github.com/Jaegerfeld/sc-cockpit
# KI-Unterstützung: Erstellt mit Unterstützung von Claude (Anthropic)
# Erstellt:       26.11.2026
# Geändert:       26.11.2026
# Lizenz:         BSD-3-Clause (siehe LICENSE)
#
# Fachliche Funktion:
#   Gemeinsame Daten des Cockpits als ``window.SCData``: die Merker (Aufgaben
#   zum Abhaken) und ein lesender Blick auf Flotte und Fracht-Logbuch für die
#   Übersicht. Alles liegt im Browser-Speicher (localStorage), kein Server.
#
#   Merker (Entscheidung C4, 26.11.2026): zwei Arten in einer Liste.
#   „frei“ legt der Spieler selbst an. „auto“ legt ein Bereich an, zuerst der
#   Komponenten-Planer aus seiner Einkaufsliste (Teil, Anzahl, Schiff, Kaufort,
#   Preis). Ändert sich die Quelle, passen sich offene automatische Merker
#   still an; abgehakte bleiben immer, wie sie sind.
#
#   Die Flotte kommt aus flotte.py (Schlüssel ``sc_flotte_v1``), Fracht und
#   Notizen aus dem Fracht-Logbuch des Handels-Planers (``scha_ledger_v1``).
#   Online liegen alle Tools unter derselben Adresse und teilen sich deshalb
#   diesen Speicher schon. Dieses Modul liest das Logbuch nur (für die
#   Übersicht); geschrieben wird es vom Logbuch selbst, das seit 0.3.0 im
#   Bereich Fracht läuft und Änderungen aus anderen Tabs übernimmt.
# =============================================================================
"""Shared cockpit data: reminders ("Merker") plus a read-only view on fleet and cargo ledger."""
from __future__ import annotations

#: Version of the data module; the storage format carries its own version (``v``).
DATEN_VERSION = "1"

#: Shared data API as ``window.SCData``; runs after flotte.py and before the cockpit shell.
DATEN_JS = r"""
/* ===== Shared cockpit data (cockpit_daten.py) ===== */
window.SCData=(function(){
  // Reminders: {v:1, items:[{id, art:'frei'|'auto', text, done, t, td, src, key, loc, shop, ship, n, price}], saved}.
  // src = area that owns an automatic reminder (e.g. 'kp'), key = its identity inside that area,
  // loc = place ('p:<id>' as in the cargo ledger), shop = shop name as text (UEX terminal, until places are
  // matched), ship = fleet id, n = count, price = aUEC each.
  // Blocked storage: reads give an empty list, writes do nothing.
  const KEY='sc_merker_v1', LEDGER='scha_ledger_v1';
  function read(){try{const o=JSON.parse(localStorage.getItem(KEY)||'null');
    if(o&&o.v===1&&Array.isArray(o.items)) return {v:1,items:o.items.filter(m=>m&&m.id&&typeof m.text==='string')};}catch(e){}
    return {v:1,items:[]};}
  function write(o){o.saved=new Date().toISOString(); try{localStorage.setItem(KEY,JSON.stringify(o));}catch(e){} fire();}
  const listeners=[];
  function fire(){for(const cb of listeners) try{cb();}catch(e){}}
  // Call cb after every change of the reminders, the fleet or the cargo ledger (this page or another tab).
  function onChange(cb){listeners.push(cb);}
  window.addEventListener('storage',e=>{if(e.key===KEY||e.key===LEDGER||e.key==='sc_flotte_v1'||e.key===null) fire();});
  const newId=()=>'m'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  const now=()=>new Date().toISOString();

  /* ---------- reminders ---------- */
  // Add a free reminder; returns its id, or null for empty text.
  function add(text,extra){const t=String(text||'').trim().slice(0,200); if(!t) return null;
    const o=read(), m={id:newId(),art:'frei',text:t,done:false,t:now(),...(extra||{})}; o.items.push(m); write(o); return m.id;}
  // Tick or untick a reminder.
  function toggle(id,done){const o=read(), m=o.items.find(x=>x.id===id); if(!m) return;
    m.done=done===undefined?!m.done:!!done; if(m.done) m.td=now(); else delete m.td; write(o);}
  // Remove a reminder; returns it so the caller can offer undo (restore).
  function remove(id){const o=read(), i=o.items.findIndex(x=>x.id===id); if(i<0) return null;
    const [m]=o.items.splice(i,1); write(o); return {m,i};}
  // Put a removed reminder back at its old position.
  function restore(r){if(!r||!r.m) return; const o=read(); if(o.items.some(x=>x.id===r.m.id)) return;
    o.items.splice(Math.min(r.i,o.items.length),0,r.m); write(o);}
  // Remove all ticked reminders; returns how many.
  function clearDone(){const o=read(), n=o.items.filter(m=>m.done).length; if(!n) return 0;
    o.items=o.items.filter(m=>!m.done); write(o); return n;}
  // Automatic reminders of one source (optionally of one ship) follow that source: open ones are updated,
  // added or dropped to match `list` ([{key, text, loc, ship, n, price}]); ticked ones are never touched,
  // and a ticked reminder keeps its key from coming back as a new open one.
  function syncAuto(src,ship,list){const o=read(); let ch=false;
    const mine=m=>m.art==='auto'&&m.src===src&&(ship==null||m.ship===ship);
    const want=new Map((list||[]).filter(x=>x&&x.key&&x.text).map(x=>[String(x.key),x]));
    for(const m of o.items.filter(mine)){
      if(m.done){want.delete(m.key); continue;}
      const w=want.get(m.key);
      if(!w){o.items=o.items.filter(x=>x!==m); ch=true; continue;}
      for(const k of ['text','loc','shop','ship','n','price']){
        if(w[k]!==undefined&&m[k]!==w[k]){m[k]=w[k]; ch=true;}
        // A shop or price the source no longer names (part not buyable any more) must not linger.
        else if(w[k]===undefined&&(k==='shop'||k==='price')&&m[k]!==undefined){delete m[k]; ch=true;}}
      want.delete(m.key);}
    for(const w of want.values()){o.items.push({id:newId(),art:'auto',src,key:String(w.key),text:String(w.text).slice(0,200),done:false,t:now(),
      ...(w.loc!==undefined?{loc:w.loc}:{}),...(w.shop!==undefined?{shop:w.shop}:{}),...((w.ship??ship)!=null?{ship:w.ship??ship}:{}),...(w.n!==undefined?{n:w.n}:{}),...(w.price!==undefined?{price:w.price}:{})}); ch=true;}
    if(ch) write(o); return ch;}
  const items=()=>read().items;
  const open=()=>items().filter(m=>!m.done);

  /* ---------- read-only view on fleet and cargo ledger ---------- */
  function ledger(){try{const l=JSON.parse(localStorage.getItem(LEDGER)||'null'); if(l&&l.v===1) return l;}catch(e){} return null;}
  // Short facts for the overview: ships, cargo, notes, reminders.
  function summary(){const l=ledger(), stock=(l&&Array.isArray(l.stock))?l.stock.filter(p=>p&&p.n>0):[];
    const notes=(l&&l.notes&&typeof l.notes==='object')?Object.keys(l.notes).filter(k=>String(l.notes[k]||'').trim()):[];
    const fleet=window.SCFleet?SCFleet.read().ships:[], all=items();
    return {ships:fleet.length, cargoShips:(l&&Array.isArray(l.ships))?l.ships.length:0,
      scu:stock.reduce((a,p)=>a+(+p.z||0)*(+p.n||0),0), posts:stock.length, places:new Set(stock.map(p=>p.l)).size,
      notes:notes.length, open:all.filter(m=>!m.done).length, done:all.filter(m=>m.done).length, hasLedger:!!l};}
  // Tell the listeners about a change made in this page outside this module (e.g. the fleet).
  const touch=fire;
  return {KEY,items,open,add,toggle,remove,restore,clearDone,syncAuto,summary,onChange,touch};
})();
"""
