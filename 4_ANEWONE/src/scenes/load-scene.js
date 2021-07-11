import Phaser from 'phaser';
import playerSprite from 'url:../../src/assets/player.png';

export default class LoadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'load' });
  }

  preload() {
    this.load.spritesheet('player',
      playerSprite,
      { frameWidth: 32, frameHeight: 32 }
    );
  }

  update() {
    this.scene.start('play');
  }
}
