import { useState, useEffect } from 'react';
import trophy from '../assets/trophy.png';
import timer from '../assets/timer.png';
import RefreshIcon from '@mui/icons-material/Refresh';

const MinesweeperGameOver = ({
    timeTaken,
    winCondition,
    difficulty,
    onRestart,
}) => {
    const [bestTime, setBestTime] = useState(null);

    useEffect(() => {
        const storedBestTime = localStorage.getItem(`bestTime+${difficulty}`);
        if (storedBestTime) {
            setBestTime(storedBestTime);
        }

        if (winCondition) {
            if (!storedBestTime || timeTaken < storedBestTime) {
                localStorage.setItem(`bestTime_${difficulty}`, timeTaken);
                setBestTime(timeTaken);
            }
        }
    }, [timeTaken, winCondition, difficulty]);

    let playerWon;
    console.log(winCondition);
    if (winCondition === 'player-won') {
        playerWon = true;
    }

    const handleRestart = () => {
        onRestart(difficulty);
    };

    return (
        <div className='gameOverContainer'>
            <div className='timeContainer'>
                <div className='internalTime'>
                    <img
                        src={timer}
                        alt='timer'
                        className='gameOverImages'
                    />
                    <div className='timeData'>
                        {playerWon ? timeTaken : '---'}
                    </div>
                </div>
                <div className='internalTime'>
                    <img
                        src={trophy}
                        alt='trophy'
                        className='gameOverImages'
                    />
                    <div className='timeData'>{bestTime || '---'} </div>
                </div>
            </div>
            <button
                onClick={handleRestart}
                className='buttonStyle'>
                <RefreshIcon
                    sx={{
                        width: '30px',
                        height: 'auto',
                        verticalAlign: 'middle',
                        margin: '0 16px 2px 0',
                    }}
                />
                Play Again
            </button>
        </div>
    );
};

export default MinesweeperGameOver;
