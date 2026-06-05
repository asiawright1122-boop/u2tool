const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const logPath = path.join(__dirname, '../../qa_production.log');
const monitorPath = path.join(__dirname, 'monitor.js');

// 1. Clean up old log file
if (fs.existsSync(logPath)) {
  try {
    fs.unlinkSync(logPath);
    console.log('Cleaned up old qa_production.log');
  } catch (err) {
    console.error('Failed to delete old log file:', err);
  }
}

// 2. Spawn the monitor script in background
console.log('Spawning monitor.js in background...');
const monitor = spawn('node', [monitorPath], {
  detached: true,
  stdio: 'inherit'
});
monitor.unref();

// 3. Run production validation with environment variable and redirect output to qa_production.log
console.log('Starting qa:production validation...');
const logFile = fs.openSync(logPath, 'w');
const qa = spawn('npm', ['run', 'qa:production'], {
  cwd: path.join(__dirname, '../..'),
  env: { ...process.env, PROD_BASE_URL: 'http://127.0.0.1:4321' },
  stdio: ['ignore', logFile, logFile]
});

qa.on('close', (code) => {
  console.log(`qa:production finished with exit code ${code}`);
  process.exit(code);
});
