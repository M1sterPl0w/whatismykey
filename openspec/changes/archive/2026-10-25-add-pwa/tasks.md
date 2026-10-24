# Tasks

## 1. Icons and manifest

- [x] 1.1 Add `public/icon.svg` and the committed PNGs (180, 192, 512 and a maskable 512), then add `vite-plugin-pwa` to `vite.config.ts` with the manifest (name, scope and start URL under `/whatismykey/`, standalone, icons); verify `npm run build` writes `manifest.webmanifest` and every listed icon exists in `dist`.
- [x] 1.2 Add the iPhone tags and the two theme-colour tags to `index.html`; verify the built page contains them, and add a test that reads `dist/index.html` and the manifest for the install spec scenarios.

## 2. Offline use

- [x] 2.1 Configure the service worker to store all built files with `registerType: 'prompt'` and clean old caches; verify with Playwright against `dist` served at `/whatismykey/`: after one load, going offline and reloading still shows the app and G, C, D with capo 2 gives A major.

## 3. Updates

- [x] 3.1 Register the worker in `src/main.ts` and add the "update ready, Reload" bar with matching light and dark styles; verify with Playwright by building twice with a visible change, loading the first version, serving the second, and seeing the notice appear and Reload switch versions, and that no notice shows when nothing changed.

## 4. Deployed check

- [x] 4.1 After the deploy, verify the live `/whatismykey/` serves the manifest, icons and service worker with status 200, and document in `README.md` how to add the app to the home screen on iPhone and Android.
