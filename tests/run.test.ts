import { expect, it } from 'vitest';
import { Run } from '../src/game/run';
import { Controls } from '../src/input/controls';

it('counts one death per collision and allows another attempt after respawn', () => {
  const run = new Run();
  expect(run.die()).toBe(true);
  expect(run.die()).toBe(false);
  expect(run.win()).toBe(false);
  expect(run.deaths).toBe(1);
  run.respawn();
  expect(run.die()).toBe(true);
  expect(run.deaths).toBe(2);
});
it('wins once, ignores deaths after victory, and restarts a fresh run', () => {
  const run = new Run(); run.die(); run.respawn();
  expect(run.win()).toBe(true);
  expect(run.win()).toBe(false);
  expect(run.die()).toBe(false);
  run.respawn(); expect(run.phase).toBe('won');
  run.restart(); expect(run.phase).toBe('playing'); expect(run.deaths).toBe(0);
  expect(run.win()).toBe(true);
});
it('clears pending jumps and all sources at transitions, ignoring input while stopped', () => {
  const controls = new Controls(); let clears = 0;
  const detach = controls.onClear(() => clears++);
  controls.press('finger', 'jump'); controls.press('key', 'right');
  controls.setEnabled(false); controls.press('other', 'left');
  expect(controls.sample()).toEqual({ direction: 0, jumpHeld: false, jumpPressed: false });
  controls.setEnabled(true);
  expect(controls.sample().jumpPressed).toBe(false);
  expect(clears).toBe(2); detach(); controls.clear(); expect(clears).toBe(2);
  controls.press('new', 'right'); expect(controls.sample().direction).toBe(1);
});
