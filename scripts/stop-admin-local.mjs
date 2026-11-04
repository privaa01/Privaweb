import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { homedir } from 'node:os';
import { get } from 'node:https';

const directory = resolve(process.env.PRIVA_ADMIN_LOCAL_DATA_DIR ?? join(homedir(), 'Library/Application Support/Priva/local-admin'));
const pidPath = join(directory, 'local.pid');
if (!existsSync(pidPath)) throw Error('No local server state found.');
const state = JSON.parse(readFileSync(pidPath, 'utf8'));
if (!Number.isInteger(state.pid) || state.pid <= 0 || typeof state.instance !== 'string')
  throw Error('Invalid local server state.');
const config = JSON.parse(readFileSync(join(directory, 'local-config.json'), 'utf8'));
const origin = new URL(config.origin);
if (origin.protocol !== 'https:' || origin.hostname !== 'localhost' || !origin.port || origin.origin !== config.origin)
  throw Error('Invalid local origin.');
const result = await new Promise((resolveResult, reject) => {
  const req = get(new URL('/api/local/estado', origin), { family: 4, ca: readFileSync('.tools/admin-local-tls/ca.pem') }, res => {
    let body = '';
    res.on('data', chunk => { body += chunk; });
    res.on('end', () => {
      try { resolveResult(JSON.parse(body)); }
      catch { reject(Error('Invalid local service response')); }
    });
  });
  req.setTimeout(3000, () => req.destroy(Error('Local service did not respond')));
  req.on('error', reject);
});
if (result.application !== 'priva-local-admin' || result.instance !== state.instance)
  throw Error('Local process identity did not match; nothing stopped.');
const target=state.supervisorPid??state.pid;
if(!Number.isInteger(target)||target<=0)throw Error('Invalid local supervisor state.');
process.kill(target, 'SIGTERM');
console.log('Stopping the verified local server; its supervisor will remove temporary certificate trust.');
