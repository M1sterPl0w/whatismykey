import { describe, expect, it } from 'vitest';
import { applyCapo, Chord, formatChord, parseChord } from './chord';

function parseAll(symbols: string[]): Chord[] {
  return symbols.map((symbol) => {
    const result = parseChord(symbol);
    if (!result.ok) throw new Error(result.error);
    return result.chord;
  });
}

describe('parseChord', () => {
  it('parses simple chords', () => {
    expect(parseChord('G')).toEqual({ ok: true, chord: { root: 7, quality: 'major' } });
    expect(parseChord('Am')).toEqual({ ok: true, chord: { root: 9, quality: 'minor' } });
    expect(parseChord('D7')).toEqual({ ok: true, chord: { root: 2, quality: '7' } });
  });

  it('parses every supported quality', () => {
    const expected = {
      Cmaj7: 'maj7',
      Cm7: 'm7',
      Csus2: 'sus2',
      Csus4: 'sus4',
      Csus: 'sus4',
      Cdim: 'dim',
      Caug: 'aug',
    };
    for (const [symbol, quality] of Object.entries(expected)) {
      expect(parseChord(symbol)).toEqual({ ok: true, chord: { root: 0, quality } });
    }
  });

  it('parses a slash chord', () => {
    expect(parseChord('C/E')).toEqual({ ok: true, chord: { root: 0, quality: 'major', bass: 4 } });
  });

  it('reports an error for unknown symbols', () => {
    expect(parseChord('H')).toMatchObject({ ok: false });
    expect(parseChord('Cfoo')).toMatchObject({ ok: false });
    expect(parseChord('')).toMatchObject({ ok: false });
  });

  it('accepts sharp, flat and Unicode accidentals as the same pitch', () => {
    expect(parseChord('F#m')).toEqual(parseChord('F♯m'));
    expect(parseChord('Bb')).toEqual({ ok: true, chord: { root: 10, quality: 'major' } });
    expect(parseChord('Bb')).toEqual(parseChord('A#'));
  });
});

describe('applyCapo', () => {
  it('shifts chords up by the capo fret', () => {
    const result = applyCapo(parseAll(['G', 'C', 'D']), 2);
    expect(result.ok && result.chords.map((chord) => formatChord(chord))).toEqual(['A', 'D', 'E']);
  });

  it('leaves chords unchanged at capo 0', () => {
    const chords = parseAll(['G', 'C/E']);
    expect(applyCapo(chords, 0)).toEqual({ ok: true, chords });
  });

  it('shifts the bass note too', () => {
    const result = applyCapo(parseAll(['C/E']), 2);
    expect(result.ok && formatChord(result.chords[0])).toBe('D/F#');
  });

  it('rejects a capo outside 0 to 12', () => {
    const chords = parseAll(['G']);
    expect(applyCapo(chords, -1)).toMatchObject({ ok: false });
    expect(applyCapo(chords, 13)).toMatchObject({ ok: false });
    expect(applyCapo(chords, 1.5)).toMatchObject({ ok: false });
  });
});
