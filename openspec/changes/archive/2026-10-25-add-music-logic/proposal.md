# Proposal

## Why

WhatIsMyKey has no behavior yet. Every screen, and the phase 2 microphone input, depends on the same music logic: turn the chords of a song into its likely keys and the scales that fit. Building this logic first, without any UI, keeps it testable and lets the UI and the microphone input both plug into it.

## What Changes

- Add a chord model that parses chord symbols (major, minor, 7, maj7, m7, sus, dim, aug, slash chords; `#`, `b` and Unicode accidentals) and applies a capo fret to give sounding chords.
- Add key detection that ranks candidate major and minor keys for an ordered chord sequence, with a confidence signal.
- Add a scale catalog: major, natural minor, major and minor pentatonic, blues, and the five other modes, with note names spelled for the key.
- Add a unit test suite for all of the above.

No UI, no microphone input, no PWA setup in this change.

## Capabilities

### New Capabilities
- `chord-parsing`: reading chord symbols, applying a capo, and reporting the sounding chords.
- `key-detection`: ranking likely keys for an ordered list of sounding chords, including ties and an "unclear" result.
- `scale-catalog`: the scales available for a key, with their notes spelled correctly for that key.

### Modified Capabilities

## Impact

- New TypeScript modules under `src/`, with no DOM dependency.
- Vitest tests, run by `npm test` and by the GitHub Pages workflow before every deploy.
- No new runtime dependencies.
