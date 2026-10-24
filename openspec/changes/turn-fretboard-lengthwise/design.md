# Design

## Context

`fretboardSvg` has a flat layout (high e on top) and an upright layout added for the full-screen view. `main.ts` draws the full-screen view as an overlay. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- One fretboard layout everywhere, matching how the real neck looks to the player.
- A bigger view that uses the long side of the phone.

**Non-Goals:**
- Left-handed mirroring, pinch zoom, and locking the screen orientation (not possible on iPhone Safari).

## Decisions

- **Reverse the string order in the flat layout** so the first string is low E. This is the only layout change in the SVG; the `data-string` index now counts from the low E string (0 = E, 5 = e). Existing marks, classes and labels stay.
- **Delete the upright layout.** Less code, and the two views cannot drift apart.
- **Turn the picture with CSS, not by drawing it twice.** The overlay holds the same flat SVG. A `@media (orientation: portrait)` rule rotates a wrapper by 90 degrees clockwise and sizes it to the screen height and width swapped, so the long side of the neck lies along the long side of the phone. In landscape no rule applies and the SVG simply fills the width. Alternative: ask her to turn the phone and show nothing in portrait. Rejected, because many people keep rotation locked.
- **Rotate clockwise.** After the turn the nut is at the top; she turns the phone a quarter turn anticlockwise to read it with the nut on the left.
- **Sizing.** With the 360 unit wide picture scaled to the screen length (740 px in portrait, about 1.9 times), marks come out at about 34 px and labels at about 17 px, above the 28 px and 12 px limits.
- **Close button** stays in a corner outside the rotated picture, at least 40 px high.

## Risks / Trade-offs

- [Rotated text reads sideways in portrait] → She is meant to turn the phone along the neck; with auto-rotate on, the layout switches to landscape by itself.
- [Marks could be too small on a very small phone] → The scenario checks 28 px at 360 by 740, and the picture only gets larger on bigger screens.
