<script lang="ts">
  import { formatJson, parseResponse, sortObject } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['api-response-formatter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.api-response-formatter.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ParsedResponse {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  body?: unknown;
  contentType?: string;
}

  let input = $state('');

  let indentSize = $state(2);

  let sortKeys = $state(false);

  let copied = $state(false);

  let parsed = $derived.by(() => {
    if (!input.trim()) return null;
    return parseResponse(input);
  });

  let formattedBody = $derived.by(() => {
    if (!parsed?.body) return '';
    
    if (typeof parsed.body === 'string') {
      if (parsed.contentType?.includes('xml')) {
        return formatXml(parsed.body);
      }
      return parsed.body;
    }
    
    let obj: unknown = parsed.body;
    if (sortKeys && typeof obj === 'object' && obj !== null) {
      obj = sortObject(obj);
    }
    
    return formatJson(obj, indentSize);
  });

  function handleCopy() {
    navigator.clipboard.writeText(formattedBody);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  function handleClear() {
    input = '';
  }

  function loadExample(type: 'json' | 'http' | 'xml') {
    const examples = {
      json: `{"users":[{"id":1,"name":"John Doe","email":"john@example.com","roles":["admin","user"]},{"id":2,"name":"Jane Smith","email":"jane@example.com","roles":["user"]}],"total":2,"page":1}`,
      http: `HTTP/1.1 200 OK
Content-Type: application/json
X-Request-Id: abc123
Cache-Control: no-cache

{"success":true,"data":{"id":123,"message":"Operation completed"},"timestamp":"2024-01-15T10:30:00Z"}`,
      xml: `<?xml version="1.0" encoding="UTF-8"?><response><status>success</status><data><user><id>1</id><name>John</name></user></data></response>`,
    };
    input = examples[type];
  }

  function formatXml(xml: string): string {
    const compact = xml.replace(/>\s*</g, '><').trim();
    let indent = 0;

    return compact
      .replace(/></g, '>\n<')
      .split('\n')
      .map((line) => {
        if (line.startsWith('</')) {
          indent = Math.max(indent - 1, 0);
        }

        const formattedLine = `${'  '.repeat(indent)}${line}`;

        if (/^<[^!?/][^>]*[^/]>/u.test(line) && !line.includes('</')) {
          indent += 1;
        }

        return formattedLine;
      })
      .join('\n');
  }

  function countKeys(value: unknown): number {
    if (Array.isArray(value)) {
      return value.reduce((sum, item) => sum + countKeys(item), value.length);
    }

    if (!value || typeof value !== 'object') {
      return 0;
    }

    return Object.values(value).reduce((sum, item) => sum + countKeys(item), Object.keys(value).length);
  }

  function getDepth(value: unknown): number {
    if (!value || typeof value !== 'object') {
      return 0;
    }

    if (Array.isArray(value)) {
      return value.length === 0 ? 1 : 1 + Math.max(...value.map((item) => getDepth(item)));
    }

    const children = Object.values(value);
    return children.length === 0 ? 1 : 1 + Math.max(...children.map((item) => getDepth(item)));
  }

</script>


    <div class="space-y-6">
      <!-- Input -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            API Response {tCommon('input')}
          </label>
          <div class="flex gap-2">
            <button
              onclick={() => loadExample('json')}
              class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              JSON
            </button>
            <button
              onclick={() => loadExample('http')}
              class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              HTTP
            </button>
            <button
              onclick={() => loadExample('xml')}
              class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              XML
            </button>
          </div>
        </div>
        <textarea
          bind:value={input}
          placeholder={t("inputPlaceholder")}
          class="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"></textarea>
      </div>

      <!-- Options -->
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-700 dark:text-gray-300">{t('indent')}:</label>
          <select
            value={indentSize}
            onchange={(e) => indentSize = parseInt(e.target.value)}
            class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value={2}>2 {t('spaces')}</option>
            <option value={4}>4 {t('spaces')}</option>
            <option value={0}>{t('minified')}</option>
          </select>
        </div>
        <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            bind:checked={sortKeys}
            class="rounded border-gray-300 dark:border-gray-600"
          />
          {t('sortKeysAlphabetically')}
        </label>
        <button
          onclick={handleClear}
          class="px-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          {tCommon('clear')}
        </button>
      </div>

      <!-- Error -->
      {#if input.trim()}
{#if !parsed}
        <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {t('unableToParse')}
        </div>
      {/if}
{/if}

      <!-- Parsed Result -->
      {#if parsed}
<div class="space-y-4">
          <!-- Status and Headers -->
          {#if parsed.status || parsed.headers}
<div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              {#if parsed.status}
<div class="flex items-center gap-2 mb-3">
                  <span class={`px-2 py-0.5 text-sm font-medium rounded ${parsed.status < 300 ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : parsed.status < 400 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'}`}>
                    {parsed.status}
                  </span>
                  <span class="text-gray-600 dark:text-gray-400">{parsed.statusText}</span>
                </div>
{/if}
              {#if parsed.headers}
{#if Object.keys(parsed.headers).length > 0}
                <div>
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('headers')}</h4>
                  <div class="space-y-1">
                    {#each Object.entries(parsed.headers) as [key, value] (key)}
<div  class="text-sm font-mono">
                        <span class="text-blue-600 dark:text-blue-400">{key}:</span>
                        <span class="text-gray-600 dark:text-gray-400 ml-2">{value}</span>
                      </div>
{/each}
                  </div>
                </div>
              {/if}
{/if}
            </div>
{/if}

          <!-- Formatted Body -->
          {#if formattedBody}
<div>
              <div class="flex justify-between items-center mb-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Formatted {tCommon('output')}
                  {#if parsed.contentType}
<span class="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      ({parsed.contentType})
                    </span>
{/if}
                </label>
                <button
                  onclick={handleCopy}
                  class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {copied ? tCommon('copied') : tCommon('copy')}
                </button>
              </div>
              <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 max-h-96">
                {formattedBody}
              </pre>
            </div>
{/if}

          <!-- Stats -->
          {#if typeof parsed.body === 'object'}
{#if parsed.body !== null}
            <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>{t('keys')}: {countKeys(parsed.body)}</span>
              <span>{t('depth')}: {getDepth(parsed.body)}</span>
              <span>{t('size')}: {new Blob([formattedBody]).size} {t('bytes')}</span>
            </div>
          {/if}
{/if}
        </div>
{/if}
    </div>
  
