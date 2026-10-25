import { noteName } from './notes';

export interface TuningString {
  name: string;
  /** MIDI note number, A4 = 69. */
  midi: number;
}

export interface Tuning {
  id: string;
  name: string;
  /** Low string first. */
  strings: TuningString[];
}

/** Reference pitch: A4. */
export const A4_HZ = 440;

/** Within this many cents of the target counts as in tune. */
export const IN_TUNE_CENTS = 5;

/** The needle covers this many cents either side of centre. */
export const NEEDLE_RANGE_CENTS = 50;

function tuning(id: string, name: string, notes: [string, number][]): Tuning {
  return { id, name, strings: notes.map(([note, midi]) => ({ name: note, midi })) };
}

export const TUNINGS: Tuning[] = [
  tuning('standard', 'Standard', [['E', 40], ['A', 45], ['D', 50], ['G', 55], ['B', 59], ['e', 64]]),
  tuning('half-down', 'Half step down', [['Eb', 39], ['Ab', 44], ['Db', 49], ['Gb', 54], ['Bb', 58], ['eb', 63]]),
  tuning('whole-down', 'Whole step down', [['D', 38], ['G', 43], ['C', 48], ['F', 53], ['A', 57], ['d', 62]]),
  tuning('drop-d', 'Drop D', [['D', 38], ['A', 45], ['D', 50], ['G', 55], ['B', 59], ['e', 64]]),
  tuning('dadgad', 'DADGAD', [['D', 38], ['A', 45], ['D', 50], ['G', 55], ['A', 57], ['d', 62]]),
  tuning('open-g', 'Open G', [['D', 38], ['G', 43], ['D', 50], ['G', 55], ['B', 59], ['d', 62]]),
  tuning('open-d', 'Open D', [['D', 38], ['A', 45], ['D', 50], ['F#', 54], ['A', 57], ['d', 62]]),
];

export const DEFAULT_TUNING = TUNINGS[0];

export function tuningById(id: string): Tuning {
  return TUNINGS.find((t) => t.id === id) ?? DEFAULT_TUNING;
}

export const midiToHz = (midi: number): number => A4_HZ * 2 ** ((midi - 69) / 12);

/** Distance in cents from `target` Hz up to `hz`; negative means flat. */
export const centsOff = (hz: number, target: number): number => 1200 * Math.log2(hz / target);

/** Index of the string closest in pitch to `hz`. */
export function nearestString(tuning: Tuning, hz: number): number {
  let best = 0;
  tuning.strings.forEach((string, i) => {
    if (Math.abs(centsOff(hz, midiToHz(string.midi))) < Math.abs(centsOff(hz, midiToHz(tuning.strings[best].midi)))) {
      best = i;
    }
  });
  return best;
}

export interface Reading {
  /** Name of the closest note, whatever the tuning. */
  note: string;
  hz: number;
  /** Cents from the target string; negative is flat. */
  cents: number;
  /** Index of the string measured against. */
  target: number;
  state: 'flat' | 'sharp' | 'in tune';
}

/** What the screen shows for a heard pitch. `locked` is a string index, or null to pick the closest string. */
export function readPitch(tuning: Tuning, locked: number | null, hz: number): Reading {
  const target = locked ?? nearestString(tuning, hz);
  const cents = centsOff(hz, midiToHz(tuning.strings[target].midi));
  const semitone = Math.round(69 + 12 * Math.log2(hz / A4_HZ));
  return {
    note: noteName(semitone, false),
    hz,
    cents,
    target,
    state: Math.abs(cents) <= IN_TUNE_CENTS ? 'in tune' : cents < 0 ? 'flat' : 'sharp',
  };
}

/** Needle angle in degrees from upright: -45 fully flat, +45 fully sharp. */
export function needleAngle(cents: number): number {
  const clamped = Math.max(-NEEDLE_RANGE_CENTS, Math.min(NEEDLE_RANGE_CENTS, cents));
  return (clamped / NEEDLE_RANGE_CENTS) * 45;
}
