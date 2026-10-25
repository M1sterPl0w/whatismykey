import { Frets, soundedPc } from './grips';
import { noteName } from './notes';

const WIDTH = 120;
const LEFT = 22;
const STRING_GAP = 15;
const TOP = 30;
const ROW_H = 22;
const ROWS = 5;
const HEIGHT = TOP + ROWS * ROW_H + 8;

const stringX = (string: number): number => LEFT + string * STRING_GAP;

/**
 * SVG chord diagram: low E on the left, one row per fret. Dots carry the note name and the root is
 * marked differently. `root` is a pitch class; `flats` picks the note spelling.
 */
export function chordDiagramSvg(frets: Frets, root: number, flats: boolean, name: string): string {
  const fretted = frets.filter((f): f is number => f !== null && f > 0);
  const hasOpen = frets.includes(0);
  const lowest = Math.min(...fretted);
  const start = hasOpen || lowest <= 1 ? 1 : lowest;

  const parts: string[] = [
    `<svg class="chord-diagram" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${name}, ${frets
      .map((f) => (f === null ? 'x' : f))
      .join(' ')}">`,
  ];

  const right = stringX(5);
  parts.push(
    `<line class="${start === 1 ? 'fb-nut' : 'fb-fret'}" x1="${LEFT}" y1="${TOP}" x2="${right}" y2="${TOP}"/>`,
  );
  for (let row = 1; row <= ROWS; row++) {
    const y = TOP + row * ROW_H;
    parts.push(`<line class="fb-fret" x1="${LEFT}" y1="${y}" x2="${right}" y2="${y}"/>`);
  }
  for (let string = 0; string < 6; string++) {
    const x = stringX(string);
    parts.push(`<line class="fb-string" x1="${x}" y1="${TOP}" x2="${x}" y2="${TOP + ROWS * ROW_H}"/>`);
  }

  if (start > 1) {
    parts.push(`<text class="cd-fret" x="${LEFT - 8}" y="${TOP + ROW_H / 2 + 4}">${start}</text>`);
  }

  // A bar where two or more strings share the lowest fret and nothing rings open.
  if (!hasOpen && fretted.length > 0) {
    const onLowest = frets.flatMap((f, string) => (f === lowest ? [string] : []));
    if (onLowest.length >= 2) {
      const y = TOP + (lowest - start + 0.5) * ROW_H;
      const x1 = stringX(onLowest[0]);
      parts.push(
        `<rect class="cd-barre" x="${x1 - 6}" y="${y - 6}" width="${stringX(onLowest[onLowest.length - 1]) - x1 + 12}" height="12" rx="6"/>`,
      );
    }
  }

  frets.forEach((fret, string) => {
    const x = stringX(string);
    if (fret === null) {
      parts.push(`<text class="cd-mute" x="${x}" y="${TOP - 9}">×</text>`);
    } else if (fret === 0) {
      parts.push(`<circle class="cd-open" cx="${x}" cy="${TOP - 12}" r="4"/>`);
    } else {
      const y = TOP + (fret - start + 0.5) * ROW_H;
      const pc = soundedPc(string, fret);
      const isRoot = pc === root;
      parts.push(
        `<circle class="cd-dot ${isRoot ? 'fb-root' : 'fb-note'}" data-string="${string}" data-fret="${fret}" cx="${x}" cy="${y}" r="8"/>`,
        `<text class="fb-mark ${isRoot ? 'fb-root-text' : ''}" x="${x}" y="${y + 3}">${noteName(pc, flats)}</text>`,
      );
    }
  });

  parts.push('</svg>');
  return parts.join('');
}
