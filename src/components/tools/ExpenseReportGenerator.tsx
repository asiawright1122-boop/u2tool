'use client';

import { useTranslations } from 'next-intl';
import { useState, useCallback, useMemo } from 'react';

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  receipt: boolean;
  notes: string;
}

interface ReportData {
  reportTitle: string;
  employeeName: string;
  department: string;
  reportPeriod: { start: string; end: string };
  expenses: Expense[];
  currency: string;
}

const CATEGORIES = [
  'Travel', 'Meals', 'Accommodation', 'Transportation', 'Office Supplies',
  'Software', 'Training', 'Client Entertainment', 'Communication', 'Other'
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CNY', 'JPY'];

export default function ExpenseReportGenerator() {
  const t = useTranslations('tools.expense-report-generator');
  const tCommon = useTranslations('tools');
  const [report, setReport] = useState<ReportData>({
    reportTitle: 'Monthly Expense Report',
    employeeName: '',
    department: '',
    reportPeriod: {
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
    expenses: [
      { id: '1', date: new Date().toISOString().split('T')[0], category: 'Travel', description: 'Flight to client meeting', amount: 450, receipt: true, notes: '' },
      { id: '2', date: new Date().toISOString().split('T')[0], category: 'Meals', description: 'Team lunch', amount: 85, receipt: true, notes: '' },
    ],
    currency: 'USD',
  });

  const updateReport = useCallback(<K extends keyof ReportData>(key: K, value: ReportData[K]) => {
    setReport(prev => ({ ...prev, [key]: value }));
  }, []);

  const addExpense = useCallback(() => {
    setReport(prev => ({
      ...prev,
      expenses: [...prev.expenses, {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        category: 'Other',
        description: '',
        amount: 0,
        receipt: false,
        notes: '',
      }],
    }));
  }, []);

  const updateExpense = useCallback((id: string, field: keyof Expense, value: string | number | boolean) => {
    setReport(prev => ({
      ...prev,
      expenses: prev.expenses.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  }, []);

  const removeExpense = useCallback((id: string) => {
    setReport(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id),
    }));
  }, []);

  const calculations = useMemo(() => {
    const total = report.expenses.reduce((sum, e) => sum + e.amount, 0);
    const byCategory = report.expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);
    const withReceipts = report.expenses.filter(e => e.receipt).length;
    const withoutReceipts = report.expenses.length - withReceipts;
    return { total, byCategory, withReceipts, withoutReceipts };
  }, [report.expenses]);

  const exportCSV = useCallback(() => {
    const headers = ['Date', 'Category', 'Description', 'Amount', 'Receipt', 'Notes'];
    const rows = report.expenses.map(e => [
      e.date, e.category, e.description, e.amount.toString(), e.receipt ? 'Yes' : 'No', e.notes
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-${report.reportPeriod.start}-${report.reportPeriod.end}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [report]);

  const exportJSON = useCallback(() => {
    const data = {
      ...report,
      summary: calculations,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-${report.reportPeriod.start}-${report.reportPeriod.end}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [report, calculations]);

  const currencySymbol = useMemo(() => {
    const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CNY: '¥', JPY: '¥' };
    return symbols[report.currency] || '$';
  }, [report.currency]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('reportTitle')}</label>
          <input
            type="text"
            value={report.reportTitle}
            onChange={(e) => updateReport('reportTitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('employeeName')}</label>
          <input
            type="text"
            value={report.employeeName}
            onChange={(e) => updateReport('employeeName', e.target.value)}
            placeholder={t("namePlaceholder")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('department')}</label>
          <input
            type="text"
            value={report.department}
            onChange={(e) => updateReport('department', e.target.value)}
            placeholder={t("departmentPlaceholder")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('currency')}</label>
          <select
            value={report.currency}
            onChange={(e) => updateReport('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('periodStart')}</label>
          <input
            type="date"
            value={report.reportPeriod.start}
            onChange={(e) => updateReport('reportPeriod', { ...report.reportPeriod, start: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('periodEnd')}</label>
          <input
            type="date"
            value={report.reportPeriod.end}
            onChange={(e) => updateReport('reportPeriod', { ...report.reportPeriod, end: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-900 dark:text-white">{t('expenses')}</h3>
          <button onClick={addExpense} className="text-sm text-blue-600 hover:text-blue-700">{t('addExpense')}</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-2">{t('date')}</th>
                <th className="text-left py-2 px-2">{t('category')}</th>
                <th className="text-left py-2 px-2">{t('description')}</th>
                <th className="text-right py-2 px-2">{t('amount')}</th>
                <th className="text-center py-2 px-2">{t('receipt')}</th>
                <th className="text-left py-2 px-2">{t('notes')}</th>
                <th className="py-2 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {report.expenses.map(expense => (
                <tr key={expense.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 px-2">
                    <input
                      type="date"
                      value={expense.date}
                      onChange={(e) => updateExpense(expense.id, 'date', e.target.value)}
                      className="w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <select
                      value={expense.category}
                      onChange={(e) => updateExpense(expense.id, 'category', e.target.value)}
                      className="w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={expense.description}
                      onChange={(e) => updateExpense(expense.id, 'description', e.target.value)}
                      placeholder={t("descriptionPlaceholder")}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      value={expense.amount}
                      onChange={(e) => updateExpense(expense.id, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm text-right"
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="checkbox"
                      checked={expense.receipt}
                      onChange={(e) => updateExpense(expense.id, 'receipt', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={expense.notes}
                      onChange={(e) => updateExpense(expense.id, 'notes', e.target.value)}
                      placeholder={t("notesPlaceholder")}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <button onClick={() => removeExpense(expense.id)} className="text-red-500 hover:text-red-700">×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-600 dark:text-blue-400">{t('totalExpenses')}</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{currencySymbol}{calculations.total.toFixed(2)}</p>
          <p className="text-xs text-blue-500">{report.expenses.length} {t('items')}</p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400">{t('withReceipts')}</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{calculations.withReceipts}</p>
          <p className="text-xs text-green-500">{calculations.withoutReceipts} {t('withoutReceipts')}</p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p className="text-sm text-purple-600 dark:text-purple-400">{t('categories')}</p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{Object.keys(calculations.byCategory).length}</p>
          <p className="text-xs text-purple-500">{t('expenseCategories')}</p>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h4 className="font-medium mb-3 text-gray-900 dark:text-white">{t('breakdownByCategory')}</h4>
        <div className="space-y-2">
          {Object.entries(calculations.byCategory).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => (
            <div key={cat} className="flex items-center gap-3">
              <span className="w-32 text-sm text-gray-600 dark:text-gray-400">{cat}</span>
              <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(amount / calculations.total) * 100}%` }}
                />
              </div>
              <span className="w-24 text-sm text-right text-gray-900 dark:text-white">{currencySymbol}{amount.toFixed(2)}</span>
              <span className="w-12 text-xs text-gray-500 text-right">{((amount / calculations.total) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={exportCSV} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          {t('exportCSV')}
        </button>
        <button onClick={exportJSON} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {t('exportJSON')}
        </button>
      </div>
    </div>
  );
}
