// name: cecil choi
// project: rocket patrol mods
// date: 29 apr 2022
// time spent: ~12 hrs

// POINTS BREAKDOWN:
// +30 Implement a simultaneous two-player mode
// +20 Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points
// +10 Implement parallax scrolling
// +10 Replace the UI borders with new artwork
// +10 Display the time remaining (in seconds) on the screen
// +10 Create 4 new explosion SFX and randomize which one plays on impact
// +5  Randomize each spaceship's movement direction at the start of each play
// +5  Track a high score that persists across scenes and display it in the UI

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play, TwoPlayer ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let fontSize = 28;
let textPadding = 5;

// reserve keyboard vars
let keyR, keyUP, keyLEFT, keyRIGHT, keyW, keyA, keyD, keyM;

// track high score
let highScore = 0;
