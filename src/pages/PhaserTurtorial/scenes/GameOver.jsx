import Phaser from 'phaser';

export default class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'gameOver' });
    }
    create(data) {
        let titleText = 'Game Over';
        if (data.playerScore > data.AIScore) {
            titleText = 'Player Won!';
        }

        // Get the canvas dimensions
        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;

        // Calculate positions based on percentages
        const xPosition = canvasWidth * 0.5; // 50% of the width
        const yPosition1 = canvasHeight * 0.4; // 40% of the height
        const yPosition2 = canvasHeight * 0.6; // 30% of the height

        this.add
            .text(xPosition, yPosition1, titleText, {
                fontFamily: '"Press Start 2P"',
                fontSize: 48,
            })
            .setOrigin(0.5);

        const start = this.add.text(
            xPosition,
            yPosition2,
            'Press Space to Continue',
            {
                fontSize: '16px',
                fontFamily: '"Press Start 2P"',
            }
        );
        start.setOrigin(0.5, 0.5);

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('titleScreen');
        });
    }
}
