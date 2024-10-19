import Phaser from 'phaser';
import WebFontFile from '../../PhaserPong/scenes/WebFontFile';

export default class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'gameOver' });
    }

    preload() {
        const fonts = new WebFontFile(this.load, 'Press Start 2P');
        this.load.addFile(fonts);
    }
    create(data) {
        // Get the canvas dimensions
        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;

        this.scene.run('gameBackground');
        this.scene.sendToBack('gameBackground');

        this.add
            .text(canvasWidth * 0.5, canvasHeight * 0.3, 'Game Over', {
                fontFamily: '"Press Start 2P"',
                fontSize: 48,
            })
            .setOrigin(0.5);

        this.add
            .text(canvasWidth * 0.5, canvasHeight * 0.5, data.playerScore, {
                fontFamily: '"Press Start 2P"',
                fontSize: 48,
            })
            .setOrigin(0.5);

        const start = this.add.text(
            canvasWidth * 0.5,
            canvasHeight * 0.7,
            'Press Space to Continue',
            {
                fontSize: '16px',
                fontFamily: '"Press Start 2P"',
                color: 'black',
            }
        );
        start.setOrigin(0.5, 0.5);

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('titleScreen');
        });
    }
}
