import Phaser from 'phaser';
import WebFontFile from '../../PhaserPong/scenes/WebFontFile';
import Dropdown from '../components/Dropdown';
import ReactDOM from 'react-dom/client';

const GameState = {
    Running: 'running',
    PlayerWon: 'player-won',
    PlayerLost: 'player-lost',
};

const COLOR_MAIN = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'game' });
    }

    init() {
        this.gameState = GameState.Running;
        this.paused = false;
        this.timer = 0;
        this.numBoxesX = 0;
        this.numBoxesY = 0;
        this.difficulty = 'Easy';
        this.boxSize = 32;
    }

    preload() {
        const fonts = new WebFontFile(this.load, 'Press Start 2P');
        this.load.addFile(fonts);
    }

    create() {
        // Get the canvas dimensions
        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;

        const worldWidth = this.numBoxesX * this.boxSize;
        const worldHeight = this.numBoxesY * this.boxSize;

        // const canvas = this.add.dom(10, 10).createElement('div');
        // canvas.setOrigin(0); // Align the div to top-left
        // canvas.setDepth(999); // Ensure it's on top of everything
        // canvas.setVisible(true); // Make sure it's visible
        // canvas.node.id = 'dropdown-container'; // Set an ID for targeting it

        // const root = ReactDOM.createRoot(canvas.node); // Use Phaser DOM element
        // root.render(
        //     <Dropdown setGameDifficulty={this.setGameDifficulty.bind(this)} />
        // );

        // Input handling for snake movement
        this.input.keyboard.on('keydown', this.handleKeyDown, this);

        // Handle ESC key press to pause the game
        this.input.keyboard.on('keydown-ESC', this.handlePauseToggle, this);

        this.createPauseButton();
    }

    update() {
        if (this.difficulty === 'Easy') {
            // Easy game settings
        } else if (this.difficulty === 'Medium') {
            // Medium game settings
        } else if (this.difficulty === 'Hard') {
            // Hard game settings
        }
    }

    setGameDifficulty(newDifficulty) {
        switch (newDifficulty) {
            case '10': // Easy
                this.difficulty = 'Easy';
                break;
            case '20': // Medium
                this.difficulty = 'Medium';
                break;
            case '30': // Hard
                this.difficulty = 'Hard';
                break;
            default:
                this.difficulty = 'Easy';
        }

        console.log('Difficulty changed to:', this.difficulty);
        // You can adjust game settings based on this.difficulty here
    }

    handlePauseToggle() {
        this.scene.get('game').scene.pause(); // Pauses the game
        this.scene.launch('pause');
    }

    handleKeyDown(event) {}

    endGame(data) {
        let reason = '';

        if (data === GameState.PlayerWon) {
            console.log(data);
            reason = GameState.PlayerWon;
        } else {
            reason = data;
        }

        // Show the game over / win screen
        this.scene.start('gameOver', {
            reason: reason,
        });
    }

    createPauseButton() {
        // Pause Button
        const pauseButton = document.createElement('div');
        pauseButton.className = 'button';
        pauseButton.innerText = 'Pause';

        this.add
            .dom(0, 0, pauseButton, { fontFamily: '"Press Start 2P"' })
            .addListener('click')
            .on('click', () => {
                console.log('Button clicked');
                this.scene.get('game').scene.pause(); // Pauses the game
                this.scene.launch('pause');
            });

        // Ensure the button is dynamically sized and positioned in the top-right corner
        pauseButton.style.position = 'absolute';
        pauseButton.style.top = '20px';
        pauseButton.style.right = '-40px';
        pauseButton.style.width = 'fit-content';
    }
}
