class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);                       // add to existing scene
        this.basePoints = pointValue;
        this.pickType();         
        this.pickDirection();
        if (this.moveDirection == 'right') {
            this.x = -(this.x - game.config.width);
        }
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
        this.pickType();
        this.pickDirection();
    }

    // pick movement direction
    pickDirection() {
        if (Math.random() < 0.5) {
            this.moveDirection = 'left';
            this.flipX = false;
            this.moveSpeed = this.isFast ? game.settings.spaceshipSpeed + 1.5 : game.settings.spaceshipSpeed;
        } else {
            this.moveDirection = 'right';
            this.flipX = true;
            this.moveSpeed = this.isFast ? -game.settings.spaceshipSpeed - 1.5 : -game.settings.spaceshipSpeed;
        }
    }

    // change ship type
    pickType() {
        this.isFast = Phaser.Math.Between(0, 3) == 0 ? true : false;
        if (this.isFast) {
            this.setTexture('fastShip');
            this.points = this.basePoints + 20;
        } else {
            this.setTexture('spaceship');
            this.points = this.basePoints;
        }
    }
}