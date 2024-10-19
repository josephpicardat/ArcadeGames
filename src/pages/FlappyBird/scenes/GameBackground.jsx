import Phaser from 'phaser';
import flappy_bird_background from '../assets/flappy_bird_background.png';
import flappy_bird_ground from '../assets/flappy_bird_ground.png';

export default class GameBackground extends Phaser.Scene {
    constructor() {
        super({ key: 'gameBackground' });
    }

    init() {
        this.background;
        this.groundImg1;
        this.groundImg2;
        this.scrollSpeed = 3;
    }
    preload() {
        this.load.image('background', flappy_bird_background);
        this.load.image('ground', flappy_bird_ground);
    }

    create(data) {
        // Get the canvas dimensions
        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;

        const groundHeight = canvasHeight * 0.2;

        this.background = this.add
            .image(0, canvasHeight / 2, 'background')
            .setOrigin(0, 0.5)
            .setDisplaySize(canvasWidth, canvasHeight);

        this.groundImg1 = this.add
            .image(0, canvasHeight, 'ground')
            .setOrigin(0, 0.5)
            .setDisplaySize(canvasWidth, groundHeight);

        this.groundImg2 = this.add
            .image(canvasWidth, canvasHeight, 'ground')
            .setOrigin(0, 0.5)
            .setDisplaySize(canvasWidth, groundHeight);

        // Set transparency to 80%
        this.background.setAlpha(0.9);
        this.groundImg1.setAlpha(0.9);
        this.groundImg2.setAlpha(0.9);

        if (data === 0) {
            this.scrollSpeed = 0;
        }
    }

    update() {
        const canvasWidth = this.cameras.main.width;

        // Move both backgrounds to the left
        this.groundImg1.x -= this.scrollSpeed;
        this.groundImg2.x -= this.scrollSpeed;

        // If the first background goes off screen, move it to the right of the second background
        if (this.groundImg1.x <= -canvasWidth) {
            this.groundImg1.x = this.groundImg2.x + canvasWidth;
        }

        // If the second background goes off screen, move it to the right of the first background
        if (this.groundImg2.x <= -canvasWidth) {
            this.groundImg2.x = this.groundImg1.x + canvasWidth;
        }
    }
}
