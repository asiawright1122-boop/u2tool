<script lang="ts">
  import { keyLabels } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['keyboard-tester'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.keyboard-tester.${key}`;
  }

  // Types
  interface KeyInfo {
  key: string;
  code: string;
  keyCode: number;
  pressed: boolean;
}

  let pressedKeys = $state(new Set());

  let lastKey = $state(null);

  let keyHistory = $state([]);

  function handleKeyDown(e: KeyboardEvent) {
    e.preventDefault();
    const keyInfo: KeyInfo = {
      key: e.key,
      code: e.code,
      keyCode: e.keyCode,
      pressed: true,
    };
    lastKey = keyInfo;
    keyHistory = [keyInfo, ...keyHistory.slice(0, 9)];
    pressedKeys = new Set(pressedKeys).add(e.code);
  }

  function handleKeyUp(e: KeyboardEvent) {
    e.preventDefault();
    {
    const next = new Set(pressedKeys);
      next.delete(e.code);
    pressedKeys = next;
  };
  }

  $effect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  });

  // Functions
  function getKeyLabel(code: string) {
    if (keyLabels[code]) return keyLabels[code];
    if (code.startsWith('Key')) return code.slice(3);
    if (code.startsWith('Digit')) return code.slice(5);
    if (code.startsWith('F') && code.length <= 3) return code;
    return code;
  }
  function getKeyWidth(code: string) {
    if (code === 'Space') return 'w-48';
    if (code === 'Backspace' || code === 'Tab' || code === 'CapsLock' || code === 'Enter') return 'w-20';
    if (code.includes('Shift')) return 'w-24';
    if (code.includes('Control') || code.includes('Alt') || code.includes('Meta')) return 'w-14';
    return 'w-10';
  }
  function clearHistory() {
    keyHistory = [];
    lastKey = null;
  }

</script>


    <div class="space-y-6">
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
        <p class="text-blue-700 dark:text-blue-300">{t('pressAnyKey')}</p>
      </div>

      {#if lastKey}
<div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 class="font-semibold mb-3">{t('lastKeyPressed')}</h3>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('key')}</div>
              <div class="text-2xl font-mono font-bold">{lastKey.key}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('code')}</div>
              <div class="text-lg font-mono">{lastKey.code}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('keyCode')}</div>
              <div class="text-lg font-mono">{lastKey.keyCode}</div>
            </div>
          </div>
        </div>
{/if}

      <div class="p-4 bg-gray-900 rounded-lg overflow-x-auto">
        <div class="min-w-max space-y-1">
          {#each keyboardLayout as row, rowIndex (rowIndex)}
<div  class="flex gap-1 justify-center">
              {#each row as code (code)}
<button 
                  class={`${getKeyWidth(code)} h-10 rounded text-xs font-medium transition-all ${
                    pressedKeys.has(code)
                      ? 'bg-blue-500 text-white scale-95'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {getKeyLabel(code)}
                </button>
{/each}
            </div>
{/each}
        </div>
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-semibold">{t('keyHistory')}</h3>
          <button
            onclick={clearHistory}
            class="text-sm text-blue-600 hover:text-blue-700"
          >
            {t('clear')}
          </button>
        </div>
        {#if keyHistory.length > 0}
<div class="space-y-2">
            {#each keyHistory as key, index (index)}
<div 
                class="flex items-center gap-4 p-2 bg-white dark:bg-gray-700 rounded text-sm"
              >
                <span class="font-mono font-bold w-16">{key.key}</span>
                <span class="font-mono text-gray-500">{key.code}</span>
                <span class="font-mono text-gray-400">({key.keyCode})</span>
              </div>
{/each}
          </div>
{:else}
<p class="text-gray-500 text-sm">{t('noKeysPressed')}</p>
{/if}
      </div>

      <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h3 class="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">{t('tips')}</h3>
        <ul class="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>• {t('tip1')}</li>
          <li>• {t('tip2')}</li>
          <li>• {t('tip3')}</li>
        </ul>
      </div>
    </div>
  
