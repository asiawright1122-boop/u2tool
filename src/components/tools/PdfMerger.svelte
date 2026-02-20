<script lang="ts">
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

  // Imports
  import { saveAs } from 'file-saver';

  // Types
  interface PdfItem {
  id: string;
  file: File;
  name: string;
  pageCount: number;
}

  let pdfs = $state([]);

  let loading = $state(false);

  let error = $state('');

  let outputFileName = $state('merged');

  async function handleFileUpload(e: Event) {
    const files = e.target.files;
    if (!files) return;

    error = '';
    const newPdfs: PdfItem[] = [];
    const { PDFDocument } = await import('pdf-lib');

    for (const file of Array.from(files)) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        error = t('pdfMerger.invalidFileType');
        continue;
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        newPdfs.push({
          id: Date.now().toString() + Math.random(),
          file,
          name: file.name,
          pageCount: pdfDoc.getPageCount()
        });
      } catch {
        error = t('pdfMerger.parseError');
      }
    }

    pdfs = [...pdfs, ...newPdfs];
    e.target.value = '';
  }

  // Functions
  function removePdf(id: string) { return pdfs = pdfs.filter(p => p.id !== id); }
  function movePdf(index: number, direction: 'up' | 'down') {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= pdfs.length) return;
    const newPdfs = [...pdfs];
    [newPdfs[index], newPdfs[newIndex]] = [newPdfs[newIndex], newPdfs[index]];
    pdfs = newPdfs;
  }
  async function handleMerge() {
    if (pdfs.length < 2) {
      error = t('pdfMerger.needMoreFiles');
      return;
    }

    loading = true;
    error = '';

    try {
      const { PDFDocument } = await import('pdf-lib');
      const mergedPdf = await PDFDocument.create();

      for (const pdf of pdfs) {
        const arrayBuffer = await pdf.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      saveAs(blob, `${outputFileName}.pdf`);
    } catch {
      error = t('pdfMerger.mergeError');
    } finally {
      loading = false;
    }
  }
  const totalPages = pdfs.reduce((sum, p) => sum + p.pageCount, 0);

</script>


    <div class="space-y-6">
      <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input type="file" accept=".pdf" multiple onchange={handleFileUpload} class="hidden" id="pdf-merger-upload" />
        <label for="pdf-merger-upload" class="cursor-pointer flex flex-col items-center">
          <span class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></span>
          <span class="text-lg font-medium text-gray-700 dark:text-gray-300">{t('pdfMerger.uploadPdfs')}</span>
          <span class="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('pdfMerger.multipleFiles')}</span>
        </label>
      </div>

      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
{/if}

      {#if pdfs.length > 0}

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pdfMerger.outputFileName')}</label>
            <input type="text" value={outputFileName} onchange={e => outputFileName = e.target.value} class="w-full md:w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
          </div>

          <div class="space-y-2">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('pdfMerger.fileList')} ({pdfs.length} {t('pdfMerger.files')}, {totalPages} {t('pdfMerger.totalPages')})
            </h3>
            {#each pdfs as pdf, index (pdf.id)}
<div  class="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <span class="text-2xl"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg></span>
                <div class="flex-1">
                  <div class="font-medium text-sm truncate">{pdf.name}</div>
                  <div class="text-xs text-gray-500">{pdf.pageCount} {t('pdfMerger.pages')}</div>
                </div>
                <div class="flex gap-1">
                  <button onclick={() => movePdf(index, 'up')} disabled={index === 0} class="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30">↑</button>
                  <button onclick={() => movePdf(index, 'down')} disabled={index === pdfs.length - 1} class="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30">↓</button>
                  <button onclick={() => removePdf(pdf.id)} class="p-1 text-red-500 hover:text-red-700">✕</button>
                </div>
              </div>
{/each}
          </div>

          <button onclick={handleMerge} disabled={pdfs.length < 2 || loading} class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
            {loading ? t('pdfMerger.merging') : t('pdfMerger.merge')}
          </button>
        
{/if}
    </div>
  
