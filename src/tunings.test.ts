import { describe, expect, it } from 'vitest';
import { centsOff, midiToHz, needleAngle, nearestString, readPitch, tuningById, TUNINGS } from './tunings';

const names = (id: string) => tuningById(id).strings.map((s) => s.name).join(' ');

describe('tunings', () => {
  it('lists the strings of each tuning', () => {
    expect(names('standard')).toBe('E A D G B e');
    expect(names('half-down')).toBe('Eb Ab Db Gb Bb eb');
    expect(names('whole-down')).toBe('D G C F A d');
    expect(names('drop-d')).toBe('D A D G B e');
    expect(names('dadgad')).toBe('D A D G A d');
    expect(names('open-g')).toBe('D G D G B d');
    expect(names('open-d')).toBe('D A D F# A d');
  });

  it('has six strings, low to high, in every tuning', () => {
    for (const t of TUNINGS) {
      expect(t.strings).toHaveLength(6);
      expect(t.strings.map((s) => s.midi)).toEqual([...t.strings.map((s) => s.midi)].sort((a, b) => a - b));
    }
  });

  it('puts A at 440 Hz', () => {
    expect(midiToHz(69)).toBe(440);
    expect(readPitch(tuningById('standard'), null, 110)).toMatchObject({ note: 'A', target: 1, state: 'in tune' });
  });

  it('picks the closest string', () => {
    expect(nearestString(tuningById('standard'), 110)).toBe(1);
    expect(nearestString(tuningById('standard'), 82)).toBe(0);
    expect(nearestString(tuningById('standard'), 330)).toBe(5);
  });

  it('measures against a locked string', () => {
    const reading = readPitch(tuningById('standard'), 2, 110);
    expect(reading.target).toBe(2);
    expect(reading.cents).toBeLessThan(-400);
  });

  it('reads 20 cents flat as flat', () => {
    const reading = readPitch(tuningById('standard'), null, 110 * 2 ** (-20 / 1200));
    expect(reading.target).toBe(1);
    expect(reading.state).toBe('flat');
    expect(reading.cents).toBeCloseTo(-20, 5);
    expect(reading.note).toBe('A');
  });

  it('reads sharp and in tune', () => {
    expect(readPitch(tuningById('standard'), null, 110 * 2 ** (20 / 1200)).state).toBe('sharp');
    expect(readPitch(tuningById('standard'), null, 110 * 2 ** (4 / 1200)).state).toBe('in tune');
    expect(readPitch(tuningById('standard'), null, 110 * 2 ** (6 / 1200)).state).toBe('sharp');
  });

  it('tunes the low string of whole step down at 73.4 Hz', () => {
    const reading = readPitch(tuningById('whole-down'), null, 73.42);
    expect(reading).toMatchObject({ target: 0, state: 'in tune' });
    expect(Math.abs(centsOff(73.42, midiToHz(38)))).toBeLessThan(1);
  });

  it('turns the needle left for flat, right for sharp, and stops at the ends', () => {
    expect(needleAngle(0)).toBe(0);
    expect(needleAngle(-25)).toBeLessThan(0);
    expect(needleAngle(25)).toBeGreaterThan(0);
    expect(needleAngle(500)).toBe(45);
    expect(needleAngle(-500)).toBe(-45);
  });
});
