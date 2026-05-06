<script lang="ts">
  import { onDestroy } from 'svelte';
  import { cssToTailwindMap, sizeToTailwind } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['css-to-tailwind'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.css-to-tailwind.${key}`;
  }

  let input = $state('');

  let output = $state('');

  let copied = $state(false);

  let timerRef = $state<ReturnType<typeof setTimeout> | null>(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function convert() {
    const lines = input.split('\n');
    const tailwindClasses: string[] = [];
    const unconverted: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('/*') || trimmed.startsWith('//') || trimmed === '{' || trimmed === '}') continue;

      const match = trimmed.match(/^([a-z-]+)\s*:\s*(.+?)\s*;?$/i);
      if (!match) continue;

      const [, property, value] = match;
      const prop = property.toLowerCase();
      const val = value.toLowerCase().trim();

      // Check direct mapping
      if (cssToTailwindMap[prop]) {
        const result = cssToTailwindMap[prop](val);
        if (result) {
          tailwindClasses.push(result);
          continue;
        }
      }

      // Size-based properties
      const sizeProps: Record<string, string> = {
        'width': 'w', 'height': 'h', 'min-width': 'min-w', 'min-height': 'min-h',
        'max-width': 'max-w', 'max-height': 'max-h', 'padding': 'p', 'padding-top': 'pt',
        'padding-right': 'pr', 'padding-bottom': 'pb', 'padding-left': 'pl',
        'margin': 'm', 'margin-top': 'mt', 'margin-right': 'mr', 'margin-bottom': 'mb',
        'margin-left': 'ml', 'gap': 'gap', 'top': 'top', 'right': 'right',
        'bottom': 'bottom', 'left': 'left', 'border-radius': 'rounded',
        'border-width': 'border', 'font-size': 'text', 'line-height': 'leading',
      };

      if (sizeProps[prop]) {
        let result = sizeToTailwind(val, sizeProps[prop]);
        if (result) {
          tailwindClasses.push(result);
          continue;
        }
      }

      // Color properties
      if (prop === 'color' || prop === 'background-color' || prop === 'border-color') {
        const prefix = prop === 'color' ? 'text' : prop === 'background-color' ? 'bg' : 'border';
        if (val.startsWith('#') || val.startsWith('rgb')) {
          tailwindClasses.push(`${prefix}-[${val}]`);
          continue;
        }
        const colorMap: Record<string, string> = {
          'white': 'white', 'black': 'black', 'red': 'red-500', 'blue': 'amber-500',
          'green': 'green-500', 'yellow': 'yellow-500', 'gray': 'gray-500',
          'transparent': 'transparent',
        };
        if (colorMap[val]) {
          tailwindClasses.push(`${prefix}-${colorMap[val]}`);
          continue;
        }
      }

      // Opacity
      if (prop === 'opacity') {
        const opacity = parseFloat(val) * 100;
        tailwindClasses.push(`opacity-${opacity}`);
        continue;
      }

      // Z-index
      if (prop === 'z-index') {
        tailwindClasses.push(`z-${val}`);
        continue;
      }

      unconverted.push(`${property}: ${value}`);
    }

    let result = tailwindClasses.join(' ');
    if (unconverted.length > 0) {
      result += '\n\n/* Could not convert:\n' + unconverted.map(u => `   ${u}`).join('\n') + '\n*/';
    }

    output = result;
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(output.split('\n')[0]);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function loadExample() {
    input = `display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding: 16px;
margin: 8px;
background-color: #ffffff;
border-radius: 8px;
font-weight: bold;
text-align: center;`;
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label class="tool-label">
            {t('cssInput')}
          </label>
          <textarea
            bind:value={input}
            placeholder={t('placeholder')}
            class="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"></textarea>
        </div>
        <div>
          <label class="tool-label">
            {t('tailwindOutput')}
          </label>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            class="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"></textarea>
        </div>
      </div>

      <div class="flex gap-4 flex-wrap">
        <button
          onclick={convert}
          class="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
        >
          {t('convert')}
        </button>
        {#if output}
<button
            onclick={copyToClipboard}
            class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            {copied ? t('copied') : t('copy')}
          </button>
{/if}
        <button
          onclick={loadExample}
          class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
        >
          {t('loadExample')}
        </button>
      </div>
    </div>
  
