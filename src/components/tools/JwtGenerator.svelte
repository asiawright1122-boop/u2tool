<script lang="ts">
  import { onDestroy } from 'svelte';
  import { base64UrlEncode } from '@/lib/tool-stubs';

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

  let algorithm = $state('HS256');

  let secret = $state('your-256-bit-secret');

  let payload = $state(JSON.stringify({
    sub: '1234567890',
    name: 'John Doe',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
  }, null, 2));

  let token = $state('');

  let error = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function getHashName(alg: string): 'SHA-256' | 'SHA-384' | 'SHA-512' {
    if (alg === 'HS384') return 'SHA-384';
    if (alg === 'HS512') return 'SHA-512';
    return 'SHA-256';
  }

  async function generateToken() {
    try {
      const parsedPayload = JSON.parse(payload);
      
      const header = { alg: algorithm, typ: 'JWT' };
      const encodedHeader = base64UrlEncode(JSON.stringify(header));
      const encodedPayload = base64UrlEncode(JSON.stringify(parsedPayload));
      
      const data = `${encodedHeader}.${encodedPayload}`;
      
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const messageData = encoder.encode(data);
      
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: getHashName(algorithm) },
        false,
        ['sign']
      );
      
      const signature = await crypto.subtle.sign('HMAC', key, messageData);
      const encodedSignature = base64UrlEncode(
        String.fromCharCode(...new Uint8Array(signature))
      );
      
      token = `${data}.${encodedSignature}`;
      error = '';
    } catch (e: unknown) {
      if (e instanceof SyntaxError) {
        error = t('jwt.invalidPayload');
      } else {
        error = t('jwt.error');
      }
      token = '';
    }
  }
  async function copyToken() {
    await navigator.clipboard.writeText(token);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function addClaim(claim: string) {
    try {
      const parsed = JSON.parse(payload);
      const now = Math.floor(Date.now() / 1000);
      
      switch (claim) {
        case 'iat':
          parsed.iat = now;
          break;
        case 'exp':
          parsed.exp = now + 3600;
          break;
        case 'nbf':
          parsed.nbf = now;
          break;
        case 'jti':
          parsed.jti = crypto.randomUUID();
          break;
      }
      
      payload = JSON.stringify(parsed, null, 2);
    } catch (_e) {
      // ignore
    }
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">{t('jwt.algorithm')}</label>
          <select bind:value={algorithm} class="tool-input">
            <option value="HS256">HS256 (HMAC SHA-256)</option>
            <option value="HS384">HS384 (HMAC SHA-384)</option>
            <option value="HS512">HS512 (HMAC SHA-512)</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">{t('jwt.secretKey')}</label>
          <input
            type="text"
            bind:value={secret}
            class="tool-input font-mono"
            placeholder={t('jwt.secretPlaceholder')}
          />
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium">{t('jwt.payload')}</label>
          <div class="flex gap-2">
            <button onclick={() => addClaim('iat')} class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600">+iat</button>
            <button onclick={() => addClaim('exp')} class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600">+exp</button>
            <button onclick={() => addClaim('nbf')} class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600">+nbf</button>
            <button onclick={() => addClaim('jti')} class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600">+jti</button>
          </div>
        </div>
        <textarea
          bind:value={payload}
          class="tool-textarea font-mono"
          rows={8}></textarea>
      </div>

      {#if error}
<div class="text-red-600 dark:text-red-400 text-sm bg-red-100 dark:bg-red-900/20 p-2 rounded">{error}</div>
{/if}

      <button onclick={generateToken} class="btn-primary">
        {t('jwt.generate')}
      </button>

      {#if token}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium">{t('jwt.generatedToken')}</label>
            <button
              onclick={copyToken}
              class={`text-sm px-3 py-1 rounded ${copied ? 'btn-success' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg break-all font-mono text-sm">
            <span class="text-red-400">{token.split('.')[0]}</span>.
            <span class="text-slate-400">{token.split('.')[1]}</span>.
            <span class="text-amber-400">{token.split('.')[2]}</span>
          </div>
        </div>
{/if}

      <div class="p-4 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
        <h3 class="font-medium mb-2 text-gray-900 dark:text-white">{t('jwt.commonClaims')}</h3>
        <div class="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
          <div><code class="text-amber-400">iss</code> - {t('jwt.claims.iss')}</div>
          <div><code class="text-amber-400">sub</code> - {t('jwt.claims.sub')}</div>
          <div><code class="text-amber-400">aud</code> - {t('jwt.claims.aud')}</div>
          <div><code class="text-amber-400">exp</code> - {t('jwt.claims.exp')}</div>
          <div><code class="text-amber-400">nbf</code> - {t('jwt.claims.nbf')}</div>
          <div><code class="text-amber-400">iat</code> - {t('jwt.claims.iat')}</div>
          <div><code class="text-amber-400">jti</code> - {t('jwt.claims.jti')}</div>
        </div>
      </div>
    </div>
  
