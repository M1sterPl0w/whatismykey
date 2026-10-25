import { openMicrophone } from './capture';
import { detectPitch, minBufferLength } from './pitch';
import { createSmoother } from './smoothing';

export interface Tuner {
  stop(): Promise<void>;
}

/** Detect again after this many new samples (about 40 ms at 48 kHz). */
const HOP = 2048;

/**
 * Listens to the microphone and calls `onReading` with the steadied pitch in Hz, or null while no note
 * is heard. Rejects with the browser's error when permission is denied or there is no microphone.
 */
export async function startTuner(onReading: (hz: number | null) => void): Promise<Tuner> {
  const smoother = createSmoother();
  let buffer: Float32Array | null = null;
  let filled = 0;
  let sinceDetect = 0;
  let stopped = false;

  const microphone = await openMicrophone((block) => {
    if (stopped) return;
    buffer ??= new Float32Array(Math.max(4096, minBufferLength(microphone.sampleRate)));
    // Keep the newest samples at the end of the buffer.
    if (block.length >= buffer.length) {
      buffer.set(block.subarray(block.length - buffer.length));
    } else {
      buffer.copyWithin(0, block.length);
      buffer.set(block, buffer.length - block.length);
    }
    filled = Math.min(buffer.length, filled + block.length);
    sinceDetect += block.length;
    if (filled < buffer.length || sinceDetect < HOP) return;
    sinceDetect = 0;
    onReading(smoother.push(detectPitch(buffer, microphone.sampleRate)));
  });

  return {
    async stop() {
      stopped = true;
      await microphone.stop();
    },
  };
}
