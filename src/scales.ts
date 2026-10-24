import { Key, LETTERS, LETTER_PC, mod12, noteName, usesFlats } from './notes';

export type ScaleId =
  | 'major'
  | 'minor'
  | 'major-pentatonic'
  | 'minor-pentatonic'
  | 'blues'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'locrian';

/** Each degree is [semitones from root, letter steps from root], which fixes the spelling. */
type Degree = [semitones: number, letterSteps: number];

export interface ScaleDef {
  id: ScaleId;
  name: string;
  degrees: Degree[];
}

export interface Scale {
  id: ScaleId;
  name: string;
  notes: string[];
}

const sevenNote = (semitones: number[]): Degree[] => semitones.map((s, i) => [s, i]);

export const SCALES: ScaleDef[] = [
  { id: 'major', name: 'Major', degrees: sevenNote([0, 2, 4, 5, 7, 9, 11]) },
  { id: 'minor', name: 'Natural minor', degrees: sevenNote([0, 2, 3, 5, 7, 8, 10]) },
  { id: 'major-pentatonic', name: 'Major pentatonic', degrees: [[0, 0], [2, 1], [4, 2], [7, 4], [9, 5]] },
  { id: 'minor-pentatonic', name: 'Minor pentatonic', degrees: [[0, 0], [3, 2], [5, 3], [7, 4], [10, 6]] },
  { id: 'blues', name: 'Blues', degrees: [[0, 0], [3, 2], [5, 3], [6, 4], [7, 4], [10, 6]] },
  { id: 'dorian', name: 'Dorian', degrees: sevenNote([0, 2, 3, 5, 7, 9, 10]) },
  { id: 'phrygian', name: 'Phrygian', degrees: sevenNote([0, 1, 3, 5, 7, 8, 10]) },
  { id: 'lydian', name: 'Lydian', degrees: sevenNote([0, 2, 4, 6, 7, 9, 11]) },
  { id: 'mixolydian', name: 'Mixolydian', degrees: sevenNote([0, 2, 4, 5, 7, 9, 10]) },
  { id: 'locrian', name: 'Locrian', degrees: sevenNote([0, 1, 3, 5, 6, 8, 10]) },
];

function accidental(diff: number): string {
  return diff > 0 ? '#'.repeat(diff) : 'b'.repeat(-diff);
}

function spell(root: number, def: ScaleDef, flats: boolean): string[] | null {
  const rootLetter = LETTERS.indexOf(noteName(root, flats)[0] as (typeof LETTERS)[number]);
  const notes: string[] = [];
  for (const [semitones, steps] of def.degrees) {
    const letter = LETTERS[(rootLetter + steps) % 7];
    let diff = mod12(root + semitones - LETTER_PC[letter]);
    if (diff > 6) diff -= 12;
    if (Math.abs(diff) > 1) return null;
    notes.push(letter + accidental(diff));
  }
  return notes;
}

/**
 * Notes of a scale from the root, one letter per degree. Tries the preferred root spelling first,
 * then the enharmonic one (Db becomes C#) when the first would need a double accidental.
 */
export function scaleNotes(root: number, id: ScaleId, flats = usesFlats(root, 'major')): string[] {
  const def = SCALES.find((scale) => scale.id === id)!;
  return (
    spell(root, def, flats) ??
    spell(root, def, !flats) ??
    def.degrees.map(([semitones]) => noteName(root + semitones, flats))
  );
}

/** All scales for a detected key, with the key's own scale first. */
export function scalesForKey(key: Key): Scale[] {
  const flats = usesFlats(key.root, key.mode);
  const own = key.mode === 'major' ? 'major' : 'minor';
  const ordered = [...SCALES.filter((s) => s.id === own), ...SCALES.filter((s) => s.id !== own)];
  return ordered.map(({ id, name }) => ({ id, name, notes: scaleNotes(key.root, id, flats) }));
}
