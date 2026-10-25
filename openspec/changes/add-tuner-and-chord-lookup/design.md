# Design

## Context

`src/main.ts` renders one screen into `#app` from a single `State` object via template strings and one delegated click handler. Fretboard drawing is in `src/fretboard.ts` as a pure function returning SVG, and microphone capture is in `src/listen.ts` (AudioWorklet that posts sample blocks, lazily imported). Pitch classes and chord intervals live in `src/notes.ts` and `src/chord.ts`. No framework, no router. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Add tab navigation without restructuring the Key screen.
- Detect pitch without a new dependency or model, accurately enough to show ±1 cent steps on a guitar's range (about 70–400 Hz fundamentals).
- Chord grips that are correct by construction and testable without a browser.

**Non-Goals:**
- Tunings for other instruments, non-standard reference pitch, chromatic mode without a target string.
- Chord grips in non-standard tunings or chord types beyond the nine existing ones.
- Sound playback of reference tones or chords.
- URL routing or deep links to tabs.

## Decisions

1. **Tab state in `State.screen: 'key' | 'tuner' | 'chords'`.** `render()` draws the tab row, then the screen. Key content is untouched. Alternative: a router; rejected as overkill for three screens and a PWA with one URL. Tabs use `aria-pressed` buttons like the rest of the UI.

2. **Tuner re-renders only its dynamic parts.** Detection updates several times a second; a full `innerHTML` render would flicker and drop button focus. The needle, note and cents text get stable element ids and are updated directly, as `listen-time` already is. Full render happens only on state changes (tuning, locked string, start/stop).

3. **Pitch detection: McLeod/YIN-style normalised autocorrelation on time-domain blocks, in a pure module (`src/pitch.ts`).** Input is a Float32Array and sample rate, output is frequency or null (null under an RMS threshold or low clarity). Pure, so it is unit-tested with synthetic sine and sawtooth waves. Parabolic interpolation for sub-sample accuracy, and the first strong peak is taken to avoid octave errors. Alternatives: FFT peak (poor resolution at low E), Basic Pitch (already bundled but built for polyphonic offline analysis, too slow and coarse for live tuning).

4. **Reuse capture code.** Extract the microphone and AudioWorklet setup in `src/listen.ts` so the tuner can stream blocks live while Listen keeps collecting and resampling. Tuner keeps a rolling window (~4096 samples at the device rate, no resample) and runs detection on each new block. Tuner module is lazily imported like `listen`.

5. **Smoothing.** Show the median of the last few detections and ignore a single outlier, so the needle is steady; hold the last reading for a short time after the note fades, then return to waiting. Exact constants are tuned in implementation against the unit tests.

6. **Tunings as data (`src/tunings.ts`).** Each tuning is a list of six MIDI note numbers with names. Target selection is "nearest string in cents". Cents = 1200·log2(f / target). A=440 fixed. Step-down tunings are the standard MIDI numbers minus 1 or 2.

7. **Chord grips as movable shape templates (`src/grips.ts`).** Each template is a fret offset per string (or muted) relative to a barre/root fret, tagged with the string its root sits on and the chord type. Open grips are listed explicitly per root. For a given chord, grips are produced by placing each template so its root lands on the chord's root, discarding placements that need frets above 13 (13 so that every chord keeps at least two grips, e.g. C#sus2), then verifying every sounded note is a chord tone from `CHORD_INTERVALS`. This verification is also a unit test over all 12×9 chords. Templates: E-shape and A-shape barres for all nine types, D-shape and C-shape for common ones, plus the usual open grips. Alternative: a hand-typed table of 108 chords; rejected as error-prone and hard to review.

8. **Chord diagram as pure SVG function (`src/chorddiagram.ts`)**, in the style of `fretboardSvg`, with the root dot styled via the existing `fb-root` class. Grips render in a vertical list on phone width.

9. **Add-to-song** pushes onto `state.chords` and calls `resetResults()`; the Key screen picks it up on return.

10. **Offline:** no new network assets; new modules join the existing service-worker precache through the build.

## Risks / Trade-offs

- [Octave errors or jitter on low E string] → normalised autocorrelation, clarity threshold, smoothing, and tests from 70 Hz to 400 Hz with harmonics-rich waves.
- [Phone microphones with auto gain or noise suppression distort pitch] → request the stream with the same filters off as Listen.
- [Mic stays on if the user leaves the tab] → stop on tab change and on `visibilitychange` hidden.
- [Some chord types have few playable grips at some roots] → at least two grips per chord is a tested requirement; if a template set yields fewer, add templates rather than weaken the spec.
- [Tuner and Listen both want the microphone] → only one active at a time; starting one is disabled while the other runs.
