import React from 'react';
import Phaser from 'phaser';
import GameComponent from './GameComponent';
import TitleScreen from './scenes/TitleScreen';
import Game from './scenes/Game';
import GameBackground from './scenes/GameBackground';
import GameOver from './scenes/GameOver';

import './Phaser.css';

const PhaserConfig = () => {
    const config = {
        type: Phaser.AUTO,
        parent: 'phaser-container',
        width: '100%',
        height: '100%',
        scene: [TitleScreen, Game, GameBackground, GameOver],
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
    };

    // This will force a page refresh when this file is updated
    if (import.meta.hot) {
        import.meta.hot.accept(() => {
            window.location.reload();
        });
    }

    return (
        <div className='game-container'>
            <GameComponent config={config} />
        </div>
    );
};

export default PhaserConfig;
