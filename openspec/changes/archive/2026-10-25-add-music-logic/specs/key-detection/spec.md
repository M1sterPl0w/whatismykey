# Spec Delta

## Purpose

Finds the likely keys of a song from its ordered sounding chords and says how sure it is, so the player sees several keys when the chords allow more than one.

## ADDED Requirements

### Requirement: Rank candidate keys
The system SHALL rank all 24 major and minor keys for an ordered list of sounding chords and return at most 3, best first. A chord fits a key when all of its notes belong to that key's scale. Minor keys use natural minor, and also accept the major V and V7 chord.

#### Scenario: Clear major key
- **WHEN** the chords `A`, `D`, `E` are given
- **THEN** A major is the first key

#### Scenario: Minor key with major V
- **WHEN** the chords `Am`, `Dm`, `E` are given
- **THEN** A minor is the first key

#### Scenario: At most three keys
- **WHEN** any chord list is given
- **THEN** the result contains no more than 3 keys

### Requirement: Use chord order
The system SHALL give extra weight to a key when the first or last chord is that key's tonic chord, so chord order affects the ranking.

#### Scenario: Relative major and minor
- **WHEN** the chords `Am`, `C`, `G`, `Am` are given
- **THEN** A minor ranks above C major

#### Scenario: Same chords, other order
- **WHEN** the chords `C`, `G`, `Am`, `C` are given
- **THEN** C major ranks above A minor

### Requirement: Report ties and confidence
The system SHALL mark one key as "most likely" only when it scores higher than every other key. Keys with equal best scores SHALL be reported together without that mark. When the best key fits fewer than 60% of the chords, the system SHALL report the key as unclear.

#### Scenario: Clear winner
- **WHEN** one key scores higher than all others
- **THEN** that key is marked most likely

#### Scenario: Tie
- **WHEN** two keys have the same best score
- **THEN** both are listed and neither is marked most likely

#### Scenario: Unclear key
- **WHEN** the best key fits fewer than 60% of the chords
- **THEN** the result is marked unclear

### Requirement: Handle chords that fit no key
The system SHALL count chords that fit no candidate key (such as sus and aug chords) as not fitting, and SHALL NOT reject the chord list because of them. For slash chords only the chord root SHALL count, not the bass note.

#### Scenario: Sus chord
- **WHEN** the chords `A`, `Dsus4`, `E` are given
- **THEN** a result is still returned, with `Dsus4` counted as not fitting

### Requirement: Handle empty input
The system SHALL return no keys when the chord list is empty.

#### Scenario: No chords
- **WHEN** an empty chord list is given
- **THEN** the result has no keys and is not marked most likely
