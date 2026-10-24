# Spec Delta

## ADDED Requirements

### Requirement: Listen works offline
The app SHALL keep everything the listening feature needs, including the analysis model, in the offline storage after the first visit, so that listening and chord recognition work with no connection.

#### Scenario: Offline listening
- **WHEN** the app has been opened online once, the phone is then offline, and the user listens to a recording of A, D, E
- **THEN** the chords `A D E` are added to the list
