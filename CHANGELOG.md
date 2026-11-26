# Changelog

Alle nennenswerten Änderungen an diesem Projekt. Format nach [Keep a Changelog](https://keepachangelog.com/de/1.0.0/), Versionierung nach [SemVer](https://semver.org/lang/de/).

## [0.10.1] – 2026-11-26

### Geändert
- **Vorbereitung für die Weiterleitung der Einzelseiten.** Die Adressen von Handels-, Schiffskauf-, Bauplan- und Wikelo-Planer sowie des Screenshot-Auswerters leiten künftig ins Cockpit weiter; jede Seite selbst liegt dann unter `app.html` daneben. „Im bisherigen Tool öffnen“ zeigt deshalb auf `app.html`, und der Bau holt die Seiten von dort.
- Die Werkstatt hat Adressen je Werkzeug: `#/werkstatt/bauplan` und `#/werkstatt/wikelo`.

## [0.10.0] – 2026-11-26

### Hinzugefügt
- **„Aufs Handy“ im Cockpit.** Im Fracht-Logbuch und im Ruf gibt es jetzt den Knopf **Aufs Handy …** wie im Handels-Planer: Der Stand wird als Link und QR-Code gepackt; der Teil hinter „#“ wird nie an einen Server geschickt.
- **Der Link führt ins Cockpit.** Auf dem Handy öffnet er das Cockpit direkt im passenden Bereich: das Logbuch unter „Fracht“, den Ruf unter „Pilot“. Das Logbuch fragt vor dem Ersetzen eines vorhandenen Stands nach; Rückgängig ist möglich.

### Bekannt
- Übertragen werden wie bisher Logbuch (Schiffe, Fracht, Notizen) und Ruf. Merker, Flotte und Bestückungen nimmst du mit der Sicherungsdatei mit.
- Links aus dem Handels-Planer öffnen weiter den Handels-Planer, Links aus dem Cockpit das Cockpit.
- Der QR-Code braucht eine Verbindung; ohne sie bleibt der Link zum Kopieren.

## [0.9.0] – 2026-11-26

### Hinzugefügt
- **Routen und Waren im Cockpit.** „Fracht“ hat jetzt drei Unterreiter: Logbuch, **Routen & Waren** (Routen, alle Waren, nach Verkaufsort, nach Kaufort) und **Auswerter**.
- **Screenshot-Auswerter im Cockpit.** Der Unterreiter „Auswerter“ liest Preise aus Screenshots der Handelskonsolen, wie die bisherige Seite. Die Texterkennung lädt er aus dem Netz.
- **Schiffskauf im Cockpit.** „Flotte“ hat zwei Unterreiter: Meine Schiffe und **Schiffskauf** (Preise und Standorte kaufbarer Schiffe, Merkliste mit Budget).
- **Adresse je Unterreiter.** `#/fracht/handel`, `#/fracht/auswerter` und `#/flotte/schiffskauf` öffnen den Unterreiter direkt.

### Geändert
- Die Verweise „Noch im bisherigen Tool“ am Fuß von Fracht und Flotte entfallen.
- Die drei Werkzeuge laden erst, wenn du ihren Unterreiter öffnest. Schlägt das fehl, steht dort eine Meldung mit „Erneut versuchen“ und einem Link zur bisherigen Seite.

### Bekannt
- Der Unterreiter „Routen & Waren“ zeigt die Daten von star-head. Eigene Auswerter-Exporte, die du lokal in den Handels-Planer einbaust, sind hier nicht enthalten.
- „Aufs Handy“ gibt es weiterhin nur im Handels-Planer.
- Ohne Verbindung startet der Auswerter, kann aber keine Bilder lesen; ein Hinweis steht dann oben im Unterreiter.

## [0.8.0] – 2026-11-26

### Hinzugefügt
- **Sicherungsdatei für alles.** „Sicherung …“ in den Einstellungen speichert eine Datei mit allem, was du angelegt hast: Flotte, Bestückungen, Merker, Fracht-Logbuch mit Notizen, Ruf-Abgleiche, Auswahl und Bestand von Bauplan- und Wikelo-Planer, Merkliste des Schiffskaufs. Damit nimmst du deine Daten mit: ins Offline-Paket, auf einen zweiten Rechner oder in einen anderen Browser.
- **Einlesen mit Vergleich.** Vor dem Übernehmen zeigt der Dialog je Bereich, was jetzt im Browser steht und was in der Datei; Unterschiede sind hervorgehoben. Übernehmen ersetzt den Stand in allen Bereichen.
- **Rückweg.** Der Stand vor dem Einlesen bleibt im Browser liegen; „Stand vor dem Einlesen wiederherstellen“ holt ihn zurück. Reicht der Browser-Speicher dafür nicht, speichert das Cockpit ihn stattdessen als Datei.

### Bekannt
- Nicht gesichert werden Preisdaten und gelesene Sitzungen (lassen sich neu laden; die Sitzungen enthalten Server-Adressen aus den Spiel-Logs) sowie Sprache und Hell/Dunkel (gehören zum Gerät).
- Die Sicherung ist ein Speichern und Einlesen von Hand. Die Speicherdatei des Fracht-Logbuchs, die sich von selbst mitschreibt, bleibt davon getrennt.
- Haben beim Einlesen andere Tabs das Cockpit oder einen Planer offen, können sie den alten Stand wieder zurückschreiben. Schließ sie vorher.

## [0.7.0] – 2026-11-26

### Hinzugefügt
- **Guides sind eingezogen.** Der Bereich „Guides“ zeigt die Übersicht aller Feldhandbücher und Flyer mit ihren Karten. Ein Klick auf einen Guide öffnet ihn im Cockpit in einem Leserahmen; „← Alle Guides“ führt zurück, „In neuem Tab ↗“ öffnet ihn einzeln. Flyer und PDFs öffnen in einem neuen Tab.
- Die Übersicht folgt Sprache und Hell/Dunkel des Cockpits.
- Damit sind alle sechs Bereiche eingezogen.

### Bekannt
- Die Guides selbst liegen auf der Guide-Seite und brauchen das Netz, auch im Offline-Paket. Ein geöffneter Guide behält seine eigene Sprach- und Farbwahl.
- Der Abschnitt „Planer & Tools“ der Guide-Übersicht ist im Cockpit ausgeblendet; die Planer sind hier die Bereiche der Seitenleiste.
- Noch nicht eingezogen sind Routen und Warenlisten des Handels-Planers, der Schiffskauf und der Screenshot-Auswerter. Sie stehen als Verweis am Fuß von „Fracht“ und „Flotte“.

## [0.6.0] – 2026-11-26

### Hinzugefügt
- **Werkstatt ist eingezogen.** Der Bereich „Werkstatt“ enthält jetzt den **Bauplan-Planer** und den **Wikelo-Planer** als Unterreiter, in derselben Seite, ohne neuen Tab. Auswahl, Bestand und Fortschritt sind dieselben wie in den einzelnen Tools; dein Stand von dort ist online schon da.
- Beide folgen Sprache und Hell/Dunkel des Cockpits. Ihre eigene Zeile mit „Anleitung + How-To“, „Was ist neu?“, „Neuesten Stand laden“ und den Werkzeug-Knöpfen bleibt, damit du die Anleitung des jeweiligen Planers zur Hand hast.

### Technik
- Die beiden Planer sind ganze Seiten aus einer Vorlage. Sie werden nicht umgeschrieben, sondern jede fertige Seite läuft in einem abgeschirmten Bereich (Shadow Root): Stile und Bezeichner bleiben dort, das Skript der Seite arbeitet auf diesem Bereich statt auf dem ganzen Dokument. Der Bau nimmt dafür die veröffentlichte Seite des jeweiligen Tools.

### Bekannt
- Die Bilder im Bauplan-Planer kommen wie dort aus dem Netz; offline bleiben sie leer.
- Bei schmalem Fenster richten sich beide Planer nach der Fensterbreite, nicht nach ihrer Spalte. „Einklappen »“ an der Merker-Leiste gibt ihnen mehr Platz.
- Die Werkstatt steht noch nicht im Lagebild und legt keine Merker an.

## [0.5.0] – 2026-11-26

### Hinzugefügt
- **Pilot ist eingezogen.** Der Bereich „Pilot“ enthält jetzt die Reiter **Ruf** und **Sitzungen** aus dem Handels-Planer: Ruf je Organisation als Balken zum nächsten Rang (Abgleich mit dem mobiGlas, auch per Screenshot), und die Spielsitzungen mit Shard, Ort, Schiff und Absturz. Abgleiche und der gemerkte Log-Ordner von dort sind online schon da. Beide lesen die Spiel-Logs nur auf deinem Rechner.
- **Ruf im Lagebild.** Die Übersicht zeigt die abgeglichenen Organisationen mit Rang und geschätztem Fortschritt zum nächsten Rang: Favoriten zuerst, dann wer dem Aufstieg am nächsten ist. Der Stand ist der, den der Bereich Pilot zuletzt gesehen hat.
- Der letzte Ort einer Sitzung führt mit einem Klick zum Ort im Fracht-Logbuch. „Zu den Sitzungen“ im Lagebild öffnet gleich den Reiter Sitzungen.

### Bekannt
- „Aufs Handy“ für den Ruf gibt es vorerst nur im Handels-Planer.
- Der Ruf im Lagebild ändert sich erst, wenn du den Bereich Pilot öffnest; die Übersicht liest die Logs nicht selbst.

## [0.4.0] – 2026-11-26

### Hinzugefügt
- **Übersicht als Lagebild.** Die Startseite zeigt jetzt den Stand statt Kacheln:
  - **Zu erledigen:** alle offenen Merker, nach Ort gruppiert, mit der Kaufsumme je Ort. Du hakst sie direkt ab. „Im Logbuch →“ öffnet den Ort im Fracht-Logbuch.
  - **Flotte:** je Schiff, wie viele Teile getauscht sind, wie viel Fracht an Bord ist und wie viele Merker offen sind.
  - **Fracht:** SCU gesamt, Zahl der Orte und Notizen, die fünf Orte und Schiffe mit der meisten Fracht.
  - **Letzte Sitzung:** Zeitpunkt, Ende (auch Absturz), letzter Ort, letztes Schiff und Shard der zuletzt gelesenen Sitzung aus dem Reiter „Sitzungen“ des Handels-Planers.

### Bekannt
- Das Lagebild liest nur, was die Bereiche im Browser gespeichert haben. Warennamen und Lagerwert stehen deshalb nur im Logbuch selbst.
- „Letzte Sitzung“ zeigt die zuletzt gelesene abgeschlossene Sitzung, nicht die laufende. Ort und Schiff erscheinen mit dem Namen aus dem Spiel-Log.

## [0.3.0] – 2026-11-26

### Hinzugefügt
- **Fracht ist eingezogen.** Der Bereich „Fracht“ enthält jetzt das Fracht-Logbuch: Fracht einbuchen und verschieben, Schiffe mit Laderaum, Notizen je Ort und Schiff, Suche, Export und Speicherdatei. Es ist dasselbe Logbuch wie im Handels-Planer; dein Stand von dort ist online schon da.
- **Merker am Ort.** Ein gewählter Ort zeigt unter „Hier zu erledigen“ die offenen Merker, die dorthin gehören. Kaufmerker aus der Flotte landen am Ort ihres Händlers, mit Schiff, Händler und Preis. Du hakst sie dort ab und legst neue Merker für den Ort oder das Schiff an. Orte mit Merkern tragen in der Liste „☑ n Merker“.
- **Merker-Leiste einklappen.** „Einklappen »“ macht die Leiste zu einem schmalen Streifen mit der Zahl der offenen Merker und gibt dem Bereich mehr Platz; das Cockpit merkt sich die Wahl.

### Bekannt
- Den besten Verkaufsort je Ware nennt das Logbuch im Cockpit noch nicht (nur den UEX-Durchschnittspreis); das kommt mit den Routen. „Aufs Handy“ gibt es vorerst nur im Handels-Planer.
- Drei Händler lassen sich noch keinem Ort zuordnen (zwei in GrimHEX, einer in Kabir’s Post); ihre Merker stehen nur in der Leiste.

## [0.2.0] – 2026-11-26

### Hinzugefügt
- **Flotte ist eingezogen.** Der Bereich „Flotte“ enthält jetzt den Komponenten-Planer: Schiffe ansehen, zur Flotte hinzufügen, benennen, Teile tauschen, Einkaufsliste. Es sind dieselben Schiffe und Daten wie im Schiffskauf-Planer; deine Flotte und deine Bestückungen von dort sind online schon da.
- **Einkaufsliste als Merker.** Unter der Einkaufsliste übernimmt ein Knopf die getauschten Teile als Merker, je Teil mit Anzahl, günstigstem Händler und Preis. Danach folgen die offenen Merker der Einkaufsliste von selbst; abgehakte bleiben, wie sie sind. „Merker nicht mehr führen“ beendet das für ein Schiff.
- **Merker mit Schiff.** Einen eigenen Merker kannst du einem Schiff deiner Flotte zuordnen. Merker zeigen Schiff, Händler und Preis.
- **Link zu einer Bestückung** (`#kp=…`) öffnet im Cockpit die Flotte mit dem Schiff als Vorschau.

### Geändert
- Auf Handy und Tablet sind Sprache, Hell/Dunkel, Anleitung, „Was ist neu?“ und Offline-Paket unter „Einstellungen“ eingeklappt, damit der Inhalt früher beginnt.
- Bis 1560 px Fensterbreite sind Seitenleiste und Merker-Leiste etwas schmaler, damit der Komponenten-Planer Platz für seine drei Spalten hat.
- Der Bau holt die Quelle des Komponenten-Planers aus dem Repo StarCitizen-Schiffskauf-Planer und läuft täglich, damit Spieldaten und Preise frisch bleiben.

## [0.1.0] – 2026-11-26

### Hinzugefügt
- **Gerüst des Cockpits.** Eine Seite mit Seitenleiste für die Bereiche **Übersicht**, **Flotte**, **Fracht**, **Werkstatt**, **Guides** und **Pilot**. Jeder Bereich wird erst beim ersten Öffnen geladen.
- **Merker-Leiste** rechts, immer sichtbar: eigene Merker anlegen, abhaken, entfernen (mit „Rückgängig“), erledigte gesammelt entfernen.
- **Gemeinsame Daten:** Die Übersicht und die Bereiche zeigen, was das Cockpit aus der gemeinsamen Flotte und dem Fracht-Logbuch schon weiß (Schiffe, SCU, Orte mit Fracht, Notizen). Online teilt das Cockpit diese Daten mit den bisherigen Tools.
- **Bereiche als Wegweiser:** Flotte, Fracht, Werkstatt, Guides und Pilot sind noch nicht eingezogen. Ihre Seiten führen in das bisherige Tool.
- **Offline-Paket:** Startdatei `SC_Cockpit.html` plus Ordner `bereiche`, läuft per Doppelklick ohne Server.
- Sprache DE/EN, Hell/Dunkel, „Anleitung + How-To“ und „Was ist neu?“ wie in den einzelnen Tools.
