<script lang="ts">
  import { onDestroy } from 'svelte';
  import { extractPatterns } from '@/lib/tool-stubs';

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
  export type ExtractType = 'email' | 'url' | 'phone' | 'ip' | 'number' | 'hashtag' | 'mention';

  let input = $state('');

  let extractType = $state('email');

  let results = $state([]);

  let allResults = $state(null as Record<ExtractType, string[]> | null);

  let copied = $state(false);

  let timerRef = $state(null);

  function handleExtract() {
    if (extractType === 'all') {
      const all = extractAll(input);
      allResults = all;
      results = [];
    } else {
      const extracted = extractFromText(input, extractType);
      results = extracted;
      allResults = null;
    }
  }  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  export function extractFromText(text: string, type: ExtractType): string[] {
  const pattern = extractPatterns[type];
  const matches = text.match(pattern) || [];
  return [...new Set(matches)]; // 去重
}
  export function extractAll(text: string): Record<ExtractType, string[]> {
  const result: Record<ExtractType, string[]> = {
    email: [],
    url: [],
    phone: [],
    ip: [],
    number: [],
    hashtag: [],
    mention: [],
  };
  
  for (const type of Object.keys(extractPatterns)) {
    result[type] = extractFromText(text, type);
  }
  
  return result;
}
  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  async function handleCopyAll() {
    const text = results.join('\n');
    await handleCopy(text);
  }
  function handleClear() {
    input = '';
    results = [];
    allResults = null;
  }
  function loadExample() {
    input = `联系我们：support@example.com 或 sales@company.org
访问我们的网站：https://www.example.com/page?id=123
电话：+86 138-1234-5678 或 (021) 1234-5678
服务器 IP：192.168.1.1 和 10.0.0.255
价格：$99.99 和 ¥688
关注我们 @twitter_user #开发者工具 #DevTools`;
  }
  const extractTypes: { value: ExtractType | 'all'; label: string }[] = [
    { value: 'email', label: t('extractor.email') },
    { value: 'url', label: t('extractor.url') },
    { value: 'phone', label: t('extractor.phone') },
    { value: 'ip', label: t('extractor.ip') },
    { value: 'number', label: t('extractor.number') },
    { value: 'hashtag', label: t('extractor.hashtag') },
    { value: 'mention', label: t('extractor.mention') },
    { value: 'all', label: t('all') },
  ];
  const totalResults = allResults 
    ? Object.values(allResults).reduce((sum, arr) => sum + arr.length, 0)
    : results.length;

</script>


    <div class="space-y-4">
      <!-- 控制面板 -->
      <div class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
        <div class="flex flex-wrap gap-4 items-end">
          <div class="flex-1 min-w-[200px]">
            <label for="text-extractor-field-5" class="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('extractor.type')}</label>
            <select
              value={extractType}
              onchange={(e) => extractType = e.target.value as ExtractType | 'all'}
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white" id="text-extractor-field-5">
              {#each extractTypes as { value, label } (value)}
<option  value={value}>{label}</option>
{/each}
            </select>
          </div>
          
          <div class="flex gap-2">
            <button
              onclick={handleExtract}
              class="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded text-sm font-medium text-white"
            >
              {t('extractor.extract')}
            </button>
            <button
              onclick={loadExample}
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-700 dark:text-white"
            >
              {t('extractor.loadExample')}
            </button>
            <button
              onclick={handleClear}
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-700 dark:text-white"
            >
              {t('clear')}
            </button>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div>
        <label for="text-extractor-field-4" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('input')}</label>
        <textarea
          bind:value={input}
          placeholder={t('extractor.placeholder')}
          class="w-full h-40 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded font-mono text-sm text-gray-900 dark:text-white resize-none focus:outline-none focus:border-amber-500" id="text-extractor-field-4"></textarea>
      </div>

      <!-- 结果区域 -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {t('result')} ({totalResults} {t('extractor.found')})
          </div>
          {#if results.length > 0}
<button
              onclick={handleCopyAll}
              class={`px-2 py-1 text-xs rounded ${
                copied ? 'btn-success' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white'
              }`}
            >
              {copied ? t('copied') : t('extractor.copyAll')}
            </button>
{/if}
        </div>

        <!-- 单类型结果 -->
        {#if results.length > 0}
<div class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2 max-h-64 overflow-y-auto">
            {#each results as item, index (index)}
<div 
                class="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700/50 rounded group"
              >
                <span class="font-mono text-sm break-all text-gray-900 dark:text-white">{item}</span>
                <button
                  onclick={() => handleCopy(item)}
                  class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0 text-gray-700 dark:text-white"
                >
                  {t('copy')}
                </button>
              </div>
{/each}
          </div>
{/if}

        <!-- 全部类型结果 -->
        {#if allResults}
<div class="space-y-3">
            {#each (Object.entries(allResults) as [ExtractType, string[]][]) as [type, items] (type)}
{#if items.length > 0}
                <div  class="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-amber-600 dark:text-amber-400">
                      {extractTypes.find(t => t.value === type)?.label} ({items.length})
                    </span>
                  </div>
                  <div class="space-y-1">
                    {#each items as item, index (index)}
<div 
                        class="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700/50 rounded group text-sm"
                      >
                        <span class="font-mono break-all text-gray-900 dark:text-white">{item}</span>
                        <button
                          onclick={() => handleCopy(item)}
                          class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0 text-gray-700 dark:text-white"
                        >
                          {t('copy')}
                        </button>
                      </div>
{/each}
                  </div>
                </div>
              {/if}
{/each}
          </div>
{/if}

        <!-- 无结果提示 -->
        {#if totalResults === 0}
{#if input}
          <div class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center text-gray-600 dark:text-gray-300">
            {t('extractor.noResults')}
          </div>
        {/if}
{/if}
      </div>

      <!-- 说明 -->
      <div class="p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-300">
        <div class="font-medium mb-1">{t('extractor.supportedTypes')}</div>
        <ul class="list-disc list-inside space-y-1">
          <li><strong>{t('extractor.email')}</strong>: user@example.com</li>
          <li><strong>{t('extractor.url')}</strong>: https://example.com</li>
          <li><strong>{t('extractor.phone')}</strong>: +86 138-1234-5678</li>
          <li><strong>{t('extractor.ip')}</strong>: 192.168.1.1</li>
          <li><strong>{t('extractor.number')}</strong>: 123, -45.67</li>
          <li><strong>{t('extractor.hashtag')}</strong>: #DevTools</li>
          <li><strong>{t('extractor.mention')}</strong>: @username</li>
        </ul>
      </div>
    </div>
  
