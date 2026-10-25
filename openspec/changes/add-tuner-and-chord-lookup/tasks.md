# Tasks

## 1. Navigation

- [x] 1.1 Add `screen` to `State`, render a three-button tab row (Key, Tuner, Chords) above the active screen with `aria-pressed`, and style it in `src/style.css`; verify with a test in `src/view.test.ts` that the row marks the current screen and that switching keeps `chords`, `capo` and selected key
- [x] 1.2 Move the existing Key content behind `screen === 'key'` unchanged; verify existing tests still pass and `npm run build` succeeds

## 2. Tuner core

- [x] 2.1 Add `src/tunings.ts` with the seven tunings, A = 440 Hz note and cents maths, and nearest-string selection; verify unit tests cover each tuning's notes, 440 Hz = A, 110 Hz picks A in standard, and 73.4 Hz is in tune on the low string of Whole step down
- [x] 2.2 Add `src/pitch.ts` (normalised autocorrelation with parabolic interpolation, silence and clarity rejection); verify unit tests with synthetic sine and harmonic-rich waves from 70 Hz to 400 Hz detect within 1 cent, and noise or silence returns null
- [x] 2.3 Add smoothing of readings (median, short hold, return to waiting); verify unit tests for steadiness against one outlier and for returning to waiting after silence

## 3. Tuner screen

- [x] 3.1 Extract shared microphone and worklet setup from `src/listen.ts` and add a live streaming mode for the tuner; verify Listen tests and behaviour are unchanged
- [ ] 3.2 Build the Tuner screen: Start/Stop, tuning picker, string list with auto target and tap-to-lock, note name, Hz, cents, needle (±50 cents), in-tune state, waiting state, microphone error messages; update dynamic parts without a full render; verify view tests for text states and string/needle helpers, and manual check on a phone with a real guitar
- [ ] 3.3 Stop the microphone when leaving the Tuner screen or hiding the page, and disable Listen/Tuner start while the other runs; verify by test of the state transitions and a manual check that the browser mic indicator goes off

## 4. Chord grips

- [x] 4.1 Add `src/grips.ts` with open grips and movable shape templates, placement for any root, filtering to frets 0–13, and labels (open / fret n); verify unit tests for C major (open, A shape at 3, E shape at 8)
- [x] 4.2 Verify every one of the 12 roots × 9 types yields at least two grips, ordered low to high, with only chord tones and the root as lowest note unless labelled otherwise; add templates until the test passes
- [x] 4.3 Add `src/chorddiagram.ts` drawing a grip as SVG (strings, frets, dots with note names, root styling, open circles, crosses, barre bar, start fret number); verify unit tests on the SVG for open D (crosses on E and A, circle on D) and a barre at fret 8

## 5. Chords screen

- [ ] 5.1 Build the Chords screen: root and type pickers (reuse `ROOTS` and `QUALITIES`), chord name, hint when nothing is picked, list of grip diagrams, and an Add to song button that appends to `state.chords`; verify view tests and that the Key screen shows the added chord

## 6. Integration

- [x] 6.1 Update `README.md` for the three screens; verify the README matches the app
- [ ] 6.2 Run `npm test` and `npm run build`, then check offline: load once, go offline, confirm all three screens work; verify in the browser dev tools network panel
