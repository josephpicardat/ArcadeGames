import Phaser from 'phaser';
import WebFontFile from '../../PhaserPong/scenes/WebFontFile';

export default class TitleScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'titleScreen' });
    }

    preload() {
        const fonts = new WebFontFile(this.load, 'Press Start 2P');
        this.load.addFile(fonts);
    }

    create() {
        // Get the canvas dimensions
        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;

        const xPosition = canvasWidth * 0.5; // 50% of the width
        const yPosition1 = canvasHeight * 0.4; // 40% of the height
        const yPosition2 = canvasHeight * 0.6; // 30% of the height

        this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0)');

        const title = this.add
            .text(xPosition, yPosition1, 'Snake Game', {
                fontSize: '48px',
                fontFamily: '"Press Start 2P"',
            })
            .setOrigin(0.5, 0.5);

        const start = this.add
            .text(xPosition, yPosition2, 'Press Space to Start', {
                fontSize: '16px',
                fontFamily: '"Press Start 2P"',
            })
            .setOrigin(0.5, 0.5);

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('game');
        });
    }
}
