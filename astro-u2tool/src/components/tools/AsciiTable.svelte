<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['ascii-table'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.ascii-table.${key}`;
  }

  // Types
  interface AsciiChar {
  dec: number;
  hex: string;
  oct: string;
  bin: string;
  char: string;
  description: string;
}

  let searchTerm = $state('');

  let showExtended = $state(false);

  let selectedChar = $state(null);

  let asciiChars = $derived.by(() => {
    const chars: AsciiChar[] = [];
    const maxCode = showExtended ? 255 : 127;

    for (let i = 0; i <= maxCode; i++) {
      let char = '';
      let description = '';

      if (i < 32) {
        char = `^${String.fromCharCode(64 + i)}`;
        description = controlCharDescriptions[i] || '';
      } else if (i === 32) {
        char = '␣';
        description = controlCharDescriptions[32];
      } else if (i === 127) {
        char = '^?';
        description = controlCharDescriptions[127];
      } else if (i > 127) {
        char = String.fromCharCode(i);
        description = `Extended ASCII ${i}`;
      } else {
        char = String.fromCharCode(i);
        description = `Printable: ${char}`;
      }

      chars.push({
        dec: i,
        hex: i.toString(16).toUpperCase().padStart(2, '0'),
        oct: i.toString(8).padStart(3, '0'),
        bin: i.toString(2).padStart(8, '0'),
        char,
        description,
      });
    }

    return chars;
  });

  let filteredChars = $derived.by(() => {
    if (!searchTerm) return asciiChars;

    const term = searchTerm.toLowerCase();
    return asciiChars.filter(
      (c) =>
        c.dec.toString().includes(term) ||
        c.hex.toLowerCase().includes(term) ||
        c.char.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term)
    );
  });

  // Functions
  const controlCharDescriptions: Record<number, string> = {
    0: 'NUL (Null)',
    1: 'SOH (Start of Heading)',
    2: 'STX (Start of Text)',
    3: 'ETX (End of Text)',
    4: 'EOT (End of Transmission)',
    5: 'ENQ (Enquiry)',
    6: 'ACK (Acknowledge)',
    7: 'BEL (Bell)',
    8: 'BS (Backspace)',
    9: 'HT (Horizontal Tab)',
    10: 'LF (Line Feed)',
    11: 'VT (Vertical Tab)',
    12: 'FF (Form Feed)',
    13: 'CR (Carriage Return)',
    14: 'SO (Shift Out)',
    15: 'SI (Shift In)',
    16: 'DLE (Data Link Escape)',
    17: 'DC1 (Device Control 1)',
    18: 'DC2 (Device Control 2)',
    19: 'DC3 (Device Control 3)',
    20: 'DC4 (Device Control 4)',
    21: 'NAK (Negative Acknowledge)',
    22: 'SYN (Synchronous Idle)',
    23: 'ETB (End of Trans. Block)',
    24: 'CAN (Cancel)',
    25: 'EM (End of Medium)',
    26: 'SUB (Substitute)',
    27: 'ESC (Escape)',
    28: 'FS (File Separator)',
    29: 'GS (Group Separator)',
    30: 'RS (Record Separator)',
    31: 'US (Unit Separator)',
    32: 'Space',
    127: 'DEL (Delete)',
  };
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            type="text"
            bind:value={searchTerm}
            placeholder={t('searchPlaceholder')}
            class="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            bind:checked={showExtended}
            class="w-4 h-4 text-blue-600 rounded"
          />
          <span class="text-sm text-gray-600 dark:text-gray-300">{t('showExtended')}</span>
        </label>
      </div>

      {#if selectedChar}
<div class="p-4 bg-blue-900/20 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-medium text-blue-300">{t('selectedChar')}</h3>
            <button
              onclick={() => selectedChar = null}
              class="text-blue-400 hover:text-blue-300"
            >
              ✕
            </button>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span class="text-gray-600 dark:text-gray-300">{t('decimal')}:</span>
              <span class="ml-2 font-mono text-gray-100">{selectedChar.dec}</span>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-300">{t('hex')}:</span>
              <span class="ml-2 font-mono text-gray-100">0x{selectedChar.hex}</span>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-300">{t('octal')}:</span>
              <span class="ml-2 font-mono text-gray-100">0{selectedChar.oct}</span>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-300">{t('binary')}:</span>
              <span class="ml-2 font-mono text-gray-100">{selectedChar.bin}</span>
            </div>
          </div>
          <p class="mt-2 text-gray-600 dark:text-gray-300">{selectedChar.description}</p>
        </div>
{/if}

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-100 dark:bg-gray-800">
              <th class="p-2 text-left font-medium text-gray-700 dark:text-gray-200">{t('decimal')}</th>
              <th class="p-2 text-left font-medium text-gray-700 dark:text-gray-200">{t('hex')}</th>
              <th class="p-2 text-left font-medium text-gray-700 dark:text-gray-200">{t('octal')}</th>
              <th class="p-2 text-left font-medium text-gray-700 dark:text-gray-200">{t('binary')}</th>
              <th class="p-2 text-left font-medium text-gray-700 dark:text-gray-200">{t('char')}</th>
              <th class="p-2 text-left font-medium text-gray-700 dark:text-gray-200">{t('descriptionHeader')}</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredChars as c (c.dec)}
<tr 
                onclick={() => selectedChar = c}
                class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <td class="p-2 font-mono text-gray-900 dark:text-gray-100">{c.dec}</td>
                <td class="p-2 font-mono text-gray-900 dark:text-gray-100">0x{c.hex}</td>
                <td class="p-2 font-mono text-gray-900 dark:text-gray-100">0{c.oct}</td>
                <td class="p-2 font-mono text-gray-900 dark:text-gray-100">{c.bin}</td>
                <td class="p-2">
                  <button
                    onclick={(e) => {
                      e.stopPropagation();
                      if (c.dec >= 32 && c.dec !== 127) {
                        copyToClipboard(String.fromCharCode(c.dec));
                      }
                    }}
                    class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded font-mono text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    {c.char}
                  </button>
                </td>
                <td class="p-2 text-gray-600 dark:text-gray-300 truncate max-w-xs">{c.description}</td>
              </tr>
{/each}
          </tbody>
        </table>
      </div>

      {#if filteredChars.length === 0}
<div class="text-center py-8 text-gray-600 dark:text-gray-300">
          {t('noResults')}
        </div>
{/if}

      <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-2">{t('quickReference')}</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <span class="text-gray-600 dark:text-gray-300">0-31:</span>
            <span class="ml-2 text-gray-900 dark:text-gray-100">{t('controlChars')}</span>
          </div>
          <div>
            <span class="text-gray-600 dark:text-gray-300">32-47:</span>
            <span class="ml-2 text-gray-900 dark:text-gray-100">{t('punctuation')}</span>
          </div>
          <div>
            <span class="text-gray-600 dark:text-gray-300">48-57:</span>
            <span class="ml-2 text-gray-900 dark:text-gray-100">{t('digits')}</span>
          </div>
          <div>
            <span class="text-gray-600 dark:text-gray-300">65-90:</span>
            <span class="ml-2 text-gray-900 dark:text-gray-100">{t('uppercase')}</span>
          </div>
          <div>
            <span class="text-gray-600 dark:text-gray-300">97-122:</span>
            <span class="ml-2 text-gray-900 dark:text-gray-100">{t('lowercase')}</span>
          </div>
          <div>
            <span class="text-gray-600 dark:text-gray-300">128-255:</span>
            <span class="ml-2 text-gray-900 dark:text-gray-100">{t('extended')}</span>
          </div>
        </div>
      </div>
    </div>
  
