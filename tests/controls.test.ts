import { describe, expect, it } from 'vitest';
import { Controls } from '../src/input/controls';
import { movement, MOVEMENT } from '../src/game/movement';

describe('input ownership', () => {
  it('holds direction and jump with independent fingers', () => {
    const c = new Controls(); c.press('finger1', 'right'); c.press('finger2', 'jump');
    expect(c.sample()).toEqual({ direction: 1, jumpHeld: true, jumpPressed: true });
    c.release('finger2'); expect(c.sample().direction).toBe(1);
  });
  it('preserves another source and neutralizes opposite directions', () => {
    const c = new Controls(); c.press('key', 'left'); c.press('finger', 'left'); c.release('key');
    expect(c.sample().direction).toBe(-1); c.press('other', 'right'); expect(c.sample().direction).toBe(0);
  });
  it('does not repeat jumps and clears pending input on interruption', () => {
    const c = new Controls(); c.press('key', 'jump'); expect(c.sample().jumpPressed).toBe(true);
    c.press('key', 'jump'); expect(c.sample().jumpPressed).toBe(false);
    c.clear(); expect(c.sample()).toEqual({ direction: 0, jumpHeld: false, jumpPressed: false });
  });
});
describe('movement', () => {
  it('starts a grounded jump and prevents an air jump', () => {
    const input = { direction: 1, jumpHeld: true, jumpPressed: true };
    expect(movement(input, true, 0)).toEqual({ x: MOVEMENT.speed, y: -MOVEMENT.jumpSpeed });
    expect(movement(input, false, 80).y).toBe(80);
  });
  it('cuts ascent on release but preserves falling velocity', () => {
    const input = { direction: 0, jumpHeld: false, jumpPressed: false };
    expect(movement(input, false, -400).y).toBe(-MOVEMENT.releaseSpeed);
    expect(movement(input, false, 200).y).toBe(200);
  });
});
