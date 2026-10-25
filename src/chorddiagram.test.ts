import { describe, expect, it } from 'vitest';
import { chordDiagramSvg } from './chorddiagram';
import { gripsFor } from './grips';

const count = (svg: string, pattern: string) => svg.split(pattern).length - 1;

describe('chordDiagramSvg', () => {
  it('shows crosses on the muted strings and a circle on the open D string for open D', () => {
    const grip = gripsFor(2, 'major')[0];
    const svg = chordDiagramSvg(grip.frets, 2, false, 'D');
    expect(count(svg, 'class="cd-mute"')).toBe(2);
    expect(count(svg, 'class="cd-open"')).toBe(1);
    expect(count(svg, 'class="cd-dot')).toBe(3);
    expect(svg).not.toContain('cd-fret');
    expect(svg).toContain('class="fb-nut"');
  });

  it('starts at fret 8 with a bar for the E shape at fret 8', () => {
    const svg = chordDiagramSvg([8, 10, 10, 9, 8, 8], 0, false, 'C');
    expect(svg).toMatch(/<text class="cd-fret"[^>]*>8<\/text>/);
    expect(count(svg, 'class="cd-barre"')).toBe(1);
    expect(count(svg, 'class="cd-open"')).toBe(0);
  });

  it('marks the root dots and names every note', () => {
    const svg = chordDiagramSvg([null, 3, 2, 0, 1, 0], 0, false, 'C');
    expect(count(svg, 'cd-dot fb-root')).toBe(2);
    expect(svg).toContain('>E<');
  });

  it('spells notes with flats when asked', () => {
    const svg = chordDiagramSvg([6, 8, 8, 7, 6, 6], 10, true, 'Bb');
    expect(svg).toContain('>Bb<');
    expect(svg).not.toContain('A#');
  });
});
