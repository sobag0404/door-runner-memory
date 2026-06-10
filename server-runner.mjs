import { spawn } from 'child_process';
import { createWriteStream } from 'fs';

const log = createWriteStream('/home/z/my-project/dev.log', { flags: 'a' });

function startServer() {
  const child = spawn('node', ['node_modules/.bin/next', 'dev', '-H', '0.0.0.0', '--port', '3000'], {
    cwd: '/home/z/my-project',
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
  });

  child.stdout.on('data', (data) => {
    log.write(data);
    process.stdout.write(data);
  });

  child.stderr.on('data', (data) => {
    log.write(data);
    process.stderr.write(data);
  });

  child.on('exit', (code) => {
    log.write(`\nServer exited with code ${code} at ${new Date().toISOString()}\n`);
    // Restart after 2 seconds
    setTimeout(startServer, 2000);
  });

  child.unref();
}

startServer();
