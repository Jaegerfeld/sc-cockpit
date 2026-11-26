# Manual: SC Cockpit

## Quick guide

The cockpit brings the Star Citizen tools together in one app. It is under construction: the areas move in one by one.

- **Sidebar on the left:** switches between **Overview**, **Fleet**, **Cargo**, **Workshop**, **Guides** and **Pilot**. On narrow screens it is a row at the top.
- **Overview:** your status board. At the top is **To do** with all open reminders by place, below it fleet, cargo and the last session.
- **Fleet:** your ships and the component planner. Here you swap parts and take the shopping list over as reminders.
- **Cargo:** the cargo ledger with notes and the reminders at their place.
- **Pilot:** your reputation per organisation and your play sessions.
- **Workshop:** the blueprint planner and the Wikelo planner.
- **Guides:** all field handbooks and flyers; a guide opens right inside the cockpit.
- **Still in the existing tool:** routes and commodity lists, ship purchase and the screenshot reader. At the bottom of "Cargo" and "Fleet", **Open** leads there (new tab).
- **Reminders on the right:** your list to tick off. It stays visible in every area. **Collapse »** turns it into a narrow strip; a click on it opens it again.
- **Bottom of the sidebar:** language, light/dark, this manual, "What's new?" and the offline package. On phones and tablets they sit under **Settings**.

All data stays in your browser. There is no account and no server.

## Overview

1. **To do** groups the open reminders by place and gives the purchase total per place. That shows what you can get done at one station.
2. Tick a reminder right in the overview when it is done.
3. **In the ledger →** opens the place in the cargo ledger, with cargo, reminders and note.
4. **Fleet** shows swapped parts, cargo aboard and open reminders per ship. **Cargo** shows the total and the places holding the most.
5. **Last session** shows the last finished session that was read. For that you must have read your log folder once under "Sessions" in the trade planner.

## Reminders

1. Under **New reminder** on the right, write what you want to get done in the game, for example "fetch the Hull B at Area18", and click **Add** (or press Enter). If your fleet has ships, you can pick a **ship** for it below.
2. When something is done, tick it. The reminder moves to **Done**; there you can untick it again.
3. **✕** removes one of your own reminders. Right after that the message at the bottom offers **Undo**.
4. **Remove done ones** deletes all ticked reminders at once. It asks first and cannot be undone.

Reminders marked "automatic" come from the shopping list of a ship (see "Fleet and components"). They have no ✕: they disappear when the part drops out of the shopping list, or you tick them.

## Fleet and components

1. Open **Fleet** and click **Ships …** (the first time **Choose ships**). **View** opens a ship for a try, **+ Fleet** adds it to your fleet.
2. Click a card, for example a cooler, and pick another part on the right. The **shopping list** at the bottom fills with shop and price.
3. Below the shopping list, click **Take the shopping list over as reminders**. On the right one reminder per part appears, with count, ship, cheapest shop and price.
4. If you change the loadout afterwards, the open reminders follow by themselves. Ticked reminders stay, even if you remove the part again.
5. **Stop keeping reminders** ends this for the ship and takes its open reminders off the list.

Reminders are kept for ships of your fleet only. Add a ship in preview with **+ add to my ships** first.

## Cargo and reminders at their place

1. Open **Cargo**. On the left are your ships with cargo space, on the right the places, in the middle the selected place or ship.
2. Pick a place. **To do here** lists the open reminders for this place, for example a purchase reminder from the fleet with ship, shop and price. Tick it when it is done.
3. Under **New reminder for this place** you add your own reminder tied to this place. For a ship the field is called **New reminder for this ship**.
4. Places and ships with open reminders carry **☑ n reminders** in the lists. The filter **with cargo or a note only** includes them.
5. Below that is the **Notes** field for free text, as before.

You book cargo as in the trade planner: **+ Book cargo in**, click or drag a post to move it. Routes, commodity lists and "To the phone" are still in the trade planner.

## Pilot: reputation and sessions

1. Open **Pilot**. At the top you switch between **Reputation** and **Sessions**.
2. **Load log folder …** reads `Game.log` and `logbackups` from your Star Citizen folder (LIVE or PTU). The files stay on your computer.
3. **Reputation:** align rank and bar from the mobiGlas once per organisation, by hand or with **Align screenshots …**. After that the tab adds the completed missions from the logs and estimates the state.
4. **Sessions:** shows shard, last place, ship and whether the game crashed, per session. A click on the place opens it in the cargo ledger.
5. The **Overview** then shows the reputation (favourites first, then whoever is closest to the next rank) and the last session read.

The detailed manual for reputation and sessions is in the trade planner under "Manual + How-To"; the tabs are the same.

## Workshop: blueprints and Wikelo

1. Open **Workshop**. At the top you switch between **Blueprints** and **Wikelo**.
2. **Blueprints:** search the catalogue, add blueprints with **+** and enter under "Available resources" what you already have. The procurement list shows what is missing.
3. **Wikelo:** enter your stock; the offers sort by how much you still lack.
4. Each planner has its own row with **Manual + How-To** and **What's new?**. That is where the planner's detailed manual is.
5. Language and light/dark are set in the cockpit; both planners follow.

## Guides

1. Open **Guides**. The cards are grouped by topic.
2. A click on a guide opens it here. **← All guides** leads back to the index, **In a new tab ↗** opens the guide on its own, for example to print it.
3. Flyers and PDFs open in a new tab.

The guides need an internet connection, even when you start the cockpit from the offline package.

## Shared data

- Online the cockpit and the existing tools share one address. That is why the cockpit sees your fleet and the cargo ledger of the trade planner without any transfer.
- The cargo ledger is the same as in the trade planner. What you book here is there, and the other way round. If it is open in two tabs, each takes over the other's state as soon as that one saves.
- Online the cockpit shares fleet and loadouts with the ship purchase planner: what you built there is here, and the other way round.
- Reminders, language and light/dark are stored by the cockpit itself.
- If you clear your browser's site data, this data is gone as well.

## Offline use

1. Click **Offline package** at the bottom of the sidebar and unpack the ZIP file.
2. In the `SC_Cockpit` folder, open `SC_Cockpit.html` with a double click. The `bereiche` folder must stay next to it.
3. The offline copy has its own data. It does not see the data of the online version. A shared backup file to carry data across follows in a later version.
