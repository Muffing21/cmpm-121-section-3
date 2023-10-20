import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  spinner?: Phaser.GameObjects.Shape;
  enemy?: Phaser.GameObjects.Shape;

  rotationSpeed = Phaser.Math.PI2 / 1000; // radians per millisecond

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("starfield", starfieldUrl);
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");

    this.starfield = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width as number,
        this.game.config.height as number,
        "starfield",
      )
      .setOrigin(0, 0);

    this.spinner = this.add.rectangle(100, 100, 50, 50, 0x8e00b9);
    this.enemy = this.add.rectangle(100, 100, 50, 50, 0x8e00b9);

    // let cursors = this.spinner.input.keyboard.createCursorKeys();
  }

  update(_timeMs: number, delta: number) {
    this.starfield!.tilePositionX -= 4;
    this.enemy!.setPosition(-4);

    if (this.left!.isDown) {
      this.spinner!.rotation -= delta * this.rotationSpeed;
    }
    if (this.right!.isDown) {
      this.spinner!.rotation += delta * this.rotationSpeed;
    }

    if (this.fire!.isDown) {
      this.tweens.add({
        targets: this.spinner,
        scale: { from: 1.5, to: 1 },
        duration: 300,
        ease: Phaser.Math.Easing.Sine.Out,
      });
    }

    if (checkCollision(this.spinner!, this.enemy!)) {
      console.log("check collosion");
    }
  }
}

function checkCollision(
  rocket: Phaser.GameObjects.Shape,
  ship: Phaser.GameObjects.Shape,
) {
  if (
    rocket.x < ship.x + ship.width &&
    rocket.x + rocket.width > ship.x &&
    rocket.y < ship.y + ship.height &&
    rocket.height + rocket.y > ship.y
  ) {
    return true;
  } else {
    return false;
  }
}
