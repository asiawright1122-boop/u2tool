<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['expense-report-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.expense-report-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
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

  let report = $state({
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

  function updateReport(key: K, value: ReportData[K]) {
    report = ({ ...report, [key]: value });
  }

  function addExpense() {
    report = ({
      ...report,
      expenses: [...report.expenses, {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        category: 'Other',
        description: '',
        amount: 0,
        receipt: false,
        notes: '',
      }],
    });
  }

  function updateExpense(id: string, field: keyof Expense, value: string | number | boolean) {
    report = ({
      ...report,
      expenses: report.expenses.map(e => e.id === id ? { ...e, [field]: value } : e),
    });
  }

  function removeExpense(id: string) {
    report = ({
      ...report,
      expenses: report.expenses.filter(e => e.id !== id),
    });
  }

  let calculations = $derived.by(() => {
    const total = report.expenses.reduce((sum, e) => sum + e.amount, 0);
    const byCategory = report.expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
    const withReceipts = report.expenses.filter(e => e.receipt).length;
    const withoutReceipts = report.expenses.length - withReceipts;
    return { total, byCategory, withReceipts, withoutReceipts };
  });

  function exportCSV() {
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
  }

  function exportJSON() {
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
  }

  let currencySymbol = $derived.by(() => {
    const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CNY: '¥', JPY: '¥' };
    return symbols[report.currency] || '$';
  });

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs text-gray-500 mb-1">{t('reportTitle')}</label>
          <input
            type="text"
            value={report.reportTitle}
            onchange={(e) => updateReport('reportTitle', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">{t('employeeName')}</label>
          <input
            type="text"
            value={report.employeeName}
            onchange={(e) => updateReport('employeeName', e.target.value)}
            placeholder={t("namePlaceholder")}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">{t('department')}</label>
          <input
            type="text"
            value={report.department}
            onchange={(e) => updateReport('department', e.target.value)}
            placeholder={t("departmentPlaceholder")}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">{t('currency')}</label>
          <select
            value={report.currency}
            onchange={(e) => updateReport('currency', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {#each CURRENCIES as c (c)}
<option  value={c}>{c}</option>
{/each}
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs text-gray-500 mb-1">{t('periodStart')}</label>
          <input
            type="date"
            value={report.reportPeriod.start}
            onchange={(e) => updateReport('reportPeriod', { ...report.reportPeriod, start: e.target.value })}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">{t('periodEnd')}</label>
          <input
            type="date"
            value={report.reportPeriod.end}
            onchange={(e) => updateReport('reportPeriod', { ...report.reportPeriod, end: e.target.value })}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-medium text-gray-900 dark:text-white">{t('expenses')}</h3>
          <button onclick={addExpense} class="text-sm text-blue-600 hover:text-blue-700">{t('addExpense')}</button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="text-left py-2 px-2">{t('date')}</th>
                <th class="text-left py-2 px-2">{t('category')}</th>
                <th class="text-left py-2 px-2">{t('description')}</th>
                <th class="text-right py-2 px-2">{t('amount')}</th>
                <th class="text-center py-2 px-2">{t('receipt')}</th>
                <th class="text-left py-2 px-2">{t('notes')}</th>
                <th class="py-2 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {#each report.expenses as expense (expense.id)}
<tr  class="border-b border-gray-100 dark:border-gray-800">
                  <td class="py-2 px-2">
                    <input
                      type="date"
                      value={expense.date}
                      onchange={(e) => updateExpense(expense.id, 'date', e.target.value)}
                      class="w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  </td>
                  <td class="py-2 px-2">
                    <select
                      value={expense.category}
                      onchange={(e) => updateExpense(expense.id, 'category', e.target.value)}
                      class="w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    >
                      {#each CATEGORIES as c (c)}
<option  value={c}>{c}</option>
{/each}
                    </select>
                  </td>
                  <td class="py-2 px-2">
                    <input
                      type="text"
                      value={expense.description}
                      onchange={(e) => updateExpense(expense.id, 'description', e.target.value)}
                      placeholder={t("descriptionPlaceholder")}
                      class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  </td>
                  <td class="py-2 px-2">
                    <input
                      type="number"
                      value={expense.amount}
                      onchange={(e) => updateExpense(expense.id, 'amount', parseFloat(e.target.value) || 0)}
                      class="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm text-right"
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td class="py-2 px-2 text-center">
                    <input
                      type="checkbox"
                      checked={expense.receipt}
                      onchange={(e) => updateExpense(expense.id, 'receipt', e.target.checked)}
                      class="w-4 h-4"
                    />
                  </td>
                  <td class="py-2 px-2">
                    <input
                      type="text"
                      value={expense.notes}
                      onchange={(e) => updateExpense(expense.id, 'notes', e.target.value)}
                      placeholder={t("notesPlaceholder")}
                      class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  </td>
                  <td class="py-2 px-2">
                    <button onclick={() => removeExpense(expense.id)} class="text-red-500 hover:text-red-700">×</button>
                  </td>
                </tr>
{/each}
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p class="text-sm text-blue-600 dark:text-blue-400">{t('totalExpenses')}</p>
          <p class="text-2xl font-bold text-blue-700 dark:text-blue-300">{currencySymbol}{calculations.total.toFixed(2)}</p>
          <p class="text-xs text-blue-500">{report.expenses.length} {t('items')}</p>
        </div>
        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p class="text-sm text-green-600 dark:text-green-400">{t('withReceipts')}</p>
          <p class="text-2xl font-bold text-green-700 dark:text-green-300">{calculations.withReceipts}</p>
          <p class="text-xs text-green-500">{calculations.withoutReceipts} {t('withoutReceipts')}</p>
        </div>
        <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p class="text-sm text-purple-600 dark:text-purple-400">{t('categories')}</p>
          <p class="text-2xl font-bold text-purple-700 dark:text-purple-300">{Object.keys(calculations.byCategory).length}</p>
          <p class="text-xs text-purple-500">{t('expenseCategories')}</p>
        </div>
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h4 class="font-medium mb-3 text-gray-900 dark:text-white">{t('breakdownByCategory')}</h4>
        <div class="space-y-2">
          {#each Object.entries(calculations.byCategory).sort((a, b) => b[1] - a[1]) as [cat, amount] (cat)}
<div  class="flex items-center gap-3">
              <span class="w-32 text-sm text-gray-600 dark:text-gray-400">{cat}</span>
              <div class="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-blue-500 rounded-full"
                  style="width: {(amount / calculations.total) * 100}%"></div>
              </div>
              <span class="w-24 text-sm text-right text-gray-900 dark:text-white">{currencySymbol}{amount.toFixed(2)}</span>
              <span class="w-12 text-xs text-gray-500 text-right">{((amount / calculations.total) * 100).toFixed(0)}%</span>
            </div>
{/each}
        </div>
      </div>

      <div class="flex gap-3">
        <button onclick={exportCSV} class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          {t('exportCSV')}
        </button>
        <button onclick={exportJSON} class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {t('exportJSON')}
        </button>
      </div>
    </div>
  
