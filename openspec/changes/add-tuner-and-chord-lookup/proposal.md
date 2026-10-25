# Proposal

## Why

The app only does one job: find the key of a song. A guitarist who opens it also wants to tune up first and look up how to play a chord from the song. Both fit the same phone-first, offline-capable app, so one screen is no longer enough.

## What Changes

- Add a row of three navigation buttons at the top: **Key** (the current screen, default), **Tuner** and **Chords**.
- Add a guitar tuner: listens through the microphone, shows the detected note and a needle for how far it is from the target, with a choice of tunings (standard, half step down, whole step down "D", drop D, DADGAD, open G, open D).
- Add a chord lookup: pick a root and type and see several grips of that chord at different places on the neck, shown as chord diagrams.
- The Key screen keeps working exactly as today; its chord list, capo, keys and results stay when switching tabs.

## Capabilities

### New Capabilities
- `app-navigation`: top row of three buttons that switches between the Key, Tuner and Chords screens.
- `guitar-tuner`: microphone pitch detection with a needle display and selectable tunings.
- `chord-lookup`: look up a chord and see alternative grips in chord diagrams.

### Modified Capabilities

## Impact

- `src/main.ts`: navigation state and rendering per screen; `src/style.css`: tab row, needle, chord diagrams.
- New modules for pitch detection, tunings, chord grips and chord diagram drawing, each with unit tests.
- No new dependencies. Pitch detection runs in the page on the audio stream; the app stays usable offline.
- Microphone permission is now also asked by the tuner (already asked by Listen).
