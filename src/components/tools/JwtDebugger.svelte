<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['jwt-debugger'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.jwt-debugger.${key}`;
  }

  // Types
  interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

  let token = $state('');

  let decoded = $state(null);

  let error = $state('');

  let secret = $state('');

  let isValid = $state(null);

  let copied = $state('');

  let timerRef = $state(null);

  $effect(() => {
    decodeToken(token);
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function base64UrlDecode(str: string): string {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    return atob(base64 + padding);
  }
  function decodeToken(jwt: string) {
    error = '';
    decoded = null;
    isValid = null;

    if (!jwt.trim()) {
      return;
    }

    const parts = jwt.split('.');
    if (parts.length !== 3) {
      error = t('errors.invalidFormat');
      return;
    }

    try {
      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      const signature = parts[2];

      decoded = { header, payload, signature };
    } catch {
      error = t('errors.decodeFailed');
    }
  }
  function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  }
  function isExpired(payload: Record<string, unknown>): boolean {
    if (typeof payload.exp === 'number') {
      return Date.now() > payload.exp * 1000;
    }
    return false;
  }
  function copyToClipboard(text: string, type: string) {
    navigator.clipboard.writeText(text);
    copied = type;
    setTimeout(() => copied = '', 2000);
  }
  function loadExample() {
    // Example JWT (expired, for demo purposes)
    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjIsInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  }

</script>

{#snippet renderValue(key, value)}
{JSON.stringify(value)}
{/snippet}


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('tokenInput')}
        </label>
        <textarea
          bind:value={token}
          placeholder={t('placeholder')}
          class="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm break-all"></textarea>
        <button
          onclick={loadExample}
          class="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {t('loadExample')}
        </button>
      </div>

      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
{/if}

      {#if decoded}
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  {t('header')}
                </h3>
                <button
                  onclick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2), 'header')}
                  class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {copied === 'header' ? t('copied') : t('copy')}
                </button>
              </div>
              <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <pre class="text-sm font-mono text-red-700 dark:text-red-300 overflow-x-auto">
                  {JSON.stringify(decoded.header, null, 2)}
                </pre>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  {t('payload')}
                </h3>
                <button
                  onclick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2), 'payload')}
                  class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {copied === 'payload' ? t('copied') : t('copy')}
                </button>
              </div>
              <div class="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <pre class="text-sm font-mono text-purple-700 dark:text-purple-300 overflow-x-auto">
                  {JSON.stringify(decoded.payload, null, 2)}
                </pre>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t('signature')}
              </h3>
              <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <code class="text-sm font-mono text-blue-700 dark:text-blue-300 break-all">
                  {decoded.signature}
                </code>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t('claims')}
              </h3>
              <div class="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <table class="w-full">
                  <thead class="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th class="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('claim')}
                      </th>
                      <th class="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('value')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each Object.entries(decoded.payload) as [key, value] (key)}
<tr  class="border-t border-gray-300 dark:border-gray-600">
                        <td class="px-4 py-2 text-sm font-mono text-gray-900 dark:text-white">
                          {key}
                        </td>
                        <td class="px-4 py-2 text-sm font-mono text-gray-600 dark:text-gray-400">
                          {@render renderValue(key, value)}
                        </td>
                      </tr>
{/each}
                  </tbody>
                </table>
              </div>
            </div>

            {#if typeof decoded.payload.exp === 'number'}
<div class={`p-4 rounded-lg ${
                isExpired(decoded.payload)
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              }`}>
                <div class="flex items-center gap-2">
                  <span class={`text-2xl ${isExpired(decoded.payload) ? 'text-red-500' : 'text-green-500'}`}>
                    {isExpired(decoded.payload) ? '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>' : '✓'}
                  </span>
                  <span class={`font-medium ${
                    isExpired(decoded.payload)
                      ? 'text-red-700 dark:text-red-300'
                      : 'text-green-700 dark:text-green-300'
                  }`}>
                    {isExpired(decoded.payload) ? t('expired') : t('notExpired')}
                  </span>
                </div>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {t('expiresAt')}: {formatTimestamp(decoded.payload.exp)}
                </p>
              </div>
{/if}

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('verifySignature')}
              </label>
              <input
                type="text"
                bind:value={secret}
                placeholder={t('secretPlaceholder')}
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
              />
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {t('verifyNote')}
              </p>
            </div>
          </div>
        </div>
{/if}
    </div>
  
