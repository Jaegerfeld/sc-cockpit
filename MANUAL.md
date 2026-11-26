# Manual: SC Cockpit

## Quick guide

The cockpit brings the Star Citizen tools together in one app. It is under construction: the areas move in one by one.

- **Sidebar on the left:** switches between **Overview**, **Fleet**, **Cargo**, **Workshop**, **Guides** and **Pilot**. On narrow screens it is a row at the top.
- **Overview:** shows one tile per area with the state from your data, for example the number of your ships or the SCU in the cargo ledger.
- **Areas:** as long as an area has not moved in, its page shows what the cockpit already knows and leads to the existing tool with **Open** (new tab).
- **Reminders on the right:** your list to tick off. It stays visible in every area.
- **Bottom of the sidebar:** language, light/dark, this manual, "What's new?" and the offline package.

All data stays in your browser. There is no account and no server.

## Reminders

1. Under **New reminder** on the right, write what you want to get done in the game, for example "fetch the Hull B at Area18", and click **Add** (or press Enter).
2. When something is done, tick it. The reminder moves to **Done**; there you can untick it again.
3. **✕** removes one of your own reminders. Right after that the message at the bottom offers **Undo**.
4. **Remove done ones** deletes all ticked reminders at once. It asks first and cannot be undone.

Later the areas add reminders themselves, first the component planner from its shopping list.

## Shared data

- Online the cockpit and the existing tools share one address. That is why the cockpit sees your fleet and the cargo ledger of the trade planner without any transfer.
- For now the cockpit only reads the cargo ledger. You keep cargo and notes in the trade planner.
- Reminders, language and light/dark are stored by the cockpit itself.
- If you clear your browser's site data, this data is gone as well.

## Offline use

1. Click **Offline package** at the bottom of the sidebar and unpack the ZIP file.
2. In the `SC_Cockpit` folder, open `SC_Cockpit.html` with a double click. The `bereiche` folder must stay next to it.
3. The offline copy has its own data. It does not see the data of the online version. A shared backup file to carry data across follows in a later version.
