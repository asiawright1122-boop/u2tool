<script lang="ts">
  import { EXAMPLE_CODE, analyzePerformance } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['performance-profiler'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.performance-profiler.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ProfileResult {
  totalTime: number;
  operations: Array<{
    name: string;
    time: number;
    percentage: number;
    calls: number;
  }>;
  hotspots: string[];
  suggestions: string[];
}

  let code = $state('');

  let result = $derived.by(() => {
    if (!code.trim()) return null;
    return analyzePerformance(code);
  });

  function handleClear() { return code = ''; }

  function loadExample() { return code = EXAMPLE_CODE; }

</script>


    <div class="space-y-6">
      <div>
        <div class="flex justify-between items-center mb-2">
          <div class="tool-label">Code {tCommon('input')}</div>
          <button onclick={loadExample} class="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400">{t('loadExample')}</button>
        </div>
        <textarea bind:value={code} placeholder={t("inputPlaceholder")}
          class="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"></textarea>
      </div>

      <button onclick={handleClear} class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">{tCommon('clear')}</button>

      {#if result}
<div class="space-y-6">
          <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-900 dark:text-white">{result.totalTime}ms</div>
              <div class="text-sm text-gray-500">Estimated Execution Time</div>
            </div>
          </div>

          {#if result.operations.length > 0}
<div>
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Operations Breakdown</h3>
              <div class="space-y-2">
                {#each result.operations.slice(0, 10) as op, idx (idx)}
<div  class="flex items-center gap-3">
                    <div class="w-32 text-sm font-mono text-gray-700 dark:text-gray-300">{op.name}</div>
                    <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div class={`h-full ${op.percentage > 30 ? 'bg-red-500' : op.percentage > 15 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style="width: {Math.max(op.percentage, 2)}%" ></div>
                    </div>
                    <div class="w-16 text-right text-sm text-gray-500">{op.time}ms</div>
                    <div class="w-12 text-right text-xs text-gray-400">×{op.calls}</div>
                  </div>
{/each}
              </div>
            </div>
{/if}

          {#if result.hotspots.length > 0}
<div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 class="text-sm font-medium text-red-800 dark:text-red-300 mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> Performance Hotspots</h4>
              <ul class="text-sm text-red-700 dark:text-red-400 space-y-1">
                {#each result.hotspots as h, i (i)}
<li >• {h}</li>
{/each}
              </ul>
            </div>
{/if}

          {#if result.suggestions.length > 0}
<div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <h4 class="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> Suggestions</h4>
              <ul class="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                {#each result.suggestions as s, i (i)}
<li >• {s}</li>
{/each}
              </ul>
            </div>
{/if}
        </div>
{/if}
    </div>
  
