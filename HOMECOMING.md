# Homecoming expansion

Adds a first playable implementation across six requested areas. This is not a claim of 72 individually authored campaigns or Final Fantasy/Diablo production scope.

1. **Student home:** claim a room, choose a mentor, attend existing classes, rest, review memories and earned keepsakes.
2. **Quest variety:** six rotating assignment structures: rescue, investigation, sabotage, expedition, defense and diplomacy. Evidence puzzles check answers; routes change locations and can avoid fights. Existing story introductions remain. Crypts gain loop passages and one secret choice per crypt.
3. **Consequences:** completed assignments can bring Mira to campus, protect a grove rest site, open an Ashford relief shop, and record clinic/agreement outcomes. World consequences are applied after completion, not before rescue. These are bounded outcomes, not a fully simulated world.
4. **Companions:** Goldie heals/wards, Juno adds stagger and interrupts charging machines, Yara roots targets. Each has a short personal travel-and-conversation quest that upgrades their role. Juno requires one earned crystal. These are introductory friendship quests, not multi-hour companion campaigns.
5. **Boss tactics:** shields break with kicks, charges can be interrupted with kicks/storm, wounded bosses enter phase two. Charged beasts sweep the party; machines drain MP. Enemy cards show intent. A studied crypt host loses its shield and deals less damage.
6. **Rewards:** six quest-only equipment relics with functional special effects, six room keepsakes, and crypt crafting discoveries. Relics cannot be bought/sold. First completion of each assignment type grants its relic; later completions do not duplicate it.

## Save compatibility

New fields live under `save.odyssey.homecoming`. Existing level, XP, PIN and original inventory are untouched. An assignment already in progress at first load keeps its old eight-stage structure until its debrief. New structure begins with the next assignment. Completed chapter/episode indices are not reset. Crypt secret choices persist and cannot be farmed by reloading.

Use Institute for home and friendship quests. Accepting a friendship quest tracks its world marker; bring that ally in your active party. Use Story route to return to the campaign. Quest relics are equipped through Inventory.

## Verification

`node --test upgrade.test.mjs crowd.test.mjs rpg.test.mjs quests.test.mjs`

Tests cover all 72 assignments on each of three approaches, clue validation, legacy progress, save round trips, exclusive loot, companion roles, boss interruption, secret persistence and 100 connected crypt layouts. Browser checks cover room/mentor actions, Goldie's quest completion, clue choice and changed route, and retained HD rendering. No personal player save is used for testing or uploaded.

No cloud API, credentials, graphics assets or level-34 archive were changed. Save online and export a backup before refreshing the production game.
