import { describe, expect, it } from 'vitest';
import { firstLevel } from '../src/levels/first';
import { validateLevel, type Level } from '../src/levels/types';
import { prototype } from './fixtures/prototype';

describe('level data', () => {
  it('accepts both courses and a JSON round trip without engine objects', () => {
    for (const level of [firstLevel, prototype]) {
      expect(() => validateLevel(level)).not.toThrow();
      const copy: Level = JSON.parse(JSON.stringify(level));
      expect(copy).toEqual(level);
      expect(() => validateLevel(copy)).not.toThrow();
    }
  });
  it.each([
    { world: { width: NaN, height: 800 } },
    { platforms: [{ x: 4790, y: 100, width: 20, height: 20 }] },
    { walls: [{ x: 40, y: 10, width: -1, height: 30 }] },
    { spawn: { x: 250, y: 640 } },
    { spawn: { x: 5, y: 10 } },
    { goal: { x: 250, y: 640, width: 20, height: 30 } },
    { id: '' },
  ])('rejects invalid geometry or unsafe spawn/goal %j', patch => {
    expect(() => validateLevel({ ...firstLevel, ...patch })).toThrow('Invalid level');
  });
});
