import './style.css';
import { registerSW } from 'virtual:pwa-register';
import { applyCapo, Chord, Quality } from './chord';
import { detectKeys } from './key';
import { fretboardSvg } from './fretboard';
import { ScaleId, scalesForKey } from './scales';
import type { Recording } from './listen';
import { recogniseChords } from './recognise';
import { gripsFor } from './grips';
import { chordDiagramSvg } from './chorddiagram';
import { needleAngle, readPitch, TUNINGS, tuningById } from './tunings';
import type { Tuner } from './tuner';
import {
  chordLabel,
  formatTime,
  heardToShapes,
  keyRows,
  listenErrorMessage,
  needleSvg,
  QUALITIES,
  ROOTS,
  Screen,
  tabsHtml,
} from './view';

interface State {
  screen: Screen;
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
  tuner: { status: 'idle' | 'starting' | 'listening'; message: string; tuning: string; locked: number | null };
  lookup: { root: number | null; quality: Quality; added: string };
}

const state: State = {
  screen: 'key',
  chords: [],
  capo: 0,
  pendingRoot: null,
  pendingQuality: 'major',
  selectedKey: 0,
  selectedScale: null,
  applyUpdate: null,
  zoomed: false,
  listen: { status: 'idle', message: '' },
  tuner: { status: 'idle', message: '', tuning: 'standard', locked: null },
  lookup: { root: null, quality: 'major', added: '' },
};

let recording: Recording | null = null;
let clock: number | undefined;
let tuner: Tuner | null = null;
/** Bumped on every start and stop, so a start that finishes late can tell it was cancelled. */
let tunerRun = 0;
let heardHz: number | null = null;

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

function tunerSection(): string {
  const { status, message, tuning, locked } = state.tuner;
  const busy = state.listen.status !== 'idle';
  const button =
    status === 'listening'
      ? '<button class="primary" data-action="tuner-stop">Stop</button>'
      : `<button class="primary" data-action="tuner-start" ${status === 'starting' || busy ? 'disabled' : ''}>Start</button>`;
  const tunings = TUNINGS.map(
    (t) => `<button data-action="tuning" data-id="${t.id}" aria-pressed="${t.id === tuning}">${t.name}</button>`,
  ).join('');
  const strings = tuningById(tuning)
    .strings.map(
      (string, i) =>
        `<button class="string" data-action="tuner-string" data-index="${i}" aria-pressed="${locked === i}" aria-label="${string.name} string${locked === i ? ', locked' : ''}">${string.name}</button>`,
    )
    .join('');
  const info =
    status === 'starting'
      ? '<span class="listen-info" role="status">Getting ready…</span>'
      : busy && status === 'idle'
        ? '<span class="listen-info" role="status">Listen is busy.</span>'
        : '';
  return `
    <div class="row listen-row">${button}${info}</div>
    ${message ? `<p class="notice" role="alert">${message}</p>` : ''}
    <div class="label">Tuning</div>
    <div class="row">${tunings}</div>
    <div class="label">Strings</div>
    <div class="row strings">${strings}</div>
    <div class="tuner-readout">
      <div id="tuner-note" class="tuner-note">–</div>
      ${needleSvg()}
      <div id="tuner-state" class="tuner-state" role="status">${status === 'listening' ? 'Waiting for a note…' : 'Tap Start and play a string.'}</div>
      <div id="tuner-detail" class="tuner-detail"></div>
    </div>`;
}

/** Updates the readout in place; the tuner reports many times a second, too often for a full render. */
function updateTuner(): void {
  const note = document.getElementById('tuner-note');
  const needle = document.getElementById('tuner-needle');
  const stateText = document.getElementById('tuner-state');
  const detail = document.getElementById('tuner-detail');
  if (!note || !needle || !stateText || !detail) return;

  const { tuning, locked, status } = state.tuner;
  const reading = status === 'listening' && heardHz !== null ? readPitch(tuningById(tuning), locked, heardHz) : null;

  note.textContent = reading ? reading.note : '–';
  needle.style.transform = `rotate(${reading ? needleAngle(reading.cents) : 0}deg)`;
  stateText.textContent = reading
    ? reading.state === 'in tune'
      ? 'In tune'
      : reading.state === 'flat'
        ? 'Flat: tune up'
        : 'Sharp: tune down'
    : status === 'listening'
      ? 'Waiting for a note…'
      : 'Tap Start and play a string.';
  stateText.dataset.state = reading?.state ?? '';
  detail.textContent = reading
    ? `${reading.hz.toFixed(1)} Hz · ${reading.cents > 0 ? '+' : ''}${reading.cents.toFixed(0)} cents`
    : '';
  document.querySelectorAll<HTMLElement>('.string').forEach((el, i) => {
    el.classList.toggle('target', reading?.target === i);
  });
}

function chordsSection(): string {
  const { root, quality, added } = state.lookup;
  const roots = ROOTS.map(
    ({ label, pc }) => `<button data-action="lookup-root" data-pc="${pc}" aria-pressed="${root === pc}">${label}</button>`,
  ).join('');
  const qualities = QUALITIES.map(
    (q) =>
      `<button data-action="lookup-quality" data-quality="${q.quality}" aria-pressed="${quality === q.quality}">${q.label}</button>`,
  ).join('');

  let grips = '<p class="empty">Pick a root and a type to see how to play the chord.</p>';
  if (root !== null) {
    const chord: Chord = { root, quality };
    const name = chordLabel(chord);
    const flats = [3, 8, 10].includes(root);
    const figures = gripsFor(root, quality)
      .map(
        (grip) => `<figure class="grip">
          ${chordDiagramSvg(grip.frets, root, flats, `${name}, ${grip.label}`)}
          <figcaption><strong>${grip.label}</strong>${grip.shape === 'Open' ? '' : `<span>${grip.shape}</span>`}</figcaption>
        </figure>`,
      )
      .join('');
    grips = `
      <div class="chord-head">
        <span class="chord-name">${name}</span>
        <button data-action="lookup-add">Add to song</button>
      </div>
      ${added ? `<p class="notice" role="status">${added}</p>` : ''}
      <div class="grips">${figures}</div>`;
  }

  return `
    <div class="label">Root</div>
    <div class="roots">${roots}</div>
    <div class="label">Type</div>
    <div class="row">${qualities}</div>
    ${grips}`;
}

function render(): void {
  const screen =
    state.screen === 'key' ? `${chordSection()}${resultsSection()}` : state.screen === 'tuner' ? tunerSection() : chordsSection();
  app.innerHTML = `${updateBar()}<h1>WhatIsMyKey</h1>${tabsHtml(state.screen)}${screen}`;
  if (state.screen === 'tuner') updateTuner();
}

async function startTuning(): Promise<void> {
  const run = ++tunerRun;
  state.tuner.status = 'starting';
  state.tuner.message = '';
  heardHz = null;
  render();
  try {
    const { startTuner } = await import('./tuner');
    const started = await startTuner((hz) => {
      if (run !== tunerRun) return;
      heardHz = hz;
      updateTuner();
    });
    if (run !== tunerRun) {
      void started.stop();
      return;
    }
    tuner = started;
    state.tuner.status = 'listening';
  } catch (error) {
    if (run !== tunerRun) return;
    state.tuner.status = 'idle';
    state.tuner.message = listenErrorMessage(error).replace('to listen', 'to tune');
  }
  render();
}

/** Releases the microphone and clears the readout. */
function stopTuning(): void {
  tunerRun++;
  void tuner?.stop();
  tuner = null;
  heardHz = null;
  state.tuner.status = 'idle';
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
    case 'screen': {
      const next = data.screen as Screen;
      if (next === state.screen) return;
      if (state.screen === 'tuner') {
        stopTuning();
        state.tuner.locked = null;
      }
      state.screen = next;
      break;
    }
    case 'tuner-start':
      void startTuning();
      return;
    case 'tuner-stop':
      stopTuning();
      break;
    case 'tuning':
      state.tuner.tuning = data.id!;
      state.tuner.locked = null;
      break;
    case 'tuner-string': {
      const index = Number(data.index);
      state.tuner.locked = state.tuner.locked === index ? null : index;
      break;
    }
    case 'lookup-root':
      state.lookup.root = Number(data.pc);
      state.lookup.added = '';
      break;
    case 'lookup-quality':
      state.lookup.quality = data.quality as Quality;
      state.lookup.added = '';
      break;
    case 'lookup-add': {
      const { root, quality } = state.lookup;
      if (root === null) return;
      state.chords.push({ root, quality });
      resetResults();
      state.lookup.added = `Added ${chordLabel({ root, quality })} to the song.`;
      break;
    }
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

document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.tuner.status !== 'idle') {
    stopTuning();
    render();
  }
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
