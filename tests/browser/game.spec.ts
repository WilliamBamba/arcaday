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
  await reset(page, 235);
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


test('game UI suppresses selection and tap highlights while preserving keyboard focus', async ({ page, browser }) => {
  await expect(page.getByRole('button', { name: 'Sauter' })).toHaveText('↑');
  await expect(page.locator('.hint')).toBeHidden();
  const controls = page.getByRole('navigation', { name: 'Commandes du jeu' });
  await expect(controls).toHaveCSS('user-select', 'none');
  const canceled = await page.evaluate(() => {
    const fire = (selector: string) => !document.querySelector(selector)!.dispatchEvent(
      new MouseEvent('contextmenu', { bubbles: true, cancelable: true }),
    );
    return { controls: fire('.touch-controls'), jump: fire('[data-action="jump"]'), header: fire('header'), outside: fire('body') };
  });
  expect(canceled).toEqual({ controls: true, jump: true, header: true, outside: false });
  for (const selector of ['header', '#run-status', 'canvas', '#replay', '.touch-controls']) {
    await expect(page.locator(selector)).toHaveCSS('user-select', 'none');
    await expect(page.locator(selector)).toHaveCSS('-webkit-tap-highlight-color', 'rgba(0, 0, 0, 0)');
  }
  const desktop = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: false });
  try {
    const desktopPage = await desktop.newPage();
    await desktopPage.goto('/');
    await expect(desktopPage.locator('.hint')).toBeVisible();
    await desktopPage.keyboard.press('Tab');
    const focused = desktopPage.locator(':focus-visible');
    await expect(focused).toHaveAttribute('data-action', 'left');
    await expect(focused).toHaveCSS('outline-style', 'solid');
    await expect(focused).toHaveCSS('outline-width', '3px');
  } finally { await desktop.close(); }
});

// CDP delivers real touch sequences and exercises the browser's pointer capture.
test('captured direction slides both ways through gaps independently of jump', async ({ page, context }) => {
  await reset(page, 235);
  const client = await context.newCDPSession(page);
  const left = page.getByRole('button', { name: 'Gauche' });
  const right = page.getByRole('button', { name: 'Droite' });
  const jump = page.getByRole('button', { name: 'Sauter' });
  const r = (await right.boundingBox())!;
  const j = (await jump.boundingBox())!;
  const l = (await left.boundingBox())!;
  let finger1 = { id: 1, x: r.x + r.width / 2, y: r.y + r.height / 2 };
  let finger2 = { id: 2, x: j.x + j.width / 2, y: j.y + j.height / 2 };
  const send = async (type: 'touchStart' | 'touchMove') => {
    await client.send('Input.dispatchTouchEvent', { type, touchPoints: [finger1, finger2] });
    await frames(page, 2);
  };
  await send('touchStart');
  finger1.x += 3; await send('touchMove');
  await expect(right).toHaveAttribute('data-held', 'true');
  finger1.x = l.x + l.width / 2; await send('touchMove');
  await expect(right).toHaveAttribute('data-held', 'false');
  await expect(left).toHaveAttribute('data-held', 'true');
  await expect(jump).toHaveAttribute('data-held', 'true');
  expect((await state(page)).vx).toBe(-190);
  finger1.x = (l.x + l.width + r.x) / 2; await send('touchMove');
  await expect(left).toHaveAttribute('data-held', 'false');
  await expect(right).toHaveAttribute('data-held', 'false');
  expect((await state(page)).vx).toBe(0);
  finger1.x = r.x + r.width / 2; await send('touchMove');
  await expect(right).toHaveAttribute('data-held', 'true');
  await expect(left).toHaveAttribute('data-held', 'false');
  expect((await state(page)).vx).toBe(190);
  finger1.y = r.y - 10; await send('touchMove');
  expect((await state(page)).vx).toBe(0);
  await expect(jump).toHaveAttribute('data-held', 'true');
  finger1.y = r.y + r.height / 2; await send('touchMove');
  // Exiting jump cuts ascent just like lifting that finger, without clearing direction.
  finger2.y = j.y - 10; await send('touchMove');
  await expect(jump).toHaveAttribute('data-held', 'false');
  await expect(right).toHaveAttribute('data-held', 'true');
  expect((await state(page)).vy).toBeGreaterThanOrEqual(-170);
  finger2.y = j.y + j.height / 2; await send('touchMove');
  await expect(jump).toHaveAttribute('data-held', 'true');
  expect((await state(page)).vy).toBeGreaterThan(-200); // No new impulse in midair.
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [finger1] });
  await expect(right).toHaveAttribute('data-held', 'false');
  await expect(jump).toHaveAttribute('data-held', 'true');
  await client.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  await expect(jump).toHaveAttribute('data-held', 'false');
});

for (const interruption of ['blur', 'visibilitychange', 'lostpointercapture'] as const) {
  test(`interruption ${interruption} prevents reactivation by a moving finger`, async ({ page, context }) => {
    const client = await context.newCDPSession(page);
    const button = page.getByRole('button', { name: 'Droite' });
    const box = (await button.boundingBox())!;
    const finger = { id: 1, x: box.x + box.width / 2, y: box.y + box.height / 2 };
    await button.evaluate(el => el.addEventListener('pointerdown', event => {
      (el as HTMLElement).dataset.testPointerId = String((event as PointerEvent).pointerId);
    }, { once: true }));
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [finger] });
    await expect(button).toHaveAttribute('data-held', 'true');
    finger.x += 1;
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [finger] });
    await page.evaluate(kind => {
      if (kind === 'blur') window.dispatchEvent(new Event('blur'));
      else if (kind === 'visibilitychange') document.dispatchEvent(new Event('visibilitychange'));
      else {
        const button = document.querySelector<HTMLButtonElement>('[data-action="right"]')!;
        button.releasePointerCapture(Number(button.dataset.testPointerId));
      }
    }, interruption);
    // Browsers process pending capture changes before the next pointer event.
    if (interruption !== 'lostpointercapture') await expect(button).toHaveAttribute('data-held', 'false');
    const leftBox = (await page.getByRole('button', { name: 'Gauche' }).boundingBox())!;
    finger.x = leftBox.x + leftBox.width / 2;
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [finger] });
    await expect(button).toHaveAttribute('data-held', 'false');
    await expect(page.getByRole('button', { name: 'Gauche' })).toHaveAttribute('data-held', 'false');
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.keyboard.down('ArrowRight');
    await expect(button).toHaveAttribute('data-held', 'true');
    await page.keyboard.up('ArrowRight');
    await expect(button).toHaveAttribute('data-held', 'false');
  });
}

const runState = (page: Page) => page.evaluate(() => {
  const s = window.__game.scene.getScene('test') as TestScene;
  return { phase: s.run.phase, deaths: s.run.deaths };
});
const place = (page: Page, x: number, y: number) => page.evaluate(({ x, y }) => {
  (window.__game.scene.getScene('test') as TestScene).player.body.reset(x, y);
}, { x, y });

test('lethal overlap counts once, respawns and clears held keyboard input', async ({ page }) => {
  await reset(page, 120);
  await page.keyboard.down('ArrowRight');
  await expect.poll(async () => (await runState(page)).deaths).toBe(1);
  await expect.poll(async () => (await runState(page)).phase).toBe('playing');
  await frames(page, 20);
  expect((await state(page)).x).toBeCloseTo(25, 0);
  expect((await state(page)).vx).toBe(0);
  expect((await state(page)).grounded).toBe(true);
  await expect(page.locator('#run-status')).toHaveText('Morts : 1');
  await page.keyboard.up('ArrowRight');
  await page.keyboard.down('ArrowRight'); await frames(page, 5);
  expect((await state(page)).vx).toBe(190); await page.keyboard.up('ArrowRight');
  await place(page, 175, 498);
  await expect.poll(async () => (await runState(page)).deaths).toBe(2);
});

test('death releases captures and moving old fingers cannot reactivate after respawn', async ({ page, context }) => {
  await reset(page, 235);
  const client = await context.newCDPSession(page);
  const right = page.getByRole('button', { name: 'Droite' });
  const jump = page.getByRole('button', { name: 'Sauter' });
  const r = (await right.boundingBox())!, j = (await jump.boundingBox())!;
  const fingers = [{ id: 1, x: r.x + r.width / 2, y: r.y + r.height / 2 },
    { id: 2, x: j.x + j.width / 2, y: j.y + j.height / 2 }];
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: fingers });
  await expect(jump).toHaveAttribute('data-held', 'true');
  await place(page, 175, 498);
  await expect.poll(async () => (await runState(page)).deaths).toBe(1);
  await expect.poll(async () => (await runState(page)).phase).toBe('playing');
  const left = page.getByRole('button', { name: 'Gauche' });
  const l = (await left.boundingBox())!;
  fingers[0]!.x = l.x + l.width / 2; fingers[1]!.x += 2;
  await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: fingers });
  await frames(page, 20);
  await expect(right).toHaveAttribute('data-held', 'false');
  await expect(left).toHaveAttribute('data-held', 'false');
  await expect(jump).toHaveAttribute('data-held', 'false');
  expect((await state(page)).x).toBeCloseTo(25, 0);
  expect((await state(page)).grounded).toBe(true);
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: fingers });
  await expect(left).toHaveAttribute('data-held', 'true');
  await expect(jump).toHaveAttribute('data-held', 'true');
  await client.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
});

test('goal wins once, freezes movement, and replay resets the entire run without reload', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await place(page, 175, 498);
  await expect.poll(async () => (await runState(page)).deaths).toBe(1);
  await expect.poll(async () => (await runState(page)).phase).toBe('playing');
  await place(page, 288, 216);
  await expect(page.getByRole('region', { name: 'Résultat' })).toBeVisible();
  await expect(page.locator('#result-text')).toHaveText('Victoire ! 1 mort(s).');
  await frames(page, 30);
  expect(await runState(page)).toEqual({ phase: 'won', deaths: 1 });
  expect((await state(page)).vx).toBe(0); expect((await state(page)).vy).toBe(0);
  const timeOrigin = await page.evaluate(() => performance.timeOrigin);
  // Native keyboard activation of the focused replay button must remain available.
  await page.keyboard.press('Space');
  await expect(page.locator('#result')).toBeHidden();
  expect(await runState(page)).toEqual({ phase: 'playing', deaths: 0 });
  await frames(page, 20);
  expect((await state(page)).x).toBeCloseTo(25, 0);
  expect((await state(page)).grounded).toBe(true);
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(timeOrigin);
  await place(page, 288, 216);
  await expect(page.locator('#result')).toBeVisible();
  await page.getByRole('button', { name: 'Rejouer' }).tap();
  await expect(page.locator('#result')).toBeHidden();
  expect(await runState(page)).toEqual({ phase: 'playing', deaths: 0 });
  expect(errors).toEqual([]);
});


test('the course can be completed with keyboard jumps without teleporting', async ({ page }) => {
  await expect.poll(async () => (await state(page)).grounded).toBe(true);
  const steer = async (target: number) => {
    const direction = (await state(page)).x < target ? 'ArrowRight' : 'ArrowLeft';
    await page.keyboard.down(direction);
    await page.waitForFunction(({ target, direction }) => {
      const x = (window.__game.scene.getScene('test') as TestScene).player.x;
      return direction === 'ArrowRight' ? x >= target : x <= target;
    }, { target, direction });
    await page.keyboard.up(direction);
  };
  const jumpTo = async (target: number, delay = 0) => {
    await page.keyboard.down('Space');
    if (delay) await frames(page, delay);
    await steer(target);
    await page.keyboard.up('Space');
    await expect.poll(async () => (await state(page)).grounded).toBe(true);
    expect((await runState(page)).deaths).toBe(0);
  };
  await jumpTo(95, 13);
  expect((await state(page)).y).toBeCloseTo(448, 0);
  await steer(137);
  await jumpTo(230);
  expect((await state(page)).y).toBeCloseTo(378, 0);
  await steer(210);
  await jumpTo(115);
  expect((await state(page)).y).toBeCloseTo(308, 0);
  await steer(140);
  await jumpTo(240);
  expect((await state(page)).y).toBeCloseTo(238, 0);
  await page.keyboard.down('ArrowRight');
  await expect(page.locator('#result')).toBeVisible();
  await page.keyboard.up('ArrowRight');
  expect(await runState(page)).toEqual({ phase: 'won', deaths: 0 });
});


test('direction fingers stay independent and cannot slide into jump', async ({ page, context }) => {
  await reset(page, 235);
  const client = await context.newCDPSession(page);
  const left = page.getByRole('button', { name: 'Gauche' });
  const right = page.getByRole('button', { name: 'Droite' });
  const jump = page.getByRole('button', { name: 'Sauter' });
  const l = (await left.boundingBox())!, r = (await right.boundingBox())!, j = (await jump.boundingBox())!;
  const a = { id: 1, x: l.x + l.width / 2, y: l.y + l.height / 2 };
  const b = { id: 2, x: r.x + r.width / 2, y: r.y + r.height / 2 };
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [a, b] });
  await frames(page, 2); expect((await state(page)).vx).toBe(0);
  a.x = b.x;
  await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [a, b] });
  await frames(page, 2); expect((await state(page)).vx).toBe(190);
  await expect(left).toHaveAttribute('data-held', 'false');
  a.x = j.x + j.width / 2;
  await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [a, b] });
  await expect(jump).toHaveAttribute('data-held', 'false');
  await expect(right).toHaveAttribute('data-held', 'true');
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [a] });
  await expect(right).toHaveAttribute('data-held', 'true');
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(right).toHaveAttribute('data-held', 'false');
  // A finger that started on jump cannot become a direction finger either.
  a.x = j.x + j.width / 2;
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [a] });
  await expect(jump).toHaveAttribute('data-held', 'true');
  a.x = l.x + l.width / 2;
  await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [a] });
  await expect(jump).toHaveAttribute('data-held', 'false');
  await expect(left).toHaveAttribute('data-held', 'false');
  await client.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
});

test('victory and replay discard a finger that switched directions', async ({ page, context }) => {
  const client = await context.newCDPSession(page);
  const left = page.getByRole('button', { name: 'Gauche' });
  const right = page.getByRole('button', { name: 'Droite' });
  const l = (await left.boundingBox())!, r = (await right.boundingBox())!;
  const finger = { id: 1, x: l.x + l.width / 2, y: l.y + l.height / 2 };
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [finger] });
  finger.x = r.x + r.width / 2;
  await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [finger] });
  await expect(right).toHaveAttribute('data-held', 'true');
  await place(page, 288, 216);
  await expect(page.locator('#result')).toBeVisible();
  await expect(right).toHaveAttribute('data-held', 'false');
  await page.keyboard.press('Enter');
  await expect(page.locator('#result')).toBeHidden();
  finger.x = l.x + l.width / 2;
  await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [finger] });
  await expect(left).toHaveAttribute('data-held', 'false');
  await expect(right).toHaveAttribute('data-held', 'false');
  await frames(page, 10);
  expect((await state(page)).x).toBeCloseTo(25, 0);
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
});
