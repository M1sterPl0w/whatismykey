# Design

## Context

The repo is a Vite and TypeScript scaffold with a placeholder `src/main.ts` and a Vitest setup that passes with no tests. The agreed overall design is in `docs/superpowers/specs/2026-10-25-whatismykey-design.md`. This change implements only the pure logic, with no DOM. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Pure, typed functions with no DOM or browser dependency, so the same code serves the button UI now and microphone input in phase 2.
- Behaviour fully covered by unit tests, taken from the spec scenarios.

**Non-Goals:**
- UI, fretboard drawing, PWA setup and audio input.
- Tunings other than standard, and chord shapes (finger positions).

## Decisions

- **Pitch classes as integers 0-11 (C = 0).** All maths (capo shift, scale building, chord membership) works on integers. Spelling happens only when printing a note name. Alternative: note-name strings everywhere. Rejected, because transposing and comparing spellings is error-prone.
- **Chord model:** `{ root: number, quality, bass?: number }`. The parser accepts a symbol string and returns either a chord or an error. Qualities map to semitone interval sets, which is what key detection tests against a scale.
- **Key scoring:** each of the 24 keys gets a score of fitting chords divided by total chords, plus a fixed bonus when the first chord and when the last chord is the tonic chord of the key. Minor keys accept the major V and V7. The bonus is small enough that a key fitting fewer chords cannot win through it alone. Keys are sorted by score, and the top 3 are returned. Alternative: a Krumhansl-Schmuckler profile on note weights. Rejected for phase 1: it needs durations and it is harder for the player to understand why a key was chosen.
- **Result shape for detection:** a list of `{ key, score, fitting, total }` plus `mostLikely` (the top key, only when its score is strictly higher than the second) and `unclear` (best fit below 0.6).
- **Spelling:** a key uses flats when it is one of F, Bb, Eb, Ab, Db, Gb major or one of their relative minors (D, G, C, F, Bb, Eb minor). Otherwise it uses sharps. Seven-note scales are spelled by assigning each scale degree its own letter, so a letter never repeats. Pentatonic and blues scales take the spelling of the matching degrees of the parent key.
- **Scale catalog as data:** each scale is a name and an interval list. Adding a scale is a data change, not a code change.
- **File layout:** one module per capability (`chord.ts`, `key.ts`, `scales.ts`) and one shared `notes.ts` for pitch class and spelling helpers, each with a `*.test.ts` beside it.

## Risks / Trade-offs

- [The score weights are a judgement call and may rank oddly on real songs] → Keep the weights in named constants and cover the agreed examples (Am, C, G, Am vs C, G, Am, C) with tests. Tune after the player tries real songs.
- [Counting chords by fit ignores how long each chord lasts] → Accepted for phase 1, since typed chords have no duration. Revisit for phase 2.
- [Blues scale spelling has no single standard] → Use flat third, flat fifth spelled as b5 relative to the root, and cover it with the A blues scenario.
