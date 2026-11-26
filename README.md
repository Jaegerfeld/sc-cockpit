# SC Cockpit

[Deutsch](README.de.md) · **English**

One app for my Star Citizen tools: fleet, cargo, workshop, guides and pilot, sharing their data. Plain HTML, no account, no server; all data stays in your browser.

**Online:** https://jaegerfeld.github.io/sc-cockpit/ · **Offline:** [SC_Cockpit_Offline.zip](https://jaegerfeld.github.io/sc-cockpit/SC_Cockpit_Offline.zip) (unpack, open `SC_Cockpit.html`)

## Status

Under construction. Version 0.1.0 is the skeleton:

- **Sidebar** with the areas Overview, Fleet, Cargo, Workshop, Guides and Pilot. Each area is loaded on first use.
- **Reminder rail** on the right, always visible: add your own reminders, tick them off, remove them.
- **Shared data:** the overview shows what the cockpit already knows from the shared fleet and the cargo ledger (ships, SCU, places with cargo, notes).
- **Areas as signposts:** the areas have not moved in yet; their pages lead to the existing tools.

Planned order: fleet with component planner and automatic purchase reminders, cargo ledger, overview as a status board, then workshop, pilot and guides, and one backup file for everything.

## The existing tools

| Area | Tool |
|---|---|
| Fleet | [Ship purchase planner](https://github.com/Jaegerfeld/StarCitizen-Schiffskauf-Planer) (with component planner) |
| Cargo, Pilot | [Trade planner](https://github.com/Jaegerfeld/StarCitizen-Handels-Planer) (cargo ledger, routes, reputation, sessions), [Screenshot reader](https://github.com/Jaegerfeld/StarCitizen-Screenshot-Auswerter) |
| Workshop | [Blueprint planner](https://github.com/Jaegerfeld/StarCitizen-Bauplan-Planer), [Wikelo planner](https://github.com/Jaegerfeld/StarCitizen-Wikelo-Planer) |
| Guides | [sc-guides](https://github.com/Jaegerfeld/sc-guides) |

Online all of them live under the same address (`jaegerfeld.github.io`) and therefore share the browser storage. That is how the cockpit sees the fleet and the cargo ledger without any transfer. The offline copy has its own data.

## Build

Standard library only, no network needed:

```bash
python cockpit_bauen.py          # writes cockpit/SC_Cockpit.html and cockpit/bereiche/*.js
python cockpit_bauen.py --zip    # also writes SC_Cockpit_Offline.zip
```

| File | Purpose |
|---|---|
| `cockpit_seite.py` | Shell: page template, styles, navigation, lazy loading of areas, reminder rail |
| `cockpit_daten.py` | Shared data `SCData`: reminders, read-only view on fleet and cargo ledger |
| `cockpit_bereiche.py` | The areas; each becomes `bereiche/<key>.js` |
| `flotte.py`, `kopfzeile.py`, `sc_design.py` | Shared with the other tools, byte-identical copies |

Areas are loaded with a `<script>` element, not `fetch()`, so the page also runs from a folder on disk.

## Data and privacy

Everything is stored in your browser (`localStorage`): reminders (`sc_merker_v1`), language and theme (`sc_cockpit_ui`), the shared fleet (`sc_flotte_v1`) and, read-only, the cargo ledger (`scha_ledger_v1`). Nothing is sent anywhere. The page loads two fonts from Google Fonts; without a connection it uses system fonts.

## Notes

Developed largely with AI ([Claude Code](https://claude.com/claude-code)). Not affiliated with Cloud Imperium Games; Star Citizen® is their trademark. Licence: BSD-3-Clause, see [LICENSE](LICENSE). Conventions: [CONTRIBUTING.md](CONTRIBUTING.md).
