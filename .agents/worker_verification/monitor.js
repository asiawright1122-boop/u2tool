const fs = require('fs');
const path = require('path');
const logPath = path.join(__dirname, '../../qa_production.log');
const restartLog = path.join(__dirname, 'preview_restart.log');

console.log('Monitor started. Watching log file:', logPath);

let restarted = false;
let interval = setInterval(() => {
  if (fs.existsSync(logPath)) {
    const content = fs.readFileSync(logPath, 'utf8');
    // 如果发现 build 已经 Complete 并且还没有重启过
    if (!restarted && (content.includes('[build] Complete!') || content.includes('Server built in'))) {
      restarted = true;
      clearInterval(interval);
      console.log('Detected build Complete. Initiating preview server restart...');
      
      const execSync = require('child_process').execSync;
      // 1. 杀死 4321 端口的旧进程
      try {
        console.log('Killing processes on port 4321...');
        execSync('lsof -t -i :4321 | xargs kill -9', { stdio: 'ignore' });
      } catch (e) {
        console.log('No processes found on port 4321 or kill failed, proceeding...');
      }
      
      // 等待 1 秒以确保端口释放
      setTimeout(() => {
        // 2. 重新拉起 preview 服务器
        try {
          console.log('Spawning new preview server...');
          const out = fs.openSync(restartLog, 'w');
          const child = require('child_process').spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1'], {
            cwd: path.join(__dirname, '../..'),
            detached: true,
            stdio: ['ignore', out, out]
          });
          child.unref();
          console.log('Preview server spawned in background. Logs redirected to:', restartLog);
          process.exit(0);
        } catch (err) {
          console.error('Failed to spawn preview server:', err);
          process.exit(1);
        }
      }, 1000);
    }
  }
}, 500);
