<script lang="ts">
  import { SAMPLE_PAYLOADS } from '@/lib/tool-stubs';
  import { normalizeHttpUrl } from '@/lib/url-safety';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['webhook-tester'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.webhook-tester.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface WebhookRequest {
  id: string;
  timestamp: Date;
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  status: 'pending' | 'success' | 'error';
  response?: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
    time: number;
  };
  error?: string;
}

  const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;

  const WEBHOOK_SAMPLES: Record<string, string> = {
    json:
      SAMPLE_PAYLOADS.json ??
      '{\n  "event": "ping",\n  "timestamp": "2026-01-01T00:00:00.000Z"\n}',
    github:
      '{\n  "action": "opened",\n  "repository": { "name": "demo-repo" },\n  "pull_request": { "number": 123 }\n}',
    stripe:
      '{\n  "id": "evt_test_123",\n  "type": "payment_intent.succeeded",\n  "data": { "object": { "amount": 1999, "currency": "usd" } }\n}',
  };

  let url = $state('');

  let method = $state('POST');

  let headers = $state('Content-Type: application/json');

  let body = $state(WEBHOOK_SAMPLES.json);

  let requests = $state([]);

  let isLoading = $state(false);

  let copied = $state(null);

  function parseHeaders(headerStr: string) {
    const result: Record<string, string> = {};
    headerStr.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        result[key.trim()] = valueParts.join(':').trim();
      }
    });
    return result;
  }

  async function sendRequest() {
    const normalizedUrl = normalizeHttpUrl(url);
    if (!normalizedUrl.ok) {
      const requestId = Date.now().toString();
      requests = [
        {
          id: requestId,
          timestamp: new Date(),
          method,
          url,
          headers: parseHeaders(headers),
          body: method !== 'GET' ? body : '',
          status: 'error',
          error: normalizedUrl.error,
        },
        ...requests,
      ];
      return;
    }
    url = normalizedUrl.url;

    const requestId = Date.now().toString();
    const parsedHeaders = parseHeaders(headers);
    
    const newRequest: WebhookRequest = {
      id: requestId,
      timestamp: new Date(),
      method,
      url: normalizedUrl.url,
      headers: parsedHeaders,
      body: method !== 'GET' ? body : '',
      status: 'pending',
    };

    requests = [newRequest, ...requests];
    isLoading = true;

    const startTime = performance.now();

    try {
      const response = await fetch(normalizedUrl.url, {
        method,
        headers: parsedHeaders,
        body: method !== 'GET' ? body : undefined,
        mode: 'cors',
      });

      const endTime = performance.now();
      const responseBody = await response.text();
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      requests = requests.map(req => 
        req.id === requestId 
          ? {
              ...req,
              status: response.ok ? 'success' : 'error',
              response: {
                status: response.status,
                statusText: response.statusText,
                headers: responseHeaders,
                body: responseBody,
                time: Math.round(endTime - startTime),
              },
            }
          : req
      );
    } catch (error) {
      requests = requests.map(req => 
        req.id === requestId 
          ? {
              ...req,
              status: 'error',
              error: error instanceof Error ? error.message : 'Request failed',
            }
          : req
      );
    } finally {
      isLoading = false;
    }
  }

  function clearHistory() {
    requests = [];
  }

  function handleCopy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    copied = key;
    setTimeout(() => copied = null, 2000);
  }

  function loadSample(type: keyof typeof WEBHOOK_SAMPLES) {
    body = WEBHOOK_SAMPLES[type] ?? WEBHOOK_SAMPLES.json;
  }

</script>


    <div class="space-y-6">
      <!-- Request Builder -->
      <div class="space-y-4">
        <!-- URL and Method -->
        <div class="flex gap-2">
          <select
            bind:value={method}
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
          >
            {#each METHODS as m (m)}
<option  value={m}>{m}</option>
{/each}
          </select>
          <input
            type="url"
            bind:value={url}
            placeholder={t("urlPlaceholder")}
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <button
            onclick={sendRequest}
            disabled={!url.trim() || isLoading}
            class="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? t('sending') : t('send')}
          </button>
        </div>

        <!-- Headers -->
        <div>
          <label for="webhook-tester-field-3" class="tool-label">
            {t('headers')}
          </label>
          <textarea
            bind:value={headers}
            placeholder={t("headersPlaceholder")}
            rows={3}
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none" id="webhook-tester-field-3"></textarea>
        </div>

        <!-- Body -->
        {#if method !== 'GET'}
<div>
            <div class="flex justify-between items-center mb-2">
              <div class="tool-label">
                {t('requestBody')}
              </div>
              <div class="flex gap-2">
                <button
                  onclick={() => loadSample('json')}
                  class="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400"
                >
                  JSON
                </button>
                <button
                  onclick={() => loadSample('github')}
                  class="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400"
                >
                  GitHub
                </button>
                <button
                  onclick={() => loadSample('stripe')}
                  class="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400"
                >
                  Stripe
                </button>
              </div>
            </div>
            <textarea
              bind:value={body}
              rows={8}
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"></textarea>
          </div>
{/if}
      </div>

      <!-- Request History -->
      {#if requests.length > 0}
<div>
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {t('requestHistory')} ({requests.length})
            </h3>
            <button
              onclick={clearHistory}
              class="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
            >
              {t('clearHistory')}
            </button>
          </div>
          <div class="space-y-4">
            {#each requests as req (req.id)}
<div 
                class={`p-4 rounded-lg border ${
                  req.status === 'success'
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                    : req.status === 'error'
                    ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <!-- Request Info -->
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-3">
                    <span class={`px-2 py-0.5 text-xs font-medium rounded ${
                      req.method === 'GET' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' :
                      req.method === 'POST' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                      req.method === 'PUT' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                      req.method === 'DELETE' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {req.method}
                    </span>
                    <span class="text-sm font-mono text-gray-600 dark:text-gray-400 truncate max-w-md">
                      {req.url}
                    </span>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {req.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                <!-- Response -->
                {#if req.response}
<div class="mt-3 space-y-2">
                    <div class="flex items-center gap-3">
                      <span class={`text-sm font-medium ${req.response.status < 300 ? 'text-green-600 dark:text-green-400' : req.response.status < 400 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                        {req.response.status} {req.response.statusText}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {req.response.time}ms
                      </span>
                    </div>
                    {#if req.response.body}
<div>
                        <div class="flex justify-between items-center mb-1">
                          <span class="text-xs text-gray-500 dark:text-gray-400">{t('responseBody')}</span>
                          <button
                            onclick={() => handleCopy(req.response!.body, req.id)}
                            class="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400"
                          >
                            {copied === req.id ? tCommon('copied') : tCommon('copy')}
                          </button>
                        </div>
                        <pre class="p-2 bg-white dark:bg-gray-900 rounded text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto max-h-40">
                          {req.response.body.length > 1000 
                            ? req.response.body.substring(0, 1000) + '...' 
                            : req.response.body}
                        </pre>
                      </div>
{/if}
                  </div>
{/if}

                <!-- Error -->
                {#if req.error}
<div class="mt-2 text-sm text-red-600 dark:text-red-400">
                    {t('error')}: {req.error}
                  </div>
{/if}

                <!-- Pending -->
                {#if req.status === 'pending'}
<div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {t('sendingRequest')}
                  </div>
{/if}
              </div>
{/each}
          </div>
        </div>
{/if}

      <!-- Tips -->
      <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <h4 class="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">{t('tips')}</h4>
        <ul class="text-sm text-amber-700 dark:text-amber-400 space-y-1">
          <li>• {t('tip1')}</li>
          <li>• {t('tip2')}</li>
          <li>• {t('tip3')}</li>
        </ul>
      </div>
    </div>
  
