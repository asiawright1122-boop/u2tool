<script lang="ts">
  import { onDestroy } from 'svelte';
  import { sizeMap, tailwindToCssMap } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['tailwind-to-css'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.tailwind-to-css.${key}`;
  }

  let input = $state('');

  let output = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function convertClass(className: string): string | null {
    // Direct mapping
    if (tailwindToCssMap[className]) {
      return tailwindToCssMap[className];
    }

    // Size-based classes
    const sizePatterns = [
      { regex: /^w-(.+)$/, prop: 'width' },
      { regex: /^h-(.+)$/, prop: 'height' },
      { regex: /^min-w-(.+)$/, prop: 'min-width' },
      { regex: /^min-h-(.+)$/, prop: 'min-height' },
      { regex: /^max-w-(.+)$/, prop: 'max-width' },
      { regex: /^max-h-(.+)$/, prop: 'max-height' },
      { regex: /^p-(.+)$/, prop: 'padding' },
      { regex: /^pt-(.+)$/, prop: 'padding-top' },
      { regex: /^pr-(.+)$/, prop: 'padding-right' },
      { regex: /^pb-(.+)$/, prop: 'padding-bottom' },
      { regex: /^pl-(.+)$/, prop: 'padding-left' },
      { regex: /^px-(.+)$/, prop: 'padding-left|padding-right' },
      { regex: /^py-(.+)$/, prop: 'padding-top|padding-bottom' },
      { regex: /^m-(.+)$/, prop: 'margin' },
      { regex: /^mt-(.+)$/, prop: 'margin-top' },
      { regex: /^mr-(.+)$/, prop: 'margin-right' },
      { regex: /^mb-(.+)$/, prop: 'margin-bottom' },
      { regex: /^ml-(.+)$/, prop: 'margin-left' },
      { regex: /^mx-(.+)$/, prop: 'margin-left|margin-right' },
      { regex: /^my-(.+)$/, prop: 'margin-top|margin-bottom' },
      { regex: /^gap-(.+)$/, prop: 'gap' },
      { regex: /^top-(.+)$/, prop: 'top' },
      { regex: /^right-(.+)$/, prop: 'right' },
      { regex: /^bottom-(.+)$/, prop: 'bottom' },
      { regex: /^left-(.+)$/, prop: 'left' },
    ];

    for (const { regex, prop } of sizePatterns) {
      const match = className.match(regex);
      if (match) {
        const value = match[1];
        let cssValue = sizeMap[value];
        
        if (!cssValue && value.startsWith('[') && value.endsWith(']')) {
          cssValue = value.slice(1, -1);
        }
        
        if (cssValue) {
          if (prop.includes('|')) {
            return prop.split('|').map(p => `${p}: ${cssValue};`).join('\n');
          }
          return `${prop}: ${cssValue};`;
        }
      }
    }

    // Border radius
    const roundedMatch = className.match(/^rounded(?:-(.+))?$/);
    if (roundedMatch) {
      const value = roundedMatch[1];
      const radiusMap: Record<string, string> = {
        'none': '0px', 'sm': '0.125rem', undefined: '0.25rem', 'md': '0.375rem',
        'lg': '0.5rem', 'xl': '0.75rem', '2xl': '1rem', '3xl': '1.5rem', 'full': '9999px',
      };
      return `border-radius: ${radiusMap[value] || value};`;
    }

    // Border width
    const borderMatch = className.match(/^border(?:-(\d+))?$/);
    if (borderMatch) {
      const value = borderMatch[1] || '1';
      return `border-width: ${value}px;`;
    }

    // Opacity
    const opacityMatch = className.match(/^opacity-(\d+)$/);
    if (opacityMatch) {
      return `opacity: ${parseInt(opacityMatch[1]) / 100};`;
    }

    // Z-index
    const zMatch = className.match(/^z-(\d+)$/);
    if (zMatch) {
      return `z-index: ${zMatch[1]};`;
    }

    // Colors
    const colorPatterns = [
      { regex: /^text-\[(.+)\]$/, prop: 'color' },
      { regex: /^bg-\[(.+)\]$/, prop: 'background-color' },
      { regex: /^border-\[(.+)\]$/, prop: 'border-color' },
    ];

    for (const { regex, prop } of colorPatterns) {
      const match = className.match(regex);
      if (match) {
        return `${prop}: ${match[1]};`;
      }
    }

    return null;
  }
  function convert() {
    const classes = input.trim().split(/\s+/);
    const cssLines: string[] = [];
    const unconverted: string[] = [];

    for (const className of classes) {
      if (!className) continue;
      const css = convertClass(className);
      if (css) {
        cssLines.push(css);
      } else {
        unconverted.push(className);
      }
    }

    let result = cssLines.join('\n');
    if (unconverted.length > 0) {
      result += '\n\n/* Could not convert: ' + unconverted.join(', ') + ' */';
    }

    output = result;
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function loadExample() {
    input = 'flex flex-col justify-center items-center p-4 m-2 bg-[#ffffff] rounded-lg font-bold text-center';
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label for="tailwind-to-css-field-4" class="tool-label">
            {t('tailwindInput')}
          </label>
          <textarea
            bind:value={input}
            placeholder={t('placeholder')}
            class="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm" id="tailwind-to-css-field-4"></textarea>
        </div>
        <div>
          <label for="tailwind-to-css-field-3" class="tool-label">
            {t('cssOutput')}
          </label>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            class="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm" id="tailwind-to-css-field-3"></textarea>
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
  
