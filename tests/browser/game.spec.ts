import { expect, test, type Page } from '@playwright/test';
import type Phaser from 'phaser';
import type { TestScene } from '../../src/game/TestScene';
declare global { interface Window { __game: Phaser.Game } }
const state = (page: Page) => page.evaluate(() => {
  const s = window.__game.scene.getScene('test') as TestScene;
  const b = s.player.body;
  return { x: b.center.x, y: b.bottom, vx: b.velocity.x, vy: b.velocity.y, grounded: b.blocked.down || b.touching.down };
});
const frames = (page: Page, count: number) => page.evaluate(n => new Promise<void>(resolve => {
  const scene = window.__game.scene.getScene('test');
  const tick = () => { if (--n <= 0) { scene.events.off('postupdate', tick); resolve(); } };
  scene.events.on('postupdate', tick);
}), count);
const reset = async (page: Page, x = 320) => {
  await page.evaluate(x => (window.__game.scene.getScene('test') as TestScene).player.body.reset(x, 490), x);
  await expect.poll(async () => (await state(page)).grounded).toBe(true);
};
test.beforeEach(async ({ page }) => {
  await page.goto('/?test');
  await page.waitForFunction(() => Boolean((window.__game?.scene.getScene('test') as TestScene | undefined)?.player?.body));
});
test('floor, movement, world boundary and platform landing', async ({ page }) => {
  await reset(page, 42); expect((await state(page)).y).toBeCloseTo(518, 0);
  await page.keyboard.down('ArrowRight'); await frames(page, 20); await page.keyboard.up('ArrowRight');
  expect((await state(page)).x).toBeGreaterThan(80);
  await page.keyboard.down('ArrowLeft'); await frames(page, 60); await page.keyboard.up('ArrowLeft');
  expect((await state(page)).x).toBeGreaterThanOrEqual(12);
  // Jump beside the first platform, then steer over it after clearing its top.
  await reset(page, 25);
  await page.keyboard.down('Space'); await frames(page, 13);
  await page.keyboard.down('ArrowRight'); await frames(page, 22); await page.keyboard.up('ArrowRight');
  await page.keyboard.up('Space');
  await expect.poll(async () => (await state(page)).grounded).toBe(true);
  expect((await state(page)).y).toBeCloseTo(448, 0);
});
test('variable height, no automatic bounce or air jump', async ({ page }) => {
  const jump = async (hold: number) => {
    await reset(page);
    await page.evaluate(() => {
      const s = window.__game.scene.getScene('test') as TestScene;
      s.registry.set('apex', s.player.y);
      const track = () => s.registry.set('apex', Math.min(s.registry.get('apex') as number, s.player.y));
      s.events.on('postupdate', track);
      s.registry.set('stopTracking', () => s.events.off('postupdate', track));
    });
    await page.keyboard.down('Space'); await frames(page, hold); await page.keyboard.up('Space'); await frames(page, 65);
    return page.evaluate(() => {
      const s = window.__game.scene.getScene('test');
      (s.registry.get('stopTracking') as () => void)(); return s.registry.get('apex') as number;
    });
  };
  expect(await jump(2) - await jump(22)).toBeGreaterThan(40);
  await reset(page); await page.keyboard.down('Space'); await frames(page, 75);
  expect((await state(page)).grounded).toBe(true); await page.keyboard.up('Space');
  await page.keyboard.down('Space'); await frames(page, 5); await page.keyboard.up('Space'); await frames(page, 2);
  await page.keyboard.down('Space'); await frames(page, 2);
  expect((await state(page)).vy).toBeGreaterThan(-200); await page.keyboard.up('Space');
});
test('simultaneous touch, cancellation, blur and small portrait layout', async ({ page, context }) => {
  await reset(page, 180);
  const right = (await page.getByRole('button', { name: 'Droite' }).boundingBox())!;
  const jump = (await page.getByRole('button', { name: 'Sauter' }).boundingBox())!;
  const client = await context.newCDPSession(page);
  const finger = (box: typeof right, id: number) => ({ x: box.x + box.width / 2, y: box.y + box.height / 2, id });
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [finger(right, 1), finger(jump, 2)] });
  await frames(page, 8); expect((await state(page)).vx).toBe(190); expect((await state(page)).vy).toBeLessThan(0);
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [finger(jump, 2)] });
  await frames(page, 2); expect((await state(page)).vx).toBe(190);
  await client.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  await frames(page, 2); expect((await state(page)).vx).toBe(0);
  await page.keyboard.down('ArrowLeft'); await frames(page, 2);
  await page.evaluate(() => window.dispatchEvent(new Event('blur'))); await frames(page, 2);
  expect((await state(page)).vx).toBe(0); await page.keyboard.up('ArrowLeft');
  for (const viewport of [{ width: 390, height: 844 }, { width: 320, height: 568 }]) {
    await page.setViewportSize(viewport);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)).toBe(true);
    const b = (await page.getByRole('button', { name: 'Sauter' }).boundingBox())!;
    expect(b.height).toBeGreaterThanOrEqual(48); expect(b.y + b.height).toBeLessThanOrEqual(viewport.height);
  }
  await page.screenshot({ path: 'test-results/prototype-portrait.png' });
});
