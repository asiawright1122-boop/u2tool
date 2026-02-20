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
  function td(key: string): string {
    const scope = translations['tools']['data-uri'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.data-uri.${key}`;
  }

  let dataUri = $state('');

  let fileInfo = $state(null);

  let copied = $state(false);

  let timerRef = $state(null);

  let fileRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function handleFile(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      dataUri = reader.result as string;
      fileInfo = {
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.type || 'unknown'
      };
    };
    reader.readAsDataURL(file);
  }
  async function copy() {
    await navigator.clipboard.writeText(dataUri);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function clear() {
    dataUri = '';
    fileInfo = null;
    if (fileRef) fileRef.value = '';
  }

</script>


    <div class="space-y-4">
      <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 dark:bg-transparent" onclick={() => fileRef?.click()}>
        <input bind:this={fileRef} type="file" onchange={handleFile} class="hidden" />
        <p class="text-gray-600 dark:text-gray-300">{'Drop file here or click to browse'}</p>
      </div>
      {#if fileInfo}
<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 grid grid-cols-3 gap-4 text-sm text-gray-900 dark:text-white">
          <div><span class="text-gray-600 dark:text-gray-300">{'File Name'}:</span> {fileInfo.name}</div>
          <div><span class="text-gray-600 dark:text-gray-300">{'File Size'}:</span> {fileInfo.size}</div>
          <div><span class="text-gray-600 dark:text-gray-300">{'File Type'}:</span> {fileInfo.type}</div>
        </div>
{/if}
      <div>
        <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">{td('output')}</label>
        <textarea value={dataUri} readOnly class="w-full h-40 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-xs break-all text-gray-900 dark:text-white"></textarea>
      </div>
      <div class="flex gap-2">
        <button onclick={copy} disabled={!dataUri} class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{copied ? t('copied') : t('copy')}</button>
        <button onclick={clear} class="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-700">{t('clear')}</button>
      </div>
      {#if dataUri}
dataUri.startsWith('data:image') && (
        <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-[200px]">
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">{'Preview'}</p>
          <img src={dataUri} alt="Preview" class="max-w-full max-h-64 mx-auto" style="aspect-ratio: auto" />
        </div>
      )
{/if}
    </div>
  
