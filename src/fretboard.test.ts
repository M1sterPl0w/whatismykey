import { describe, expect, it } from 'vitest';
import { fretboardSvg } from './fretboard';
import { scaleNotes } from './scales';

const aMajor = fretboardSvg(scaleNotes(9, 'major'));

const marks = (svg: string, cls: string) =>
  [...svg.matchAll(new RegExp(`class="fb-mark-dot ${cls}" data-string="(\\d)" data-fret="(\\d+)"`, 'g'))].map(
    (m) => [Number(m[1]), Number(m[2])],
  );

describe('fretboardSvg', () => {
  it('colours every A as the root', () => {
    // strings top to bottom: E A D G B e
    expect(marks(aMajor, 'fb-root')).toEqual([
      [0, 5],
      [1, 0],
      [1, 12],
      [2, 7],
      [3, 2],
      [4, 10],
      [5, 5],
    ]);
  });

  it('marks the open A, B, D and E strings but not the open G', () => {
    const open = [...marks(aMajor, 'fb-root'), ...marks(aMajor, 'fb-note')].filter(([, fret]) => fret === 0);
    const strings = open.map(([string]) => string).sort();
    expect(strings).toEqual([0, 1, 2, 4, 5]);
    expect(strings).not.toContain(3);
  });

  it('draws the strings from top to bottom as E A D G B e', () => {
    const labels = [...aMajor.matchAll(/class="fb-label" x="8" y="[\d.]+">(\w)</g)].map((m) => m[1]);
    expect(labels).toEqual(['E', 'A', 'D', 'G', 'B', 'e']);
    const ys = [...aMajor.matchAll(/class="fb-string"[^>]* y1="([\d.]+)"/g)].map((m) => Number(m[1]));
    expect([...ys].sort((a, b) => a - b)).toEqual(ys);
  });

  it('puts the nut on the left and the frets to the right', () => {
    const x = (fret: number) => Number(new RegExp(`data-fret="${fret}" cx="([\\d.]+)"`).exec(aMajor)![1]);
    expect(x(0)).toBeLessThan(x(1));
    expect(x(1)).toBeLessThan(x(12));
  });

  it('labels the strings and fret markers', () => {
    for (const label of ['>e<', '>B<', '>G<', '>D<', '>A<', '>E<', '>3<', '>5<', '>7<', '>9<', '>12<']) {
      expect(aMajor).toContain(label);
    }
  });

  it('shows note names on the marks', () => {
    expect(aMajor).toContain('>F#<');
    expect(aMajor).not.toContain('>F<');
  });
});
