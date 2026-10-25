import { describe, expect, it } from 'vitest';
import { CHORD_INTERVALS, Quality } from './chord';
import { gripsFor, MAX_FRET, soundedPc } from './grips';
import { mod12 } from './notes';
import { QUALITIES } from './view';

describe('gripsFor', () => {
  it('gives open C, A shape at 3 and E shape at 8 for C major', () => {
    const grips = gripsFor(0, 'major');
    expect(grips.map((g) => [g.label, g.shape])).toEqual([
      ['Open', 'Open'],
      ['Fret 3', 'A shape'],
      ['Fret 8', 'E shape'],
      ['Fret 10', 'D shape'],
    ]);
    expect(grips[0].frets).toEqual([null, 3, 2, 0, 1, 0]);
    expect(grips[1].frets).toEqual([null, 3, 5, 5, 5, 3]);
    expect(grips[2].frets).toEqual([8, 10, 10, 9, 8, 8]);
  });

  it('gives the open D chord from the D shape', () => {
    expect(gripsFor(2, 'major')[0]).toMatchObject({ label: 'Open', frets: [null, null, 0, 2, 3, 2] });
  });

  it('gives open A minor and E minor', () => {
    expect(gripsFor(9, 'minor')[0].frets).toEqual([null, 0, 2, 2, 1, 0]);
    expect(gripsFor(4, 'minor')[0].frets).toEqual([0, 2, 2, 0, 0, 0]);
  });

  describe.each(Array.from({ length: 12 }, (_, root) => root))('root %i', (root) => {
    it.each(QUALITIES.map((q) => q.quality as Quality))('%s has valid grips', (quality) => {
      const grips = gripsFor(root, quality);
      expect(grips.length).toBeGreaterThanOrEqual(2);

      const tones = CHORD_INTERVALS[quality].map((i) => mod12(root + i));
      const positions = grips.map((g) => (g.label === 'Open' ? 0 : Number(g.label.slice(5))));
      expect(positions).toEqual([...positions].sort((a, b) => a - b));

      for (const grip of grips) {
        expect(grip.frets).toHaveLength(6);
        const sounded = grip.frets.flatMap((fret, string) => (fret === null ? [] : [soundedPc(string, fret)]));
        expect(sounded.every((pc) => tones.includes(pc))).toBe(true);
        // Dominant 7 grips may leave out the fifth.
        const needed = quality === '7' ? tones.filter((_, i) => i !== 2) : tones;
        expect(needed.every((pc) => sounded.includes(pc))).toBe(true);
        expect(sounded[0]).toBe(root);
        expect(Math.max(...grip.frets.filter((f): f is number => f !== null))).toBeLessThanOrEqual(MAX_FRET);
      }
    });
  });
});
