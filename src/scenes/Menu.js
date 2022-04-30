class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion1', './assets/explosion1.wav');
        this.load.audio('sfx_explosion2', './assets/explosion2.wav');
        this.load.audio('sfx_explosion3', './assets/explosion3.wav');
        this.load.audio('sfx_explosion4', './assets/explosion4.wav');
        this.load.audio('sfx_explosion5', './assets/explosion5.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    create() {
        // menu text configuration
        let menuConfig = {
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
            fixedWidth: 0
        }

        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - 3*(borderUISize + borderPadding), 'ROCKET PATROL', menuConfig).setOrigin(0.5);

        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Press M + ←/→ for 2 Player Mode', menuConfig).setOrigin(0.5);

        menuConfig.backgroundColor = '#FFFFFF';
        this.add.text(game.config.width/2, game.config.height/2 + 2*(borderUISize + borderPadding), 'P1: Use A/D keys to move & W to fire', menuConfig).setOrigin(0.5);

        menuConfig.backgroundColor = '#fffc22';
        this.add.text(game.config.width/2, game.config.height/2 + 3*(borderUISize + borderPadding), 'P2: Use ←/→ to move and ↑ to fire)', menuConfig).setOrigin(0.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000
            }
            this.sound.play('sfx_select');
            this.scene.start(keyM.isDown ? 'twoPlayerScene' : 'playScene');
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 10000
            }
            this.sound.play('sfx_select');
            this.scene.start(keyM.isDown ? 'twoPlayerScene' : 'playScene');
            
        }
    }
}