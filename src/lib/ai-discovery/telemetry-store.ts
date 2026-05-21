import type { DiscoveryTelemetryEvent } from './telemetry';

export interface TelemetryStore {
  list(options?: { prefix?: string; cursor?: string; limit?: number }): Promise<{
    keys: Array<{ name: string }>;
    cursor?: string;
    list_complete: boolean;
  }>;
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

const KEY_PREFIX = 'ai-discovery/events';
const DEFAULT_EXPORT_LIMIT = 1000;
const MAX_EXPORT_LIMIT = 5000;
const RETENTION_SECONDS = 60 * 60 * 24 * 90;

function toDatePath(timestamp: string): string {
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  return parsed.toISOString().slice(0, 10);
}

function createBatchKey(events: DiscoveryTelemetryEvent[]): string {
  const firstTimestamp = events[0]?.timestamp ?? new Date().toISOString();
  const datePath = toDatePath(firstTimestamp);
  const safeTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const randomSuffix = crypto.randomUUID();

  return `${KEY_PREFIX}/${datePath}/${safeTimestamp}-${randomSuffix}.ndjson`;
}

function toNdjson(events: DiscoveryTelemetryEvent[]): string {
  return `${events.map((event) => JSON.stringify(event)).join('\n')}\n`;
}

export async function persistDiscoveryEvents(
  store: TelemetryStore | undefined,
  events: DiscoveryTelemetryEvent[]
): Promise<boolean> {
  if (!store || events.length === 0) {
    return false;
  }

  await store.put(createBatchKey(events), toNdjson(events), {
    expirationTtl: RETENTION_SECONDS,
  });

  return true;
}

export async function exportDiscoveryEvents(
  store: TelemetryStore,
  options: { date?: string; limit?: number } = {}
): Promise<{ body: string; count: number; truncated: boolean }> {
  const limit = Math.min(Math.max(options.limit ?? DEFAULT_EXPORT_LIMIT, 1), MAX_EXPORT_LIMIT);
  const prefix = options.date ? `${KEY_PREFIX}/${options.date}/` : `${KEY_PREFIX}/`;
  const lines: string[] = [];
  let cursor: string | undefined;
  let truncated = false;

  do {
    const page = await store.list({ prefix, cursor, limit: Math.min(limit, 1000) });
    for (const key of page.keys) {
      if (lines.length >= limit) {
        truncated = true;
        break;
      }

      const value = await store.get(key.name);
      if (!value) {
        continue;
      }

      for (const line of value.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed) {
          continue;
        }
        if (lines.length >= limit) {
          truncated = true;
          break;
        }
        lines.push(trimmed);
      }
    }

    if (truncated || page.list_complete) {
      break;
    }

    cursor = page.cursor;
  } while (cursor);

  return {
    body: lines.length > 0 ? `${lines.join('\n')}\n` : '',
    count: lines.length,
    truncated,
  };
}
