import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            fastRefresh: true, // Ensure this is true or left to its default
        }),
    ],
});
