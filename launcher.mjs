import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

// Write PID file so we can track it
const out = '/home/z/my-project/dev.log';

try {
  execSync('node node_modules/.bin/next dev -H 0.0.0.0 --port 3000', {
    cwd: '/home/z/my-project',
    stdio: ['ignore', out, out],
    timeout: 0,
    killSignal: 'SIGTERM',
  });
} catch (err) {
  writeFileSync(out, `\nServer crashed: ${err.message}\n`, { flag: 'a' });
}
