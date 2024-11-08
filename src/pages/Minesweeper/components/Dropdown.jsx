import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function DropdownMenu({ setGameDifficulty }) {
    // Use state to track difficulty
    const [difficulty, setDifficulty] = useState(10); // Default is Easy (10)

    // Function to handle dropdown value change
    const handleChange = (event) => {
        const newDifficulty = event.target.value;
        setDifficulty(newDifficulty);
    };

    // Trigger game difficulty change when dropdown value changes
    useEffect(() => {
        // Call the function to set the game difficulty
        if (setGameDifficulty) {
            setGameDifficulty(difficulty);
        }
    }, [difficulty, setGameDifficulty]);
    return (
        <Box
            className='dropdown-menu'
            sx={{
                minWidth: 120,
                position: 'relative', // Ensure relative positioning to control z-index
                zIndex: 100,
                backgroundColor: '#fff', // Dropdown background color
                color: '#000', // Text color
                borderRadius: '4px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add some shadow for better visibility
            }}>
            <FormControl
                variant='filled'
                fullWidth>
                <InputLabel id='difficulty-select-label'>Difficulty</InputLabel>
                <Select
                    labelId='difficulty-select-label'
                    id='difficulty-select'
                    inputProps={{
                        name: 'difficulty',
                        id: 'dropdown-container',
                    }}
                    value={difficulty}
                    label='Age'
                    onChange={handleChange}>
                    <MenuItem value={10}>Easy</MenuItem>
                    <MenuItem value={20}>Medium</MenuItem>
                    <MenuItem value={30}>Hard</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}
