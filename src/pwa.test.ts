import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Reads the built site, so `npm test` builds first (see the pretest script).
const dist = (path: string) => `dist/${path}`;
const page = readFileSync(dist('index.html'), 'utf8');
const manifest = JSON.parse(readFileSync(dist('manifest.webmanifest'), 'utf8'));

describe('install manifest', () => {
  it('is linked from the page under the base path', () => {
    expect(page).toContain('<link rel="manifest" href="/whatismykey/manifest.webmanifest">');
  });

  it('has the name, scope and display mode', () => {
    expect(manifest).toMatchObject({
      name: 'WhatIsMyKey',
      start_url: '/whatismykey/',
      scope: '/whatismykey/',
      display: 'standalone',
    });
  });

  it('lists 192 and 512 icons and a maskable one, and every file exists', () => {
    const sizes = manifest.icons.map((icon: { sizes: string }) => icon.sizes);
    expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']));
    expect(manifest.icons.some((icon: { purpose?: string }) => icon.purpose === 'maskable')).toBe(true);
    for (const icon of manifest.icons) expect(existsSync(dist(icon.src))).toBe(true);
  });
});

describe('iPhone home screen tags', () => {
  it('links the touch icon and sets the app title', () => {
    expect(page).toContain('<link rel="apple-touch-icon" href="/whatismykey/apple-touch-icon.png"');
    expect(existsSync(dist('apple-touch-icon.png'))).toBe(true);
    expect(page).toContain('name="apple-mobile-web-app-capable" content="yes"');
    expect(page).toContain('name="apple-mobile-web-app-title" content="WhatIsMyKey"');
  });
});

describe('theme colour', () => {
  it('follows the colour scheme', () => {
    expect(page).toContain('content="#f6efe0" media="(prefers-color-scheme: light)"');
    expect(page).toContain('content="#15151b" media="(prefers-color-scheme: dark)"');
  });
});

describe('service worker', () => {
  it('is built and registered by the app', () => {
    expect(existsSync(dist('sw.js'))).toBe(true);
    const bundle = readdirSync(dist('assets')).find((file) => file.endsWith('.js'))!;
    expect(readFileSync(dist(`assets/${bundle}`), 'utf8')).toContain('sw.js');
  });
});
