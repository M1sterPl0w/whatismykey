import { Chord, formatChord } from './chord';
import { KeyDetection } from './key';
import { Key, keyName } from './notes';

export const ROOTS = [
  { label: 'C', pc: 0 },
  { label: 'C#', pc: 1 },
  { label: 'D', pc: 2 },
  { label: 'Eb', pc: 3 },
  { label: 'E', pc: 4 },
  { label: 'F', pc: 5 },
  { label: 'F#', pc: 6 },
  { label: 'G', pc: 7 },
  { label: 'Ab', pc: 8 },
  { label: 'A', pc: 9 },
  { label: 'Bb', pc: 10 },
  { label: 'B', pc: 11 },
] as const;

export const QUALITIES = [
  { label: 'maj', quality: 'major' },
  { label: 'm', quality: 'minor' },
  { label: '7', quality: '7' },
  { label: 'maj7', quality: 'maj7' },
  { label: 'm7', quality: 'm7' },
  { label: 'sus2', quality: 'sus2' },
  { label: 'sus4', quality: 'sus4' },
  { label: 'dim', quality: 'dim' },
  { label: 'aug', quality: 'aug' },
] as const;

/** Chord as written on the sheet: the root buttons spell Eb, Ab and Bb with flats. */
export function chordLabel(chord: Chord): string {
  return formatChord(chord, [3, 8, 10].includes(chord.root));
}

export interface KeyRow {
  key: Key;
  name: string;
  mostLikely: boolean;
}

export function keyRows(detection: KeyDetection): KeyRow[] {
  const best = detection.mostLikely;
  return detection.keys.map(({ key }) => ({
    key,
    name: keyName(key),
    mostLikely: best !== null && key.root === best.root && key.mode === best.mode,
  }));
}
