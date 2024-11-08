import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import Game from './scenes/Game';
import GameBackground from './scenes/GameBackground';
import GameOver from './scenes/GameOver';
import PauseScene from './scenes/PauseScene';

import './Minesweeper.css';

const MinesweeperConfig = () => {
    const containerRef = useRef(null);
    const gameRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;

        if (container) {
            let width = container.offsetWidth;
            let height = container.offsetHeight;

            if (width % 2 !== 0) width -= 1;
            if (height % 2 !== 0) height -= 1;

            // Apply the updated width and height to the container
            container.style.width = `${width}px`;
            container.style.height = `${height}px`;

            const gridSize = 32;

            // Adjust canvas dimensions to be divisible by grid size
            const canvasWidth = Math.floor(width / gridSize) * gridSize;
            const canvasHeight = Math.floor(height / gridSize) * gridSize;

            const config = {
                type: Phaser.AUTO,
                parent: container,
                width: canvasWidth,
                height: canvasHeight,
                scene: [Game, PauseScene, GameBackground, GameOver],
                transparent: true,
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 0 },
                    },
                },

                scale: {
                    mode: Phaser.Scale.RESIZE,
                    autoCenter: Phaser.Scale.CENTER_BOTH,
                },
                dom: {
                    createContainer: true,
                },
            };

            if (gameRef.current) {
                gameRef.current.destroy(true);
            }

            gameRef.current = new Phaser.Game(config);

            // gameRef.current.scene.start('titleScreen');
        }

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
            }
        };
    }, []);

    // This will force a page refresh when this file is updated
    if (import.meta.hot) {
        import.meta.hot.accept(() => {
            window.location.reload();
        });
    }

    return (
        <div
            className='game-container'
            ref={containerRef}></div>
    );
};

export default MinesweeperConfig;
