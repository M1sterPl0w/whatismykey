# chord-parsing Specification

## Purpose
Turns the chords shown on a chord sheet into sounding chords, including the effect of a capo, so key detection works on what is actually heard.

## Requirements

### Requirement: Parse chord symbols
The system SHALL parse a chord symbol into a root note, a quality, and an optional bass note. Supported qualities are major, minor, 7, maj7, m7, sus2, sus4, dim and aug.

#### Scenario: Simple chords
- **WHEN** the symbols `G`, `Am` and `D7` are parsed
- **THEN** they give root G major, root A minor and root D dominant 7

#### Scenario: Slash chord
- **WHEN** the symbol `C/E` is parsed
- **THEN** the chord has root C, quality major and bass note E

#### Scenario: Unknown symbol
- **WHEN** a symbol with no valid root or an unsupported quality is parsed
- **THEN** the system reports an error for that symbol and does not guess

### Requirement: Accept accidental notations
The system SHALL accept `#`, `b`, and the Unicode sharp and flat signs for accidentals, and SHALL treat equivalent spellings as the same pitch.

#### Scenario: Sharp and flat spellings
- **WHEN** `F#m` and `F♯m` are parsed
- **THEN** both give the same chord

#### Scenario: Flat root
- **WHEN** `Bb` is parsed
- **THEN** the root is the pitch B flat, the same pitch as A sharp

### Requirement: Apply a capo
The system SHALL raise every chord, including any bass note, by the capo fret number in semitones. A capo of 0 SHALL leave the chords unchanged. The system SHALL accept capo frets from 0 to 12.

#### Scenario: Capo shifts chords
- **WHEN** the chords `G`, `C`, `D` are given with capo 2
- **THEN** the sounding chords are `A`, `D`, `E`

#### Scenario: Capo applies to the bass note
- **WHEN** `C/E` is given with capo 2
- **THEN** the sounding chord is `D/F#`

#### Scenario: Capo out of range
- **WHEN** a capo fret below 0 or above 12 is given
- **THEN** the system reports an error and returns no chords
