/* ---------- cargo (not moved in yet) ---------- */
Cockpit.register('fracht',{render(el){const C=Cockpit, s=SCData.summary();
  C.placeholder(el,{title:['Fracht','Cargo'],
    lede:['Das Fracht-Logbuch mit Notizen je Ort und Schiff, Handelsrouten, Warenlisten und der Screenshot-Auswerter für Handelskonsolen.','The cargo ledger with notes per place and ship, trade routes, commodity lists and the screenshot reader for trade consoles.'],
    facts:[C.fact(s.scu,'SCU im Logbuch','SCU in the ledger'),C.fact(s.places,s.places===1?'Ort mit Fracht':'Orte mit Fracht',s.places===1?'place with cargo':'places with cargo'),
      C.fact(s.notes,s.notes===1?'Notiz':'Notizen',s.notes===1?'note':'notes'),C.fact(s.cargoShips,s.cargoShips===1?'Frachtschiff':'Frachtschiffe',s.cargoShips===1?'cargo ship':'cargo ships')],
    tools:[{ico:'📈',name:['Handels-Planer','Trade planner'],what:['Fracht-Logbuch mit Notizen, Routen, alle Waren, Kauf- und Verkaufsorte.','Cargo ledger with notes, routes, all commodities, buy and sell places.'],url:'https://jaegerfeld.github.io/StarCitizen-Handels-Planer/'},
      {ico:'📷',name:['Screenshot-Auswerter','Screenshot reader'],what:['Liest Preise aus Screenshots der Handelskonsolen.','Reads prices from screenshots of the trade consoles.'],url:'https://jaegerfeld.github.io/StarCitizen-Screenshot-Auswerter/'}],
    note:['Das Cockpit liest das Logbuch nur. Buchungen und Notizen schreibst du weiter im Handels-Planer, bis das Logbuch hier eingezogen ist.','The cockpit only reads the ledger. You keep booking and writing notes in the trade planner until the ledger has moved in here.']});}});
