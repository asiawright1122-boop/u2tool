import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import {
  handleDiscoveryEventsExport,
  handleDiscoveryEventsSubmit,
  type DiscoveryEventsRuntime,
} from '@/lib/ai-discovery/events-handler';
import type { TelemetryStore } from '@/lib/ai-discovery/telemetry-store';

export const prerender = false;

type TelemetryRuntimeLocals = {
  runtime?: {
    env?: {
      AI_DISCOVERY_TELEMETRY?: TelemetryStore;
      AI_DISCOVERY_TELEMETRY_EXPORT_TOKEN?: string;
    };
    ctx?: {
      waitUntil?: (promise: Promise<unknown>) => void;
    };
  };
  cfContext?: {
    waitUntil?: (promise: Promise<unknown>) => void;
  };
};

function getRuntimeLocals(locals: unknown): TelemetryRuntimeLocals {
  return locals && typeof locals === 'object' ? locals as TelemetryRuntimeLocals : {};
}

function getStore(locals: unknown): TelemetryStore | undefined {
  try {
    return env.AI_DISCOVERY_TELEMETRY;
  } catch {
    return getRuntimeLocals(locals).runtime?.env?.AI_DISCOVERY_TELEMETRY;
  }
}

function getExportToken(locals: unknown): string | undefined {
  try {
    return env.AI_DISCOVERY_TELEMETRY_EXPORT_TOKEN;
  } catch {
    return getRuntimeLocals(locals).runtime?.env?.AI_DISCOVERY_TELEMETRY_EXPORT_TOKEN;
  }
}

function waitUntil(locals: unknown, promise: Promise<unknown>): void {
  const runtimeLocals = getRuntimeLocals(locals);
  const wait = runtimeLocals.runtime?.ctx?.waitUntil ?? runtimeLocals.cfContext?.waitUntil;

  if (wait) {
    wait(promise);
  }
}

function getRuntime(locals: unknown): DiscoveryEventsRuntime {
  return {
    store: getStore(locals),
    exportToken: getExportToken(locals),
    waitUntil: (promise) => waitUntil(locals, promise),
  };
}

export const GET: APIRoute = async ({ locals, request }) => {
  return handleDiscoveryEventsExport(request, getRuntime(locals));
};

export const POST: APIRoute = async ({ locals, request }) => {
  return handleDiscoveryEventsSubmit(request, getRuntime(locals));
};
