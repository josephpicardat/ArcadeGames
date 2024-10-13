import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import GameComponent from './GameComponent';
import TitleScreen from './scenes/TitleScreen';
import Game from './scenes/Game';
import GameBackground from './scenes/GameBackground';
import GameOver from './scenes/GameOver';
import PauseScene from './scenes/PauseScene';

import './Phaser.css';

const PhaserConfig = () => {
    const config = {
        type: Phaser.AUTO,
        parent: 'phaser-container',
        width: '100%',
        height: '100%',
        transparent: true,
        scene: [TitleScreen, Game, GameBackground, GameOver, PauseScene],
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
            },
        },
        scale: {
            mode: Phaser.Scale.RESIZE, // or Phaser.Scale.FIT
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        dom: {
            createContainer: true,
        },
    };

    // This will force a page refresh when this file is updated
    if (import.meta.hot) {
        import.meta.hot.accept(() => {
            window.location.reload();
        });
    }

    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            // You can now access the container dimensions or manipulate it
            let width = container.offsetWidth;
            let height = container.offsetHeight;

            // Ensure both width and height are even
            if (width % 2 !== 0) {
                width -= 1; // Make the width even
            }
            if (height % 2 !== 0) {
                height -= 1; // Make the height even
            }

            // Apply the updated width and height to the container
            container.style.width = `${width}px`;
            container.style.height = `${height}px`;
        }
    }, []);

    return (
        <div
            className='game-container'
            ref={containerRef}>
            <GameComponent config={config} />
        </div>
    );
};

export default PhaserConfig;
