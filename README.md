# WhatIsMyKey

Enter the chords of a song, with an optional capo fret, and see its likely keys and the scales to improvise with. Also has a guitar tuner and a chord lookup. Runs in the browser and works offline once installed.

Live: https://m1sterpl0w.github.io/whatismykey/

## Add to the home screen

- **iPhone:** open the link in Safari, tap Share, then "Add to Home Screen".
- **Android:** open the link in Chrome, tap the menu, then "Install app" or "Add to Home screen".

When a new version is deployed, a "A new version is ready" bar appears. Tap Reload to switch to it.

## Listen to a song

Tap **Listen**, let the phone hear the song or your guitar, then tap **Stop**. The heard chords are added to the end of the chord list (lowered by the capo fret, so the list keeps showing shapes). Remove the wrong ones with the × buttons. Only major, minor and 7 chords are recognised, and a full band recording gives many wrong chords, so check the list. The recording is analysed on the phone, never uploaded, and it works offline after the first visit. The first Listen downloads about 2.7 MB of extra code and model, which the app then keeps.

## Tuner

Open **Tuner**, tap **Start** and play a string. The needle shows how far the pitch is from the string it is closest to (tap a string to lock the target), and the note, frequency and cents are shown below it. Choose a tuning: Standard, Half step down, Whole step down (D), Drop D, DADGAD, Open G or Open D. Reference pitch is A = 440 Hz. The sound is analysed on the phone and never uploaded. Leaving the tab stops the microphone.

## Chord lookup

Open **Chords**, pick a root and a type, and see several grips for the chord (standard tuning), from the nut up the neck, as chord diagrams. **Add to song** puts the chord on the Key screen's list.

## Development

```
npm install
npm run dev      # dev server at http://localhost:5173/whatismykey/
npm test         # builds first, then runs the tests
npm run build
```

Changes go through OpenSpec (`openspec/`) and pull requests to `main`. Merging to `main` deploys to GitHub Pages.
