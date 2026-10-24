# scale-display Specification

## Purpose
Shows the scales for the selected key as note names and on a guitar neck, so she can improvise right away.

## Requirements

### Requirement: Choose a scale
The app SHALL show a chip for each of the ten scales for the selected key, with the key's own scale selected first. Tapping a chip SHALL select that scale.

#### Scenario: Default scale
- **WHEN** A major is the selected key
- **THEN** the major scale chip is selected

#### Scenario: Pick another scale
- **WHEN** the user taps the Blues chip
- **THEN** the note names and fretboard show the A blues scale

### Requirement: Show note names
The app SHALL show the notes of the selected scale in order, starting at the root.

#### Scenario: A major notes
- **WHEN** A major is selected
- **THEN** the notes shown are `A B C# D E F# G#`

### Requirement: Show a fretboard
The app SHALL draw a fretboard for standard tuning with six strings and frets 0 to 12. Each note of the selected scale SHALL be marked and labelled with its name, with the root in a different colour from the other notes. The notes SHALL be the sounding notes, with the capo not drawn.

#### Scenario: Root highlighted
- **WHEN** A major is selected
- **THEN** every A on the fretboard has the root colour and the other scale notes have the normal note colour

#### Scenario: Open strings
- **WHEN** A major is selected
- **THEN** the open A, B, D and E strings are marked, and the open G string is not

#### Scenario: Strings and frets labelled
- **WHEN** the fretboard is shown
- **THEN** each string has its open note name and the frets 3, 5, 7, 9 and 12 are marked
