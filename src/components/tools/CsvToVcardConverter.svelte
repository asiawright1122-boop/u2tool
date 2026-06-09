<script lang="ts">
  import { Check, Copy, Download, RefreshCw } from 'lucide-svelte';
  import { onDestroy } from 'svelte';

  interface Props {
    translations?: Record<string, unknown>;
  }

  interface ConvertResult {
    output: string;
    count: number;
    skipped: number;
    error: string;
  }

  let { translations = {} }: Props = $props();

  const COPY = {
    title: 'CSV to vCard Converter',
    subtitle: 'Convert pasted contact rows into copy-ready vCard or downloadable VCF contact text.',
    csv: 'CSV contacts',
    delimiter: 'Delimiter',
    version: 'vCard version',
    comma: 'Comma',
    semicolon: 'Semicolon',
    tab: 'Tab',
    output: 'vCard output',
    contacts: 'Contacts',
    skipped: 'Skipped rows',
    lines: 'Lines',
    copy: 'Copy vCard',
    copied: 'Copied',
    download: 'Download .vcf',
    reset: 'Reset',
    fields: 'Recognized headers',
    invalid: 'Paste CSV with a header row and at least one name, email, or phone value.',
    localNote: 'Runs locally in your browser. Review the generated vCard before importing contacts.',
  };

  const defaultCsv = [
    'first_name,last_name,full_name,email,phone,company,title,address',
    'Avery,Stone,Avery Stone,avery@example.com,+1 555 0147,Northwind Studio,Product Lead,101 Market Street',
    'Mina,Patel,Mina Patel,mina@example.com,+1 555 0192,Acme Labs,Operations Manager,22 Lake Road',
  ].join('\n');

  let csv = $state(defaultCsv);
  let delimiter = $state('comma');
  let vcardVersion = $state('3.0');
  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  const title = $derived(getToolMessage('name', COPY.title));
  const description = $derived(getToolMessage('description', COPY.subtitle));
  const result = $derived(convertCsvToVcard());
  const lineCount = $derived(result.output ? result.output.split(/\r?\n/).length : 0);

  onDestroy(() => {
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
  });

  function getToolMessage(key: string, fallback: string) {
    const toolsScope = translations.tools as Record<string, unknown> | undefined;
    const toolScope = toolsScope?.['csv-to-vcard-converter'] as Record<string, unknown> | undefined;
    const value = toolScope?.[key];
    return typeof value === 'string' ? value : fallback;
  }

  function delimiterValue(value: string) {
    if (value === 'semicolon') return ';';
    if (value === 'tab') return '\t';
    return ',';
  }

  function parseDelimitedRows(input: string, selectedDelimiter: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let cell = '';
    let inQuotes = false;

    for (let index = 0; index < input.length; index += 1) {
      const char = input[index];
      const next = input[index + 1];

      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
        continue;
      }

      if (char === '"') {
        inQuotes = !inQuotes;
        continue;
      }

      if (char === selectedDelimiter && !inQuotes) {
        row.push(cell.trim());
        cell = '';
        continue;
      }

      if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && next === '\n') {
          index += 1;
        }
        row.push(cell.trim());
        if (row.some(Boolean)) {
          rows.push(row);
        }
        row = [];
        cell = '';
        continue;
      }

      cell += char;
    }

    row.push(cell.trim());
    if (row.some(Boolean)) {
      rows.push(row);
    }

    return rows;
  }

  function normalizeHeader(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function vcardEscape(value: string) {
    return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
  }

  function convertCsvToVcard(): ConvertResult {
    const rows = parseDelimitedRows(csv || '', delimiterValue(delimiter));
    if (rows.length < 2) {
      return { output: '', count: 0, skipped: 0, error: COPY.invalid };
    }

    const headers = rows[0].map(normalizeHeader);
    const findValue = (row: string[], names: string[]) => {
      const index = headers.findIndex((header) => names.includes(header));
      return index >= 0 ? row[index] || '' : '';
    };

    let skipped = 0;
    const vcards = rows.slice(1).map((row) => {
      const first = findValue(row, ['firstname', 'first', 'givenname', 'given']);
      const last = findValue(row, ['lastname', 'last', 'surname', 'familyname', 'family']);
      const fullName = findValue(row, ['name', 'fullname', 'fn']) || [first, last].filter(Boolean).join(' ');
      const email = findValue(row, ['email', 'emailaddress', 'mail']);
      const phone = findValue(row, ['phone', 'telephone', 'mobile', 'cell']);
      const company = findValue(row, ['company', 'organization', 'org']);
      const titleText = findValue(row, ['title', 'jobtitle', 'role']);
      const address = findValue(row, ['address', 'street']);

      if (!fullName && !email && !phone) {
        skipped += 1;
        return '';
      }

      const lines = [
        'BEGIN:VCARD',
        `VERSION:${vcardVersion}`,
        `FN:${vcardEscape(fullName || email || phone)}`,
        `N:${vcardEscape(last)};${vcardEscape(first)};;;`,
      ];

      if (company) lines.push(`ORG:${vcardEscape(company)}`);
      if (titleText) lines.push(`TITLE:${vcardEscape(titleText)}`);
      if (phone) lines.push(`TEL;TYPE=CELL:${vcardEscape(phone)}`);
      if (email) lines.push(`EMAIL:${vcardEscape(email)}`);
      if (address) lines.push(`ADR;TYPE=WORK:;;${vcardEscape(address)};;;;`);
      lines.push('END:VCARD');
      return lines.join('\n');
    }).filter(Boolean);

    if (vcards.length === 0) {
      return { output: '', count: 0, skipped, error: COPY.invalid };
    }

    return {
      output: vcards.join('\n\n'),
      count: vcards.length,
      skipped,
      error: '',
    };
  }

  async function copyOutput() {
    if (!result.output) {
      return;
    }

    await navigator.clipboard.writeText(result.output);
    copied = true;
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
    copyTimer = setTimeout(() => {
      copied = false;
    }, 1800);
  }

  function downloadVcard() {
    if (!result.output) {
      return;
    }

    const blob = new Blob([result.output], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contacts.vcf';
    link.click();
    URL.revokeObjectURL(url);
  }

  function resetForm() {
    csv = defaultCsv;
    delimiter = 'comma';
    vcardVersion = '3.0';
  }
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
  </div>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
    <div class="md:col-span-2">
      <label for="csv-vcard-input" class="tool-label">{COPY.csv}</label>
      <textarea id="csv-vcard-input" class="tool-input min-h-56 font-mono text-sm" bind:value={csv}></textarea>
    </div>

    <div class="space-y-4">
      <div>
        <label for="csv-vcard-delimiter" class="tool-label">{COPY.delimiter}</label>
        <select id="csv-vcard-delimiter" class="tool-input" bind:value={delimiter}>
          <option value="comma">{COPY.comma}</option>
          <option value="semicolon">{COPY.semicolon}</option>
          <option value="tab">{COPY.tab}</option>
        </select>
      </div>
      <div>
        <label for="csv-vcard-version" class="tool-label">{COPY.version}</label>
        <select id="csv-vcard-version" class="tool-input" bind:value={vcardVersion}>
          <option value="3.0">vCard 3.0</option>
          <option value="4.0">vCard 4.0</option>
        </select>
      </div>
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
        <div class="font-semibold text-slate-900 dark:text-white">{COPY.fields}</div>
        <p class="mt-2">first_name, last_name, full_name, email, phone, company, title, address</p>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
    <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{COPY.contacts}</div>
      <div class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{result.count}</div>
    </div>
    <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{COPY.version}</div>
      <div class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{vcardVersion}</div>
    </div>
    <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{COPY.skipped}</div>
      <div class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{result.skipped}</div>
    </div>
  </div>

  <div>
    <div class="tool-label">{COPY.output}</div>
    {#if result.output}
      <pre class="min-h-64 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 whitespace-pre-wrap break-words dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">{result.output}</pre>
      <p class="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">{lineCount} {COPY.lines}</p>
    {:else}
      <div class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
        {result.error}
      </div>
    {/if}
  </div>

  <div class="flex flex-wrap gap-3">
    <button type="button" class="btn-primary inline-flex items-center gap-2" onclick={copyOutput} disabled={!result.output}>
      {#if copied}
        <Check class="h-4 w-4" aria-hidden="true" />
        {COPY.copied}
      {:else}
        <Copy class="h-4 w-4" aria-hidden="true" />
        {COPY.copy}
      {/if}
    </button>
    <button type="button" class="btn-secondary inline-flex items-center gap-2" onclick={downloadVcard} disabled={!result.output}>
      <Download class="h-4 w-4" aria-hidden="true" />
      {COPY.download}
    </button>
    <button type="button" class="btn-secondary inline-flex items-center gap-2" onclick={resetForm}>
      <RefreshCw class="h-4 w-4" aria-hidden="true" />
      {COPY.reset}
    </button>
  </div>

  <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{COPY.localNote}</p>
</div>
