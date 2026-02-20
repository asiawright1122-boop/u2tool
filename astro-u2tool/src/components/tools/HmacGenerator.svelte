<script lang="ts">
  import { onDestroy } from 'svelte';

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
  type Algorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

  let message = $state('');

  let secretKey = $state('');

  let algorithm = $state('SHA-256');

  let result = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  async function generateHmac() {
    if (!message || !secretKey) {
      result = '';
      return;
    }

    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secretKey);
      const messageData = encoder.encode(message);

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: algorithm },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
      const hashArray = Array.from(new Uint8Array(signature));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      result = hashHex;
    } catch {
      result = t('hmac.error');
    }
  }
  async function copyResult() {
    if (result) {
      await navigator.clipboard.writeText(result);
      copied = true;
      if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
    }
  }

</script>


    <div class="space-y-6">
      <div>
        <label class="tool-label">{t('hmac.message')}</label>
        <textarea
          bind:value={message}
          placeholder={t('hmac.messagePlaceholder')}
          class="tool-textarea h-32"></textarea>
      </div>

      <div>
        <label class="tool-label">{t('hmac.secretKey')}</label>
        <input
          type="text"
          bind:value={secretKey}
          placeholder={t('hmac.keyPlaceholder')}
          class="tool-input font-mono text-sm"
        />
      </div>

      <div>
        <label class="tool-label">{t('hmac.algorithm')}</label>
        <select
          value={algorithm}
          onchange={(e) => algorithm = e.target.value as Algorithm}
          class="tool-input"
        >
          <option value="SHA-1">SHA-1</option>
          <option value="SHA-256">SHA-256</option>
          <option value="SHA-384">SHA-384</option>
          <option value="SHA-512">SHA-512</option>
        </select>
      </div>

      <button
        onclick={generateHmac}
        class="btn-primary w-full"
      >
        {t('generate')} HMAC
      </button>

      {#if result}
<div>
          <label class="tool-label">{t('result')}</label>
          <div class="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="flex items-start justify-between gap-4">
              <code class="font-mono text-sm break-all text-green-600 dark:text-green-400">{result}</code>
              <button
                onclick={copyResult}
                class={`px-3 py-1 rounded text-sm whitespace-nowrap text-white ${
                  copied ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {copied ? t('copied') : t('copy')}
              </button>
            </div>
          </div>
        </div>
{/if}
    </div>
  
