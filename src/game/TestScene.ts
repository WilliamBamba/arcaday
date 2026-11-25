import Phaser from 'phaser';
import { Controls } from '../input/controls';
import { movement } from './movement';
import { Run } from './run';

export class TestScene extends Phaser.Scene {
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  readonly run = new Run();
  private readonly spawn = { x: 25, y: 490 };
  private status!: HTMLElement;
  private result!: HTMLElement;
  constructor(private readonly controls: Controls) { super('test'); }
  create(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0x201e1a);
    graphics.fillCircle(12, 8, 7);
    graphics.fillRect(4, 16, 16, 20);
    graphics.generateTexture('player', 24, 36);
    graphics.destroy();
    const platforms = this.physics.add.staticGroup();
    for (const [x, y, width] of [[180, 526, 360], [95, 456, 110], [255, 386, 110], [100, 316, 110], [255, 246, 110]] as const) {
      const platform = this.add.rectangle(x, y, width, 16, 0x201e1a);
      platforms.add(platform);
    }
    this.player = this.physics.add.sprite(this.spawn.x, this.spawn.y, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.body.setMaxVelocity(190, 650);
    this.physics.add.collider(this.player, platforms);
    // Solid black, toothed silhouettes distinguish hazards from flat platforms.
    const hazards = this.physics.add.staticGroup();
    for (const [x, bottom, width] of [[175, 518, 32], [292, 378, 16], [54, 308, 16]] as const) {
      const hitbox = this.add.rectangle(x, bottom - 8, width, 16, 0x201e1a, 0);
      hazards.add(hitbox);
      for (let left = x - width / 2; left < x + width / 2; left += 8) {
        this.add.triangle(left, bottom - 16, 0, 16, 4, 0, 8, 16, 0x201e1a).setOrigin(0);
      }
    }
    this.physics.add.overlap(this.player, hazards, () => this.die());
    const goal = this.add.rectangle(288, 216, 26, 44, 0x201e1a, 0);
    this.physics.add.existing(goal, true);
    this.add.rectangle(278, 216, 3, 44, 0x201e1a);
    this.add.triangle(280, 194, 0, 0, 22, 8, 0, 16, 0x201e1a).setOrigin(0);
    this.physics.add.overlap(this.player, goal, () => this.win());
    this.status = document.querySelector<HTMLElement>('#run-status')!;
    this.result = document.querySelector<HTMLElement>('#result')!;
    const replay = document.querySelector<HTMLButtonElement>('#replay')!;
    const restart = () => { if (this.run.phase === 'won') this.restart(); };
    replay.addEventListener('click', restart);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => replay.removeEventListener('click', restart));
    this.renderStatus();
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
    this.player.body.reset(this.spawn.x, this.spawn.y);
    this.player.setVisible(true);
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
  update(): void {
    if (this.run.phase !== 'playing') return;
    const body = this.player.body;
    const velocity = movement(this.controls.sample(), body.blocked.down || body.touching.down, body.velocity.y);
    body.setVelocity(velocity.x, velocity.y);
  }
}
