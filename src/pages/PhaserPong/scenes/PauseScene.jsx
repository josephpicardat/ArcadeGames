import Phaser from 'phaser';
import WebFontFile from './WebFontFile';

export default class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'pause' });
    }

    preload() {
        const fonts = new WebFontFile(this.load, 'Press Start 2P');
        this.load.addFile(fonts);
    }

    create() {
        // Get the canvas dimensions
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Calculate positions based on percentages
        const xPosition = width * 0.5; // 50% of the width
        const yPosition1 = height * 0.4; // 40% of the height
        const yPosition2 = height * 0.6; // 30% of the height

        this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0.3)');

        const title = this.add.text(xPosition, yPosition1, 'Game Paused', {
            fontSize: '48px',
            fontFamily: '"Press Start 2P"',
        });
        title.setOrigin(0.5, 0.5);

        const start = this.add.text(
            xPosition,
            yPosition2,
            'Press Space to Resume',
            {
                fontSize: '16px',
                fontFamily: '"Press Start 2P"',
            }
        );
        start.setOrigin(0.5, 0.5);

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.resume('game'); // Resume the game scene
            this.scene.stop(); // Stop the pause scene
        });
    }
}
