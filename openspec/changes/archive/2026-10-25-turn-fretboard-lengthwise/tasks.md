# Tasks

## 1. String order

- [x] 1.1 Reverse the string order in `fretboardSvg` so low E is on top, and update `src/fretboard.test.ts` for the new `data-string` indexes and a test for the order E, A, D, G, B, e; verify `npm test` passes and the small fretboard on the main screen shows low E on top in a real browser.

## 2. Lengthwise full-screen view

- [x] 2.1 Remove the upright layout and its tests, show the flat SVG in the overlay, and add the portrait rotation and landscape styles in `src/style.css` with the close button outside the turned picture; verify with Playwright at 360 by 740 (portrait, turned) and 740 by 360 (landscape, not turned), light and dark: marks at least 28 px, labels at least 12 px, no page scroll sideways, same 47 marks as the small view, and Close keeps the key and scale.
