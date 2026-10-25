# Spec Delta

## Purpose
Lets the user move between the key finder, the tuner and the chord lookup from one row of buttons at the top of the app.

## ADDED Requirements

### Requirement: Three navigation buttons
The app SHALL show a row of three buttons at the top, labelled Key, Tuner and Chords, which stays visible on every screen. The button of the current screen SHALL be marked as selected.

#### Scenario: Default screen
- **WHEN** the app is opened
- **THEN** the Key button is selected and the screen shows the song chords and key results as before

#### Scenario: Switch screen
- **WHEN** the user taps Tuner
- **THEN** the tuner screen is shown, the Tuner button is selected and the Key screen content is hidden

### Requirement: Keep the Key screen state
Switching screens SHALL NOT clear the chord list, the capo, the selected key or the selected scale.

#### Scenario: Return to Key
- **WHEN** the chord list holds `G C D`, the user opens Chords and then taps Key
- **THEN** the list still shows `G C D` with its results

### Requirement: Stop the microphone when leaving a screen
Leaving the Tuner screen SHALL stop tuner listening and release the microphone.

#### Scenario: Leave the tuner
- **WHEN** the tuner is listening and the user taps Key
- **THEN** the microphone is released and the tuner is not listening when the user returns
