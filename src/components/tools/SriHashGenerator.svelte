<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['sri-hash-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.sri-hash-generator.${key}`;
  }

  let input = $state('');

  let inputType = $state('url');

  let algorithm = $state('sha384');

  let hash = $state('');

  let loading = $state(false);

  let error = $state('');

  let copied = $state('');

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  async function generateHash(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    
    const hashBuffer = await crypto.subtle.digest(
      algorithm === 'sha256' ? 'SHA-256' : algorithm === 'sha384' ? 'SHA-384' : 'SHA-512',
      data
    );
    
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const base64Hash = btoa(String.fromCharCode(...hashArray));
    
    return `${algorithm}-${base64Hash}`;
  }
  async function generate() {
    error = '';
    hash = '';
    loading = true;

    try {
      let content = input;

      if (inputType === 'url') {
        if (!input.trim()) {
          error = 'Please enter a URL';
          return;
        }

        try {
          const response = await fetch(input);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          content = await response.text();
        } catch (e) {
          error = `Fetch failed: ${(e as Error).message}`;
          return;
        }
      } else {
        if (!input.trim()) {
          error = 'Please enter content';
          return;
        }
      }

      const sriHash = await generateHash(content);
      hash = sriHash;
    } catch (e) {
      error = (e as Error).message;
    } finally {
      loading = false;
    }
  }
  function copyToClipboard(text: string, type: string) {
    navigator.clipboard.writeText(text);
    copied = type;
    setTimeout(() => copied = '', 2000);
  }
  function getScriptTag(): string {
    if (!hash) return '';
    const url = inputType === 'url' ? input : 'your-script.js';
    return `<script src="${url}" integrity="${hash}" crossorigin="anonymous"><\/script>`;
  }
  function getLinkTag(): string {
    if (!hash) return '';
    const url = inputType === 'url' ? input : 'your-style.css';
    return `<link rel="stylesheet" href="${url}" integrity="${hash}" crossorigin="anonymous">`;
  }
  function loadExample() {
    inputType = 'url';
    input = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="flex gap-4">
            <label class="flex items-center gap-2">
              <input
                type="radio"
                name="inputType"
                checked={inputType === 'url'}
                onchange={() => inputType = 'url'}
                class="text-blue-600"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">{t('fromUrl')}</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                type="radio"
                name="inputType"
                checked={inputType === 'content'}
                onchange={() => inputType = 'content'}
                class="text-blue-600"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">{t('fromContent')}</span>
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {inputType === 'url' ? t('urlInput') : t('contentInput')}
            </label>
            {#if inputType === 'url'}
<input
                type="text"
                bind:value={input}
                placeholder={t('urlPlaceholder')}
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
              />
{:else}
<textarea
                bind:value={input}
                placeholder={t('contentPlaceholder')}
                class="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"></textarea>
{/if}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('algorithm')}
            </label>
            <select
              value={algorithm}
              onchange={(e) => algorithm = e.target.value as 'sha256' | 'sha384' | 'sha512'}
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="sha256">SHA-256</option>
              <option value="sha384">SHA-384 ({t('recommended')})</option>
              <option value="sha512">SHA-512</option>
            </select>
          </div>

          <div class="flex gap-4">
            <button
              onclick={generate}
              disabled={loading}
              class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? t('generating') : t('generate')}
            </button>
            <button
              onclick={loadExample}
              class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              {t('loadExample')}
            </button>
          </div>

          {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
{/if}
        </div>

        {#if hash}
<div class="space-y-4">
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('sriHash')}
                </label>
                <button
                  onclick={() => copyToClipboard(hash, 'hash')}
                  class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {copied === 'hash' ? t('copied') : t('copy')}
                </button>
              </div>
              <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <code class="text-sm font-mono text-gray-900 dark:text-white break-all">
                  {hash}
                </code>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('scriptTag')}
                </label>
                <button
                  onclick={() => copyToClipboard(getScriptTag(), 'script')}
                  class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {copied === 'script' ? t('copied') : t('copy')}
                </button>
              </div>
              <div class="p-4 bg-gray-900 rounded-lg">
                <code class="text-sm font-mono text-green-400 break-all">
                  {getScriptTag()}
                </code>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('linkTag')}
                </label>
                <button
                  onclick={() => copyToClipboard(getLinkTag(), 'link')}
                  class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {copied === 'link' ? t('copied') : t('copy')}
                </button>
              </div>
              <div class="p-4 bg-gray-900 rounded-lg">
                <code class="text-sm font-mono text-green-400 break-all">
                  {getLinkTag()}
                </code>
              </div>
            </div>

            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 class="font-medium text-blue-800 dark:text-blue-200 mb-2">
                {t('whatIsSri')}
              </h4>
              <p class="text-sm text-blue-700 dark:text-blue-300">
                {t('sriExplanation')}
              </p>
            </div>
          </div>
{/if}
      </div>
    </div>
  
