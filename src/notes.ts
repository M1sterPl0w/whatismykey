export type Mode = 'major' | 'minor';

export interface Key {
  root: number;
  mode: Mode;
}

export const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
export const LETTER_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Keys written with flats: F, Bb, Eb, Ab, Db, Gb major and their relative minors.
const FLAT_MAJOR_ROOTS = new Set([5, 10, 3, 8, 1, 6]);
const FLAT_MINOR_ROOTS = new Set([2, 7, 0, 5, 10, 3]);

export const mod12 = (n: number): number => ((n % 12) + 12) % 12;

/** Pitch class (C = 0) of a note name like `F#`, `Bb` or `F♯`, or null if invalid. */
export function parsePitch(name: string): number | null {
  const match = /^([A-G])([#♯b♭]?)$/.exec(name);
  if (!match) return null;
  const accidental = match[2] === '#' || match[2] === '♯' ? 1 : match[2] === '' ? 0 : -1;
  return mod12(LETTER_PC[match[1]] + accidental);
}

export function noteName(pc: number, flats: boolean): string {
  return (flats ? FLAT_NAMES : SHARP_NAMES)[mod12(pc)];
}

export function usesFlats(root: number, mode: Mode): boolean {
  return (mode === 'major' ? FLAT_MAJOR_ROOTS : FLAT_MINOR_ROOTS).has(mod12(root));
}

export function keyName(key: Key): string {
  return `${noteName(key.root, usesFlats(key.root, key.mode))} ${key.mode}`;
}
