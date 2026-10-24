# Proposal

## Why

The music logic works but nobody can use it. She needs a phone screen where she taps in the chords of a song, sets the capo, and sees the keys and scales. The look was chosen from mockups: a light "songbook" style, with a dark mode in the stage colours.

## What Changes

- Add chord entry with buttons: a root note row, a quality row, the chord list for the song, and a capo control.
- Add a key result area that shows the likely keys, which one is most likely, and when the key is unclear.
- Add scale display: scale chips, note names, and a 12-fret fretboard for the chosen scale.
- Add the light theme (cream and wood tones, square buttons) and a dark theme (stage colours, amber accent) that follows the phone setting.
- Replace the placeholder `src/main.ts` with the real app, wired to the existing music logic.

No microphone input, no saving of songs, and no offline install support in this change.

## Capabilities

### New Capabilities
- `chord-entry`: building the chord list and capo setting with buttons.
- `key-results`: showing the detected keys and how sure the app is.
- `scale-display`: choosing a scale and seeing it as note names and on a fretboard.
- `app-theme`: light and dark appearance and phone-friendly layout.

### Modified Capabilities

## Impact

- New UI code under `src/`, using the existing `chord`, `key`, `scales` and `notes` modules unchanged.
- `index.html` and a stylesheet change.
- No new runtime dependencies.
