/* ---------- fleet (not moved in yet) ---------- */
Cockpit.register('flotte',{render(el){const C=Cockpit, s=SCData.summary();
  C.placeholder(el,{title:['Flotte','Fleet'],
    lede:['Deine Schiffe mit eigenen Namen, ihre Bestückung im Komponenten-Planer und der Schiffskauf. Dieser Bereich zieht als erster ins Cockpit ein.','Your ships with their own names, their loadout in the component planner, and ship purchase. This area is the first to move into the cockpit.'],
    facts:[C.fact(s.ships,s.ships===1?'Schiff in deiner Flotte':'Schiffe in deiner Flotte',s.ships===1?'ship in your fleet':'ships in your fleet')],
    tools:[{ico:'🚀',name:['Schiffskauf-Planer','Ship purchase planner'],what:['Reiter „Komponenten“: Schiffe ansehen, Teile tauschen, Einkaufsliste. Dazu Preise und Standorte kaufbarer Schiffe.','“Components” tab: view ships, swap parts, shopping list. Plus prices and locations of buyable ships.'],url:'https://jaegerfeld.github.io/StarCitizen-Schiffskauf-Planer/'}],
    note:['Die Flotte ist schon gemeinsam: Schiffe, die du im Schiffskauf-Planer oder im Fracht-Logbuch anlegst, zählt das Cockpit online mit.','The fleet is already shared: online the cockpit counts the ships you add in the ship purchase planner or the cargo ledger.']});}});
