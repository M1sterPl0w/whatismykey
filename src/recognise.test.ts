import { describe, expect, it } from 'vitest';
import { formatChord } from './chord';
import { NoteEvent, recogniseChords } from './recognise';

const sound = (pitches: number[], start: number, end: number): NoteEvent[] =>
  pitches.map((pitch) => ({ start, end, pitch, amplitude: 0.8 }));

const heard = (notes: NoteEvent[]) => recogniseChords(notes).map(({ chord }) => formatChord(chord));

const VOICING = {
  G: [43, 47, 50, 55, 59],
  D: [50, 57, 62, 66],
  Em: [40, 47, 52, 55, 59],
  C: [48, 52, 55, 60, 64],
};

describe('recogniseChords', () => {
  it('hears a major chord', () => {
    expect(heard(sound([60, 64, 67], 0, 2))).toEqual(['C']);
  });

  it('hears a minor chord', () => {
    expect(heard(sound([57, 60, 64], 0, 2))).toEqual(['Am']);
  });

  it('hears a dominant 7 chord', () => {
    expect(heard(sound([43, 47, 50, 53], 0, 2))).toEqual(['G7']);
  });

  it('does not mind the octave of the notes', () => {
    expect(heard(sound([40, 47, 52, 56, 59, 64], 0, 2))).toEqual(['E']);
  });

  it('follows a progression', () => {
    const notes = [
      ...sound(VOICING.G, 0, 2),
      ...sound(VOICING.D, 2, 4),
      ...sound(VOICING.Em, 4, 6),
      ...sound(VOICING.C, 6, 8),
    ];
    expect(heard(notes)).toEqual(['G', 'D', 'Em', 'C']);
  });

  it('reports start and end times', () => {
    const [first, second] = recogniseChords([...sound(VOICING.G, 0, 2), ...sound(VOICING.D, 2, 4)]);
    expect(first.start).toBeCloseTo(0);
    expect(first.end).toBeCloseTo(2, 0);
    expect(second.start).toBeCloseTo(2, 0);
  });

  it('ignores a passing blip between two equal chords', () => {
    const notes = [...sound(VOICING.G, 0, 2), ...sound([42, 46, 49], 2, 2.1), ...sound(VOICING.G, 2.1, 4)];
    expect(heard(notes)).toEqual(['G']);
  });

  it('merges the same chord struck twice', () => {
    expect(heard([...sound(VOICING.C, 0, 1), ...sound(VOICING.C, 1, 2)])).toEqual(['C']);
  });

  it('drops a chord shorter than 0.4 seconds', () => {
    expect(heard(sound(VOICING.C, 0, 0.3))).toEqual([]);
  });

  it('reports nothing for a single melody note', () => {
    expect(heard(sound([69], 0, 2))).toEqual([]);
  });

  it('returns an empty list when there are no notes', () => {
    expect(recogniseChords([])).toEqual([]);
  });
});
