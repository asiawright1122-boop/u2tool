<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['string-obfuscator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.string-obfuscator.${key}`;
  }

  let input = $state('');

  let output = $state('');

  let method = $state('base64');

  // Functions
  function obfuscate() {
    if (!input) {
      output = '';
      return;
    }

    try {
      switch (method) {
        case 'base64':
          output = btoa(input);
          break;
        case 'hex':
          output = input.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
          break;
        case 'html':
          output = input.split('').map(c => `&#${c.charCodeAt(0)};`).join('');
          break;
        case 'url':
          output = encodeURIComponent(input);
          break;
        case 'rot13':
          output = input.replace(/[a-zA-Z]/g, (c) => {
            const base = c <= 'Z' ? 65 : 97;
            return String.fromCharCode(base + (c.charCodeAt(0) - base + 13) % 26);
          });
          break;
        case 'reverse':
          output = input.split('').reverse().join('');
          break;
      }
    } catch (_e) {
      output = t('error');
    }
  }

</script>


    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <label for="string-obfuscator-field-3" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('input')}</label>
        <textarea
          bind:value={input}
          rows={4}
          class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 font-mono"
          placeholder={t('inputPlaceholder')} id="string-obfuscator-field-3"></textarea>
      </div>

      <div class="flex flex-wrap gap-4">
        <button
          onclick={() => method = 'base64'}
          class={`px-4 py-2 rounded-lg transition-colors ${method === 'base64' ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          {t('methodBase64')}
        </button>
        <button
          onclick={() => method = 'hex'}
          class={`px-4 py-2 rounded-lg transition-colors ${method === 'hex' ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          {t('methodHex')}
        </button>
        <button
          onclick={() => method = 'html'}
          class={`px-4 py-2 rounded-lg transition-colors ${method === 'html' ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          {t('methodHtml')}
        </button>
        <button
          onclick={() => method = 'url'}
          class={`px-4 py-2 rounded-lg transition-colors ${method === 'url' ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          {t('methodUrl')}
        </button>
        <button
          onclick={() => method = 'rot13'}
          class={`px-4 py-2 rounded-lg transition-colors ${method === 'rot13' ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          {t('methodRot13')}
        </button>
        <button
          onclick={() => method = 'reverse'}
          class={`px-4 py-2 rounded-lg transition-colors ${method === 'reverse' ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          {t('methodReverse')}
        </button>
      </div>

      <div class="flex justify-center">
        <button
          onclick={obfuscate}
          class="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-amber-500/20"
        >
          {t('obfuscate')}
        </button>
      </div>

      {#if output}
<div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center mb-2">
            <div class="block text-sm font-medium text-gray-600 dark:text-gray-300">{t('result')} ({method})</div>
            <button
              onclick={() => navigator.clipboard.writeText(output)}
              class="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
            >
              {t('copy')}
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            rows={4}
            class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-green-600 dark:text-green-400 font-mono"></textarea>
        </div>
{/if}
    </div>
  
