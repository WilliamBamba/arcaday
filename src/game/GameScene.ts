import Phaser from 'phaser';
import { Controls } from '../input/controls';
import { movement } from './movement';
import { Run } from './run';
import { validateLevel, type Level, type Rect } from '../levels/types';

export class GameScene extends Phaser.Scene {
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  readonly run = new Run();
  private status!: HTMLElement;
  private result!: HTMLElement;
  constructor(private readonly controls: Controls, readonly level: Level) { super('game'); }
  create(): void {
    validateLevel(this.level);
    this.physics.world.setBounds(0, 0, this.level.world.width, this.level.world.height);
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0x201e1a);
    graphics.fillCircle(12, 8, 7);
    graphics.fillRect(4, 16, 16, 20);
    graphics.generateTexture('player', 24, 36);
    graphics.destroy();
    const platforms = this.physics.add.staticGroup();
    for (const rect of [...this.level.platforms, ...this.level.walls]) {
      platforms.add(this.rectangle(rect, 1));
    }
    this.player = this.physics.add.sprite(this.level.spawn.x, this.level.spawn.y, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.body.setMaxVelocity(190, 650);
    this.physics.add.collider(this.player, platforms);
    const hazards = this.physics.add.staticGroup();
    for (const rect of [...this.level.obstacles, ...this.level.deathZones]) {
      hazards.add(this.rectangle(rect, 0));
      this.drawSpikes(rect);
    }
    this.physics.add.overlap(this.player, hazards, () => this.die());
    const arrival = this.level.goal;
    const goal = this.rectangle(arrival, 0);
    this.physics.add.existing(goal, true);
    this.add.rectangle(arrival.x + 3, arrival.y + arrival.height / 2, 3, arrival.height, 0x201e1a);
    this.add.triangle(arrival.x + 4, arrival.y, 0, 0, arrival.width - 4, 8, 0, 16, 0x201e1a).setOrigin(0);
    this.physics.add.overlap(this.player, goal, () => this.win());
    const camera = this.cameras.main;
    camera.setBounds(0, 0, this.level.world.width, this.level.world.height);
    camera.startFollow(this.player, true, 0.12, 0.12, -48, 100);
    camera.setDeadzone(32, 110);
    this.resetCamera();
    this.status = document.querySelector<HTMLElement>('#run-status')!;
    this.result = document.querySelector<HTMLElement>('#result')!;
    const replay = document.querySelector<HTMLButtonElement>('#replay')!;
    const restart = () => { if (this.run.phase === 'won') this.restart(); };
    replay.addEventListener('click', restart);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => replay.removeEventListener('click', restart));
    this.renderStatus();
  }
  private rectangle(rect: Rect, alpha: number): Phaser.GameObjects.Rectangle {
    return this.add.rectangle(rect.x + rect.width / 2, rect.y + rect.height / 2,
      rect.width, rect.height, 0x201e1a, alpha);
  }
  private drawSpikes(rect: Rect): void {
    // One static Graphics object per group, matching the declared rectangular hitbox.
    const graphics = this.add.graphics().fillStyle(0x201e1a);
    for (let x = rect.x; x < rect.x + rect.width; x += 8) {
      const right = Math.min(x + 8, rect.x + rect.width);
      graphics.fillTriangle(x, rect.y + rect.height, (x + right) / 2, rect.y, right, rect.y + rect.height);
    }
  }
  private resetCamera(): void {
    // Respawning resets the view immediately, avoiding a long pan across the course.
    this.cameras.main.setFollowOffset(-48, 100);
    this.cameras.main.centerOn(this.player.x + 48, this.player.y - 100);
  }
  private renderStatus(): void {
    this.status.textContent = `Morts : ${this.run.deaths}`;
    this.result.hidden = this.run.phase !== 'won';
    if (this.run.phase === 'won') {
      document.querySelector<HTMLElement>('#result-text')!.textContent = `Victoire ! ${this.run.deaths} mort(s).`;
    }
  }
  private stop(): void {
    this.controls.setEnabled(false);
    this.player.body.stop();
    this.player.body.enable = false;
  }
  private die(): void {
    if (!this.run.die()) return;
    this.stop();
    this.player.setVisible(false);
    this.renderStatus();
    this.time.delayedCall(180, () => {
      this.run.respawn();
      this.resetPlayer();
    });
  }
  private resetPlayer(): void {
    this.player.body.enable = true;
    this.player.body.reset(this.level.spawn.x, this.level.spawn.y);
    this.player.setVisible(true);
    this.resetCamera();
    this.controls.setEnabled(true);
  }
  private win(): void {
    if (!this.run.win()) return;
    this.stop();
    this.renderStatus();
    document.querySelector<HTMLButtonElement>('#replay')!.focus({ preventScroll: true });
  }
  private restart(): void {
    document.querySelector<HTMLButtonElement>('#replay')!.blur();
    this.run.restart();
    this.resetPlayer();
    this.renderStatus();
  }
  update(_time: number, delta: number): void {
    if (this.run.phase !== 'playing') return;
    const body = this.player.body;
    const input = this.controls.sample();
    const camera = this.cameras.main;
    // Ease the look-ahead on reversal; retain it while standing still.
    if (input.direction !== 0) {
      const target = -input.direction * 48;
      camera.followOffset.x = Phaser.Math.Linear(camera.followOffset.x, target, 1 - Math.exp(-delta / 180));
    }
    const velocity = movement(input, body.blocked.down || body.touching.down, body.velocity.y);
    body.setVelocity(velocity.x, velocity.y);
  }
}
