import { spawn, execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

/** Consumers must use the service owned by the current validation run. */
export function getManagedPreviewUrl(env = process.env) {
  if (!env.U2TOOL_PREVIEW_URL) {
    throw new Error('A managed preview is required. Use npm run qa:smoke or run-with-preview.mjs.');
  }
  const url = new URL(env.U2TOOL_PREVIEW_URL);
  if (url.protocol !== 'http:' || url.hostname !== '127.0.0.1' || !url.port ||
      url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw new Error('Managed preview must be an explicit IPv4 loopback origin.');
  }
  return url.origin;
}

async function assertPortAvailable(port) {
  const probe = net.createServer();
  await new Promise((resolve, reject) => {
    probe.once('error', error => reject(new Error(`Preview port ${port} is in use or unavailable; refusing to reuse it.`, { cause: error })));
    probe.listen(port, '127.0.0.1', () => probe.close(resolve));
  });
}

function start(command, args, options) {
  const child = spawn(command, args, { ...options, detached: process.platform !== 'win32' });
  const done = new Promise(resolve => {
    child.once('error', error => resolve({ code: 1, error }));
    child.once('exit', (code, signal) => resolve({ code: code ?? 1, signal }));
  });
  return { child, done };
}

export function groupAlive(child) {
  if (!child.pid) return false;
  if (process.platform === 'win32') return child.exitCode === null && child.signalCode === null;
  try { process.kill(-child.pid, 0); return true; }
  catch (error) {
    if (error.code === 'ESRCH') return false;
    if (error.code === 'EPERM') {
      // macOS can report EPERM while an exited group is being reaped. Only
      // accept that race after an independent process-table check. A live
      // inaccessible group remains a hard error, not a successful cleanup.
      const rows = execFileSync('ps', ['-axo', 'pid=,pgid=,stat='], { encoding: 'utf8' });
      const live = rows.trim().split('\n').some(row => {
        const [, group, state] = row.trim().split(/\s+/);
        return Number(group) === child.pid && !state?.startsWith('Z');
      });
      if (!live) return false;
    }
    throw error;
  }
}

async function stop(tree, timeoutMs) {
  if (!tree || !groupAlive(tree.child)) return;
  const { child } = tree;
  if (process.platform === 'win32') {
    // Only this run's spawned PID, never a port owner discovered elsewhere.
    const killer = spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    await new Promise(resolve => { killer.once('exit', resolve); killer.once('error', resolve); });
    return;
  }
  const signal = name => {
    try { process.kill(-child.pid, name); }
    catch (error) {
      if (error.code === 'ESRCH' || (error.code === 'EPERM' && !groupAlive(child))) return;
      throw error;
    }
  };
  signal('SIGTERM');
  const deadline = Date.now() + timeoutMs;
  while (groupAlive(child) && Date.now() < deadline) await delay(25);
  if (groupAlive(child)) signal('SIGKILL');
  await tree.done;
}

async function waitForPreview(baseUrl, markerName, token, timeoutMs, signal) {
  const deadline = Date.now() + timeoutMs;
  while (!signal.aborted && Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/${markerName}`, {
        redirect: 'error', signal: AbortSignal.any([signal, AbortSignal.timeout(1000)]),
      });
      if (response.ok && await response.text() === token) return;
    } catch { /* This exact build is not ready yet. */ }
    await delay(100, undefined, { signal });
  }
  throw new Error(`Timed out waiting for this build's local SSR preview at ${baseUrl}.`);
}

/** One owner for preview + validation process trees, including early failure. */
export async function runWithPreview(command, args, options = {}) {
  const cwd = options.cwd ?? process.cwd();
  const env = options.env ?? process.env;
  const portText = env.PRODUCTION_PREVIEW_PORT || '4327';
  if (!/^\d+$/.test(portText) || Number(portText) < 1 || Number(portText) > 65535) {
    throw new Error('PRODUCTION_PREVIEW_PORT must be an integer from 1 to 65535.');
  }
  if (env.U2TOOL_PREVIEW_URL) throw new Error('Nested managed previews are not allowed; invoke the checks script instead.');
  const previewBaseUrl = `http://127.0.0.1:${Number(portText)}`;
  await assertPortAvailable(Number(portText));
  const markerName = `u2tool-preview-${randomUUID()}.txt`;
  const token = randomUUID();
  const markerPath = path.join(cwd, 'dist/client', markerName);
  // ENOENT is intentional if there is no build. Never silently create a fake build.
  await writeFile(markerPath, token, { flag: 'wx' });
  let preview;
  let validation;
  let interruptedCode = 0;
  let interrupt;
  const interrupted = new Promise(resolve => { interrupt = resolve; });
  const controller = new AbortController();
  const onInterrupt = () => { interruptedCode = 130; interrupt({ code: 130 }); };
  const onTerminate = () => { interruptedCode = 143; interrupt({ code: 143 }); };
  process.once('SIGINT', onInterrupt);
  process.once('SIGTERM', onTerminate);
  try {
    await mkdir(path.join(cwd, 'artifacts/validation'), { recursive: true });
    const previewCommand = options.previewCommand ?? [process.execPath,
      path.join(cwd, 'node_modules/astro/bin/astro.mjs'), 'preview', '--host', '127.0.0.1', '--port', portText];
    preview = start(previewCommand[0], previewCommand.slice(1), {
      cwd, env: { ...env, DISABLE_CLOUDFLARE_INSPECTOR: '1' }, stdio: options.stdio ?? 'inherit',
    });
    const prematureExit = preview.done.then(result => {
      throw new Error(`Local SSR preview exited unexpectedly (code ${result.code}).`, { cause: result.error });
    });
    await Promise.race([
      waitForPreview(previewBaseUrl, markerName, token, options.timeoutMs ?? 60_000, controller.signal),
      prematureExit, interrupted,
    ]);
    if (interruptedCode) return interruptedCode;
    validation = start(command, args, {
      cwd, stdio: options.stdio ?? 'inherit', env: {
        ...env,
        BASE_URL: previewBaseUrl,
        FETCH_BASE_URL: previewBaseUrl,
        PROD_BASE_URL: previewBaseUrl,
        U2TOOL_PREVIEW_URL: previewBaseUrl,
        CANONICAL_BASE_URL: env.CANONICAL_BASE_URL || 'https://www.u2tool.com',
        SEO_ALIGNMENT_REPORT: env.SEO_ALIGNMENT_REPORT || path.join(cwd, 'artifacts/validation/seo-alignment.md'),
        SKIP_SOURCE_RENDERED_CHECKS: '1',
      },
    });
    const result = await Promise.race([validation.done, prematureExit, interrupted]);
    if (result.error) throw result.error;
    return interruptedCode || result.code;
  } finally {
    controller.abort();
    // Stop even descendants whose direct parent has already exited.
    try {
      await Promise.all([stop(validation, options.shutdownMs ?? 3000), stop(preview, options.shutdownMs ?? 3000)]);
    } finally {
      await rm(markerPath, { force: true });
      process.removeListener('SIGINT', onInterrupt);
      process.removeListener('SIGTERM', onTerminate);
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args[0] === '--') args.shift();
  try {
    if (!args.length) throw new Error('Usage: node scripts/validation/run-with-preview.mjs -- <command> [...args]');
    process.exitCode = await runWithPreview(args[0], args.slice(1));
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
