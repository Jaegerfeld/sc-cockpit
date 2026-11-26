# SC Cockpit

**Deutsch** · [English](README.md)

Eine App für meine Star-Citizen-Werkzeuge: Flotte, Fracht, Werkstatt, Guides und Pilot, mit gemeinsamen Daten. Reines HTML, kein Konto, kein Server; alle Daten bleiben in deinem Browser.

**Online:** https://jaegerfeld.github.io/sc-cockpit/ · **Offline:** [SC_Cockpit_Offline.zip](https://jaegerfeld.github.io/sc-cockpit/SC_Cockpit_Offline.zip) (entpacken, `SC_Cockpit.html` öffnen)

## Stand

Im Aufbau. Version 0.1.0 ist das Gerüst:

- **Seitenleiste** mit den Bereichen Übersicht, Flotte, Fracht, Werkstatt, Guides und Pilot. Jeder Bereich wird beim ersten Öffnen geladen.
- **Merker-Leiste** rechts, immer sichtbar: eigene Merker anlegen, abhaken, entfernen.
- **Gemeinsame Daten:** Die Übersicht zeigt, was das Cockpit aus der gemeinsamen Flotte und dem Fracht-Logbuch schon weiß (Schiffe, SCU, Orte mit Fracht, Notizen).
- **Bereiche als Wegweiser:** Die Bereiche sind noch nicht eingezogen; ihre Seiten führen in die bisherigen Tools.

Geplante Reihenfolge: Flotte mit Komponenten-Planer und automatischen Kaufmerkern, Fracht-Logbuch, Übersicht als Lagebild, dann Werkstatt, Pilot und Guides, dazu eine Sicherungsdatei für alles.

## Die bisherigen Tools

| Bereich | Tool |
|---|---|
| Flotte | [Schiffskauf-Planer](https://github.com/Jaegerfeld/StarCitizen-Schiffskauf-Planer) (mit Komponenten-Planer) |
| Fracht, Pilot | [Handels-Planer](https://github.com/Jaegerfeld/StarCitizen-Handels-Planer) (Fracht-Logbuch, Routen, Ruf, Sitzungen), [Screenshot-Auswerter](https://github.com/Jaegerfeld/StarCitizen-Screenshot-Auswerter) |
| Werkstatt | [Bauplan-Planer](https://github.com/Jaegerfeld/StarCitizen-Bauplan-Planer), [Wikelo-Planer](https://github.com/Jaegerfeld/StarCitizen-Wikelo-Planer) |
| Guides | [sc-guides](https://github.com/Jaegerfeld/sc-guides) |

Online liegen alle unter derselben Adresse (`jaegerfeld.github.io`) und teilen sich deshalb den Browser-Speicher. So sieht das Cockpit die Flotte und das Fracht-Logbuch ohne Übertragung. Die Offline-Kopie hat ihren eigenen Datenstand.

## Bauen

Nur Standardbibliothek, kein Netz nötig:

```bash
python cockpit_bauen.py          # schreibt cockpit/SC_Cockpit.html und cockpit/bereiche/*.js
python cockpit_bauen.py --zip    # schreibt zusätzlich SC_Cockpit_Offline.zip
```

| Datei | Aufgabe |
|---|---|
| `cockpit_seite.py` | Hülle: Seitenvorlage, Stile, Navigation, Nachladen der Bereiche, Merker-Leiste |
| `cockpit_daten.py` | Gemeinsame Daten `SCData`: Merker, lesender Blick auf Flotte und Fracht-Logbuch |
| `cockpit_bereiche.py` | Die Bereiche; jeder wird zu `bereiche/<schlüssel>.js` |
| `flotte.py`, `kopfzeile.py`, `sc_design.py` | Gemeinsam mit den anderen Tools, byte-gleiche Kopien |

Bereiche werden über ein `<script>`-Element geladen, nicht über `fetch()`, damit die Seite auch aus einem Ordner auf der Festplatte läuft.

## Daten und Datenschutz

Alles liegt in deinem Browser (`localStorage`): Merker (`sc_merker_v1`), Sprache und Hell/Dunkel (`sc_cockpit_ui`), die gemeinsame Flotte (`sc_flotte_v1`) und, nur lesend, das Fracht-Logbuch (`scha_ledger_v1`). Es wird nichts versendet. Die Seite lädt zwei Schriften von Google Fonts; ohne Verbindung nimmt sie Systemschriften.

## Hinweise

Weitgehend mit KI entwickelt ([Claude Code](https://claude.com/claude-code)). Keine Verbindung zu Cloud Imperium Games; Star Citizen® ist deren Marke. Lizenz: BSD-3-Clause, siehe [LICENSE](LICENSE). Konventionen: [CONTRIBUTING.md](CONTRIBUTING.md).
