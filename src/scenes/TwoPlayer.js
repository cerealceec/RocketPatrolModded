class TwoPlayer extends Phaser.Scene {
    constructor() {
        super("twoPlayerScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('rocket2', './assets/rocket2.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('starfield2', './assets/starfield2.png');
        this.load.image('borders', './assets/borders.png')
        this.load.image('fastShip', './assets/fastShip.png')
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('explosionFast', './assets/explosionFast.png', {frameWidth: 44, frameHeight: 22, startFrame: 0, endFrame: 6});
    }

    create() {
        // define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        
        // place black background
        this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000).setOrigin(0, 0);

        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.starfield2 = this.add.tileSprite(0, 0, 640, 480, 'starfield2').setOrigin(0, 0);
        
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderPadding*2 + 20 + fontSize + textPadding*2, 0x00FF00).setOrigin(0, 0).setDepth(2);

        // borders
        this.borders = this.add.image(0, 0, 'borders').setDepth(3).setOrigin(0, 0);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width / 4, game.config.height - borderUISize - borderPadding, 'rocket', 0, 1).setOrigin(0.5, 0);
        // add rocket (p2)
        this.p2Rocket = new Rocket(this, 3 * game.config.width / 4, game.config.height - borderUISize - borderPadding, 'rocket2', 0, 2).setOrigin(0.5, 0);
        
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4 + borderPadding,'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*3, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*5, 'spaceship', 0, 10).setOrigin(0, 0);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        this.anims.create({
            key:'explodeFast',
            frames: this.anims.generateFrameNumbers('explosionFast', {start: 0, end: 6, first: 0}),
            frameRate: 30
        });

        // initialize scores
        this.p1Score = 0;
        this.p2Score = 0;

        // save old high score
        this.oldHighScore = highScore;

        // display score labels
        let labelsConfig = {
            fontFamily: 'Courier',
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: '#843605',
            color: '#F3B141',
            align: 'center',
            padding: {
                top: 3,
                bottom: 3
            },
            fixedWidth: 100
        }
        
        this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, 'PLAYER 1', labelsConfig).setDepth(2);
        this.add.text(game.config.width - borderUISize - borderPadding, borderUISize + borderPadding*2, 'PLAYER 2', labelsConfig).setDepth(2).setOrigin(1, 0);
        this.add.text(game.config.width/2, borderUISize + borderPadding*2, 'HIGH SCORE', labelsConfig).setOrigin(0.5, 0).setDepth(2);
        
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: `${fontSize}px`,
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: textPadding,
                bottom: textPadding,
                left: textPadding,
                right: textPadding
            },
            fixedWidth: 100
        }

        scoreConfig.backgroundColor = "#ffffff";
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2 + 20, this.p1Score, scoreConfig).setDepth(2);

        scoreConfig.backgroundColor = "#fffc22";
        this.scoreRight = this.add.text(game.config.width - borderUISize - borderPadding, borderUISize + borderPadding*2 + 20, this.p2Score, scoreConfig).setOrigin(1, 0).setDepth(2);

        // display high score
        scoreConfig.backgroundColor = "#F3B141";
        this.highScoreDisp = this.add.text(game.config.width/2, borderUISize + borderPadding*2 + 20, highScore, scoreConfig).setOrigin(0.5, 0).setDepth(2);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            let result = this.p1Score > this.p2Score ? 'PLAYER 1 WINS!'
                       : this.p2Score > this.p1Score ? 'PLAYER 2 WINS!'
                       : 'TIE!';
            this.add.text(game.config.width/2, game.config.height/2, result, scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64 + 28 + scoreConfig.padding.top*2, 'or ← for Menu', scoreConfig).setOrigin(0.5);

            // if high score, say 'HIGH SCORE!'
            if (highScore > this.oldHighScore) {
                this.add.text(game.config.width/2, game.config.height/2 - 64 + scoreConfig.padding.top*2, 'HIGH SCORE!', scoreConfig).setOrigin(0.5);
            }
            this.gameOver = true;
        }, null, this);

        // set initial remaining time
        this.remaining = Math.ceil(this.clock.getRemainingSeconds());
        this.minutes = this.remaining/60 >= 1 ? this.remaining/60 : 0;
        this.seconds = this.remaining - this.minutes*60;

        // add clock
        this.timeDisp = this.add.text(game.config.width - borderUISize - borderPadding, game.config.height - borderUISize - borderPadding, `${String(this.minutes).padStart(2, 0)}:${String(this.seconds).padStart(2, 0)}`, scoreConfig).setOrigin(1, 1).setDepth(2);
    }

    update() {
        // clock update and repaint
        if (Math.ceil(this.clock.getRemainingSeconds()) != this.remaining) {
            this.remaining = Math.ceil(this.clock.getRemainingSeconds());
            this.minutes = this.remaining/60 >= 1 ? this.remaining/60 : 0;
            this.seconds = this.remaining - this.minutes*60;
            this.timeDisp.text = `${String(this.minutes).padStart(2, 0)}:${String(this.seconds).padStart(2, 0)}`;
        }

        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 2;
        this.starfield2.tilePositionX -= 5;
        
        if (!this.gameOver) {
            this.p1Rocket.update();     // update p1 rocket
            this.p2Rocket.update();     // update p2 rocket
            this.ship01.update();       // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        }
        
        // check collisions p1
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(1, this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(1, this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(1, this.ship01);
        }

        // check collisions p2
        if (this.checkCollision(this.p2Rocket, this.ship03)) {
            this.p2Rocket.reset();
            this.shipExplode(2, this.ship03);
        }
        if (this.checkCollision(this.p2Rocket, this.ship02)) {
            this.p2Rocket.reset();
            this.shipExplode(2, this.ship02);
        }
        if (this.checkCollision(this.p2Rocket, this.ship01)) {
            this.p2Rocket.reset();
            this.shipExplode(2, this.ship01);
        }
        
    }
    
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(player, ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, ship.isFast ? 'explosionFast' : 'explosion').setOrigin(0, 0);
        if (ship.moveDirection == 'right') boom.flipX = true;
        boom.anims.play(ship.isFast ? 'explodeFast' : 'explode');             // play explode 
        boom.on('animationcomplete', () => {    // callback after anim
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible
            boom.destroy();                     // remove explosion sprite
        });
        // score add and repaint
        if (player == 1) {
            this.p1Score += ship.points;
            this.scoreLeft.text = this.p1Score;
        } else if (player == 2) {
            this.p2Score += ship.points;
            this.scoreRight.text = this.p2Score;
        }
        // update high score
        if (this.p1Score > highScore) {
            highScore = this.p1Score;
            this.highScoreDisp.text = highScore;
        } else if (this.p2Score > highScore) {
            highScore = this.p2Score;
            this.highScoreDisp.text = highScore;
        }
        // play explosion sound
        this.sound.play(`sfx_explosion${Phaser.Math.Between(1, 5)}`);
    }  
}