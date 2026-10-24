import { describe, expect, it } from 'vitest';
import { Chord, parseChord } from './chord';
import { detectKeys } from './key';
import { chordLabel, keyRows } from './view';

function parseAll(...symbols: string[]): Chord[] {
  return symbols.map((symbol) => {
    const result = parseChord(symbol);
    if (!result.ok) throw new Error(result.error);
    return result.chord;
  });
}

describe('chordLabel', () => {
  it('writes chords as on the sheet', () => {
    expect(parseAll('G', 'Am', 'Bb', 'F#m7').map(chordLabel)).toEqual(['G', 'Am', 'Bb', 'F#m7']);
  });
});

describe('keyRows', () => {
  it('labels the most likely key', () => {
    const rows = keyRows(detectKeys(parseAll('A', 'D', 'E')));
    expect(rows[0]).toMatchObject({ name: 'A major', mostLikely: true });
    expect(rows.slice(1).every((row) => !row.mostLikely)).toBe(true);
  });

  it('labels no key on a tie', () => {
    const rows = keyRows(detectKeys(parseAll('C', 'Am')));
    expect(rows.some((row) => row.mostLikely)).toBe(false);
  });

  it('is empty without chords', () => {
    expect(keyRows(detectKeys([]))).toEqual([]);
  });
});
