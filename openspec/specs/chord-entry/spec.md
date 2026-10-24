# chord-entry Specification

## Purpose
Lets her enter the chords of a song and the capo position with taps only, in the order they appear on the chord sheet.

## Requirements

### Requirement: Add chords with buttons
The app SHALL let the user pick a root note and a quality with buttons, then add that chord to the end of the song's chord list. Root buttons SHALL cover all twelve notes. Quality buttons SHALL cover major, minor, 7, maj7, m7, sus2, sus4, dim and aug.

#### Scenario: Add a chord
- **WHEN** the user taps root `G` and quality `major`, then taps add
- **THEN** `G` appears at the end of the chord list

#### Scenario: Add a minor chord
- **WHEN** the user taps root `A` and quality `minor`, then taps add
- **THEN** `Am` appears at the end of the chord list

### Requirement: Edit the chord list
The app SHALL let the user remove any chord from the list and clear the whole list. The list order SHALL be kept as entered.

#### Scenario: Remove one chord
- **WHEN** the user removes the second chord of `G C D`
- **THEN** the list shows `G D`

#### Scenario: Clear all
- **WHEN** the user taps clear
- **THEN** the chord list is empty and no keys are shown

### Requirement: Set the capo
The app SHALL provide a capo control from 0 to 12 that defaults to 0. The chord list SHALL keep showing the shapes as entered, not the sounding chords.

#### Scenario: Capo changes the result only
- **WHEN** the chords `G C D` are entered and the capo is set to 2
- **THEN** the chord list still shows `G C D` and the key results are for A major

### Requirement: Update results immediately
The app SHALL recompute the keys and scales whenever the chord list or capo changes, without a separate submit step.

#### Scenario: Live update
- **WHEN** the user adds a chord
- **THEN** the key results change to match the new list
