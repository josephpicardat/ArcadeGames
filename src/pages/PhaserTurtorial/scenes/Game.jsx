import Phaser from 'phaser';
import WebFontFile from './WebFontFile';
import * as Colors from './Colors';

const GameState = {
    Running: 'running',
    PlayerWon: 'player-won',
    AIWon: 'ai-won',
};

export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'game' });
    }

    init() {
        this.gameState = GameState.Running;
        this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0);

        this.leftScore = 0;
        this.rightScore = 0;

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
        const canvasWidth = this.cameras.main.width + 200;
        const canvasHeight = this.cameras.main.height;

        this.physics.world.setBounds(-100, 0, canvasWidth, canvasHeight);

        // Ball Position and Size
        const ballX = canvasWidth * 0.5; // Center of the canvas
        const ballY = canvasHeight * 0.5; // Center of the canvas
        const ballRadius = 10; // Fixed size

        this.ball = this.add.circle(ballX, ballY, ballRadius, Colors.White, 1);
        this.physics.add.existing(this.ball);
        this.ball.body.setCircle(ballRadius);
        this.ball.body.setBounce(1, 1);
        this.ball.body.setCollideWorldBounds(true, 1, 1);

        // Paddle Positions and Sizes
        const paddleWidth = 10;
        const paddleHeight = 100;

        const paddleLeftX = 15;
        const paddleRightX = canvasWidth - 215;
        const paddleY = canvasHeight * 0.5; // Center vertically

        this.paddleLeft = this.add.rectangle(
            paddleLeftX,
            paddleY,
            paddleWidth,
            paddleHeight,
            Colors.White,
            1
        );
        this.physics.add.existing(this.paddleLeft);
        this.paddleLeft.body.immovable = true;
        this.paddleLeft.body.setCollideWorldBounds(true);

        this.paddleRight = this.add.rectangle(
            paddleRightX,
            paddleY,
            paddleWidth,
            paddleHeight,
            Colors.White,
            1
        );
        this.physics.add.existing(this.paddleRight);
        this.paddleRight.body.immovable = true;
        this.paddleRight.body.setCollideWorldBounds(true);

        this.physics.add.collider(
            this.paddleLeft,
            this.ball,
            this.hitPaddle,
            null,
            this
        );
        this.physics.add.collider(
            this.paddleRight,
            this.ball,
            this.hitPaddle,
            null,
            this
        );

        const scoreStyle = {
            fontSize: `${canvasHeight * 0.08}px`,
            fontFamily: '"Press Start 2P"',
        };
        const leftScoreX = canvasWidth * 0.3; // 30% from left
        const rightScoreX = canvasWidth * 0.7 - 200; // 70% from left

        this.leftScoreLabel = this.add
            .text(leftScoreX, canvasHeight * 0.1, '0', scoreStyle)
            .setOrigin(0.5, 0.5);

        this.rightScoreLabel = this.add
            .text(rightScoreX, canvasHeight * 0.1, '0', scoreStyle)
            .setOrigin(0.5, 0.5);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.time.delayedCall(1000, () => {
            this.resetBall();
        });
    }

    update() {
        if (this.gameState !== GameState.Running) {
            return;
        }

        this.handlePlayerInput();
        this.updateAI();
        this.checkScore();
    }

    handlePlayerInput() {
        /** @type {Phaser.Physics.Arcade.Body} */
        const body = this.paddleLeft.body;
        const paddleHeight = body.height; // Get the height of the paddle
        const canvasHeight = this.cameras.main.height; // Get the canvas height
        if (this.cursors.up.isDown) {
            // Check if the paddle is not at the top bound
            if (this.paddleLeft.y - paddleHeight / 2 > 0) {
                this.paddleLeft.y -= 5; // Move up
                body.updateFromGameObject(); // Update the physics body
            }
        } else if (this.cursors.down.isDown) {
            // Check if the paddle is not at the bottom bound
            if (this.paddleLeft.y + paddleHeight / 2 < canvasHeight) {
                this.paddleLeft.y += 5; // Move down
                body.updateFromGameObject(); // Update the physics body
            }
        }
    }

    hitPaddle(paddle, ball) {
        const paddleCenter = paddle.y; // Center of the paddle
        const ballY = ball.y; // Y position of the ball
        const hitPosition = ballY - paddleCenter; // Relative position of the hit

        // Calculate angle based on hit position
        const angle = (hitPosition / (paddle.height / 2)) * 75; // Scale the angle (75 degrees max)

        // Determine the new Y velocity based on the hit position
        const speed = 310; // Maintain the same speed
        let velocityY = speed * Math.sin(Phaser.Math.DegToRad(angle));
        // Set the new velocity based on which paddle was hit
        if (paddle === this.paddleLeft) {
            ball.body.setVelocity(speed, velocityY); // Right direction
        } else if (paddle === this.paddleRight) {
            ball.body.setVelocity(-speed, velocityY); // Left direction
        }
    }

    updateAI() {
        // AI Paddle
        const diff = this.ball.y - this.paddleRight.y;
        if (Math.abs(diff) < 10) {
            return;
        }

        const aiSpeed = 1;
        if (diff < 0) {
            // Ball is above the paddle
            this.paddleRightVelocity.y = -aiSpeed;
            if (this.paddleRightVelocity.y < -10) {
                this.paddleRightVelocity.y = -10;
            }
        } else if (diff > 0) {
            // Ball is below the paddle
            this.paddleRightVelocity.y = aiSpeed;
            if (this.paddleRightVelocity.y > 10) {
                this.paddleRightVelocity.y = 10;
            }
        }
        // Move the paddle
        this.paddleRight.y += this.paddleRightVelocity.y;

        // Boundary check for the paddle
        const paddleHeight = this.paddleRight.height; // Get the height of the paddle
        const canvasHeight = this.cameras.main.height; // Get the canvas height

        // Prevent moving out of bounds
        if (this.paddleRight.y - paddleHeight / 2 < 0) {
            this.paddleRight.y = paddleHeight / 2; // Reset to the top bound
        } else if (this.paddleRight.y + paddleHeight / 2 > canvasHeight) {
            this.paddleRight.y = canvasHeight - paddleHeight / 2; // Reset to the bottom bound
        }

        this.paddleRight.body.updateFromGameObject();
    }

    checkScore() {
        const x = this.ball.x;
        const canvasWidth = this.cameras.main.width;
        const leftBounds = -30;
        const rightBounds = canvasWidth + 30;
        if (x >= leftBounds && x < -rightBounds) {
            return;
        }

        if (x < leftBounds) {
            // Scored on the left side
            this.resetBall();
            this.incrementRightScore();
        } else if (x > rightBounds) {
            // Scored on the right side
            this.resetBall();
            this.incrementLeftScore();
        }

        const maxScore = 5;
        if (this.leftScore === maxScore) {
            this.gameState = GameState.PlayerWon;
        } else if (this.rightScore === maxScore) {
            this.gameState = GameState.AIWon;
        }
        if (this.gameState !== GameState.Running) {
            // Remove ball from physics world
            this.physics.world.remove(this.ball.body);

            this.scene.stop('gameBackground');

            // Show the game over / win screen
            this.scene.start('gameOver', {
                playerScore: this.leftScore,
                AIScore: this.rightScore,
            });
        }
    }

    incrementLeftScore() {
        this.leftScore += 1;
        this.leftScoreLabel.text = this.leftScore.toString();
    }

    incrementRightScore() {
        this.rightScore += 1;
        this.rightScoreLabel.text = this.rightScore.toString();
    }

    resetBall() {
        this.ball.setPosition(
            this.cameras.main.width * 0.5,
            this.cameras.main.height * 0.5
        );
        // Randomly choose to start from the left or right
        const startFromLeft = Math.random() < 0.5;

        let angle;
        if (startFromLeft) {
            angle = Phaser.Math.Between(157.5, 202.5);
        } else {
            angle = Phaser.Math.Between(-22.5, 22.5);
        }

        // Calculate velocity from the chosen angle
        const vec = this.physics.velocityFromAngle(angle, 400);

        this.ball.body.setVelocity(vec.x, vec.y);
    }
}
