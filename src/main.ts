import './style.css';
import { registerSW } from 'virtual:pwa-register';
import { applyCapo, Chord, Quality } from './chord';
import { detectKeys } from './key';
import { fretboardSvg } from './fretboard';
import { ScaleId, scalesForKey } from './scales';
import type { Recording } from './listen';
import { recogniseChords } from './recognise';
import { chordLabel, formatTime, heardToShapes, keyRows, listenErrorMessage, QUALITIES, ROOTS } from './view';

interface State {
  chords: Chord[];
  capo: number;
  pendingRoot: number | null;
  pendingQuality: Quality;
  selectedKey: number;
  /** null means the key's own scale. */
  selectedScale: ScaleId | null;
  /** Set when a new version is waiting; calling it reloads into that version. */
  applyUpdate: (() => void) | null;
  zoomed: boolean;
  listen: { status: 'idle' | 'preparing' | 'recording' | 'analysing'; message: string };
}

const state: State = {
  chords: [],
  capo: 0,
  pendingRoot: null,
  pendingQuality: 'major',
  selectedKey: 0,
  selectedScale: null,
  applyUpdate: null,
  zoomed: false,
  listen: { status: 'idle', message: '' },
};

let recording: Recording | null = null;
let clock: number | undefined;

const app = document.querySelector<HTMLDivElement>('#app')!;

function resetResults(): void {
  state.selectedKey = 0;
  state.selectedScale = null;
}

function listenSection(): string {
  const { status, message } = state.listen;
  const button =
    status === 'recording'
      ? '<button class="primary listen" data-action="stop">Stop</button>'
      : `<button class="listen" data-action="listen" ${status === 'idle' ? '' : 'disabled'}>Listen</button>`;
  const info =
    status === 'recording'
      ? `<span class="listen-info" role="status">Listening… <span id="listen-time">${formatTime(recording?.elapsed() ?? 0)}</span></span>`
      : status === 'preparing'
        ? '<span class="listen-info" role="status">Getting ready…</span>'
        : status === 'analysing'
          ? '<span class="listen-info" role="status">Analysing…</span>'
          : '';
  return `
    <div class="label">Listen to a song</div>
    <div class="row listen-row">${button}${info}</div>
    ${message ? `<p class="notice" role="alert">${message}</p>` : ''}`;
}

function chordSection(): string {
  const list = state.chords.length
    ? state.chords
        .map(
          (chord, i) =>
            `<span><button data-action="remove" data-index="${i}" aria-label="Remove ${chordLabel(chord)}">${chordLabel(chord)}<span class="remove">×</span></button></span>`,
        )
        .join('')
    : '<span class="empty">No chords yet.</span>';

  const roots = ROOTS.map(
    ({ label, pc }) =>
      `<button data-action="root" data-pc="${pc}" aria-pressed="${state.pendingRoot === pc}">${label}</button>`,
  ).join('');
  const qualities = QUALITIES.map(
    ({ label, quality }) =>
      `<button data-action="quality" data-quality="${quality}" aria-pressed="${state.pendingQuality === quality}">${label}</button>`,
  ).join('');
  const capo = Array.from(
    { length: 13 },
    (_, fret) =>
      `<button data-action="capo" data-fret="${fret}" aria-pressed="${state.capo === fret}">${fret}</button>`,
  ).join('');

  return `
    <div class="label">Song chords</div>
    <div class="row chord-list">${list}</div>
    ${listenSection()}
    <div class="label">Root</div>
    <div class="roots">${roots}</div>
    <div class="label">Type</div>
    <div class="row">${qualities}</div>
    <div class="row" style="margin-top:10px">
      <button class="primary" data-action="add" ${state.pendingRoot === null ? 'disabled' : ''}>Add chord</button>
      <button data-action="clear" ${state.chords.length === 0 ? 'disabled' : ''}>Clear</button>
    </div>
    <div class="label">Capo fret</div>
    <div class="row">${capo}</div>`;
}

function zoomOverlay(notes: string[]): string {
  return `<div class="zoom">
    <div class="zoom-bar"><button class="primary" data-action="unzoom">Close</button></div>
    <div class="zoom-board"><div class="zoom-turn">${fretboardSvg(notes)}</div></div>
  </div>`;
}

function resultsSection(): string {
  if (state.chords.length === 0) {
    return '<p class="empty">Add the chords of a song to see its key and scales.</p>';
  }

  const capo = applyCapo(state.chords, state.capo);
  if (!capo.ok) return `<p class="notice">${capo.error}</p>`;

  const detection = detectKeys(capo.chords);
  const rows = keyRows(detection);
  const selected = Math.min(state.selectedKey, rows.length - 1);

  const keys = rows
    .map(
      (row, i) =>
        `<button class="key" data-action="key" data-index="${i}" aria-pressed="${i === selected}"><span class="name">${row.name}</span>${row.mostLikely ? '<span class="tag">most likely</span>' : ''}</button>`,
    )
    .join('');
  const unclear = detection.unclear
    ? '<p class="notice">The key is unclear: few of these chords fit one key. These are the best guesses.</p>'
    : '';

  const scales = scalesForKey(rows[selected].key);
  const scale = scales.find((s) => s.id === state.selectedScale) ?? scales[0];
  const chips = scales
    .map(
      (s) =>
        `<button data-action="scale" data-id="${s.id}" aria-pressed="${s.id === scale.id}">${s.name}</button>`,
    )
    .join('');

  return `
    <div class="label">Likely keys</div>
    ${unclear}
    <div class="keys">${keys}</div>
    <div class="label">Scale</div>
    <div class="row">${chips}</div>
    <div class="notes">${scale.notes.join(' ')}</div>
    <div class="board" data-action="zoom" role="button" tabindex="0" aria-label="Enlarge fretboard">
      ${fretboardSvg(scale.notes)}
      <div class="hint">Tap to enlarge</div>
    </div>
    ${state.zoomed ? zoomOverlay(scale.notes) : ''}`;
}

function updateBar(): string {
  return state.applyUpdate
    ? '<div class="update" role="status"><span>A new version is ready.</span><button class="primary" data-action="update">Reload</button></div>'
    : '';
}

function render(): void {
  app.innerHTML = `${updateBar()}<h1>WhatIsMyKey</h1>${chordSection()}${resultsSection()}`;
}

async function startListening(): Promise<void> {
  state.listen = { status: 'preparing', message: '' };
  render();
  try {
    const { startRecording } = await import('./listen');
    recording = await startRecording(() => void stopListening());
  } catch (error) {
    state.listen = { status: 'idle', message: listenErrorMessage(error) };
    render();
    return;
  }
  state.listen = { status: 'recording', message: '' };
  render();
  clock = window.setInterval(() => {
    const time = document.getElementById('listen-time');
    if (time && recording) time.textContent = formatTime(recording.elapsed());
  }, 250);
}

async function stopListening(): Promise<void> {
  if (!recording || state.listen.status !== 'recording') return;
  const finished = recording;
  recording = null;
  window.clearInterval(clock);
  state.listen = { status: 'analysing', message: '' };
  render();
  try {
    const { analyse } = await import('./listen');
    const heard = recogniseChords(await analyse(await finished.stop()));
    if (heard.length === 0) {
      state.listen = { status: 'idle', message: 'No chords were heard. Try again closer to the sound.' };
    } else {
      state.chords.push(...heardToShapes(heard.map((h) => h.chord), state.capo));
      resetResults();
      state.listen = { status: 'idle', message: '' };
    }
  } catch {
    state.listen = { status: 'idle', message: 'Could not analyse the recording.' };
  }
  render();
}

app.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
  if (!button) return;
  const data = button.dataset;

  switch (data.action) {
    case 'root':
      state.pendingRoot = Number(data.pc);
      break;
    case 'quality':
      state.pendingQuality = data.quality as Quality;
      break;
    case 'add':
      if (state.pendingRoot === null) return;
      state.chords.push({ root: state.pendingRoot, quality: state.pendingQuality });
      resetResults();
      break;
    case 'remove':
      state.chords.splice(Number(data.index), 1);
      resetResults();
      break;
    case 'clear':
      state.chords = [];
      state.capo = 0;
      resetResults();
      break;
    case 'capo':
      state.capo = Number(data.fret);
      resetResults();
      break;
    case 'key':
      state.selectedKey = Number(data.index);
      state.selectedScale = null;
      break;
    case 'listen':
      void startListening();
      return;
    case 'stop':
      void stopListening();
      return;
    case 'zoom':
      state.zoomed = true;
      break;
    case 'unzoom':
      state.zoomed = false;
      break;
    case 'update':
      state.applyUpdate?.();
      return;
    case 'scale':
      state.selectedScale = data.id as ScaleId;
      break;
  }
  render();
});

app.addEventListener('keydown', (event) => {
  const target = event.target as HTMLElement;
  if ((event.key === 'Enter' || event.key === ' ') && target.matches('.board')) {
    event.preventDefault();
    target.click();
  }
});

render();

const updateSW = registerSW({
  onNeedRefresh() {
    state.applyUpdate = () => void updateSW(true);
    render();
  },
});
