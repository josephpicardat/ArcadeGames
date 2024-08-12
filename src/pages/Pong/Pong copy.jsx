import { useState, useEffect } from 'react';
import Paddle from './Paddle';
import Ball from './Ball';
import './Pong.css';

const Pong = () => {
    const [gameState, setGameState] = useState('start'); // 'start', 'running', 'paused'
    const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 });
    const [ballDirection, setBallDirection] = useState({ x: 1, y: 1 });
    const [leftPaddleY, setLeftPaddleY] = useState(45);
    const [rightPaddleY, setRightPaddleY] = useState(45);
    const [leftPaddleMove, setLeftPaddleMove] = useState(null);
    const [rightPaddleMove, setRightPaddleMove] = useState(null);

    const moveSpeed = 2; // Adjust the speed of paddle movement
    const paddleHeight = 20; // Paddle height in percentage
    const ballSpeed = 1 / 2; // Adjust the speed of the ball
    const paddleWidth = 2; // Paddle width in percentage

    // Function to calculate the angle of reflection
    const calculateReflection = (paddleY, hitY) => {
        const relativeIntersectY =
            (hitY - paddleY - paddleHeight / 2) / (paddleHeight / 2);
        const angle = (relativeIntersectY * Math.PI) / 4; // Max bounce angle = 45 degrees
        return { x: Math.cos(angle), y: Math.sin(angle) };
    };

    // Game loop effect
    useEffect(() => {
        if (gameState === 'running') {
            const gameLoop = setInterval(() => {
                setBallPosition((prevPosition) => {
                    let newX = prevPosition.x + ballDirection.x * ballSpeed;
                    let newY = prevPosition.y + ballDirection.y * ballSpeed;

                    // Wall collision
                    if (newY <= 0 || newY >= 97) {
                        // Reflect at a 45-degree angle from the walls
                        const reflectionAngle = Math.PI / 4;
                        setBallDirection((prevDirection) => ({
                            x: -prevDirection.x,
                            y: -Math.sin(reflectionAngle),
                        }));
                        newY = prevPosition.y; // Prevent the ball from getting stuck in the wall
                    }

                    // Left paddle collision
                    if (
                        newX <= paddleWidth &&
                        newY >= leftPaddleY &&
                        newY <= leftPaddleY + paddleHeight
                    ) {
                        const reflection = calculateReflection(
                            leftPaddleY,
                            newY
                        );
                        setBallDirection({
                            x: Math.abs(reflection.x),
                            y: reflection.y,
                        });
                        newX = paddleWidth; // Adjust position to avoid sticking
                    }
                    // Right paddle collision
                    else if (
                        newX >= 100 - paddleWidth &&
                        newY >= rightPaddleY &&
                        newY <= rightPaddleY + paddleHeight
                    ) {
                        const reflection = calculateReflection(
                            rightPaddleY,
                            newY
                        );
                        setBallDirection({
                            x: -Math.abs(reflection.x),
                            y: reflection.y,
                        });
                        newX = 100 - paddleWidth; // Adjust position to avoid sticking
                    }

                    // Check if ball goes out of bounds (left or right)
                    if (newX <= 0 || newX >= 100) {
                        handleRestart(); // Restart the game or handle scoring
                    }

                    return { x: newX, y: newY };
                });

                // Move left paddle
                if (leftPaddleMove === 'up') {
                    setLeftPaddleY((prev) => Math.max(prev - moveSpeed, 0));
                } else if (leftPaddleMove === 'down') {
                    setLeftPaddleY((prev) =>
                        Math.min(prev + moveSpeed, 100 - paddleHeight * 0.75)
                    );
                }

                // Move right paddle
                if (rightPaddleMove === 'up') {
                    setRightPaddleY((prev) => Math.max(prev - moveSpeed, 0));
                } else if (rightPaddleMove === 'down') {
                    setRightPaddleY((prev) =>
                        Math.min(prev + moveSpeed, 100 - paddleHeight * 0.75)
                    );
                }
            }, 16); // ~60 frames per second

            return () => clearInterval(gameLoop);
        }
    }, [gameState, ballDirection, leftPaddleMove, rightPaddleMove]);

    // Handle paddle movement and pause with 'Escape'
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameState === 'running') {
                if (e.key === 'ArrowUp') {
                    setRightPaddleMove('up');
                } else if (e.key === 'ArrowDown') {
                    setRightPaddleMove('down');
                } else if (e.key === 'w') {
                    setLeftPaddleMove('up');
                } else if (e.key === 's') {
                    setLeftPaddleMove('down');
                }
            }

            if (e.key === 'Escape') {
                setGameState(gameState === 'running' ? 'paused' : gameState);
            }
        };

        const handleKeyUp = (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                setRightPaddleMove(null);
            } else if (e.key === 'w' || e.key === 's') {
                setLeftPaddleMove(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameState]);

    const handleStart = () => setGameState('running');
    const handlePause = () => setGameState('paused');
    const handleResume = () => setGameState('running');
    const handleRestart = () => {
        setBallPosition({ x: 50, y: 50 });
        setBallDirection({ x: 1, y: 1 });
        setLeftPaddleY(50);
        setRightPaddleY(50);
        setGameState('start');
    };

    return (
        <div className='gameContainer'>
            {gameState === 'start' && (
                <div className='overlay'>
                    <h1 className='text'>Pong Game</h1>
                    <button onClick={handleStart} className='button'>
                        Start Game
                    </button>
                </div>
            )}
            {gameState === 'paused' && (
                <div className='overlay'>
                    <h1 className='text'>Paused</h1>
                    <button onClick={handleResume} className='button'>
                        Resume
                    </button>
                    <button onClick={handleRestart} className='button'>
                        Restart
                    </button>
                </div>
            )}
            <Paddle position={leftPaddleY} side='left' />
            <Paddle position={rightPaddleY} side='right' />
            <Ball position={ballPosition} />
            {gameState === 'running' && (
                <button onClick={handlePause} className='pauseButton'>
                    Pause
                </button>
            )}
        </div>
    );
};

export default Pong;
