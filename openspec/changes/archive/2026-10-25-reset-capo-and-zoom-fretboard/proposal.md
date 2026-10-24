# Proposal

## Why

Two things went wrong in real use. A capo left on 7 from the last song made Em, Am, Bm, C show B minor instead of E minor, and Clear did not reset it. And the fretboard is too small on a phone: at 360 px wide, each fret is about 26 px and the note labels are hard to read.

## What Changes

- Clear resets the capo to 0 as well as emptying the chord list.
- Tapping the fretboard opens a full-screen view with the neck drawn upright (strings vertical, nut at the top), so the notes get about twice as much room. A close button returns to the normal screen.

## Capabilities

### New Capabilities

### Modified Capabilities
- `chord-entry`: Clear also resets the capo to 0.
- `scale-display`: the fretboard can be opened full screen, drawn upright and larger.

## Impact

- `src/main.ts` (clear action, zoom state and overlay), `src/fretboard.ts` (upright layout), `src/style.css` (overlay).
- No new dependencies. The existing fretboard tests stay valid and gain upright-layout tests.
