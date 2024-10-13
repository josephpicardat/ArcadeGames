import Phaser from 'phaser';
import WebFontFile from '../../PhaserPong/scenes/WebFontFile';
import * as Colors from '../../PhaserPong/scenes//Colors';

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
    }

    preload() {
        const fonts = new WebFontFile(this.load, 'Press Start 2P');
        this.load.addFile(fonts);
    }

    create() {
        this.scene.run('gameBackground');
        this.scene.sendToBack('gameBackground');

        // Initialize the snake with 3 segments
        for (let i = 0; i < 3; i++) {
            this.snake.push(
                this.add
                    .rectangle(
                        this.padding + this.boxSize * i,
                        this.padding + this.boxSize,
                        this.boxSize,
                        this.boxSize,
                        0xfeca9b, // Snake color
                        1
                    )
                    .setOrigin(0)
            );
        }

        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;

        const numBoxesX = Math.floor(canvasWidth / this.boxSize); // Number of boxes that fit horizontally
        const numBoxesY = Math.floor(canvasHeight / this.boxSize); // Number of boxes that fit vertically
        this.numBoxesX = numBoxesX;
        this.numBoxesY = numBoxesY;

        // Input handling for snake movement
        this.input.keyboard.on('keydown', this.handleKeyDown, this);

        // Update snake movement
        this.time.addEvent({
            delay: 150, // Move every 200 milliseconds
            callback: this.moveSnake,
            callbackScope: this,
            loop: true,
        });

        this.snakeFood();
    }

    handleKeyDown(event) {
        // Store the direction change in the queue
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
        // If the snake is already moving, return
        if (this.moving) return;

        // Set moving flag to true
        this.moving = true;

        // Check for direction changes in the queue
        if (this.directionQueue.length > 0) {
            const newDirection = this.directionQueue.shift(); // Get the next direction from the queue
            this.direction = newDirection; // Update the current direction
        }

        // Calculate new position for the head of the snake
        const headX = this.snake[0].x + this.direction.x * this.boxSize;
        const headY = this.snake[0].y + this.direction.y * this.boxSize;

        // Check for collision with the boundaries
        if (
            headX < this.padding ||
            headX >= this.cameras.main.width - this.padding ||
            headY < this.padding ||
            headY >= this.cameras.main.height - this.padding
        ) {
            console.log('Game Over! Snake hit the wall.');
            return; // Exit if the snake hits the wall
        }

        // Move the snake by adding a new head segment
        const newHead = this.add
            .rectangle(headX, headY, this.boxSize, this.boxSize, 0xfeca9b, 1)
            .setOrigin(0);
        this.snake.unshift(newHead); // Add new head segment to the front of the snake

        // Remove the last segment of the snake to maintain its length
        const tail = this.snake.pop();
        tail.destroy(); // Destroy the tail segment

        // Set moving flag back to false after the move is complete
        this.moving = false;
    }
    snakeFood() {
        let foodPosition;
        const boxSize = this.boxSize; // Size of the food

        // Calculate the valid range for food positions
        const minX = 0;
        const maxX = this.numBoxesX - 1;
        const minY = 0;
        const maxY = this.numBoxesY - 1;

        // Generate a random position for the snake food
        do {
            // Generate random positions for food
            const foodX =
                Math.floor(Phaser.Math.Between(minX, maxX)) * boxSize + 16;

            const foodY =
                Math.floor(Phaser.Math.Between(minY, maxY)) * boxSize + 16;

            foodPosition = { x: foodX, y: foodY };
        } while (
            this.snake.some(
                (segment) =>
                    segment.x === foodPosition.x && segment.y === foodPosition.y
            )
        );

        // Create the snake food at the calculated position, with origin at top-left (0, 0)
        const food = this.add
            .rectangle(
                foodPosition.x,
                foodPosition.y,
                boxSize,
                boxSize,
                0xffffff,
                1
            )
            .setOrigin(0); // Set origin to top-left

        return food;
    }
}
