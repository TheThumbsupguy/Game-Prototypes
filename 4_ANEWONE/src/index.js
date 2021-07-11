import Phaser from "phaser";
import LoadScene from "./scenes/load-scene";
import PlayScene from "./scenes/play-scene";

const config = {
  type: Phaser.AUTO,
  width: 512,
  height: 288,
  pixelArt: true,
  backgroundColor: '0x8cc4ff',
  scale: {
    zoom: 2,
    //mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {
        y: 600
      },
    }
  },
  scene: [LoadScene, PlayScene]
};

const game = new Phaser.Game(config);
