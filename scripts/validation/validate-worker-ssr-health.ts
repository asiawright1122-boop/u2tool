const BASE_URL = (process.env.PROD_BASE_URL || 'https://www.u2tool.com').replace(/\/+$/, '');
const PROBE_ROUNDS = Number.parseInt(process.env.SSR_PROBE_ROUNDS || '2', 10);

interface WorkerSsrProbe {
  bodyMustInclude: string[];
  name: string;
  path: string;
}

interface ProbeResponse {
  body: string;
  contentType: string;
  htmlCache: string;
  status: number;
}

const probes: WorkerSsrProbe[] = [
  {
    name: 'English JSON Formatter FAQ schema',
    path: '/en/tools/json-formatter/',
    bodyMustInclude: ['JSON Formatter', 'FAQPage', '/en/compare/choose-json-tool/'],
  },
  {
    name: 'Russian JSON Formatter SSR',
    path: '/ru/tools/json-formatter/',
    bodyMustInclude: ['JSON', 'FAQPage'],
  },
  {
    name: 'German SQL Formatter SSR',
    path: '/de/tools/sql-formatter/',
    bodyMustInclude: ['SQL'],
  },
  {
    name: 'Arabic Word Counter SSR',
    path: '/ar/tools/word-counter/',
    bodyMustInclude: ['word-counter', 'SoftwareApplication'],
  },
];

function assert(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function buildUncachedProbeUrl(path: string, round: number): string {
  const url = new URL(path, BASE_URL);
  url.searchParams.set('__u2tool_ssr_probe', `${Date.now()}-${round}`);
  return url.toString();
}

async function fetchProbeResponse(url: string): Promise<ProbeResponse> {
  const response = await fetch(url, {
    headers: {
      Accept: 'text/html',
      'User-Agent': 'u2tool-worker-ssr-health/1.0',
    },
    redirect: 'follow',
  });

  return {
    body: await response.text(),
    contentType: response.headers.get('content-type') || '',
    htmlCache: response.headers.get('x-u2tool-html-cache') || '',
    status: response.status,
  };
}

async function fetchProbeResponseWithRetry(url: string, attempts = 3): Promise<ProbeResponse> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetchProbeResponse(url);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
  }

  throw lastError;
}

async function runProbe(probe: WorkerSsrProbe, round: number): Promise<void> {
  const url = buildUncachedProbeUrl(probe.path, round);
  const response = await fetchProbeResponseWithRetry(url);

  assert(response.status === 200, `${probe.name}: expected HTTP 200, got ${response.status}`);
  assert(response.contentType.includes('text/html'), `${probe.name}: response is not HTML (${response.contentType})`);
  assert(response.htmlCache === 'BYPASS', `${probe.name}: expected x-u2tool-html-cache BYPASS, got "${response.htmlCache}"`);
  assert(!response.body.includes('error code: 1102'), `${probe.name}: body contains Cloudflare Worker 1102`);
  assert(response.body.length > 50_000, `${probe.name}: HTML body unexpectedly small (${response.body.length} bytes)`);

  for (const expected of probe.bodyMustInclude) {
    assert(response.body.includes(expected), `${probe.name}: body missing "${expected}"`);
  }
}

async function main(): Promise<void> {
  const rounds = Number.isFinite(PROBE_ROUNDS) && PROBE_ROUNDS > 0 ? PROBE_ROUNDS : 2;
  const failures: string[] = [];

  for (let round = 1; round <= rounds; round += 1) {
    for (const probe of probes) {
      try {
        await runProbe(probe, round);
        console.log(`OK  ${probe.name} ${probe.path} round=${round}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failures.push(message);
        console.log(`FAIL ${probe.name} ${probe.path} round=${round} -> ${message}`);
      }
    }
  }

  if (failures.length > 0) {
    console.log(`\n${failures.length} Worker SSR health checks failed. BASE_URL=${BASE_URL}`);
    process.exitCode = 1;
    return;
  }

  console.log(`\nAll Worker SSR health checks passed. BASE_URL=${BASE_URL}; rounds=${rounds}`);
}

main().catch((error) => {
  console.error('Unexpected Worker SSR health validation error:', error);
  process.exitCode = 1;
});
