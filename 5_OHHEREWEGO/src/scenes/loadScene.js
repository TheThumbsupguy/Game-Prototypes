import Phaser from "phaser";

class LoadScene extends Phaser.Scene {
  constructor() {
    super({ key: "LoadScene" });
  }

  preload() {
    this.load.spritesheet("player", "assets/hero.png", {
      frameWidth: 20,
      frameHeight: 32
    });
    this.load.image("floor", "assets/floor.png");
    this.load.image("big", "assets/big.png");
    this.load.image("slope", "assets/slope.png");
  }

  create() {
    this.scene.start("PlayScene");
  }
}

export default LoadScene;
