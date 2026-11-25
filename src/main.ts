import Phaser from 'phaser';
import { bindControls, Controls } from './input/controls';
import { GameScene } from './game/GameScene';
import { firstLevel } from './levels/first';
import type { Level } from './levels/types';
import { MOVEMENT } from './game/movement';
import './style.css';

const controls = new Controls();
const unbind = bindControls(controls);
let level: Level = firstLevel;
const testMode = import.meta.env.DEV && new URLSearchParams(location.search).has('test');
if (testMode && new URLSearchParams(location.search).get('level') === 'prototype') {
  level = (await import('../tests/fixtures/prototype')).prototype;
}
const game = new Phaser.Game({
  type: Phaser.AUTO, parent: 'game', width: 360, height: 550, backgroundColor: '#eee3cb',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: 'arcade', arcade: { gravity: { x: 0, y: MOVEMENT.gravity }, fixedStep: true } },
  scene: new GameScene(controls, level),
});
// Explicit opt-in for browser integration tests; absent from production builds.
if (testMode) {
  Object.assign(window, { __game: game });
}
game.events.once(Phaser.Core.Events.DESTROY, unbind);
