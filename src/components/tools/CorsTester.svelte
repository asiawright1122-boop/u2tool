<script lang="ts">
  import { normalizeHttpUrl } from '@/lib/url-safety';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string, vars?: Record<string, string | number>): string {
    const scope = translations['tools']['cors-tester'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    if (typeof value !== 'string') return `MISSING: tools.cors-tester.${key}`;
    if (!vars) return value;
    return Object.entries(vars).reduce(
      (result, [varKey, varValue]) => result.replace(`{${varKey}}`, String(varValue)),
      value
    );
  }

  // Types
  interface CorsResult {
  success: boolean;
  headers: Record<string, string>;
  error?: string;
  method: string;
  url: string;
}

  let url = $state('');

  let method = $state('GET');

  let origin = $state(typeof window !== 'undefined' ? window.location.origin : '');

  let results = $state([]);

  let loading = $state(false);

  // Functions
  async function testCors() {
    const normalizedUrl = normalizeHttpUrl(url);
    if (!normalizedUrl.ok) {
      results = [
        {
          success: false,
          headers: {},
          error: normalizedUrl.error,
          method,
          url,
        },
      ];
      return;
    }
    url = normalizedUrl.url;

    loading = true;
    const newResults: CorsResult[] = [];

    // Test preflight (OPTIONS)
    try {
      const preflightResponse = await fetch(normalizedUrl.url, {
        method: 'OPTIONS',
        headers: {
          'Origin': origin,
          'Access-Control-Request-Method': method,
          'Access-Control-Request-Headers': 'Content-Type',
        },
      });

      const preflightHeaders: Record<string, string> = {};
      preflightResponse.headers.forEach((value, key) => {
        if (key.toLowerCase().startsWith('access-control')) {
          preflightHeaders[key] = value;
        }
      });

      newResults.push({
        success: preflightResponse.ok,
        headers: preflightHeaders,
        method: 'OPTIONS (Preflight)',
        url: normalizedUrl.url,
      });
    } catch (e) {
      newResults.push({
        success: false,
        headers: {},
        error: (e as Error).message,
        method: 'OPTIONS (Preflight)',
        url: normalizedUrl.url,
      });
    }

    // Test actual request
    try {
      const response = await fetch(normalizedUrl.url, {
        method,
        headers: {
          'Origin': origin,
        },
        mode: 'cors',
      });

      const corsHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        if (key.toLowerCase().startsWith('access-control')) {
          corsHeaders[key] = value;
        }
      });

      newResults.push({
        success: true,
        headers: corsHeaders,
        method,
        url: normalizedUrl.url,
      });
    } catch (e) {
      newResults.push({
        success: false,
        headers: {},
        error: (e as Error).message,
        method,
        url: normalizedUrl.url,
      });
    }

    results = newResults;
    loading = false;
  }
  function loadExample() {
    url = 'https://api.github.com/users/octocat';
    method = 'GET';
  }
  function getCorsStatus() {
    if (results.length === 0) {
      return { status: '', color: '', description: '' };
    }

    const actualRequest = results.find(r => r.method !== 'OPTIONS (Preflight)');
    if (!actualRequest) {
      return { status: t('unknown'), color: 'gray', description: '' };
    }

    if (actualRequest.success) {
      const allowOrigin = actualRequest.headers['access-control-allow-origin'];
      if (allowOrigin === '*') {
        return { 
          status: t('corsEnabled'), 
          color: 'green', 
          description: t('corsEnabledAll') 
        };
      } else if (allowOrigin) {
        return { 
          status: t('corsEnabled'), 
          color: 'green', 
          description: t('corsEnabledSpecific', { origin: allowOrigin }) 
        };
      }
      return { 
        status: t('corsEnabled'), 
        color: 'green', 
        description: t('corsEnabledNoHeader') 
      };
    }

    return { 
      status: t('corsBlocked'), 
      color: 'red', 
      description: actualRequest.error || t('corsBlockedDescription') 
    };
  }
  const corsStatus = getCorsStatus();

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="tool-label">
              {t('urlToTest')}
            </label>
            <input
              type="text"
              bind:value={url}
              placeholder={t('urlPlaceholder')}
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="tool-label">
                {t('method')}
              </label>
              <select
                bind:value={method}
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            <div>
              <label class="tool-label">
                {t('origin')}
              </label>
              <input
                type="text"
                bind:value={origin}
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
              />
            </div>
          </div>

          <div class="flex gap-4">
            <button
              onclick={testCors}
              disabled={loading || !url}
              class="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? t('testing') : t('testCors')}
            </button>
            <button
              onclick={loadExample}
              class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              {t('loadExample')}
            </button>
          </div>
        </div>

        <div class="space-y-4">
          {#if corsStatus.status}
<div class={`p-6 rounded-xl ${
              corsStatus.color === 'green'
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : corsStatus.color === 'red'
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
            }`}>
              <div class="flex items-center gap-3 mb-2">
                <span class={`text-3xl ${
                  corsStatus.color === 'green' ? 'text-green-500' : 
                  corsStatus.color === 'red' ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {corsStatus.color === 'green' ? '✓' : corsStatus.color === 'red' ? '✗' : '?'}
                </span>
                <span class={`text-xl font-semibold ${
                  corsStatus.color === 'green' ? 'text-green-700 dark:text-green-300' : 
                  corsStatus.color === 'red' ? 'text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {corsStatus.status}
                </span>
              </div>
              <p class={`text-sm ${
                corsStatus.color === 'green' ? 'text-green-600 dark:text-green-400' : 
                corsStatus.color === 'red' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {corsStatus.description}
              </p>
            </div>
{/if}

          {#if results.length > 0}
<div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {t('results')}
              </h3>
              
              {#each results as result, index (index)}
<div 
                  class={`p-4 rounded-lg border ${
                    result.success
                      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <div class="flex items-center gap-2 mb-2">
                    <span class={`font-mono font-medium ${
                      result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                    }`}>
                      {result.method}
                    </span>
                    <span class={result.success ? 'text-green-500' : 'text-red-500'}>
                      {result.success ? '✓' : '✗'}
                    </span>
                  </div>
                  
                  {#if result.error}
<p class="text-sm text-red-600 dark:text-red-400 mb-2">
                      {result.error}
                    </p>
{/if}
                  
                  {#if Object.keys(result.headers).length > 0}
<div class="mt-2">
                      <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {t('corsHeaders')}:
                      </p>
                      <div class="text-xs font-mono bg-white dark:bg-gray-800 p-2 rounded">
                        {#each Object.entries(result.headers) as [key, value] (key)}
<div >
                            <span class="text-amber-600 dark:text-amber-400">{key}:</span> {value}
                          </div>
{/each}
                      </div>
                    </div>
{/if}
                </div>
{/each}
            </div>
{/if}
        </div>
      </div>

      <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <h4 class="font-medium text-amber-800 dark:text-amber-200 mb-2">
          {t('whatIsCors')}
        </h4>
        <p class="text-sm text-amber-700 dark:text-amber-300">
          {t('corsExplanation')}
        </p>
      </div>
    </div>
  
