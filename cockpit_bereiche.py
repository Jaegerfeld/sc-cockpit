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
#   Stand Gerüst (0.1.0): Die Übersicht zeigt je Bereich eine Kachel mit einer
#   Zeile Stand aus den gemeinsamen Daten. Flotte, Fracht, Werkstatt, Guides
#   und Pilot sind noch nicht eingezogen; ihre Seiten zeigen, was das Cockpit
#   schon weiß, und führen in das bisherige Tool. So ist kein Bereich eine
#   Sackgasse, solange der Umzug läuft.
#
#   Reihenfolge des Umzugs: Flotte mit Komponenten und Merkern, dann Fracht,
#   Übersicht als Lagebild, danach Werkstatt, Pilot und Guides.
# =============================================================================
"""Area scripts of the cockpit; each becomes its own lazily loaded file under bereiche/."""
from __future__ import annotations

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
""",
    "flotte": r"""
/* ---------- fleet (not moved in yet) ---------- */
Cockpit.register('flotte',{render(el){const C=Cockpit, s=SCData.summary();
  C.placeholder(el,{title:['Flotte','Fleet'],
    lede:['Deine Schiffe mit eigenen Namen, ihre Bestückung im Komponenten-Planer und der Schiffskauf. Dieser Bereich zieht als erster ins Cockpit ein.','Your ships with their own names, their loadout in the component planner, and ship purchase. This area is the first to move into the cockpit.'],
    facts:[C.fact(s.ships,s.ships===1?'Schiff in deiner Flotte':'Schiffe in deiner Flotte',s.ships===1?'ship in your fleet':'ships in your fleet')],
    tools:[{ico:'🚀',name:['Schiffskauf-Planer','Ship purchase planner'],what:['Reiter „Komponenten“: Schiffe ansehen, Teile tauschen, Einkaufsliste. Dazu Preise und Standorte kaufbarer Schiffe.','“Components” tab: view ships, swap parts, shopping list. Plus prices and locations of buyable ships.'],url:'__schiffskauf__'}],
    note:['Die Flotte ist schon gemeinsam: Schiffe, die du im Schiffskauf-Planer oder im Fracht-Logbuch anlegst, zählt das Cockpit online mit.','The fleet is already shared: online the cockpit counts the ships you add in the ship purchase planner or the cargo ledger.']});}});
""",
    "fracht": r"""
/* ---------- cargo (not moved in yet) ---------- */
Cockpit.register('fracht',{render(el){const C=Cockpit, s=SCData.summary();
  C.placeholder(el,{title:['Fracht','Cargo'],
    lede:['Das Fracht-Logbuch mit Notizen je Ort und Schiff, Handelsrouten, Warenlisten und der Screenshot-Auswerter für Handelskonsolen.','The cargo ledger with notes per place and ship, trade routes, commodity lists and the screenshot reader for trade consoles.'],
    facts:[C.fact(s.scu,'SCU im Logbuch','SCU in the ledger'),C.fact(s.places,s.places===1?'Ort mit Fracht':'Orte mit Fracht',s.places===1?'place with cargo':'places with cargo'),
      C.fact(s.notes,s.notes===1?'Notiz':'Notizen',s.notes===1?'note':'notes'),C.fact(s.cargoShips,s.cargoShips===1?'Frachtschiff':'Frachtschiffe',s.cargoShips===1?'cargo ship':'cargo ships')],
    tools:[{ico:'📈',name:['Handels-Planer','Trade planner'],what:['Fracht-Logbuch mit Notizen, Routen, alle Waren, Kauf- und Verkaufsorte.','Cargo ledger with notes, routes, all commodities, buy and sell places.'],url:'__handel__'},
      {ico:'📷',name:['Screenshot-Auswerter','Screenshot reader'],what:['Liest Preise aus Screenshots der Handelskonsolen.','Reads prices from screenshots of the trade consoles.'],url:'__auswerter__'}],
    note:['Das Cockpit liest das Logbuch nur. Buchungen und Notizen schreibst du weiter im Handels-Planer, bis das Logbuch hier eingezogen ist.','The cockpit only reads the ledger. You keep booking and writing notes in the trade planner until the ledger has moved in here.']});}});
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
/* ---------- pilot (not moved in yet) ---------- */
Cockpit.register('pilot',{render(el){Cockpit.placeholder(el,{title:['Pilot','Pilot'],
    lede:['Was an dir als Spieler hängt: der Ruf je Organisation und deine Spielsitzungen mit Shard, Ort, Schiff und Absturz.','What belongs to you as a player: reputation per organisation and your play sessions with shard, place, ship and crash.'],
    tools:[{ico:'📈',name:['Handels-Planer','Trade planner'],what:['Reiter „Ruf“ und „Sitzungen“. Beide lesen deine Spiel-Logs nur auf deinem Rechner.','“Reputation” and “Sessions” tabs. Both read your game logs on your computer only.'],url:'__handel__'}]});}});
""",
}


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
