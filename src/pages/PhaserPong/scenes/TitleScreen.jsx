import Phaser from 'phaser';
import WebFontFile from './WebFontFile';

export default class TitleScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'titleScreen' });
        this.selectedDifficulty = 1; // Default difficulty (Easy)
    }

    preload() {
        const fonts = new WebFontFile(this.load, 'Press Start 2P');
        this.load.addFile(fonts);
    }

    create() {
        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;

        const xPosition = canvasWidth * 0.5; // 50% of the width
        const yPosition1 = canvasHeight * 0.3; // 40% of the height
        const yPosition2 = canvasHeight * 0.5; // 30% of the height
        const yPosition3 = canvasHeight * 0.65; // 30% of the height

        this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0)');

        const title = this.add
            .text(xPosition, yPosition1, 'Pong Game', {
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

        this.createButtons(xPosition, yPosition3);

        this.input.keyboard.on('keydown-SPACE', () => {
            this.startGame(this.selectedDifficulty); // Use the selected difficulty
        });
    }

    createButtons(x, y) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'buttonContainer';

        const difficulties = ['Easy', 'Hard', 'Impossible'];

        difficulties.forEach((difficulty) => {
            const difficultyButton = document.createElement('div');
            difficultyButton.className = 'difficultyButton';
            difficultyButton.innerText = difficulty;
            difficultyButton.setAttribute('data-difficulty', difficulty);
            difficultyButton.addEventListener('click', () => {
                this.onDifficultySelected(difficultyButton);
            });

            buttonContainer.appendChild(difficultyButton);
        });

        document.body.appendChild(buttonContainer);

        this.add
            .dom(x, y, buttonContainer, {
                fontFamily: '"Press Start 2P"',
                width: '90%',
            })
            .setOrigin(0.5, 0.5);
    }

    onDifficultySelected(selectedButton) {
        const buttons = document.querySelectorAll('.difficultyButton');

        // Reset all buttons to non-active
        buttons.forEach((button) => {
            button.style.backgroundColor = 'rgba(88, 110, 247, 0.2)'; // Default color
        });

        // Set the selected button to active
        selectedButton.style.backgroundColor = 'rgba(88, 110, 247, 0.4)'; // Highlight color

        // Update selected difficulty based on button clicked
        const difficulty = selectedButton.getAttribute('data-difficulty');

        switch (difficulty) {
            case 'Easy':
                this.selectedDifficulty = 1;
                break;
            case 'Hard':
                this.selectedDifficulty = 2;
                break;
            case 'Impossible':
                this.selectedDifficulty = 3;
                break;
            default:
                this.selectedDifficulty = 1; // Default to easy
                break;
        }
    }

    startGame(difficultyLevel) {
        let aiSpeed;

        switch (difficultyLevel) {
            case 1: // Easy
                aiSpeed = 1; // Set easy AI speed
                break;
            case 2: // Hard
                aiSpeed = 2; // Set hard AI speed
                break;
            case 3: // Impossible
                aiSpeed = 3; // Set impossible AI speed
                break;
            default:
                aiSpeed = 1; // Default to easy
        }

        this.scene.start('game', { aiSpeed }); // Pass aiSpeed to game scene
    }
}
