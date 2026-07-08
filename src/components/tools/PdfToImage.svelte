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
  import JSZip from 'jszip';
  import { saveAs } from 'file-saver';
  import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

  // Types
  interface PagePreview {
  pageNum: number;
  dataUrl: string;
  selected: boolean;
}

  let pages = $state([]);

  let format = $state('png');

  let dpi = $state(150);

  let loading = $state(false);

  let error = $state('');

  let fileName = $state('');

  let pdfFileData = $state<ArrayBuffer | null>(null);

  async function loadPdfJs() {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
    return pdfjsLib;
  }

  async function handleFileUpload(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      error = t('pdfToImage.invalidFileType');
      pdfFileData = null;
      pages = [];
      return;
    }

    loading = true;
    error = '';
    pages = [];
    pdfFileData = null;
    fileName = file.name.replace(/\.pdf$/i, '');

    try {
      const pdfjsLib = await loadPdfJs();
      const arrayBuffer = await file.arrayBuffer();
      pdfFileData = arrayBuffer.slice(0);
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)) }).promise;
      const previews: PagePreview[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const scale = 0.5;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        previews.push({ pageNum: i, dataUrl: canvas.toDataURL('image/png'), selected: true });
      }

      pages = previews;
    } catch {
      error = t('pdfToImage.parseError');
    } finally {
      loading = false;
    }
    e.target.value = '';
  }

  $effect(() => {
    void loadPdfJs();
  });

  // Functions
  function togglePage(pageNum: number) {
    pages = pages.map(p => p.pageNum === pageNum ? { ...p, selected: !p.selected } : p);
  }
  function selectAll() { return pages = pages.map(p => ({ ...p, selected: true })); }
  function deselectAll() { return pages = pages.map(p => ({ ...p, selected: false })); }
  async function handleConvert() {
    const selectedPages = pages.filter(p => p.selected);
    if (selectedPages.length === 0) {
      error = t('pdfToImage.noPagesSelected');
      return;
    }

    loading = true;
    try {
      const pdfjsLib = await loadPdfJs();
      const sourceData = pdfFileData;
      if (!sourceData) {
        error = t('pdfToImage.parseError');
        return;
      }

      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(sourceData.slice(0)) }).promise;
      const scale = dpi / 72;

      if (selectedPages.length === 1) {
        const page = await pdf.getPage(selectedPages[0].pageNum);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        canvas.toBlob(blob => {
          if (blob) saveAs(blob, `${fileName}_page${selectedPages[0].pageNum}.${format}`);
        }, `image/${format}`, format === 'jpeg' ? 0.92 : undefined);
      } else {
        const zip = new JSZip();
        for (const sp of selectedPages) {
          const page = await pdf.getPage(sp.pageNum);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d')!;
          await page.render({ canvasContext: ctx, viewport, canvas }).promise;

          const dataUrl = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.92 : undefined);
          const base64 = dataUrl.split(',')[1];
          zip.file(`${fileName}_page${sp.pageNum}.${format}`, base64, { base64: true });
        }
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `${fileName}_images.zip`);
      }
    } catch {
      error = t('pdfToImage.convertError');
    } finally {
      loading = false;
    }
  }
  let selectedCount = $derived(pages.filter((p) => p.selected).length);

</script>


    <div class="space-y-6">
      <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input type="file" accept=".pdf" onchange={handleFileUpload} class="hidden" id="pdf-upload" />
        <label for="pdf-upload" class="cursor-pointer flex flex-col items-center">
          <span class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></span>
          <span class="text-lg font-medium text-gray-700 dark:text-gray-300">{t('pdfToImage.uploadPdf')}</span>
          <span class="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('pdfToImage.selectPdf')}</span>
        </label>
      </div>

      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
{/if}

      {#if loading}
<div class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">{t('pdfToImage.processing')}</p>
        </div>
{/if}

      {#if pages.length > 0}
<div>
{#if !loading}

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label for="pdf-to-image-field-4" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pdfToImage.format')}</label>
              <select value={format} onchange={e => format = e.target.value as 'png' | 'jpeg'} class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" id="pdf-to-image-field-4">
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
              </select>
            </div>
            <div>
              <label for="pdf-to-image-field-3" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pdfToImage.dpi')}</label>
              <select bind:value={dpi} class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" id="pdf-to-image-field-3">
                <option value={72}>72 DPI</option>
                <option value={150}>150 DPI</option>
                <option value={300}>300 DPI</option>
              </select>
            </div>
          </div>

          <div class="flex gap-2">
            <button onclick={selectAll} class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">{t('pdfToImage.selectAll')}</button>
            <button onclick={deselectAll} class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">{t('pdfToImage.deselectAll')}</button>
          </div>

          <div class="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {#each pages as page (page.pageNum)}
<div role="button" tabindex="0" onkeydown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }}  onclick={() => togglePage(page.pageNum)} class={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${page.selected ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-gray-200 dark:border-gray-700'}`}>
                <img src={page.dataUrl} alt={`Page ${page.pageNum}`} class="w-full" />
                <div class="text-center text-xs py-1 bg-gray-50 dark:bg-gray-800">{page.pageNum}</div>
              </div>
{/each}
          </div>

          <button onclick={handleConvert} disabled={selectedCount === 0 || loading} class="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
            {t('pdfToImage.convert')} ({selectedCount} {t('pdfToImage.pages')})
          </button>

      {/if}
</div>
{/if}
    </div>

