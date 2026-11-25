import { expect, test, type Page } from '@playwright/test';
import type { GameScene } from '../../src/game/GameScene';
import { firstLevel } from '../../src/levels/first';

const state = (page: Page) => page.evaluate(() => {
  const s = window.__game.scene.getScene('game') as GameScene;
  const b = s.player.body, c = s.cameras.main;
  return { x: s.player.x, y: s.player.y, vx: b.velocity.x, vy: b.velocity.y,
    grounded: b.blocked.down || b.touching.down, phase: s.run.phase, deaths: s.run.deaths,
    scrollX: c.scrollX, scrollY: c.scrollY, width: c.width, height: c.height };
});
test.beforeEach(async ({ page }) => {
  await page.goto('/?test');
  await page.waitForFunction(() => Boolean((window.__game?.scene.getScene('game') as GameScene)?.player));
});

for (const line of ['lower', 'upper'] as const) {
  test(`new course ${line} line is completable with inputs only, within the target clean-run duration`, async ({ page }) => {
    test.setTimeout(90000);
    // Hand-authored route, separate from level geometry. No teleport, physics changes or invulnerability.
    const route = [
      [195, 315], [425, 560], [655, 795],
      [895, 1040], [1105, 1250], [1295, 1440], [1515, 1660],
      ...(line === 'lower' ? [[1895, 2030], [2150, 2280], [2375, 2520]]
        : [[1915, 2060], [2128, 2250], [2300, 2450]]),
      [2620, 2725], [2800, 2890], [3000, 3062], [3080, 3190],
      [3250, 3340], [3365, 3500], [3530, 3665], [3695, 3830], [3860, 3995],
      [4025, 4170], [4235, 4380], [4455, 4610],
    ];
    const result = await page.evaluate(steps => new Promise<{ phase: string; deaths: number; elapsed: number; step: number; x: number; y: number; cameraInBounds: boolean; ahead: number }>(resolve => {
      const s = window.__game.scene.getScene('game') as GameScene;
      let cameraInBounds = true, ahead = Infinity;
      let index = 0, jumping = false, airborne = false, elapsed = 0;
      const held = new Set<string>();
      const key = (code: string, down: boolean) => {
        if (held.has(code) === down) return;
        if (down) held.add(code); else held.delete(code);
        window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { code, bubbles: true, cancelable: true }));
      };
      const tick = (_time: number, delta: number) => {
        elapsed += delta;
        const camera = s.cameras.main;
        cameraInBounds &&= camera.scrollX >= 0 && camera.scrollY >= 0
          && camera.scrollX + camera.width <= s.level.world.width
          && camera.scrollY + camera.height <= s.level.world.height;
        if (s.player.x > 400 && s.player.x < 4400) ahead = Math.min(ahead, camera.scrollX + camera.width - s.player.x);
        const grounded = s.player.body.blocked.down || s.player.body.touching.down;
        if (s.run.phase === 'won' || s.run.deaths > 0 || elapsed > 60000) {
          s.events.off('postupdate', tick);
          for (const code of [...held]) key(code, false);
          resolve({ phase: s.run.phase, deaths: s.run.deaths, elapsed: elapsed / 1000, step: index, x: s.player.x, y: s.player.y, cameraInBounds, ahead });
          return;
        }
        const step = steps[index];
        if (!step) { key('ArrowRight', true); return; }
        if (!jumping) {
          key('ArrowRight', true);
          if (s.player.x >= step[0]! && grounded) { key('Space', true); jumping = true; airborne = false; }
        } else {
          if (!grounded) airborne = true;
          key('ArrowRight', s.player.x < step[1]!);
          if (airborne && grounded) { key('Space', false); jumping = false; index++; }
        }
      };
      s.events.on('postupdate', tick);
    }), route);
    console.log('Input-only course result:', result);
    expect(result.deaths, JSON.stringify(result)).toBe(0);
    expect(result.phase, JSON.stringify(result)).toBe('won');
    expect(result.elapsed).toBeGreaterThanOrEqual(20);
    expect(result.elapsed).toBeLessThanOrEqual(40);
    expect(result.cameraInBounds).toBe(true);
    expect(result.ahead).toBeGreaterThan(140);
  });

}

test('camera follows both axes within bounds and resets with the player after a pit death', async ({ page }) => {
  const original = await state(page);
  await page.screenshot({ path: 'test-results/traverse-start.png' });
  const controlsBox = await page.locator('.touch-controls').boundingBox();
  // Isolated camera/death test; the separate course test never moves the body directly.
  await page.evaluate(() => {
    const s = window.__game.scene.getScene('game') as GameScene;
    s.player.body.reset(3995, 402);
  });
  await expect.poll(async () => (await state(page)).scrollX).toBeGreaterThan(3700);
  await expect.poll(async () => (await state(page)).scrollY).toBeLessThan(original.scrollY - 80);
  expect(await page.locator('.touch-controls').boundingBox()).toEqual(controlsBox);
  await page.screenshot({ path: 'test-results/traverse-ascent.png' });
  const upper = await state(page);
  expect(upper.x - upper.scrollX).toBeGreaterThan(0);
  expect(upper.x - upper.scrollX).toBeLessThan(upper.width);
  expect(upper.scrollX).toBeLessThanOrEqual(firstLevel.world.width - upper.width);
  expect(upper.scrollY).toBeGreaterThanOrEqual(0);
  await page.evaluate(() => {
    const s = window.__game.scene.getScene('game') as GameScene;
    s.player.body.reset(950, 730);
  });
  await expect(page.locator('#run-status')).toHaveText('Morts : 1');
  await expect.poll(async () => (await state(page)).phase).toBe('playing');
  const reset = await state(page);
  expect(reset.x).toBe(firstLevel.spawn.x);
  expect(reset.vx).toBe(0);
  expect(reset.scrollX).toBe(0);
  expect(reset.scrollY).toBeLessThanOrEqual(firstLevel.world.height - reset.height);
  await expect.poll(async () => (await state(page)).grounded).toBe(true);
});

test('walls block walking and camera direction reversal is gradual', async ({ page }) => {
  await page.evaluate(() => (window.__game.scene.getScene('game') as GameScene).player.body.reset(2630, 632));
  await page.keyboard.down('ArrowRight');
  await expect.poll(async () => (await state(page)).x).toBeGreaterThan(2650);
  await page.waitForTimeout(200);
  expect((await state(page)).x).toBeLessThanOrEqual(2658);
  await page.keyboard.up('ArrowRight');
  const motion = await page.evaluate(() => {
    const s = window.__game.scene.getScene('game') as GameScene;
    return new Promise<number>(resolve => {
      let n = 0, previous = s.cameras.main.scrollX, max = 0;
      const tick = () => {
        max = Math.max(max, Math.abs(s.cameras.main.scrollX - previous)); previous = s.cameras.main.scrollX;
        if (++n === 40) { s.events.off('postupdate', tick); resolve(max); }
      };
      s.events.on('postupdate', tick);
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft' }));
    });
  });
  await page.keyboard.up('ArrowLeft');
  expect(motion).toBeLessThan(20);
});


test('the first visible spike kills once and releases the held direction at spawn', async ({ page }) => {
  await page.keyboard.down('ArrowRight');
  await expect(page.locator('#run-status')).toHaveText('Morts : 1');
  await expect.poll(async () => (await state(page)).phase).toBe('playing');
  await page.waitForTimeout(300);
  const current = await state(page);
  expect(current.x).toBe(firstLevel.spawn.x);
  expect(current.vx).toBe(0);
  expect(current.deaths).toBe(1);
  expect(current.scrollX).toBe(0);
  await page.keyboard.up('ArrowRight');
});
