import Phaser from 'phaser';
import { createRoot } from 'react-dom/client';
import MinesweeperGameOver from '../components/MinesweeperGameOver'; // Import your React component

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
        this.root = null; // Initialize root
        this.gameOverContainer = null; // Initialize container
    }

    create(data) {
        // Create a DOM element to display the game over screen
        this.gameOverContainer = document.createElement('div');
        this.gameOverContainer.className = 'gameOverContainer';
        document.body.appendChild(this.gameOverContainer); // Append the container to the body

        // Create a root for rendering the React component
        this.root = createRoot(this.gameOverContainer);

        // Render the MinesweeperGameOver component into the DOM using the root
        this.root.render(
            <MinesweeperGameOver
                timeTaken={data.timeTaken}
                winCondition={data.winCondition}
                difficulty={data.difficulty}
                onRestart={() => this.handleRestart(data.difficulty)} // Pass difficulty to handleRestart
            />
        );
    }

    handleRestart = (difficulty) => {
        // Handle the restart by switching back to the game scene with the difficulty parameter
        this.root.unmount(); // Unmount the React component
        document.body.removeChild(this.gameOverContainer);
        this.scene.start('game', { difficulty }); // Pass difficulty as data
    };

    shutdown() {
        // Cleanup the DOM when the scene is shut down
        const container = document.querySelector('.gameOverContainer');
        if (container) {
            console.log('inside container');
            // Unmount the component and remove the container from the DOM
            const root = createRoot(container); // Create root to access the component
            root.unmount(); // Unmount the React component
            document.body.removeChild(container); // Remove the container
        }
    }
}

export default GameOverScene;
