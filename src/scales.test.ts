import { describe, expect, it } from 'vitest';
import { SCALES, scaleNotes, scalesForKey } from './scales';

describe('scaleNotes', () => {
  it('computes A major', () => {
    expect(scaleNotes(9, 'major')).toEqual(['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']);
  });

  it('computes A minor pentatonic', () => {
    expect(scaleNotes(9, 'minor-pentatonic')).toEqual(['A', 'C', 'D', 'E', 'G']);
  });

  it('computes A blues', () => {
    expect(scaleNotes(9, 'blues')).toEqual(['A', 'C', 'D', 'Eb', 'E', 'G']);
  });

  it('computes E Mixolydian', () => {
    expect(scaleNotes(4, 'mixolydian')).toEqual(['E', 'F#', 'G#', 'A', 'B', 'C#', 'D']);
  });

  it('spells F major with flats and D major with sharps', () => {
    expect(scaleNotes(5, 'major')).toEqual(['F', 'G', 'A', 'Bb', 'C', 'D', 'E']);
    expect(scaleNotes(2, 'major')).toEqual(['D', 'E', 'F#', 'G', 'A', 'B', 'C#']);
  });

  it('uses each letter once in every seven-note scale on every root', () => {
    for (const scale of SCALES.filter((s) => s.degrees.length === 7)) {
      for (let root = 0; root < 12; root++) {
        const letters = scaleNotes(root, scale.id).map((note) => note[0]);
        expect(new Set(letters).size).toBe(7);
      }
    }
  });
});

describe('scalesForKey', () => {
  it('offers all ten scales with A major first', () => {
    const scales = scalesForKey({ root: 9, mode: 'major' });
    expect(scales).toHaveLength(10);
    expect(scales[0].id).toBe('major');
    expect(scales[0].notes).toEqual(['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']);
  });

  it('puts natural minor first for F# minor', () => {
    const scales = scalesForKey({ root: 6, mode: 'minor' });
    expect(scales[0].id).toBe('minor');
    expect(scales[0].notes).toEqual(['F#', 'G#', 'A', 'B', 'C#', 'D', 'E']);
  });
});
