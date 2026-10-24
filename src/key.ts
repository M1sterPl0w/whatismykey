import { Chord, CHORD_INTERVALS } from './chord';
import { Key, Mode, mod12 } from './notes';

/** Tonic chord at the start or end of the song adds this fraction of a fitting chord to the score. */
export const TONIC_BONUS = 0.25;
/** Below this share of fitting chords, the best key is reported as unclear. */
export const UNCLEAR_BELOW = 0.6;
export const MAX_KEYS = 3;

const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];
const MINOR_SCALE = [0, 2, 3, 5, 7, 8, 10];
const EPSILON = 1e-9;

export interface KeyScore {
  key: Key;
  score: number;
  fitting: number;
  total: number;
}

export interface KeyDetection {
  keys: KeyScore[];
  /** Set only when the best key scores strictly higher than every other key. */
  mostLikely: Key | null;
  unclear: boolean;
}

function scalePitches(key: Key): Set<number> {
  const intervals = key.mode === 'major' ? MAJOR_SCALE : MINOR_SCALE;
  return new Set(intervals.map((interval) => mod12(key.root + interval)));
}

/** Only the chord root and quality count; a slash bass note is ignored. */
export function chordFitsKey(chord: Chord, key: Key): boolean {
  const pitches = scalePitches(key);
  if (CHORD_INTERVALS[chord.quality].every((i) => pitches.has(mod12(chord.root + i)))) return true;
  // Minor keys also accept the major V and V7 (harmonic minor).
  return (
    key.mode === 'minor' &&
    chord.root === mod12(key.root + 7) &&
    (chord.quality === 'major' || chord.quality === '7')
  );
}

function isTonicChord(chord: Chord, key: Key): boolean {
  return chord.root === key.root && chordFitsKey(chord, key);
}

function allKeys(): Key[] {
  const modes: Mode[] = ['major', 'minor'];
  return modes.flatMap((mode) => Array.from({ length: 12 }, (_, root) => ({ root, mode })));
}

export function detectKeys(chords: Chord[]): KeyDetection {
  if (chords.length === 0) return { keys: [], mostLikely: null, unclear: true };

  const total = chords.length;
  const scored = allKeys().map((key): KeyScore => {
    const fitting = chords.filter((chord) => chordFitsKey(chord, key)).length;
    const bonus =
      (isTonicChord(chords[0], key) ? TONIC_BONUS : 0) +
      (isTonicChord(chords[total - 1], key) ? TONIC_BONUS : 0);
    return { key, score: (fitting + bonus) / total, fitting, total };
  });

  // Sort is stable, so equal scores keep major-before-minor, low root first.
  const keys = scored.sort((a, b) => b.score - a.score).slice(0, MAX_KEYS);
  const clearWinner = keys.length === 1 || keys[0].score - keys[1].score > EPSILON;

  return {
    keys,
    mostLikely: clearWinner ? keys[0].key : null,
    unclear: keys[0].fitting / total < UNCLEAR_BELOW,
  };
}
