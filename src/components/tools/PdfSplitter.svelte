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

  // Types
  interface PageInfo {
  pageNum: number;
  thumbnail: string;
  selected: boolean;
}

  let pages = $state([]);

  let pdfFile = $state(null);

  let loading = $state(false);

  let error = $state('');

  let splitMode = $state('selected');

  let rangeStart = $state(1);

  let rangeEnd = $state(1);

  let fileName = $state('');

  async function handleFileUpload(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      error = t('pdfSplitter.invalidFileType');
      return;
    }
    loading = true;
    error = '';
    pdfFile = file;
    fileName = file.name.replace('.pdf', '');

    try {
      const pdfjsLib = await import('pdfjs-dist');
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageInfos: PageInfo[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const scale = 0.3;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        pageInfos.push({ pageNum: i, thumbnail: canvas.toDataURL('image/png'), selected: false });
      }

      pages = pageInfos;
      rangeEnd = pdf.numPages;
    } catch {
      error = t('pdfSplitter.parseError');
    } finally {
      loading = false;
    }
    e.target.value = '';
  }

  $effect(() => {
    import('pdfjs-dist').then((pdfjsLib) => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    });
  });

  // Functions
  function togglePage(pageNum: number) {
    pages = pages.map(p => p.pageNum === pageNum ? { ...p, selected: !p.selected } : p);
  }
  function selectAll() { return pages = pages.map(p => ({ ...p, selected: true })); }
  function deselectAll() { return pages = pages.map(p => ({ ...p, selected: false })); }
  async function handleSplit() {
    if (!pdfFile) return;
    loading = true;
    error = '';

    try {
      const { PDFDocument } = await import('pdf-lib');
      const arrayBuffer = await pdfFile.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = srcDoc.getPageCount();

      let pagesToExtract: number[] = [];

      if (splitMode === 'selected') {
        pagesToExtract = pages.filter(p => p.selected).map(p => p.pageNum);
        if (pagesToExtract.length === 0) {
          error = t('pdfSplitter.noPagesSelected');
          loading = false;
          return;
        }
      } else if (splitMode === 'range') {
        for (let i = rangeStart; i <= Math.min(rangeEnd, totalPages); i++) {
          pagesToExtract.push(i);
        }
      } else {
        pagesToExtract = Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      if (splitMode === 'each') {
        const zip = new JSZip();
        for (const pageNum of pagesToExtract) {
          const newDoc = await PDFDocument.create();
          const [page] = await newDoc.copyPages(srcDoc, [pageNum - 1]);
          newDoc.addPage(page);
          const pdfBytes = await newDoc.save();
          zip.file(`${fileName}_page${pageNum}.pdf`, pdfBytes);
        }
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `${fileName}_split.zip`);
      } else {
        const newDoc = await PDFDocument.create();
        for (const pageNum of pagesToExtract) {
          const [page] = await newDoc.copyPages(srcDoc, [pageNum - 1]);
          newDoc.addPage(page);
        }
        const pdfBytes = await newDoc.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
        saveAs(blob, `${fileName}_split.pdf`);
      }
    } catch {
      error = t('pdfSplitter.splitError');
    } finally {
      loading = false;
    }
  }
  const selectedCount = pages.filter(p => p.selected).length;

</script>


    <div class="space-y-6">
      <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input type="file" accept=".pdf" onchange={handleFileUpload} class="hidden" id="pdf-split-upload" />
        <label for="pdf-split-upload" class="cursor-pointer flex flex-col items-center">
          <span class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/></svg></span>
          <span class="text-lg font-medium text-gray-700 dark:text-gray-300">{t('pdfSplitter.uploadPdf')}</span>
        </label>
      </div>

      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
{/if}

      {#if loading}
<div class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">{t('pdfSplitter.processing')}</p>
        </div>
{/if}

      {#if pages.length > 0}
!loading && (
        
          <div class="flex flex-wrap gap-4 items-end">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pdfSplitter.splitMode')}</label>
              <select value={splitMode} onchange={e => splitMode = e.target.value as 'selected' | 'range' | 'each'} class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                <option value="selected">{t('pdfSplitter.selectedPages')}</option>
                <option value="range">{t('pdfSplitter.pageRange')}</option>
                <option value="each">{t('pdfSplitter.eachPage')}</option>
              </select>
            </div>
            {#if splitMode === 'range'}

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pdfSplitter.from')}</label>
                  <input type="number" value={rangeStart} onchange={e => rangeStart = Number(e.target.value)} min={1} max={pages.length} class="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pdfSplitter.to')}</label>
                  <input type="number" value={rangeEnd} onchange={e => rangeEnd = Number(e.target.value)} min={1} max={pages.length} class="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
                </div>
              
{/if}
          </div>

          {#if splitMode === 'selected'}
<div>

              <div class="flex gap-2">
                <button onclick={selectAll} class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">{t('pdfSplitter.selectAll')}</button>
                <button onclick={deselectAll} class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">{t('pdfSplitter.deselectAll')}</button>
              </div>
              <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {#each pages as page (page.pageNum)}
<div  onclick={() => togglePage(page.pageNum)} class={`cursor-pointer border-2 rounded overflow-hidden transition-all ${page.selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 dark:border-gray-700'}`}>
                    <img src={page.thumbnail} alt={`Page ${page.pageNum}`} class="w-full" />
                    <div class="text-center text-xs py-1 bg-gray-50 dark:bg-gray-800">{page.pageNum}</div>
                  </div>
{/each}
              </div>
            
</div>
{/if}

          <button onclick={handleSplit} disabled={loading || (splitMode === 'selected' && selectedCount === 0)} class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
            {t('pdfSplitter.split')} {#if splitMode === 'selected'}
`(${selectedCount} ${t('pdfSplitter.pages')})`
{/if}
          </button>
        
      )
{/if}
    </div>
  
