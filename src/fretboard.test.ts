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
    // strings high to low: e B G D A E
    expect(marks(aMajor, 'fb-root')).toEqual([
      [0, 5],
      [1, 10],
      [2, 2],
      [3, 7],
      [4, 0],
      [4, 12],
      [5, 5],
    ]);
  });

  it('marks the open A, B, D and E strings but not the open G', () => {
    const open = [...marks(aMajor, 'fb-root'), ...marks(aMajor, 'fb-note')].filter(([, fret]) => fret === 0);
    const strings = open.map(([string]) => string).sort();
    expect(strings).toEqual([0, 1, 3, 4, 5]);
    expect(strings).not.toContain(2);
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
