# Proposal

## Why

She will use the app next to her guitar, often with a weak or no connection, and wants it on her home screen like any other app. A plain web page can't do that: it needs the network every time and opens inside the browser with its address bar.

## What Changes

- Add a web app manifest, icons and the iPhone home-screen tags, so the app installs from Safari ("Add to Home Screen") and Android Chrome and opens full screen.
- Add a service worker that stores the app on the phone after the first visit, so it opens and works with no connection.
- Update itself in the background when a new version is deployed, and tell the user when a new version is ready.
- Match the status bar colour to the light and dark themes.

No microphone input and no store release in this change.

## Capabilities

### New Capabilities
- `app-install`: installing the app to the home screen with a name, icon and full-screen launch.
- `offline-use`: working with no connection and picking up new versions.

### Modified Capabilities

## Impact

- New dev dependency `vite-plugin-pwa`, changes to `vite.config.ts` and `index.html`, an icon set under `public/`, and a small update notice in the UI.
- GitHub Pages serves the app from `/whatismykey/`, so every path must respect that base path.
- The deploy workflow stays the same.
