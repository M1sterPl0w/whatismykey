# Spec Delta

## Purpose

Lets her put the app on her phone's home screen so it opens like an installed app.

## ADDED Requirements

### Requirement: Installable manifest
The app SHALL provide a web app manifest with the name "WhatIsMyKey", a start URL and scope inside `/whatismykey/`, `standalone` display, and icons of 192 px and 512 px, including a maskable icon.

#### Scenario: Manifest is valid
- **WHEN** the built site is inspected
- **THEN** the manifest is linked from the page and contains the name, scope, display mode and the icons, and every icon file exists

### Requirement: iPhone home screen support
The app SHALL provide a 180 px touch icon and the tags that make iPhone Safari open the added app full screen with the name "WhatIsMyKey".

#### Scenario: iPhone tags present
- **WHEN** the built page is inspected
- **THEN** it links an apple touch icon and sets the web app capable and title tags

### Requirement: Theme colour
The app SHALL set the browser and status bar colour to the cream of the light theme and to the near-black of the dark theme, following the phone's colour scheme.

#### Scenario: Dark phone
- **WHEN** the phone is set to dark mode
- **THEN** the theme colour is the dark background colour

### Requirement: Base path
All links to the manifest, icons and service worker SHALL work when the app is served from `/whatismykey/`.

#### Scenario: Served from the sub path
- **WHEN** the built site is served at `/whatismykey/`
- **THEN** the manifest, icons and service worker all load with status 200
