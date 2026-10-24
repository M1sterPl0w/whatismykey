import { parsePitch } from './notes';

/** Open-string pitch classes, high e first (standard tuning E A D G B e). */
export const STRINGS = [
  { name: 'e', pc: 4 },
  { name: 'B', pc: 11 },
  { name: 'G', pc: 7 },
  { name: 'D', pc: 2 },
  { name: 'A', pc: 9 },
  { name: 'E', pc: 4 },
];

export const FRETS = 12;
const MARKED_FRETS = [3, 5, 7, 9, 12];

const WIDTH = 360;
const NUT_X = 40;
const FRET_W = (WIDTH - NUT_X - 8) / FRETS;
const TOP = 16;
const STRING_GAP = 20;
const HEIGHT = TOP + 5 * STRING_GAP + 28;

/** SVG of the neck with the sounding notes of a scale marked; `notes[0]` is the root. */
export function fretboardSvg(notes: string[]): string {
  const names = new Map<number, string>();
  for (const note of notes) names.set(parsePitch(note)!, note);
  const rootPc = parsePitch(notes[0]);

  const parts: string[] = [
    `<svg class="fretboard" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="Fretboard showing ${notes.join(' ')}">`,
  ];

  for (let fret = 0; fret <= FRETS; fret++) {
    const x = NUT_X + fret * FRET_W;
    parts.push(
      `<line class="${fret === 0 ? 'fb-nut' : 'fb-fret'}" x1="${x}" y1="${TOP}" x2="${x}" y2="${TOP + 5 * STRING_GAP}"/>`,
    );
  }

  STRINGS.forEach((string, index) => {
    const y = TOP + index * STRING_GAP;
    parts.push(
      `<line class="fb-string" x1="${NUT_X}" y1="${y}" x2="${NUT_X + FRETS * FRET_W}" y2="${y}"/>`,
      `<text class="fb-label" x="8" y="${y + 4}">${string.name}</text>`,
    );
    for (let fret = 0; fret <= FRETS; fret++) {
      const pc = (string.pc + fret) % 12;
      const name = names.get(pc);
      if (!name) continue;
      const root = pc === rootPc;
      const x = fret === 0 ? NUT_X - 14 : NUT_X + (fret - 0.5) * FRET_W;
      parts.push(
        `<circle class="fb-mark-dot ${root ? 'fb-root' : 'fb-note'}" data-string="${index}" data-fret="${fret}" cx="${x}" cy="${y}" r="9"/>`,
        `<text class="fb-mark ${root ? 'fb-root-text' : ''}" x="${x}" y="${y + 3}">${name}</text>`,
      );
    }
  });

  for (const fret of MARKED_FRETS) {
    const x = NUT_X + (fret - 0.5) * FRET_W;
    parts.push(`<text class="fb-label" x="${x}" y="${HEIGHT - 6}">${fret}</text>`);
  }

  parts.push('</svg>');
  return parts.join('');
}
