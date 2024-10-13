import Phaser from 'phaser';
import * as Colors from './Colors';

export default class GameBackground extends Phaser.Scene {
    constructor() {
        super({ key: 'gameBackground' });
    }
    preload() {}

    create() {
        // Get the canvas dimensions
        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;

        // Calculate positions based on percentages
        const xPosition = canvasWidth * 0.5; // 50% of the width

        // Start and end coordinates of the line
        const x1 = xPosition,
            y1 = 0;
        const x2 = xPosition,
            y2 = canvasHeight;

        // Bar line settings
        const barWidth = 2;
        const barHeight = 10;
        const barColor = Colors.White;
        const barSpacing = 15;

        this.createDottedLine(
            this,
            x1,
            y1,
            x2,
            y2,
            barColor,
            barWidth,
            barHeight,
            barSpacing
        );
    }

    createDottedLine(
        scene,
        x1,
        y1,
        x2,
        y2,
        barColor,
        barWidth,
        barHeight,
        barSpacing
    ) {
        const distance = Phaser.Math.Distance.Between(x1, y1, x2, y2);
        const barCount = Math.floor(distance / (barSpacing + barHeight)); // Adjusted to account for spacing

        // Calculate direction vector for the line
        const deltaX = (x2 - x1) / barCount;
        const deltaY = (y2 - y1) / barCount;

        for (let i = 0; i <= barCount; i++) {
            const barX = x1 + deltaX * i;
            const barY = y1 + deltaY * i;

            // Add a rectangle for each bar along the line
            scene.add.rectangle(barX, barY, barWidth, barHeight, barColor);
        }
    }
}
