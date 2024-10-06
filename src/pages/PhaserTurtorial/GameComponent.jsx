import { useEffect } from 'react';

const GameComponent = ({ config }) => {
    useEffect(() => {
        const game = new Phaser.Game(config);

        game.scene.start('titleScreen');

        // Cleanup on unmount
        return () => {
            game.destroy(true);
        };
    }, []);

    return <div id='phaser-container' />;
};

export default GameComponent;
