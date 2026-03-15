import { isAiDiscoveryEnabled } from './feature-flag';
import type { DiscoveryDecision } from './types';

export type DiscoveryEventName = 'query_submitted' | 'result_clicked' | 'fallback_viewed';

export interface DiscoveryTelemetryEvent {
  name: DiscoveryEventName;
  locale: string;
  timestamp: string;
  query?: string;
  toolSlug?: string;
  action?: DiscoveryDecision;
  confidence?: number;
}

interface BuildDiscoveryEventInput {
  name: DiscoveryEventName;
  locale: string;
  query?: string;
  toolSlug?: string;
  action?: DiscoveryDecision;
  confidence?: number;
}

function isValidEventName(name: string): name is DiscoveryEventName {
  return name === 'query_submitted' || name === 'result_clicked' || name === 'fallback_viewed';
}

export function isValidDiscoveryEvent(event: unknown): event is DiscoveryTelemetryEvent {
  if (!event || typeof event !== 'object') {
    return false;
  }

  const obj = event as Record<string, unknown>;
  if (typeof obj.name !== 'string' || !isValidEventName(obj.name)) {
    return false;
  }
  if (typeof obj.locale !== 'string' || obj.locale.trim().length === 0) {
    return false;
  }
  if (typeof obj.timestamp !== 'string' || obj.timestamp.trim().length === 0) {
    return false;
  }

  if (obj.name === 'result_clicked' && typeof obj.toolSlug !== 'string') {
    return false;
  }

  return true;
}

export function buildDiscoveryEvent(input: BuildDiscoveryEventInput): DiscoveryTelemetryEvent | null {
  if (!isValidEventName(input.name)) {
    return null;
  }
  if (!input.locale || input.locale.trim().length === 0) {
    return null;
  }
  if (input.name === 'result_clicked' && (!input.toolSlug || input.toolSlug.trim().length === 0)) {
    return null;
  }

  const event: DiscoveryTelemetryEvent = {
    name: input.name,
    locale: input.locale.trim(),
    timestamp: new Date().toISOString(),
  };

  if (input.query && input.query.trim().length > 0) {
    event.query = input.query.trim();
  }
  if (input.toolSlug && input.toolSlug.trim().length > 0) {
    event.toolSlug = input.toolSlug.trim();
  }
  if (input.action) {
    event.action = input.action;
  }
  if (typeof input.confidence === 'number') {
    event.confidence = input.confidence;
  }

  return event;
}

export async function sendDiscoveryEvents(
  events: DiscoveryTelemetryEvent[],
  endpoint = '/api/ai-discovery/events'
): Promise<boolean> {
  if (!isAiDiscoveryEnabled()) {
    return false;
  }

  const validEvents = events.filter((event) => isValidDiscoveryEvent(event));
  if (validEvents.length === 0) {
    return false;
  }

  const body = JSON.stringify({ events: validEvents });

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      return navigator.sendBeacon(endpoint, blob);
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
      keepalive: true,
    });
    return response.ok;
  } catch (error) {
    console.error('[ai-discovery] telemetry send failed', error);
    return false;
  }
}
