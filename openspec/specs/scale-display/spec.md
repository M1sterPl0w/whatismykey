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
The app SHALL draw a fretboard for standard tuning with six strings and frets 0 to 12, as seen when looking down at a guitar neck: the nut on the left, the frets running to the right, the low E string on top and the high e string at the bottom. Each note of the selected scale SHALL be marked and labelled with its name, with the root in a different colour from the other notes. The notes SHALL be the sounding notes, with the capo not drawn.

#### Scenario: Root highlighted
- **WHEN** A major is selected
- **THEN** every A on the fretboard has the root colour and the other scale notes have the normal note colour

#### Scenario: Open strings
- **WHEN** A major is selected
- **THEN** the open A, B, D and E strings are marked, and the open G string is not

#### Scenario: Strings and frets labelled
- **WHEN** the fretboard is shown
- **THEN** each string has its open note name and the frets 3, 5, 7, 9 and 12 are marked

#### Scenario: String order
- **WHEN** the fretboard is shown
- **THEN** the strings from top to bottom are E, A, D, G, B, e

### Requirement: Enlarge the fretboard
The app SHALL open the fretboard full screen when the user taps it, drawn lengthwise like the normal fretboard (nut on the left, low E on top) and filling the long side of the screen, and SHALL return to the normal screen when the user taps a close button. In portrait the picture SHALL be turned a quarter turn so its length runs along the long side of the screen. In landscape it SHALL be shown unturned. The full-screen view SHALL show the same notes, labels and root colour as the normal fretboard.

#### Scenario: Open full screen
- **WHEN** the user taps the fretboard
- **THEN** a full-screen view shows the fretboard for the selected scale, with a close button

#### Scenario: Landscape
- **WHEN** the full-screen view is open on a screen wider than it is tall
- **THEN** the fretboard is not turned and its length fills the screen width

#### Scenario: Portrait
- **WHEN** the full-screen view is open on a screen taller than it is wide
- **THEN** the fretboard is turned a quarter turn and its length fills the screen height

#### Scenario: Larger marks
- **WHEN** the full-screen view is open on a 360 by 740 px screen
- **THEN** each note mark is at least 28 px across and its label is at least 12 px tall

#### Scenario: Same notes
- **WHEN** A major is selected and the full-screen view is open
- **THEN** it marks the same notes as the normal fretboard, with every A in the root colour

#### Scenario: Close
- **WHEN** the user taps the close button
- **THEN** the normal screen shows again with the same key and scale selected
