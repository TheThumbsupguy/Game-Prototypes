import Phaser from 'phaser';
import getLevel from '../levels/level-1';
import getVehicles from '../vehicles'
import { PLAYER_VELOCITY } from '../constants';

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: 'play' });
  }

  create() {
    // Get level map
    const map = getLevel(this);

    // Vehicles
    this.vehicles = getVehicles(this);

    // Ammo
    // const ammoDefault = this.textures.createCanvas('ammo-default', 8, 8);
    // ammoDefault.context.fillStyle = '#ffffff';
    // ammoDefault.context.fillRect(0, 0, 8, 8);
    // ammoDefault.refresh();
    // this.ammoDefault = this.physics.add.group({
    //   maxSize: 30,
    // });

    // Player
    // const playerRectangle = this.add.rectangle(this.game.config.width / 2 - 8, this.game.config.height / 2 - 8, 16, 16, "0xffffff")
    this.player = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'player')
      .setOrigin(0)
      .setName('player')
      .setDepth(this.vehicles.children.size);
    //this.player = this.physics.add.existing(playerRectangle);
    this.player.direction = 'right';

    // Camera follow player
    this.cameras.main.startFollow(this.player, false, 0.0625, 0.0625, 0, 60);
    //this.cameras.main.zoomTo(0.75);

    // Player animations
    this.anims.create({
      key: 'turn',
      frames: [{ key: 'player', frame: 0 }],
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 1, end: 6 }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: 'rightJump',
      frames: [{ key: 'player', frame: 1 }],
    });

    // Initialize active objects
    this.activeObjects = this.physics.add.group();

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors.space.on('down', spaceKeyDown, this);
    this.cursors.shift.on('down', shiftKeyDown, this);
    this.cursors.up.on('down', upKeyDown, this);
    //this.cursors.down.on('down', downKeyDown, this);
    this.cursors.left.on('down', leftKeyDown, this);
    this.cursors.right.on('down', rightKeyDown, this);

    // collision detection
    this.physics.add.collider([this.player, this.vehicles], map.getLayer('ground').tilemapLayer);
  }

  update(time, delta) {
    const { up, right, down, left, space, shift } = this.cursors;
    const velocity = getVelocity.call(this);
    const isGround =
      this.player.body.touching.down || this.player.body.blocked.down;
    const canJump = (this.time.now - this.player.jumpTimeStamp) < 500; // milliseconds

    // Stop non-active vehicles
    this.vehicles.children.each(vehicle => {
      if (vehicle.body.velocity.x > 0) {
        vehicle.body.setVelocityX(vehicle.body.velocity.x - 2);
      } else if (vehicle.body.velocity.x < 0) {
        vehicle.body.setVelocityX(vehicle.body.velocity.x + 2);
      }
    });

    // Ammo
    // this.ammoDefault.children.each(ammo => {
    //   if (ammo.active) {
    //     if (ammo.lifespan > 0) {
    //       ammo.lifespan -= delta;
    //     } else {
    //       ammo.setActive(false);
    //       ammo.setVisible(false);
    //       ammo.setVelocity(0);
    //     }
    //   }
    // });

    // Player move left, move right and idle
    if ((right.isDown || left.isDown) && (isGround))
      this.player.anims.play("right", true);
    else if (!isGround)
      this.player.anims.play("rightJump", true);
    else this.player.anims.play("turn", true);

    // Move player
    if (this.activeObjects.countActive()) {
      const firstObject = this.activeObjects.getFirst(true);
      const lastObject = this.activeObjects.getLast(true);

      // Only move the last object, which is the foundation of the mech.
      if (canJump || !lastObject.body.allowGravity) {
        if (up.isDown) {
          lastObject.body.setVelocityY(-velocity);
        } else if (down.isDown) {
          lastObject.body.setVelocityY(velocity);
        } else {
          if (!lastObject.body.allowGravity) {
            lastObject.body.setVelocityY(0);
          }
        }
      }

      if (left.isDown) {
        lastObject.body.setVelocityX(-velocity);
        lastObject.setFlipX(true);
        this.player.setFlipX(true);
      } else if (right.isDown) {
        lastObject.body.setVelocityX(velocity);
        lastObject.setFlipX(false);
        this.player.setFlipX(false);
      } else {
        lastObject.body.setVelocityX(0);
      }

      // Loop through the active objects in reverse order,
      // skipping the last object, and stack them vertically.
      this.activeObjects.children.each((vehicle, index) => {
        if (index != 0) {
          const inversePosition = this.activeObjects.children.size - index;
          const previousInversePosition = inversePosition + 1;
          const inverseVehicle = this.activeObjects.getFirstNth(inversePosition, true);
          const previousInverseVehicle = this.activeObjects.getFirstNth(previousInversePosition, true);

          inverseVehicle.body.x = previousInverseVehicle.body.x;
          inverseVehicle.body.y = previousInverseVehicle.body.y - 8;
        }
      });

      // Stack the player on top of the first object.
      if (firstObject) {
        this.player.body.x = firstObject.body.x - 4;
        this.player.body.y = firstObject.body.y - 8;
      }
    } else {
      // Just the player is active, so only move the player.
      if (canJump) {
        if (up.isDown) {
          this.player.body.setVelocityY(-velocity);
        } else if (down.isDown) {
          this.player.body.setVelocityY(velocity);
        }
      }

      if (left.isDown) {
        this.player.body.setVelocityX(-velocity);
        this.player.setFlipX(true);
      } else if (right.isDown) {
        this.player.body.setVelocityX(velocity);
        this.player.setFlipX(false);
      } else {
        this.player.body.setVelocityX(0);
      }
    }

    // Update vehicle positions
    // let previous;
    // this.activeObjects.children.intersect(this.vehicles.children).each((vehicle, index) => {
    //   const dx = (previous ? previous.x : this.player.x) - vehicle.x;
    //   const dy = (previous ? previous.y : this.player.y) - vehicle.y;
    //   const vx = dx * 4;
    //   const vy = dy * 4;
    //   if (up.isDown) {
    //     vehicle.body.setVelocity(vx, vy);
    //   } else {
    //     vehicle.body.setVelocityX(vx)
    //   }
    //   previous = vehicle;
    // });
  }
}

// Helpers

function getVelocity() {
  if (this.activeObjects.children.get('name', 'red')) {
    return PLAYER_VELOCITY * 2;
  }
  return PLAYER_VELOCITY;
}

// function fireAmmo() {
//   const { up, right, down, left } = this.cursors;
//   const facing = this.player.direction;
//   const ammoVelocity = 400;
//   let ammo;

//   ammo = this.ammoDefault.get(this.player.x + 16, this.player.y + 16, 'ammo-default');
//   if (ammo) {
//     ammo.setActive(true);
//     ammo.setVisible(true);
//     ammo.lifespan = 1000;
//     if (right.isDown || left.isDown) {
//       ammo.body.setVelocityX(left.isDown ? -ammoVelocity : ammoVelocity);
//     } else {
//       ammo.body.setVelocityX(facing == 'left' ? -ammoVelocity : ammoVelocity);
//     }
//     ammo.body.setAllowGravity(false);
//   }
// }

function spaceKeyDown() {
  // fireAmmo.call(this);
}

function shiftKeyDown() {
  let activeObject = this.activeObjects.getLast(true) || this.player;
  let isEnteringVehicle = false;

  // For each vehicle on the map...
  this.vehicles.children.each(vehicle => {
    // Check if the player overlaps a vehicle.
    if (this.physics.world.intersects(activeObject.body, vehicle.body)) {
      // If so, attach player to vehicle, otherwise detach player from vehicle.
      if (!this.activeObjects.contains(vehicle)) {
        const index = this.activeObjects.children.size;
        const depth = index + 1;

        isEnteringVehicle = true;

        this.activeObjects
          .children.each(object => {
            object.body.setAllowGravity(false);
          });

        this.activeObjects.add(vehicle);
        this.player.setDepth(0);
        this.player.body.setAllowGravity(false);
        vehicle.setDepth(depth);

        if (vehicle.name == 'yellow' || vehicle.name == 'green') {
          vehicle.body.setAllowGravity(false);
          this.cameras.main.setFollowOffset(0, 0);
        } else if (vehicle.name == 'red') {
          this.cameras.main.setFollowOffset(0, 30);
        }
      }
    }
  });

  // Exiting a vehicle, get ready to disperse vehicles.
  if (!isEnteringVehicle) {
    const position = this.player.x + (this.player.width / 2) - (this.activeObjects.children.size * 24 / 2);
    this.activeObjects
      .setDepth(0)
      .setX(position, 24)
      .children.each(object => {
        object.body.setAllowGravity(true);
      });
    this.activeObjects.clear();
    this.player.setDepth(this.vehicles.children.size);
    this.player.body.setAllowGravity(true);
    this.cameras.main.setFollowOffset(0, 60);
  }
}

function upKeyDown() {
  //this.player.direction = 'up';
  let isGround;

  if (this.activeObjects.countActive()) {
    const lastObject = this.activeObjects.getLast(true);
    isGround =
      lastObject.body.touching.down || lastObject.body.blocked.down;
  } else {
    isGround =
      this.player.body.touching.down || this.player.body.blocked.down;
  }

  if (isGround && (!this.player.jumpTimeStamp || this.time.now - this.player.jumpTimeStamp >= 500)) {
    this.player.jumpTimeStamp = this.time.now;
  }
}

// function downKeyDown() {
//   this.player.direction = 'down';
// }

function leftKeyDown() {
  this.player.direction = 'left';
}

function rightKeyDown() {
  this.player.direction = 'right';
}
