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

        const boxSize = 32; // Size of each box
        const padding = 16; // Padding around the edge of the container

        // Calculate the number of columns and rows
        const cols = Math.floor((canvasWidth - padding * 2) / boxSize); // Subtract padding from both sides
        const rows = Math.floor((canvasHeight - padding * 2) / boxSize); // Subtract padding from both sides

        // Create the grid of boxes
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Calculate the position of each box
                const x = col * boxSize + padding; // Only padding on the left
                const y = row * boxSize + padding; // Only padding on the top

                // Determine color based on the position
                const color = (row + col) % 2 === 0 ? 0x808080 : 0xffffff; // Gray or white

                // Create the box
                this.add
                    .rectangle(x, y, boxSize, boxSize, color, 0.3)
                    .setOrigin(0); // Fully opaque
            }
        }
    }
}
