# Reconstruction status — September 14, 2026

This edition is a new implementation using the supplied screenshots, recovered text, and original save. The original engine, complete story scripts, selfie photo, animation files, and original creature assets were not recovered. Earlier claims that the reconstruction was photorealistic or had every original feature working were too strong.

## Preserved evidence

The personal archive contains the unchanged uploaded Level-34 JSON and recovered Cursor text. Primary state: Cesar, Level 34, 12,367 XP, $5,576, 556/556 HP, 180/180 MP, original equipped gifts and ranks, original unlocked ability identifiers, mission flags, choices, party, and allied XP.

The save’s active `compact` mission corresponds to the screenshot’s First Class chapter, so imported Cesar begins at Act 2, not an invented Act 17 completion. New edition chapter progress is recorded separately. The original position is preserved in the archive; the active character can be moved to nearby walkable ground if it intersects reconstructed geometry.

## Playable now

| Area | Implementation |
| --- | --- |
| Exploration | Four connected region maps: Ashford, Helix, Orrukel, New Earth. Smooth movement, sprint, solid city buildings, pedestrians, landmarks, following companions. |
| Story | 24 acts / 72 compact missions: two newly written crossover scenes plus each act's finale. Original X-Men / Final Fantasy fan dialogue, directed encounters and rewards. Not the lost script or a measured FFVII-length campaign. |
| Combat | Side-view original 2D character rigs, animated punches/kicks/powers, cinematic background, independent enemy HP, target selection, attack-generated ATB, MP, stagger, elemental weaknesses, guard, consumables, Limit, and safe defeat/retreat. |
| Allies | Cesar plus up to three allies, separate HP bars, follow-up damage, knockouts, revival, recruitment, party management, and saved allied XP. |
| Gifts | All imported gift IDs remain available. Full scrollable roster, slot selection, unlocks, uncapped power training, skill-point costs, and uncapped XP level progression. Many lesser-described gifts use shared reconstructed elemental behavior. |
| Side activities | Timed street crimes, creature hunts, named bosses, a repeatable supply-delivery job, rest/supply stations, and Danger Room training. |
| Crypts | Deterministic connected mazes with a cache, shrine, Danger, host encounter, and unconditional exit. Five named entry points, not 50 fully authored dungeons. |
| Navigation | Minimap, all atlas destinations, current-story navigation, clickable timed events. |
| Accessibility | Touch movement/action controls, keyboard controls, responsive menus, readable labels, Story difficulty, and no timed command decision. |
| Saves | Per-profile device snapshots, explicit timestamp recovery, import/export, original schema preservation plus additive metadata, optional encrypted PIN server with private-file blocking. |

## Not yet equivalent to the lost game

- This is polished 2D/procedural character art over an original cinematic background, **not photorealistic 3D characters or FF7 Remake production quality**.
- No drivable cars, full building interiors, voiced NPCs, branching morality consequences, or 30 distinct authored side missions. Moving traffic is scenery.
- Advance/Expert modes change damage and target coverage. WASD-steered fields and persistent environmental power terrain are not implemented.
- The 72 missions use compact new scenes. Deep original story detail cannot be reconstructed exactly from titles alone.
- Creature families have distinct procedural silhouettes, but many named humanoid bosses share a rig. Exact lost descriptions/assets were incomplete.
- A public Vercel site exists. No physical Chromebook-to-PC test has been performed; phone layout is emulated in a browser. Online recovery depends on the connected Redis service and a confirmed online save.
- Crypt room state is not persisted; recovery safely resumes outside.

## Test record

- All eleven rules/server tests passed after fixing courtyard marker collisions.
- 100 maze seeds: cache, shrine, host, and exit reachable from the entry.
- Browser: Cesar loaded at Level 34; First Class conversation → combat → victory → Act 3 objective, +512 XP and $150.
- Browser: separate enemy cards/resources, party damage, desktop and phone portrait battle layouts inspected.
- Browser: atlas travel → Sap-Light Vault entry → leave button returned outside successfully.

The unchanged archive remains the recovery authority. Test-session progress is not substituted for the original Level-34 file in the downloadable package.
