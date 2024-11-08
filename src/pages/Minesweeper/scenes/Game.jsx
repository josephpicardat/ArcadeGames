import Phaser from 'phaser';
import WebFontFile from '../../PhaserPong/scenes/WebFontFile';
import Dropdown from '../components/Dropdown';
import ReactDOM from 'react-dom/client';
import timer from '../assets/timer.png';

const GameState = {
    Running: 'running',
    PlayerWon: 'player-won',
    PlayerLost: 'player-lost',
};

export default class Game extends Phaser.Scene {
    constructor(x, y) {
        super({ key: 'game' });
    }

    init(data) {
        this.gameState = GameState.Running;
        this.paused = false;
        this.timer = 0;
        this.numBoxesX = 10;
        this.numBoxesY = 10;
        this.boxSize = 32;
        this.difficulty = 'Easy';
        this.resetDifficulty = data.difficulty;
        this.maxBombCount = 10;
        this.boxes = [];
        this.testBoxes = [];
        this.backgroundRect;
        this.flag;
        this.flagCount = 10;
        this.timerStarted = false;
        this.timerEvent = null; // To hold the timer event
        this.canvasHeight = this.cameras.main.height;
        this.canvasWidth = this.cameras.main.width;
        this.firstClick = true;
        this.Reset = true;
    }

    preload() {
        const fonts = new WebFontFile(this.load, 'Press Start 2P');
        this.load.addFile(fonts);
        for (let i = 1; i < 11; i++) {
            this.load.image(
                `flagPart${i}`,
                `src/pages/Minesweeper/assets/flag/flag_${i}.png`
            );
        }
        for (let i = 1; i < 9; i++) {
            this.load.image(
                `bomb${i}`,
                `src/pages/Minesweeper/assets/bomb/bomb_${i}.png`
            );
        }
        this.load.image('timer', timer);
    }

    create() {
        this.scene.run('gameBackground');
        this.scene.sendToBack('gameBackground');

        const worldWidth = this.numBoxesX * this.boxSize;
        const worldHeight = this.numBoxesY * this.boxSize;

        // Get the Phaser canvas element
        const gameCanvas = this.game.canvas;

        // Disable the right-click context menu for the canvas
        gameCanvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        const canvas = this.add.dom(10, 10).createElement('div');
        canvas.setOrigin(0); // Align the div to top-left
        canvas.setDepth(999); // Ensure it's on top of everything
        canvas.setVisible(true); // Make sure it's visible
        canvas.node.id = 'dropdown-container'; // Set an ID for targeting it

        const root = ReactDOM.createRoot(canvas.node); // Use Phaser DOM element
        root.render(
            <Dropdown setGameDifficulty={this.setGameDifficulty.bind(this)} />
        );

        // Handle ESC key press to pause the game
        this.input.keyboard.on('keydown-ESC', this.handlePauseToggle, this);

        this.createPauseButton();
        this.createInfoContainer();
        this.createAnimations();
    }

    createAnimations() {
        // Check if animation already exists
        if (!this.anims.get('revealFlag')) {
            // Create the animation for the flag
            this.anims.create({
                key: 'revealFlag',
                frames: [
                    { key: 'flagPart1' },
                    { key: 'flagPart2' },
                    { key: 'flagPart3' },
                    { key: 'flagPart4' },
                    { key: 'flagPart5' },
                    { key: 'flagPart6' },
                    { key: 'flagPart7' },
                    { key: 'flagPart8' },
                    { key: 'flagPart9' },
                    { key: 'flagPart10' },
                ],
                frameRate: 30, // Adjust frame rate as needed
                repeat: 0, // Play once
            });
        }
    }

    update() {
        if (this.paused || this.gameState !== GameState.Running) {
            return;
        }
    }

    checkBoxes() {
        if (this.boxes !== this.testBoxes) {
            this.testBoxes = this.boxes;
        }
    }

    setGameDifficulty(newDifficulty) {
        if (this.reset === true) {
            this.difficulty = this.resetDifficulty;
            this.createBoxes();
            return;
        }

        switch (newDifficulty) {
            case 10: // Easy
                this.difficulty = 'Easy';
                this.flagCount = 10;
                this.updateFlagCounter();
                this.resetTimer();
                break;
            case 20: // Medium
                this.difficulty = 'Medium';
                this.flagCount = 40;
                this.updateFlagCounter();
                this.resetTimer();
                break;
            case 30: // Hard
                this.difficulty = 'Hard';
                this.flagCount = 99;
                this.updateFlagCounter();
                this.resetTimer();
                break;
            default:
                this.difficulty = 'Easy';
        }
        console.log('Difficulty changed to:', this.difficulty);
        this.createBoxes();
    }

    handlePauseToggle() {
        this.scene.get('game').scene.pause(); // Pauses the game
        this.scene.launch('pause');
    }

    createInfoContainer() {
        // Load your images for "Flags" and "Time" labels
        // You should already have these images loaded in your preload() function
        this.flagImage = this.add
            .image(0, 0, 'flagPart10')
            .setDisplaySize(50, 50);

        this.timerImage = this.add.image(0, 0, 'timer').setDisplaySize(50, 50);
        // Create text objects for the flag counter and timer
        this.flagCounterText = this.add.text(0, 0, `${this.flagCount}`, {
            font: '25px',
            fontFamily: 'Press Start 2P',
            fill: '#fff',
        });
        this.timerText = this.add.text(0, 0, `${this.timer}`, {
            font: '25px',
            fontFamily: 'Press Start 2P',
            fill: '#fff',
        });

        // Add some space between the items (e.g., 10 pixels between image and text, and 50 pixels between flag and timer sections)
        const sectionSpacing = 50; // Space between the flag section and timer section

        // Calculate total width (flag section width + spacing + timer section width)
        const totalWidth =
            this.flagImage.width +
            this.flagCounterText.width +
            this.timerImage.width +
            this.timerText.width;

        // Get the center of the screen
        const centerX = this.canvasWidth / 2;

        // Calculate Center of Bar
        const centerY = (this.canvasHeight * 0.12) / 2;

        // Position the flag section (flag image and counter)
        this.flagImage.setX(centerX - totalWidth / 2); // Position the flag image
        this.flagCounterText.setX(this.flagImage.x + this.flagImage.width / 2); // Position the flag counter text

        // Position the timer section (timer image and timer text)
        this.timerImage.setX(
            this.flagCounterText.x + this.flagCounterText.width + sectionSpacing
        ); // Position the timer image
        this.timerText.setX(this.timerImage.x + this.timerImage.width * 0.4); // Position the timer text

        // Set Y position
        this.flagImage.setY(centerY);
        this.flagCounterText.setY(centerY * 0.75);
        this.timerImage.setY(centerY);
        this.timerText.setY(centerY * 0.75);
    }

    // Method to update the flag count text
    updateFlagCounter() {
        this.flagCounterText.setText(`${this.flagCount}`);
    }

    // Example methods to modify the flag count
    incrementFlagCount() {
        this.flagCount++;
        this.updateFlagCounter(); // Update the display after changing the flag count
    }

    decrementFlagCount() {
        this.flagCount--;
        this.updateFlagCounter(); // Update the display after changing the flag count
    }

    createBoxes() {
        this.input.enabled = true;

        if (this.backgroundRect) {
            this.backgroundRect.destroy();
            this.backgroundRect = null; // Clear the reference
        }

        // Destroy existing boxes if there are any
        if (this.boxes) {
            this.boxes.forEach((box) => box.destroy()); // Destroy each box
        }

        // Create an empty array to store the new boxes
        this.boxes = [];

        // Adjust the number of boxes based on the difficulty
        if (this.difficulty === 'Hard') {
            this.numBoxesX = 24; // Hard mode, more boxes
            this.numBoxesY = 24;
            this.maxBombCount = 99;
        } else if (this.difficulty === 'Medium') {
            this.numBoxesX = 18; // Medium mode, default number of boxes
            this.numBoxesY = 18;
            this.maxBombCount = 40;
        } else {
            this.numBoxesX = 10; // Easy mode
            this.numBoxesY = 10;
            this.maxBombCount = 10;
        }

        // Log the total number of boxes for debugging
        this.totalBoxes = this.numBoxesX * this.numBoxesY;

        // Define the height of the top bar
        const topBarHeight = this.cameras.main.height * 0.125;

        // Calculate box size, prioritize a minimum of 32 but allow smaller if necessary
        this.boxSize = Math.min(
            this.cameras.main.width / this.numBoxesX, // Box size based on width
            (this.cameras.main.height - topBarHeight) / this.numBoxesY // Box size based on height
        );

        const minBoxSize = 32;

        // Check if adding more columns would exceed the width limit
        while (
            this.boxSize < minBoxSize &&
            (this.numBoxesX + 1) * minBoxSize <= this.cameras.main.width
        ) {
            this.numBoxesX++; // Add more columns
            this.boxSize = Math.min(
                this.cameras.main.width / this.numBoxesX,
                (this.cameras.main.height - topBarHeight) / this.numBoxesY
            );
            this.totalBoxes = this.numBoxesX * this.numBoxesY; // Update total boxes
        }

        // Calculate the starting position for the boxes to center them
        const startX =
            (this.cameras.main.width - this.numBoxesX * this.boxSize) / 2;
        const startY =
            topBarHeight +
            (this.cameras.main.height -
                topBarHeight -
                this.numBoxesY * this.boxSize) /
                2;

        // Create the background rectangle
        this.backgroundRect = this.add
            .rectangle(
                startX + (this.boxSize * this.numBoxesX) / 2, // Center the rectangle
                startY + (this.boxSize * this.numBoxesY) / 2, // Center the rectangle
                this.numBoxesX * this.boxSize, // Width
                this.numBoxesY * this.boxSize, // Height
                0xaad751 // Set the background color
            )
            .setOrigin(0.5) // Set origin to the center
            .setDepth(-1); // Set depth to -1 to be behind the boxes

        // Create the grid of boxes
        for (let y = 0; y < this.numBoxesY; y++) {
            for (let x = 0; x < this.numBoxesX; x++) {
                const boxColor = (x + y) % 2 === 0 ? 0xaad751 : 0xa2d149; // Alternate colors

                // Create the main box
                const box = this.add
                    .rectangle(
                        startX + x * this.boxSize,
                        startY + y * this.boxSize,
                        this.boxSize,
                        this.boxSize,
                        boxColor
                    )
                    .setOrigin(0)
                    .setInteractive()
                    .setVisible(true);

                // Add bomb property to the box
                box.hasBomb = false;
                box.bombSprite = null;

                // Flag Sprite
                box.flagSprite = null;

                // Add grid property to the box
                box.gridX = x;
                box.gridY = y;

                // Create revealed property
                box.revealed = false;

                // Hover Enable
                box.hoverEnabled = true;

                // Create a flag for the timer event
                this.timerEvent = null;

                // Add hover effect (change color on hover)
                // box.on('pointerover', () => {
                //     if (box.hoverEnabled) {
                //         box.setFillStyle(0xffffff, 0.3); // Change to white with 0.3 opacity
                //     }
                // });

                // // Restore original color when hover ends
                // box.on('pointerout', () => {
                //     if (box.hoverEnabled) {
                //         box.setFillStyle(boxColor); // Reset to original color
                //     }
                // });

                // Add event listener for clicking the box
                box.on('pointerdown', (pointer) => {
                    if (pointer.leftButtonDown()) {
                        if (this.firstClick) {
                            this.createBombs(x, y);
                            this.firstClick = false; // Set firstClick to false after the first click
                        }

                        if (box.hasBomb && box.flagSprite === null) {
                            // Check if the box has a bomb
                            console.log('Bomb triggered!');

                            // Randomly select bomb
                            const randomBomb = `bomb${Math.floor(
                                Math.random() * 8 + 1
                            )}`;

                            console.log(randomBomb);

                            const centerX = box.x + this.boxSize / 2;
                            const centerY = box.y + this.boxSize / 2;

                            box.bombSprite = this.add
                                .sprite(centerX, centerY, randomBomb)
                                .setOrigin(0.5, 0.5)
                                .setDisplaySize(this.boxSize, this.boxSize);

                            this.endGame(GameState.PlayerLost);
                        } else if (box.flagSprite === null) {
                            this.revealBox(box);
                            box.disableInteractive();
                        }

                        this.startTimer(); // Start the timer when the square is clicked
                    }
                });

                // Add event listener for right-clicking the box
                box.on('pointerdown', (pointer) => {
                    if (pointer.rightButtonDown()) {
                        if (!box.flagSprite) {
                            // Calculate the center of the box in pixels
                            const centerX = box.x + this.boxSize / 2;
                            const centerY = box.y + this.boxSize / 2;
                            const flagSize = this.boxSize;

                            // If no flag, create flag sprite
                            box.flagSprite = this.add
                                .sprite(centerX, centerY, 'flagPart1')
                                .setOrigin(0.5, 0.5)
                                .setDisplaySize(flagSize, flagSize); // Scale the flag sprite to 75% of the box size

                            // Animate the flag
                            box.flagSprite.play('revealFlag');
                            this.decrementFlagCount();
                            console.log(`Flag count: ${this.flagCount}`);
                        } else {
                            // If flag, destroy
                            box.flagSprite.destroy();
                            box.flagSprite = null; // Clear reference\
                            this.incrementFlagCount();
                            console.log(`Flag count: ${this.flagCount}`);
                        }
                    }
                });

                // Store the box in the array for later reference
                this.boxes.push(box);
            }
        }
    }

    revealBox(box) {
        if (box.revealed) return;
        box.revealed = true;

        console.log(box);

        // Change the color of the clicked box
        if (box.fillColor === 0xaad751) {
            box.setFillStyle(0xe5c29f);
        } else if (box.fillColor === 0xa2d149) {
            box.setFillStyle(0xd7b899);
        }

        // Display the number of adjacent bombs
        if (box.adjacentBombs > 0) {
            let fontSize = box.width * 0.75;
            let color = '#f44336'; // Use a hex color code with a leading #
            if (box.adjacentBombs === 1) {
                color = '#1976d2';
            } else if (box.adjacentBombs === 2) {
                color = '#388e3d';
            } else if (box.adjacentBombs === 3) {
                color = '#d32e2e';
            } else if (box.adjacentBombs === 4) {
                color = '#7b20a2';
            }

            this.add
                .text(
                    box.x + box.width / 2,
                    box.y + box.height / 2,
                    box.adjacentBombs,
                    {
                        font: `${fontSize}px Press Start 2P`,
                        fill: color, // This should work correctly now
                    }
                )
                .setOrigin(0.5);
        } else {
            // Recursively reveal surrounding boxes if no adjacent bombs
            let gridX = box.gridX; // Assuming box has grid coordinates
            let gridY = box.gridY; // (gridX, gridY) as its position in the grid

            // Loop through neighboring boxes (3x3 grid around current box)
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    // Skip the current box itself (dx === 0 and dy === 0)
                    if (dx === 0 && dy === 0) continue;

                    // Calculate neighboring box's grid coordinates
                    const neighborX = gridX + dx;
                    const neighborY = gridY + dy;

                    // Check if neighborX and neighborY are within bounds
                    if (
                        neighborY >= 0 &&
                        neighborY < this.numBoxesY && // Y bounds check
                        neighborX >= 0 &&
                        neighborX < this.numBoxesX // X bounds check
                    ) {
                        const neighborIndex =
                            neighborY * this.numBoxesX + neighborX;
                        const neighborBox = this.boxes[neighborIndex]; // Get the neighbor box

                        // If neighbor box is not revealed and has no adjacent bombs, reveal it
                        if (
                            !neighborBox.revealed &&
                            neighborBox.adjacentBombs === 0
                        ) {
                            this.revealBox(neighborBox); // Recursively reveal the empty neighbors
                        } else if (!neighborBox.revealed) {
                            this.revealBox(neighborBox); // Reveal boxes with adjacent bombs but stop recursion
                        }
                    }
                }
            }
        }
        // After revealing the box, check for win condition
        this.checkForWin();
    }

    changeAdjacentBoxColors(x, y) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dy === 0 && dx === 0) continue;

                const neighborX = x + dx;
                const neighborY = y + dy;

                if (
                    neighborX >= 0 &&
                    neighborX < this.numBoxesX &&
                    neighborY >= 0 &&
                    neighborY < this.numBoxesY
                ) {
                    const neighborBoxIndex =
                        neighborY * this.numBoxesX + neighborX;
                    const neighborBox = this.boxes[neighborBoxIndex];

                    const currentFillColor = neighborBox.fillColor;

                    if (currentFillColor === 0xaad751) {
                        neighborBox.setFillStyle(0xe5c29f); // Change to 0xE5C29F
                    } else if (currentFillColor === 0xa2d149) {
                        neighborBox.setFillStyle(0xd7b899); // Change to 0xD7B899
                    }
                }
            }
        }
    }

    createBombs(firstClickX, firstClickY) {
        // Logic to randomly place bombs
        let bombsPlaced = 0;

        // Create a set to hold the coordinates of boxes that should not have bombs
        const unsafeBoxes = new Set();

        // Define adjacent coordinates (relative to the clicked box)
        const adjacentCoords = [
            // Top Row
            [-1, -1],
            [-1, 0],
            [-1, 1],
            // Middle row
            [0, -1],
            [0, 1],
            // Bottom row
            [1, -1],
            [1, 0],
            [1, 1],
        ];

        // Add the clicked box and its adjacent boxes to the unsafe set
        unsafeBoxes.add(`${firstClickX},${firstClickY}`);
        adjacentCoords.forEach(([dx, dy]) => {
            const adjX = firstClickX + dx;
            const adjY = firstClickY + dy;
            if (
                adjX >= 0 &&
                adjX < this.numBoxesX &&
                adjY >= 0 &&
                adjY < this.numBoxesY
            ) {
                unsafeBoxes.add(`${adjX},${adjY}`);
            }
        });

        while (bombsPlaced < this.maxBombCount) {
            const x = Math.floor(Math.random() * this.numBoxesX);
            const y = Math.floor(Math.random() * this.numBoxesY);

            // Check if the box is safe (not in unsafeBoxes and not already a bomb)
            const isSafeBox =
                !this.boxes.some(
                    (box) => box.x === x && box.y === y && box.hasBomb
                ) && !unsafeBoxes.has(`${x},${y}`); // Ensure it's not an unsafe box

            if (isSafeBox) {
                // Place a bomb
                const box = this.boxes[y * this.numBoxesX + x]; // Assuming boxes are stored in a flat array
                box.hasBomb = true;
                bombsPlaced++;
            }
        }

        // Update adjacent bomb counts for all boxes
        for (let y = 0; y < this.numBoxesY; y++) {
            for (let x = 0; x < this.numBoxesX; x++) {
                const box = this.boxes[y * this.numBoxesX + x];
                box.adjacentBombs = this.calculateAdjacentBombs(x, y);
            }
        }
    }

    calculateAdjacentBombs(x, y) {
        let bombCount = 0;

        // Define all the possible neighbor offsets
        const neighborOffsets = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
        ];

        for (const [dx, dy] of neighborOffsets) {
            const neighborX = x + dx;
            const neighborY = y + dy;

            // Check if the neighboring box is within the grid bounds
            if (
                neighborX >= 0 &&
                neighborX < this.numBoxesX &&
                neighborY >= 0 &&
                neighborY < this.numBoxesY
            ) {
                const neighborBox =
                    this.boxes[neighborY * this.numBoxesX + neighborX]; // Assuming boxes is a 1D array
                if (neighborBox && neighborBox.hasBomb) {
                    bombCount++;
                }
            }
        }

        return bombCount;
    }

    // Method to format the timer as a three-digit string
    formatTime(time) {
        return String(time).padStart(3, '0'); // Convert to string and pad with zeros
    }
    startTimer() {
        if (!this.timerStarted) {
            this.timerStarted = true; // Set the flag so timer only starts once

            // Start the timer and update the timer text every second
            this.timerEvent = this.time.addEvent({
                delay: 1000, // 1000 ms = 1 second
                callback: () => {
                    if (this.timer < 999) {
                        // Cap at 999
                        this.timer++;
                        this.timerText.setText(this.formatTime(this.timer)); // Update displayed timer
                    }
                },
                loop: true,
            });
        }
    }

    resetTimer() {
        if (this.timerEvent) {
            this.timerEvent.destroy(); // Stop the timer event
            this.timerEvent = null; // Clear the event reference
        }
        this.timer = 0; // Reset timer count
        this.timerStarted = false; // Reset timer status
        this.timerText.setText(this.formatTime(this.timer)); // Update displayed timer
    }

    checkForWin() {
        // Count the number of unrevealed boxes
        const unrevealedBoxes = this.boxes.filter((box) => !box.revealed);
        if (unrevealedBoxes.length === this.maxBombCount) {
            // Game won!
            this.endGame(GameState.PlayerWon);
        }
    }

    endGame(winCondition) {
        const timeTaken = this.timer;
        const difficulty = this.difficulty;

        this.scene.pause();

        this.scene.launch('GameOver', {
            timeTaken,
            winCondition,
            difficulty,
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
