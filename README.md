# WhatIsMyKey

Enter the chords of a song, with an optional capo fret, and see its likely keys and the scales to improvise with. Runs in the browser and works offline once installed.

Live: https://m1sterpl0w.github.io/whatismykey/

## Add to the home screen

- **iPhone:** open the link in Safari, tap Share, then "Add to Home Screen".
- **Android:** open the link in Chrome, tap the menu, then "Install app" or "Add to Home screen".

When a new version is deployed, a "A new version is ready" bar appears. Tap Reload to switch to it.

## Development

```
npm install
npm run dev      # dev server at http://localhost:5173/whatismykey/
npm test         # builds first, then runs the tests
npm run build
```

Changes go through OpenSpec (`openspec/`) and pull requests to `main`. Merging to `main` deploys to GitHub Pages.
