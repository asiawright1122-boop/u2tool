import type { APIRoute } from 'astro';
import { isAiDiscoveryEnabled } from '@/lib/ai-discovery/feature-flag';
import { isValidDiscoveryEvent } from '@/lib/ai-discovery/telemetry';

export const prerender = false;

const MAX_EVENTS_PER_REQUEST = 20;

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      error: 'METHOD_NOT_ALLOWED',
      message: 'Use POST to submit telemetry events',
    }),
    {
      status: 405,
      headers: {
        Allow: 'POST',
        'Content-Type': 'application/json',
      },
    }
  );
};

export const POST: APIRoute = async ({ request }) => {
  if (!isAiDiscoveryEnabled()) {
    return new Response(null, { status: 204 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new Response(
      JSON.stringify({
        error: 'INVALID_JSON',
        message: 'Expected JSON payload',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  if (!payload || typeof payload !== 'object') {
    return new Response(
      JSON.stringify({
        error: 'INVALID_PAYLOAD',
        message: 'Expected object payload',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const eventsRaw = (payload as { events?: unknown }).events;
  if (!Array.isArray(eventsRaw) || eventsRaw.length === 0) {
    return new Response(
      JSON.stringify({
        error: 'INVALID_EVENTS',
        message: 'events must be a non-empty array',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const trimmed = eventsRaw.slice(0, MAX_EVENTS_PER_REQUEST);
  const validEvents = trimmed.filter((item) => isValidDiscoveryEvent(item));

  if (validEvents.length === 0) {
    return new Response(
      JSON.stringify({
        error: 'NO_VALID_EVENTS',
        message: 'No valid telemetry events found',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  console.info('[ai-discovery] received events', {
    received: eventsRaw.length,
    accepted: validEvents.length,
  });

  return new Response(
    JSON.stringify({
      accepted: validEvents.length,
    }),
    {
      status: 202,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
