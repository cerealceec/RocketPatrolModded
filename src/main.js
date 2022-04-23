let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let fontSize = 28;
let textPadding = 5;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

// track high score
let highScore = 0;
