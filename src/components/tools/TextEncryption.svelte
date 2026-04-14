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

  let input = $state('');

  let output = $state('');

  let password = $state('');

  let mode = $state('encrypt');

  // Functions
  async function encrypt(text: string, key: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const keyData = encoder.encode(key.padEnd(32, '0').slice(0, 32));
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw', keyData, { name: 'AES-GCM' }, false, ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv }, cryptoKey, data
    );
    
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  }
  async function decrypt(text: string, key: string): Promise<string> {
    const combined = Uint8Array.from(atob(text), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key.padEnd(32, '0').slice(0, 32));
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw', keyData, { name: 'AES-GCM' }, false, ['decrypt']
    );
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv }, cryptoKey, data
    );
    
    return new TextDecoder().decode(decrypted);
  }
  async function handleProcess() {
    if (!input || !password) return;
    try {
      if (mode === 'encrypt') {
        const result = await encrypt(input, password);
        output = result;
      } else {
        const result = await decrypt(input, password);
        output = result;
      }
    } catch {
      output = t('encryption.error');
    }
  }
  function copyOutput() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-4">
      <div class="flex gap-2">
        <button
          onclick={() => mode = 'encrypt'}
          class={`px-4 py-2 rounded ${mode === 'encrypt' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
        >
          {t('encryption.encrypt')}
        </button>
        <button
          onclick={() => mode = 'decrypt'}
          class={`px-4 py-2 rounded ${mode === 'decrypt' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
        >
          {t('encryption.decrypt')}
        </button>
      </div>

      <div>
        <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">{t('encryption.password')}</label>
        <input
          type="password"
          bind:value={password}
          class="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white"
          placeholder={t('encryption.passwordPlaceholder')}
        />
      </div>

      <div>
        <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">{t('input')}</label>
        <textarea
          bind:value={input}
          class="w-full h-32 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white font-mono text-sm"
          placeholder={t('encryption.inputPlaceholder')}></textarea>
      </div>

      <button
        onclick={handleProcess}
        class="w-full bg-amber-600 hover:bg-amber-700 py-2 rounded font-medium text-white"
      >
        {mode === 'encrypt' ? t('encryption.encrypt') : t('encryption.decrypt')}
      </button>

      <div>
        <div class="flex justify-between items-center mb-1">
          <label class="text-sm text-gray-700 dark:text-gray-300">{t('output')}</label>
          <button onclick={copyOutput} class="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300">
            {t('copy')}
          </button>
        </div>
        <textarea
          value={output}
          readOnly
          class="w-full h-32 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white font-mono text-sm"></textarea>
      </div>
    </div>
  
