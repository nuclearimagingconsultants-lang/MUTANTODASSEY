# Mutant Odyssey

A browser superpower adventure, made with love from Cesar to his niece.

## Play

Choose **Begin your own story** to create a hero, or **Import save** to restore your own backup. WASD / arrow keys move, Enter interacts, M opens the Atlas. The minimap is at the upper right during exploration, including landscape screens. It is hidden during combat.

## Vercel deployment

Connect this repository to Vercel. Framework: **Other**. Build command: `node build.mjs`. Leave Output Directory at its default: the build emits Vercel Build Output API files in `.vercel/output`, including private save functions. No npm packages are required. Connect an Upstash Redis database to production; the server accepts `KV_REST_API_URL` and `KV_REST_API_TOKEN` (or their `UPSTASH_REDIS_REST_*` equivalents). Never expose those values in browser code. Pushes to main update the permanent site.

The build copies only approved game assets. `ashford.png` lives at the repository root to simplify browser uploads; the build places it at `dist/assets/ashford.png`.

## Save safety

This public repository contains **no Cesar personal save, recovery PIN, selfie, or conversation archive**. Your device saves are stored in your browser, separately for each website address. Before moving from a localhost game, use **Save → Export backup JSON**, then import that backup on the permanent site. Never upload your personal JSON to this public repository.

On the permanent site, import your personal save, open **Save**, choose a private **8–12 digit PIN**, then press **Save online now**. Wait for confirmation naming your character and level. On another device, open the same site, choose **PIN recovery**, enter that PIN and select a timestamp. The latest 24 online recovery points are retained. Online saves are manual; device checkpoints alone do not upload progress. Keep exported backups as well. Old short PINs still find local saves but cannot secure new online saves.

The save service encrypts snapshots with AES-GCM, uses keyed PIN lookup, server timestamps, rate limiting and per-PIN profile ownership. Its randomly generated master key is persisted inside Redis. Back up the whole database, including `mo:v1:master`; losing that key makes online archives unreadable. This small-game service has not had an independent security audit. Never reuse a banking or account PIN.

## Reconstruction status

This is an independently reconstructed playable game, not recovered original source. It now includes a purple art-deco city, moving traffic and pedestrians, labeled minimap routes, an original HD backdrop and layered elemental effects. WebGL lighting uses the GPU selected by the browser, with a 2D fallback; it is not NVIDIA RTX or photorealistic 3D. The expanded campaign has 72 compact missions across 24 acts, with newly written unofficial X-Men / Final Fantasy crossover dialogue. Playtime comparable to FFVII is not claimed. See RECONSTRUCTION_STATUS.md and ART_CREDITS.md.
