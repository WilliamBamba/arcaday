import type { Level } from './types';

/** Original course: rhythm, gaps, short/full jumps, then a precision ascent. */
export const firstLevel = {
  id: 'traverse-01',
  world: { width: 4800, height: 800 },
  spawn: { x: 45, y: 632 },
  platforms: [
    { x: 0, y: 650, width: 920, height: 24 },
    { x: 1000, y: 620, width: 130, height: 24 },
    { x: 1210, y: 590, width: 110, height: 24 },
    { x: 1400, y: 620, width: 140, height: 24 },
    { x: 1620, y: 650, width: 1680, height: 24 },
    // Optional elevated line over the middle spike sequence; no new mechanic.
    { x: 2030, y: 580, width: 100, height: 16 },
    { x: 2220, y: 500, width: 100, height: 16 },
    { x: 2410, y: 480, width: 100, height: 16 },
    { x: 3300, y: 620, width: 90, height: 24 },
    { x: 3465, y: 570, width: 90, height: 24 },
    { x: 3630, y: 520, width: 90, height: 24 },
    { x: 3795, y: 470, width: 90, height: 24 },
    { x: 3960, y: 420, width: 90, height: 24 },
    { x: 4130, y: 470, width: 130, height: 24 },
    { x: 4340, y: 520, width: 140, height: 24 },
    { x: 4560, y: 550, width: 240, height: 24 },
  ],
  walls: [
    { x: 2670, y: 610, width: 24, height: 40 },
    { x: 2850, y: 590, width: 24, height: 60 },
    { x: 3050, y: 570, width: 24, height: 80 },
  ],
  obstacles: [
    { kind: 'spikes', x: 240, y: 634, width: 24, height: 16 },
    { kind: 'spikes', x: 470, y: 634, width: 40, height: 16 },
    { kind: 'spikes', x: 700, y: 634, width: 48, height: 16 },
    { kind: 'spikes', x: 1940, y: 634, width: 56, height: 16 },
    { kind: 'spikes', x: 2180, y: 634, width: 64, height: 16 },
    { kind: 'spikes', x: 2420, y: 634, width: 64, height: 16 },
  ],
  // Visible jagged bed below every gap, reached before the world's bottom boundary.
  deathZones: [{ x: 0, y: 760, width: 4800, height: 40 }],
  goal: { x: 4730, y: 506, width: 26, height: 44 },
} as const satisfies Level;
