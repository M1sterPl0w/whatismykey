import { describe, expect, it } from 'vitest';
import { Chord, parseChord } from './chord';
import { detectKeys } from './key';
import { keyName } from './notes';

function chords(...symbols: string[]): Chord[] {
  return symbols.map((symbol) => {
    const result = parseChord(symbol);
    if (!result.ok) throw new Error(result.error);
    return result.chord;
  });
}

const names = (...symbols: string[]) => detectKeys(chords(...symbols)).keys.map((k) => keyName(k.key));

describe('detectKeys ranking', () => {
  it('finds a clear major key', () => {
    const result = detectKeys(chords('A', 'D', 'E'));
    expect(keyName(result.keys[0].key)).toBe('A major');
    expect(result.mostLikely).toEqual(result.keys[0].key);
  });

  it('finds a minor key with a major V', () => {
    expect(names('Am', 'Dm', 'E')[0]).toBe('A minor');
  });

  it('returns at most three keys', () => {
    expect(names('C', 'G', 'Am', 'F').length).toBeLessThanOrEqual(3);
  });

  it('ranks A minor above C major when the song starts and ends on Am', () => {
    const order = names('Am', 'C', 'G', 'Am');
    expect(order[0]).toBe('A minor');
    expect(order).toContain('C major');
  });

  it('ranks C major above A minor when the song starts and ends on C', () => {
    const result = detectKeys(chords('C', 'G', 'Am', 'C'));
    expect(keyName(result.keys[0].key)).toBe('C major');
    for (const other of result.keys.slice(1)) expect(result.keys[0].score).toBeGreaterThan(other.score);
  });
});

describe('detectKeys confidence', () => {
  it('marks a clear winner as most likely', () => {
    expect(detectKeys(chords('Am', 'C', 'G', 'Am')).mostLikely).toEqual({ root: 9, mode: 'minor' });
  });

  it('lists tied keys without a most likely mark', () => {
    const result = detectKeys(chords('C', 'Am'));
    expect(result.keys[0].score).toBeCloseTo(result.keys[1].score);
    expect(names('C', 'Am').slice(0, 2).sort()).toEqual(['A minor', 'C major']);
    expect(result.mostLikely).toBeNull();
  });

  it('reports an unclear key when the best key fits fewer than 60% of the chords', () => {
    const result = detectKeys(chords('C', 'C#', 'D', 'D#', 'E', 'F'));
    expect(result.keys[0].fitting / result.keys[0].total).toBeLessThan(0.6);
    expect(result.unclear).toBe(true);
  });

  it('does not report a clean progression as unclear', () => {
    expect(detectKeys(chords('A', 'D', 'E')).unclear).toBe(false);
  });
});

describe('detectKeys edge cases', () => {
  it('still returns a result when a sus chord fits no key', () => {
    const result = detectKeys(chords('A', 'Dsus4', 'E'));
    const aMajor = result.keys.find((k) => keyName(k.key) === 'A major');
    expect(aMajor).toMatchObject({ fitting: 2, total: 3 });
  });

  it('ignores the bass note of a slash chord', () => {
    expect(names('C/F#', 'G', 'Am')[0]).toBe('C major');
  });

  it('returns no keys for an empty list', () => {
    const result = detectKeys([]);
    expect(result.keys).toEqual([]);
    expect(result.mostLikely).toBeNull();
  });
});
