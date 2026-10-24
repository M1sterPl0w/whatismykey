# Spec Delta

## Purpose

Shows which keys the chords point to and how sure the app is, so the player is not told one key with false confidence.

## ADDED Requirements

### Requirement: Show the detected keys
The app SHALL list the detected keys, best first, up to three. The key names SHALL use the spelling of the key (for example `Bb major`, `F# minor`).

#### Scenario: Keys for a progression
- **WHEN** the sounding chords are `A D E`
- **THEN** the list starts with `A major`

### Requirement: Mark the most likely key
The app SHALL visibly mark the most likely key when the detection reports one, and SHALL NOT mark any key when it reports a tie.

#### Scenario: Clear winner
- **WHEN** detection reports a most likely key
- **THEN** that key is shown with a "most likely" label

#### Scenario: Tie
- **WHEN** detection reports tied keys
- **THEN** the tied keys are shown with no "most likely" label

### Requirement: Say when the key is unclear
The app SHALL show a notice that the key is unclear when detection reports it, and SHALL still list the keys it found.

#### Scenario: Unclear key
- **WHEN** detection reports an unclear result
- **THEN** a notice says the key is unclear and the best guesses are still listed

### Requirement: Choose which key to explore
The app SHALL let the user tap a listed key to show its scales. The first key SHALL be selected by default.

#### Scenario: Select another key
- **WHEN** two keys are listed and the user taps the second
- **THEN** the scale area shows scales for the second key

### Requirement: Empty state
The app SHALL show a short prompt to add chords when the list is empty.

#### Scenario: No chords yet
- **WHEN** the app first opens
- **THEN** it shows a prompt to add chords and no key list
