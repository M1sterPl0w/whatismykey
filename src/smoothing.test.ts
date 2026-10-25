import { describe, expect, it } from 'vitest';
import { createSmoother } from './smoothing';

describe('createSmoother', () => {
  it('stays on the note despite one outlier', () => {
    const smoother = createSmoother();
    [110, 110.2, 109.9, 110.1].forEach((hz) => smoother.push(hz));
    expect(smoother.push(220)).toBeCloseTo(110.1, 0);
  });

  it('follows a new note after a few readings', () => {
    const smoother = createSmoother();
    [110, 110, 110, 110, 110].forEach((hz) => smoother.push(hz));
    let shown = 0;
    for (let i = 0; i < 3; i++) shown = smoother.push(146.8)!;
    expect(shown).toBeCloseTo(146.8, 1);
  });

  it('holds the last reading briefly, then goes back to waiting', () => {
    const smoother = createSmoother();
    smoother.push(110);
    expect(smoother.push(null)).toBeCloseTo(110, 5);
    expect(smoother.push(null)).toBeCloseTo(110, 5);
    let shown: number | null = 110;
    for (let i = 0; i < 6; i++) shown = smoother.push(null);
    expect(shown).toBeNull();
  });

  it('starts fresh after waiting', () => {
    const smoother = createSmoother();
    smoother.push(110);
    for (let i = 0; i < 6; i++) smoother.push(null);
    expect(smoother.push(196)).toBe(196);
  });
});
