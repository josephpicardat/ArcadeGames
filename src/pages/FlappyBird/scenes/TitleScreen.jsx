import Phaser from 'phaser';
import wing_up from '../assets/wing_up.png';
import wing_down from '../assets/wing_down.png';
import wing_middle from '../assets/wing_middle.png';
import title from '../assets/title.png';
import WebFontFile from '../../PhaserPong/scenes/WebFontFile';

export default class TitleScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'titleScreen' });
    }

    preload() {
        const fonts = new WebFontFile(this.load, 'Press Start 2P');
        this.load.addFile(fonts);
        this.load.image('bird_down', wing_down);
        this.load.image('bird_middle', wing_middle);
        this.load.image('bird_up', wing_up);
        this.load.image('title', title);
    }

    create() {
        // Get the canvas dimensions
        const canvasWidth = this.cameras.main.width;
        const canvasHeight = this.cameras.main.height;

        this.scene.run('gameBackground');
        this.scene.sendToBack('gameBackground');

        this.scene.run('ground');
        this.scene.bringToTop('ground');
        // Create the bird sprite (using 'bird_up' as the initial frame)
        this.bird = this.add
            .sprite(canvasWidth / 2, canvasHeight / 2, 'bird_up')
            .setScale(0.3);

        // Create the bird flapping animation from the 3 frames
        this.anims.create({
            key: 'flap',
            frames: [
                { key: 'bird_up' },
                { key: 'bird_middle' },
                { key: 'bird_down' },
            ],
            frameRate: 10, // 10 frames per second
            repeat: -1, // Repeat the animation forever (infinite loop)
        });

        // Play the flapping animation
        this.bird.play('flap');

        // Display the game title
        this.titleText = this.add
            .text(canvasWidth / 2, canvasHeight / 4, 'Flappy Bird', {
                fontFamily: '"Press Start 2P"',
                fontSize: '48px',
                fill: '#fff',
            })
            .setOrigin(0.5); // Center the text

        const start = this.add.text(
            canvasWidth * 0.5,
            canvasHeight * 0.75,
            'Press Space to Start',
            {
                fontSize: '16px',
                fontFamily: '"Press Start 2P"',
                color: 'black',
            }
        );
        start.setOrigin(0.5, 0.5);

        // Make the bird hover up and down
        this.hoverTween = this.tweens.add({
            targets: this.bird,
            y: this.bird.y - 30, // Move the bird up by 30 pixels
            duration: 800, // Move over 800 milliseconds
            yoyo: true, // Move back down
            repeat: -1, // Repeat forever
            ease: 'Sine.easeInOut', // Smooth up-and-down movement
        });

        // Add spacebar input
        this.spacebar = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
    }

    update() {
        // On spacebar press, start the game
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            this.scene.start('game'); // Switch to the 'game' scene
        }
    }
}
