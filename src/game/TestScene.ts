import Phaser from 'phaser';
import { Controls } from '../input/controls';
import { movement } from './movement';

export class TestScene extends Phaser.Scene {
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
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
    this.player = this.physics.add.sprite(42, 490, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.body.setMaxVelocity(190, 650);
    this.physics.add.collider(this.player, platforms);
    this.add.text(12, 16, 'TERRAIN D’ESSAI', { fontFamily: 'sans-serif', fontSize: '14px', color: '#201e1a' });
  }
  update(): void {
    const body = this.player.body;
    const velocity = movement(this.controls.sample(), body.blocked.down || body.touching.down, body.velocity.y);
    body.setVelocity(velocity.x, velocity.y);
  }
}
