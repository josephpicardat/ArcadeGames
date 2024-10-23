import Phaser from 'phaser';
import flappy_bird_background from '../assets/flappy_bird_background.png';

export default class GameBackground extends Phaser.Scene {
    constructor() {
        super({ key: 'gameBackground' });
    }

    init() {
        this.background;
    }
    preload() {
        this.load.image('background', flappy_bird_background);
    }

    create(data) {
        // Get the canvas dimensions
        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;

        this.background = this.add
            .image(0, canvasHeight / 2, 'background')
            .setOrigin(0, 0.5)
            .setDisplaySize(canvasWidth, canvasHeight);
    }

    update() {}
}
