<script lang="ts">
  import { onDestroy } from 'svelte';

  import {
    bytesToRows,
    findAsciiMatches,
    findByteMatches,
    formatHexOffset,
    hexToText as decodeHexText,
    isHexFileSizeSupported,
    parseHexSearch,
    textToHex as encodeTextHex,
    updateByte,
    type HexSearchMatch,
  } from '@/lib/hex-editor';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  type Mode = 'file-editor' | 'text-converter';
  type SearchKind = 'hex' | 'ascii';

  const BYTES_PER_PAGE = 256;

  let { locale: _locale, translations }: Props = $props();

  function t(
    key: string,
    variables: Record<string, string | number> = {},
  ): string {
    const scope = (translations.tools as Record<string, unknown>) ?? {};
    let value: unknown = scope;
    for (const segment of key.split('.')) {
      value = (value as Record<string, unknown> | undefined)?.[segment];
    }
    if (typeof value !== 'string') {
      return `MISSING: tools.${key}`;
    }
    return Object.entries(variables).reduce(
      (result, [name, replacement]) =>
        result.replaceAll(`{${name}}`, String(replacement)),
      value,
    );
  }

  let mode = $state<Mode>('file-editor');
  let originalBytes = $state<Uint8Array | null>(null);
  let bytes = $state(new Uint8Array());
  let fileName = $state('');
  let fileError = $state('');
  let pageStart = $state(0);
  let hexSearch = $state('');
  let asciiSearch = $state('');
  let searchKind = $state<SearchKind>('hex');
  let searchMatches = $state<HexSearchMatch[]>([]);
  let searchIndex = $state(-1);
  let searchError = $state('');
  let text = $state('');
  let hex = $state('');
  let conversionError = $state('');
  let copiedField = $state<'text' | 'hex' | null>(null);
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  let rows = $derived(
    bytesToRows(bytes.slice(pageStart, pageStart + BYTES_PER_PAGE)).map((row) => ({
      ...row,
      offset: row.offset + pageStart,
    })),
  );
  let pageEnd = $derived(Math.min(pageStart + BYTES_PER_PAGE, bytes.length));
  let modifiedCount = $derived.by(() => {
    if (!originalBytes || originalBytes.length !== bytes.length) return 0;
    let count = 0;
    for (let offset = 0; offset < bytes.length; offset += 1) {
      if (bytes[offset] !== originalBytes[offset]) count += 1;
    }
    return count;
  });

  onDestroy(() => {
    if (copyTimer) clearTimeout(copyTimer);
  });

  async function openLocalFile(event: Event): Promise<void> {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!isHexFileSizeSupported(file.size)) {
      originalBytes = null;
      bytes = new Uint8Array();
      fileName = '';
      fileError = t('hex-editor.fileTooLarge');
      clearSearch();
      return;
    }

    const loaded = new Uint8Array(await file.arrayBuffer());
    originalBytes = loaded.slice();
    bytes = loaded;
    fileName = file.name;
    fileError = '';
    pageStart = 0;
    clearSearch();
  }

  function editByte(offset: number, event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    try {
      bytes = updateByte(bytes, offset, input.value.trim());
      input.value = byteHex(bytes[offset]);
      refreshSearch();
    } catch {
      input.value = byteHex(bytes[offset]);
    }
  }

  function editAscii(rowOffset: number, rowLength: number, event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    const value = input.value;
    const printableAscii = [...value].every((character) => {
      const code = character.charCodeAt(0);
      return code >= 0x20 && code <= 0x7e;
    });
    if (value.length !== rowLength || !printableAscii) {
      input.value = bytesToRows(bytes.slice(rowOffset, rowOffset + rowLength), rowLength)[0]?.ascii ?? '';
      return;
    }

    const updated = bytes.slice();
    for (let index = 0; index < rowLength; index += 1) {
      updated[rowOffset + index] = value.charCodeAt(index);
    }
    bytes = updated;
    refreshSearch();
  }

  function runSearch(kind: SearchKind, value: string): void {
    searchKind = kind;
    if (kind === 'hex') hexSearch = value;
    else asciiSearch = value;
    refreshSearch();
  }

  function refreshSearch(): void {
    searchError = '';
    try {
      searchMatches = searchKind === 'hex'
        ? findByteMatches(bytes, parseHexSearch(hexSearch))
        : findAsciiMatches(bytes, asciiSearch);
      searchIndex = searchMatches.length > 0 ? 0 : -1;
      revealCurrentMatch();
    } catch {
      searchMatches = [];
      searchIndex = -1;
      searchError = t('hex-editor.searchInvalid');
    }
  }

  function clearSearch(): void {
    hexSearch = '';
    asciiSearch = '';
    searchMatches = [];
    searchIndex = -1;
    searchError = '';
  }

  function moveSearch(direction: 1 | -1): void {
    if (searchMatches.length === 0) return;
    searchIndex = (
      searchIndex + direction + searchMatches.length
    ) % searchMatches.length;
    revealCurrentMatch();
  }

  function revealCurrentMatch(): void {
    const match = searchMatches[searchIndex];
    if (match) {
      pageStart = Math.floor(match.start / BYTES_PER_PAGE) * BYTES_PER_PAGE;
    }
  }

  function movePage(direction: 1 | -1): void {
    const lastPageStart = Math.floor(Math.max(0, bytes.length - 1) / BYTES_PER_PAGE) * BYTES_PER_PAGE;
    pageStart = Math.min(
      lastPageStart,
      Math.max(0, pageStart + (direction * BYTES_PER_PAGE)),
    );
  }

  function isActiveMatch(offset: number): boolean {
    const match = searchMatches[searchIndex];
    return Boolean(match && offset >= match.start && offset < match.end);
  }

  function resetChanges(): void {
    if (!originalBytes) return;
    bytes = originalBytes.slice();
    refreshSearch();
  }

  function downloadModifiedFile(): void {
    if (!originalBytes || !fileName) return;
    const blob = new Blob([bytes], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = modifiedFileName(fileName);
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function convertTextToHex(): void {
    hex = encodeTextHex(text);
    conversionError = '';
  }

  function convertHexToText(): void {
    try {
      text = decodeHexText(hex);
      conversionError = '';
    } catch {
      conversionError = t('hex-editor.invalidHex');
    }
  }

  async function copyValue(field: 'text' | 'hex', value: string): Promise<void> {
    await navigator.clipboard.writeText(value);
    copiedField = field;
    if (copyTimer) clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copiedField = null;
    }, 2000);
  }

  function byteHex(byte: number): string {
    return byte.toString(16).toUpperCase().padStart(2, '0');
  }

  function modifiedFileName(name: string): string {
    const extensionIndex = name.lastIndexOf('.');
    if (extensionIndex <= 0) return `${name}.modified`;
    return `${name.slice(0, extensionIndex)}.modified${name.slice(extensionIndex)}`;
  }
</script>

<div class="space-y-4">
  <div class="flex gap-2 border-b border-gray-200 dark:border-gray-700" role="tablist">
    <button
      type="button"
      role="tab"
      data-hex-mode-tab="file-editor"
      aria-selected={mode === 'file-editor'}
      class:active-tab={mode === 'file-editor'}
      class="rounded-t-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200"
      onclick={() => mode = 'file-editor'}
    >
      {t('hex-editor.fileEditor')}
    </button>
    <button
      type="button"
      role="tab"
      data-hex-mode-tab="text-converter"
      aria-selected={mode === 'text-converter'}
      class:active-tab={mode === 'text-converter'}
      class="rounded-t-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200"
      onclick={() => mode = 'text-converter'}
    >
      {t('hex-editor.textConverter')}
    </button>
  </div>

  {#if mode === 'file-editor'}
    <section role="tabpanel" data-hex-file-editor class="space-y-4">
      <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
        <label for="hex-local-file" class="block text-sm font-medium text-gray-900 dark:text-white">
          {t('hex-editor.chooseFile')}
        </label>
        <input
          id="hex-local-file"
          data-hex-file-input
          type="file"
          class="mt-2 block w-full text-sm text-gray-700 file:mr-3 file:rounded file:border-0 file:bg-amber-600 file:px-3 file:py-2 file:text-white hover:file:bg-amber-700 dark:text-gray-200"
          onchange={openLocalFile}
        />
        <p class="mt-2 text-xs text-gray-600 dark:text-gray-300">{t('hex-editor.fileLimit')}</p>
        {#if fileError}
          <p data-hex-file-error role="alert" class="mt-2 text-sm text-red-600 dark:text-red-400">{fileError}</p>
        {/if}
      </div>

      {#if originalBytes}
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p data-hex-filename class="font-medium text-gray-900 dark:text-white">{fileName}</p>
            <p data-hex-modified-count class="text-sm text-gray-600 dark:text-gray-300">
              {t('hex-editor.modifiedCount', { count: modifiedCount })}
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button type="button" data-hex-reset onclick={resetChanges} disabled={modifiedCount === 0} class="rounded bg-gray-600 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50">
              {t('hex-editor.reset')}
            </button>
            <button type="button" data-hex-download onclick={downloadModifiedFile} class="rounded bg-amber-600 px-3 py-2 text-sm text-white hover:bg-amber-700">
              {t('hex-editor.download')}
            </button>
          </div>
        </div>

        <div class="grid gap-3 lg:grid-cols-2">
          <label class="text-sm font-medium text-gray-900 dark:text-white">
            {t('hex-editor.hexSearch')}
            <input data-hex-search bind:value={hexSearch} oninput={(event) => runSearch('hex', event.currentTarget.value)} placeholder={t('hex-editor.searchPlaceholderHex')} class="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 font-mono text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
          </label>
          <label class="text-sm font-medium text-gray-900 dark:text-white">
            {t('hex-editor.asciiSearch')}
            <input data-ascii-search bind:value={asciiSearch} oninput={(event) => runSearch('ascii', event.currentTarget.value)} placeholder={t('hex-editor.searchPlaceholderAscii')} class="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 font-mono text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
          </label>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" data-search-previous onclick={() => moveSearch(-1)} disabled={searchMatches.length === 0} class="rounded bg-gray-600 px-3 py-2 text-sm text-white disabled:opacity-50">{t('hex-editor.previousMatch')}</button>
          <p data-hex-search-status class="text-sm text-gray-700 dark:text-gray-200">
            {#if searchError}
              {searchError}
            {:else if searchMatches.length === 0}
              {t('hex-editor.noMatches')}
            {:else}
              {t('hex-editor.matchStatus', { current: searchIndex + 1, total: searchMatches.length })}
            {/if}
          </p>
          <button type="button" data-search-next onclick={() => moveSearch(1)} disabled={searchMatches.length === 0} class="rounded bg-gray-600 px-3 py-2 text-sm text-white disabled:opacity-50">{t('hex-editor.nextMatch')}</button>
        </div>

        {#if bytes.length > 0}
          <div class="flex items-center justify-between gap-3">
            <button type="button" data-hex-previous-page onclick={() => movePage(-1)} disabled={pageStart === 0} class="rounded bg-gray-600 px-3 py-2 text-sm text-white disabled:opacity-50">{t('hex-editor.previousPage')}</button>
            <p data-hex-page-status class="text-sm text-gray-700 dark:text-gray-200">
              {t('hex-editor.pageStatus', { start: pageStart + 1, end: pageEnd, total: bytes.length })}
            </p>
            <button type="button" data-hex-next-page onclick={() => movePage(1)} disabled={pageEnd >= bytes.length} class="rounded bg-gray-600 px-3 py-2 text-sm text-white disabled:opacity-50">{t('hex-editor.nextPage')}</button>
          </div>
        {/if}

        {#if rows.length === 0}
          <p data-hex-empty class="rounded border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">0 bytes</p>
        {:else}
          <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="min-w-[70rem] bg-gray-100 px-3 py-2 font-mono text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              <span class="inline-block w-24">{t('hex-editor.offset')}</span>
              <span class="inline-block w-[43rem]">{t('hex-editor.bytes')}</span>
              <span>{t('hex-editor.ascii')}</span>
            </div>
            {#each rows as row, rowIndex}
              <div data-hex-row={rowIndex} class="flex min-w-[70rem] items-center gap-3 border-t border-gray-200 px-3 py-2 font-mono text-sm dark:border-gray-700">
                <code data-hex-offset class="w-24 shrink-0 text-gray-600 dark:text-gray-300">{formatHexOffset(row.offset)}</code>
                <div class="grid w-[43rem] shrink-0 grid-cols-16 gap-1">
                  {#each row.bytes as byte, byteIndex}
                    <input
                      data-hex-byte
                      data-byte-offset={row.offset + byteIndex}
                      data-active-match={isActiveMatch(row.offset + byteIndex)}
                      aria-label={`${t('hex-editor.offset')} ${formatHexOffset(row.offset + byteIndex)}`}
                      value={byteHex(byte)}
                      maxlength="2"
                      spellcheck="false"
                      onchange={(event) => editByte(row.offset + byteIndex, event)}
                      class="w-10 rounded border border-gray-300 bg-white px-1 py-1 text-center uppercase text-gray-900 data-[active-match=true]:border-amber-500 data-[active-match=true]:bg-amber-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:data-[active-match=true]:bg-amber-950"
                    />
                  {/each}
                </div>
                <input
                  data-hex-ascii
                  aria-label={`${t('hex-editor.ascii')} ${formatHexOffset(row.offset)}`}
                  value={row.ascii}
                  maxlength={row.bytes.length}
                  spellcheck="false"
                  onchange={(event) => editAscii(row.offset, row.bytes.length, event)}
                  class="w-72 rounded border border-gray-300 bg-white px-2 py-1 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
            {/each}
          </div>
        {/if}
      {/if}
    </section>
  {:else}
    <section role="tabpanel" data-hex-text-converter class="space-y-4">
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label for="hex-editor-text" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">{t('hex-editor.text')}</label>
          <textarea bind:value={text} data-hex-text id="hex-editor-text" class="h-40 w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder={t('hex-editor.inputPlaceholder')}></textarea>
          <div class="mt-2 flex gap-2">
            <button type="button" data-text-to-hex onclick={convertTextToHex} class="rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700">{t('hex-editor.toHex')}</button>
            <button type="button" onclick={() => copyValue('text', text)} class="rounded bg-gray-600 px-3 py-2 text-white hover:bg-gray-700">{copiedField === 'text' ? t('copied') : t('copy')}</button>
          </div>
        </div>
        <div>
          <label for="hex-editor-hex" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">{t('hex-editor.hex')}</label>
          <textarea bind:value={hex} data-hex-text-output id="hex-editor-hex" class="h-40 w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="48 65 6C 6C 6F"></textarea>
          <div class="mt-2 flex gap-2">
            <button type="button" data-hex-to-text onclick={convertHexToText} class="rounded btn-success px-4 py-2 text-white hover:bg-green-700">{t('hex-editor.toText')}</button>
            <button type="button" onclick={() => copyValue('hex', hex)} class="rounded bg-gray-600 px-3 py-2 text-white hover:bg-gray-700">{copiedField === 'hex' ? t('copied') : t('copy')}</button>
          </div>
        </div>
      </div>
      {#if conversionError}
        <p data-hex-conversion-error role="alert" class="text-sm text-red-600 dark:text-red-400">{conversionError}</p>
      {/if}
    </section>
  {/if}
</div>

<style>
  .active-tab {
    border-bottom: 2px solid rgb(217 119 6);
    color: rgb(180 83 9);
  }
</style>
