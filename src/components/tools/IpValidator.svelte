<script lang="ts">
  import { validateIP } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['ip-validator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.ip-validator.${key}`;
  }

  // Types
  interface ValidationResult {
  isValid: boolean;
  type: 'IPv4' | 'IPv6' | 'Invalid';
  details: {
    isPrivate?: boolean;
    isLoopback?: boolean;
    isMulticast?: boolean;
    class?: string;
  };
}

  let input = $state('');

  let result = $state(null);

  // Functions
  function handleValidate() {
    if (!input.trim()) {
      result = null;
      return;
    }
    result = validateIP(input);
  }

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
          {t('inputLabel')}
        </label>
        <div class="flex gap-2">
          <input
            type="text"
            bind:value={input}
            onkeydown={(e) => e.key === 'Enter' && handleValidate()}
            placeholder={t('placeholder')}
            class="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onclick={handleValidate}
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('validate')}
          </button>
        </div>
      </div>

      {#if result}
<div class={`p-4 rounded-lg ${result.isValid ? 'bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700' : 'bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700'}`}>
          <div class="flex items-center gap-2 mb-3">
            <span class={`text-2xl ${result.isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {result.isValid ? '✓' : '✗'}
            </span>
            <span class={`font-semibold ${result.isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {result.isValid ? t('valid') : t('invalid')}
            </span>
          </div>
          
          {#if result.isValid}
<div class="space-y-2 text-gray-600 dark:text-gray-300">
              <p><span class="text-gray-500 dark:text-gray-400">{t('type')}:</span> {result.type}</p>
              {#if result.type === 'IPv4'}
<div>

                  <p><span class="text-gray-500 dark:text-gray-400">{t('class')}:</span> {result.details.class}</p>
                  <p><span class="text-gray-500 dark:text-gray-400">{t('private')}:</span> {result.details.isPrivate ? t('yes') : t('no')}</p>
                  <p><span class="text-gray-500 dark:text-gray-400">{t('loopback')}:</span> {result.details.isLoopback ? t('yes') : t('no')}</p>
                  <p><span class="text-gray-500 dark:text-gray-400">{t('multicast')}:</span> {result.details.isMulticast ? t('yes') : t('no')}</p>
                
</div>
{/if}
              {#if result.type === 'IPv6'}
<p><span class="text-gray-500 dark:text-gray-400">{t('loopback')}:</span> {result.details.isLoopback ? t('yes') : t('no')}</p>
{/if}
            </div>
{/if}
        </div>
{/if}

      <div class="text-sm text-gray-500 dark:text-gray-400">
        <p class="font-medium mb-2">{t('examples')}:</p>
        <ul class="list-disc list-inside space-y-1">
          <li>192.168.1.1 (IPv4 {t('privateAddress')})</li>
          <li>8.8.8.8 (IPv4 {t('publicAddress')})</li>
          <li>::1 (IPv6 {t('loopbackAddress')})</li>
          <li>2001:0db8:85a3:0000:0000:8a2e:0370:7334 (IPv6)</li>
        </ul>
      </div>
    </div>
  
