# Tasks

## 1. Capo reset

- [x] 1.1 Reset the capo to 0 in the `clear` action in `src/main.ts` and keep it unchanged when a single chord is removed; verify in a real browser that capo 7 then Clear then Em, Am, Bm, C gives E minor, and that removing one chord keeps the capo.

## 2. Upright fretboard

- [x] 2.1 Add the `upright` layout to `fretboardSvg` in `src/fretboard.ts` (strings as columns with low E on the left, 12 fret rows, nut at the top, fret markers and string names), with tests that A major has the same marks as the flat layout (every A root-coloured, open G unmarked, string order reversed) and that marks are at least 28 px across; verify `npm test` passes.

## 3. Full-screen view

- [x] 3.1 Add `zoomed` state, make the fretboard tappable, draw the full-screen overlay with a close button (at least 40 px) and theme styles in `src/style.css`; verify with Playwright at 360 px wide in light and dark that tapping opens the view, the A major notes match, nothing scrolls sideways, and Close returns with the same key and scale selected.
