# Changelog

Alle nennenswerten Änderungen an diesem Projekt. Format nach [Keep a Changelog](https://keepachangelog.com/de/1.0.0/), Versionierung nach [SemVer](https://semver.org/lang/de/).

## [0.1.0] – 2026-11-26

### Hinzugefügt
- **Gerüst des Cockpits.** Eine Seite mit Seitenleiste für die Bereiche **Übersicht**, **Flotte**, **Fracht**, **Werkstatt**, **Guides** und **Pilot**. Jeder Bereich wird erst beim ersten Öffnen geladen.
- **Merker-Leiste** rechts, immer sichtbar: eigene Merker anlegen, abhaken, entfernen (mit „Rückgängig“), erledigte gesammelt entfernen.
- **Gemeinsame Daten:** Die Übersicht und die Bereiche zeigen, was das Cockpit aus der gemeinsamen Flotte und dem Fracht-Logbuch schon weiß (Schiffe, SCU, Orte mit Fracht, Notizen). Online teilt das Cockpit diese Daten mit den bisherigen Tools.
- **Bereiche als Wegweiser:** Flotte, Fracht, Werkstatt, Guides und Pilot sind noch nicht eingezogen. Ihre Seiten führen in das bisherige Tool.
- **Offline-Paket:** Startdatei `SC_Cockpit.html` plus Ordner `bereiche`, läuft per Doppelklick ohne Server.
- Sprache DE/EN, Hell/Dunkel, „Anleitung + How-To“ und „Was ist neu?“ wie in den einzelnen Tools.
