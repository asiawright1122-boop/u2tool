<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['markdown-to-slides'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.markdown-to-slides.${key}`;
  }

  // Types
  interface Slide {
  title: string;
  content: string[];
  notes?: string;
}

  let markdown = $state('');

  let slides = $state([]);

  let currentSlide = $state(0);

  let isPresenting = $state(false);

  let theme = $state('light');

  function parseMarkdown(md: string) {
    const slideTexts = md.split(/^---$/m).filter(s => s.trim());
    
    return slideTexts.map(slideText => {
      const lines = slideText.trim().split('\n');
      let title = '';
      const content: string[] = [];
      let notes = '';
      let inNotes = false;

      for (const line of lines) {
        if (line.startsWith('# ')) {
          title = line.replace(/^# /, '');
        } else if (line.startsWith('## ')) {
          title = line.replace(/^## /, '');
        } else if (line.toLowerCase().startsWith('notes:') || line.toLowerCase().startsWith('speaker notes:')) {
          inNotes = true;
          notes = line.replace(/^(notes:|speaker notes:)/i, '').trim();
        } else if (inNotes) {
          notes += '\n' + line;
        } else if (line.trim()) {
          content.push(line);
        }
      }

      return { title, content, notes: notes.trim() || undefined };
    });
  }

  function handleConvert() {
    const parsedSlides = parseMarkdown(markdown);
    slides = parsedSlides;
    currentSlide = 0;
  }

  function handlePrevSlide() {
    currentSlide = Math.max(0, currentSlide - 1);
  }

  function handleNextSlide() {
    currentSlide = Math.min(slides.length - 1, currentSlide + 1);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      handlePrevSlide();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      handleNextSlide();
    } else if (e.key === 'Escape') {
      isPresenting = false;
    }
  }

  function exportToHtml() {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Presentation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; }
    .slide { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 2rem; }
    .slide-light { background: white; color: #1a1a1a; }
    .slide-dark { background: #1a1a1a; color: white; }
    .slide-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    h1 { font-size: 3rem; margin-bottom: 2rem; text-align: center; }
    ul { font-size: 1.5rem; line-height: 2; }
    li { margin: 0.5rem 0; }
    p { font-size: 1.5rem; line-height: 1.8; text-align: center; max-width: 800px; }
    @media print { .slide { page-break-after: always; } }
  </style>
</head>
<body>
${slides.map(slide => `
  <div class="slide slide-${theme}">
    ${slide.title ? `<h1>${slide.title}</h1>` : ''}
    ${slide.content.some(c => c.startsWith('- ') || c.startsWith('* ')) 
      ? `<ul>${slide.content.filter(c => c.startsWith('- ') || c.startsWith('* ')).map(c => `<li>${c.replace(/^[-*] /, '')}</li>`).join('')}</ul>`
      : slide.content.map(c => `<p>${c}</p>`).join('')}
  </div>
`).join('')}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presentation.html';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Functions
  function getThemeClasses() {
    switch (theme) {
      case 'dark':
        return 'bg-gray-900 text-white';
      case 'gradient':
        return 'bg-gradient-to-br from-purple-600 to-blue-500 text-white';
      default:
        return 'bg-white text-gray-900';
    }
  }
  const sampleMarkdown = `# Welcome to My Presentation
This is the first slide

---

## Key Points
- First important point
- Second important point
- Third important point

Notes: Remember to explain each point in detail

---

## Conclusion
Thank you for your attention!

- Questions?
- Contact: example@email.com`;

</script>


    <div class="space-y-6" onkeydown={handleKeyDown} tabIndex={0}>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Input Section -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('markdownInput')}
            </label>
            <button
              onclick={() => markdown = sampleMarkdown}
              class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {t('loadSample')}
            </button>
          </div>
          <textarea
            bind:value={markdown}
            placeholder={t('inputPlaceholder')}
            class="w-full h-80 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {t('hint')}
          </p>
        </div>

        <!-- Preview Section -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('preview')}
            </label>
            <div class="flex items-center gap-2">
              <select
                value={theme}
                onchange={(e) => theme = e.target.value as 'light' | 'dark' | 'gradient'}
                class="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="light">{t('themeLight')}</option>
                <option value="dark">{t('themeDark')}</option>
                <option value="gradient">{t('themeGradient')}</option>
              </select>
            </div>
          </div>

          {#if slides.length > 0}
<div class={`h-80 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden ${getThemeClasses()}`}>
              <div class="h-full flex flex-col justify-center items-center p-6 text-center">
                {#if slides[currentSlide]?.title}
<h2 class="text-2xl font-bold mb-4">{slides[currentSlide].title}</h2>
{/if}
                <div class="space-y-2">
                  {#each slides[currentSlide]?.content as line, i (i)}
<p  class="text-lg">
                      {line.startsWith('- ') || line.startsWith('* ') 
                        ? `• ${line.replace(/^[-*] /, '')}`
                        : line}
                    </p>
{/each}
                </div>
              </div>
            </div>
{:else}
<div class="h-80 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
              <p class="text-gray-500 dark:text-gray-400">{t('noSlides')}</p>
            </div>
{/if}

          <!-- Slide Navigation -->
          {#if slides.length > 0}
<div class="flex items-center justify-between">
              <button
                onclick={handlePrevSlide}
                disabled={currentSlide === 0}
                class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                ← {t('prev')}
              </button>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {currentSlide + 1} / {slides.length}
              </span>
              <button
                onclick={handleNextSlide}
                disabled={currentSlide === slides.length - 1}
                class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {t('next')} →
              </button>
            </div>
{/if}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-3">
        <button
          onclick={handleConvert}
          disabled={!markdown.trim()}
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {t('convert')}
        </button>
        {#if slides.length > 0}
<div>

            <button
              onclick={() => isPresenting = true}
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {t('present')}
            </button>
            <button
              onclick={exportToHtml}
              class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {t('exportHtml')}
            </button>
          
</div>
{/if}
      </div>

      <!-- Speaker Notes -->
      {#if slides.length > 0}
slides[currentSlide]?.notes && (
        <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            {t('speakerNotes')}
          </h3>
          <p class="text-sm text-yellow-700 dark:text-yellow-300">
            {slides[currentSlide].notes}
          </p>
        </div>
      )
{/if}

      <!-- Fullscreen Presentation Mode -->
      {#if isPresenting}
<div 
          class={`fixed inset-0 z-50 ${getThemeClasses()}`}
          onkeydown={handleKeyDown}
          tabIndex={0}
        >
          <div class="h-full flex flex-col justify-center items-center p-12 text-center">
            {#if slides[currentSlide]?.title}
<h1 class="text-5xl font-bold mb-8">{slides[currentSlide].title}</h1>
{/if}
            <div class="space-y-4">
              {#each slides[currentSlide]?.content as line, i (i)}
<p  class="text-3xl">
                  {line.startsWith('- ') || line.startsWith('* ') 
                    ? `• ${line.replace(/^[-*] /, '')}`
                    : line}
                </p>
{/each}
            </div>
          </div>
          <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-8">
            <button
              onclick={handlePrevSlide}
              disabled={currentSlide === 0}
              class="px-6 py-3 bg-white/20 rounded-lg disabled:opacity-30 hover:bg-white/30 transition-colors"
            >
              ←
            </button>
            <span class="text-lg">{currentSlide + 1} / {slides.length}</span>
            <button
              onclick={handleNextSlide}
              disabled={currentSlide === slides.length - 1}
              class="px-6 py-3 bg-white/20 rounded-lg disabled:opacity-30 hover:bg-white/30 transition-colors"
            >
              →
            </button>
          </div>
          <button
            onclick={() => isPresenting = false}
            class="absolute top-4 right-4 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            {t('exitPresent')}
          </button>
        </div>
{/if}
    </div>
  
