# Design

## Context

`src/fretboard.ts` returns an SVG string with the neck lying flat (strings horizontal, 12 frets across). `main.ts` holds all state and redraws from it. The capo reset is one line in the `clear` case. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Notes large enough to read on a 360 px wide phone.
- No new dependency and no change to key or scale logic.

**Non-Goals:**
- Pinch zoom, landscape-specific layout, and handling the Android back button to close the view.

## Decisions

- **Upright layout instead of rotating the flat SVG.** `fretboardSvg(notes, orientation)` gets an `'upright'` option that draws strings as 6 columns (low E on the left, like a chord diagram) and frets as 12 rows with the nut at the top. Text stays upright and readable. Alternative: rotate the flat SVG 90 degrees with CSS. Rejected, because the note names would read sideways.
- **Same marks and data attributes.** Both layouts use the same `fb-note` and `fb-root` classes and `data-string`, `data-fret`, so the existing tests and styles apply and the notes cannot differ between the two views.
- **Zoom state in the one state object** (`zoomed: boolean`). `render()` draws an overlay `div` (fixed, full screen, theme background) with a close button and the upright SVG. Tapping the normal fretboard sets `zoomed = true`; the close button sets it false. Key, scale and chords are untouched.
- **Sizing.** The upright viewBox is 360 wide by 760 tall with string gap 56 and fret row 52, so marks are 30 px across and labels 14 px at 360 px width. The SVG scales to the screen, with `max-height: 100vh` so it never needs scrolling on a normal phone.
- **Capo reset in `clear` only.** Removing a single chord keeps the capo, since the song is the same.

## Risks / Trade-offs

- [The Android back button leaves the page instead of closing the view] → Accepted for now; the close button is always visible. Adding history handling can be a later change.
- [A tall view may not fit very small screens] → The SVG scales down to fit with `max-height`, and the 28 px mark rule is checked at 360 px by test.
