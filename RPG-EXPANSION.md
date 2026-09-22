# Mutant build expansion

This is an additive RPG system, not feature or campaign-length parity with Final Fantasy VII or Diablo II. Existing HD artwork and map geometry remain unchanged.

## Play

- Gifts opens development: one shared training point per character level, retroactive to existing levels. Level 39 supplies 39 total points, not 39 for each skill.
- J, K and each equipped gift have separate Power, Control and Evolution branches (nine nodes per technique). Core mastery and use-earned mastery have no rank cap; specialized nodes have displayed caps.
- Successful technique use earns 10 use XP. Mastery increases with the square root of accumulated use XP and adds output strength.
- Inventory → Attributes offers six attributes and three points per level. Free respec refunds the new allocations without removing legacy gift upgrades, use XP, equipment or story progress.
- Shops offer 41 equipment choices, ten supply types including the original two, and nine lenses. A lens can be socketed into one gift at a time. Buy, equip, remove, sell and craft are functional.
- Non-training victories grant salvage and resonance crystals for recipes. Danger Room restores consumed supplies and health on leaving.
- New assignment decisions develop Guardian, Scholar and Vanguard ideals. Three matching decisions unlock that technique evolution. Choices affect next-encounter resources and evolution effects, not separate fully written campaign routes.

## Saves

Schema remains version 2. New data is under `save.odyssey.progression` and `save.odyssey.rpgItems`. Unknown original fields, level, XP, legacy inventory and old upgrades are retained. Load the latest personal save; do not replace it with the historical level-34 fixture. Training creates local checkpoints. Use Save online now for the server copy, and export a backup before an update.

## Reference research

- Original FFVII materia tutorial by Xenomic: https://www.youtube.com/watch?v=NRAB_OPoM_M — focused reference candidate for configurable ability combinations. Search metadata was verified; no full viewing is claimed.
- Blizzard's Dbrunski125 video collection: https://news.blizzard.com/en-us/article/23719810/diablo-ii-resurrected-class-guide-showcase-ft-dbrunski125 — embedded build videos addressing equipment, attributes and skill choices. Particularly relevant are Sorceress, Barbarian and Assassin builds.
- User FFVII longplay: https://www.youtube.com/watch?v=D6-lbtqQ7oY — chapter list inspected for journey structure; full video not watched. Transcript unavailable.
- User Diablo II longplay: https://www.youtube.com/watch?v=JHTFY7PSs5g — title/duration verified; full video not watched. Transcript unavailable.

Design translation: configurable lenses, build-specific equipment, independent technique progression, resource tradeoffs and choice-unlocked effects, adapted to the existing mutant setting. The nine-node template is shared across techniques; fully bespoke trees, major new cinematics and a commercial-game-length authored campaign remain future work.

## Verification

Run `node --test upgrade.test.mjs crowd.test.mjs rpg.test.mjs`, then `node build.mjs`.
Public builds reject embedded personal saves. No save API or cloud credentials were changed by this expansion.
