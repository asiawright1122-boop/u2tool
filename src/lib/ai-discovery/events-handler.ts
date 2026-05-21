import { isAiDiscoveryEnabled } from './feature-flag';
import { isValidDiscoveryEvent } from './telemetry';
import {
  exportDiscoveryEvents,
  persistDiscoveryEvents,
  type TelemetryStore,
} from './telemetry-store';

export const AI_DISCOVERY_EVENTS_EXPORT_TOKEN_HEADER = 'x-ai-discovery-export-token';
export const AI_DISCOVERY_EVENTS_MAX_EVENTS_PER_REQUEST = 20;
export const AI_DISCOVERY_EVENTS_MAX_REQUEST_BYTES = 16 * 1024;

export type DiscoveryEventsRuntime = {
  store?: TelemetryStore;
  exportToken?: string;
  waitUntil?: (promise: Promise<unknown>) => void;
};

function jsonResponse(
  payload: Record<string, unknown>,
  status: number,
  headers?: Record<string, string>
): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

function runInBackground(runtime: DiscoveryEventsRuntime, promise: Promise<unknown>): void {
  if (runtime.waitUntil) {
    runtime.waitUntil(promise);
  }
}

export async function handleDiscoveryEventsExport(
  request: Request,
  runtime: DiscoveryEventsRuntime
): Promise<Response> {
  if (!isAiDiscoveryEnabled()) {
    return new Response(null, { status: 204 });
  }

  if (!runtime.store) {
    return jsonResponse(
      {
        error: 'TELEMETRY_STORE_NOT_CONFIGURED',
        message: 'Telemetry export requires AI_DISCOVERY_TELEMETRY KV binding',
      },
      503
    );
  }

  const url = new URL(request.url);
  const receivedToken = request.headers.get(AI_DISCOVERY_EVENTS_EXPORT_TOKEN_HEADER) ?? url.searchParams.get('token');
  if (!runtime.exportToken || receivedToken !== runtime.exportToken) {
    return jsonResponse(
      {
        error: 'UNAUTHORIZED',
        message: 'Telemetry export token is required',
      },
      401
    );
  }

  const limit = Number.parseInt(url.searchParams.get('limit') ?? '', 10);
  const date = url.searchParams.get('date') ?? undefined;
  const exported = await exportDiscoveryEvents(runtime.store, {
    date,
    limit: Number.isFinite(limit) ? limit : undefined,
  });

  return new Response(exported.body, {
    status: 200,
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
      'x-ai-discovery-event-count': String(exported.count),
      'x-ai-discovery-truncated': String(exported.truncated),
    },
  });
}

export async function handleDiscoveryEventsSubmit(
  request: Request,
  runtime: DiscoveryEventsRuntime
): Promise<Response> {
  if (!isAiDiscoveryEnabled()) {
    return new Response(null, { status: 204 });
  }

  const contentLength = Number.parseInt(request.headers.get('content-length') ?? '0', 10);
  if (Number.isFinite(contentLength) && contentLength > AI_DISCOVERY_EVENTS_MAX_REQUEST_BYTES) {
    return jsonResponse(
      {
        error: 'PAYLOAD_TOO_LARGE',
        message: `Telemetry payload exceeds ${AI_DISCOVERY_EVENTS_MAX_REQUEST_BYTES} bytes`,
      },
      413
    );
  }

  let payload: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > AI_DISCOVERY_EVENTS_MAX_REQUEST_BYTES) {
      return jsonResponse(
        {
          error: 'PAYLOAD_TOO_LARGE',
          message: `Telemetry payload exceeds ${AI_DISCOVERY_EVENTS_MAX_REQUEST_BYTES} bytes`,
        },
        413
      );
    }
    payload = JSON.parse(rawBody);
  } catch {
    return jsonResponse(
      {
        error: 'INVALID_JSON',
        message: 'Expected JSON payload',
      },
      400
    );
  }

  if (!payload || typeof payload !== 'object') {
    return jsonResponse(
      {
        error: 'INVALID_PAYLOAD',
        message: 'Expected object payload',
      },
      400
    );
  }

  const eventsRaw = (payload as { events?: unknown }).events;
  if (!Array.isArray(eventsRaw) || eventsRaw.length === 0) {
    return jsonResponse(
      {
        error: 'INVALID_EVENTS',
        message: 'events must be a non-empty array',
      },
      400
    );
  }

  const trimmed = eventsRaw.slice(0, AI_DISCOVERY_EVENTS_MAX_EVENTS_PER_REQUEST);
  const validEvents = trimmed.filter((item) => isValidDiscoveryEvent(item));

  if (validEvents.length === 0) {
    return jsonResponse(
      {
        error: 'NO_VALID_EVENTS',
        message: 'No valid telemetry events found',
      },
      400
    );
  }

  console.info('[ai-discovery] received events', {
    received: eventsRaw.length,
    accepted: validEvents.length,
  });

  const persistPromise = persistDiscoveryEvents(runtime.store, validEvents).catch((error) => {
    console.error('[ai-discovery] telemetry persistence failed', error);
    return false;
  });
  runInBackground(runtime, persistPromise);

  return jsonResponse(
    {
      accepted: validEvents.length,
    },
    202
  );
}
