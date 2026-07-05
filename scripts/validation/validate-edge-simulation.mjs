import { spawn } from 'node:child_process';

const DEV_PORT = 8788;
const BASE_URL = `http://localhost:${DEV_PORT}`;

// The checks to run against the edge simulation
const checks = [
  { name: 'Root Redirection', url: '/', expect: { status: 301, locationEndsWith: '/en/' } },
  { name: 'Legacy Blog Redirect', url: '/ru/blog/regex-complete-guide', expect: { status: 301, locationEndsWith: '/ru/tools/regex-tester/' } },
  { name: 'Comparison Guide Canonical Slash', url: '/en/compare/choose-jwt-tool', expect: { status: 301, locationEndsWith: '/en/compare/choose-jwt-tool/' } },
  { name: 'Comparison Guide Static HTML', url: '/en/compare/choose-jwt-tool/', expect: { status: 200 } },
  { name: 'Decommissioned Category Route', url: '/tools/categories/text/', expect: { status: 410, cacheControl: 'public, max-age=86400, s-maxage=86400', robots: 'noindex, nofollow' } },
  { name: 'Stale Next.js static asset', url: '/_next/static/chunks/main.js', expect: { status: 410 } },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  console.log(`Waiting for local wrangler server on port ${DEV_PORT}...`);
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(BASE_URL, { redirect: 'manual' });
      // If we get a response (even 404/301), the server is up
      console.log(`Server is up!`);
      return true;
    } catch (err) {
      await sleep(1000);
    }
  }
  return false;
}

function normalizeLocation(location) {
  if (!location) return '';
  if (location.startsWith('http')) return new URL(location).pathname;
  return location;
}

async function fetchManual(url) {
  const res = await fetch(url, { redirect: 'manual' });
  return {
    status: res.status,
    location: normalizeLocation(res.headers.get('location')),
    robots: res.headers.get('x-robots-tag') || '',
    cacheControl: res.headers.get('cache-control') || '',
  };
}

async function runCheck(check) {
  const target = `${BASE_URL}${check.url}`;
  const res = await fetchManual(target);
  const details = [];
  let ok = true;

  if (check.expect.status !== res.status) {
    ok = false;
    details.push(`status ${res.status} (expected ${check.expect.status})`);
  }

  if (check.expect.locationEndsWith && !res.location.endsWith(check.expect.locationEndsWith)) {
    ok = false;
    details.push(`location "${res.location}" (expected to end with "${check.expect.locationEndsWith}")`);
  }

  if (check.expect.cacheControl && check.expect.cacheControl !== res.cacheControl) {
    ok = false;
    details.push(`cache-control "${res.cacheControl}" (expected "${check.expect.cacheControl}")`);
  }

  if (check.expect.robots && check.expect.robots !== res.robots) {
    ok = false;
    details.push(`x-robots-tag "${res.robots}" (expected "${check.expect.robots}")`);
  }

  return { ok, details, res };
}

async function main() {
  console.log('🏁 Starting edge simulation server...');
  
  // Start edge server
  const child = spawn('npm', ['run', 'preview', '--', '--port', String(DEV_PORT)], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  try {
    const isReady = await waitForServer();
    if (!isReady) {
      console.error('❌ Edge server failed to start within 30 seconds.');
      process.exit(1);
    }

    const results = [];
    for (const check of checks) {
      const result = await runCheck(check);
      results.push({ check, ...result });
    }

    const failed = results.filter((r) => !r.ok);
    for (const entry of results) {
      const status = entry.ok ? 'OK ' : 'FAIL';
      const details = entry.ok ? '' : ` -> ${entry.details.join('; ')}`;
      console.log(`${status} ${entry.check.name} ${entry.check.url}${details}`);
    }

    if (failed.length) {
      console.log(`\n❌ ${failed.length} Edge simulation checks failed.`);
      process.exitCode = 1;
    } else {
      console.log(`\n✅ All edge simulation checks passed. Middleware rules are working perfectly.`);
    }
  } finally {
    console.log('🛑 Shutting down edge server...');
    child.kill();
  }
}

main().catch((err) => {
  console.error('❌ Unexpected error:', err);
  process.exitCode = 1;
});
