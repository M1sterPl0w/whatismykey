import { describe, expect, it } from 'vitest';
import { keyName, noteName, parsePitch, usesFlats } from './notes';

describe('parsePitch', () => {
  it('reads sharps, flats and Unicode accidentals', () => {
    expect(parsePitch('C')).toBe(0);
    expect(parsePitch('F#')).toBe(6);
    expect(parsePitch('F♯')).toBe(6);
    expect(parsePitch('Bb')).toBe(10);
    expect(parsePitch('B♭')).toBe(10);
  });

  it('treats equivalent spellings as the same pitch', () => {
    expect(parsePitch('F♯')).toBe(parsePitch('Gb'));
    expect(parsePitch('A#')).toBe(parsePitch('Bb'));
  });

  it('rejects invalid names', () => {
    expect(parsePitch('H')).toBeNull();
    expect(parsePitch('')).toBeNull();
    expect(parsePitch('C##')).toBeNull();
  });
});

describe('spelling', () => {
  it('uses flats for F major and sharps for D major', () => {
    expect(usesFlats(5, 'major')).toBe(true);
    expect(usesFlats(2, 'major')).toBe(false);
  });

  it('uses flats for relative minors of flat keys', () => {
    expect(usesFlats(2, 'minor')).toBe(true);
    expect(usesFlats(9, 'minor')).toBe(false);
  });

  it('names notes by the chosen spelling', () => {
    expect(noteName(10, true)).toBe('Bb');
    expect(noteName(10, false)).toBe('A#');
  });

  it('names keys', () => {
    expect(keyName({ root: 9, mode: 'major' })).toBe('A major');
    expect(keyName({ root: 10, mode: 'major' })).toBe('Bb major');
    expect(keyName({ root: 6, mode: 'minor' })).toBe('F# minor');
  });
});
