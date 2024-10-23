import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

export default function DropdownMenu({ setGameDifficulty }) {
    // Use state to track difficulty
    const [difficulty, setDifficulty] = useState(10); // Default is Easy (10)

    // Function to handle dropdown value change
    const handleChange = (event) => {
        const newDifficulty = event.target.value;
        setDifficulty(newDifficulty);
    };

    console.log('inside dropdown menu');

    // Trigger game difficulty change when dropdown value changes
    useEffect(() => {
        // Call the function to set the game difficulty
        if (setGameDifficulty) {
            setGameDifficulty(difficulty);
        }
    }, [difficulty, setGameDifficulty]);
    return (
        <Box
            sx={{
                minWidth: 120,
                position: 'relative', // Ensure relative positioning to control z-index
                zIndex: 100,
                backgroundColor: '#fff', // Dropdown background color
                color: '#000', // Text color
                borderRadius: '4px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add some shadow for better visibility
            }}>
            <FormControl fullWidth>
                {/* <InputLabel
                    variant='standard'
                    htmlFor='dropdown-container'>
                    Difficulty
                </InputLabel> */}
                <NativeSelect
                    value={difficulty}
                    onChange={handleChange}
                    inputProps={{
                        name: 'difficulty',
                        id: 'dropdown-container',
                    }}
                    sx={{
                        color: '#000', // Dropdown text color
                        backgroundColor: '#fff', // Dropdown background color
                        '&:focus': {
                            backgroundColor: '#fff', // Ensure background stays white on focus
                        },
                    }}>
                    <option value={10}>Easy</option>
                    <option value={20}>Medium</option>
                    <option value={30}>Hard</option>
                </NativeSelect>
            </FormControl>
        </Box>
    );
}
