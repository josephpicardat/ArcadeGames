import { Component } from 'react';
import { debounce } from 'radash';
import Paddle from './Paddle';
import Ball from './Ball';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameState: 'start',
            ballPosition: { x: 50, y: 50 },
            ballVelocity: { x: 1, y: 1 },
            leftPaddleY: 45,
            rightPaddleY: 45,
            keys: {},
            player1: 0,
            player2: 0,
            winner: null, // New state for storing the winner
        };

        this.moveSpeed = 2;
        this.ballSpeed = 1 / 2;
        this.paddleHeight = 20;
        this.paddleWidth = 2;
        this.restartFlag = false; // Flag to prevent multiple restarts
        this.lastScoredAt = 0; // Timestamp of the last score update
        this.scoreDelay = 1000; // Delay in milliseconds
    }

    componentDidMount() {
        this.startGameLoop();
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    componentWillUnmount() {
        clearInterval(this.gameLoop);
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }

    startGameLoop = () => {
        if (this.gameLoop) {
            clearInterval(this.gameLoop); // Clear any existing interval
        }
        this.gameLoop = setInterval(() => {
            if (this.state.gameState === 'running') {
                this.updateGame();
            }
        }, 16);
    };

    updateGame = () => {
        if (this.state.gameState === 'running') {
            this.updatePaddles();

            this.updateBall();
        }
    };

    updatePaddles = () => {
        const { keys, leftPaddleY, rightPaddleY } = this.state;
        const containerHeight = 100;
        const paddleHeightPercent = this.paddleHeight;
        this.setState({
            leftPaddleY: Math.max(
                0,
                Math.min(
                    containerHeight - paddleHeightPercent,
                    leftPaddleY +
                        (keys.w ? -this.moveSpeed : 0) +
                        (keys.s ? this.moveSpeed : 0)
                )
            ),
            rightPaddleY: Math.max(
                0,
                Math.min(
                    containerHeight - paddleHeightPercent,
                    rightPaddleY +
                        (keys.ArrowUp ? -this.moveSpeed : 0) +
                        (keys.ArrowDown ? this.moveSpeed : 0)
                )
            ),
        });
    };

    // Function to update the ball's position and handle collisions
    updateBall = () => {
        this.setState((prevState) => {
            const { ballPosition, ballVelocity } = prevState;
            const { x, y } = ballPosition;
            const { x: vx, y: vy } = ballVelocity;

            let newX = x + vx * this.ballSpeed;
            let newY = y + vy * this.ballSpeed;

            const collisionResult = this.checkCollisions(newX, newY, vx, vy);
            newX = collisionResult.newX;
            newY = collisionResult.newY;

            // Ball out of bounds (left or right)
            const now = Date.now();
            if (
                (newX <= 0 || newX >= 100 - 2) &&
                now - this.lastScoredAt > this.scoreDelay
            ) {
                this.lastScoredAt = now; // Update the last scored timestamp
                const scoringSide = newX <= 0 ? 'player2' : 'player1';

                setTimeout(() => {
                    this.updateScore(scoringSide); // Update score after delay
                }, this.scoreDelay);

                return {
                    ballPosition: { x: 50, y: 50 }, // Reset ball position immediately
                    ballVelocity: { x: 0, y: 0 }, // Reset ball velocity
                };
            }

            return {
                ballPosition: { x: newX, y: newY },
                ballVelocity: collisionResult.newVelocity,
            };
        });
    };

    checkCollisions = (newX, newY, vx, vy) => {
        const { leftPaddleY, rightPaddleY } = this.state;
        const paddleWidthPercent = this.paddleWidth;
        const paddleHeightPercent = this.paddleHeight;
        const ballSizePercent = 2;

        // Wall collision (top and bottom)
        if (newY <= 0 || newY >= 100 - ballSizePercent) {
            vy *= -1;
            newY = newY <= 0 ? 0 : 100 - ballSizePercent;
        }

        // Left paddle collision
        if (newX <= paddleWidthPercent) {
            const paddleTop = leftPaddleY;
            const paddleBottom = leftPaddleY + paddleHeightPercent;

            if (newY + ballSizePercent >= paddleTop && newY <= paddleBottom) {
                const reflection = this.calculateReflection(
                    leftPaddleY,
                    newY + ballSizePercent / 2
                );
                vx = Math.abs(reflection.x);
                vy = reflection.y;
                newX = paddleWidthPercent; // Adjust to prevent sticking in corner
            }
        }

        // Right paddle collision
        if (newX >= 100 - paddleWidthPercent - ballSizePercent) {
            const paddleTop = rightPaddleY;
            const paddleBottom = rightPaddleY + paddleHeightPercent;

            if (newY + ballSizePercent >= paddleTop && newY <= paddleBottom) {
                const reflection = this.calculateReflection(
                    rightPaddleY,
                    newY + ballSizePercent / 2
                );
                vx = -Math.abs(reflection.x);
                vy = reflection.y;
                newX = 100 - paddleWidthPercent - ballSizePercent; // Adjust to prevent sticking in corner
            }
        }

        return {
            newX,
            newY,
            newVelocity: { x: vx, y: vy },
        };
    };

    // // Function to update the score based on which side scored
    // updateScore = (scoringSide) => {
    //     this.setState((prevState) => ({
    //         [scoringSide + 'Score']: prevState[scoringSide + 'Score'] + 1,
    //     }));
    // };

    // Function to calculate the reflection angle of the ball after it hits a paddle
    calculateReflection = (paddleY, ballCenterY) => {
        const paddleHeightPercent = this.paddleHeight;
        const relativeIntersectY =
            ballCenterY - (paddleY + paddleHeightPercent / 2);
        const normalizedRelativeIntersectionY =
            relativeIntersectY / (paddleHeightPercent / 2);
        const bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 4); // 45 degrees max angle

        const speed = 1.05; // Optional: Increase ball speed after each hit
        return {
            x: Math.cos(bounceAngle) * speed,
            y: Math.sin(bounceAngle) * speed,
        };
    };

    handleKeyDown = (e) => {
        const { gameState } = this.state;
        if (e.key === 'Escape') {
            this.setState((prevState) => ({
                gameState:
                    prevState.gameState === 'running' ? 'paused' : 'running',
            }));
        }
        this.setState((prevState) => ({
            keys: { ...prevState.keys, [e.key]: true },
        }));
    };

    handleKeyUp = (e) => {
        this.setState((prevState) => ({
            keys: { ...prevState.keys, [e.key]: false },
        }));
    };

    handleStart = () => {
        // this.restartFlag = false; // Reset flag
        this.setState({ gameState: 'running', winner: null });
    };

    handlePause = () => this.setState({ gameState: 'paused' });
    handleResume = () => this.setState({ gameState: 'running' });

    // Function to reset the game after a point is scored
    updateScore = (scoringSide) => {
        let newScore;
        console.log('Resetting game...');
        if (scoringSide === 'player1') {
            newScore = this.state.player1 + 1;
        } else {
            newScore = this.state.player2 + 1;
        }
        const winner =
            newScore >= 11
                ? scoringSide === 'player1'
                    ? 'Player One'
                    : 'Player Two'
                : null;
        if (winner !== null) {
            console.log(`${winner} won!`);
        }
        console.log(winner);
        let finalGameState;
        if (winner !== null) {
            finalGameState = 'gameOver'; // Set game state to 'gameover' if there's a winner
        } else {
            finalGameState = 'resetting';
        }
        console.log(finalGameState);
        setTimeout(() => {
            this.setState({
                [scoringSide]: newScore,
                gameState: finalGameState,
                winner: winner,
            });
        }, 0); // 0ms delay still defers the update to the next event loop cycle
        console.log(this.state.gameState);
        console.log(this.state.winner);
        setTimeout(() => {
            if (this.state.winner === null) {
                this.setState({
                    gameState: 'running',
                    ballVelocity: { x: 1, y: 1 },
                    leftPaddleY: 45,
                    rightPaddleY: 45,
                });
            }
        }, 0); // Wait for 2 seconds before starting again
    };

    handleRestart = () => {
        // Use a slight delay to avoid synchronous update issues
        setTimeout(() => {
            this.setState({
                restartFlag: true,
                player1: 0,
                player2: 0,
                winner: null,
            });
        }, 0); // 0ms delay still defers the update to the next event loop cycle
    };

    componentDidUpdate(prevProps, prevState) {
        // Check if restartFlag was set and handle the reset
        if (this.state.restartFlag && !prevState.restartFlag) {
            this.setState({
                ballPosition: { x: 50, y: 50 },
                ballVelocity: { x: 1, y: 1 },
                leftPaddleY: 45,
                rightPaddleY: 45,
                gameState: 'start',
                restartFlag: false, // Reset the flag
            });
        }
    }

    render() {
        const { player1, player2, gameState, winner } = this.state;
        if (gameState === 'gameOver') {
            console.log(gameState);
        }
        return (
            <div className='gameContainer'>
                <div className='dashedLine'></div>
                <div className='counter'>
                    <div>{player1.toString().padStart(2, '0')}</div>
                    <div>{player2.toString().padStart(2, '0')}</div>
                </div>
                {gameState === 'start' && (
                    <div className='overlay'>
                        <h1 className='text'>Pong Game</h1>
                        <button onClick={this.handleStart} className='button'>
                            Start Game
                        </button>
                    </div>
                )}
                {gameState === 'paused' && (
                    <div className='overlay'>
                        <h1 className='text'>Paused</h1>
                        <button onClick={this.handleResume} className='button'>
                            Resume
                        </button>
                        <button onClick={this.handleRestart} className='button'>
                            Restart
                        </button>
                    </div>
                )}
                <Paddle position={this.state.leftPaddleY} side='left' />
                <Paddle position={this.state.rightPaddleY} side='right' />
                <Ball position={this.state.ballPosition} />
                {gameState === 'running' && (
                    <button onClick={this.handlePause} className='pauseButton'>
                        Pause
                    </button>
                )}
                {winner !== null && (
                    <div className='overlay'>
                        <h1 className='text'>{this.state.winner} Wins!</h1>
                        <button onClick={this.handleRestart} className='button'>
                            Restart
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default Game;
