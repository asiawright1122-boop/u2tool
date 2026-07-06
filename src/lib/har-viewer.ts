export type HarRequestSummary = {
  method: string;
  url: string;
  status: number;
  time: number;
  bytes: number;
  domain: string;
};

export type HarDomainSummary = {
  domain: string;
  count: number;
  bytes: number;
};

export type HarSummary = {
  requestCount: number;
  totalBytes: number;
  totalTime: number;
  statusGroups: Record<string, number>;
  domains: HarDomainSummary[];
  slowest: HarRequestSummary[];
};

export type HarSummaryResult = {
  valid: boolean;
  summary?: HarSummary;
  error?: string;
};

type HarEntry = {
  request?: {
    method?: unknown;
    url?: unknown;
  };
  response?: {
    status?: unknown;
    bodySize?: unknown;
    content?: {
      size?: unknown;
    };
  };
  time?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function numeric(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0;
}

function entryBytes(entry: HarEntry): number {
  const bodySize = numeric(entry.response?.bodySize);
  if (bodySize > 0) {
    return bodySize;
  }
  return numeric(entry.response?.content?.size);
}

function statusGroup(status: number): string {
  if (status >= 100 && status < 600) {
    return `${Math.floor(status / 100)}xx`;
  }
  return 'other';
}

function domainFor(url: string): string {
  try {
    return new URL(url).hostname || 'unknown';
  } catch {
    return 'unknown';
  }
}

function compactNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '');
}

export function formatBytes(bytes: number): string {
  const safeBytes = numeric(bytes);
  if (safeBytes < 1024) {
    return `${Math.round(safeBytes)} B`;
  }
  const kilobytes = safeBytes / 1024;
  if (kilobytes < 1024) {
    return `${compactNumber(Math.round(kilobytes * 10) / 10)} KB`;
  }
  const megabytes = kilobytes / 1024;
  if (megabytes < 1024) {
    return `${compactNumber(Math.round(megabytes * 10) / 10)} MB`;
  }
  const gigabytes = megabytes / 1024;
  return `${compactNumber(Math.round(gigabytes * 10) / 10)} GB`;
}

export function parseHarSummary(input: string): HarSummaryResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  if (!isRecord(parsed) || !isRecord(parsed.log) || !Array.isArray(parsed.log.entries)) {
    return {
      valid: false,
      error: 'HAR log.entries must be an array.',
    };
  }

  const requests = (parsed.log.entries as HarEntry[]).map((entry) => {
    const url = typeof entry.request?.url === 'string' ? entry.request.url : '';
    const status = typeof entry.response?.status === 'number' ? entry.response.status : 0;
    const time = numeric(entry.time);
    const bytes = entryBytes(entry);

    return {
      method: typeof entry.request?.method === 'string' ? entry.request.method : 'GET',
      url,
      status,
      time,
      bytes,
      domain: domainFor(url),
    };
  });

  const statusGroups: Record<string, number> = {};
  const domainMap = new Map<string, HarDomainSummary>();

  for (const request of requests) {
    const group = statusGroup(request.status);
    statusGroups[group] = (statusGroups[group] || 0) + 1;

    const current = domainMap.get(request.domain) || { domain: request.domain, count: 0, bytes: 0 };
    current.count += 1;
    current.bytes += request.bytes;
    domainMap.set(request.domain, current);
  }

  return {
    valid: true,
    summary: {
      requestCount: requests.length,
      totalBytes: requests.reduce((sum, request) => sum + request.bytes, 0),
      totalTime: requests.reduce((sum, request) => sum + request.time, 0),
      statusGroups,
      domains: Array.from(domainMap.values()).sort((left, right) => {
        if (right.count !== left.count) {
          return right.count - left.count;
        }
        return right.bytes - left.bytes;
      }),
      slowest: [...requests].sort((left, right) => right.time - left.time).slice(0, 10),
    },
  };
}
