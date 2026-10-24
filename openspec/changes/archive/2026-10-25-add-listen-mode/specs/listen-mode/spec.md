# Spec Delta

## Purpose

Lets her fill in the chord list by letting the phone listen, so she does not have to tap in every chord.

## ADDED Requirements

### Requirement: Start and stop listening
The app SHALL provide a Listen button that asks for microphone permission when first used and then records. While recording it SHALL show that it is listening with the elapsed time, and the button SHALL become a Stop button. Tapping Stop SHALL end the recording.

#### Scenario: Listening state
- **WHEN** the user taps Listen and allows the microphone
- **THEN** the app shows that it is listening with a running time and a Stop button

### Requirement: Add heard chords to the list
When listening stops, the app SHALL analyse the recording on the phone, show that it is analysing, and then add the recognised chords in order to the end of the chord list. Existing chords SHALL stay. The heard chords are sounding chords, so the app SHALL lower each one by the capo fret to store it as a shape, so that the list and the results stay consistent.

#### Scenario: Chords appended
- **WHEN** the list is empty, the capo is 0, and the recording contains the chords A, D, E
- **THEN** the list shows `A D E` and the keys include A major

#### Scenario: Existing chords stay
- **WHEN** the list holds `G` and the recording contains D, Em
- **THEN** the list shows `G D Em`

#### Scenario: Capo is taken into account
- **WHEN** the capo is 2 and the recording contains the sounding chords A, D, E
- **THEN** the list shows `G C D` and the keys include A major

### Requirement: Fix mistakes by hand
Heard chords SHALL appear as ordinary list entries that can be removed, and chords can still be added with the buttons.

#### Scenario: Remove a wrong chord
- **WHEN** a heard chord is removed from the list
- **THEN** the keys and scales update as for any other removal

### Requirement: Limit the recording length
The app SHALL stop listening by itself after 60 seconds and then analyse what it has.

#### Scenario: Time limit
- **WHEN** the recording reaches 60 seconds
- **THEN** listening stops and the analysis starts

### Requirement: Handle problems clearly
The app SHALL show a short message and leave the chord list unchanged when microphone permission is denied, when there is no microphone or the browser cannot record, when the analysis fails, and when no chords were heard.

#### Scenario: Permission denied
- **WHEN** the user refuses microphone access
- **THEN** a message says the microphone is needed, and the list is unchanged

#### Scenario: Nothing heard
- **WHEN** the recording contains no recognisable chords
- **THEN** a message says no chords were heard, and the list is unchanged

### Requirement: Keep the audio on the phone
The app SHALL NOT send the recording anywhere and SHALL NOT keep it after the analysis.

#### Scenario: No upload
- **WHEN** a recording is analysed
- **THEN** no network request carries audio data
