import { Chord, Quality } from './chord';
import { mod12 } from './notes';

/** A note found in a recording: seconds, MIDI pitch, and how strong it sounds (0 to 1). */
export interface NoteEvent {
  start: number;
  end: number;
  pitch: number;
  amplitude: number;
}

export interface TimedChord {
  chord: Chord;
  start: number;
  end: number;
}

export const FRAME_SECONDS = 0.1;
/** Votes are counted over this many frames, which removes passing notes. */
export const SMOOTHING_FRAMES = 9;
/** A chord must be the best match for this many frames in a row (0.4 s) to be reported. */
export const MIN_CHORD_FRAMES = 4;
/** Fewer different note names than this in a frame means no chord. */
export const MIN_NOTE_NAMES = 2;
const NOTE_PRESENT = 1e-3;

const CANDIDATES: { quality: Quality; intervals: number[] }[] = [
  { quality: 'major', intervals: [0, 4, 7] },
  { quality: 'minor', intervals: [0, 3, 7] },
  { quality: '7', intervals: [0, 4, 7, 10] },
];
/** How much each chord tone counts: root, third, fifth, then the seventh. */
const TONE_WEIGHTS = [1, 0.8, 0.85, 0.6];

const TEMPLATES = CANDIDATES.flatMap(({ quality, intervals }) =>
  Array.from({ length: 12 }, (_, root) => {
    const profile = new Array<number>(12).fill(0);
    intervals.forEach((interval, i) => {
      profile[mod12(root + interval)] = TONE_WEIGHTS[i];
    });
    const norm = Math.hypot(...profile);
    return { chord: { root, quality } as Chord, profile: profile.map((v) => v / norm) };
  }),
);

function frameProfiles(notes: NoteEvent[]): number[][] {
  const end = notes.reduce((max, n) => Math.max(max, n.end), 0);
  const frames = Array.from({ length: Math.ceil(end / FRAME_SECONDS) }, () => new Array<number>(12).fill(0));
  for (const note of notes) {
    const first = Math.floor(note.start / FRAME_SECONDS);
    const last = Math.min(frames.length - 1, Math.floor(note.end / FRAME_SECONDS));
    for (let f = first; f <= last; f++) {
      const overlap = Math.min(note.end, (f + 1) * FRAME_SECONDS) - Math.max(note.start, f * FRAME_SECONDS);
      if (overlap > 0) frames[f][mod12(Math.round(note.pitch))] += note.amplitude * overlap;
    }
  }
  return frames;
}

/** Index into TEMPLATES of the best matching chord, or -1 when too few note names sound. */
function bestChord(profile: number[]): number {
  if (profile.filter((v) => v > NOTE_PRESENT).length < MIN_NOTE_NAMES) return -1;
  const mean = profile.reduce((a, b) => a + b, 0) / 12;
  const centred = profile.map((v) => v - mean);
  const norm = Math.hypot(...centred);
  if (norm === 0) return -1;
  let best = -1;
  let bestScore = -Infinity;
  TEMPLATES.forEach((template, i) => {
    const score = template.profile.reduce((sum, v, pc) => sum + v * (centred[pc] / norm), 0);
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  });
  return best;
}

/** Most common label in a window, ties going to the one seen first. */
function majority(labels: number[], centre: number): number {
  const half = Math.floor(SMOOTHING_FRAMES / 2);
  const counts = new Map<number, number>();
  for (let i = Math.max(0, centre - half); i <= Math.min(labels.length - 1, centre + half); i++) {
    counts.set(labels[i], (counts.get(labels[i]) ?? 0) + 1);
  }
  let winner = labels[centre];
  for (const [label, count] of counts) if (count > (counts.get(winner) ?? 0)) winner = label;
  return winner;
}

const isThirdOnly = (quality: Quality) => quality === 'major' || quality === 'minor';

/** Same chord, or the major and minor of one root that overtones can confuse. */
function sameChord(a: Chord, b: Chord): boolean {
  return a.quality === b.quality || (isThirdOnly(a.quality) && isThirdOnly(b.quality));
}

/** Turns the notes found in a recording into the major, minor and 7 chords played, in time order. */
export function recogniseChords(notes: NoteEvent[]): TimedChord[] {
  const labels = frameProfiles(notes).map(bestChord);
  const smoothed = labels.map((_, i) => majority(labels, i));

  const runs: { label: number; first: number; last: number }[] = [];
  smoothed.forEach((label, i) => {
    const run = runs[runs.length - 1];
    if (run && run.label === label) run.last = i;
    else runs.push({ label, first: i, last: i });
  });

  const result: TimedChord[] = [];
  for (const run of runs) {
    if (run.label < 0 || run.last - run.first + 1 < MIN_CHORD_FRAMES) continue;
    const chord = TEMPLATES[run.label].chord;
    const start = run.first * FRAME_SECONDS;
    const end = (run.last + 1) * FRAME_SECONDS;
    const previous = result[result.length - 1];
    if (previous && previous.chord.root === chord.root && sameChord(previous.chord, chord)) {
      previous.end = end;
      // A ringing minor chord's overtones look like its major (the fifth overtone of the root is
      // the major third), but a major chord never looks minor, so a minor reading wins.
      if (chord.quality === 'minor') previous.chord.quality = 'minor';
    } else {
      result.push({ chord: { ...chord }, start, end });
    }
  }
  return result;
}
