/* ---------- overview: one tile per area with a line of state from the shared data ---------- */
Cockpit.register('uebersicht',{render(el){const C=Cockpit, T=C.T, s=SCData.summary();
  const tile=(key,title,text,factHtml)=>`<a class="ck-tile" href="#/${key}"><h2>${C.esc(title)}</h2><p>${C.esc(text)}</p><div class="ck-fact">${factHtml}</div></a>`;
  const first=!s.ships&&!s.hasLedger&&!s.open&&!s.done;
  el.innerHTML=`<h1>${T('Übersicht','Overview')}</h1>
    <p class="ck-lede">${T('Das Cockpit führt deine Star-Citizen-Werkzeuge zusammen. Die Bereiche ziehen nach und nach ein; bis dahin führt jeder Bereich in das bisherige Tool.','The cockpit brings your Star Citizen tools together. The areas move in one by one; until then every area leads to the existing tool.')}</p>
    ${first?`<p class="ck-note">${T('Hier steht noch nichts von dir. Leg rechts einen ersten Merker an, oder öffne unter „Flotte“ den Schiffskauf-Planer und füg dort deine Schiffe hinzu. Online teilt das Cockpit die Daten mit den bisherigen Tools.','Nothing of yours is here yet. Add a first reminder on the right, or open the ship purchase planner under “Fleet” and add your ships there. Online the cockpit shares its data with the existing tools.')}</p><br>`:''}
    <div class="ck-tiles">
    ${tile('flotte',T('Flotte','Fleet'),T('Meine Schiffe, Komponenten, Schiffskauf','My ships, components, ship purchase'),
      s.ships?C.fact(s.ships,s.ships===1?'Schiff':'Schiffe',s.ships===1?'ship':'ships'):T('Noch kein Schiff angelegt','No ship added yet'))}
    ${tile('fracht',T('Fracht','Cargo'),T('Logbuch mit Notizen, Routen, Waren, Screenshot-Auswerter','Ledger with notes, routes, commodities, screenshot reader'),
      s.posts?`${C.fact(s.scu,'SCU','SCU')} ${T('an','at')} ${C.nf(s.places)} ${T(s.places===1?'Ort':'Orten','place'+(s.places===1?'':'s'))}${s.notes?` · ${C.nf(s.notes)} ${T(s.notes===1?'Notiz':'Notizen','note'+(s.notes===1?'':'s'))}`:''}`
       :s.notes?C.fact(s.notes,s.notes===1?'Notiz':'Notizen',s.notes===1?'note':'notes'):T('Keine Fracht im Logbuch','No cargo in the ledger'))}
    ${tile('werkstatt',T('Werkstatt','Workshop'),T('Baupläne, Wikelo','Blueprints, Wikelo'),T('Noch im bisherigen Tool','Still in the existing tool'))}
    ${tile('guides','Guides',T('Flyer und Karten','Flyers and maps'),T('Noch im bisherigen Tool','Still in the existing tool'))}
    ${tile('pilot','Pilot',T('Ruf, Sitzungen','Reputation, sessions'),T('Noch im bisherigen Tool','Still in the existing tool'))}
    <div class="ck-tile"><h2>${T('Zu erledigen','To do')}</h2><p>${T('Merker aus allen Bereichen, rechts in der Leiste','Reminders from all areas, in the rail on the right')}</p>
      <div class="ck-fact">${s.open?C.fact(s.open,'offen','open'):T('Nichts offen','Nothing open')}${s.done?` · ${C.nf(s.done)} ${T('erledigt','done')}`:''}</div></div>
    </div>`;}});
