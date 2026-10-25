# Spec Delta

## Purpose
Shows the user how to play a chord on a guitar, with several grips at different places on the neck.

## ADDED Requirements

### Requirement: Pick a chord
The Chords screen SHALL let the user pick a root note and a chord type from the same twelve roots and nine types used to enter song chords, and SHALL show the chord name. The screen SHALL show the grips for the selected chord as soon as both are picked. Before a root is picked it SHALL show a hint to pick a chord.

#### Scenario: Pick C major
- **WHEN** the user picks root C and type maj
- **THEN** the screen shows the name C and a list of grips for C major

#### Scenario: Nothing picked
- **WHEN** the screen is opened for the first time
- **THEN** a hint asks the user to pick a root and a type

### Requirement: Several grips per chord
For every combination of root and type, the screen SHALL show at least two different grips in standard tuning, ordered from the lowest position on the neck to the highest, each labelled with where it sits (open, or the fret of its first finger). Every grip SHALL sound only notes of the chord, and the lowest sounding note SHALL be the chord's root, except for grips that are labelled otherwise.

#### Scenario: C major grips
- **WHEN** the user picks C major
- **THEN** the first grip is the open C shape, and the others include a barre shape at fret 3 (A shape) and one at fret 8 (E shape)

#### Scenario: Notes belong to the chord
- **WHEN** any chord is shown
- **THEN** each played string in every grip is a note of that chord

### Requirement: Chord diagram
Each grip SHALL be drawn as a chord diagram: six strings with the low E on the left, frets as horizontal lines, a dot for each fretted string, an open circle for open strings, a cross for muted strings, a bar for a barre, and the starting fret number when the grip does not start at the nut. Dots SHALL show which note of the chord they are, with the root marked differently.

#### Scenario: Open and muted strings
- **WHEN** the open D major grip is shown
- **THEN** the low E and A strings show a cross and the D string shows an open circle

#### Scenario: High position
- **WHEN** a barre grip at fret 8 is shown
- **THEN** the diagram starts at fret 8 and shows the number 8 beside it

### Requirement: Add the chord to the song
The Chords screen SHALL offer a button to add the selected chord to the song chord list on the Key screen.

#### Scenario: Add to song
- **WHEN** the user picks G and taps the add button
- **THEN** the Key screen's chord list ends with `G`

### Requirement: Works offline
The chord lookup SHALL work with no connection after the first visit.

#### Scenario: Offline lookup
- **WHEN** the phone is offline
- **THEN** picking a chord still shows its grips
