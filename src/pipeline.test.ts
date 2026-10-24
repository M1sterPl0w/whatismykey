import { describe, expect, it } from 'vitest';
import { applyCapo, Chord, parseChord } from './chord';
import { detectKeys } from './key';
import { keyName } from './notes';
import { scalesForKey } from './scales';

function parseAll(symbols: string[]): Chord[] {
  return symbols.map((symbol) => {
    const result = parseChord(symbol);
    if (!result.ok) throw new Error(result.error);
    return result.chord;
  });
}

describe('chord sheet to key and scales', () => {
  it('turns G, C, D with capo 2 into A major and its scales', () => {
    const capo = applyCapo(parseAll(['G', 'C', 'D']), 2);
    if (!capo.ok) throw new Error(capo.error);

    const detection = detectKeys(capo.chords);
    expect(detection.mostLikely).not.toBeNull();
    expect(keyName(detection.mostLikely!)).toBe('A major');

    const scales = scalesForKey(detection.mostLikely!);
    expect(scales).toHaveLength(10);
    expect(scales[0].notes).toEqual(['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']);
  });
});
