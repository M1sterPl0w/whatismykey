# Spec Delta

## Purpose
Helps the user tune a guitar by ear-free feedback: it listens to a string and shows how far the pitch is from the wanted note.

## ADDED Requirements

### Requirement: Start and stop the tuner
The Tuner screen SHALL provide a button that asks for microphone permission when first used and then starts listening. The same button SHALL stop listening. If the microphone is not allowed or not available, the screen SHALL show a message saying so.

#### Scenario: Start
- **WHEN** the user taps Start and allows the microphone
- **THEN** the screen shows that it is listening and the button becomes Stop

#### Scenario: Microphone denied
- **WHEN** the user denies the microphone
- **THEN** a message explains that the microphone is needed and the tuner is not listening

### Requirement: Needle and detected note
While listening and a clear note is heard, the screen SHALL show the detected note name, its frequency in Hz, and a needle that points left when the pitch is flat and right when sharp, with the centre meaning in tune. The needle range SHALL be at least ±50 cents. When no clear note is heard, the screen SHALL show that it is waiting for a note and the needle SHALL rest in the centre.

#### Scenario: Slightly flat
- **WHEN** a note about 20 cents below A is played
- **THEN** the screen shows A, the needle points left of centre and the state reads flat

#### Scenario: In tune
- **WHEN** a note within 5 cents of the target is played
- **THEN** the needle is at the centre and the screen says the string is in tune

#### Scenario: Silence
- **WHEN** nothing is played
- **THEN** the screen shows a waiting state and the needle is at the centre

### Requirement: Target string
The screen SHALL list the six strings of the selected tuning, low to high, with their note names. It SHALL pick the string whose note is closest to the heard pitch as the target, mark it, and measure the needle against that string. The user SHALL be able to tap a string to lock the target to it, and tap again to return to automatic choice.

#### Scenario: Automatic string
- **WHEN** standard tuning is selected and a pitch near 110 Hz is played
- **THEN** the A string is marked as the target

#### Scenario: Locked string
- **WHEN** the user taps the D string and plays a pitch near 110 Hz
- **THEN** the D string stays the target and the needle shows how far the pitch is from D

### Requirement: Selectable tunings
The screen SHALL offer these tunings: Standard (E A D G B e), Half step down (Eb Ab Db Gb Bb eb), Whole step down / D standard (D G C F A d), Drop D (D A D G B e), DADGAD, Open G (D G D G B d) and Open D (D A D F# A d). Standard SHALL be selected by default. Changing the tuning SHALL change the listed strings and the target notes at once, and SHALL clear a locked string.

#### Scenario: Step down
- **WHEN** the user selects Whole step down
- **THEN** the strings are listed as D G C F A d and a pitch near 73.4 Hz makes the lowest string the target and in tune

#### Scenario: Drop D
- **WHEN** the user selects Drop D
- **THEN** the lowest string is D and the others are A D G B e

### Requirement: Reference pitch
The tuner SHALL use A = 440 Hz as the reference pitch.

#### Scenario: Reference
- **WHEN** a pure 110 Hz tone (A2, an octave of A = 440 Hz) is played in standard tuning
- **THEN** the screen shows A, the A string is the target and the needle is at the centre

### Requirement: Works offline
The tuner SHALL work with no connection after the first visit, and SHALL NOT send audio anywhere.

#### Scenario: Offline tuning
- **WHEN** the phone is offline
- **THEN** the tuner starts and detects pitch as when online
