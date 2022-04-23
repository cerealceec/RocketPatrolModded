class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, y, texture, frame, pointValue) {
        super(scene, y, texture, frame);
        scene.add.existing(this);                       // add to existing scene
        this.points = pointValue;                       // store pointValue
        this.pickDirection();
    }

    update() {
        // move spaceship
        this.x -= this.moveSpeed;
        if (this.moveDirection == 'left' &&
            this.x <= 0 - this.width) {
            // wrap around from left edge to right edge
            this.reset();
        } else if (this.moveDirection == 'right' &&
                   this.x >= game.config.width) {
            // wrap around from right edge to left edge
            this.reset();
        }
    }

    // position set/reset
    reset() {
        if (this.moveDirection == 'left') {
            this.x = game.config.width;
        } else {
            this.x = 0 - this.width;
        }
    }

    // pick movement direction
    pickDirection() {
        if (Math.random() < 0.5) {
            this.moveDirection = 'left';
            this.flipX = false;
            this.moveSpeed = game.settings.spaceshipSpeed;
        } else {
            this.moveDirection = 'right';
            this.flipX = true;
            this.moveSpeed = -game.settings.spaceshipSpeed;
        }
        this.reset();
    }
}