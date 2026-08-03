import { spawn } from 'node:child_process';

const childArgs = process.argv.slice(2).filter((arg, index) => !(index === 0 && arg === '--'));
if (childArgs.length === 0) {
  throw new Error('Usage: node scripts/validation/run-with-preview.mjs -- <command> [...args]');
}

function run(command, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env,
      stdio: 'inherit',
    });

    child.once('error', reject);
    child.once('exit', (code, signal) => resolve(code ?? (signal ? 1 : 0)));
  });
}

async function waitForPreview(baseUrl, preview, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (preview.exitCode !== null) {
      throw new Error(`Local SSR preview exited before it became ready (code ${preview.exitCode}).`);
    }

    try {
      const response = await fetch(`${baseUrl}/robots.txt`);
      if (response.ok) return;
    } catch {
      // The preview process is still starting.
    }

    await new Promise(resolve => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out waiting for local SSR preview at ${baseUrl}.`);
}

async function stopPreview(preview) {
  if (preview.exitCode !== null) return;

  preview.kill('SIGTERM');
  await Promise.race([
    new Promise(resolve => preview.once('exit', resolve)),
    new Promise(resolve => setTimeout(resolve, 5_000)),
  ]);

  if (preview.exitCode === null) preview.kill('SIGKILL');
}

const previewHost = '127.0.0.1';
const previewPort = process.env.PRODUCTION_PREVIEW_PORT || '4327';
const previewBaseUrl = `http://${previewHost}:${previewPort}`;
const canonicalBaseUrl = process.env.CANONICAL_BASE_URL || 'https://www.u2tool.com';
const preview = spawn('npm', ['run', 'preview', '--', '--host', previewHost, '--port', previewPort], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    DISABLE_CLOUDFLARE_INSPECTOR: '1',
  },
  stdio: 'inherit',
});

const terminate = () => {
  if (preview.exitCode === null) preview.kill('SIGTERM');
};
process.once('SIGINT', terminate);
process.once('SIGTERM', terminate);

try {
  await waitForPreview(previewBaseUrl, preview);
  process.exitCode = await run(childArgs[0], childArgs.slice(1), {
    ...process.env,
    BASE_URL: previewBaseUrl,
    FETCH_BASE_URL: previewBaseUrl,
    PROD_BASE_URL: previewBaseUrl,
    CANONICAL_BASE_URL: canonicalBaseUrl,
    SKIP_SOURCE_RENDERED_CHECKS: '1',
  });
} finally {
  process.removeListener('SIGINT', terminate);
  process.removeListener('SIGTERM', terminate);
  await stopPreview(preview);
}
