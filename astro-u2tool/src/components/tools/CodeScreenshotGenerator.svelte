<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['code-screenshot-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.code-screenshot-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let code = $state('function hello() {\n  console.log("Hello, World!");\n}');

  let theme = $state('dracula');

  let language = $state('javascript');

  let padding = $state(32);

  let fontSize = $state(14);

  let showLineNumbers = $state(true);

  let windowControls = $state(true);

  let previewRef = $state(null);

  function highlightCode(code: string) {
    const currentTheme = themes[theme];
    const keywords = /\b(function|const|let|var|if|else|for|while|return|import|export|class|async|await|try|catch)\b/g;
    const strings = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g;
    const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
    
    let highlighted = code
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(comments, `<span style="color:${currentTheme.comment}">$1</span>`)
      .replace(strings, `<span style="color:${currentTheme.string}">$&</span>`)
      .replace(keywords, `<span style="color:${currentTheme.keyword}">$1</span>`);
    return highlighted;
  }

  // Functions
  async function downloadImage() {
    if (!previewRef) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(previewRef, { backgroundColor: null, scale: 2 });
      const link = document.createElement('a');
      link.download = `code-screenshot-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) { /* ignore */ }
  }
  const lines = code.split('\n');
  const currentTheme = themes[theme];

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{tCommon('input')}</label>
            <textarea
              bind:value={code}
              class="w-full h-48 p-3 border rounded-lg font-mono text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
              placeholder={tCommon('inputPlaceholder')}></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('theme')}</label>
              <select value={theme} onchange={(e) => theme = e.target.value as keyof typeof themes}
                class="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
                {#each Object.keys(themes) as t (t)}
<option  value={t}>{t}</option>
{/each}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('language')}</label>
              <select bind:value={language}
                class="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
                {#each languages as l (l)}
<option  value={l}>{l}</option>
{/each}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('padding')}: {padding}px</label>
              <input type="range" min="16" max="64" value={padding} onchange={(e) => padding = Number(e.target.value)}
                class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('fontSize')}: {fontSize}px</label>
              <input type="range" min="12" max="24" value={fontSize} onchange={(e) => fontSize = Number(e.target.value)}
                class="w-full" />
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
          <button onclick={downloadImage}
            class="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {tCommon('download')} PNG
          </button>
        </div>

        <div class="flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg p-8 min-h-[400px]">
          <div bind:this={previewRef} style="padding; background-color: {currentTheme.bg}; border-radius: 12px; box-shadow: 0 20px 68px rgba(0,0,0,0.55)">
            {#if windowControls}
<div class="flex gap-2 mb-4 px-4 pt-4">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
{/if}
            <pre class="overflow-x-auto" style="margin: 0; padding: {windowControls ? '0 16px 16px' : '16px'}">
              <code style="color: {currentTheme.text}; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">
                {#each lines as line, i (i)}
<div  class="flex">
                    {#if showLineNumbers}
<span class="select-none mr-4 opacity-50" style="min-width: 2em; text-align: right">{i + 1}</span>
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
  
