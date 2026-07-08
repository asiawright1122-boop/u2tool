<script lang="ts">
  import { EXAMPLE_CODE, findUnusedImports, generateCleanedCode } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['unused-imports-finder'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.unused-imports-finder.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ImportInfo {
  line: number;
  statement: string;
  imports: string[];
  source: string;
  used: string[];
  unused: string[];
}

  let code = $state('');

  let copied = $state(false);

  let result = $derived.by(() => {
    if (!code.trim()) return null;
    const imports = findUnusedImports(code);
    const cleanedCode = generateCleanedCode(code, imports);
    const unusedCount = imports.reduce((sum, imp) => sum + imp.unused.length, 0);
    return { imports, cleanedCode, unusedCount };
  });

  function handleClear() { return code = ''; }

  function loadExample() { return code = EXAMPLE_CODE; }

  function handleCopy() {
    if (result) {
      navigator.clipboard.writeText(result.cleanedCode);
      copied = true;
      setTimeout(() => copied = false, 2000);
    }
  }

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
          <div class="grid grid-cols-3 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{result.imports.length}</div>
              <div class="text-sm text-gray-500">{t('importStatements')}</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div class={`text-2xl font-bold ${result.unusedCount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {result.unusedCount}
              </div>
              <div class="text-sm text-gray-500">{t('unusedImports')}</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div class="text-2xl font-bold text-green-600">
                {result.imports.reduce((sum, imp) => sum + imp.used.length, 0)}
              </div>
              <div class="text-sm text-gray-500">{t('usedImports')}</div>
            </div>
          </div>

          {#if result.imports.filter(imp => imp.unused.length > 0).length > 0}
<div class="space-y-3">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">{t('unusedImports')}</h3>
              {#each result.imports.filter(imp => imp.unused.length > 0) as imp, idx (idx)}
<div  class="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs text-orange-600 dark:text-orange-400">Line {imp.line}</span>
                    <span class="text-xs text-gray-500">{imp.source}</span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    {#each imp.imports as name, i (i)}
<span  class={`px-2 py-0.5 text-xs rounded ${
                        imp.unused.includes(name) 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 line-through' 
                          : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                      }`}>
                        {name}
                      </span>
{/each}
                  </div>
                </div>
{/each}
            </div>
{/if}

          <div>
            <div class="flex justify-between items-center mb-2">
              <div class="tool-label">Cleaned Code</div>
              <button onclick={handleCopy} class="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400">
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
            </div>
            <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 max-h-64">
              {result.cleanedCode}
            </pre>
          </div>
        </div>
{/if}
    </div>
  
