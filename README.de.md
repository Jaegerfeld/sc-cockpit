# SC Cockpit

**Deutsch** · [English](README.md)

Eine App für meine Star-Citizen-Werkzeuge: Flotte, Fracht, Werkstatt, Guides und Pilot, mit gemeinsamen Daten. Reines HTML, kein Konto, kein Server; alle Daten bleiben in deinem Browser.

**Online:** https://jaegerfeld.github.io/sc-cockpit/ · **Offline:** [SC_Cockpit_Offline.zip](https://jaegerfeld.github.io/sc-cockpit/SC_Cockpit_Offline.zip) (entpacken, `SC_Cockpit.html` öffnen)

## Stand

Im Aufbau. Stand Version 0.6.0:

- **Seitenleiste** mit den Bereichen Übersicht, Flotte, Fracht, Werkstatt, Guides und Pilot. Jeder Bereich wird beim ersten Öffnen geladen.
- **Merker-Leiste** rechts, immer sichtbar: eigene Merker anlegen, abhaken, entfernen.
- **Übersicht als Lagebild:** „Zu erledigen“ mit allen offenen Merkern nach Ort (abhaken, Sprung zum Ort im Logbuch), dazu Flotte, Fracht und die letzte gelesene Sitzung.
- **Flotte ist eingezogen:** Komponenten-Planer mit eigener Flotte; die Einkaufsliste lässt sich als Merker übernehmen, offene Merker folgen ihr dann von selbst.
- **Fracht ist eingezogen:** Fracht-Logbuch mit Notizen; Merker erscheinen am Ort, Kaufmerker am Ort ihres Händlers.
- **Pilot ist eingezogen:** Ruf je Organisation und Spielsitzungen aus den Spiel-Logs (nur lokal gelesen); der Ruf steht auch im Lagebild.
- **Werkstatt ist eingezogen:** Bauplan-Planer und Wikelo-Planer als Unterreiter, jeder in einem abgeschirmten Bereich der Seite.
- **Guides als Wegweiser:** Die Guides sind noch nicht eingezogen; ihre Seiten führen in die bisherigen Tools.

Geplante Reihenfolge: Guides, dazu eine Sicherungsdatei für alles.

## Die bisherigen Tools

| Bereich | Tool |
|---|---|
| Flotte | [Schiffskauf-Planer](https://github.com/Jaegerfeld/StarCitizen-Schiffskauf-Planer) (mit Komponenten-Planer) |
| Fracht, Pilot | [Handels-Planer](https://github.com/Jaegerfeld/StarCitizen-Handels-Planer) (Fracht-Logbuch, Routen, Ruf, Sitzungen), [Screenshot-Auswerter](https://github.com/Jaegerfeld/StarCitizen-Screenshot-Auswerter) |
| Werkstatt | [Bauplan-Planer](https://github.com/Jaegerfeld/StarCitizen-Bauplan-Planer), [Wikelo-Planer](https://github.com/Jaegerfeld/StarCitizen-Wikelo-Planer) |
| Guides | [sc-guides](https://github.com/Jaegerfeld/sc-guides) |

Online liegen alle unter derselben Adresse (`jaegerfeld.github.io`) und teilen sich deshalb den Browser-Speicher. So sieht das Cockpit die Flotte und das Fracht-Logbuch ohne Übertragung. Die Offline-Kopie hat ihren eigenen Datenstand.

## Bauen

Nur Standardbibliothek. Der Bereich Flotte braucht die Quelle des Komponenten-Planers: das Repo [StarCitizen-Schiffskauf-Planer](https://github.com/Jaegerfeld/StarCitizen-Schiffskauf-Planer) neben diesem Repo (oder Pfad in `SC_SCHIFFSKAUF`). Der Bereich Fracht braucht genauso das Repo [StarCitizen-Handels-Planer](https://github.com/Jaegerfeld/StarCitizen-Handels-Planer) (`SC_HANDEL`). Die Werkstatt nimmt die veröffentlichten Seiten von [Bauplan-Planer](https://github.com/Jaegerfeld/StarCitizen-Bauplan-Planer) und [Wikelo-Planer](https://github.com/Jaegerfeld/StarCitizen-Wikelo-Planer) (mit `--cache` die gebauten Dateien aus den Nachbar-Repos). Ohne eine Quelle oder ohne Netz baut das Skript den Bereich als Wegweiser.

```bash
python cockpit_bauen.py          # schreibt cockpit/SC_Cockpit.html und cockpit/bereiche/*.js
python cockpit_bauen.py --zip    # schreibt zusätzlich SC_Cockpit_Offline.zip
python cockpit_bauen.py --cache  # nimmt die lokalen Zwischenspeicher des Schiffskauf-Planers statt Wiki und UEX
```

| Datei | Aufgabe |
|---|---|
| `cockpit_seite.py` | Hülle: Seitenvorlage, Stile, Navigation, Nachladen der Bereiche, Merker-Leiste |
| `cockpit_daten.py` | Gemeinsame Daten `SCData`: Merker, lesender Blick auf Flotte und Fracht-Logbuch |
| `cockpit_bereiche.py` | Die Bereiche; jeder wird zu `bereiche/<schlüssel>.js`. Die Flotte hängt den Komponenten-Planer aus dem Schiffskauf-Repo ein, Fracht und Pilot das Logbuch, den Ruf und die Sitzungen aus dem Handels-Repo, die Werkstatt Bauplan- und Wikelo-Planer in je einem Shadow Root |
| `flotte.py`, `kopfzeile.py`, `sc_design.py` | Gemeinsam mit den anderen Tools, byte-gleiche Kopien |

Bereiche werden über ein `<script>`-Element geladen, nicht über `fetch()`, damit die Seite auch aus einem Ordner auf der Festplatte läuft.

## Daten und Datenschutz

Alles liegt in deinem Browser (`localStorage`): Merker (`sc_merker_v1`), Sprache und Hell/Dunkel (`sc_cockpit_ui`), die gemeinsame Flotte (`sc_flotte_v1`) und das Fracht-Logbuch (`scha_ledger_v1`). Dazu kommen die Bestückungen des Komponenten-Planers (`scsk_kp`), der Ruf (`scha_rep_v1`, Kurzstand `sc_cockpit_ruf`) und der Zwischenspeicher gelesener Sitzungen (`scha_sessions_cache_v2`). Es wird nichts versendet. Die Seite lädt zwei Schriften von Google Fonts; ohne Verbindung nimmt sie Systemschriften.

## Hinweise

Weitgehend mit KI entwickelt ([Claude Code](https://claude.com/claude-code)). Keine Verbindung zu Cloud Imperium Games; Star Citizen® ist deren Marke. Lizenz: BSD-3-Clause, siehe [LICENSE](LICENSE). Konventionen: [CONTRIBUTING.md](CONTRIBUTING.md).
