# Spec Delta

## MODIFIED Requirements

### Requirement: Edit the chord list
The app SHALL let the user remove any chord from the list and clear the whole list. Clearing SHALL also reset the capo to 0. The list order SHALL be kept as entered.

#### Scenario: Remove one chord
- **WHEN** the user removes the second chord of `G C D`
- **THEN** the list shows `G D`

#### Scenario: Clear all
- **WHEN** the user taps clear
- **THEN** the chord list is empty and no keys are shown

#### Scenario: Clear resets the capo
- **WHEN** the capo is set to 7 and the user taps clear
- **THEN** the capo is 0, so chords entered next are not shifted

#### Scenario: Removing one chord keeps the capo
- **WHEN** the capo is set to 2 and the user removes one chord
- **THEN** the capo stays at 2
