<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const tools = translations['tools'] as Record<string, unknown> | undefined;
    const scope = (tools?.['pdf-to-text'] as Record<string, unknown> | undefined) || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.pdf-to-text.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type PDFDocumentProxy = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<{
    getTextContent: () => Promise<{
      items: Array<{ str?: string }>;
    }>;
  }>;
};

  let text = $state('');

  let loading = $state(false);

  let error = $state('');

  let fileName = $state('');

  let pageCount = $state(0);

  let pdfjsRef = $state(null);

  async function extractText(file: File) {
    if (!pdfjsRef) {
      error = 'PDF library not loaded';
      return;
    }

    loading = true;
    error = '';
    text = '';
    fileName = file.name;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsRef.getDocument({ data: arrayBuffer }).promise as PDFDocumentProxy;
      pageCount = pdf.numPages;

      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ');
        fullText += `--- ${t('page')} ${i} ---\n${pageText}\n\n`;
      }
      text = fullText.trim();
    } catch {
      error = t('errorParsing');
    } finally {
      loading = false;
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type === 'application/pdf') {
      extractText(file);
    } else {
      error = t('errorInvalidFile');
    }
  }

  $effect(() => {
    // 动态导入 pdfjs-dist 仅在客户端
    import('pdfjs-dist').then((pdfjs) => {
      pdfjsRef = pdfjs;
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    });
  });

  // Functions
  function handleFileChange(e: Event) {
    const file = e.target.files?.[0];
    if (file) extractText(file);
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(text);
  }
  function downloadTxt() {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace('.pdf', '.txt');
    a.click();
    URL.revokeObjectURL(url);
  }

</script>


    <div class="space-y-6">
      <div role="region"
        ondrop={handleDrop}
        ondragover={(e) => e.preventDefault()}
        class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-amber-500 transition-colors"
      >
        <input
          type="file"
          accept=".pdf"
          onchange={handleFileChange}
          class="hidden"
          id="pdf-input"
        />
        <label for="pdf-input" class="cursor-pointer">
          <div class="text-4xl mb-4"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg></div>
          <p class="text-gray-600 dark:text-gray-400">{t('dropzone')}</p>
          <p class="text-sm text-gray-500 mt-2">PDF</p>
        </label>
      </div>

      {#if loading}
<div class="text-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">{t('extracting')}</p>
        </div>
{/if}

      {#if error}
<div class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
{/if}

      {#if text}
<div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {fileName} - {pageCount} {t('pages')}
            </div>
            <div class="flex gap-2">
              <button
                onclick={copyToClipboard}
                class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {tc('copy')}
              </button>
              <button
                onclick={downloadTxt}
                class="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                {tc('download')} TXT
              </button>
            </div>
          </div>
          <textarea
            value={text}
            readOnly
            class="w-full h-96 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 font-mono text-sm"></textarea>
        </div>
{/if}
    </div>

