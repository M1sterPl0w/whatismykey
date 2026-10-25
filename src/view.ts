import { Chord, formatChord } from './chord';
import { KeyDetection } from './key';
import { Key, keyName, mod12 } from './notes';
import { NEEDLE_RANGE_CENTS } from './tunings';

export const ROOTS = [
  { label: 'C', pc: 0 },
  { label: 'C#', pc: 1 },
  { label: 'D', pc: 2 },
  { label: 'Eb', pc: 3 },
  { label: 'E', pc: 4 },
  { label: 'F', pc: 5 },
  { label: 'F#', pc: 6 },
  { label: 'G', pc: 7 },
  { label: 'Ab', pc: 8 },
  { label: 'A', pc: 9 },
  { label: 'Bb', pc: 10 },
  { label: 'B', pc: 11 },
] as const;

export const QUALITIES = [
  { label: 'maj', quality: 'major' },
  { label: 'm', quality: 'minor' },
  { label: '7', quality: '7' },
  { label: 'maj7', quality: 'maj7' },
  { label: 'm7', quality: 'm7' },
  { label: 'sus2', quality: 'sus2' },
  { label: 'sus4', quality: 'sus4' },
  { label: 'dim', quality: 'dim' },
  { label: 'aug', quality: 'aug' },
] as const;

/** Chord as written on the sheet: the root buttons spell Eb, Ab and Bb with flats. */
export function chordLabel(chord: Chord): string {
  return formatChord(chord, [3, 8, 10].includes(chord.root));
}

export interface KeyRow {
  key: Key;
  name: string;
  mostLikely: boolean;
}

export function keyRows(detection: KeyDetection): KeyRow[] {
  const best = detection.mostLikely;
  return detection.keys.map(({ key }) => ({
    key,
    name: keyName(key),
    mostLikely: best !== null && key.root === best.root && key.mode === best.mode,
  }));
}

/** Heard chords are sounding chords; the list holds shapes, so each is lowered by the capo fret. */
export function heardToShapes(chords: Chord[], capo: number): Chord[] {
  return chords.map(({ root, quality }) => ({ root: mod12(root - capo), quality }));
}

export function formatTime(seconds: number): string {
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

/** Short message for a failure to start recording, by the browser's error name. */
export function listenErrorMessage(error: unknown): string {
  const name = error instanceof Error ? error.name : '';
  if (name === 'NotAllowedError' || name === 'SecurityError') {
    return 'The microphone is needed to listen. Allow it for this page in your browser settings.';
  }
  if (name === 'NotFoundError' || name === 'NotReadableError' || name === 'OverconstrainedError') {
    return 'No microphone was found.';
  }
  if (name === 'NotSupportedError' || error instanceof TypeError) return "This browser can't record audio.";
  return 'Could not start listening.';
}

export type Screen = 'key' | 'tuner' | 'chords';

export const SCREENS: { screen: Screen; label: string }[] = [
  { screen: 'key', label: 'Key' },
  { screen: 'tuner', label: 'Tuner' },
  { screen: 'chords', label: 'Chords' },
];

/** The row of navigation buttons; the button of the current screen is pressed. */
export function tabsHtml(current: Screen): string {
  const buttons = SCREENS.map(
    ({ screen, label }) =>
      `<button data-action="screen" data-screen="${screen}" aria-pressed="${screen === current}"${screen === current ? ' aria-current="page"' : ''}>${label}</button>`,
  ).join('');
  return `<nav class="tabs" aria-label="Screens">${buttons}</nav>`;
}

/** Dial for the tuner; the needle (`#tuner-needle`) is turned by the page, a tick every 10 cents. */
export function needleSvg(): string {
  const ticks: string[] = [];
  for (let cents = -NEEDLE_RANGE_CENTS; cents <= NEEDLE_RANGE_CENTS; cents += 10) {
    const centre = cents === 0;
    ticks.push(
      `<line class="${centre ? 'dial-centre' : 'dial-tick'}" x1="100" y1="${centre ? 18 : 24}" x2="100" y2="34" transform="rotate(${(cents / NEEDLE_RANGE_CENTS) * 45} 100 105)"/>`,
    );
  }
  return `<svg class="dial" viewBox="0 0 200 120" role="img" aria-label="Tuning needle">
    ${ticks.join('')}
    <line id="tuner-needle" class="dial-needle" x1="100" y1="105" x2="100" y2="30" style="transform:rotate(0deg)"/>
    <circle class="dial-hub" cx="100" cy="105" r="6"/>
  </svg>`;
}
