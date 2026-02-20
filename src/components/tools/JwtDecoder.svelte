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
  function tj(key: string): string {
    const scope = translations['tools']['jwt-decoder'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.jwt-decoder.${key}`;
  }

  // Types
  interface JwtPayload {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

  let input = $state('');

  let decoded = $state(null);

  let error = $state('');

  let copied = $state('');

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function decodeJwt() {
    if (!input.trim()) {
      error = tj('enterToken');
      decoded = null;
      return;
    }
    try {
      const parts = input.trim().split('.');
      if (parts.length !== 3) {
        throw new Error(tj('invalidFormat'));
      }

      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      
      decoded = { header, payload, signature: parts[2] };
      error = '';
    } catch (_e) {
      error = tj('invalidToken');
      decoded = null;
    }
  }
  async function copySection(section: string, content: string) {
    await navigator.clipboard.writeText(content);
    copied = section;
    setTimeout(() => copied = '', 2000);
  }
  function formatDate(timestamp: number) {
    return new Date(timestamp * 1000).toLocaleString();
  }

</script>


    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">{t('input')} (JWT Token)</label>
        <textarea
          class="tool-textarea"
          bind:value={input}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          rows={4}></textarea>
      </div>

      <button onclick={decodeJwt} class="btn-primary">
        {t('decode')}
      </button>

      {#if error}
<div class="p-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
{/if}

      {#if decoded}
<div class="space-y-4">
          <!-- Header -->
          <div class="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <div class="flex justify-between items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 border-b border-gray-300 dark:border-gray-700">
              <span class="font-medium text-blue-700 dark:text-blue-400">{tj('header')}</span>
              <button
                onclick={() => copySection('header', JSON.stringify(decoded.header, null, 2))}
                class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-white"
              >
                {copied === 'header' ? t('copied') : t('copy')}
              </button>
            </div>
            <pre class="p-4 text-sm overflow-x-auto text-gray-900 dark:text-white">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          <!-- Payload -->
          <div class="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <div class="flex justify-between items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 border-b border-gray-300 dark:border-gray-700">
              <span class="font-medium text-purple-700 dark:text-purple-400">{tj('payload')}</span>
              <button
                onclick={() => copySection('payload', JSON.stringify(decoded.payload, null, 2))}
                class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-white"
              >
                {copied === 'payload' ? t('copied') : t('copy')}
              </button>
            </div>
            <pre class="p-4 text-sm overflow-x-auto text-gray-900 dark:text-white">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
            <!-- Show formatted dates for common claims -->
            {#if decoded.payload.exp !== undefined || decoded.payload.iat !== undefined || decoded.payload.nbf !== undefined}
<div class="px-4 pb-4 text-xs text-gray-600 dark:text-gray-300 space-y-1 border-t border-gray-300 dark:border-gray-700 pt-3">
                {#if decoded.payload.iat !== undefined}
<div>{tj('issuedAt')}: {formatDate(Number(decoded.payload.iat))}</div>
{/if}
                {#if decoded.payload.exp !== undefined}
<div>{tj('expires')}: {formatDate(Number(decoded.payload.exp))}</div>
{/if}
                {#if decoded.payload.nbf !== undefined}
<div>{tj('notBefore')}: {formatDate(Number(decoded.payload.nbf))}</div>
{/if}
              </div>
{/if}
          </div>

          <!-- Signature -->
          <div class="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <div class="flex justify-between items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 border-b border-gray-300 dark:border-gray-700">
              <span class="font-medium text-green-700 dark:text-green-400">{tj('signature')}</span>
              <button
                onclick={() => copySection('signature', decoded.signature)}
                class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-white"
              >
                {copied === 'signature' ? t('copied') : t('copy')}
              </button>
            </div>
            <div class="p-4 text-sm text-gray-700 dark:text-gray-300 break-all">
              {decoded.signature}
            </div>
          </div>
        </div>
{/if}
    </div>
  
