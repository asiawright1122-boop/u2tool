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


    <div class="space-y-8">
      <!-- Input -->
      <section class="glass-card p-6">
        <div class="flex justify-between items-end mb-4">
          <label class="tool-label !mb-0">
            {tCommon('input')} <span class="text-[10px] opacity-40 ml-1 font-mono tracking-tighter">(JSON, HTTP, XML)</span>
          </label>
          <div class="flex gap-4">
            <button
              onclick={() => loadExample('json')}
              class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-amber-500 transition-colors"
            >
              JSON
            </button>
            <button
              onclick={() => loadExample('http')}
              class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-amber-500 transition-colors"
            >
              HTTP
            </button>
            <button
              onclick={() => loadExample('xml')}
              class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-amber-500 transition-colors"
            >
              XML
            </button>
          </div>
        </div>
        <textarea
          bind:value={input}
          placeholder={t("inputPlaceholder")}
          class="tool-textarea h-48"></textarea>

        <!-- Options -->
        <div class="mt-6 flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-slate-200/60 dark:border-white/5">
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-3">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('indent')}</label>
              <select
                value={indentSize}
                onchange={(e) => indentSize = parseInt(e.target.value)}
                class="px-3 py-1.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white text-xs font-bold"
              >
                <option value={2}>2 {t('spaces')}</option>
                <option value={4}>4 {t('spaces')}</option>
                <option value={0}>{t('minified')}</option>
              </select>
            </div>
            <label class="flex items-center gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer group">
              <input
                type="checkbox"
                bind:checked={sortKeys}
                class="w-4 h-4 rounded border-slate-300 dark:border-white/10 text-amber-500 focus:ring-amber-500/20 bg-white dark:bg-slate-900"
              />
              <span class="group-hover:text-amber-500 transition-colors">{t('sortKeysAlphabetically')}</span>
            </label>
          </div>
          
          <button
            onclick={handleClear}
            class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-red-500 transition-all flex items-center gap-2 group"
          >
            <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-red-500"></span>
            {tCommon('clear')}
          </button>
        </div>
      </section>

      <!-- Error -->
      {#if input.trim() && !parsed}
        <div class="tool-error flex items-center gap-3">
          <span class="text-sm">⚠️</span>
          {t('unableToParse')}
        </div>
      {/if}

      <!-- Parsed Result -->
      {#if parsed}
        <div class="space-y-6">
          <!-- Status and Headers -->
          {#if parsed.status || (parsed.headers && Object.keys(parsed.headers).length > 0)}
            <section class="glass-card p-6 overflow-hidden">
              <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Response Metadata
              </h4>
              
              {#if parsed.status}
                <div class="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200/60 dark:border-white/5">
                  <span class={`px-4 py-1.5 text-xs font-black rounded-xl tracking-wider shadow-sm ${parsed.status < 300 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : parsed.status < 400 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'}`}>
                    {parsed.status} {parsed.statusText}
                  </span>
                </div>
              {/if}

              {#if parsed.headers && Object.keys(parsed.headers).length > 0}
                <div class="space-y-1.5 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                  {#each Object.entries(parsed.headers) as [key, value] (key)}
                    <div class="flex items-baseline gap-3 text-[11px] font-mono group/header">
                      <span class="text-amber-600 dark:text-amber-500 font-bold shrink-0">{key}:</span>
                      <span class="text-slate-600 dark:text-slate-300 break-all">{value}</span>
                    </div>
                  {/each}
                </div>
              {/if}
            </section>
          {/if}

          <!-- Formatted Body -->
          {#if formattedBody}
            <div class="glass-card p-6">
              <div class="flex justify-between items-center mb-6">
                <label class="tool-label !mb-0">
                  {tCommon('output')}
                  {#if parsed.contentType}
                    <span class="text-[10px] opacity-40 font-mono tracking-tighter ml-2">({parsed.contentType})</span>
                  {/if}
                </label>
                <div class="flex items-center gap-6">
                  {#if typeof parsed.body === 'object' && parsed.body !== null}
                    <div class="hidden sm:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400/60">
                      <span>Keys: {countKeys(parsed.body)}</span>
                      <span>Depth: {getDepth(parsed.body)}</span>
                      <span>{new Blob([formattedBody]).size} B</span>
                    </div>
                  {/if}
                  <button
                    onclick={handleCopy}
                    class="btn-primary !px-6 !py-2 !text-[10px] !rounded-xl active:scale-95"
                  >
                    {copied ? tCommon('copied') : tCommon('copy')}
                  </button>
                </div>
              </div>
              <div class="relative group/output">
                <pre class="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl overflow-x-auto text-[13px] font-mono text-slate-800 dark:text-amber-50/90 max-h-[500px] border border-slate-200/60 dark:border-white/5 shadow-inner">
                  <code>{formattedBody}</code>
                </pre>
                <div class="absolute inset-0 pointer-events-none border border-amber-500/0 group-hover/output:border-amber-500/10 transition-colors rounded-2xl"></div>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  
