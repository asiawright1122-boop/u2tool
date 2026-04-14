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
  interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

  let images = $state([]);

  let pageSize = $state('a4');

  let orientation = $state('portrait');

  let margin = $state(20);

  let loading = $state(false);

  let error = $state('');

  let outputFileName = $state('images');

  function handleFileUpload(e: Event) {
    const files = e.target.files;
    if (!files) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const newImages: ImageItem[] = [];

    Array.from(files).forEach(file => {
      if (!validTypes.includes(file.type)) {
        error = t('imageToPdf.invalidFileType');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        newImages.push({ id: Date.now().toString() + Math.random(), file, preview: ev.target?.result as string });
        if (newImages.length === files.length) {
          images = [...images, ...newImages];
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }

  // Functions
  function removeImage(id: string) { return images = images.filter(img => img.id !== id); }
  function moveImage(index: number, direction: 'up' | 'down') {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    const newImages = [...images];
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    images = newImages;
  }
  async function handleConvert() {
    if (images.length === 0) {
      error = t('imageToPdf.noImages');
      return;
    }

    loading = true;
    error = '';

    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();
      
      const pageSizes: Record<string, [number, number]> = {
        a4: [595.28, 841.89],
        letter: [612, 792],
      };

      for (const img of images) {
        const imgBytes = await fetch(img.preview).then(r => r.arrayBuffer());
        let embeddedImg;
        
        if (img.file.type === 'image/png') {
          embeddedImg = await pdfDoc.embedPng(imgBytes);
        } else {
          embeddedImg = await pdfDoc.embedJpg(imgBytes);
        }

        let pageWidth: number, pageHeight: number;
        
        if (pageSize === 'fit') {
          pageWidth = embeddedImg.width + margin * 2;
          pageHeight = embeddedImg.height + margin * 2;
        } else {
          [pageWidth, pageHeight] = pageSizes[pageSize];
          if (orientation === 'landscape') {
            [pageWidth, pageHeight] = [pageHeight, pageWidth];
          }
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        const availableWidth = pageWidth - margin * 2;
        const availableHeight = pageHeight - margin * 2;
        
        const scale = Math.min(availableWidth / embeddedImg.width, availableHeight / embeddedImg.height);
        const scaledWidth = embeddedImg.width * scale;
        const scaledHeight = embeddedImg.height * scale;
        
        const x = (pageWidth - scaledWidth) / 2;
        const y = (pageHeight - scaledHeight) / 2;

        page.drawImage(embeddedImg, { x, y, width: scaledWidth, height: scaledHeight });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      saveAs(blob, `${outputFileName}.pdf`);
    } catch {
      error = t('imageToPdf.convertError');
    } finally {
      loading = false;
    }
  }

</script>


    <div class="space-y-6">
      <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" multiple onchange={handleFileUpload} class="hidden" id="image-upload" />
        <label for="image-upload" class="cursor-pointer flex flex-col items-center">
          <span class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg></span>
          <span class="text-lg font-medium text-gray-700 dark:text-gray-300">{t('imageToPdf.uploadImages')}</span>
          <span class="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('imageToPdf.supportedFormats')}</span>
        </label>
      </div>

      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
{/if}

      {#if images.length > 0}

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('imageToPdf.pageSize')}</label>
              <select value={pageSize} onchange={e => pageSize = e.target.value as 'a4' | 'letter' | 'fit'} class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="fit">{t('imageToPdf.fitToImage')}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('imageToPdf.orientation')}</label>
              <select value={orientation} onchange={e => orientation = e.target.value as 'portrait' | 'landscape'} disabled={pageSize === 'fit'} class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 disabled:opacity-50">
                <option value="portrait">{t('imageToPdf.portrait')}</option>
                <option value="landscape">{t('imageToPdf.landscape')}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('imageToPdf.margin')}</label>
              <input type="number" bind:value={margin} min={0} max={100} class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('imageToPdf.fileName')}</label>
              <input type="text" value={outputFileName} onchange={e => outputFileName = e.target.value} class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
          </div>

          <div class="space-y-2">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('imageToPdf.imageList')} ({images.length})</h3>
            {#each images as img, index (img.id)}
<div  class="flex items-center gap-3 p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                <img src={img.preview} alt="" class="w-16 h-16 object-cover rounded" />
                <span class="flex-1 truncate text-sm">{img.file.name}</span>
                <div class="flex gap-1">
                  <button onclick={() => moveImage(index, 'up')} disabled={index === 0} class="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30">↑</button>
                  <button onclick={() => moveImage(index, 'down')} disabled={index === images.length - 1} class="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30">↓</button>
                  <button onclick={() => removeImage(img.id)} class="p-1 text-red-500 hover:text-red-700">✕</button>
                </div>
              </div>
{/each}
          </div>

          <button onclick={handleConvert} disabled={loading} class="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
            {loading ? t('imageToPdf.converting') : t('imageToPdf.convert')}
          </button>
        
{/if}
    </div>
  
