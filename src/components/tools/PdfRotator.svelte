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
  interface PageInfo {
  pageNum: number;
  thumbnail: string;
  rotation: number;
}

  let pages = $state([]);

  let pdfFile = $state(null);

  let loading = $state(false);

  let error = $state('');

  let globalRotation = $state(90);

  async function handleFileUpload(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      error = t('pdfRotator.invalidFileType');
      return;
    }
    loading = true;
    error = '';
    pdfFile = file;

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
        pageInfos.push({ pageNum: i, thumbnail: canvas.toDataURL('image/png'), rotation: 0 });
      }

      pages = pageInfos;
    } catch {
      error = t('pdfRotator.parseError');
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
  function rotatePage(pageNum: number, angle: number) {
    pages = pages.map(p => 
      p.pageNum === pageNum ? { ...p, rotation: (p.rotation + angle + 360) % 360 } : p
    );
  }
  function rotateAll(angle: number) {
    pages = pages.map(p => ({ ...p, rotation: (p.rotation + angle + 360) % 360 }));
  }
  function resetAll() {
    pages = pages.map(p => ({ ...p, rotation: 0 }));
  }
  async function handleSave() {
    if (!pdfFile) return;
    loading = true;
    error = '';

    try {
      const { PDFDocument, degrees } = await import('pdf-lib');
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pdfPages = pdfDoc.getPages();

      pages.forEach((pageInfo, index) => {
        if (pageInfo.rotation !== 0) {
          const page = pdfPages[index];
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + pageInfo.rotation));
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      saveAs(blob, pdfFile.name.replace('.pdf', '_rotated.pdf'));
    } catch {
      error = t('pdfRotator.saveError');
    } finally {
      loading = false;
    }
  }
  const hasChanges = pages.some(p => p.rotation !== 0);

</script>


    <div class="space-y-6">
      <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input type="file" accept=".pdf" onchange={handleFileUpload} class="hidden" id="pdf-rotate-upload" />
        <label for="pdf-rotate-upload" class="cursor-pointer flex flex-col items-center">
          <span class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg></span>
          <span class="text-lg font-medium text-gray-700 dark:text-gray-300">{t('pdfRotator.uploadPdf')}</span>
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
          <p class="mt-2 text-gray-600 dark:text-gray-400">{t('pdfRotator.processing')}</p>
        </div>
{/if}

      {#if pages.length > 0}
<div>
{#if !loading}
        
          <div class="flex flex-wrap gap-4 items-center">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('pdfRotator.rotateAll')}:</span>
              <select value={globalRotation} onchange={e => globalRotation = Number(e.target.value)} class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800">
                <option value={90}>90°</option>
                <option value={180}>180°</option>
                <option value={270}>270°</option>
              </select>
              <button onclick={() => rotateAll(globalRotation)} class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">{t('pdfRotator.apply')}</button>
            </div>
            <button onclick={resetAll} class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">{t('pdfRotator.reset')}</button>
          </div>

          <div class="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {#each pages as page (page.pageNum)}
<div  class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div class="relative bg-gray-100 dark:bg-gray-800 p-2">
                  <img src={page.thumbnail} alt={`Page ${page.pageNum}`} class="w-full transition-transform" style="transform: rotate({page.rotation}deg)" />
                  {#if page.rotation !== 0}
<span class="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1 rounded">{page.rotation}°</span>
{/if}
                </div>
                <div class="flex items-center justify-between p-1 bg-gray-50 dark:bg-gray-800">
                  <span class="text-xs">{page.pageNum}</span>
                  <div class="flex gap-1">
                    <button onclick={() => rotatePage(page.pageNum, -90)} class="p-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-700 rounded">↺</button>
                    <button onclick={() => rotatePage(page.pageNum, 90)} class="p-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-700 rounded">↻</button>
                  </div>
                </div>
              </div>
{/each}
          </div>

          <button onclick={handleSave} disabled={!hasChanges || loading} class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
            {t('pdfRotator.save')}
          </button>
        
      {/if}
</div>
{/if}
    </div>
  
