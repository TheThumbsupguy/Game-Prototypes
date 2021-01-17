import Phaser from "phaser";
import LoadScene from "./scenes/loadScene";
import PlayScene from "./scenes/playScene";

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: "game-container",
    width: 480,
    height: 320,
    autoResize: true
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      fps: 60,
      debug: true
    }
  },
  pixelArt: true,
  scene: [LoadScene, PlayScene]
};

new Phaser.Game(config);
