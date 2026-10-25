import { addPitchBendsToNoteEvents, BasicPitch, noteFramesToTime, outputToNotesPoly } from '@spotify/basic-pitch';
import { openMicrophone } from './capture';
import type { NoteEvent } from './recognise';

/** The model only accepts mono audio at this rate. */
export const MODEL_SAMPLE_RATE = 22050;

// Same thresholds as the Python version of Basic Pitch, which the listening test used.
const ONSET_THRESHOLD = 0.5;
const FRAME_THRESHOLD = 0.3;
const MIN_NOTE_FRAMES = 11;

let model: BasicPitch | undefined;

function loadModel(): BasicPitch {
  model ??= new BasicPitch(`${import.meta.env.BASE_URL}model/model.json`);
  return model;
}

/** Finds the notes in mono audio at 22,050 Hz. */
export async function analyse(samples: Float32Array, onProgress?: (percent: number) => void): Promise<NoteEvent[]> {
  const frames: number[][] = [];
  const onsets: number[][] = [];
  const contours: number[][] = [];

  await loadModel().evaluateModel(
    samples,
    (f, o, c) => {
      frames.push(...f);
      onsets.push(...o);
      contours.push(...c);
    },
    (percent) => onProgress?.(percent),
  );

  const notes = noteFramesToTime(
    addPitchBendsToNoteEvents(
      contours,
      outputToNotesPoly(frames, onsets, ONSET_THRESHOLD, FRAME_THRESHOLD, MIN_NOTE_FRAMES),
    ),
  );
  return notes.map((note) => ({
    start: note.startTimeSeconds,
    end: note.startTimeSeconds + note.durationSeconds,
    pitch: note.pitchMidi,
    amplitude: note.amplitude,
  }));
}

export const MAX_RECORD_SECONDS = 60;

export interface Recording {
  /** Seconds recorded so far. */
  elapsed(): number;
  /** Ends the recording and returns mono audio at 22,050 Hz. */
  stop(): Promise<Float32Array>;
}

async function resample(samples: Float32Array, fromRate: number): Promise<Float32Array> {
  if (fromRate === MODEL_SAMPLE_RATE) return samples;
  const length = Math.ceil((samples.length * MODEL_SAMPLE_RATE) / fromRate);
  const offline = new OfflineAudioContext(1, length, MODEL_SAMPLE_RATE);
  const buffer = offline.createBuffer(1, samples.length, fromRate);
  buffer.copyToChannel(new Float32Array(samples), 0);
  const source = offline.createBufferSource();
  source.buffer = buffer;
  source.connect(offline.destination);
  source.start();
  return (await offline.startRendering()).getChannelData(0);
}

/**
 * Starts recording from the microphone. Rejects with the browser's error when permission is
 * denied or there is no microphone. `onLimit` runs when the recording reaches `maxSeconds`.
 */
export async function startRecording(onLimit: () => void, maxSeconds = MAX_RECORD_SECONDS): Promise<Recording> {
  const chunks: Float32Array[] = [];
  let total = 0;
  const microphone = await openMicrophone((block) => {
    chunks.push(block);
    total += block.length;
  });

  const rate = microphone.sampleRate;
  const timer = setTimeout(onLimit, maxSeconds * 1000);

  return {
    elapsed: () => total / rate,
    async stop() {
      clearTimeout(timer);
      await microphone.stop();
      const samples = new Float32Array(total);
      let offset = 0;
      for (const chunk of chunks) {
        samples.set(chunk, offset);
        offset += chunk.length;
      }
      chunks.length = 0;
      return resample(samples, rate);
    },
  };
}
