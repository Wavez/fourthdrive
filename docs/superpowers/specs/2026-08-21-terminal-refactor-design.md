# Terminal Refactor Design

## Goal

Separate the growing terminal animation from the page bootstrap so future terminal behavior can be added without expanding `src/index.js`.

## Design

The terminal will be split into focused modules. `terminal/content.js` owns data and pure text-generation helpers. `terminal/readout.js` owns the DOM animation state machine, timer lifecycle, command history, and reduced-motion behavior. The page entry point will retain only element discovery, Spotify setup, status cycling, social glitch behavior, and module startup/cleanup.

The refactor preserves the current one-line terminal experience, randomized commands/transmissions, navigation bursts, responses, glyph mutation, and clear-to-next-line behavior. Command history is capped at 12 entries to prevent unbounded session growth. Existing static smoke tests remain, with focused pure-function tests added for content and history behavior.

## Constraints

- Keep the existing Vite setup and browser-only implementation.
- Keep one cancellable terminal timer and dispose it during HMR.
- Preserve `prefers-reduced-motion` behavior.
- Do not alter the visual layout or logo/player behavior.
