<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['email-validator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.email-validator.${key}`;
  }

  // Types
  interface ValidationResult {
  isValid: boolean;
  email: string;
  localPart: string;
  domain: string;
  tld: string;
  isDisposable: boolean;
  isFreeProvider: boolean;
  suggestions: string[];
}

  let email = $state('');

  let results = $state([]);

  // Functions
  function validateEmail(emailStr: string): ValidationResult {
    const trimmed = emailStr.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    const isValid = emailRegex.test(trimmed);
    const parts = trimmed.split('@');
    const localPart = parts[0] || '';
    const domain = parts[1] || '';
    const tld = domain.split('.').pop() || '';
    
    const isDisposable = disposableDomains.some(d => domain.includes(d));
    const isFreeProvider = freeProviders.includes(domain);
    
    const suggestions: string[] = [];
    if (commonTypos[domain]) {
      suggestions.push(`${localPart}@${commonTypos[domain]}`);
    }
    
    return {
      isValid,
      email: trimmed,
      localPart,
      domain,
      tld,
      isDisposable,
      isFreeProvider,
      suggestions,
    };
  }
  function handleValidate() {
    const emails = email.split('\n').filter(e => e.trim());
    const validationResults = emails.map(validateEmail);
    results = validationResults;
  }
  const validCount = results.filter(r => r.isValid).length;
  const invalidCount = results.filter(r => !r.isValid).length;

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('inputLabel')}
        </label>
        <textarea
          bind:value={email}
          placeholder={t('inputPlaceholder')}
          class="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"></textarea>
      </div>

      <button
        onclick={handleValidate}
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        {t('validate')}
      </button>

      {#if results.length > 0}
<div class="space-y-4">
          <div class="flex gap-4">
            <div class="px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <span class="text-green-700 dark:text-green-400 font-medium">
                ✓ {t('valid')}: {validCount}
              </span>
            </div>
            <div class="px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <span class="text-red-700 dark:text-red-400 font-medium">
                ✗ {t('invalid')}: {invalidCount}
              </span>
            </div>
          </div>

          <div class="space-y-3">
            {#each results as result, index (index)}
<div 
                class={`p-4 rounded-lg border ${
                  result.isValid
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}
              >
                <div class="flex items-center gap-2 mb-2">
                  <span class={result.isValid ? 'text-green-600' : 'text-red-600'}>
                    {result.isValid ? '✓' : '✗'}
                  </span>
                  <span class="font-mono text-gray-900 dark:text-white">{result.email}</span>
                </div>
                
                {#if result.isValid}
<div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span class="text-gray-500 dark:text-gray-400">{t('localPart')}:</span>
                      <span class="ml-1 text-gray-900 dark:text-white">{result.localPart}</span>
                    </div>
                    <div>
                      <span class="text-gray-500 dark:text-gray-400">{t('domain')}:</span>
                      <span class="ml-1 text-gray-900 dark:text-white">{result.domain}</span>
                    </div>
                    <div>
                      <span class="text-gray-500 dark:text-gray-400">{t('tld')}:</span>
                      <span class="ml-1 text-gray-900 dark:text-white">.{result.tld}</span>
                    </div>
                    <div class="flex gap-2">
                      {#if result.isFreeProvider}
<span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs">
                          {t('freeProvider')}
                        </span>
{/if}
                      {#if result.isDisposable}
<span class="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded text-xs">
                          {t('disposable')}
                        </span>
{/if}
                    </div>
                  </div>
{/if}
                
                {#if result.suggestions.length > 0}
<div class="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                    💡 {t('didYouMean')}: {result.suggestions.join(', ')}
                  </div>
{/if}
              </div>
{/each}
          </div>
        </div>
{/if}
    </div>
  
