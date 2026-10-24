# Design

## Context

The app is plain TypeScript with a single state object and a `render()` function, built with Vite and published as an offline-capable PWA at `/whatismykey/`. The music logic (`chord`, `key`, `scales`) has no DOM code. See proposal.md for why Basic Pitch was chosen after a test on synthetic audio (scratch work, not part of the repo).

## Goals / Non-Goals

**Goals:**
- Record, analyse and add chords entirely on the phone, also offline.
- Keep the heavy code out of the first load; it loads when Listen is first used.
- Keep recognition as a pure, tested function that takes note events and returns chords, so it can be tuned without a microphone.

**Non-Goals:**
- Live chords while recording, chord qualities beyond major, minor and 7, saving recordings, and importing audio files.

## Decisions

- **Basic Pitch for notes, own code for chords.** `@spotify/basic-pitch` (Apache-2.0, TensorFlow.js, model about 900 KB) turns audio into note events. `src/recognise.ts` turns note events into chords. Alternative: plain frequency analysis. Rejected after the test: on full-band audio it found far fewer correct chords and the right key in the top 3 only 3 of 5 times against 5 of 5.
- **Chord matching:** per 0.1 s frame, build a 12-value note-name profile from the notes sounding (weighted by strength and overlap), compare it by cosine similarity with major, minor and 7 chord templates (root, third, fifth, and for 7 also the minor seventh), and take the best. Smooth with a median filter over about 0.9 s, then drop runs shorter than 0.4 s and merge repeats. The same values as in the test are the starting point and live in named constants.
- **Analyse on Stop, not live.** The model works on a finished audio buffer. Recording is kept in memory (at most 60 s, about 5 MB at 22.05 kHz) and analysed in one go, with a progress state. Live chords can be a later change that analyses overlapping chunks.
- **Capture with an AudioWorklet** that collects mono samples at the audio context's rate. The samples are resampled to 22,050 Hz with an `OfflineAudioContext`, which is what the model expects, so it works whatever rate the phone uses. Microphone constraints turn off echo cancellation, noise suppression and auto gain, since they distort music.
- **Heard chords stored as shapes.** Each heard chord is lowered by the capo fret before it is added, so the list always shows shapes and the key results stay right.
- **Lazy loading.** `import('./listen')` on the first tap loads TensorFlow.js and Basic Pitch. The model files are copied to `public/model/` and loaded by URL relative to the base path. `vite-plugin-pwa` is told to cache `json` and `bin` files, so the model is in the offline cache after the first visit.
- **Fixed test audio for end to end checks.** Chromium's fake microphone flags play a WAV file as the microphone, so the whole path can be checked in a real browser with synthetic recordings.

## Risks / Trade-offs

- [Chord accuracy on band music is low (about 42% in the test)] → Heard chords are plain list entries that are easy to remove, the key list shows up to 3 keys, and the unclear notice stays. Real-song results are checked with a clip from her before calling this done.
- [TensorFlow.js adds a large download and an older version (3.x) may not build or run cleanly with the current Vite] → It is lazy loaded. The first build step is a small proof that the model runs in the browser, and the size is measured and reported. If it fails, pause and choose between a newer TensorFlow.js and an ONNX runtime.
- [Analysis may be slow on older phones] → The model is small (inference took about 0.2 s for 16 s of audio on a computer); the UI shows "Analysing" and stays responsive. Measured on a real phone by her after the release.
- [iPhone Safari microphone rules: needs a tap, HTTPS and the page in the foreground] → Recording starts from the Listen tap, and the app is served over HTTPS on GitHub Pages.

## Open Questions

- Whether a short extra pass that looks at the bass note improves the chord choice. It can be tried later with the pure recognition function and the test clips, without changing the specs.
