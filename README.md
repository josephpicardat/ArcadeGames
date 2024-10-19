# Arcade Games in React

This project is a simple implementation of the classic arcade games like Pong and Snake built using React. These games are implemented using Phaser.js

## Table of Contents

-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Game Controls](#game-controls)
-   [Win Condition](#win-condition)
-   [Customization](#customization)
-   [Contributors](#Contributors)
-   [License](#license)

## Features

-   Two-player Pong game with basic physics.
-   Paddle and ball movement.
-   Score tracking and display.
-   Overlay to indicate the winner and provide a "Play Again" option.
-   The game restarts after a player wins.
-   Responsive layout using percentage-based dimensions.

## Installation

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/yourusername/ArcadeGames.git
    ```

2. Navigate to the project directory:

    ```bash
    cd ArcadeGames
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

5. Open your browser and navigate to `http://localhost:5173` to play the game.

## Usage

Once the application is running, players can start playing immediately. All games start using the space bar and can be played with the arrow keys. With the eception of Flappy Bird which uses the space bar to fly.

## Game Controls

-   **Pong**:

    -   Move Up: `Up Arrow`
    -   Move Down: `Down Arrow`

-   **Snake**:

    -   Move Up: `Up Arrow`
    -   Move Down: `Down Arrow`
    -   Move Left: `Left Arrow`
    -   Move Right: `Right Arrow`
    -   Pause: `Escape`

-   **Flappy Bird**:

    -   Fly: `Spacebar`

## Win Condition

-   **Pong**

    -   When the user scores 11 points they win or lose if the bot scores 11 points.

-   **Snake**

    -   The user wins once they eat all of the food.

-   **Flappy Bird**

    -   There is no winning, just pain.

## Contributors:

-   AI Arcade Art made by [Vecteezy](https://www.vecteezy.com/free-photos/arcade-screen)

## Technologies

-   React: The library used for building the user interface.
-   Material-UI: Provides UI components and styling.
-   Vite: A fast build tool and development server that significantly speeds up the development process with fast hot module replacement (HMR) and optimized builds. Vite serves the application with fast, unbundled development and produces highly optimized production builds.
-   Phaser.js: Library used for building game elements

## License

![License](https://img.shields.io/badge/License-MIT-yellow.svg)
(https://opensource.org/licenses/MIT)

Copyright 2024 Joseph Picardat

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
