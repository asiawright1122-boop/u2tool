<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['text-to-pdf'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.text-to-pdf.${key}`;
  }

  let text = $state('');

  let title = $state('');

  let fontSize = $state(12);

  let fontFamily = $state('Arial');

  let pageSize = $state('a4');

  let isGenerating = $state(false);

  let previewRef = $state(null);

  // Functions
  async function generatePdf() {
    if (!text.trim()) return;
    isGenerating = true;

    try {
      // Dynamic import jsPDF
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: pageSize,
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      
      const currentFont = fontFamily === 'Arial' ? 'helvetica' : fontFamily === 'Times New Roman' ? 'times' : 'courier';
      doc.setFont(currentFont);
      doc.setFontSize(fontSize);

      // Add title if provided
      let yPosition = margin;
      if (title.trim()) {
        doc.setFontSize(fontSize + 4);
        doc.setFont(currentFont, 'bold');
        doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 10;
        doc.setFontSize(fontSize);
        doc.setFont(currentFont, 'normal');
      }

      // Split text into lines
      const lines = doc.splitTextToSize(text, maxWidth);
      const lineHeight = fontSize * 0.4;

      for (const line of lines) {
        if (yPosition + lineHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      }

      // Download
      const fileName = title.trim() ? `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf` : 'document.pdf';
      doc.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      isGenerating = false;
    }
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="tool-label">
            {t('title')} ({t('optional')})
          </label>
          <input
            type="text"
            bind:value={title}
            placeholder={t('titlePlaceholder')}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div>
            <label class="tool-label">
              {t('fontSize')}
            </label>
            <select
              value={fontSize}
              onchange={(e) => fontSize = Number(e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {#each [10, 11, 12, 14, 16, 18, 20, 24] as size (size)}
<option  value={size}>{size}pt</option>
{/each}
            </select>
          </div>
          <div>
            <label class="tool-label">
              {t('font')}
            </label>
            <select
              bind:value={fontFamily}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times</option>
              <option value="Courier">Courier</option>
            </select>
          </div>
          <div>
            <label class="tool-label">
              {t('pageSize')}
            </label>
            <select
              value={pageSize}
              onchange={(e) => pageSize = e.target.value as 'a4' | 'letter'}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label class="tool-label">
          {t('content')}
        </label>
        <textarea
          bind:value={text}
          placeholder={t('contentPlaceholder')}
          class="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
          style="font-size: {fontSize}px"></textarea>
        <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {text.length} {t('characters')}
        </div>
      </div>

      <div class="flex justify-center">
        <button
          onclick={generatePdf}
          disabled={!text.trim() || isGenerating}
          class="px-8 py-3 bg-rose-500 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {#if isGenerating}

              <span class="animate-spin">⏳</span>
              {t('generating')}
            
{:else}

              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg> {t('downloadPdf')}
            
{/if}
        </button>
      </div>

      <div bind:this={previewRef} class="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-inner">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{t('preview')}</h3>
        <div
          class="min-h-[200px] whitespace-pre-wrap text-gray-900 dark:text-white"
          style="font-size: {fontSize}px"
        >
          {#if title}
<div class="text-center font-bold mb-4" style="font-size: {fontSize + 4}px">{title}</div>
{/if}
          {#if text}
{text}
{:else}
<span class="text-gray-400">{t('previewPlaceholder')}</span>
{/if}
        </div>
      </div>
    </div>
  
