import { describe, expect, it } from 'vitest';
import { Chord, parseChord } from './chord';
import { detectKeys } from './key';
import { chordLabel, formatTime, heardToShapes, keyRows, listenErrorMessage, needleSvg, tabsHtml } from './view';

function parseAll(...symbols: string[]): Chord[] {
  return symbols.map((symbol) => {
    const result = parseChord(symbol);
    if (!result.ok) throw new Error(result.error);
    return result.chord;
  });
}

describe('chordLabel', () => {
  it('writes chords as on the sheet', () => {
    expect(parseAll('G', 'Am', 'Bb', 'F#m7').map(chordLabel)).toEqual(['G', 'Am', 'Bb', 'F#m7']);
  });
});

describe('keyRows', () => {
  it('labels the most likely key', () => {
    const rows = keyRows(detectKeys(parseAll('A', 'D', 'E')));
    expect(rows[0]).toMatchObject({ name: 'A major', mostLikely: true });
    expect(rows.slice(1).every((row) => !row.mostLikely)).toBe(true);
  });

  it('labels no key on a tie', () => {
    const rows = keyRows(detectKeys(parseAll('C', 'Am')));
    expect(rows.some((row) => row.mostLikely)).toBe(false);
  });

  it('is empty without chords', () => {
    expect(keyRows(detectKeys([]))).toEqual([]);
  });
});

describe('heardToShapes', () => {
  it('keeps the chords at capo 0', () => {
    expect(heardToShapes(parseAll('A', 'D', 'E'), 0).map(chordLabel)).toEqual(['A', 'D', 'E']);
  });

  it('lowers heard chords by the capo fret', () => {
    expect(heardToShapes(parseAll('A', 'D', 'E'), 2).map(chordLabel)).toEqual(['G', 'C', 'D']);
  });

  it('wraps around the octave and keeps the quality', () => {
    expect(heardToShapes(parseAll('Am', 'C7'), 3).map(chordLabel)).toEqual(['F#m', 'A7']);
  });
});

describe('formatTime', () => {
  it('shows minutes and seconds', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(7.9)).toBe('0:07');
    expect(formatTime(60)).toBe('1:00');
  });
});

describe('listenErrorMessage', () => {
  const named = (name: string) => Object.assign(new Error('x'), { name });

  it('explains a denied microphone', () => {
    expect(listenErrorMessage(named('NotAllowedError'))).toContain('microphone is needed');
  });

  it('explains a missing microphone', () => {
    expect(listenErrorMessage(named('NotFoundError'))).toContain('No microphone');
  });

  it('explains an unsupported browser', () => {
    expect(listenErrorMessage(new TypeError('no mediaDevices'))).toContain("can't record");
  });

  it('explains a browser that cannot record', () => {
    expect(listenErrorMessage(named('NotSupportedError'))).toContain("can't record");
  });

  it('has a fallback', () => {
    expect(listenErrorMessage(named('Weird'))).toBe('Could not start listening.');
  });
});

describe('tabsHtml', () => {
  const pressed = (html: string) =>
    [...html.matchAll(/data-screen="(\w+)" aria-pressed="true"/g)].map((match) => match[1]);

  it('shows three buttons: Key, Tuner and Chords', () => {
    const html = tabsHtml('key');
    expect([...html.matchAll(/data-screen="(\w+)"/g)].map((m) => m[1])).toEqual(['key', 'tuner', 'chords']);
    expect(html).toMatch(/>Key<.*>Tuner<.*>Chords</);
  });

  it.each(['key', 'tuner', 'chords'] as const)('marks only %s as selected', (screen) => {
    expect(pressed(tabsHtml(screen))).toEqual([screen]);
  });
});

describe('needleSvg', () => {
  it('has a needle and a centre tick', () => {
    const svg = needleSvg();
    expect(svg).toContain('id="tuner-needle"');
    expect(svg).toContain('dial-centre');
  });
});
