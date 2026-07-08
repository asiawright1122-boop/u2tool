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

  let file = $state(null);

  let originalSize = $state(0);

  let compressedSize = $state(0);

  let loading = $state(false);

  let error = $state('');

  let compressionLevel = $state('medium');

  let compressedBlob = $state(null);

  async function handleFileUpload(e: Event) {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    if (!uploadedFile.name.toLowerCase().endsWith('.pdf')) {
      error = t('pdfCompressor.invalidFileType');
      return;
    }
    file = uploadedFile;
    originalSize = uploadedFile.size;
    compressedSize = 0;
    compressedBlob = null;
    error = '';
    e.target.value = '';
  }

  // Functions
  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  async function handleCompress() {
    if (!file) return;
    loading = true;
    error = '';

    try {
      const { PDFDocument } = await import('pdf-lib');
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // PDF compression options based on level
      const options: { useObjectStreams?: boolean } = {};
      if (compressionLevel === 'high') {
        options.useObjectStreams = true;
      }

      const pdfBytes = await pdfDoc.save(options);
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      
      compressedSize = blob.size;
      compressedBlob = blob;
    } catch {
      error = t('pdfCompressor.compressError');
    } finally {
      loading = false;
    }
  }
  function handleDownload() {
    if (compressedBlob && file) {
      saveAs(compressedBlob, file.name.replace('.pdf', '_compressed.pdf'));
    }
  }
  const compressionRatio = originalSize > 0 && compressedSize > 0 
    ? ((1 - compressedSize / originalSize) * 100).toFixed(1) 
    : 0;

</script>


    <div class="space-y-6">
      <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input type="file" accept=".pdf" onchange={handleFileUpload} class="hidden" id="pdf-compress-upload" />
        <label for="pdf-compress-upload" class="cursor-pointer flex flex-col items-center">
          <span class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg></span>
          <span class="text-lg font-medium text-gray-700 dark:text-gray-300">{t('pdfCompressor.uploadPdf')}</span>
        </label>
      </div>

      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
{/if}

      {#if file}
<div>

          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-center gap-3">
              <span class="text-3xl"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg></span>
              <div class="flex-1">
                <div class="font-medium">{file.name}</div>
                <div class="text-sm text-gray-500">{t('pdfCompressor.originalSize')}: {formatSize(originalSize)}</div>
              </div>
            </div>
          </div>

          <div>
            <div class="tool-label">{t('pdfCompressor.compressionLevel')}</div>
            <div class="flex gap-4">
              {#each (['low', 'medium', 'high'] as const) as level (level)}
<label  class="flex items-center">
                  <input type="radio" value={level} checked={compressionLevel === level} onchange={() => compressionLevel = level} class="mr-2" />
                  {t(`pdfCompressor.${level}`)}
                </label>
{/each}
            </div>
          </div>

          <button onclick={handleCompress} disabled={loading} class="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
            {loading ? t('pdfCompressor.compressing') : t('pdfCompressor.compress')}
          </button>

          {#if compressedSize > 0}
<div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-green-700 dark:text-green-400">{t('pdfCompressor.compressionComplete')}</span>
                <span class="text-green-600 dark:text-green-400">{compressionRatio}% {t('pdfCompressor.reduced')}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                <span>{t('pdfCompressor.originalSize')}: {formatSize(originalSize)}</span>
                <span>{t('pdfCompressor.compressedSize')}: {formatSize(compressedSize)}</span>
              </div>
              <button onclick={handleDownload} class="w-full px-4 py-2 btn-success rounded-lg hover:bg-green-700 font-medium">
                {t('pdfCompressor.download')}
              </button>
            </div>
{/if}
        
</div>
{/if}
    </div>
  
