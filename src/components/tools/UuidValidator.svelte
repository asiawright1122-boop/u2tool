<script lang="ts">
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
  interface ValidationResult {
  isValid: boolean;
  version: string | null;
  variant: string | null;
}

  let input = $state('');

  let results = $state([]);

  // Functions
  function validateUuid(uuid: string): ValidationResult {
    const trimmed = uuid.trim();
    
    // Standard UUID regex
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-([1-5])[0-9a-f]{3}-([89ab])[0-9a-f]{3}-[0-9a-f]{12}$/i;
    const match = trimmed.match(uuidRegex);
    
    if (!match) {
      // Check for UUID without dashes
      const noDashRegex = /^[0-9a-f]{32}$/i;
      if (noDashRegex.test(trimmed)) {
        const formatted = `${trimmed.slice(0,8)}-${trimmed.slice(8,12)}-${trimmed.slice(12,16)}-${trimmed.slice(16,20)}-${trimmed.slice(20)}`;
        return validateUuid(formatted);
      }
      return { isValid: false, version: null, variant: null };
    }

    const version = match[1];
    const variantChar = match[2].toLowerCase();
    
    let variant = 'RFC 4122';
    if (variantChar === '8' || variantChar === '9' || variantChar === 'a' || variantChar === 'b') {
      variant = 'RFC 4122';
    }

    return {
      isValid: true,
      version: `v${version}`,
      variant
    };
  }
  function handleValidate() {
    const lines = input.split('\n').filter(line => line.trim());
    const validationResults = lines.map(uuid => ({
      uuid: uuid.trim(),
      result: validateUuid(uuid)
    }));
    results = validationResults;
  }
  const validCount = results.filter(r => r.result.isValid).length;
  const invalidCount = results.filter(r => !r.result.isValid).length;

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
          {t('uuidValidator.input')}
        </label>
        <textarea
          bind:value={input}
          placeholder={t('uuidValidator.placeholder')}
          class="w-full h-40 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"></textarea>
      </div>

      <div class="flex gap-3">
        <button
          onclick={handleValidate}
          class="px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium transition-colors text-white"
        >
          {t('uuidValidator.validate')}
        </button>
        <button
          onclick={() => { input = ''; results = []; }}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors text-gray-700 dark:text-white"
        >
          {t('clear')}
        </button>
      </div>

      {#if results.length > 0}
<div>

          <div class="flex gap-4 text-sm">
            <span class="text-green-600 dark:text-green-400">✓ {t('uuidValidator.valid')}: {validCount}</span>
            <span class="text-red-600 dark:text-red-400">✗ {t('uuidValidator.invalid')}: {invalidCount}</span>
          </div>

          <div class="space-y-2">
            {#each results as item, index (index)}
<div 
                class={`p-3 rounded-lg border ${
                  item.result.isValid
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                }`}
              >
                <div class="flex items-center justify-between">
                  <code class="text-sm font-mono text-gray-900 dark:text-white">{item.uuid}</code>
                  {#if item.result.isValid}
<div class="flex gap-3 text-sm">
                      <span class="text-green-600 dark:text-green-400">{item.result.version}</span>
                      <span class="text-gray-600 dark:text-gray-300">{item.result.variant}</span>
                    </div>
{:else}
<span class="text-red-600 dark:text-red-400 text-sm">{t('uuidValidator.invalidFormat')}</span>
{/if}
                </div>
              </div>
{/each}
          </div>
        
</div>
{/if}

      <div class="bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 class="font-medium text-gray-900 dark:text-white mb-2">{t('uuidValidator.versions')}</h3>
        <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <li>• v1 - {t('uuidValidator.v1Desc')}</li>
          <li>• v4 - {t('uuidValidator.v4Desc')}</li>
          <li>• v5 - {t('uuidValidator.v5Desc')}</li>
        </ul>
      </div>
    </div>
  
