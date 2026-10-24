# scale-catalog Specification

## Purpose
Gives the scales a player can improvise with over a key, with the notes spelled the way a musician would write them.

## Requirements

### Requirement: Offer a fixed set of scales
The system SHALL offer these scales for any root note: major, natural minor, major pentatonic, minor pentatonic, blues, Dorian, Phrygian, Lydian, Mixolydian and Locrian.

#### Scenario: Scale list
- **WHEN** the scales for any root are requested
- **THEN** all ten scales are returned, each with its name

### Requirement: Compute scale notes
The system SHALL return the notes of a scale for a given root, in order starting at the root.

#### Scenario: A major
- **WHEN** the major scale on A is requested
- **THEN** the notes are A, B, C#, D, E, F#, G#

#### Scenario: A minor pentatonic
- **WHEN** the minor pentatonic scale on A is requested
- **THEN** the notes are A, C, D, E, G

#### Scenario: A blues
- **WHEN** the blues scale on A is requested
- **THEN** the notes are A, C, D, Eb, E, G

#### Scenario: E Mixolydian
- **WHEN** the Mixolydian scale on E is requested
- **THEN** the notes are E, F#, G#, A, B, C#, D

### Requirement: Spell notes for the key
The system SHALL spell note names with flats in flat keys and with sharps in sharp keys, and SHALL use each letter name at most once in the seven-note scales.

#### Scenario: Flat key
- **WHEN** the major scale on F is requested
- **THEN** the notes are F, G, A, Bb, C, D, E

#### Scenario: Sharp key
- **WHEN** the major scale on D is requested
- **THEN** the notes are D, E, F#, G, A, B, C#

### Requirement: Suggest scales for a detected key
The system SHALL provide the scales for a detected key, with the key's own scale (major or natural minor) first.

#### Scenario: Scales for a major key
- **WHEN** the scales for A major are requested
- **THEN** A major is first and the remaining scales follow

#### Scenario: Scales for a minor key
- **WHEN** the scales for F# minor are requested
- **THEN** F# natural minor is first and the remaining scales follow
