import type { APIRoute } from 'astro';
import { isAiDiscoveryEnabled } from '@/lib/ai-discovery/feature-flag';
import { isValidDiscoveryEvent } from '@/lib/ai-discovery/telemetry';

export const prerender = false;

const MAX_EVENTS_PER_REQUEST = 20;
const MAX_REQUEST_BYTES = 16 * 1024;

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

export const GET: APIRoute = async () => {
  return jsonResponse(
    {
      error: 'METHOD_NOT_ALLOWED',
      message: 'Use POST to submit telemetry events',
    },
    405,
    { Allow: 'POST' }
  );
};

export const POST: APIRoute = async ({ request }) => {
  if (!isAiDiscoveryEnabled()) {
    return new Response(null, { status: 204 });
  }

  const contentLength = Number.parseInt(request.headers.get('content-length') ?? '0', 10);
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return jsonResponse(
      {
        error: 'PAYLOAD_TOO_LARGE',
        message: `Telemetry payload exceeds ${MAX_REQUEST_BYTES} bytes`,
      },
      413
    );
  }

  let payload: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
      return jsonResponse(
        {
          error: 'PAYLOAD_TOO_LARGE',
          message: `Telemetry payload exceeds ${MAX_REQUEST_BYTES} bytes`,
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

  const trimmed = eventsRaw.slice(0, MAX_EVENTS_PER_REQUEST);
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

  return jsonResponse(
    {
      accepted: validEvents.length,
    },
    202
  );
};
