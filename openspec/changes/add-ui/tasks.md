# Tasks

## 1. App shell and theme

- [x] 1.1 Replace the placeholder in `index.html` and `src/main.ts` with an app shell, a `src/style.css` with light and dark CSS variables and the square-cornered button style, and a single `render()` driven by one state object; verify `npm run build` passes and the page shows in light and dark when the browser colour scheme is switched.

## 2. Chord entry

- [x] 2.1 Add root buttons (2 rows of 6), quality buttons and an add button, with `src/view.ts` helpers that turn state into the chord list text, with tests; verify tapping G, major, add shows `G` and `npm test` passes.
- [x] 2.2 Add remove-one, clear-all and the capo control (0 to 12), with tests for removing the second of `G C D` and for clearing; verify the list keeps the entered shapes while the capo changes.

## 3. Key results

- [x] 3.1 Show the detected keys with the "most likely" label, the unclear notice, the empty prompt and tap-to-select, using `detectKeys` and `keyName`, with tests for the labels; verify G, C, D with capo 2 shows `A major` as most likely.

## 4. Scale display

- [x] 4.1 Add scale chips (key's own scale first) and the note name line, using `scalesForKey`; verify A major shows `A B C# D E F# G#` and tapping Blues shows the A blues notes.
- [x] 4.2 Add `fretboardSvg` in `src/fretboard.ts` with string names, fret markers at 3, 5, 7, 9 and 12, and root-colour marks, with tests for the marks on A major (open G string unmarked, every A root-coloured); verify the board renders in both themes.

## 5. Phone check

- [x] 5.1 Check the app at 360 px width: no sideways page scroll, all buttons at least 40 px high, and the fretboard labels readable; verify by running `npm run dev` and `npm run build` and fix anything found.
