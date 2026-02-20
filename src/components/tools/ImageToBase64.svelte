<script lang="ts">
  import { onDestroy } from 'svelte';

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
  function ti(key: string): string {
    const scope = translations['tools']['image-to-base64'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.image-to-base64.${key}`;
  }

  let base64 = $state('');

  let preview = $state('');

  let fileInfo = $state(null);

  let copied = $state(false);

  let timerRef = $state(null);

  let fileInputRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function handleFileChange(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      base64 = result;
      preview = result;
      fileInfo = {
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
      };
    };
    reader.readAsDataURL(file);
  }
  function formatFileSize(bytes: number) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    useEffect(() => {
      return () => {
        if (timerRef) clearTimeout(timerRef);
      };
    }, []);

    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
  async function copyDataUrl() {
    await navigator.clipboard.writeText(base64);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  async function copyRawBase64() {
    const raw = base64.split(',')[1] || base64;
    await navigator.clipboard.writeText(raw);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function clearAll() {
    base64 = '';
    preview = '';
    fileInfo = null;
    if (fileInputRef) {
      fileInputRef.value = '';
    }
  }

</script>


    <div class="space-y-4">
      <!-- Upload Area -->
      <div
        class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 dark:bg-transparent"
        onclick={() => fileInputRef?.click()}
      >
        <input
          bind:this={fileInputRef}
          type="file"
          accept="image/*"
          onchange={handleFileChange}
          class="hidden"
        />
        <div class="text-4xl mb-4"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>
        <p class="text-gray-600 dark:text-gray-300 mb-2">{ti('uploadHint')}</p>
        <p class="text-xs text-gray-500 dark:text-gray-300">{ti('supportedFormats')}</p>
      </div>

      {#if fileInfo}
<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <div class="flex items-center gap-4">
            {#if preview}
<img
                src={preview}
                alt="Preview"
                class="w-20 h-20 object-contain bg-white dark:bg-gray-900 rounded"
              />
{/if}
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-white truncate">{fileInfo.name}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300">{fileInfo.type}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300">{fileInfo.size}</p>
            </div>
            <button onclick={clearAll} class="btn-secondary text-sm">
              {t('clear')}
            </button>
          </div>
        </div>
{/if}

      {#if base64}
<div class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <button onclick={copyDataUrl} class="btn-primary">
              {copied ? t('copied') : ti('copyDataUrl')}
            </button>
            <button onclick={copyRawBase64} class="btn-secondary">
              {ti('copyRawBase64')}
            </button>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">{ti('base64Output')}</label>
            <textarea
              class="tool-textarea text-xs"
              value={base64}
              readOnly
              rows={6}></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">{ti('htmlImageTag')}</label>
            <textarea
              class="tool-textarea text-xs"
              value={`<img src={'${base64}'} alt="image"></textarea>`}
              readOnly
              rows={2}
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">{ti('cssBackground')}</label>
            <textarea
              class="tool-textarea text-xs"
              value={`background-image: url('${base64}');`}
              readOnly
              rows={2}></textarea>
          </div>
        </div>
{/if}
    </div>
  
