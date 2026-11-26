# Manual: SC Cockpit

## Quick guide

The cockpit brings the Star Citizen tools together in one app. It is under construction: the areas move in one by one.

- **Sidebar on the left:** switches between **Overview**, **Fleet**, **Cargo**, **Workshop**, **Guides** and **Pilot**. On narrow screens it is a row at the top.
- **Overview:** shows one tile per area with the state from your data, for example the number of your ships or the SCU in the cargo ledger.
- **Fleet:** your ships and the component planner. Here you swap parts and take the shopping list over as reminders.
- **Cargo:** the cargo ledger with notes and the reminders at their place.
- **Other areas:** as long as an area has not moved in, its page shows what the cockpit already knows and leads to the existing tool with **Open** (new tab).
- **Reminders on the right:** your list to tick off. It stays visible in every area. **Collapse »** turns it into a narrow strip; a click on it opens it again.
- **Bottom of the sidebar:** language, light/dark, this manual, "What's new?" and the offline package. On phones and tablets they sit under **Settings**.

All data stays in your browser. There is no account and no server.

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
