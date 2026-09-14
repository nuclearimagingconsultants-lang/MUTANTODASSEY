# Mutant Odyssey

A browser superpower adventure, made with love from Cesar to his niece.

## Play

Choose **Begin your own story** to create a hero, or **Import save** to restore your own backup. WASD / arrow keys move, Enter interacts, M opens the Atlas. The minimap is at the upper right during exploration, including landscape screens. It is hidden during combat.

## Vercel deployment

Connect this repository to Vercel. Framework: **Other**. Build command: `node build.mjs`. Output directory: `dist`. No packages or secrets are required. Pushes to the production branch publish updates without changing the site's main address. Vercel configuration is included.

The build copies only approved game assets. `ashford.png` lives at the repository root to simplify browser uploads; the build places it at `dist/assets/ashford.png`.

## Save safety

This public repository contains **no Cesar personal save, recovery PIN, selfie, or conversation archive**. Your device saves are stored in your browser, separately for each website address. Before moving from a localhost game, use **Save → Export backup JSON**, then import that backup on the permanent site. Never upload your personal JSON to this public repository.

This static Vercel edition does **not** provide an online save database. Device PIN recovery and timestamped local saves still work; cross-device PIN recovery is not enabled. Export backups to move progress between devices. Do not rely on Vercel function local files for persistent saves.

## Reconstruction status

This is an independently reconstructed playable game, not recovered original source. See RECONSTRUCTION_STATUS.md for scope and ART_CREDITS.md for artwork information. Additional city and combat visual upgrades remain in development.
