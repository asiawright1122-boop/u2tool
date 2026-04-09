<script lang="ts">
  import { headerDescriptions } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ParsedHeader {
  name: string;
  value: string;
  description: string;
}

  let input = $state('');

  let headers = $state([]);

  // Functions
  export function parseHeaders(input: string): ParsedHeader[] {
  const lines = input.split('\n').filter(line => line.trim());
  const headers: ParsedHeader[] = [];

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const name = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      const description = headerDescriptions[name.toLowerCase()] || '';
      headers.push({ name, value, description });
    }
  }

  return headers;
}
  function handleParse() {
    headers = parseHeaders(input);
  }
  function loadExample() {
    const example = `Content-Type: application/json; charset=utf-8
Content-Length: 1234
Cache-Control: max-age=3600, public
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept: application/json
Accept-Encoding: gzip, deflate, br
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0
Host: api.example.com
Connection: keep-alive
X-Requested-With: XMLHttpRequest`;
    input = example;
    headers = parseHeaders(example);
  }

</script>


    <div class="space-y-6">
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium">{t('httpHeader.input')}</label>
          <button
            onclick={loadExample}
            class="text-sm text-blue-400 hover:text-blue-300"
          >
            {t('httpHeader.loadExample')}
          </button>
        </div>
        <textarea
          bind:value={input}
          placeholder={t('httpHeader.placeholder')}
          class="w-full h-48 p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
      </div>

      <button onclick={handleParse} class="btn-primary w-full">
        {t('httpHeader.parse')}
      </button>

      {#if headers.length > 0}
<div class="space-y-3">
          <div class="text-sm font-medium text-gray-900 dark:text-white">{t('httpHeader.parsed')} ({headers.length})</div>
          <div class="space-y-2">
            {#each headers as header, index (index)}
<div  class="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
                <div class="flex flex-wrap items-start gap-2">
                  <span class="px-2 py-1 bg-blue-600 text-white rounded text-sm font-medium">
                    {header.name}
                  </span>
                  <span class="flex-1 font-mono text-sm text-gray-600 dark:text-gray-300 break-all">
                    {header.value}
                  </span>
                </div>
                {#if header.description}
<div class="mt-2 text-xs text-gray-500 dark:text-gray-300">{header.description}</div>
{/if}
              </div>
{/each}
          </div>
        </div>
{/if}
    </div>
  
