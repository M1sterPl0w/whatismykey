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

describe('upright fretboard', () => {
  const upright = fretboardSvg(scaleNotes(9, 'major'), 'upright');
  const all = (svg: string) =>
    [...svg.matchAll(/class="fb-mark-dot (fb-root|fb-note)" data-string="(\d)" data-fret="(\d+)"/g)].map(
      (m) => `${m[1]}:${m[2]}:${m[3]}`,
    );

  it('marks the same notes as the flat layout', () => {
    expect(all(upright).sort()).toEqual(all(aMajor).sort());
  });

  it('colours every A as the root and leaves the open G unmarked', () => {
    expect(marks(upright, 'fb-root')).toEqual(marks(aMajor, 'fb-root'));
    expect(all(upright)).not.toContain('fb-note:2:0');
  });

  it('puts the low E string on the left', () => {
    const x = (string: number) =>
      Number(new RegExp(`data-string="${string}" data-fret="\\d+" cx="([\\d.]+)"`).exec(upright)![1]);
    expect(x(5)).toBeLessThan(x(4));
    expect(x(1)).toBeLessThan(x(0));
  });

  it('draws marks at least 28 px across on a 360 px wide screen', () => {
    expect(upright).toContain('viewBox="0 0 360 ');
    const radii = [...upright.matchAll(/class="fb-mark-dot[^"]*"[^>]* r="(\d+)"/g)].map((m) => Number(m[1]) * 2);
    expect(radii.length).toBeGreaterThan(0);
    expect(Math.min(...radii)).toBeGreaterThanOrEqual(28);
  });

  it('labels strings and frets upright', () => {
    for (const label of ['>e<', '>E<', '>3<', '>12<']) expect(upright).toContain(label);
    expect(upright).not.toContain('rotate');
  });
});
