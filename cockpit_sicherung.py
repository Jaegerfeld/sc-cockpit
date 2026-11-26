# =============================================================================
# Autor:          Robert Seebauer
# Repository:     https://github.com/Jaegerfeld/sc-cockpit
# KI-Unterstützung: Erstellt mit Unterstützung von Claude (Anthropic)
# Erstellt:       26.11.2026
# Geändert:       26.11.2026
# Lizenz:         BSD-3-Clause (siehe LICENSE)
#
# Fachliche Funktion:
#   Die Sicherungsdatei des Cockpits als ``window.SCBackup``: eine JSON-Datei
#   mit allem, was der Spieler in den Bereichen angelegt hat (Entscheidung C5,
#   26.11.2026). Sie trägt die Daten von der Online-Version ins Offline-Paket,
#   auf einen zweiten Rechner oder in einen anderen Browser, denn jede dieser
#   Stellen hat ihren eigenen Browser-Speicher.
#
#   Gesichert wird, was sich nicht neu holen lässt: Flotte, Bestückungen,
#   Merker, Fracht-Logbuch mit Notizen, Ruf-Abgleiche, Auswahl und Bestand der
#   Werkstatt, Merkliste des Schiffskaufs. NICHT gesichert werden
#   Zwischenspeicher (Preisdaten, gelesene Sitzungen – die enthalten Server-
#   Adressen aus den Spiel-Logs und lassen sich neu einlesen) und Sprache,
#   Hell/Dunkel sowie die eingeklappte Leiste, weil die zum Gerät gehören.
#
#   Einlesen ersetzt: Danach steht in jedem gesicherten Schlüssel der Stand der
#   Datei; was die Datei nicht enthält, ist leer. Der Stand davor bleibt als
#   ein Rückweg im Browser liegen (oder wird als Datei gespeichert, wenn der
#   Speicher dafür nicht reicht).
# =============================================================================
"""Backup file of the cockpit: everything the player created, as one JSON file."""
from __future__ import annotations

#: Backup API as ``window.SCBackup``; runs before the cockpit shell.
SICHERUNG_JS = r"""
/* ===== Backup file (cockpit_sicherung.py) ===== */
window.SCBackup=(function(){
  const APP='sc-cockpit-sicherung', PREV='sc_cockpit_vorher';
  // What a backup holds: section -> storage keys of the tool that owns them. Values are kept as the raw
  // strings the tools wrote, so a backup never depends on their inner format.
  const GROUPS=[
    {id:'flotte',de:'Flotte',en:'Fleet',keys:['sc_flotte_v1']},
    {id:'fit',de:'Bestückungen',en:'Loadouts',keys:['scsk_kp']},
    {id:'merker',de:'Merker',en:'Reminders',keys:['sc_merker_v1']},
    {id:'fracht',de:'Fracht-Logbuch mit Notizen',en:'Cargo ledger with notes',keys:['scha_ledger_v1','sc_handel_ship']},
    {id:'ruf',de:'Ruf',en:'Reputation',keys:['scha_rep_v1','scha_rep_hide','scha_rep_gclosed','scha_rep_view','scha_rep_sort','scha_rep_texts','sc_cockpit_ruf']},
    {id:'bauplan',de:'Baupläne',en:'Blueprints',keys:['scbp_sel','scbp_stock','scbp_owned','scbp_ownmeta','scbp_onlysel']},
    {id:'wikelo',de:'Wikelo',en:'Wikelo',keys:['sc_wikelo_inv_v1','sc_wikelo_acq_v1','sc_wikelo_pref_v1']},
    {id:'kauf',de:'Schiffskauf (Merkliste, Filter)',en:'Ship purchase (wish list, filters)',keys:['scsk_state']}];
  const KEYS=GROUPS.flatMap(g=>g.keys);
  const get=k=>{try{return localStorage.getItem(k);}catch(e){return null;}};
  const parse=s=>{try{return JSON.parse(s);}catch(e){return null;}};
  // Everything of this browser that belongs into a backup: {key: raw string}.
  function collect(){const data={}; for(const k of KEYS){const v=get(k); if(v!==null) data[k]=v;} return data;}
  function file(version){return {app:APP,v:1,saved:new Date().toISOString(),cockpit:version||'',data:collect()};}
  // Check a parsed file; returns its data or throws Error('format').
  function check(o){if(!o||o.app!==APP||o.v!==1||!o.data||typeof o.data!=='object') throw new Error('format');
    const data={}; for(const k of KEYS) if(typeof o.data[k]==='string') data[k]=o.data[k]; return data;}
  // What a data set holds, one short fact per section (German, English); empty sections say so.
  function describe(data){const n=(de1,deN,en1,enN)=>c=>[`${c} ${c===1?de1:deN}`,`${c} ${c===1?en1:enN}`];
    const count={
      flotte:d=>{const o=parse(d.sc_flotte_v1), c=o&&Array.isArray(o.ships)?o.ships.length:0; return c?n('Schiff','Schiffe','ship','ships')(c):null;},
      fit:d=>{const o=parse(d.scsk_kp), c=o&&o.fit?Object.keys(o.fit).length:0; return c?n('Schiff mit eigener Bestückung','Schiffe mit eigener Bestückung','ship with its own loadout','ships with their own loadout')(c):null;},
      merker:d=>{const o=parse(d.sc_merker_v1), a=o&&Array.isArray(o.items)?o.items:[]; const op=a.filter(m=>!m.done).length;
        return a.length?[`${op} offen, ${a.length-op} erledigt`,`${op} open, ${a.length-op} done`]:null;},
      fracht:d=>{const o=parse(d.scha_ledger_v1); if(!o) return null; const st=Array.isArray(o.stock)?o.stock:[], scu=st.reduce((a,p)=>a+(+p.z||0)*(+p.n||0),0), nt=o.notes?Object.keys(o.notes).length:0;
        return st.length||nt?[`${scu} SCU in ${st.length} Posten, ${nt} ${nt===1?'Notiz':'Notizen'}`,`${scu} SCU in ${st.length} posts, ${nt} ${nt===1?'note':'notes'}`]:null;},
      ruf:d=>{const o=parse(d.scha_rep_v1), c=o&&o.orgs?Object.values(o.orgs).filter(x=>x&&x.cals&&x.cals.length).length:0; return c?n('Organisation abgeglichen','Organisationen abgeglichen','organisation aligned','organisations aligned')(c):null;},
      bauplan:d=>{const s=parse(d.scbp_sel), c=s?Object.keys(s).length:0, b=parse(d.scbp_stock), cb=b?Object.keys(b).length:0;
        return c||cb?[`${c} gewählt, Bestand zu ${cb} ${cb===1?'Material':'Materialien'}`,`${c} selected, stock of ${cb} ${cb===1?'material':'materials'}`]:null;},
      wikelo:d=>{const o=parse(d.sc_wikelo_inv_v1), c=o?Object.keys(o).length:0, a=parse(d.sc_wikelo_acq_v1), ca=a?(Array.isArray(a)?a.length:Object.keys(a).length):0;
        return c||ca?[`Bestand zu ${c} ${c===1?'Ressource':'Ressourcen'}, ${ca} erworben`,`stock of ${c} ${c===1?'resource':'resources'}, ${ca} acquired`]:null;},
      kauf:d=>d.scsk_state?['vorhanden','present']:null};
    return GROUPS.map(g=>({id:g.id,de:g.de,en:g.en,fact:count[g.id](data)}));}
  // Replace this browser's state with a data set. The state before is kept for one way back; returns
  // 'slot' if it sits in the browser, or the previous state as text if the storage had no room for it
  // (the caller then saves it as a file).
  function apply(data){const before=JSON.stringify({saved:new Date().toISOString(),data:collect()}); let kept='slot';
    try{localStorage.setItem(PREV,before);}catch(e){kept=before;}
    for(const k of KEYS){try{if(typeof data[k]==='string') localStorage.setItem(k,data[k]); else localStorage.removeItem(k);}catch(e){throw new Error('storage');}}
    return kept;}
  // The state kept before the last import, or null.
  function previous(){const o=parse(get(PREV)); return o&&o.data?o:null;}
  function restore(){const p=previous(); if(!p) return false;
    for(const k of KEYS){try{if(typeof p.data[k]==='string') localStorage.setItem(k,p.data[k]); else localStorage.removeItem(k);}catch(e){return false;}}
    try{localStorage.removeItem(PREV);}catch(e){} return true;}
  return {APP,GROUPS,KEYS,collect,file,check,describe,apply,previous,restore};
})();
"""
