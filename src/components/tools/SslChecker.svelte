<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['ssl-checker'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.ssl-checker.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface SSLInfo {
  valid: boolean;
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  protocol: string;
  serialNumber: string;
}

  let domain = $state('');

  let loading = $state(false);

  let result = $state(null);

  let error = $state('');

  // Functions
  async function checkSSL() {
    if (!domain.trim()) return;
    
    loading = true;
    error = '';
    result = null;

    // 模拟 SSL 检查（实际需要后端 API）
    // 这里提供一个演示版本
    try {
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      
      // 模拟结果
      const now = new Date();
      const validFrom = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      const validTo = new Date(now.getTime() + 185 * 24 * 60 * 60 * 1000);
      const daysRemaining = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      result = {
        valid: true,
        issuer: 'Let\'s Encrypt Authority X3',
        subject: cleanDomain,
        validFrom: validFrom.toISOString().split('T')[0],
        validTo: validTo.toISOString().split('T')[0],
        daysRemaining,
        protocol: 'TLS 1.3',
        serialNumber: Math.random().toString(16).substring(2, 18).toUpperCase(),
      };
    } catch (_err) {
      error = tg('errorProcessing');
    } finally {
      loading = false;
    }
  }

</script>


    <div class="space-y-6">
      <div class="flex gap-2">
        <input
          type="text"
          bind:value={domain}
          placeholder="example.com"
          class="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-500"
          onkeydown={(e) => e.key === 'Enter' && checkSSL()}
        />
        <button
          onclick={checkSSL}
          disabled={loading || !domain.trim()}
          class="btn-primary px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? t('checking') : t('check')}
        </button>
      </div>

      <div class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
        Demo notice: this browser page shows a certificate-style summary for learning and UI checks. It does not retrieve the live TLS certificate chain for the entered domain.
      </div>

      {#if error}
<div class="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
{/if}

      {#if result}
<div class="space-y-4">
          <div class={`p-4 rounded-lg border ${result.valid ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700'}`}>
            <div class="flex items-center gap-2">
              <span class="text-2xl">{@html result.valid ? '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'}</span>
              <span class="text-lg font-semibold text-gray-900 dark:text-white">
                {result.valid ? t('valid') : t('invalid')}
              </span>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('issuer')}</div>
              <div class="font-mono text-gray-900 dark:text-white">{result.issuer}</div>
            </div>
            <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('subject')}</div>
              <div class="font-mono text-gray-900 dark:text-white">{result.subject}</div>
            </div>
            <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('validFrom')}</div>
              <div class="font-mono text-gray-900 dark:text-white">{result.validFrom}</div>
            </div>
            <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('validTo')}</div>
              <div class="font-mono text-gray-900 dark:text-white">{result.validTo}</div>
            </div>
            <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('daysRemaining')}</div>
              <div class={`font-mono text-xl ${result.daysRemaining < 30 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                {result.daysRemaining} {t('days')}
              </div>
            </div>
            <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('protocol')}</div>
              <div class="font-mono text-gray-900 dark:text-white">{result.protocol}</div>
            </div>
          </div>

          <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('serialNumber')}</div>
            <div class="font-mono text-sm break-all text-gray-900 dark:text-white">{result.serialNumber}</div>
          </div>
        </div>
{/if}

      <div class="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300">
        <p>{t('note')}</p>
      </div>
    </div>
  
