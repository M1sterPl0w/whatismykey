# Spec Delta

## ADDED Requirements

### Requirement: Enlarge the fretboard
The app SHALL open the fretboard full screen when the user taps it, drawn upright with the six strings vertical and the nut at the top, and SHALL return to the normal screen when the user taps a close button. The full-screen view SHALL show the same notes, labels and root colour as the normal fretboard.

#### Scenario: Open full screen
- **WHEN** the user taps the fretboard
- **THEN** a full-screen view shows the upright fretboard for the selected scale, with a close button

#### Scenario: Larger marks
- **WHEN** the full-screen view is open on a 360 px wide screen
- **THEN** each note mark is at least 28 px across and its label is at least 12 px tall

#### Scenario: Same notes
- **WHEN** A major is selected and the full-screen view is open
- **THEN** it marks the same notes as the normal fretboard, with every A in the root colour

#### Scenario: Close
- **WHEN** the user taps the close button
- **THEN** the normal screen shows again with the same key and scale selected
