# Proposal

## Why

The full-screen fretboard is drawn upright, with the strings running up and down. She holds the phone along the neck of her guitar, so the picture should look like the neck does from where she sits: nut on the left, frets running to the right, thick low E string on top. The upright picture looks wrong next to the real neck.

## What Changes

- The fretboard everywhere (small view and full screen) draws the low E string on top and the high e string at the bottom, like looking down at a guitar neck.
- The full-screen view is drawn lengthwise, with the nut on the left, and fills the long side of the screen. In landscape it is shown as is; in portrait it is turned a quarter turn so it still fills the screen, ready for her to turn the phone along the neck.
- The upright layout is removed.

## Capabilities

### New Capabilities

### Modified Capabilities
- `scale-display`: string order of the fretboard and the layout of the enlarged view.

## Impact

- `src/fretboard.ts` (string order, remove the upright layout), `src/main.ts` and `src/style.css` (full-screen view), `src/fretboard.test.ts`.
- Marks in the enlarged view become larger than in the upright view on most phones, since the full screen length is used.
