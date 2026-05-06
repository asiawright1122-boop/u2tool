import { isAiDiscoveryEnabled } from './feature-flag';
import { isValidLocale } from '@/lib/i18n';
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

const MAX_QUERY_LENGTH = 300;
const MAX_TOOL_SLUG_LENGTH = 128;

function isValidEventName(name: string): name is DiscoveryEventName {
  return name === 'query_submitted' || name === 'result_clicked' || name === 'fallback_viewed';
}

function isValidDecision(value: unknown): value is DiscoveryDecision {
  return value === 'direct' || value === 'suggest' || value === 'fallback';
}

function isValidTimestamp(value: string): boolean {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed);
}

export function isValidDiscoveryEvent(event: unknown): event is DiscoveryTelemetryEvent {
  if (!event || typeof event !== 'object') {
    return false;
  }

  const obj = event as Record<string, unknown>;
  if (typeof obj.name !== 'string' || !isValidEventName(obj.name)) {
    return false;
  }
  if (typeof obj.locale !== 'string' || !isValidLocale(obj.locale.trim())) {
    return false;
  }
  if (typeof obj.timestamp !== 'string' || !isValidTimestamp(obj.timestamp.trim())) {
    return false;
  }

  if (obj.name === 'result_clicked' && typeof obj.toolSlug !== 'string') {
    return false;
  }
  if (obj.query !== undefined) {
    if (typeof obj.query !== 'string' || obj.query.trim().length > MAX_QUERY_LENGTH) {
      return false;
    }
  }
  if (obj.toolSlug !== undefined) {
    if (
      typeof obj.toolSlug !== 'string' ||
      obj.toolSlug.trim().length === 0 ||
      obj.toolSlug.trim().length > MAX_TOOL_SLUG_LENGTH ||
      !/^[a-z0-9-]+$/i.test(obj.toolSlug.trim())
    ) {
      return false;
    }
  }
  if (obj.action !== undefined && !isValidDecision(obj.action)) {
    return false;
  }
  if (obj.confidence !== undefined) {
    if (
      typeof obj.confidence !== 'number' ||
      !Number.isFinite(obj.confidence) ||
      obj.confidence < 0 ||
      obj.confidence > 1
    ) {
      return false;
    }
  }

  return true;
}

export function buildDiscoveryEvent(input: BuildDiscoveryEventInput): DiscoveryTelemetryEvent | null {
  if (!isValidEventName(input.name)) {
    return null;
  }
  const locale = input.locale.trim();
  if (!isValidLocale(locale)) {
    return null;
  }
  if (input.name === 'result_clicked' && (!input.toolSlug || input.toolSlug.trim().length === 0)) {
    return null;
  }

  const event: DiscoveryTelemetryEvent = {
    name: input.name,
    locale,
    timestamp: new Date().toISOString(),
  };

  const query = input.query?.trim();
  if (query && query.length > 0) {
    event.query = query.slice(0, MAX_QUERY_LENGTH);
  }
  if (input.toolSlug && input.toolSlug.trim().length > 0) {
    event.toolSlug = input.toolSlug.trim();
  }
  if (input.action) {
    event.action = input.action;
  }
  if (typeof input.confidence === 'number' && Number.isFinite(input.confidence)) {
    event.confidence = Math.max(0, Math.min(1, input.confidence));
  }

  return isValidDiscoveryEvent(event) ? event : null;
}

export async function sendDiscoveryEvents(
  events: DiscoveryTelemetryEvent[],
  endpoint = '/api/ai-discovery/events/'
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
