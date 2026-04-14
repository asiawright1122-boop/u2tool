<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['api-tester'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.api-tester.${key}`;
  }

  // Types
  interface Header {
  key: string;
  value: string;
  enabled: boolean;
}
  interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
}

  let url = $state('');

  let method = $state('GET');

  let headers = $state([
    { key: 'Content-Type', value: 'application/json', enabled: true }
  ]);

  let body = $state('');

  let response = $state(null);

  let loading = $state(false);

  let error = $state('');

  let activeTab = $state('headers');

  // Functions
  function addHeader() {
    headers = [...headers, { key: '', value: '', enabled: true }];
  }
  function updateHeader(index: number, field: keyof Header, value: string | boolean) {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    headers = newHeaders;
  }
  function removeHeader(index: number) {
    headers = headers.filter((_, i) => i !== index);
  }
  async function sendRequest() {
    if (!url) {
      error = 'Please enter a URL';
      return;
    }

    loading = true;
    error = '';
    response = null;

    const startTime = Date.now();

    try {
      const requestHeaders: Record<string, string> = {};
      headers.filter(h => h.enabled && h.key).forEach(h => {
        requestHeaders[h.key] = h.value;
      });

      const options: RequestInit = {
        method,
        headers: requestHeaders,
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
        options.body = body;
      }

      const res = await fetch(url, options);
      const endTime = Date.now();

      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let responseBody = '';
      try {
        const text = await res.text();
        try {
          responseBody = JSON.stringify(JSON.parse(text), null, 2);
        } catch {
          responseBody = text;
        }
      } catch {
        responseBody = 'Cannot read response body';
      }

      response = {
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: responseBody,
        time: endTime - startTime,
      };
      activeTab = 'response';
    } catch (e) {
      error = (e as Error).message;
    } finally {
      loading = false;
    }
  }
  function getStatusColor(status: number) {
    if (status >= 200 && status < 300) return 'text-green-500';
    if (status >= 300 && status < 400) return 'text-yellow-500';
    if (status >= 400 && status < 500) return 'text-orange-500';
    return 'text-red-500';
  }
  function loadExample() {
    url = 'https://jsonplaceholder.typicode.com/posts/1';
    method = 'GET';
  }

</script>


    <div class="space-y-6">
      <div class="flex gap-4">
        <select
          bind:value={method}
          class="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
          <option value="HEAD">HEAD</option>
          <option value="OPTIONS">OPTIONS</option>
        </select>
        <input
          type="text"
          bind:value={url}
          placeholder={t('urlPlaceholder')}
          class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
        />
        <button
          onclick={sendRequest}
          disabled={loading}
          class="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium disabled:opacity-50"
        >
          {loading ? t('sending') : t('send')}
        </button>
      </div>

      <button
        onclick={loadExample}
        class="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400"
      >
        {t('loadExample')}
      </button>

      <div class="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <div class="flex border-b border-gray-300 dark:border-gray-600">
          <button
            onclick={() => activeTab = 'headers'}
            class={`px-4 py-2 text-sm font-medium ${
              activeTab === 'headers'
                ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-b-2 border-amber-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {t('headers')} ({headers.length})
          </button>
          <button
            onclick={() => activeTab = 'body'}
            class={`px-4 py-2 text-sm font-medium ${
              activeTab === 'body'
                ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-b-2 border-amber-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {t('body')}
          </button>
          {#if response}
<button
              onclick={() => activeTab = 'response'}
              class={`px-4 py-2 text-sm font-medium ${
                activeTab === 'response'
                  ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-b-2 border-amber-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {t('response')} <span class={getStatusColor(response.status)}>{response.status}</span>
            </button>
{/if}
        </div>

        <div class="p-4">
          {#if activeTab === 'headers'}
<div class="space-y-2">
              {#each headers as header, index (index)}
<div  class="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={header.enabled}
                    onchange={(e) => updateHeader(index, 'enabled', e.target.checked)}
                    class="rounded"
                  />
                  <input
                    type="text"
                    value={header.key}
                    onchange={(e) => updateHeader(index, 'key', e.target.value)}
                    placeholder={t('headerNamePlaceholder')}
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                  <input
                    type="text"
                    value={header.value}
                    onchange={(e) => updateHeader(index, 'value', e.target.value)}
                    placeholder={t('headerValuePlaceholder')}
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                  <button
                    onclick={() => removeHeader(index)}
                    class="p-2 text-red-500 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
{/each}
              <button
                onclick={addHeader}
                class="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400"
              >
                + {t('addHeader')}
              </button>
            </div>
{/if}

          {#if activeTab === 'body'}
<textarea
              bind:value={body}
              placeholder={t('bodyPlaceholder')}
              class="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"></textarea>
{/if}

          {#if activeTab === 'response'}
{#if response}
            <div class="space-y-4">
              <div class="flex items-center gap-4 text-sm">
                <span class={`font-bold ${getStatusColor(response.status)}`}>
                  {response.status} {response.statusText}
                </span>
                <span class="text-gray-500">{response.time}ms</span>
              </div>
              
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('responseHeaders')}
                </h4>
                <div class="text-xs font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded max-h-32 overflow-auto">
                  {#each Object.entries(response.headers) as [key, value] (key)}
<div >
                      <span class="text-amber-600 dark:text-amber-400">{key}:</span> {value}
                    </div>
{/each}
                </div>
              </div>

              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('responseBody')}
                </h4>
                <pre class="text-sm font-mono bg-gray-50 dark:bg-gray-900 p-4 rounded overflow-auto max-h-64 text-gray-900 dark:text-white">
                  {response.body}
                </pre>
              </div>
            </div>
          {/if}
{/if}
        </div>
      </div>

      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
{/if}
    </div>
  
