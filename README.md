# SC Cockpit

[Deutsch](README.de.md) · **English**

One app for my Star Citizen tools: fleet, cargo, workshop, guides and pilot, sharing their data. Plain HTML, no account, no server; all data stays in your browser.

**Online:** https://jaegerfeld.github.io/sc-cockpit/ · **Offline:** [SC_Cockpit_Offline.zip](https://jaegerfeld.github.io/sc-cockpit/SC_Cockpit_Offline.zip) (unpack, open `SC_Cockpit.html`)

## Status

State of version 0.9.0, all six areas have moved in:

- **Sidebar** with the areas Overview, Fleet, Cargo, Workshop, Guides and Pilot. Each area is loaded on first use.
- **Reminder rail** on the right, always visible: add your own reminders, tick them off, remove them.
- **Overview as a status board:** "To do" with all open reminders by place (tick them, jump to the place in the ledger), plus fleet, cargo and the last session read.
- **Fleet has moved in:** component planner with your own fleet; the shopping list can be taken over as reminders, open reminders then follow it by themselves.
- **Cargo has moved in:** cargo ledger with notes; reminders appear at their place, purchase reminders at the place of their shop.
- **Pilot has moved in:** reputation per organisation and play sessions from the game logs (read locally only); the reputation is on the status board as well.
- **Workshop has moved in:** blueprint planner and Wikelo planner as sub-tabs, each in a shielded part of the page.
- **Guides have moved in:** index of all field handbooks and flyers; a guide opens inside the cockpit in a reader frame.
- **As sub-tabs:** routes and commodity lists and the screenshot reader under cargo, ship purchase under fleet. Each is its own file `bereiche/tool_<key>.js`, loaded when first opened.

- **One backup file for everything:** save, load with a before/after comparison, one way back. It carries the data into the offline package or to a second computer.

Next: replace the single pages, "To the phone" in the cockpit.

## The existing tools

| Area | Tool |
|---|---|
| Fleet | [Ship purchase planner](https://github.com/Jaegerfeld/StarCitizen-Schiffskauf-Planer) (with component planner) |
| Cargo, Pilot | [Trade planner](https://github.com/Jaegerfeld/StarCitizen-Handels-Planer) (cargo ledger, routes, reputation, sessions), [Screenshot reader](https://github.com/Jaegerfeld/StarCitizen-Screenshot-Auswerter) |
| Workshop | [Blueprint planner](https://github.com/Jaegerfeld/StarCitizen-Bauplan-Planer), [Wikelo planner](https://github.com/Jaegerfeld/StarCitizen-Wikelo-Planer) |
| Guides | [sc-guides](https://github.com/Jaegerfeld/sc-guides) |

Online all of them live under the same address (`jaegerfeld.github.io`) and therefore share the browser storage. That is how the cockpit sees the fleet and the cargo ledger without any transfer. The offline copy has its own data.

## Build

Standard library only. The fleet area needs the source of the component planner: the repo [StarCitizen-Schiffskauf-Planer](https://github.com/Jaegerfeld/StarCitizen-Schiffskauf-Planer) next to this repo (or its path in `SC_SCHIFFSKAUF`). The cargo area needs the repo [StarCitizen-Handels-Planer](https://github.com/Jaegerfeld/StarCitizen-Handels-Planer) in the same way (`SC_HANDEL`). The workshop takes the published pages of the [blueprint planner](https://github.com/Jaegerfeld/StarCitizen-Bauplan-Planer) and the [Wikelo planner](https://github.com/Jaegerfeld/StarCitizen-Wikelo-Planer) (with `--cache` the built files from the repos next to this one). Routes & commodities and ship purchase are built from the templates of the two repos, without the parts that already live in the cockpit; the screenshot reader is its published page. Without a source or without network the script builds the area as a signpost.

```bash
python cockpit_bauen.py          # writes cockpit/SC_Cockpit.html and cockpit/bereiche/*.js
python cockpit_bauen.py --zip    # also writes SC_Cockpit_Offline.zip
python cockpit_bauen.py --cache  # uses the local caches of the Schiffskauf-Planer instead of Wiki and UEX
```

| File | Purpose |
|---|---|
| `cockpit_seite.py` | Shell: page template, styles, navigation, lazy loading of areas, reminder rail |
| `cockpit_daten.py` | Shared data `SCData`: reminders, read-only view on fleet and cargo ledger |
| `cockpit_sicherung.py` | Backup file `SCBackup`: which storage keys belong to it, collect, check, apply, way back |
| `cockpit_bereiche.py` | The areas; each becomes `bereiche/<key>.js`. The fleet mounts the component planner from the Schiffskauf repo, cargo and pilot the ledger, the reputation and the sessions from the Handels repo, the workshop the blueprint and Wikelo planners in one shadow root each |
| `flotte.py`, `kopfzeile.py`, `sc_design.py` | Shared with the other tools, byte-identical copies |

Areas are loaded with a `<script>` element, not `fetch()`, so the page also runs from a folder on disk.

## Data and privacy

Everything is stored in your browser (`localStorage`): reminders (`sc_merker_v1`), language and theme (`sc_cockpit_ui`), the shared fleet (`sc_flotte_v1`) and the cargo ledger (`scha_ledger_v1`). Plus the loadouts of the component planner (`scsk_kp`), the reputation (`scha_rep_v1`, short state `sc_cockpit_ruf`) and the cache of sessions read (`scha_sessions_cache_v2`). Nothing is sent anywhere. The page loads two fonts from Google Fonts; without a connection it uses system fonts.

## Notes

Developed largely with AI ([Claude Code](https://claude.com/claude-code)). Not affiliated with Cloud Imperium Games; Star Citizen® is their trademark. Licence: BSD-3-Clause, see [LICENSE](LICENSE). Conventions: [CONTRIBUTING.md](CONTRIBUTING.md).
