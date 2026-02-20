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

  let input = $state('');

  let output = $state('');

  let format = $state('unicode');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function textToUnicode() {
    if (!input.trim()) {
      output = '';
      return;
    }
    
    let result = '';
    for (let i = 0; i < input.length; i++) {
      const code = input.charCodeAt(i);
      switch (format) {
        case 'unicode':
          result += '\\u' + code.toString(16).padStart(4, '0').toUpperCase();
          break;
        case 'html':
          result += '&#' + code + ';';
          break;
        case 'css':
          result += '\\' + code.toString(16).toUpperCase();
          break;
      }
    }
    output = result;
  }
  function unicodeToText() {
    if (!input.trim()) {
      output = '';
      return;
    }
    
    try {
      let result = input;
      
      // Handle \uXXXX format
      result = result.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => 
        String.fromCharCode(parseInt(hex, 16))
      );
      
      // Handle &#XXXX; format (decimal)
      result = result.replace(/&#(\d+);/g, (_, dec) => 
        String.fromCharCode(parseInt(dec, 10))
      );
      
      // Handle &#xXXXX; format (hex)
      result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => 
        String.fromCharCode(parseInt(hex, 16))
      );
      
      // Handle CSS \XXXX format
      result = result.replace(/\\([0-9a-fA-F]{1,6})\s?/g, (_, hex) => 
        String.fromCharCode(parseInt(hex, 16))
      );
      
      output = result;
    } catch (_e) {
      output = 'Error: Invalid Unicode format';
    }
  }
  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  const examples = [
    { text: '你好世界', desc: 'Chinese' },
    { text: 'Hello <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>', desc: 'Emoji' },
    { text: '日本語', desc: 'Japanese' },
    { text: '한국어', desc: 'Korean' },
  ];

</script>


    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">{t('input')}</label>
        <textarea
          class="tool-textarea"
          bind:value={input}
          placeholder={t('unicode.placeholder')}
          rows={4}></textarea>
      </div>

      <!-- Format Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('unicode.format')}</label>
        <div class="flex flex-wrap gap-2">
          <button
            onclick={() => format = 'unicode'}
            class={`px-4 py-2 rounded-lg text-sm ${format === 'unicode' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white'}`}
          >
            Unicode (\u0000)
          </button>
          <button
            onclick={() => format = 'html'}
            class={`px-4 py-2 rounded-lg text-sm ${format === 'html' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white'}`}
          >
            HTML (&#0000;)
          </button>
          <button
            onclick={() => format = 'css'}
            class={`px-4 py-2 rounded-lg text-sm ${format === 'css' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white'}`}
          >
            CSS (\0000)
          </button>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <button onclick={textToUnicode} class="btn-primary">
          {t('unicode.textToUnicode')}
        </button>
        <button onclick={unicodeToText} class="btn-secondary">
          {t('unicode.unicodeToText')}
        </button>
        <button onclick={() => { input = ''; output = ''; }} class="btn-secondary">
          {t('clear')}
        </button>
      </div>

      <!-- Quick Examples -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('unicode.examples')}</label>
        <div class="flex flex-wrap gap-2">
          {#each examples as ex (ex.text)}
<button 
              onclick={() => input = ex.text}
              class="px-3 py-1.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-white"
            >
              {ex.text} ({ex.desc})
            </button>
{/each}
        </div>
      </div>

      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-white">{t('output')}</label>
            <button
              onclick={copyOutput}
              class={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white'}`}
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <textarea
            class="tool-textarea font-mono"
            value={output}
            readOnly
            rows={4}></textarea>
        </div>
{/if}

      <!-- Reference -->
      <div class="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-300">
        <p class="mb-2">{t('unicode.reference')}:</p>
        <ul class="list-disc list-inside space-y-1">
          <li><code class="text-blue-600 dark:text-blue-400">\u4E2D</code> → 中 (Unicode)</li>
          <li><code class="text-blue-600 dark:text-blue-400">&#20013;</code> → 中 (HTML Decimal)</li>
          <li><code class="text-blue-600 dark:text-blue-400">&#x4E2D;</code> → 中 (HTML Hex)</li>
          <li><code class="text-blue-600 dark:text-blue-400">\4E2D</code> → 中 (CSS)</li>
        </ul>
      </div>
    </div>
  
