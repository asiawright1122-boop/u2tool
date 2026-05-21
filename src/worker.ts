import astroWorker from '@astrojs/cloudflare/entrypoints/server';
import {
  handleDiscoveryEventsExport,
  handleDiscoveryEventsSubmit,
  type DiscoveryEventsRuntime,
} from './lib/ai-discovery/events-handler';
import type { TelemetryStore } from './lib/ai-discovery/telemetry-store';
import {
  createLegacyBuildAssetGoneResponse,
  isLegacyBuildAssetRequest,
} from './lib/legacy-build-assets';

type DiscoveryEnv = {
  AI_DISCOVERY_TELEMETRY?: TelemetryStore;
  AI_DISCOVERY_TELEMETRY_EXPORT_TOKEN?: string;
};

function buildDiscoveryRuntime(
  env: DiscoveryEnv,
  context: { waitUntil?: (promise: Promise<unknown>) => void }
): DiscoveryEventsRuntime {
  return {
    store: env.AI_DISCOVERY_TELEMETRY,
    exportToken: env.AI_DISCOVERY_TELEMETRY_EXPORT_TOKEN,
    waitUntil: typeof context?.waitUntil === 'function'
      ? (promise) => context.waitUntil!(promise)
      : undefined,
  };
}

export default {
  ...astroWorker,
  async fetch(request, env, context) {
    if (isLegacyBuildAssetRequest(request)) {
      return createLegacyBuildAssetGoneResponse(request.method);
    }

    const url = new URL(request.url);
    const normalizedPath = url.pathname !== '/' && url.pathname.endsWith('/')
      ? url.pathname.slice(0, -1)
      : url.pathname;

    if (normalizedPath === '/api/ai-discovery/events') {
      const runtime = buildDiscoveryRuntime(env as DiscoveryEnv, context);
      const upstream = request.clone();

      if (request.method === 'GET' || request.method === 'HEAD') {
        return handleDiscoveryEventsExport(upstream, runtime);
      }
      if (request.method === 'POST') {
        return handleDiscoveryEventsSubmit(upstream, runtime);
      }
    }

    return astroWorker.fetch(request, env, context);
  },
} satisfies typeof astroWorker;
