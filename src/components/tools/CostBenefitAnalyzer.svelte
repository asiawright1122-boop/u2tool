<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['cost-benefit-analyzer'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.cost-benefit-analyzer.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface CostItem {
  id: string;
  name: string;
  amount: number;
  type: 'one-time' | 'recurring';
  frequency?: 'monthly' | 'quarterly' | 'yearly';
}
  interface BenefitItem {
  id: string;
  name: string;
  amount: number;
  type: 'tangible' | 'intangible';
  frequency?: 'monthly' | 'quarterly' | 'yearly';
  probability: number;
}
  interface AnalysisData {
  projectName: string;
  timeframeYears: number;
  discountRate: number;
  costs: CostItem[];
  benefits: BenefitItem[];
  currency: string;
}

  let data = $state<AnalysisData>({
    projectName: 'New Software Implementation',
    timeframeYears: 3,
    discountRate: 10,
    costs: [
      { id: '1', name: 'Software License', amount: 50000, type: 'one-time' },
      { id: '2', name: 'Implementation', amount: 30000, type: 'one-time' },
      { id: '3', name: 'Training', amount: 10000, type: 'one-time' },
      { id: '4', name: 'Maintenance', amount: 5000, type: 'recurring', frequency: 'yearly' },
      { id: '5', name: 'Support', amount: 1000, type: 'recurring', frequency: 'monthly' },
    ],
    benefits: [
      { id: '1', name: 'Labor Cost Savings', amount: 3000, type: 'tangible', frequency: 'monthly', probability: 90 },
      { id: '2', name: 'Reduced Errors', amount: 1500, type: 'tangible', frequency: 'monthly', probability: 80 },
      { id: '3', name: 'Improved Customer Satisfaction', amount: 10000, type: 'intangible', frequency: 'yearly', probability: 70 },
    ],
    currency: 'USD',
  });

  function updateData<K extends keyof AnalysisData>(key: K, value: AnalysisData[K]) {
    data = ({ ...data, [key]: value });
  }

  function addCost() {
    data = ({
      ...data,
      costs: [...data.costs, { id: Date.now().toString(), name: '', amount: 0, type: 'one-time' }],
    });
  }

  function addBenefit() {
    data = ({
      ...data,
      benefits: [...data.benefits, { id: Date.now().toString(), name: '', amount: 0, type: 'tangible', frequency: 'monthly', probability: 100 }],
    });
  }

  function updateCost(id: string, field: keyof CostItem, value: string | number) {
    data = ({
      ...data,
      costs: data.costs.map(c => c.id === id ? { ...c, [field]: value } : c),
    });
  }

  function updateBenefit(id: string, field: keyof BenefitItem, value: string | number) {
    data = ({
      ...data,
      benefits: data.benefits.map(b => b.id === id ? { ...b, [field]: value } : b),
    });
  }

  function removeCost(id: string) {
    data = ({ ...data, costs: data.costs.filter(c => c.id !== id) });
  }

  function removeBenefit(id: string) {
    data = ({ ...data, benefits: data.benefits.filter(b => b.id !== id) });
  }

  let analysis = $derived.by(() => {
    const years = data.timeframeYears;
    const rate = data.discountRate / 100;

    // Calculate total costs
    const oneTimeCosts = data.costs.filter(c => c.type === 'one-time').reduce((sum, c) => sum + c.amount, 0);
    const recurringCosts = data.costs.filter(c => c.type === 'recurring').reduce((sum, c) => {
      const multiplier = c.frequency === 'monthly' ? 12 : c.frequency === 'quarterly' ? 4 : 1;
      return sum + c.amount * multiplier * years;
    }, 0);
    const totalCosts = oneTimeCosts + recurringCosts;

    // Calculate total benefits (with probability adjustment)
    const totalBenefits = data.benefits.reduce((sum, b) => {
      const multiplier = b.frequency === 'monthly' ? 12 : b.frequency === 'quarterly' ? 4 : 1;
      const adjustedAmount = b.amount * (b.probability / 100);
      return sum + adjustedAmount * multiplier * years;
    }, 0);

    // NPV calculation
    let npvCosts = oneTimeCosts;
    let npvBenefits = 0;
    
    for (let year = 1; year <= years; year++) {
      const discountFactor = 1 / Math.pow(1 + rate, year);
      
      // Recurring costs for this year
      const yearCosts = data.costs.filter(c => c.type === 'recurring').reduce((sum, c) => {
        const multiplier = c.frequency === 'monthly' ? 12 : c.frequency === 'quarterly' ? 4 : 1;
        return sum + c.amount * multiplier;
      }, 0);
      npvCosts += yearCosts * discountFactor;

      // Benefits for this year
      const yearBenefits = data.benefits.reduce((sum, b) => {
        const multiplier = b.frequency === 'monthly' ? 12 : b.frequency === 'quarterly' ? 4 : 1;
        const adjustedAmount = b.amount * (b.probability / 100);
        return sum + adjustedAmount * multiplier;
      }, 0);
      npvBenefits += yearBenefits * discountFactor;
    }

    const npv = npvBenefits - npvCosts;
    const bcRatio = npvCosts > 0 ? npvBenefits / npvCosts : 0;
    const roi = npvCosts > 0 ? ((npvBenefits - npvCosts) / npvCosts) * 100 : 0;

    // Payback period (simplified)
    const annualNetBenefit = (totalBenefits - recurringCosts) / years;
    const paybackPeriod = annualNetBenefit > 0 ? oneTimeCosts / annualNetBenefit : Infinity;

    return {
      oneTimeCosts,
      recurringCosts,
      totalCosts,
      totalBenefits,
      npvCosts,
      npvBenefits,
      npv,
      bcRatio,
      roi,
      paybackPeriod,
      isViable: npv > 0 && bcRatio > 1,
    };
  });

  let currencySymbol = $derived.by(() => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CNY: '¥',
      JPY: '¥',
    };
    return symbols[data.currency] || '$';
  });

  function formatCurrency(amount: number) {
    return `${currencySymbol}${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div class="md:col-span-2">
          <label for="cost-benefit-project-name" class="block text-xs text-gray-500 mb-1">{t('projectName')}</label>
          <input
            id="cost-benefit-project-name"
            name="projectName"
            type="text"
            value={data.projectName}
            onchange={(e) => updateData('projectName', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label for="cost-benefit-timeframe" class="block text-xs text-gray-500 mb-1">{t('timeframe')}</label>
          <input
            id="cost-benefit-timeframe"
            name="timeframeYears"
            type="number"
            value={data.timeframeYears}
            onchange={(e) => updateData('timeframeYears', parseInt(e.target.value) || 1)}
            min="1"
            max="20"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label for="cost-benefit-discount-rate" class="block text-xs text-gray-500 mb-1">{t('discountRate')}</label>
          <input
            id="cost-benefit-discount-rate"
            name="discountRate"
            type="number"
            value={data.discountRate}
            onchange={(e) => updateData('discountRate', parseFloat(e.target.value) || 0)}
            min="0"
            max="50"
            step="0.5"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label for="cost-benefit-currency" class="block text-xs text-gray-500 mb-1">{t('currency')}</label>
          <select
            id="cost-benefit-currency"
            name="currency"
            value={data.currency}
            onchange={(e) => updateData('currency', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {#each ['USD', 'EUR', 'GBP', 'CNY', 'JPY'] as c (c)}
<option  value={c}>{c}</option>
{/each}
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-medium text-red-700 dark:text-red-400">{t('costs')}</h3>
            <button onclick={addCost} class="text-sm text-red-600 hover:text-red-700">{t('addCost')}</button>
          </div>
          <div class="space-y-2">
            {#each data.costs as cost (cost.id)}
<div  class="flex gap-2 items-center">
                <input
                  aria-label={`${t('costNamePlaceholder')} ${cost.id}`}
                  type="text"
                  value={cost.name}
                  onchange={(e) => updateCost(cost.id, 'name', e.target.value)}
                  placeholder={t("costNamePlaceholder")}
                  class="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <input
                  aria-label={`${t('costs')} ${cost.id}`}
                  type="number"
                  value={cost.amount}
                  onchange={(e) => updateCost(cost.id, 'amount', parseFloat(e.target.value) || 0)}
                  class="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <select
                  aria-label={`${t('costs')} ${cost.id}`}
                  value={cost.type}
                  onchange={(e) => updateCost(cost.id, 'type', e.target.value)}
                  class="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="one-time">One-time</option>
                  <option value="recurring">Recurring</option>
                </select>
                {#if cost.type === 'recurring'}
<select
                    aria-label={`${t('costs')} ${cost.id}`}
                    value={cost.frequency || 'yearly'}
                    onchange={(e) => updateCost(cost.id, 'frequency', e.target.value)}
                    class="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
{/if}
                <button onclick={() => removeCost(cost.id)} class="text-red-500 hover:text-red-700" aria-label={`${t('costs')} ${cost.id}`}>×</button>
              </div>
{/each}
          </div>
        </div>

        <div class="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-medium text-green-700 dark:text-green-400">{t('benefits')}</h3>
            <button onclick={addBenefit} class="text-sm text-green-600 hover:text-green-700">{t('addBenefit')}</button>
          </div>
          <div class="space-y-2">
            {#each data.benefits as benefit (benefit.id)}
<div  class="flex gap-2 items-center flex-wrap">
                <input
                  aria-label={`${t('benefitNamePlaceholder')} ${benefit.id}`}
                  type="text"
                  value={benefit.name}
                  onchange={(e) => updateBenefit(benefit.id, 'name', e.target.value)}
                  placeholder={t("benefitNamePlaceholder")}
                  class="flex-1 min-w-32 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <input
                  aria-label={`${t('benefits')} ${benefit.id}`}
                  type="number"
                  value={benefit.amount}
                  onchange={(e) => updateBenefit(benefit.id, 'amount', parseFloat(e.target.value) || 0)}
                  class="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <select
                  aria-label={`${t('benefits')} ${benefit.id}`}
                  value={benefit.frequency || 'monthly'}
                  onchange={(e) => updateBenefit(benefit.id, 'frequency', e.target.value)}
                  class="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <div class="flex items-center gap-1">
                  <input
                    aria-label={`${t('benefits')} ${benefit.id}`}
                    type="number"
                    value={benefit.probability}
                    onchange={(e) => updateBenefit(benefit.id, 'probability', Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                    class="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    min="0"
                    max="100"
                  />
                  <span class="text-xs text-gray-500">%</span>
                </div>
                <button onclick={() => removeBenefit(benefit.id)} class="text-red-500 hover:text-red-700" aria-label={`${t('benefits')} ${benefit.id}`}>×</button>
              </div>
{/each}
          </div>
        </div>
      </div>

      <div class={`p-6 rounded-lg border-2 ${analysis.isViable ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'}`}>
        <div class="flex items-center gap-3 mb-4">
          <span class={`text-3xl ${analysis.isViable ? 'text-green-600' : 'text-red-600'}`}>
            {analysis.isViable ? '✓' : '✗'}
          </span>
          <div>
            <h3 class={`text-xl font-bold ${analysis.isViable ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {analysis.isViable ? 'Project is Financially Viable' : 'Project May Not Be Viable'}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Based on {data.timeframeYears}-year analysis with {data.discountRate}% discount rate
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <p class="text-xs text-gray-500">Net Present Value</p>
            <p class={`text-lg font-bold ${analysis.npv >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(analysis.npv)}
            </p>
          </div>
          <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <p class="text-xs text-gray-500">Benefit-Cost Ratio</p>
            <p class={`text-lg font-bold ${analysis.bcRatio >= 1 ? 'text-green-600' : 'text-red-600'}`}>
              {analysis.bcRatio.toFixed(2)}
            </p>
          </div>
          <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <p class="text-xs text-gray-500">ROI</p>
            <p class={`text-lg font-bold ${analysis.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analysis.roi.toFixed(1)}%
            </p>
          </div>
          <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <p class="text-xs text-gray-500">Payback Period</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">
              {analysis.paybackPeriod === Infinity ? 'N/A' : `${analysis.paybackPeriod.toFixed(1)} yrs`}
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h4 class="font-medium mb-3 text-gray-900 dark:text-white">Cost Summary</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">One-time Costs</span>
              <span class="text-gray-900 dark:text-white">{formatCurrency(analysis.oneTimeCosts)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Recurring Costs ({data.timeframeYears} yrs)</span>
              <span class="text-gray-900 dark:text-white">{formatCurrency(analysis.recurringCosts)}</span>
            </div>
            <div class="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 font-medium">
              <span class="text-gray-900 dark:text-white">Total Costs</span>
              <span class="text-red-600">{formatCurrency(analysis.totalCosts)}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-gray-500">NPV of Costs</span>
              <span class="text-gray-600 dark:text-gray-400">{formatCurrency(analysis.npvCosts)}</span>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h4 class="font-medium mb-3 text-gray-900 dark:text-white">Benefit Summary</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Total Benefits ({data.timeframeYears} yrs)</span>
              <span class="text-gray-900 dark:text-white">{formatCurrency(analysis.totalBenefits)}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-gray-500">(Probability-adjusted)</span>
            </div>
            <div class="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 font-medium">
              <span class="text-gray-900 dark:text-white">NPV of Benefits</span>
              <span class="text-green-600">{formatCurrency(analysis.npvBenefits)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
