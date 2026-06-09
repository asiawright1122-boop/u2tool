<script lang="ts">
  import { Check, Copy, RefreshCw } from 'lucide-svelte';
  import { onDestroy } from 'svelte';

  interface Props {
    translations?: Record<string, unknown>;
  }

  interface PassportPreset {
    value: string;
    label: string;
    width: number;
    height: number;
  }

  let { translations = {} }: Props = $props();

  const COPY = {
    title: 'Passport Photo Maker',
    subtitle: 'Calculate passport or visa photo print size, pixel dimensions, aspect ratio, and background checklist.',
    preset: 'Document preset',
    width: 'Custom width (mm)',
    height: 'Custom height (mm)',
    dpi: 'DPI',
    background: 'Background',
    white: 'White',
    offWhite: 'Off-white',
    lightBlue: 'Light blue',
    pixelSize: 'Pixel size',
    printSize: 'Print size',
    aspectRatio: 'Aspect ratio',
    checklist: 'Checklist',
    preview: 'Size preview',
    copy: 'Copy checklist',
    copied: 'Copied',
    reset: 'Reset',
    invalid: 'Enter positive width, height, and DPI values.',
    localNote: 'Specification calculator only. This page does not upload, crop, retouch, or validate photos.',
  };

  const presets: PassportPreset[] = [
    { value: 'usPassport', label: 'US passport - 2 x 2 in', width: 50.8, height: 50.8 },
    { value: 'euPassport', label: 'EU passport - 35 x 45 mm', width: 35, height: 45 },
    { value: 'ukPassport', label: 'UK passport - 35 x 45 mm', width: 35, height: 45 },
    { value: 'indiaPassport', label: 'India passport - 51 x 51 mm', width: 51, height: 51 },
    { value: 'chinaVisa', label: 'China visa - 33 x 48 mm', width: 33, height: 48 },
    { value: 'custom', label: 'Custom dimensions', width: 35, height: 45 },
  ];

  const backgroundOptions = [
    { value: 'white', label: COPY.white, color: '#ffffff', border: '#cbd5e1' },
    { value: 'offWhite', label: COPY.offWhite, color: '#f8fafc', border: '#cbd5e1' },
    { value: 'lightBlue', label: COPY.lightBlue, color: '#dbeafe', border: '#93c5fd' },
  ];

  let preset = $state('usPassport');
  let widthMm = $state('35');
  let heightMm = $state('45');
  let dpi = $state('300');
  let background = $state('white');
  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  const title = $derived(getToolMessage('name', COPY.title));
  const description = $derived(getToolMessage('description', COPY.subtitle));
  const selectedPreset = $derived(presets.find((item) => item.value === preset) || presets[0]);
  const customWidth = $derived(parsePositiveNumber(widthMm));
  const customHeight = $derived(parsePositiveNumber(heightMm));
  const dpiValue = $derived(parsePositiveNumber(dpi));
  const printWidth = $derived(preset === 'custom' ? customWidth : selectedPreset.width);
  const printHeight = $derived(preset === 'custom' ? customHeight : selectedPreset.height);
  const backgroundChoice = $derived(backgroundOptions.find((item) => item.value === background) || backgroundOptions[0]);
  const isValid = $derived(printWidth > 0 && printHeight > 0 && dpiValue > 0);
  const pixelWidth = $derived(isValid ? Math.round((printWidth / 25.4) * dpiValue) : 0);
  const pixelHeight = $derived(isValid ? Math.round((printHeight / 25.4) * dpiValue) : 0);
  const aspectRatio = $derived(isValid ? printWidth / printHeight : 0);
  const checklist = $derived(buildChecklist());
  const checklistText = $derived(checklist.join('\n'));

  onDestroy(() => {
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
  });

  function getToolMessage(key: string, fallback: string) {
    const toolsScope = translations.tools as Record<string, unknown> | undefined;
    const toolScope = toolsScope?.['passport-photo-maker'] as Record<string, unknown> | undefined;
    const value = toolScope?.[key];
    return typeof value === 'string' ? value : fallback;
  }

  function parsePositiveNumber(value: string) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  function formatMm(value: number) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value);
  }

  function buildChecklist() {
    if (!isValid) {
      return [];
    }

    return [
      `${COPY.printSize}: ${formatMm(printWidth)} x ${formatMm(printHeight)} mm`,
      `${COPY.pixelSize}: ${pixelWidth} x ${pixelHeight} px @ ${Math.round(dpiValue)} DPI`,
      `${COPY.background}: ${backgroundChoice.label}`,
      `${COPY.aspectRatio}: ${aspectRatio.toFixed(2)}:1`,
      'Compare the final image with the current rules from the issuing authority.',
    ];
  }

  async function copyChecklist() {
    if (!checklistText) {
      return;
    }

    await navigator.clipboard.writeText(checklistText);
    copied = true;
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
    copyTimer = setTimeout(() => {
      copied = false;
    }, 1800);
  }

  function resetForm() {
    preset = 'usPassport';
    widthMm = '35';
    heightMm = '45';
    dpi = '300';
    background = 'white';
  }
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
  </div>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div>
      <label for="passport-preset" class="tool-label">{COPY.preset}</label>
      <select id="passport-preset" class="tool-input" bind:value={preset}>
        {#each presets as item}
          <option value={item.value}>{item.label}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="passport-background" class="tool-label">{COPY.background}</label>
      <select id="passport-background" class="tool-input" bind:value={background}>
        {#each backgroundOptions as item}
          <option value={item.value}>{item.label}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="passport-width" class="tool-label">{COPY.width}</label>
      <input id="passport-width" class="tool-input" type="number" min="1" step="0.1" bind:value={widthMm} disabled={preset !== 'custom'} />
    </div>

    <div>
      <label for="passport-height" class="tool-label">{COPY.height}</label>
      <input id="passport-height" class="tool-input" type="number" min="1" step="0.1" bind:value={heightMm} disabled={preset !== 'custom'} />
    </div>

    <div class="md:col-span-2">
      <label for="passport-dpi" class="tool-label">{COPY.dpi}</label>
      <input id="passport-dpi" class="tool-input" type="number" min="72" step="1" bind:value={dpi} />
    </div>
  </div>

  {#if isValid}
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
        <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{COPY.pixelSize}</div>
        <div class="mt-1 text-xl font-bold text-slate-900 dark:text-white">{pixelWidth} x {pixelHeight}</div>
      </div>
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
        <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{COPY.printSize}</div>
        <div class="mt-1 text-xl font-bold text-slate-900 dark:text-white">{formatMm(printWidth)} x {formatMm(printHeight)} mm</div>
      </div>
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
        <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{COPY.dpi}</div>
        <div class="mt-1 text-xl font-bold text-slate-900 dark:text-white">{Math.round(dpiValue)}</div>
      </div>
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
        <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{COPY.aspectRatio}</div>
        <div class="mt-1 text-xl font-bold text-slate-900 dark:text-white">{aspectRatio.toFixed(2)}:1</div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div>
        <div class="tool-label">{COPY.checklist}</div>
        <pre class="min-h-44 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 whitespace-pre-wrap break-words dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">{checklistText}</pre>
      </div>

      <div>
        <div class="tool-label">{COPY.preview}</div>
        <div class="flex min-h-[220px] items-center justify-center rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
          <div
            class="flex max-h-[180px] w-full max-w-[180px] items-center justify-center border shadow-sm"
            style={`aspect-ratio: ${printWidth} / ${printHeight}; background: ${backgroundChoice.color}; border-color: ${backgroundChoice.border};`}
          >
            <span class="px-2 text-center text-xs font-semibold text-slate-600">{formatMm(printWidth)} x {formatMm(printHeight)} mm</span>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
      {COPY.invalid}
    </div>
  {/if}

  <div class="flex flex-wrap gap-3">
    <button type="button" class="btn-primary inline-flex items-center gap-2" onclick={copyChecklist} disabled={!isValid}>
      {#if copied}
        <Check class="h-4 w-4" aria-hidden="true" />
        {COPY.copied}
      {:else}
        <Copy class="h-4 w-4" aria-hidden="true" />
        {COPY.copy}
      {/if}
    </button>
    <button type="button" class="btn-secondary inline-flex items-center gap-2" onclick={resetForm}>
      <RefreshCw class="h-4 w-4" aria-hidden="true" />
      {COPY.reset}
    </button>
  </div>

  <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{COPY.localNote}</p>
</div>
