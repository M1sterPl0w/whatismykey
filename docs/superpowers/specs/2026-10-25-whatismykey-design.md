# WhatIsMyKey: Design

## Intent

My partner plays guitar and improvises over songs. She hears a song, finds a chord sheet (lyrics with chords, sometimes a capo note), and wants to know which key the song is in and which scales she can improvise with. Today she has to work this out by hand. The app does it for her.

## Goals

- She enters the chords of a song, plus an optional capo fret, and gets the likely key(s) and the scales that fit.
- Works on her iPhone and on Android, installed to the home screen from a web page.
- Phase 2: fill in the chords by listening through the microphone instead of typing.

## Non-goals

- No App Store or Play Store release.
- No accounts, no server, no saved songs in phase 1.
- No lyrics display or chord sheet rendering.
- Not a general music theory tool.

## Anti-goals

- A wrong key shown with false confidence. When chords fit several keys, show them honestly.
- A design where phase 2 needs a rewrite of phase 1.

## Constraints

- Developer machine is Fedora Linux. No Mac, and Windows is a last resort. This rules out native iOS builds and .NET MAUI.
- Microphone access in browsers needs HTTPS. Hosting is GitHub Pages (agreed).
- Phase 2 must run in the phone browser. No server.

## Approaches considered

1. Plain HTML and JavaScript, no build step. Easy start, gets messy as logic and phase 2 audio grow.
2. TypeScript with Vite as an installable web app (PWA). Music logic in typed, testable modules, thin UI on top, microphone module can be added later. Chosen.
3. Native app (Flutter or .NET MAUI). Better feel, but the iPhone build needs a Mac. Rejected.

Decision: option 2, agreed with the user. GitHub Pages hosting agreed.

## Behaviour (as agreed)

- Input: the chords as shown on the chord sheet (the shapes she plays), and an optional capo fret. She taps them with buttons: a root note, then a quality (major, minor, 7 and so on), plus a capo fret control. Typed text input may come later, so the chord parser stays separate from the buttons.
- The capo raises every chord by that many semitones. The app reports the **sounding** key, so G, C, D with capo 2 gives A major.
- Output: the likely keys, since chords often fit several (Am, C, G fits C major and A minor). Each key comes with its scales.
- Scales: all common ones, chosen by the user from chips: major, minor, major and minor pentatonic, blues, and the modes (Dorian, Phrygian, Lydian, Mixolydian, Locrian).
- Display of the chosen scale: note names and a fretboard diagram together. The fretboard shows 12 frets, standard tuning, root notes highlighted.

## Architecture (builder's call within this shape)

- Pure logic modules, no DOM, unit tested: chord parser, capo transposition, key detection, scale definitions.
- A thin UI layer: chord input, capo control, key list, scale chips, note names and fretboard.
- Phase 2 adds a separate audio module that produces chords and feeds the same logic.
- PWA: web manifest and service worker so it installs to the home screen and works offline.

## Decisions I made (not discussed with the user)

- Chord parsing handles common sheet notation: major, minor, 7, maj7, m7, sus, dim, aug, slash bass notes.
- Key detection ranks candidate keys by how many of the chords are diatonic to the key, with a bonus for the first and last chord matching the key's tonic. Ties are shown together, best first.
- Standard tuning only. Left-handed and alternate tunings are out of scope.
- Phase 2 chord recognition approach (chroma features with template matching) is left to the builder when phase 2 starts.

## More decisions I made after the builder check (not discussed with the user)

- Minor keys use natural minor, plus a major V and V7 (harmonic minor), so Am, Dm, E counts as A minor.
- A chord counts as diatonic when all its notes fit the key's scale, not by exact root and quality. Sus, aug and other chords with no home score as non-fitting. For slash chords only the chord root counts, not the bass note.
- The detector lists at most 3 keys, best first. A relative major and minor pair are two separate entries. A clear winner is marked as "most likely". Tied keys are shown together without that mark. If the best key fits fewer than about 60% of the chords, the app says the key is unclear.
- Chords are entered in song order, so the first and last chord can count. Input accepts `#`, `b`, and the Unicode sharp and flat signs. Note names print with the spelling of the key (flats for flat keys).
- The plan covers phase 1 only, plus a defined seam: the audio module will output a list of chord symbols into the same parser and detector.
- The fretboard shows sounding notes (capo already applied) and does not draw the capo. It shows string names, fret markers, the chosen scale's notes, and the root in a different colour.
- The repo name and the GitHub Pages base path are set when the repo is created. Deploy through GitHub Actions.

## Left to the builder

- Framework choice for the UI layer (or none), test runner, styling, project layout.
- Exact ranking weights for key detection.
- Visual design details beyond the agreed mockup.
