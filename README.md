# SC Cockpit

[Deutsch](README.de.md) · **English**

One app for my Star Citizen tools: fleet, cargo, workshop, guides and pilot, sharing their data. Plain HTML, no account, no server; all data stays in your browser.

**Online:** https://jaegerfeld.github.io/sc-cockpit/ · **Offline:** [SC_Cockpit_Offline.zip](https://jaegerfeld.github.io/sc-cockpit/SC_Cockpit_Offline.zip) (unpack, open `SC_Cockpit.html`)

## Status

Under construction. State of version 0.3.0:

- **Sidebar** with the areas Overview, Fleet, Cargo, Workshop, Guides and Pilot. Each area is loaded on first use.
- **Reminder rail** on the right, always visible: add your own reminders, tick them off, remove them.
- **Shared data:** the overview shows what the cockpit already knows from the shared fleet and the cargo ledger (ships, SCU, places with cargo, notes).
- **Fleet has moved in:** component planner with your own fleet; the shopping list can be taken over as reminders, open reminders then follow it by themselves.
- **Cargo has moved in:** cargo ledger with notes; reminders appear at their place, purchase reminders at the place of their shop.
- **Other areas as signposts:** workshop, guides and pilot have not moved in yet; their pages lead to the existing tools.

Planned order: overview as a status board, then workshop, pilot and guides, and one backup file for everything.

## The existing tools

| Area | Tool |
|---|---|
| Fleet | [Ship purchase planner](https://github.com/Jaegerfeld/StarCitizen-Schiffskauf-Planer) (with component planner) |
| Cargo, Pilot | [Trade planner](https://github.com/Jaegerfeld/StarCitizen-Handels-Planer) (cargo ledger, routes, reputation, sessions), [Screenshot reader](https://github.com/Jaegerfeld/StarCitizen-Screenshot-Auswerter) |
| Workshop | [Blueprint planner](https://github.com/Jaegerfeld/StarCitizen-Bauplan-Planer), [Wikelo planner](https://github.com/Jaegerfeld/StarCitizen-Wikelo-Planer) |
| Guides | [sc-guides](https://github.com/Jaegerfeld/sc-guides) |

Online all of them live under the same address (`jaegerfeld.github.io`) and therefore share the browser storage. That is how the cockpit sees the fleet and the cargo ledger without any transfer. The offline copy has its own data.

## Build

Standard library only. The fleet area needs the source of the component planner: the repo [StarCitizen-Schiffskauf-Planer](https://github.com/Jaegerfeld/StarCitizen-Schiffskauf-Planer) next to this repo (or its path in `SC_SCHIFFSKAUF`). The cargo area needs the repo [StarCitizen-Handels-Planer](https://github.com/Jaegerfeld/StarCitizen-Handels-Planer) in the same way (`SC_HANDEL`). Without a source or without network the script builds the area as a signpost.

```bash
python cockpit_bauen.py          # writes cockpit/SC_Cockpit.html and cockpit/bereiche/*.js
python cockpit_bauen.py --zip    # also writes SC_Cockpit_Offline.zip
python cockpit_bauen.py --cache  # uses the local caches of the Schiffskauf-Planer instead of Wiki and UEX
```

| File | Purpose |
|---|---|
| `cockpit_seite.py` | Shell: page template, styles, navigation, lazy loading of areas, reminder rail |
| `cockpit_daten.py` | Shared data `SCData`: reminders, read-only view on fleet and cargo ledger |
| `cockpit_bereiche.py` | The areas; each becomes `bereiche/<key>.js`. The fleet mounts the component planner from the Schiffskauf repo, cargo the ledger from the Handels repo |
| `flotte.py`, `kopfzeile.py`, `sc_design.py` | Shared with the other tools, byte-identical copies |

Areas are loaded with a `<script>` element, not `fetch()`, so the page also runs from a folder on disk.

## Data and privacy

Everything is stored in your browser (`localStorage`): reminders (`sc_merker_v1`), language and theme (`sc_cockpit_ui`), the shared fleet (`sc_flotte_v1`) and the cargo ledger (`scha_ledger_v1`). Plus the loadouts of the component planner (`scsk_kp`). Nothing is sent anywhere. The page loads two fonts from Google Fonts; without a connection it uses system fonts.

## Notes

Developed largely with AI ([Claude Code](https://claude.com/claude-code)). Not affiliated with Cloud Imperium Games; Star Citizen® is their trademark. Licence: BSD-3-Clause, see [LICENSE](LICENSE). Conventions: [CONTRIBUTING.md](CONTRIBUTING.md).
