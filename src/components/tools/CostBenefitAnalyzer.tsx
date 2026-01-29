'use client';

import { useTranslations } from 'next-intl';
import { useState, useCallback, useMemo } from 'react';

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

export default function CostBenefitAnalyzer() {
  const t = useTranslations('tools.cost-benefit-analyzer');
  const tCommon = useTranslations('tools');
  const [data, setData] = useState<AnalysisData>({
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

  const updateData = useCallback(<K extends keyof AnalysisData>(key: K, value: AnalysisData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);

  const addCost = useCallback(() => {
    setData(prev => ({
      ...prev,
      costs: [...prev.costs, { id: Date.now().toString(), name: '', amount: 0, type: 'one-time' }],
    }));
  }, []);

  const addBenefit = useCallback(() => {
    setData(prev => ({
      ...prev,
      benefits: [...prev.benefits, { id: Date.now().toString(), name: '', amount: 0, type: 'tangible', frequency: 'monthly', probability: 100 }],
    }));
  }, []);

  const updateCost = useCallback((id: string, field: keyof CostItem, value: string | number) => {
    setData(prev => ({
      ...prev,
      costs: prev.costs.map(c => c.id === id ? { ...c, [field]: value } : c),
    }));
  }, []);

  const updateBenefit = useCallback((id: string, field: keyof BenefitItem, value: string | number) => {
    setData(prev => ({
      ...prev,
      benefits: prev.benefits.map(b => b.id === id ? { ...b, [field]: value } : b),
    }));
  }, []);

  const removeCost = useCallback((id: string) => {
    setData(prev => ({ ...prev, costs: prev.costs.filter(c => c.id !== id) }));
  }, []);

  const removeBenefit = useCallback((id: string) => {
    setData(prev => ({ ...prev, benefits: prev.benefits.filter(b => b.id !== id) }));
  }, []);

  const analysis = useMemo(() => {
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
  }, [data]);

  const currencySymbol = useMemo(() => {
    const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CNY: '¥', JPY: '¥' };
    return symbols[data.currency] || '$';
  }, [data.currency]);

  const formatCurrency = useCallback((amount: number) => {
    return `${currencySymbol}${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }, [currencySymbol]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-500 mb-1">{t('projectName')}</label>
          <input
            type="text"
            value={data.projectName}
            onChange={(e) => updateData('projectName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('timeframe')}</label>
          <input
            type="number"
            value={data.timeframeYears}
            onChange={(e) => updateData('timeframeYears', parseInt(e.target.value) || 1)}
            min="1"
            max="20"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('discountRate')}</label>
          <input
            type="number"
            value={data.discountRate}
            onChange={(e) => updateData('discountRate', parseFloat(e.target.value) || 0)}
            min="0"
            max="50"
            step="0.5"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('currency')}</label>
          <select
            value={data.currency}
            onChange={(e) => updateData('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {['USD', 'EUR', 'GBP', 'CNY', 'JPY'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-red-700 dark:text-red-400">{t('costs')}</h3>
            <button onClick={addCost} className="text-sm text-red-600 hover:text-red-700">{t('addCost')}</button>
          </div>
          <div className="space-y-2">
            {data.costs.map(cost => (
              <div key={cost.id} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={cost.name}
                  onChange={(e) => updateCost(cost.id, 'name', e.target.value)}
                  placeholder={t("costNamePlaceholder")}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  value={cost.amount}
                  onChange={(e) => updateCost(cost.id, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <select
                  value={cost.type}
                  onChange={(e) => updateCost(cost.id, 'type', e.target.value)}
                  className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="one-time">One-time</option>
                  <option value="recurring">Recurring</option>
                </select>
                {cost.type === 'recurring' && (
                  <select
                    value={cost.frequency || 'yearly'}
                    onChange={(e) => updateCost(cost.id, 'frequency', e.target.value)}
                    className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                )}
                <button onClick={() => removeCost(cost.id)} className="text-red-500 hover:text-red-700">×</button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-green-700 dark:text-green-400">{t('benefits')}</h3>
            <button onClick={addBenefit} className="text-sm text-green-600 hover:text-green-700">{t('addBenefit')}</button>
          </div>
          <div className="space-y-2">
            {data.benefits.map(benefit => (
              <div key={benefit.id} className="flex gap-2 items-center flex-wrap">
                <input
                  type="text"
                  value={benefit.name}
                  onChange={(e) => updateBenefit(benefit.id, 'name', e.target.value)}
                  placeholder={t("benefitNamePlaceholder")}
                  className="flex-1 min-w-32 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  value={benefit.amount}
                  onChange={(e) => updateBenefit(benefit.id, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <select
                  value={benefit.frequency || 'monthly'}
                  onChange={(e) => updateBenefit(benefit.id, 'frequency', e.target.value)}
                  className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={benefit.probability}
                    onChange={(e) => updateBenefit(benefit.id, 'probability', Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                    className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    min="0"
                    max="100"
                  />
                  <span className="text-xs text-gray-500">%</span>
                </div>
                <button onClick={() => removeBenefit(benefit.id)} className="text-red-500 hover:text-red-700">×</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`p-6 rounded-lg border-2 ${analysis.isViable ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'}`}>
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-3xl ${analysis.isViable ? 'text-green-600' : 'text-red-600'}`}>
            {analysis.isViable ? '✓' : '✗'}
          </span>
          <div>
            <h3 className={`text-xl font-bold ${analysis.isViable ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {analysis.isViable ? 'Project is Financially Viable' : 'Project May Not Be Viable'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Based on {data.timeframeYears}-year analysis with {data.discountRate}% discount rate
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500">Net Present Value</p>
            <p className={`text-lg font-bold ${analysis.npv >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(analysis.npv)}
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500">Benefit-Cost Ratio</p>
            <p className={`text-lg font-bold ${analysis.bcRatio >= 1 ? 'text-green-600' : 'text-red-600'}`}>
              {analysis.bcRatio.toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500">ROI</p>
            <p className={`text-lg font-bold ${analysis.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analysis.roi.toFixed(1)}%
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500">Payback Period</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {analysis.paybackPeriod === Infinity ? 'N/A' : `${analysis.paybackPeriod.toFixed(1)} yrs`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h4 className="font-medium mb-3 text-gray-900 dark:text-white">Cost Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">One-time Costs</span>
              <span className="text-gray-900 dark:text-white">{formatCurrency(analysis.oneTimeCosts)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Recurring Costs ({data.timeframeYears} yrs)</span>
              <span className="text-gray-900 dark:text-white">{formatCurrency(analysis.recurringCosts)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 font-medium">
              <span className="text-gray-900 dark:text-white">Total Costs</span>
              <span className="text-red-600">{formatCurrency(analysis.totalCosts)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">NPV of Costs</span>
              <span className="text-gray-600 dark:text-gray-400">{formatCurrency(analysis.npvCosts)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h4 className="font-medium mb-3 text-gray-900 dark:text-white">Benefit Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Benefits ({data.timeframeYears} yrs)</span>
              <span className="text-gray-900 dark:text-white">{formatCurrency(analysis.totalBenefits)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">(Probability-adjusted)</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 font-medium">
              <span className="text-gray-900 dark:text-white">NPV of Benefits</span>
              <span className="text-green-600">{formatCurrency(analysis.npvBenefits)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
