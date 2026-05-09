import astroWorker from '@astrojs/cloudflare/entrypoints/server';
import {
  createLegacyBuildAssetGoneResponse,
  isLegacyBuildAssetRequest,
} from './lib/legacy-build-assets';

export default {
  ...astroWorker,
  async fetch(request, env, context) {
    if (isLegacyBuildAssetRequest(request)) {
      return createLegacyBuildAssetGoneResponse(request.method);
    }

    return astroWorker.fetch(request, env, context);
  },
} satisfies typeof astroWorker;
