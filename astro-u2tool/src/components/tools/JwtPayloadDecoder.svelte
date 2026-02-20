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
  interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  isExpired?: boolean;
  expiresAt?: Date;
  issuedAt?: Date;
}

  let token = $state('');

  let decoded = $state(null);

  let error = $state('');

  let copied = $state(null);

  function handleDecode() {
    if (!token.trim()) {
      error = t('errorInvalidInput');
      decoded = null;
      return;
    }

    const result = decodeJwt(token);
    if (result) {
      decoded = result;
      error = '';
    } else {
      error = t('errorInvalidFormat');
      decoded = null;
    }
  }

  function handleCopy(text: string, type: string) {
    navigator.clipboard.writeText(text);
    copied = type;
    setTimeout(() => copied = null, 2000);
  }

  function handleClear() {
    token = '';
    decoded = null;
    error = '';
  }

  $effect(() => {
    if (token.trim() && token.includes('.')) {
      handleDecode();
    }
  });

  // Functions
  const exampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

</script>


    <div class="space-y-6">
      <!-- Input -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            JWT Token
          </label>
          <button
            onclick={() => token = exampleToken}
            class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {t('sql.loadExample')}
          </button>
        </div>
        <textarea
          bind:value={token}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          class="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"></textarea>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 flex-wrap">
        <button
          onclick={handleDecode}
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {t('decode')}
        </button>
        <button
          onclick={handleClear}
          class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          {t('clear')}
        </button>
      </div>

      <!-- Error -->
      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
{/if}

      <!-- Decoded Result -->
      {#if decoded}
<div class="space-y-6">
          <!-- Status -->
          {#if decoded.expiresAt}
<div class={`p-4 rounded-lg ${
              decoded.isExpired 
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            }`}>
              <div class="flex items-center gap-2">
                <span class={`text-lg ${decoded.isExpired ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {decoded.isExpired ? '⚠️ Token Expired' : '✓ Token Valid'}
                </span>
              </div>
              <div class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <p>Expires: {formatDate(decoded.expiresAt)}</p>
                {#if decoded.issuedAt}
<p>Issued: {formatDate(decoded.issuedAt)}</p>
{/if}
              </div>
            </div>
{/if}

          <!-- Header -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Header
              </h3>
              <button
                onclick={() => handleCopy(formatJson(decoded.header), 'header')}
                class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {copied === 'header' ? t('copied') : t('copy')}
              </button>
            </div>
            <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
              {formatJson(decoded.header)}
            </pre>
          </div>

          <!-- Payload -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Payload
              </h3>
              <button
                onclick={() => handleCopy(formatJson(decoded.payload), 'payload')}
                class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {copied === 'payload' ? t('copied') : t('copy')}
              </button>
            </div>
            <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
              {formatJson(decoded.payload)}
            </pre>
          </div>

          <!-- Claims Table -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('jwt.commonClaims')}
            </h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-gray-100 dark:bg-gray-700">
                    <th class="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Claim</th>
                    <th class="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Value</th>
                    <th class="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Description</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  {#each Object.entries(decoded.payload) as [key, value] (key)}
<tr  class="bg-white dark:bg-gray-800">
                      <td class="px-4 py-2 font-mono text-blue-600 dark:text-blue-400">{key}</td>
                      <td class="px-4 py-2 font-mono text-gray-900 dark:text-white break-all max-w-xs">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </td>
                      <td class="px-4 py-2 text-gray-600 dark:text-gray-400">
                        {#if key === 'iss'}
t('jwt.claims.iss')
{/if}
                        {#if key === 'sub'}
t('jwt.claims.sub')
{/if}
                        {#if key === 'aud'}
t('jwt.claims.aud')
{/if}
                        {#if key === 'exp'}
t('jwt.claims.exp')
{/if}
                        {#if key === 'nbf'}
t('jwt.claims.nbf')
{/if}
                        {#if key === 'iat'}
t('jwt.claims.iat')
{/if}
                        {#if key === 'jti'}
t('jwt.claims.jti')
{/if}
                      </td>
                    </tr>
{/each}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Signature -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Signature
            </h3>
            <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <code class="text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
                {decoded.signature}
              </code>
            </div>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              ⚠️ Signature verification requires the secret key and is not performed client-side.
            </p>
          </div>
        </div>
{/if}
    </div>
  
