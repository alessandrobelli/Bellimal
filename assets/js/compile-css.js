// This script is for development use only
// Run this script to manually compile the CSS when updating the theme

// Check if running in a browser environment
if (typeof window !== 'undefined') {
    console.log('This script is meant to be run in a Node.js environment, not in the browser.');
} else {
    const { execSync } = require('child_process');
    const path = require('path');
    
    try {
        console.log('Compiling CSS with Tailwind...');
        const rootDir = path.resolve(__dirname, '../..');
        const command = `cd "${rootDir}" && npx tailwindcss -i ./assets/css/input.css -o ./assets/css/main.css`;
        
        execSync(command, { stdio: 'inherit' });
        console.log('CSS compilation complete!');
    } catch (error) {
        console.error('Error compiling CSS:', error);
        process.exit(1);
    }
}