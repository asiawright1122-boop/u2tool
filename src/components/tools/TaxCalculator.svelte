<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['tax-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.tax-calculator.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }
  function tCountries(key: string): string {
    const scope = translations['countries'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: countries.${key}`;
  }
  function tTax(key: string): string {
    const scope = translations['tax'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tax.${key}`;
  }

  // Imports
  import { TAX_REGIMES, getDefaultCountryForLocale } from '@/lib/data/tax-regimes';
  import type { TaxResult } from '@/lib/data/tax-regimes';
  import { calculateTax } from '@/lib/tax-calculator';
  import { formatCurrency } from '@/lib/currency-formatter';
  import { savePreferences, loadPreferences } from '@/lib/preferences';

  let selectedCountry = $state('US');

  let grossIncome = $state('');

  let filingStatus = $state('');

  let additionalDeductions = $state({});

  let useStandardDeduction = $state(true);

  let customDeduction = $state('');

  let result = $state(null);

  let inputError = $state('');

  let isInitialized = $state(false);

  let regime = $derived(TAX_REGIMES[selectedCountry]);

  let currentFilingStatus = $derived.by(() => {
    return regime?.filingStatuses.find(s => s.id === filingStatus);
  });

  $effect(() => {
    if (isInitialized) return;
    
    const prefs = loadPreferences();
    if (prefs && TAX_REGIMES[prefs.selectedCountry]) {
      selectedCountry = prefs.selectedCountry;
    } else {
      selectedCountry = getDefaultCountryForLocale(locale);
    }
    isInitialized = true;
  });

  $effect(() => {
    if (regime && regime.filingStatuses.length > 0) {
      filingStatus = regime.filingStatuses[0].id;
    }
    // Clear result when country changes
    result = null;
    additionalDeductions = {};
    grossIncome = '';
    customDeduction = '';
    inputError = '';
  });

  $effect(() => {
    if (isInitialized && selectedCountry) {
      savePreferences(selectedCountry);
    }
  });

  // Functions
function validateInput(value: string): boolean {
    if (!value) {
      inputError = '';
      return false;
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      inputError = t('errorInvalidNumber');
      return false;
    }
    if (num < 0) {
      inputError = t('errorNegativeNumber');
      return false;
    }
    inputError = '';
    return true;
  }
  function handleIncomeChange(value: string) {
    grossIncome = value;
    validateInput(value);
    result = null;
  }
  function handleCountryChange(countryCode: string) {
    selectedCountry = countryCode;
  }
  function handleDeductionAmountChange(deductionId: string, value: string) {
    const deduction = regime?.additionalDeductions.find(d => d.id === deductionId);
    if (deduction) {
      let amount = parseFloat(value) || 0;
      // Clamp to min/max if defined
      if (deduction.minAmount !== undefined) {
        amount = Math.max(amount, deduction.minAmount);
      }
      if (deduction.maxAmount !== undefined) {
        amount = Math.min(amount, deduction.maxAmount);
      }
      additionalDeductions = ({
        ...additionalDeductions,
        [deductionId]: amount,
      });
    }
  }
  function calculate() {
    if (!regime || !currentFilingStatus) return;
    
    const income = parseFloat(grossIncome);
    if (isNaN(income) || income < 0) return;

    // Prepare deductions
    const deductions = useStandardDeduction 
      ? additionalDeductions 
      : { ...additionalDeductions, _custom: parseFloat(customDeduction) || 0 };

    try {
      const taxResult = calculateTax(regime, income, filingStatus, deductions);
      result = taxResult;
    } catch (error) {
      console.error('Tax calculation error:', error);
    }
  }
  function useExampleIncome() {
    const example = EXAMPLE_INCOMES[selectedCountry] || 50000;
    grossIncome = example.toString();
    inputError = '';
  }
  const isCalculateDisabled = !grossIncome || !!inputError || !filingStatus;
  const isNoTaxCountry = regime?.specialRules?.some(r => r.type === 'noIncomeTax');
  function formatAmount(value: number) {
    if (!regime) return value.toString();
    return formatCurrency(value, regime);
  }
  function getCountryName(code: string) {
    const nameKey = TAX_REGIMES[code]?.countryNameKey;
    if (!nameKey) return code;
    const key = nameKey.replace('countries.', '');
    try {
      return tCountries(key);
    } catch {
      return code;
    }
  }
  function getFilingStatusName(statusId: string) {
    const status = regime?.filingStatuses.find(s => s.id === statusId);
    if (!status) return statusId;
    const key = status.nameKey.replace('tax.filingStatus.', '');
    try {
      return tTax(`filingStatus.${key}`);
    } catch {
      return statusId;
    }
  }
  function getDeductionName(deductionId: string) {
    const deduction = regime?.additionalDeductions.find(d => d.id === deductionId);
    if (!deduction) return deductionId;
    const key = deduction.nameKey.replace('tax.deductions.', '');
    try {
      return tTax(`deductions.${key}`);
    } catch {
      return deductionId;
    }
  }

</script>


    <div class="space-y-6">
      <!-- Country Selector -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('selectCountry')}
        </label>
        <select
          value={selectedCountry}
          onchange={(e) => handleCountryChange(e.target.value)}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {#each Object.keys(TAX_REGIMES) as code (code)}
<option  value={code}>
              {getCountryName(code)}
            </option>
{/each}
        </select>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {t('dataYear')}: {regime?.year}
        </p>
      </div>

      <!-- Saudi Arabia Special Message -->
      {#if isNoTaxCountry}
<div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 class="text-lg font-medium text-green-800 dark:text-green-200 mb-2">
            {t('noIncomeTaxTitle')}
          </h3>
          <p class="text-green-700 dark:text-green-300">
            {t('noIncomeTaxDescription')}
          </p>
        </div>
{:else}

          <!-- Income Input -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('grossIncome')}
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {regime?.currencySymbol}
                </span>
                <input
                  id="tax-gross-income"
                  name="grossIncome"
                  type="number"
                  value={grossIncome}
                  onchange={(e) => handleIncomeChange(e.target.value)}
                  class={`w-full pl-8 pr-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                    inputError 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder={EXAMPLE_INCOMES[selectedCountry]?.toString() || '50000'}
                />
              </div>
              {#if inputError}
<p class="mt-1 text-xs text-red-500">{inputError}</p>
{/if}
              <button
                onclick={useExampleIncome}
                class="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t('useExample')}
              </button>
            </div>

            <!-- Filing Status -->
            <div>
              <label for="tax-filing-status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('filingStatus')}
              </label>
              <select
                id="tax-filing-status"
                name="filingStatus"
                bind:value={filingStatus}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {#each regime?.filingStatuses as status (status.id)}
<option  value={status.id}>
                    {getFilingStatusName(status.id)}
                  </option>
{/each}
              </select>
            </div>
          </div>

          <!-- Deduction Options -->
          <div>
            <div class="flex items-center gap-4 mb-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  id="tax-standard-deduction"
                  name="deductionType"
                  type="radio"
                  checked={useStandardDeduction}
                  onchange={() => useStandardDeduction = true}
                  class="text-blue-600"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">
                  {t('standardDeduction')} ({currentFilingStatus ? formatAmount(currentFilingStatus.standardDeduction) : ''})
                </span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  id="tax-itemized-deduction"
                  name="deductionType"
                  type="radio"
                  checked={!useStandardDeduction}
                  onchange={() => useStandardDeduction = false}
                  class="text-blue-600"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">
                  {t('itemizedDeductions')}
                </span>
              </label>
            </div>
            
            {#if !useStandardDeduction}
<div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {regime?.currencySymbol}
                </span>
                <input
                  id="tax-custom-deduction"
                  name="customDeduction"
                  type="number"
                  bind:value={customDeduction}
                  class="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder={t('enterDeductions')}
                />
              </div>
{/if}
          </div>

          <!-- Additional Deductions (China) -->
          {#if regime?.additionalDeductions}

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('additionalDeductions')}
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                {#each regime.additionalDeductions as deduction (deduction.id)}
<div  
                    class={`p-3 rounded-lg border transition-colors ${
                      additionalDeductions[deduction.id] 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' 
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div class="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={!!additionalDeductions[deduction.id]}
                        onchange={(e) => {
                          if (e.target.checked) {
                            handleDeductionAmountChange(deduction.id, deduction.amount.toString());
                          } else {
                            handleDeductionAmountChange(deduction.id, '0');
                          }
                        }}
                        class="mt-1 text-blue-600 rounded flex-shrink-0"
                      />
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {getDeductionName(deduction.id)}
                        </div>
                        {#if deduction.maxAmount}<div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {t('max')}: {formatAmount(deduction.maxAmount)}/{t('year')}
                          </div>{/if}
                        {#if deduction.customizable}

                          <div class="flex items-center gap-2 mt-2">
                            <span class="text-gray-500 text-sm">{regime.currencySymbol}</span>
                            <input
                              type="number"
                              value={additionalDeductions[deduction.id] || ''}
                              onchange={(e) => handleDeductionAmountChange(deduction.id, e.target.value)}
                              min={deduction.minAmount || 0}
                              max={deduction.maxAmount}
                              class={`flex-1 px-2 py-1.5 text-sm border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                additionalDeductions[deduction.id]
                                  ? 'border-blue-300 dark:border-blue-600'
                                  : 'border-gray-300 dark:border-gray-600'
                              }`}
                              placeholder="0"
                            />
                          </div>

                        {/if}
                      </div>
                    </div>
                  </div>
{/each}
              </div>
              <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">
                {t('deductionNote')}
              </p>
            </div>
          )
{/if}

          <!-- Calculate Button -->
          <button
            onclick={calculate}
            disabled={isCalculateDisabled}
            class={`w-full px-4 py-2 rounded-lg transition-colors ${
              isCalculateDisabled
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {tc('calculate')}
          </button>

          <!-- Results -->
          {#if result}
<div class="space-y-4">
              <!-- Summary Cards -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div class="text-sm text-gray-600 dark:text-gray-400">{t('estimatedTax')}</div>
                  <div class="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatAmount(result.totalTax)}
                  </div>
                  {#if result.localTax !== undefined}
<div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      + {t('localTax')}: {formatAmount(result.localTax)}
                    </div>
{/if}
                </div>
                <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div class="text-sm text-gray-600 dark:text-gray-400">{t('takeHomePay')}</div>
                  <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatAmount(result.takeHomePay)}
                  </div>
                </div>
                <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div class="text-sm text-gray-600 dark:text-gray-400">{t('effectiveRate')}</div>
                  <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {result.effectiveRate.toFixed(2)}%
                  </div>
                </div>
              </div>

              <!-- Income Summary -->
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('incomeSummary')}
                </h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">{t('grossIncome')}</span>
                    <span class="font-medium text-gray-900 dark:text-white">{formatAmount(result.grossIncome)}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">{t('deductions')}</span>
                    <span class="font-medium text-gray-900 dark:text-white">
                      -{formatAmount(result.deductions)}
                    </span>
                  </div>
                  <hr class="border-gray-200 dark:border-gray-700" />
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">{t('taxableIncome')}</span>
                    <span class="font-medium text-gray-900 dark:text-white">{formatAmount(result.taxableIncome)}</span>
                  </div>
                </div>
              </div>

              <!-- Tax Bracket Breakdown -->
              {#if result.bracketBreakdown.length > 0}
<div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t('taxBracketBreakdown')}
                  </h3>
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead>
                        <tr class="text-left text-gray-600 dark:text-gray-400">
                          <th class="pb-2">{t('bracket')}</th>
                          <th class="pb-2 text-right">{t('rate')}</th>
                          <th class="pb-2 text-right">{t('taxableAmount')}</th>
                          <th class="pb-2 text-right">{t('tax')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each result.bracketBreakdown as item, index (index)}
<tr  class="border-t border-gray-200 dark:border-gray-700">
                            <td class="py-2">
                              {formatAmount(item.bracket.min)} - {item.bracket.max === Infinity ? '∞' : formatAmount(item.bracket.max)}
                            </td>
                            <td class="py-2 text-right">{item.bracket.rate}%</td>
                            <td class="py-2 text-right">{formatAmount(item.taxableInBracket)}</td>
                            <td class="py-2 text-right">{formatAmount(item.taxInBracket)}</td>
                          </tr>
{/each}
                        <tr class="border-t-2 border-gray-300 dark:border-gray-600 font-medium">
                          <td class="py-2" colspan={3}>{t('totalTax')}</td>
                          <td class="py-2 text-right">{formatAmount(result.totalTax)}</td>
                        </tr>
                        {#if result.localTax !== undefined}
<tr class="border-t border-gray-200 dark:border-gray-700">
                            <td class="py-2" colspan={3}>{t('localTax')} ({regime?.localTaxRate}%)</td>
                            <td class="py-2 text-right">{formatAmount(result.localTax)}</td>
                          </tr>
{/if}
                      </tbody>
                    </table>
                  </div>
                </div>
{/if}

              <!-- Disclaimer -->
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {t('disclaimer')}
              </p>
            </div>
{/if}
        
{/if}
    </div>
  
