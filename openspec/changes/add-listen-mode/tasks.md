# Tasks

## 1. Chord recognition

- [x] 1.1 Add `src/recognise.ts` with a pure function from note events (start, end, pitch, strength) to chords (frame profile, template match for major, minor and 7, median smoothing, 0.4 s minimum, repeats merged) and `src/recognise.test.ts` covering every `chord-recognition` scenario; verify `npm test` passes.

## 2. Model in the browser

- [x] 2.1 Add `@spotify/basic-pitch` and `@tensorflow/tfjs`, copy the model files to `public/model/`, and add `src/listen.ts` (lazy loaded) that turns an audio buffer at 22,050 Hz into note events; verify in a real browser (Playwright) that a synthetic recording of A, D, E gives the notes of those chords, and record the extra download size of the lazy chunk and the model in the PR.
- [x] 2.2 Cache the model files offline in `vite.config.ts` and check that `npm run build` and `npm test` still pass; verify in Playwright that after one visit, going offline still analyses the recording.

## 3. Recording

- [x] 3.1 Add microphone capture (AudioWorklet, echo cancellation, noise suppression and auto gain off, resample to 22,050 Hz, 60 s limit) to `src/listen.ts`; verify with Chromium's fake microphone playing a WAV file that the captured audio has the right length and analyses to the right chords.

## 4. Listen button

- [x] 4.1 Add the Listen and Stop button, listening and analysing states, the messages for denied permission, no microphone, failure and nothing heard, and append heard chords lowered by the capo, with a tested helper for the capo lowering and styles for both themes; verify with Playwright (fake microphone, 360 px wide, light and dark) that A, D, E at capo 0 gives `A D E` and A major, at capo 2 gives `G C D` and A major, and that denied permission leaves the list unchanged.
- [x] 4.2 Verify that no network request carries audio while analysing, and that the recording is not stored after it.

## 5. Real recording check

- [ ] 5.1 Run the app on a real recording supplied by the user (a 20 to 30 second song clip) and report the heard chords, the keys found, and whether they are right; document Listen in `README.md`.
