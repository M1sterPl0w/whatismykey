import { mod12, noteName, parsePitch } from './notes';

export type Quality = 'major' | 'minor' | '7' | 'maj7' | 'm7' | 'sus2' | 'sus4' | 'dim' | 'aug';

export interface Chord {
  root: number;
  quality: Quality;
  bass?: number;
}

export type ChordResult = { ok: true; chord: Chord } | { ok: false; error: string };
export type CapoResult = { ok: true; chords: Chord[] } | { ok: false; error: string };

export const CHORD_INTERVALS: Record<Quality, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  '7': [0, 4, 7, 10],
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
};

const SUFFIX_QUALITY: Record<string, Quality> = {
  '': 'major',
  m: 'minor',
  min: 'minor',
  '7': '7',
  maj7: 'maj7',
  M7: 'maj7',
  m7: 'm7',
  min7: 'm7',
  sus2: 'sus2',
  sus4: 'sus4',
  sus: 'sus4',
  dim: 'dim',
  aug: 'aug',
};

const SUFFIX_NAME: Record<Quality, string> = {
  major: '',
  minor: 'm',
  '7': '7',
  maj7: 'maj7',
  m7: 'm7',
  sus2: 'sus2',
  sus4: 'sus4',
  dim: 'dim',
  aug: 'aug',
};

const CHORD_PATTERN = /^([A-G][#♯b♭]?)([^/]*)(?:\/([A-G][#♯b♭]?))?$/;

export function parseChord(symbol: string): ChordResult {
  const match = CHORD_PATTERN.exec(symbol.trim());
  if (!match) return { ok: false, error: `Unknown chord: ${symbol}` };
  const quality = SUFFIX_QUALITY[match[2]];
  if (!quality) return { ok: false, error: `Unsupported chord quality in: ${symbol}` };
  const chord: Chord = { root: parsePitch(match[1])!, quality };
  if (match[3]) chord.bass = parsePitch(match[3])!;
  return { ok: true, chord };
}

export function applyCapo(chords: Chord[], fret: number): CapoResult {
  if (!Number.isInteger(fret) || fret < 0 || fret > 12) {
    return { ok: false, error: `Capo fret must be a whole number from 0 to 12, got ${fret}` };
  }
  return {
    ok: true,
    chords: chords.map((chord) => ({
      ...chord,
      root: mod12(chord.root + fret),
      ...(chord.bass === undefined ? {} : { bass: mod12(chord.bass + fret) }),
    })),
  };
}

export function formatChord(chord: Chord, flats = false): string {
  const bass = chord.bass === undefined ? '' : `/${noteName(chord.bass, flats)}`;
  return `${noteName(chord.root, flats)}${SUFFIX_NAME[chord.quality]}${bass}`;
}
