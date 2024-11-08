import Phaser from 'phaser';

export default class GameBackground extends Phaser.Scene {
    constructor() {
        super({ key: 'gameBackground' });
    }

    preload() {}

    create() {
        // Get the canvas dimensions
        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;

        // Set the background color
        this.cameras.main.setBackgroundColor('#83a63f'); // Background color for the scene

        // Create a top bar for information display
        const barHeight = canvasHeight * 0.125; // Height of the top bar
        const topBar = this.add.rectangle(
            this.cameras.main.centerX, // Center X
            barHeight / 2, // Center Y
            this.cameras.main.width, // Width of the bar (full width of the game)
            barHeight, // Height of the bar
            0x4a752c // Color of the bar
        );
    }
}
