<script lang="ts">
  import { onDestroy } from 'svelte';

  import {
    bytesToRows,
    findNextByteMatch,
    findPreviousByteMatch,
    formatHexOffset,
    hexToText as decodeHexText,
    InvalidUtf8Error,
    isHexFileSizeSupported,
    parseAsciiSearch,
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
  let searchNeedle = $state(new Uint8Array());
  let searchMatch = $state<HexSearchMatch | null>(null);
  let searchAttempted = $state(false);
  let searchError = $state('');
  let invalidByteOffset = $state<number | null>(null);
  let invalidByteValue = $state('');
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
    clearByteError();
    clearSearch();
  }

  function editByte(offset: number, event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    try {
      bytes = updateByte(bytes, offset, input.value.trim());
      clearByteError();
      refreshSearch();
    } catch {
      invalidByteOffset = offset;
      invalidByteValue = input.value;
    }
  }

  function clearByteError(): void {
    invalidByteOffset = null;
    invalidByteValue = '';
  }

  function runSearch(kind: SearchKind, value: string): void {
    searchKind = kind;
    if (kind === 'hex') hexSearch = value;
    else asciiSearch = value;
    searchMatch = null;
    searchAttempted = false;
    searchError = '';
    try {
      searchNeedle = kind === 'hex'
        ? parseHexSearch(value)
        : parseAsciiSearch(value);
    } catch {
      searchNeedle = new Uint8Array();
      searchError = t(
        kind === 'hex'
          ? 'hex-editor.searchInvalid'
          : 'hex-editor.asciiSearchInvalid',
      );
    }
  }

  function refreshSearch(): void {
    runSearch(searchKind, searchKind === 'hex' ? hexSearch : asciiSearch);
  }

  function clearSearch(): void {
    hexSearch = '';
    asciiSearch = '';
    searchNeedle = new Uint8Array();
    searchMatch = null;
    searchAttempted = false;
    searchError = '';
  }

  function moveSearch(direction: 1 | -1): void {
    if (searchNeedle.length === 0 || searchError) return;
    const lastStart = bytes.length - searchNeedle.length;
    let nextMatch = direction === 1
      ? findNextByteMatch(bytes, searchNeedle, searchMatch ? searchMatch.start + 1 : 0)
      : findPreviousByteMatch(bytes, searchNeedle, searchMatch ? searchMatch.start - 1 : lastStart);
    if (!nextMatch && searchMatch) {
      nextMatch = direction === 1
        ? findNextByteMatch(bytes, searchNeedle, 0)
        : findPreviousByteMatch(bytes, searchNeedle, lastStart);
    }
    searchMatch = nextMatch;
    searchAttempted = true;
    revealCurrentMatch();
  }

  function revealCurrentMatch(): void {
    if (searchMatch) {
      pageStart = Math.floor(searchMatch.start / BYTES_PER_PAGE) * BYTES_PER_PAGE;
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
    return Boolean(
      searchMatch &&
      offset >= searchMatch.start &&
      offset < searchMatch.end
    );
  }

  function resetChanges(): void {
    if (!originalBytes) return;
    bytes = originalBytes.slice();
    clearByteError();
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
    } catch (error) {
      conversionError = t(
        error instanceof InvalidUtf8Error
          ? 'hex-editor.invalidUtf8'
          : 'hex-editor.invalidHex',
      );
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

  function selectMode(nextMode: Mode, focusTab = false): void {
    mode = nextMode;
    if (focusTab) {
      queueMicrotask(() => {
        document.getElementById(`hex-${nextMode}-tab`)?.focus();
      });
    }
  }

  function handleTabKeydown(event: KeyboardEvent, currentMode: Mode): void {
    let nextMode: Mode | null = null;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      nextMode = currentMode === 'file-editor'
        ? 'text-converter'
        : 'file-editor';
    } else if (event.key === 'Home') {
      nextMode = 'file-editor';
    } else if (event.key === 'End') {
      nextMode = 'text-converter';
    }
    if (!nextMode) return;
    event.preventDefault();
    selectMode(nextMode, true);
  }
</script>

<div class="space-y-4">
  <div class="flex gap-2 border-b border-gray-200 dark:border-gray-700" role="tablist">
    <button
      type="button"
      role="tab"
      id="hex-file-editor-tab"
      data-hex-mode-tab="file-editor"
      aria-controls="hex-file-editor-panel"
      aria-selected={mode === 'file-editor'}
      tabindex={mode === 'file-editor' ? 0 : -1}
      class:active-tab={mode === 'file-editor'}
      class="rounded-t-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200"
      onclick={() => selectMode('file-editor')}
      onkeydown={(event) => handleTabKeydown(event, 'file-editor')}
    >
      {t('hex-editor.fileEditor')}
    </button>
    <button
      type="button"
      role="tab"
      id="hex-text-converter-tab"
      data-hex-mode-tab="text-converter"
      aria-controls="hex-text-converter-panel"
      aria-selected={mode === 'text-converter'}
      tabindex={mode === 'text-converter' ? 0 : -1}
      class:active-tab={mode === 'text-converter'}
      class="rounded-t-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200"
      onclick={() => selectMode('text-converter')}
      onkeydown={(event) => handleTabKeydown(event, 'text-converter')}
    >
      {t('hex-editor.textConverter')}
    </button>
  </div>

  {#if mode === 'file-editor'}
    <section role="tabpanel" id="hex-file-editor-panel" aria-labelledby="hex-file-editor-tab" data-hex-file-editor class="space-y-4">
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
          <button type="button" data-search-previous onclick={() => moveSearch(-1)} disabled={searchNeedle.length === 0 || Boolean(searchError)} class="rounded bg-gray-600 px-3 py-2 text-sm text-white disabled:opacity-50">{t('hex-editor.previousMatch')}</button>
          <p data-hex-search-status aria-live="polite" class="text-sm text-gray-700 dark:text-gray-200">
            {#if searchError}
              {searchError}
            {:else if searchMatch}
              {t('hex-editor.matchOffset', { offset: formatHexOffset(searchMatch.start) })}
            {:else if searchAttempted || searchNeedle.length === 0}
              {t('hex-editor.noMatches')}
            {:else}
              {t('hex-editor.searchReady')}
            {/if}
          </p>
          <button type="button" data-search-next onclick={() => moveSearch(1)} disabled={searchNeedle.length === 0 || Boolean(searchError)} class="rounded bg-gray-600 px-3 py-2 text-sm text-white disabled:opacity-50">{t('hex-editor.nextMatch')}</button>
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
                      value={invalidByteOffset === row.offset + byteIndex ? invalidByteValue : byteHex(byte)}
                      maxlength="2"
                      spellcheck="false"
                      aria-invalid={invalidByteOffset === row.offset + byteIndex}
                      aria-describedby={invalidByteOffset === row.offset + byteIndex ? `hex-byte-error-${row.offset + byteIndex}` : undefined}
                      onchange={(event) => editByte(row.offset + byteIndex, event)}
                      class="w-10 rounded border border-gray-300 bg-white px-1 py-1 text-center uppercase text-gray-900 data-[active-match=true]:border-amber-500 data-[active-match=true]:bg-amber-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:data-[active-match=true]:bg-amber-950"
                    />
                  {/each}
                </div>
                <code
                  data-hex-ascii
                  aria-label={`${t('hex-editor.ascii')} ${formatHexOffset(row.offset)}`}
                  class="block w-72 whitespace-pre rounded bg-gray-50 px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white"
                >{row.ascii}</code>
              </div>
            {/each}
          </div>
          {#if invalidByteOffset !== null}
            <p
              id={`hex-byte-error-${invalidByteOffset}`}
              data-hex-byte-error
              role="alert"
              class="mt-2 text-sm text-red-600 dark:text-red-400"
            >{t('hex-editor.invalidByte')}</p>
          {/if}
        {/if}
      {/if}
    </section>
  {:else}
    <section role="tabpanel" id="hex-text-converter-panel" aria-labelledby="hex-text-converter-tab" data-hex-text-converter class="space-y-4">
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
