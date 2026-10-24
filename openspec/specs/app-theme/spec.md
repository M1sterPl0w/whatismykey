# app-theme Specification

## Purpose
Gives the app a light songbook look and a dark stage look that work on a phone screen.

## Requirements

### Requirement: Follow the phone's colour scheme
The app SHALL use the light theme by default and the dark theme when the phone is set to dark mode, and SHALL switch when that setting changes.

#### Scenario: Dark phone
- **WHEN** the phone is set to dark mode
- **THEN** the app shows the dark theme

### Requirement: Light theme
The light theme SHALL use a cream background, wood-brown text and a rust accent, with square-cornered buttons.

#### Scenario: Light look
- **WHEN** the phone is set to light mode
- **THEN** the page background is cream, buttons are square-cornered and the accent is rust

### Requirement: Dark theme
The dark theme SHALL use a near-black background and an amber accent, with the same square-cornered buttons as the light theme.

#### Scenario: Dark look
- **WHEN** the dark theme is shown
- **THEN** the background is near-black, the accent is amber and buttons are square-cornered

### Requirement: Phone layout
The app SHALL fit a 360 px wide screen without sideways scrolling of the page and SHALL keep all tap targets at least 40 px high.

#### Scenario: Narrow screen
- **WHEN** the screen is 360 px wide
- **THEN** the page does not scroll sideways and every button is at least 40 px high
