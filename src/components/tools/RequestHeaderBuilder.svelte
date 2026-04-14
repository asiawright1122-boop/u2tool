<script lang="ts">
  import { PRESETS } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['request-header-builder'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.request-header-builder.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface Header {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

  const COMMON_HEADERS = [
    { key: 'Content-Type', values: ['application/json', 'application/x-www-form-urlencoded', 'multipart/form-data'] },
    { key: 'Accept', values: ['application/json', 'text/plain', '*/*'] },
    { key: 'Authorization', values: ['Bearer <token>', 'Basic <base64-credentials>'] },
    { key: 'User-Agent', values: ['Mozilla/5.0', 'PostmanRuntime/7.0.0'] },
    { key: 'Cache-Control', values: ['no-cache', 'max-age=3600'] },
    { key: 'X-Requested-With', values: ['XMLHttpRequest'] },
    { key: 'Origin', values: ['https://example.com'] },
    { key: 'Referer', values: ['https://example.com/page'] },
    { key: 'Accept-Language', values: ['en-US,en;q=0.9', 'zh-CN,zh;q=0.9'] },
  ] as const;

  let headers = $state([
    { id: '1', key: 'Content-Type', value: 'application/json', enabled: true },
    { id: '2', key: 'Accept', value: 'application/json', enabled: true },
  ]);

  let copied = $state(false);

  let outputFormat = $state('raw');

  function addHeader() {
    headers = [...headers, { id: Date.now().toString(), key: '', value: '', enabled: true }];
  }

  function removeHeader(id: string) {
    headers = headers.filter(h => h.id !== id);
  }

  function updateHeader(id: string, field: 'key' | 'value' | 'enabled', val: string | boolean) {
    headers = headers.map(h => h.id === id ? { ...h, [field]: val } : h);
  }

  function applyPreset(preset: keyof typeof PRESETS) {
    const newHeaders = PRESETS[preset].map((h, i) => ({
      id: Date.now().toString() + i,
      key: h.key,
      value: h.value,
      enabled: true,
    }));
    headers = newHeaders;
  }

  function clearAll() {
    headers = [];
  }

  let enabledHeaders = $derived(headers.filter(h => h.enabled && h.key.trim()));

  let output = $derived.by(() => {
    if (enabledHeaders.length === 0) return '';

    switch (outputFormat) {
      case 'raw':
        return enabledHeaders.map(h => `${h.key}: ${h.value}`).join('\n');
      case 'json':
        const obj: Record<string, string> = {};
        enabledHeaders.forEach(h => { obj[h.key] = h.value; });
        return JSON.stringify(obj, null, 2);
      case 'curl':
        return enabledHeaders.map(h => `-H "${h.key}: ${h.value}"`).join(' \\\n');
      case 'fetch':
        const fetchObj: Record<string, string> = {};
        enabledHeaders.forEach(h => { fetchObj[h.key] = h.value; });
        return `headers: ${JSON.stringify(fetchObj, null, 2)}`;
      default:
        return '';
    }
  });

  function handleCopy() {
    navigator.clipboard.writeText(output);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <!-- Presets -->
      <div>
        <label class="tool-label">
          Quick Presets
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            onclick={() => applyPreset('json')}
            class="px-3 py-1.5 text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50"
          >
            JSON API
          </button>
          <button
            onclick={() => applyPreset('form')}
            class="px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50"
          >
            Form Data
          </button>
          <button
            onclick={() => applyPreset('cors')}
            class="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-900/50"
          >
            CORS Preflight
          </button>
          <button
            onclick={() => applyPreset('auth')}
            class="px-3 py-1.5 text-sm bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50"
          >
            Auth Bearer
          </button>
        </div>
      </div>

      <!-- Headers List -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="tool-label">
            Headers ({enabledHeaders.length} active)
          </label>
          <div class="flex gap-2">
            <button
              onclick={clearAll}
              class="text-xs text-red-600 hover:text-red-700 dark:text-red-400"
            >
              {tCommon('clear')} All
            </button>
          </div>
        </div>
        <div class="space-y-2">
          {#each headers as header (header.id)}
<div  class="flex items-center gap-2">
              <input
                type="checkbox"
                checked={header.enabled}
                onchange={(e) => updateHeader(header.id, 'enabled', e.target.checked)}
                class="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
              />
              <div class="flex-1 grid grid-cols-2 gap-2">
                <div class="relative">
                  <input
                    type="text"
                    value={header.key}
                    onchange={(e) => updateHeader(header.id, 'key', e.target.value)}
                    placeholder={t("headerNamePlaceholder")}
                    list={`headers-${header.id}`}
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                  <datalist id={`headers-${header.id}`}>
                    {#each COMMON_HEADERS as h (h.key)}
<option  value={h.key}></option>
{/each}
                  </datalist>
                </div>
                <div class="relative">
                  <input
                    type="text"
                    value={header.value}
                    onchange={(e) => updateHeader(header.id, 'value', e.target.value)}
                    placeholder={t("valuePlaceholder")}
                    list={`values-${header.id}`}
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                  <datalist id={`values-${header.id}`}>
                    {#each (COMMON_HEADERS.find(h => h.key === header.key)?.values ?? []) as v (v)}
<option  value={v}></option>
{/each}
                  </datalist>
                </div>
              </div>
              <button
                onclick={() => removeHeader(header.id)}
                class="p-2 text-red-500 hover:text-red-600 dark:text-red-400"
              >
                ✕
              </button>
            </div>
{/each}
        </div>
        <button
          onclick={addHeader}
          class="mt-3 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          + Add Header
        </button>
      </div>

      <!-- Output Format -->
      <div>
        <label class="tool-label">
          {tCommon('output')} Format
        </label>
        <div class="flex flex-wrap gap-2">
          {#each (['raw', 'json', 'curl', 'fetch'] as const) as fmt (fmt)}
<button 
              onclick={() => outputFormat = fmt}
              class={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                outputFormat === fmt
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {fmt.toUpperCase()}
            </button>
{/each}
        </div>
      </div>

      <!-- Output -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="tool-label">
            {tCommon('output')}
          </label>
          <button
            onclick={handleCopy}
            disabled={!output}
            class="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 disabled:opacity-50"
          >
            {copied ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 min-h-[120px]">
          {output || 'No headers configured'}
        </pre>
      </div>

      <!-- Common Headers Reference -->
      <div>
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Common HTTP Headers Reference
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {#each COMMON_HEADERS.slice(0, 9) as h (h.key)}
<button 
              onclick={() => {
                headers = [...headers, {
                  id: Date.now().toString(),
                  key: h.key,
                  value: h.values[0],
                  enabled: true,
                }];
              }}
              class="p-2 text-left text-xs bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-500"
            >
              <span class="font-medium text-gray-900 dark:text-white">{h.key}</span>
              <span class="block text-gray-500 dark:text-gray-400 truncate">{h.values[0]}</span>
            </button>
{/each}
        </div>
      </div>
    </div>
  
