# Spec Delta

## Purpose

Turns the notes found in a recording into the chords played over time, so they can be added to the chord list.

## ADDED Requirements

### Requirement: Recognise major, minor and 7 chords
The system SHALL turn note events (start time, end time, pitch, strength) into chords over time, choosing among major, minor and dominant 7 chords on any root. It SHALL NOT report other chord qualities.

#### Scenario: Major chord
- **WHEN** the notes C, E and G sound together for 2 seconds
- **THEN** the result is the chord `C`

#### Scenario: Minor chord
- **WHEN** the notes A, C and E sound together for 2 seconds
- **THEN** the result is the chord `Am`

#### Scenario: Dominant 7 chord
- **WHEN** the notes G, B, D and F sound together for 2 seconds
- **THEN** the result is the chord `G7`

#### Scenario: Octaves do not matter
- **WHEN** the notes E2, B2, E3, G#3, B3 and E4 sound together
- **THEN** the result is the chord `E`

### Requirement: Follow chord changes
The system SHALL report chords in time order and SHALL report a new chord when the best matching chord changes and stays changed.

#### Scenario: Progression
- **WHEN** the notes of G, D, Em and C each sound for 2 seconds in turn
- **THEN** the result is `G`, `D`, `Em`, `C`

### Requirement: Ignore short blips
The system SHALL report a chord only when it is the best match for at least 0.4 seconds in a row, and SHALL merge the same chord reported twice in a row into one.

#### Scenario: Passing note
- **WHEN** an `F#` chord matches for 0.1 seconds between two `G` chords
- **THEN** the result is a single `G`

### Requirement: Stay silent on silence
The system SHALL report no chord for time with fewer than two different note names sounding, and SHALL return an empty list when no chord is found.

#### Scenario: Single melody notes
- **WHEN** only the single note A sounds
- **THEN** no chord is reported

#### Scenario: No notes
- **WHEN** the note list is empty
- **THEN** the result is an empty list
