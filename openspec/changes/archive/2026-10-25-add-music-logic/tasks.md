# Tasks

## 1. Note helpers

- [x] 1.1 Add `src/notes.ts` with pitch class parsing (`#`, `b`, Unicode accidentals), key-aware spelling and the flat or sharp key rule, with `src/notes.test.ts`; verify `npm test` passes, including `F♯` equals `Gb` as a pitch and spelling for F major and D major.

## 2. Chord parsing and capo

- [x] 2.1 Add `src/chord.ts` to parse symbols (all supported qualities, slash chords) and return a chord or an error, with tests for every `chord-parsing` scenario on parsing and accidentals; verify `npm test` passes.
- [x] 2.2 Add capo transposition (0 to 12, bass note included, error outside the range) to `src/chord.ts`, with tests for the capo scenarios; verify G, C, D with capo 2 gives A, D, E.

## 3. Scale catalog

- [x] 3.1 Add `src/scales.ts` with the ten scales as interval data and note computation spelled for the key, with `src/scales.test.ts` covering A major, A minor pentatonic, A blues, E Mixolydian, F major and D major; verify `npm test` passes.
- [x] 3.2 Add the scales-for-a-key function that lists the key's own scale first, with tests for A major and F# minor; verify `npm test` passes.

## 4. Key detection

- [x] 4.1 Add `src/key.ts` to score all 24 keys by fitting chords (minor keys accept major V and V7, slash chords use the root, non-fitting chords counted), return the top 3, and handle empty input, with tests for the clear major, minor with major V, sus chord and no chords scenarios; verify `npm test` passes.
- [x] 4.2 Add first and last chord tonic bonus, `mostLikely`, ties and `unclear` (below 60% fit) with named constants for the weights, and tests for the relative major and minor, tie and unclear scenarios; verify `npm test` passes and `Am C G Am` ranks A minor above C major while `C G Am C` ranks C major above A minor.

## 5. Integration check

- [x] 5.1 Add a test that runs the whole path (chord symbols, capo, key detection, scales for the best key) for G, C, D with capo 2 and expects A major with its scales; verify `npm test` and `npm run build` both pass.
