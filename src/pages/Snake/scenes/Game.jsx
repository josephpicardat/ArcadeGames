import Phaser from 'phaser';
import WebFontFile from '../../PhaserPong/scenes/WebFontFile';

const GameState = {
    Running: 'running',
    PlayerWon: 'player-won',
    PlayerLost: 'player-lost',
};

export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'game' });
    }

    init() {
        this.gameState = GameState.Running;
        this.snake = []; // Array to hold the snake segments
        this.direction = { x: 1, y: 0 }; // Initial direction
        this.boxSize = 32; // Size of each box
        this.padding = 16; // Padding around the edges
        this.directionQueue = []; // Queue to store direction changes
        this.moving = false; // Indicates if the snake is moving
        this.numBoxesX = 0;
        this.numBoxesY = 0;
        this.paused = false;
    }

    preload() {
        const fonts = new WebFontFile(this.load, 'Press Start 2P');
        this.load.addFile(fonts);
    }

    create() {
        this.scene.run('gameBackground');
        this.scene.sendToBack('gameBackground');

        // Get the canvas dimensions
        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;

        // Calculate the number of boxes that fit horizontally and vertically
        this.numBoxesX = Math.floor(
            (canvasWidth - this.padding * 2) / this.boxSize
        ); // Columns
        this.numBoxesY = Math.floor(
            (canvasHeight - this.padding * 2) / this.boxSize
        ); // Rows

        const worldWidth = this.numBoxesX * this.boxSize;
        const worldHeight = this.numBoxesY * this.boxSize;

        // Set world bounds based on the grid
        this.physics.world.setBounds(
            this.padding,
            this.padding,
            worldWidth,
            worldHeight
        );

        // Center of canvas
        const centerX = canvasWidth / 2 - this.boxSize;
        const centerY = canvasHeight / 2 - this.boxSize;

        // Initialize the snake with 3 segments
        for (let i = 0; i < 3; i++) {
            this.snake.push(
                this.add
                    .rectangle(
                        centerX - this.boxSize * i,
                        centerY - 8,
                        this.boxSize,
                        this.boxSize,
                        0xfeca9b, // Snake color
                        1
                    )
                    .setOrigin(0)
            );
        }

        // Add physics to each snake segment
        this.snake.forEach((segment, index) => {
            this.physics.add.existing(segment);
            segment.body.setCollideWorldBounds(true); // Enable world bounds collision
            if (index === 0) {
                segment.body.onWorldBounds = true;
            }
        });

        // Input handling for snake movement
        this.input.keyboard.on('keydown', this.handleKeyDown, this);

        // Start the snake movement timer
        this.time.addEvent({
            delay: 150, // Move every 150 milliseconds
            callback: this.moveSnake,
            callbackScope: this,
            loop: true,
        });

        // Handle ESC key press to pause the game
        this.input.keyboard.on('keydown-ESC', this.handlePauseToggle, this);

        this.snakeFood();
        this.createPauseButton();
    }

    update() {
        // Handle additional game logic like eating food and growing the snake
        const head = this.snake[0];

        // Check if snake eats the food
        if (head.x === this.food.x && head.y === this.food.y) {
            this.snake.push(this.food); // Grow snake by adding food as a new segment
            this.snakeFood(); // Create new food
        }
    }

    handlePauseToggle() {
        this.scene.get('game').scene.pause(); // Pauses the game
        this.scene.launch('pause');
    }

    handleKeyDown(event) {
        // Queue direction changes, but prevent reversing into the opposite direction
        switch (event.key) {
            case 'ArrowUp':
                if (this.direction.y === 0)
                    this.directionQueue.push({ x: 0, y: -1 });
                break;
            case 'ArrowDown':
                if (this.direction.y === 0)
                    this.directionQueue.push({ x: 0, y: 1 });
                break;
            case 'ArrowLeft':
                if (this.direction.x === 0)
                    this.directionQueue.push({ x: -1, y: 0 });
                break;
            case 'ArrowRight':
                if (this.direction.x === 0)
                    this.directionQueue.push({ x: 1, y: 0 });
                break;
        }
    }

    moveSnake() {
        if (this.moving) return;

        this.moving = true;

        // Apply direction change if present
        if (this.directionQueue.length > 0) {
            const newDirection = this.directionQueue.shift();
            this.direction = newDirection;
        }

        // Calculate new head position
        const headX = this.snake[0].x + this.direction.x * this.boxSize;
        const headY = this.snake[0].y + this.direction.y * this.boxSize;

        // Check for collision with world bounds
        if (
            headX < this.padding ||
            headX >= this.padding + this.numBoxesX * this.boxSize ||
            headY < this.padding ||
            headY >= this.padding + this.numBoxesY * this.boxSize
        ) {
            this.endGame('Hit Wall');
            return;
        }

        // Check for self-collision
        for (let i = 1; i < this.snake.length; i++) {
            const segment = this.snake[i];
            if (headX === segment.x && headY === segment.y) {
                this.endGame('Hit Yourself');
                return;
            }
        }

        // Move snake: add a new head and remove the tail
        const newHead = this.add
            .rectangle(headX, headY, this.boxSize, this.boxSize, 0xfeca9b, 1)
            .setOrigin(0);
        this.snake.unshift(newHead);

        const tail = this.snake.pop();
        tail.destroy();

        this.moving = false;
    }

    snakeFood() {
        let foodPosition;
        const boxSize = this.boxSize;

        do {
            const foodX =
                Phaser.Math.Between(0, this.numBoxesX - 1) * boxSize +
                this.padding;
            const foodY =
                Phaser.Math.Between(0, this.numBoxesY - 1) * boxSize +
                this.padding;

            foodPosition = { x: foodX, y: foodY };
        } while (
            this.snake.some(
                (segment) =>
                    segment.x === foodPosition.x && segment.y === foodPosition.y
            )
        );

        if (!foodPosition) {
            endGame('You Won!');
        } else {
            this.food = this.add
                .rectangle(
                    foodPosition.x,
                    foodPosition.y,
                    boxSize,
                    boxSize,
                    0xffffff,
                    1
                )
                .setOrigin(0);
        }
    }

    endGame(data) {
        this.scene.stop('gameBackground');
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
