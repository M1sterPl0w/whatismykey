import { describe, expect, it } from 'vitest';
import { detectPitch } from './pitch';

const RATE = 48000;
const LENGTH = 4096;

function tone(hz: number, harmonics: number[] = [1], amplitude = 0.5): Float32Array {
  const out = new Float32Array(LENGTH);
  for (let i = 0; i < LENGTH; i++) {
    for (const [k, h] of harmonics.entries()) {
      out[i] += (h * amplitude * Math.sin((2 * Math.PI * hz * (k + 1) * i) / RATE)) / harmonics.length;
    }
  }
  return out;
}

const cents = (a: number, b: number) => Math.abs(1200 * Math.log2(a / b));

describe('detectPitch', () => {
  it.each([73.42, 82.41, 110, 146.83, 196, 246.94, 329.63, 400])('finds a sine at %d Hz', (hz) => {
    expect(cents(detectPitch(tone(hz), RATE)!, hz)).toBeLessThan(1);
  });

  it.each([82.41, 110, 196, 329.63])('finds %d Hz when the harmonics are louder', (hz) => {
    const found = detectPitch(tone(hz, [0.4, 1, 0.9, 0.6, 0.3]), RATE)!;
    expect(cents(found, hz)).toBeLessThan(1);
  });

  it('works at 44.1 kHz', () => {
    const out = new Float32Array(LENGTH);
    for (let i = 0; i < LENGTH; i++) out[i] = 0.4 * Math.sin((2 * Math.PI * 110 * i) / 44100);
    expect(cents(detectPitch(out, 44100)!, 110)).toBeLessThan(1);
  });

  it('returns null for silence', () => {
    expect(detectPitch(new Float32Array(LENGTH), RATE)).toBeNull();
    expect(detectPitch(tone(110, [1], 0.001), RATE)).toBeNull();
  });

  it('returns null for noise', () => {
    let seed = 1;
    const noise = new Float32Array(LENGTH).map(() => {
      seed = (seed * 16807) % 2147483647;
      return (seed / 2147483647 - 0.5) * 0.8;
    });
    expect(detectPitch(noise, RATE)).toBeNull();
  });
});
