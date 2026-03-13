const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = 8080;

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Start the backend server
const backend = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
    shell: true
});

backend.on('error', (err) => {
    console.error('Failed to start backend:', err);
});

app.listen(PORT, () => {
    console.log(`\n🚀 SmartWaste App is running!`);
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`Backend API: http://localhost:3000\n`);
});
