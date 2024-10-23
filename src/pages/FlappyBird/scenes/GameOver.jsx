import Phaser from 'phaser';
import WebFontFile from '../../PhaserPong/scenes/WebFontFile';

export default class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'gameOver' });
    }

    init(data) {
        this.playerScore = data.playerScore;
    }

    preload() {
        const fonts = new WebFontFile(this.load, 'Press Start 2P');
        this.load.addFile(fonts);
    }
    create() {
        this.scene.run('gameBackground');
        this.scene.sendToBack('gameBackground');
        this.scene.run('ground');

        // Get the canvas dimensions
        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;

        // Retrieve the high score from local storage
        const highScore = localStorage.getItem('highScore') || 0;

        // Check if the current score is greater than the high score
        if (this.playerScore > highScore) {
            localStorage.setItem('highScore', this.playerScore); // Update the high score
        }

        this.add
            .text(canvasWidth * 0.5, canvasHeight * 0.2, 'Game Over', {
                fontFamily: '"Press Start 2P"',
                fontSize: 48,
            })
            .setOrigin(0.5);

        this.scoreCard(canvasWidth, canvasHeight, highScore);

        const start = this.add.text(
            canvasWidth * 0.5,
            canvasHeight * 0.8,
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

    scoreCard(canvasWidth, canvasHeight, highScore) {
        // Define the score card properties
        const cardWidth = 0.5 * (canvasWidth / 5); // Width of the card
        const cardHeight = 0.5 * (canvasHeight / 2); // Height of the card
        const bgColor = 'rgba(222, 216, 149, 1)'; // RGB(222, 216, 149)
        const borderColor = 'black'; // Border color
        const borderRadius = '16px'; // Border radius
        const h2Color = 'rgb(232, 97, 1)'; // Color for h2 elements
        const shadowColor = '#F0EAA1'; // Shadow color for h2 elements

        // Create the DOM element
        const scoreCard = this.add.dom(canvasWidth / 2, canvasHeight / 2)
            .createFromHTML(`
                    <div style="
                        width: ${cardWidth}px;
                        min-width: 150px;
                        height: ${cardHeight}px;
                        min-height: 180px;
                        background-color: ${bgColor};
                        border: 2px solid ${borderColor};
                        border-radius: ${borderRadius};
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        padding: 1rem;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                    ">
                        <h2 style="
                            margin: 0; 
                            font-family: 'Press Start 2P'; 
                            color: ${h2Color}; 
                            font-weight: bold;
                            text-shadow: 1px 1px 0 ${shadowColor}, 1px 1px 5px ${shadowColor};">
                            Score
                        </h2>
                        <p style="
                            font-family: 'Press Start 2P'; 
                            font-size: 24px; 
                            margin: 0; 
                            font-weight: bold;
                            text-shadow: 1px 1px 0 ${borderColor};">
                            ${this.playerScore}
                        </p>
                        <h2 style="
                            margin: 0; 
                            font-family: 'Press Start 2P'; 
                            color: ${h2Color}; 
                            font-weight: bold;
                            text-shadow: 1px 1px 0 ${shadowColor}, 1px 1px 5px ${shadowColor};">
                            Best
                        </h2>
                        <p style="
                            font-family: 'Press Start 2P'; 
                            font-size: 24px; 
                            margin: 0; 
                            font-weight: bold;
                            text-shadow: 1px 1px 0 ${borderColor};">
                            ${highScore}
                        </p>
                    </div>
                `);

        // Send the DOM element to the back
        scoreCard.setDepth(-1);
    }
}
