# Proposal

## Why

Phase 2 of the app: instead of tapping in the chords of a song, she can let the phone listen, to a song from a speaker or to her own guitar, and have the chords appear in the list. A synthetic-audio test (clean guitar, reverb and noise, and a full-band mix) showed that finding the notes with the Basic Pitch model and then matching chords gives clearly better results than plain frequency analysis on band music: the right key was in the top 3 in 5 of 5 band clips, against 3 of 5. Chord accuracy on band music is still low (about 42%), so the heard chords must be easy to fix by hand.

## What Changes

- Add a Listen button that records from the microphone and, on Stop, analyses the audio on the phone and adds the heard chords to the end of the chord list.
- Add chord recognition from note events: major, minor and 7 chords only, ignoring blips shorter than about 0.4 s and merging repeats.
- Load the Basic Pitch model and TensorFlow.js only when Listen is first used, and keep them in the offline cache so listening works with no connection.
- Handle microphone permission denied, no microphone, nothing heard, and a 60 second limit.

No audio is uploaded or stored. Live chords while listening and recognition of sus, dim and aug chords are not part of this change.

## Capabilities

### New Capabilities
- `chord-recognition`: turning detected notes over time into a list of chords.
- `listen-mode`: recording from the microphone and adding the heard chords to the list.

### Modified Capabilities
- `offline-use`: listening also works with no connection after the first visit.

## Impact

- New dependencies `@spotify/basic-pitch` (Apache-2.0) and `@tensorflow/tfjs`, loaded lazily; the model files (about 900 KB) are copied to `public/`.
- New modules under `src/`, changes to `src/main.ts`, `src/style.css`, `vite.config.ts` (cache the model files).
- The first Listen downloads the TensorFlow.js code; its size is measured during the build step and reported.
