<script lang="ts">
  import { LICENSES } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['license-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.license-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface LicenseTemplate {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  conditions: string[];
  limitations: string[];
  template: string;
}

  let selectedLicense = $state('mit');

  let author = $state('');

  let year = $state(new Date().getFullYear().toString());

  let output = $state('');

  let copied = $state(false);

  // Functions
  const currentLicense = LICENSES.find(l => l.id === selectedLicense);
  function generateLicense() {
    if (!currentLicense) return;
    
    let licenseText = currentLicense.template;
    licenseText = licenseText.replace(/\{\{year\}\}/g, year);
    licenseText = licenseText.replace(/\{\{author\}\}/g, author || '[Author Name]');
    
    output = licenseText;
  }
  async function copyToClipboard() {
    await navigator.clipboard.writeText(output);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
  function downloadFile() {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'LICENSE';
    link.click();
    URL.revokeObjectURL(url);
  }
  function clearAll() {
    selectedLicense = 'mit';
    author = '';
    year = new Date().getFullYear().toString();
    output = '';
  }

</script>


    <div class="space-y-6">
      <!-- License Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('selectLicense')}
        </label>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          {#each LICENSES as license (license.id)}
<button 
              onclick={() => selectedLicense = license.id}
              class={`p-3 rounded-lg text-left ${
                selectedLicense === license.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <div class="font-medium text-sm">{license.name}</div>
            </button>
{/each}
        </div>
      </div>

      <!-- License Info -->
      {#if currentLicense}
<div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
          <h3 class="font-medium text-gray-900 dark:text-gray-100">{currentLicense.name}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">{currentLicense.description}</p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <h4 class="font-medium text-green-600 dark:text-green-400 mb-1">{t('permissions')}</h4>
              <ul class="space-y-1">
                {#each currentLicense.permissions as p (p)}
<li  class="text-gray-600 dark:text-gray-400">✓ {p}</li>
{/each}
              </ul>
            </div>
            <div>
              <h4 class="font-medium text-blue-600 dark:text-blue-400 mb-1">{t('conditions')}</h4>
              <ul class="space-y-1">
                {#if currentLicense.conditions.length > 0}
{#each currentLicense.conditions as c (c)}
<li  class="text-gray-600 dark:text-gray-400">• {c}</li>
{/each}
{:else}
<li class="text-gray-400 dark:text-gray-500">{t('none')}</li>
{/if}
              </ul>
            </div>
            <div>
              <h4 class="font-medium text-red-600 dark:text-red-400 mb-1">{t('limitations')}</h4>
              <ul class="space-y-1">
                {#each currentLicense.limitations as l (l)}
<li  class="text-gray-600 dark:text-gray-400">✕ {l}</li>
{/each}
              </ul>
            </div>
          </div>
        </div>
{/if}

      <!-- Author Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('author')}
          </label>
          <input
            type="text"
            bind:value={author}
            placeholder={t('authorPlaceholder')}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('year')}
          </label>
          <input
            type="text"
            bind:value={year}
            placeholder={t('yearPlaceholder')}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-center gap-4">
        <button
          onclick={generateLicense}
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white"
        >
          {t('generate')}
        </button>
        <button
          onclick={clearAll}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium text-gray-900 dark:text-gray-100"
        >
          {tCommon('clear')}
        </button>
      </div>

      <!-- Output -->
      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">LICENSE</label>
            <div class="flex gap-2">
              <button
                onclick={copyToClipboard}
                class="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
              >
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
              <button
                onclick={downloadFile}
                class="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm text-white"
              >
                {t('download')}
              </button>
            </div>
          </div>
          <pre class="w-full p-4 bg-gray-900 dark:bg-gray-950 border border-gray-700 rounded-lg font-mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
            {output}
          </pre>
        </div>
{/if}
    </div>
  
