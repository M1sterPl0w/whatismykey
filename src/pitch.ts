/** Lowest and highest fundamental the tuner looks for, in Hz. */
export const MIN_HZ = 60;
export const MAX_HZ = 500;

/** Quieter than this (RMS) counts as silence. */
const SILENCE_RMS = 0.01;
/** A peak must be at least this clear (0 to 1) to count as a note. */
const MIN_CLARITY = 0.8;
/** Take the first peak that is at least this fraction of the highest, which avoids octave errors. */
const PEAK_FRACTION = 0.9;

/** Samples a buffer must hold for `detectPitch` to look for `MIN_HZ`. */
export const minBufferLength = (sampleRate: number): number => Math.ceil((sampleRate / MIN_HZ) * 3);

/**
 * Finds the fundamental frequency of a mono signal, or null when it is quiet or has no clear pitch.
 * Uses the normalised square difference (McLeod pitch method) with parabolic interpolation.
 */
export function detectPitch(samples: Float32Array, sampleRate: number): number | null {
  const maxTau = Math.floor(sampleRate / MIN_HZ);
  const minTau = Math.floor(sampleRate / MAX_HZ);
  const window = samples.length - maxTau;
  if (window < maxTau) return null;

  let energy = 0;
  for (let i = 0; i < window; i++) energy += samples[i] * samples[i];
  if (Math.sqrt(energy / window) < SILENCE_RMS) return null;

  // nsdf[tau] = 2 * sum(x[j] * x[j+tau]) / sum(x[j]^2 + x[j+tau]^2)
  const nsdf = new Float32Array(maxTau + 1);
  for (let tau = 0; tau <= maxTau; tau++) {
    let acf = 0;
    let norm = 0;
    for (let j = 0; j < window; j++) {
      const a = samples[j];
      const b = samples[j + tau];
      acf += a * b;
      norm += a * a + b * b;
    }
    nsdf[tau] = norm > 0 ? (2 * acf) / norm : 0;
  }

  // The highest point of each stretch above zero is a candidate period.
  const peaks: number[] = [];
  let tau = 1;
  while (tau < maxTau && nsdf[tau] > 0) tau++; // skip the first stretch around tau = 0
  while (tau < maxTau) {
    while (tau < maxTau && nsdf[tau] <= 0) tau++;
    let best = -1;
    while (tau < maxTau && nsdf[tau] > 0) {
      if (best < 0 || nsdf[tau] > nsdf[best]) best = tau;
      tau++;
    }
    if (best >= minTau) peaks.push(best);
  }
  if (peaks.length === 0) return null;

  const highest = Math.max(...peaks.map((p) => nsdf[p]));
  if (highest < MIN_CLARITY) return null;
  const peak = peaks.find((p) => nsdf[p] >= PEAK_FRACTION * highest)!;

  const prev = nsdf[peak - 1];
  const next = nsdf[peak + 1] ?? nsdf[peak];
  const denominator = prev - 2 * nsdf[peak] + next;
  const shift = denominator === 0 ? 0 : (0.5 * (prev - next)) / denominator;
  return sampleRate / (peak + shift);
}
