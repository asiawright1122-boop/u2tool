<script lang="ts">
  import { generateSecret, generateTotp } from '@/lib/tool-stubs';

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

  let secret = $state('');

  let code = $state('');

  let timeLeft = $state(30);

  let copied = $state(false);

  let copiedSecret = $state(false);

  async function updateCode() {
    if (secret.length >= 16) {
      try {
        const newCode = await generateTotp(secret);
        code = newCode;
      } catch {
        code = '------';
      }
    } else {
      code = '------';
    }
  }

  $effect(() => {
    updateCode();
    
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = 30 - (now % 30);
      timeLeft = remaining;
      
      if (remaining === 30) {
        updateCode();
      }
    }, 1000);

    return () => clearInterval(interval);
  });

  // Functions
  function handleGenerateSecret() {
    const newSecret = generateSecret(32);
    secret = newSecret;
  }
  async function copyCode() {
    if (code && code !== '------') {
      await navigator.clipboard.writeText(code);
      copied = true;
      setTimeout(() => copied = false, 2000);
    }
  }
  async function copySecret() {
    if (secret) {
      await navigator.clipboard.writeText(secret);
      copiedSecret = true;
      setTimeout(() => copiedSecret = false, 2000);
    }
  }

</script>


    <div class="space-y-6">
      <div>
        <label for="totp-generator-field-2" class="block text-sm font-medium mb-2">{t('totp.secret')}</label>
        <div class="flex gap-2">
          <input
            type="text"
            value={secret}
            onchange={(e) => secret = e.target.value.toUpperCase().replace(/[^A-Z2-7]/g, '')}
            placeholder={t('totp.secretPlaceholder')}
            class="flex-1 p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 dark:text-gray-100" id="totp-generator-field-2" />
          <button
            onclick={handleGenerateSecret}
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm"
          >
            {t('generate')}
          </button>
          <button
            onclick={copySecret}
            class={`px-4 py-2 rounded-lg text-sm ${
              copiedSecret ? 'bg-emerald-500' : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {copiedSecret ? t('copied') : t('copy')}
          </button>
        </div>
        <p class="mt-1 text-xs text-gray-600 dark:text-gray-300">{t('totp.secretHint')}</p>
      </div>

      <div class="p-6 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
        <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('totp.currentCode')}</div>
        <div class="text-4xl font-mono font-bold tracking-widest mb-4">
          {code.slice(0, 3)} {code.slice(3)}
        </div>
        <div class="flex items-center justify-center gap-4">
          <div class="flex items-center gap-2">
            <div class="w-32 bg-gray-300 dark:bg-gray-700 rounded-full h-2">
              <div
                class={`h-2 rounded-full transition-all duration-1000 ${timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style="width: ${(timeLeft / 30) * 100}%"></div>
            </div>
            <span class="text-sm text-gray-600 dark:text-gray-300">{timeLeft}s</span>
          </div>
          <button
            onclick={copyCode}
            disabled={code === '------'}
            class={`px-4 py-2 rounded-lg text-sm ${
              copied ? 'bg-emerald-500' : code === '------' ? 'bg-gray-600 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div class="text-sm font-medium mb-2">{t('totp.howItWorks')}</div>
        <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <li>• {t('totp.step1')}</li>
          <li>• {t('totp.step2')}</li>
          <li>• {t('totp.step3')}</li>
        </ul>
      </div>
    </div>
  
