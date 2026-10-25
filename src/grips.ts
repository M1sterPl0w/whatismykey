import { Quality } from './chord';
import { mod12 } from './notes';

/** Fret per string, low E first; 0 is open and null is not played. */
export type Frets = (number | null)[];

export interface Grip {
  frets: Frets;
  /** Where it sits: "Open" or "Fret 3". */
  label: string;
  /** The shape it is built from, e.g. "A shape". */
  shape: string;
}

/** Open-string pitch classes of a guitar in standard tuning, low E first. */
export const OPEN_PCS = [4, 9, 2, 7, 11, 4];

export const MAX_FRET = 13;

interface Template {
  shape: string;
  /** String the root is on. */
  rootString: number;
  /** Fret offsets from the root fret per string, by chord type. */
  offsets: Record<Quality, Frets>;
}

const x = null;

// Each is laid over the neck with the barre on the root's fret; at fret 0 it is the open chord.
const TEMPLATES: Template[] = [
  {
    shape: 'E shape',
    rootString: 0,
    offsets: {
      major: [0, 2, 2, 1, 0, 0],
      minor: [0, 2, 2, 0, 0, 0],
      '7': [0, 2, 0, 1, 0, 0],
      maj7: [0, 2, 1, 1, 0, 0],
      m7: [0, 2, 0, 0, 0, 0],
      sus2: [0, 2, 4, 4, 0, 0],
      sus4: [0, 2, 2, 2, 0, 0],
      dim: [0, 1, 2, 0, x, x],
      aug: [0, 3, 2, 1, 1, 0],
    },
  },
  {
    shape: 'A shape',
    rootString: 1,
    offsets: {
      major: [x, 0, 2, 2, 2, 0],
      minor: [x, 0, 2, 2, 1, 0],
      '7': [x, 0, 2, 0, 2, 0],
      maj7: [x, 0, 2, 1, 2, 0],
      m7: [x, 0, 2, 0, 1, 0],
      sus2: [x, 0, 2, 2, 0, 0],
      sus4: [x, 0, 2, 2, 3, 0],
      dim: [x, 0, 1, 2, 1, x],
      aug: [x, 0, 3, 2, 2, 1],
    },
  },
  {
    shape: 'D shape',
    rootString: 2,
    offsets: {
      major: [x, x, 0, 2, 3, 2],
      minor: [x, x, 0, 2, 3, 1],
      '7': [x, x, 0, 2, 1, 2],
      maj7: [x, x, 0, 2, 2, 2],
      m7: [x, x, 0, 2, 1, 1],
      sus2: [x, x, 0, 2, 3, 0],
      sus4: [x, x, 0, 2, 3, 3],
      dim: [x, x, 0, 1, 3, 1],
      aug: [x, x, 0, 3, 3, 2],
    },
  },
];

// Open chords that none of the shapes above gives, as `[root, quality, frets]`.
const OPEN: [number, Quality, Frets][] = [
  [0, 'major', [x, 3, 2, 0, 1, 0]],
  [0, '7', [x, 3, 2, 3, 1, 0]],
  [0, 'maj7', [x, 3, 2, 0, 0, 0]],
  [5, 'maj7', [x, x, 3, 2, 1, 0]],
  [7, 'major', [3, 2, 0, 0, 0, 3]],
  [7, '7', [3, 2, 0, 0, 0, 1]],
  [7, 'maj7', [3, 2, 0, 0, 0, 2]],
];

const playedFrets = (frets: Frets): number[] => frets.filter((f): f is number => f !== null);

function describe(frets: Frets, shape: string): Grip {
  const played = playedFrets(frets);
  const label = played.includes(0) ? 'Open' : `Fret ${Math.min(...played)}`;
  return { frets, label, shape };
}

/** Lowest fretted position, with open grips first. */
const position = (grip: Grip): number => {
  const played = playedFrets(grip.frets);
  return played.includes(0) ? 0 : Math.min(...played);
};

/** Different ways to play the chord in standard tuning, from the nut up the neck. */
export function gripsFor(root: number, quality: Quality): Grip[] {
  const grips: Grip[] = [];

  for (const [openRoot, openQuality, frets] of OPEN) {
    if (openRoot === root && openQuality === quality) grips.push(describe(frets, 'Open'));
  }

  for (const template of TEMPLATES) {
    const rootFret = mod12(root - OPEN_PCS[template.rootString]);
    const frets = template.offsets[quality].map((offset) => (offset === null ? null : offset + rootFret));
    if (Math.max(...playedFrets(frets)) > MAX_FRET) continue;
    grips.push(describe(frets, template.shape));
  }

  const seen = new Set<string>();
  return grips
    .filter((grip) => {
      const key = grip.frets.join(',');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => position(a) - position(b));
}

/** Pitch class sounded on a string at a fret. */
export const soundedPc = (string: number, fret: number): number => (OPEN_PCS[string] + fret) % 12;

