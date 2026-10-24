# Spec Delta

## Purpose

Keeps the app working with no connection and keeps it up to date when there is one.

## ADDED Requirements

### Requirement: Work offline after the first visit
The app SHALL store all files it needs on the phone during the first visit, so that later opens work with no connection and give the same results as online.

#### Scenario: Offline open
- **WHEN** the app has loaded once and the phone is then offline
- **THEN** reloading the app shows the full screen and G, C, D with capo 2 still gives A major

### Requirement: Pick up new versions
The app SHALL check for a new version when it opens with a connection, and SHALL tell the user when a new version is ready, with a way to reload into it. It SHALL NOT replace the running version in the middle of use without the user's choice.

#### Scenario: New version deployed
- **WHEN** a new version has been deployed and the app is opened online
- **THEN** a notice says an update is ready, and tapping it reloads into the new version

#### Scenario: No update
- **WHEN** no new version exists
- **THEN** no update notice is shown

### Requirement: Old files are removed
The app SHALL remove stored files from older versions after an update.

#### Scenario: After update
- **WHEN** the app has updated
- **THEN** only files of the current version remain stored
