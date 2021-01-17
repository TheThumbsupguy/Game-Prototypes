import Phaser from "phaser";

const playerVelX = 64;
const playerVelY = -192;
const gravityY = 400;

class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: "PlayScene" });
  }

  create() {
    this.createGround();
    this.createPlayer();
    this.createText();
    this.createDebug();
    this.physics.add.collider([this.floor, this.big], this.player);
  }

  createText() {
    this.text = this.add.text(
      16,
      16,
      "Left and Right arrows to move, Up arrow to jump\nDebug key press D",
      { fontSize: 8, color: "#ffffff" }
    );
  }

  createGround() {
    this.floor = this.physics.add.sprite(
      0,
      this.game.config.height - 32,
      "floor"
    );
    this.floor.setImmovable(true);
    this.floor.setOrigin(0);
    this.floor.body.setAllowGravity(false);

    this.big = this.physics.add.sprite(
      this.floor.width,
      this.game.config.height - 132,
      "big"
    );
    this.big.x = this.floor.width - this.big.width;
    this.big.setImmovable(true);
    this.big.setOrigin(0);
    this.big.body.setAllowGravity(false);

    this.slope = this.physics.add.sprite(
      this.big.x - this.big.width,
      this.game.config.height - 132,
      "slope"
    );
    this.slope.setImmovable(true);
    this.slope.setOrigin(0);

    this.triangle = new Phaser.Geom.Triangle(
      this.slope.x,
      this.slope.y + this.slope.height,
      this.slope.x + this.slope.width,
      this.slope.y,
      this.slope.x + this.slope.width,
      this.slope.y + this.slope.height
    );

    this.graphics = this.add.graphics({
      lineStyle: { width: 2, color: 0x00aa00 }
    });
  }

  createDebug() {
    this.input.keyboard.on("keydown_D", () => {
      if (!this.physics.world.drawDebug)
        this.physics.world.createDebugGraphic();
      this.physics.world.debugGraphic.visible = this.debug = !this.debug;
    });
  }

  createPlayer() {
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 3,
        first: 1
      }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 0
      })
    });
    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("player", {
        start: 3,
        end: 3
      })
    });

    this.player = this.physics.add.sprite(
      this.game.config.width / 2 - 24,
      this.game.config.height - 48,
      "player"
    );
    this.player.name = "player";
    console.log(this.player);
    this.player.anims.play("idle");
    this.player.body.gravity.y = gravityY;

    const { RIGHT, LEFT, UP } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = this.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP
    });
  }

  jump() {
    this.player.body.setAllowGravity(true);
    this.player.body.gravity.y = gravityY;
    this.player.body.setVelocityY(playerVelY);
  }

  update() {
    const { right, left, up } = this.keys;
    const isGround =
      this.player.body.touching.down || this.player.body.blocked.down;

    this.graphics.clear();
    this.graphics.lineStyle(2, 0xff0000);

    if ((right.isDown || left.isDown) && (isGround || this.player.isOnSlope))
      this.player.anims.play("run", true);
    else if (!isGround && !this.player.isOnSlope)
      this.player.anims.play("jump", true);
    else this.player.anims.play("idle", true);

    if (right.isDown) {
      this.player.body.setVelocityX(playerVelX);
      this.player.setFlipX(false);
    } else if (left.isDown) {
      this.player.body.setVelocityX(-playerVelX);
      this.player.setFlipX(true);
    } else {
      if (!isGround && !this.player.isOnSlope)
        this.player.body.velocity.x *= 0.98;
      else this.player.body.setVelocityX(0);
    }

    if (isGround && up.isDown) this.player.body.setVelocityY(playerVelY);

    if (this.physics.world.intersects(this.player.body, this.slope.body)) {
      if (this.intersects(this.player.getBounds(), this.triangle)) {
        if (up.isDown) this.jump();
        else {
          let dX =
            this.player.body.position.x + this.player.width - this.slope.x;
          this.player.body.position.y =
            this.slope.y + this.slope.height - this.player.height - dX;
          this.player.body.setAllowGravity(false);
        }
      }
    } else this.player.body.setAllowGravity(true);

    if (this.intersects(this.player.getBounds(), this.triangle)) {
      this.player.isOnSlope = true;
      this.graphics.lineStyle(2, 0xff0000);
    } else {
      this.player.isOnSlope = false;
      this.graphics.lineStyle(2, 0xffff00);
    }

    if (this.debug) this.graphics.strokeTriangleShape(this.triangle);
  }

  intersects(objA, objB) {
    return Phaser.Geom.Intersects.RectangleToTriangle(objA, objB);
  }
}

export default PlayScene;
