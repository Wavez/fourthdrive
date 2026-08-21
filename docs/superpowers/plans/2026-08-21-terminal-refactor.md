# Terminal Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split terminal content and animation responsibilities out of the page entry point without changing the current visual behavior.

**Architecture:** Pure terminal content helpers live in `src/terminal/content.js`; the DOM-driven readout state machine lives in `src/terminal/readout.js`; `src/index.js` imports the readout controller and keeps page-level integrations. The readout exposes `startTerminalReadout()` and `stopTerminalReadout()` so HMR cleanup remains explicit.

**Tech Stack:** Vite, browser ES modules, vanilla DOM APIs, Node test runner.

**Spec:** `docs/superpowers/specs/2026-08-21-terminal-refactor-design.md`

## Global Constraints

- Keep the existing Vite setup and browser-only implementation.
- Keep one cancellable terminal timer and dispose it during HMR.
- Preserve `prefers-reduced-motion` behavior.
- Do not alter the visual layout or logo/player behavior.

---

### Task 1: Extract terminal content helpers

**Files:**
- Create: `src/terminal/content.js`
- Modify: `src/index.js`
- Test: `test/techno-bunker.test.mjs`

**Interfaces:**
- Produces named exports `terminalTiming`, `terminalNavigation`, `createTerminalLine`, `getCommandResponse`, `getTransmissionResponse`, `buildTerminalTimestamp`, `buildDecodeLine`, `buildRandomTerminalLine`, `mutateTerminalText`, `nextTerminalLine`, and `terminalLineFactories`.
- `nextTerminalLine(lines, previousIndex)` returns a different valid index or `0` for a one-item list.
- `createTerminalLine(factory)` returns a generated string.

- [ ] **Step 1: Add module-boundary assertions**

Add static assertions that `src/terminal/content.js` exists and exports the content helpers, while preserving the current assertions for the generated phrases.

- [ ] **Step 2: Run the test suite and confirm the new boundary assertions fail**

Run `npm test`. Expected: failure because `src/terminal/content.js` does not exist yet.

- [ ] **Step 3: Move pure constants and helpers into `src/terminal/content.js`**

Move the terminal timing/navigation configuration, random line factories, mixed-language fragments, impossible lines, glyph mutation helper, response helpers, and line-selection helper. Keep the functions browser-independent except for no DOM usage.

- [ ] **Step 4: Import the extracted helpers from `src/index.js`**

Remove the duplicated definitions from `src/index.js` and import the named exports.

- [ ] **Step 5: Run tests and build**

Run `npm test && npm run build && git diff --check`. Expected: all tests pass and Vite builds successfully.

### Task 2: Extract the terminal readout state machine

**Files:**
- Create: `src/terminal/readout.js`
- Modify: `src/index.js`
- Test: `test/techno-bunker.test.mjs`

**Interfaces:**
- `startTerminalReadout({ output, prefersReducedMotion })` starts one cancellable timer and owns local animation state.
- `stopTerminalReadout()` clears the active timer and sets it to `null`.
- The controller uses the content exports from Task 1.

- [ ] **Step 1: Add readout module boundary assertions**

Assert that the readout module exports both lifecycle functions and contains the capped command-history behavior.

- [ ] **Step 2: Run tests to confirm the assertions fail**

Run `npm test`. Expected: failure because `src/terminal/readout.js` does not exist yet.

- [ ] **Step 3: Move the DOM animation state machine**

Move `selectRandomTerminalWord`, `simulateTerminalNavigation`, `scheduleTerminalPhase`, `beginNextTerminalLine`, `tick`, and the local `commandHistory` into `readout.js`. Cap history with `commandHistory.push(line); if (commandHistory.length > 12) commandHistory.shift();`.

- [ ] **Step 4: Replace inline startup with the controller**

In `src/index.js`, call `startTerminalReadout({ output: elements.terminalReadout?.querySelector('.terminal-readout__text'), prefersReducedMotion: state.prefersReducedMotion })` and call `stopTerminalReadout()` from HMR disposal.

- [ ] **Step 5: Run tests and build**

Run `npm test && npm run build && git diff --check`. Expected: all tests pass and Vite builds successfully.

### Task 3: Split page-level integrations and harden tests

**Files:**
- Create: `src/status-cycle.js`
- Create: `src/social-glitch.js`
- Create: `src/spotify.js`
- Modify: `src/index.js`
- Modify: `test/techno-bunker.test.mjs`

**Interfaces:**
- `startStatusCycle({ glyph, phase, prefersReducedMotion })` and `stopStatusCycle()` own lunar/status timing.
- `startSocialGlitch({ container, prefersReducedMotion })` and `stopSocialGlitch()` own icon glitch timing and hover listeners.
- `setupSpotify({ player, spinner })` owns Spotify API readiness and reveal behavior.

- [ ] **Step 1: Add lifecycle export assertions**

Assert each new module exports its start/stop or setup function and that the entry point imports them.

- [ ] **Step 2: Run tests to confirm the assertions fail**

Run `npm test`. Expected: failure because the modules do not exist yet.

- [ ] **Step 3: Extract each page integration**

Move the corresponding functions and state into the focused modules, preserving current CSS classes, timing values, hover behavior, Spotify URL data attribute, and HMR cleanup.

- [ ] **Step 4: Reduce `src/index.js` to bootstrap code**

Keep element lookup, reduced-motion preference, module startup, event wiring, and the existing touchmove guard. Remove terminal, Spotify, status, and social implementation details.

- [ ] **Step 5: Run the complete verification suite**

Run `npm test && npm run build && git diff --check`; inspect `git diff --stat` and confirm `.DS_Store` files remain untracked and untouched.
