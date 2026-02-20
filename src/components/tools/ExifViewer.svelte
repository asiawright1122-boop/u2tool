<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['exif-viewer'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.exif-viewer.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ExifData {
  [key: string]: string | number | undefined;
}

  let image = $state(null);

  let fileName = $state('');

  let exifData = $state(null);

  let isLoading = $state(false);

  let cleanedImage = $state(null);

  let fileInputRef = $state(null);

  // Functions
  async function handleImageUpload(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;

    isLoading = true;
    fileName = file.name;
    image = URL.createObjectURL(file);
    cleanedImage = null;

    try {
      const ExifReader = await import('exifreader');
      const tags = await ExifReader.load(file);

      const extractedData: ExifData = {};

      // Common EXIF fields
      const fields = [
        'Make', 'Model', 'DateTime', 'DateTimeOriginal',
        'ExposureTime', 'FNumber', 'ISOSpeedRatings', 'FocalLength',
        'Flash', 'WhiteBalance', 'ExposureProgram', 'MeteringMode',
        'ImageWidth', 'ImageHeight', 'Orientation',
        'GPSLatitude', 'GPSLongitude', 'GPSAltitude',
        'Software', 'Artist', 'Copyright',
      ];

      fields.forEach((field) => {
        if (tags[field]) {
          extractedData[field] = tags[field].description || tags[field].value;
        }
      });

      // Also include any other tags
      Object.keys(tags).forEach((key) => {
        if (!fields.includes(key) && tags[key].description) {
          extractedData[key] = tags[key].description;
        }
      });

      exifData = Object.keys(extractedData).length > 0 ? extractedData : null;
    } catch (error) {
      console.error('EXIF reading error:', error);
      exifData = null;
    }

    isLoading = false;
  }
  function removeExif() {
    if (!image) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        cleanedImage = canvas.toDataURL('image/jpeg', 0.95);
      }
    };
    img.src = image;
  }
  function downloadCleanedImage() {
    if (!cleanedImage) return;
    const link = document.createElement('a');
    link.href = cleanedImage;
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}_no_exif.jpg`;
    link.click();
  }
  function clearAll() {
    image = null;
    fileName = '';
    exifData = null;
    cleanedImage = null;
    if (fileInputRef) {
      fileInputRef.value = '';
    }
  }
  function formatFieldName(name: string) {
    return name.replace(/([A-Z])/g, ' $1').trim();
  }

</script>


    <div class="space-y-6">
      <!-- Upload -->
      {#if !image}
<label class="block border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500">
          <input
            bind:this={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/tiff"
            onchange={handleImageUpload}
            class="hidden"
          />
          <div class="text-4xl mb-2">📷</div>
          <p class="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
          <p class="text-sm text-gray-500 mt-1">{t('supportedFormats')}</p>
        </label>
{:else}
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Image Preview -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="font-medium">{t('image')}</h3>
              <button onclick={clearAll} class="text-sm text-blue-600 hover:underline">
                {tg('clear')}
              </button>
            </div>
            <img
              src={cleanedImage || image}
              alt={fileName}
              class="max-w-full rounded-lg border border-gray-200 dark:border-gray-700"
            />
            <p class="text-sm text-gray-600 dark:text-gray-400">{fileName}</p>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                onclick={removeExif}
                disabled={!!cleanedImage}
                class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg text-sm"
              >
                {t('removeExif')}
              </button>
              {#if cleanedImage}
<button
                  onclick={downloadCleanedImage}
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                >
                  {t('downloadClean')}
                </button>
{/if}
            </div>
            {#if cleanedImage}
<p class="text-sm text-green-600 dark:text-green-400">
                ✓ {t('exifRemoved')}
              </p>
{/if}
          </div>

          <!-- EXIF Data -->
          <div class="space-y-4">
            <h3 class="font-medium">{t('exifData')}</h3>
            {#if isLoading}
<div class="text-center py-8">
                <div class="animate-spin text-2xl">⏳</div>
                <p class="text-gray-500 mt-2">{t('loading')}</p>
              </div>
{:else if exifData}
<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                <table class="w-full text-sm">
                  <tbody>
                    {#each Object.entries(exifData) as [key, value] (key)}
<tr  class="border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <td class="py-2 pr-4 font-medium text-gray-600 dark:text-gray-400">
                          {formatFieldName(key)}
                        </td>
                        <td class="py-2 text-gray-900 dark:text-white break-all">
                          {String(value)}
                        </td>
                      </tr>
{/each}
                  </tbody>
                </table>
              </div>
{:else}
<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                <p class="text-gray-500">{t('noExifData')}</p>
              </div>
{/if}

            {#if exifData}
<p class="text-sm text-gray-500">
                {t('fieldsFound')}: {Object.keys(exifData).length}
              </p>
{/if}
          </div>
        </div>
{/if}
    </div>
  
