import type { Level } from '../../src/levels/types';

/** Historical phase-16 terrain, development tests only. */
export const prototype: Level = {
  id: 'prototype', world: { width: 360, height: 550 }, spawn: { x: 25, y: 490 },
  platforms: [
    { x: 0, y: 518, width: 360, height: 16 },
    { x: 40, y: 448, width: 110, height: 16 },
    { x: 200, y: 378, width: 110, height: 16 },
    { x: 45, y: 308, width: 110, height: 16 },
    { x: 200, y: 238, width: 110, height: 16 },
  ],
  walls: [],
  obstacles: [
    { kind: 'spikes', x: 159, y: 502, width: 32, height: 16 },
    { kind: 'spikes', x: 284, y: 362, width: 16, height: 16 },
    { kind: 'spikes', x: 46, y: 292, width: 16, height: 16 },
  ],
  deathZones: [], goal: { x: 275, y: 194, width: 26, height: 44 },
};
