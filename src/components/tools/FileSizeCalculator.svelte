<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['file-size-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.file-size-calculator.${key}`;
  }

  // Types
  type Unit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';
  type Base = 'binary' | 'decimal';

  let inputValue = $state('1');

  let inputUnit = $state('GB');

  let base = $state('binary');

  // Functions
  const units: Unit[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const binaryMultipliers: Record<Unit, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
    PB: 1024 ** 5,
  };
  const decimalMultipliers: Record<Unit, number> = {
    B: 1,
    KB: 1000,
    MB: 1000 ** 2,
    GB: 1000 ** 3,
    TB: 1000 ** 4,
    PB: 1000 ** 5,
  };
  function getMultipliers() { return (base === 'binary' ? binaryMultipliers : decimalMultipliers); }
  function convertToBytes(value: number, unit: Unit): number {
    return value * getMultipliers()[unit];
  }
  function convertFromBytes(bytes: number, unit: Unit): number {
    return bytes / getMultipliers()[unit];
  }
  function formatNumber(num: number): string {
    if (num === 0) return '0';
    if (num < 0.0001) return num.toExponential(4);
    if (num >= 1000000) return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    return num.toLocaleString('en-US', { maximumFractionDigits: 6 });
  }
  const inputNum = parseFloat(inputValue) || 0;
  const bytes = convertToBytes(inputNum, inputUnit);
  const conversions = units.map((unit) => ({
    unit,
    value: convertFromBytes(bytes, unit),
    label: base === 'binary' ? getBinaryLabel(unit) : getDecimalLabel(unit),
  }));
  function getBinaryLabel(unit: Unit): string {
    const labels: Record<Unit, string> = {
      B: 'Bytes',
      KB: 'KiB (Kibibytes)',
      MB: 'MiB (Mebibytes)',
      GB: 'GiB (Gibibytes)',
      TB: 'TiB (Tebibytes)',
      PB: 'PiB (Pebibytes)',
    };
    return labels[unit];
  }
  function getDecimalLabel(unit: Unit): string {
    const labels: Record<Unit, string> = {
      B: 'Bytes',
      KB: 'KB (Kilobytes)',
      MB: 'MB (Megabytes)',
      GB: 'GB (Gigabytes)',
      TB: 'TB (Terabytes)',
      PB: 'PB (Petabytes)',
    };
    return labels[unit];
  }
  const bits = bytes * 8;
  const bitConversions = [
    { label: 'Bits', value: bits },
    { label: 'Kilobits', value: bits / (base === 'binary' ? 1024 : 1000) },
    { label: 'Megabits', value: bits / (base === 'binary' ? 1024 ** 2 : 1000 ** 2) },
    { label: 'Gigabits', value: bits / (base === 'binary' ? 1024 ** 3 : 1000 ** 3) },
  ];

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="space-y-2">
          <label for="file-size-calculator-field-6" class="tool-label">
            {t('inputValue')}
          </label>
          <input
            type="number"
            bind:value={inputValue}
            class="tool-input"
            min="0"
            step="any" id="file-size-calculator-field-6" />
        </div>

        <div class="space-y-2">
          <label for="file-size-calculator-field-5" class="tool-label">
            {t('unit')}
          </label>
          <select
            value={inputUnit}
            onchange={(e) => inputUnit = e.target.value as Unit}
            class="tool-input" id="file-size-calculator-field-5">
            {#each units as unit (unit)}
<option  value={unit}>
                {unit}
              </option>
{/each}
          </select>
        </div>

        <div class="space-y-2">
          <label for="file-size-calculator-field-4" class="tool-label">
            {t('base')}
          </label>
          <select
            value={base}
            onchange={(e) => base = e.target.value as Base}
            class="tool-input" id="file-size-calculator-field-4">
            <option value="binary">{t('binary')} (1024)</option>
            <option value="decimal">{t('decimal')} (1000)</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <h3 class="font-medium text-gray-900 dark:text-gray-100">{t('byteConversions')}</h3>
          <div class="space-y-2">
            {#each conversions as { unit, value, label } (unit)}
<div 
                class={`p-3 rounded-lg ${
                  unit === inputUnit
                    ? 'bg-amber-100 dark:bg-amber-900/50 border border-amber-400 dark:border-amber-600'
                    : 'bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600 dark:text-gray-300">{label}</span>
                  <span class="font-mono text-gray-900 dark:text-gray-100">
                    {formatNumber(value)}
                  </span>
                </div>
              </div>
{/each}
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="font-medium text-gray-900 dark:text-gray-100">{t('bitConversions')}</h3>
          <div class="space-y-2">
            {#each bitConversions as { label, value } (label)}
<div  class="p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600 dark:text-gray-300">{label}</span>
                  <span class="font-mono text-gray-900 dark:text-gray-100">
                    {formatNumber(value)}
                  </span>
                </div>
              </div>
{/each}
          </div>

          <div class="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
            <h4 class="font-medium text-green-800 dark:text-green-300 mb-2">{t('totalBytes')}</h4>
            <p class="font-mono text-lg text-green-700 dark:text-green-400">
              {bytes.toLocaleString('en-US')} {t('bytes')}
            </p>
          </div>
        </div>
      </div>

      <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg">
        <h3 class="font-medium text-amber-800 dark:text-amber-300 mb-2">{t('info')}</h3>
        <div class="text-sm text-amber-700 dark:text-amber-400 space-y-1">
          <p>• <strong>{t('binary')}:</strong> {t('binaryDesc')}</p>
          <p>• <strong>{t('decimal')}:</strong> {t('decimalDesc')}</p>
        </div>
      </div>
    </div>
  
