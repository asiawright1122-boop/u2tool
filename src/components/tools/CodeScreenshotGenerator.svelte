<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  interface ThemePalette {
    bg: string;
    text: string;
    keyword: string;
    string: string;
    comment: string;
    lineNumber: string;
  }

  const THEMES = {
    dracula: {
      bg: '#282a36',
      text: '#f8f8f2',
      keyword: '#ff79c6',
      string: '#f1fa8c',
      comment: '#6272a4',
      lineNumber: '#6272a4',
    },
    github: {
      bg: '#0d1117',
      text: '#c9d1d9',
      keyword: '#ff7b72',
      string: '#a5d6ff',
      comment: '#8b949e',
      lineNumber: '#6e7681',
    },
    nord: {
      bg: '#2e3440',
      text: '#d8dee9',
      keyword: '#81a1c1',
      string: '#a3be8c',
      comment: '#616e88',
      lineNumber: '#4c566a',
    },
  } as const satisfies Record<string, ThemePalette>;
  const THEME_NAMES = Object.keys(THEMES) as Array<keyof typeof THEMES>;
  const LANGUAGES = ['javascript', 'typescript', 'python', 'html', 'css', 'json', 'bash'] as const;

  type ThemeKey = keyof typeof THEMES;
  type LanguageKey = (typeof LANGUAGES)[number];

  let { locale, translations }: Props = $props();

  function t(key: string): string {
    const scope = translations['tools']['code-screenshot-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return typeof value === 'string' ? value : `MISSING: tools.code-screenshot-generator.${key}`;
  }

  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let code = $state('function hello() {\n  return "Hello, World!";\n}');
  let theme = $state<ThemeKey>('dracula');
  let language = $state<LanguageKey>('javascript');
  let padding = $state(32);
  let fontSize = $state(14);
  let showLineNumbers = $state(true);
  let windowControls = $state(true);
  let previewRef = $state<HTMLElement | null>(null);

  let lines = $derived.by(() => code.split('\n'));
  let currentTheme = $derived.by(() => THEMES[theme]);

  function escapeHtml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function highlightCode(source: string) {
    const palette = currentTheme;
    const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
    const strings = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g;
    const keywords = /\b(function|const|let|var|if|else|for|while|return|import|export|class|async|await|try|catch|from|new)\b/g;
    const tokens: string[] = [];
    const storeToken = (html: string) => `__TOKEN_${tokens.push(html) - 1}__`;

    let highlighted = escapeHtml(source)
      .replace(comments, (match) => storeToken(`<span style="color:${palette.comment}">${match}</span>`))
      .replace(strings, (match) => storeToken(`<span style="color:${palette.string}">${match}</span>`))
      .replace(keywords, `<span style="color:${palette.keyword}">$1</span>`);

    highlighted = highlighted.replace(/__TOKEN_(\d+)__/g, (_, index) => tokens[Number(index)] ?? '');
    return highlighted;
  }

  async function downloadImage() {
    if (!previewRef) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(previewRef, {
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `code-screenshot-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      // Ignore client-only rendering failures.
    }
  }
</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label for="code-screenshot-generator-field-10" class="tool-label">{tCommon('input')}</label>
            <textarea
              bind:value={code}
              class="w-full h-48 p-3 border rounded-lg font-mono text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
              placeholder={tCommon('inputPlaceholder')} id="code-screenshot-generator-field-10"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="code-screenshot-generator-field-9" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('theme')}</label>
              <select
                value={theme}
                onchange={(e) => theme = e.target.value as ThemeKey}
                class="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600" id="code-screenshot-generator-field-9">
                {#each THEME_NAMES as themeName (themeName)}
<option value={themeName}>{themeName}</option>
{/each}
              </select>
            </div>
            <div>
              <label for="code-screenshot-generator-field-8" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('language')}</label>
              <select
                value={language}
                onchange={(e) => language = e.target.value as LanguageKey}
                class="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600" id="code-screenshot-generator-field-8">
                {#each LANGUAGES as option (option)}
<option value={option}>{option}</option>
{/each}
              </select>
            </div>
            <div>
              <label for="code-screenshot-generator-field-7" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('padding')}: {padding}px</label>
              <input
                type="range"
                min="16"
                max="64"
                value={padding}
                onchange={(e) => padding = Number(e.target.value)}
                class="w-full" id="code-screenshot-generator-field-7" />
            </div>
            <div>
              <label for="code-screenshot-generator-field-6" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('fontSize')}: {fontSize}px</label>
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onchange={(e) => fontSize = Number(e.target.value)}
                class="w-full" id="code-screenshot-generator-field-6" />
            </div>
          </div>

          <div class="flex gap-4">
            <label class="flex items-center gap-2">
              <input type="checkbox" bind:checked={showLineNumbers} />
              <span class="text-sm text-gray-700 dark:text-gray-300">{t('lineNumbers')}</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" bind:checked={windowControls} />
              <span class="text-sm text-gray-700 dark:text-gray-300">{t('windowControls')}</span>
            </label>
          </div>

          <button
            onclick={downloadImage}
            class="w-full py-2 px-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
            {tCommon('download')} PNG
          </button>
        </div>

        <div class="flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg p-8 min-h-[400px]">
          <div
            bind:this={previewRef}
            style={`padding: ${padding}px; background-color: ${currentTheme.bg}; border-radius: 12px; box-shadow: 0 20px 68px rgba(0,0,0,0.55);`}>
            {#if windowControls}
<div class="flex gap-2 mb-4 px-4 pt-4">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
{/if}
            <pre
              class="overflow-x-auto"
              style={`margin: 0; padding: ${windowControls ? '0 16px 16px' : '16px'};`}>
              <code
                style={`color: ${currentTheme.text}; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: ${fontSize}px; line-height: 1.6;`}>
                {#each lines as line, i (i)}
<div class="flex">
                    {#if showLineNumbers}
<span
                        class="select-none mr-4"
                        style={`min-width: 2em; text-align: right; color: ${currentTheme.lineNumber};`}>
                        {i + 1}
                      </span>
{/if}
                    <span>{@html highlightCode(line) || '&nbsp;'}</span>
                  </div>
{/each}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
