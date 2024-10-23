import Phaser from 'phaser';
import WebFontFile from '../../PhaserPong/scenes/WebFontFile';
import wing_up from '../assets/wing_up.png';
import wing_down from '../assets/wing_down.png';
import wing_middle from '../assets/wing_middle.png';
import top_pipe from '../assets/long_pipe_down.png';
import bottom_pipe from '../assets/long_pipe_up.png';

const GameState = {
    Running: 'running',
    PlayerLost: 'player-lost',
};

export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'game' });
    }

    init() {
        this.gameState = GameState.Running;
        this.score = 0;
        this.paused = false;
        this.bird;
        this.spacebar = null; // Add spacebar variable
        this.pipes = null; // Group to store pipe pairs
    }

    preload() {
        const fonts = new WebFontFile(this.load, 'Press Start 2P');
        this.load.addFile(fonts);
        this.load.image('bird_down', wing_down);
        this.load.image('bird_middle', wing_middle);
        this.load.image('bird_up', wing_up);
        this.load.image('pipeTop', top_pipe); // Load the pipe image
        this.load.image('pipeBottom', bottom_pipe); // Load the ground image
    }

    create() {
        this.scene.run('gameBackground');
        this.scene.sendToBack('gameBackground');

        this.scene.run('ground');

        // Get the canvas dimensions
        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;

        // Set word boundaries
        this.physics.world.setBounds(0, 0, canvasWidth, canvasHeight * 0.925);

        // Display the game title
        this.points = this.add
            .text(canvasWidth / 2, canvasHeight / 4, this.score, {
                fontFamily: '"Press Start 2P"',
                fontSize: '48px',
                fill: '#fff',
            })
            .setOrigin(0.25) // Center the text
            .setDepth(2);

        // Create the bird sprite (using 'bird_up' as the initial frame)
        this.bird = this.physics.add
            .sprite(canvasWidth / 2, canvasHeight / 2, 'bird_up')
            .setScale(0.3);

        // Create the bird flapping animation from the 3 frames
        this.anims.create({
            key: 'gameFlap',
            frames: [
                { key: 'bird_up' },
                { key: 'bird_middle' },
                { key: 'bird_down' },
            ],
            frameRate: 10, // 10 frames per second
            repeat: -1, // Repeat the animation forever (infinite loop)
        });

        // Play the flapping animation
        this.bird.play('gameFlap');

        this.bird.setCollideWorldBounds(true);

        // Add gravity to the bird
        this.bird.body.gravity.y = 1000;

        // Add spacebar input
        this.spacebar = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        // Create a group to hold the pipes
        this.pipes = this.physics.add.group({
            immovable: true, // Pipes won't be affected by physics
            allowGravity: false, // Pipes won't be affected by gravity
        });

        // Call `addPipePair` every 1.5 seconds
        this.time.addEvent({
            delay: 1500, // Time in milliseconds
            callback: this.addPipePair,
            callbackScope: this,
            loop: true, // Loop to keep adding pipes
        });

        // Collision between bird and ground
        this.physics.add.collider(
            this.bird,
            this.physics.world.bounds,
            this.hitGround,
            null,
            this
        );
    }

    update() {
        if (this.gameState === GameState.Running && !this.paused) {
            // Check if spacebar is pressed
            if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
                this.bird.setVelocityY(-350);
                this.bird.angle = -30;
            }

            if (this.bird.body.velocity.y > 0) {
                this.bird.angle = Math.min(this.bird.body.velocity.y * 0.2, 90);
            }

            // Iterate over the pipes to check if the bottom pipe has passed the bird's x-position
            this.pipes.children.iterate((pipe) => {
                if (
                    pipe &&
                    !pipe.passed &&
                    pipe.texture.key === 'pipeBottom' &&
                    pipe.x < this.bird.x
                ) {
                    this.score += 1; // Increment score by 1 when bird passes a bottom pipe
                    pipe.passed = true; // Mark the pipe as passed

                    // Update the score display
                    this.points.setText(this.score);
                }
            });

            // Remove pipes that have gone off-screen
            this.pipes.children.iterate((pipe) => {
                if (pipe && pipe.x + pipe.width < 0) {
                    this.pipes.remove(pipe, true, true); // Remove the pipe from the scene
                }
            });
        }
    }

    addPipePair() {
        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;

        const pipeGap = 150; // Gap between the top and bottom pipe
        const minPipeHeight = 50; // Minimum height of the top pipe
        const maxPipeHeight = canvasHeight * 0.75 - pipeGap - minPipeHeight; // Maximum height

        const pipeTopHeight = Phaser.Math.Between(minPipeHeight, maxPipeHeight);
        const pipeScale = 0.1; // Adjust this to make the pipes bigger or smaller

        // Add top pipe
        const topPipe = this.pipes.create(
            canvasWidth,
            pipeTopHeight,
            'pipeTop'
        );

        topPipe.setOrigin(0.5, 1);
        topPipe.setScale(pipeScale);
        topPipe.setSize(topPipe.width, topPipe.height);
        topPipe.body.velocity.x = -200;
        topPipe.passed = false; // Initialize the passed property

        // Add bottom pipe
        const bottomPipe = this.pipes.create(
            canvasWidth,
            pipeTopHeight + pipeGap,
            'pipeBottom'
        );
        bottomPipe.setOrigin(0.5, 0);
        bottomPipe.setScale(pipeScale);
        bottomPipe.body.velocity.x = -200;
        bottomPipe.passed = false; // Initialize the passed property

        // Set a property to track the pipe pair
        topPipe.pair = bottomPipe; // Link the top pipe to the bottom pipe
        bottomPipe.pair = topPipe; // Link the bottom pipe to the top pipe

        // Add collision detection between bird and pipes
        this.physics.add.collider(
            this.bird,
            this.pipes,
            this.hitPipe,
            null,
            this
        );
    }

    hitPipe() {
        // Handle what happens when the bird hits a pipe
        this.gameState = GameState.PlayerLost;
        this.bird.body.velocity.y = 0; // Stop upward movement
        this.bird.setVelocityY(300); // Make the bird fall
        this.bird.angle = 90; // Make the bird face down

        // Pause the background scene
        // this.scene.get('background').pause();

        // After a short delay, end the game
        this.time.delayedCall(1000, this.endGame, [], this);
    }

    hitGround() {
        // If the bird hits the ground, end the game
        this.gameState = GameState.PlayerLost;
        // After a short delay, end the game
        this.time.delayedCall(1000, this.endGame, [], this);
    }

    endGame() {
        if (this.gameState !== GameState.Running) {
            // Show the game over / win screen
            this.scene.start('gameOver', {
                playerScore: this.score, // Send the player's score to the game over scene
            });
        }
    }
}
