<script lang="ts">
  import { CURRENCIES, K } from '@/lib/tool-stubs';
  import { escapeHtmlAttribute, safeDownloadFileName } from '@/lib/sanitize';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['invoice-template-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.invoice-template-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}
  interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  items: InvoiceItem[];
  taxRate: number;
  notes: string;
  currency: string;
  template: 'modern' | 'classic' | 'minimal';
}

  let invoice = $state({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    companyName: 'Your Company Name',
    companyAddress: '123 Business Street, City, Country',
    companyEmail: 'contact@company.com',
    companyPhone: '+1 234 567 8900',
    clientName: 'Client Name',
    clientAddress: '456 Client Avenue, City, Country',
    clientEmail: 'client@email.com',
    items: [
      { id: '1', description: 'Web Development Services', quantity: 40, unitPrice: 75 },
      { id: '2', description: 'UI/UX Design', quantity: 20, unitPrice: 85 },
    ],
    taxRate: 10,
    notes: 'Thank you for your business!',
    currency: 'USD',
    template: 'modern',
  });

  let previewRef = $state(null);

  function updateInvoice<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) {
    invoice = ({ ...invoice, [key]: value });
  }

  function addItem() {
    invoice = ({
      ...invoice,
      items: [...invoice.items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }],
    });
  }

  function updateItem(id: string, field: keyof InvoiceItem, value: string | number) {
    invoice = ({
      ...invoice,
      items: invoice.items.map(item => item.id === id ? { ...item, [field]: value } : item),
    });
  }

  function removeItem(id: string) {
    invoice = ({
      ...invoice,
      items: invoice.items.filter(item => item.id !== id),
    });
  }

  let currencySymbol = $derived.by(
    () => CURRENCIES.find((item) => item.code === invoice.currency)?.symbol || '$'
  );
  /*


    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div class="flex gap-2 mb-4">
          {#each (['modern', 'classic', 'minimal'] as const) as tmpl (tmpl)}
<button 
              onclick={() => updateInvoice('template', tmpl)}
              class={`px-4 py-2 rounded-lg capitalize ${
                invoice.template === tmpl
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t(tmpl)}
            </button>
{/each}
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-gray-500 mb-1">{t('invoiceNumber')}</label>
            <input
              type="text"
              value={invoice.invoiceNumber}
              onchange={(e) => updateInvoice('invoiceNumber', e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">{t('currency')}</label>
            <select
              value={invoice.currency}
              onchange={(e) => updateInvoice('currency', e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {#each CURRENCIES as c (c.code)}
<option  value={c.code}>{c.code} ({c.symbol})</option>
{/each}
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">{t('invoiceDate')}</label>
            <input
              type="date"
              value={invoice.date}
              onchange={(e) => updateInvoice('date', e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">{t('dueDate')}</label>
            <input
              type="date"
              value={invoice.dueDate}
              onchange={(e) => updateInvoice('dueDate', e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 class="font-medium mb-3">{t('yourCompany')}</h3>
          <div class="space-y-2">
            <input
              type="text"
              value={invoice.companyName}
              onchange={(e) => updateInvoice('companyName', e.target.value)}
              placeholder={t("companyNamePlaceholder")}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <input
              type="text"
              value={invoice.companyAddress}
              onchange={(e) => updateInvoice('companyAddress', e.target.value)}
              placeholder={t("addressPlaceholder")}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <div class="grid grid-cols-2 gap-2">
              <input
                type="email"
                value={invoice.companyEmail}
                onchange={(e) => updateInvoice('companyEmail', e.target.value)}
                placeholder={t("emailPlaceholder")}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                type="tel"
                value={invoice.companyPhone}
                onchange={(e) => updateInvoice('companyPhone', e.target.value)}
                placeholder={t("phonePlaceholder")}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 class="font-medium mb-3">{t('billTo')}</h3>
          <div class="space-y-2">
            <input
              type="text"
              value={invoice.clientName}
              onchange={(e) => updateInvoice('clientName', e.target.value)}
              placeholder={t("clientNamePlaceholder")}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <input
              type="text"
              value={invoice.clientAddress}
              onchange={(e) => updateInvoice('clientAddress', e.target.value)}
              placeholder={t("clientAddressPlaceholder")}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <input
              type="email"
              value={invoice.clientEmail}
              onchange={(e) => updateInvoice('clientEmail', e.target.value)}
              placeholder={t("clientEmailPlaceholder")}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-medium">{t('items')}</h3>
            <button onclick={addItem} class="text-sm text-amber-600 hover:text-amber-700">{t('addItem')}</button>
          </div>
          <div class="space-y-2">
            {#each invoice.items as item (item.id)}
<div  class="flex gap-2 items-center">
                <input
                  type="text"
                  value={item.description}
                  onchange={(e) => updateItem(item.id, 'description', e.target.value)}
                  placeholder={t("descriptionPlaceholder")}
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onchange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  class="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  min="0"
                />
                <input
                  type="number"
                  value={item.unitPrice}
                  onchange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  class="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  min="0"
                  step="0.01"
                />
                <button onclick={() => removeItem(item.id)} class="text-red-500 hover:text-red-700 px-2">×</button>
              </div>
{/each}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-gray-500 mb-1">{t('taxRate')}</label>
            <input
              type="number"
              value={invoice.taxRate}
              onchange={(e) => updateInvoice('taxRate', parseFloat(e.target.value) || 0)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">{t('notes')}</label>
            <input
              type="text"
              value={invoice.notes}
              onchange={(e) => updateInvoice('notes', e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <button
          onclick={downloadHTML}
          class="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          {t('downloadInvoice')}
        </button>
      </div>

      <div bind:this={previewRef} class="bg-white p-8 rounded-lg shadow-lg overflow-auto max-h-[800px]">
        <style>{`
          .invoice-modern { font-family: system-ui, -apple-system, sans-serif; }
          .invoice-classic { font-family: Georgia, serif; }
          .invoice-minimal { font-family: 'Helvetica Neue', sans-serif; }
        `}</style>
        <div class={`invoice-${invoice.template}`}>
          {#if invoice.template === 'modern'}
<div class="border-l-4 border-amber-600 pl-4 mb-6">
              <h1 class="text-3xl font-bold text-gray-900">INVOICE</h1>
              <p class="text-gray-500">#{invoice.invoiceNumber}</p>
            </div>
{/if}
          {#if invoice.template === 'classic'}
<div class="text-center mb-6 border-b-2 border-gray-800 pb-4">
              <h1 class="text-3xl font-bold text-gray-900">INVOICE</h1>
              <p class="text-gray-600">No. {invoice.invoiceNumber}</p>
            </div>
{/if}
          {#if invoice.template === 'minimal'}
<div class="mb-6">
              <h1 class="text-2xl font-light text-gray-900 tracking-wide">INVOICE</h1>
              <p class="text-sm text-gray-400">{invoice.invoiceNumber}</p>
            </div>
{/if}

          <div class="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p class="text-xs text-gray-500 uppercase mb-1">From</p>
              <p class="font-semibold text-gray-900">{invoice.companyName}</p>
              <p class="text-sm text-gray-600">{invoice.companyAddress}</p>
              <p class="text-sm text-gray-600">{invoice.companyEmail}</p>
              <p class="text-sm text-gray-600">{invoice.companyPhone}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase mb-1">Bill To</p>
              <p class="font-semibold text-gray-900">{invoice.clientName}</p>
              <p class="text-sm text-gray-600">{invoice.clientAddress}</p>
              <p class="text-sm text-gray-600">{invoice.clientEmail}</p>
            </div>
          </div>

          <div class="flex gap-8 mb-8 text-sm">
            <div>
              <p class="text-gray-500">Invoice Date</p>
              <p class="font-medium text-gray-900">{invoice.date}</p>
            </div>
            <div>
              <p class="text-gray-500">Due Date</p>
              <p class="font-medium text-gray-900">{invoice.dueDate}</p>
            </div>
          </div>

          <table class="w-full mb-8">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-2 text-sm text-gray-500">Description</th>
                <th class="text-right py-2 text-sm text-gray-500">Qty</th>
                <th class="text-right py-2 text-sm text-gray-500">Price</th>
                <th class="text-right py-2 text-sm text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody>
              {#each invoice.items as item (item.id)}
<tr  class="border-b border-gray-100">
                  <td class="py-3 text-gray-900">{item.description || 'Item'}</td>
                  <td class="py-3 text-right text-gray-600">{item.quantity}</td>
                  <td class="py-3 text-right text-gray-600">{formatCurrency(item.unitPrice)}</td>
                  <td class="py-3 text-right text-gray-900 font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
{/each}
            </tbody>
          </table>

          <div class="flex justify-end">
            <div class="w-64">
              <div class="flex justify-between py-2 text-sm">
                <span class="text-gray-500">Subtotal</span>
                <span class="text-gray-900">{formatCurrency(calculations.subtotal)}</span>
              </div>
              <div class="flex justify-between py-2 text-sm border-b border-gray-200">
                <span class="text-gray-500">Tax ({invoice.taxRate}%)</span>
                <span class="text-gray-900">{formatCurrency(calculations.tax)}</span>
              </div>
              <div class="flex justify-between py-3 text-lg font-bold">
                <span class="text-gray-900">Total</span>
                <span class="text-amber-600">{formatCurrency(calculations.total)}</span>
              </div>
            </div>
          </div>

          {#if invoice.notes}
<div class="mt-8 pt-4 border-t border-gray-200">
              <p class="text-sm text-gray-500">{invoice.notes}</p>
            </div>
{/if}
        </div>
      </div>
    </div>
  
;
*/

  let calculations = $derived.by(() => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const tax = subtotal * (invoice.taxRate / 100);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  });

  function formatCurrency(amount: number) {
    return `${currencySymbol}${amount.toFixed(2)}`;
  }

  function downloadHTML() {
    if (!previewRef) return;
    const invoiceTitle = escapeHtmlAttribute(invoice.invoiceNumber);
    const fileName = safeDownloadFileName(`invoice-${invoice.invoiceNumber}`, 'invoice', 'html');
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Invoice ${invoiceTitle}</title><style>body{font-family:system-ui,-apple-system,sans-serif;margin:0;padding:40px;background:#fff}${previewRef.querySelector('style')?.textContent || ''}</style></head><body>${previewRef.innerHTML}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

</script>


    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div class="flex gap-2 mb-4">
          {#each (['modern', 'classic', 'minimal'] as const) as tmpl (tmpl)}
<button 
              onclick={() => updateInvoice('template', tmpl)}
              class={`px-4 py-2 rounded-lg capitalize ${
                invoice.template === tmpl
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t(tmpl)}
            </button>
{/each}
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-gray-500 mb-1">{t('invoiceNumber')}</label>
            <input
              type="text"
              value={invoice.invoiceNumber}
              onchange={(e) => updateInvoice('invoiceNumber', e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">{t('currency')}</label>
            <select
              value={invoice.currency}
              onchange={(e) => updateInvoice('currency', e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {#each CURRENCIES as c (c.code)}
<option  value={c.code}>{c.code} ({c.symbol})</option>
{/each}
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">{t('invoiceDate')}</label>
            <input
              type="date"
              value={invoice.date}
              onchange={(e) => updateInvoice('date', e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">{t('dueDate')}</label>
            <input
              type="date"
              value={invoice.dueDate}
              onchange={(e) => updateInvoice('dueDate', e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 class="font-medium mb-3">{t('yourCompany')}</h3>
          <div class="space-y-2">
            <input
              type="text"
              value={invoice.companyName}
              onchange={(e) => updateInvoice('companyName', e.target.value)}
              placeholder={t("companyNamePlaceholder")}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <input
              type="text"
              value={invoice.companyAddress}
              onchange={(e) => updateInvoice('companyAddress', e.target.value)}
              placeholder={t("addressPlaceholder")}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <div class="grid grid-cols-2 gap-2">
              <input
                type="email"
                value={invoice.companyEmail}
                onchange={(e) => updateInvoice('companyEmail', e.target.value)}
                placeholder={t("emailPlaceholder")}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                type="tel"
                value={invoice.companyPhone}
                onchange={(e) => updateInvoice('companyPhone', e.target.value)}
                placeholder={t("phonePlaceholder")}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 class="font-medium mb-3">{t('billTo')}</h3>
          <div class="space-y-2">
            <input
              type="text"
              value={invoice.clientName}
              onchange={(e) => updateInvoice('clientName', e.target.value)}
              placeholder={t("clientNamePlaceholder")}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <input
              type="text"
              value={invoice.clientAddress}
              onchange={(e) => updateInvoice('clientAddress', e.target.value)}
              placeholder={t("clientAddressPlaceholder")}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <input
              type="email"
              value={invoice.clientEmail}
              onchange={(e) => updateInvoice('clientEmail', e.target.value)}
              placeholder={t("clientEmailPlaceholder")}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-medium">{t('items')}</h3>
            <button onclick={addItem} class="text-sm text-amber-600 hover:text-amber-700">{t('addItem')}</button>
          </div>
          <div class="space-y-2">
            {#each invoice.items as item (item.id)}
<div  class="flex gap-2 items-center">
                <input
                  type="text"
                  value={item.description}
                  onchange={(e) => updateItem(item.id, 'description', e.target.value)}
                  placeholder={t("descriptionPlaceholder")}
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onchange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  class="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  min="0"
                />
                <input
                  type="number"
                  value={item.unitPrice}
                  onchange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  class="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  min="0"
                  step="0.01"
                />
                <button onclick={() => removeItem(item.id)} class="text-red-500 hover:text-red-700 px-2">×</button>
              </div>
{/each}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-gray-500 mb-1">{t('taxRate')}</label>
            <input
              type="number"
              value={invoice.taxRate}
              onchange={(e) => updateInvoice('taxRate', parseFloat(e.target.value) || 0)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">{t('notes')}</label>
            <input
              type="text"
              value={invoice.notes}
              onchange={(e) => updateInvoice('notes', e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <button
          onclick={downloadHTML}
          class="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          {t('downloadInvoice')}
        </button>
      </div>

      <div bind:this={previewRef} class="bg-white p-8 rounded-lg shadow-lg overflow-auto max-h-[800px]">
        <style>{`
          .invoice-modern { font-family: system-ui, -apple-system, sans-serif; }
          .invoice-classic { font-family: Georgia, serif; }
          .invoice-minimal { font-family: 'Helvetica Neue', sans-serif; }
        `}</style>
        <div class={`invoice-${invoice.template}`}>
          {#if invoice.template === 'modern'}
<div class="border-l-4 border-amber-600 pl-4 mb-6">
              <h1 class="text-3xl font-bold text-gray-900">INVOICE</h1>
              <p class="text-gray-500">#{invoice.invoiceNumber}</p>
            </div>
{/if}
          {#if invoice.template === 'classic'}
<div class="text-center mb-6 border-b-2 border-gray-800 pb-4">
              <h1 class="text-3xl font-bold text-gray-900">INVOICE</h1>
              <p class="text-gray-600">No. {invoice.invoiceNumber}</p>
            </div>
{/if}
          {#if invoice.template === 'minimal'}
<div class="mb-6">
              <h1 class="text-2xl font-light text-gray-900 tracking-wide">INVOICE</h1>
              <p class="text-sm text-gray-400">{invoice.invoiceNumber}</p>
            </div>
{/if}

          <div class="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p class="text-xs text-gray-500 uppercase mb-1">{t('from')}</p>
              <p class="font-semibold text-gray-900">{invoice.companyName}</p>
              <p class="text-sm text-gray-600">{invoice.companyAddress}</p>
              <p class="text-sm text-gray-600">{invoice.companyEmail}</p>
              <p class="text-sm text-gray-600">{invoice.companyPhone}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase mb-1">{t('billTo')}</p>
              <p class="font-semibold text-gray-900">{invoice.clientName}</p>
              <p class="text-sm text-gray-600">{invoice.clientAddress}</p>
              <p class="text-sm text-gray-600">{invoice.clientEmail}</p>
            </div>
          </div>

          <div class="flex gap-8 mb-8 text-sm">
            <div>
              <p class="text-gray-500">{t('invoiceDate')}</p>
              <p class="font-medium text-gray-900">{invoice.date}</p>
            </div>
            <div>
              <p class="text-gray-500">{t('dueDate')}</p>
              <p class="font-medium text-gray-900">{invoice.dueDate}</p>
            </div>
          </div>

          <table class="w-full mb-8">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-2 text-sm text-gray-500">{t('descriptionPlaceholder')}</th>
                <th class="text-right py-2 text-sm text-gray-500">{t('qty')}</th>
                <th class="text-right py-2 text-sm text-gray-500">{t('price')}</th>
                <th class="text-right py-2 text-sm text-gray-500">{t('amount')}</th>
              </tr>
            </thead>
            <tbody>
              {#each invoice.items as item (item.id)}
<tr  class="border-b border-gray-100">
                  <td class="py-3 text-gray-900">{item.description || t('items')}</td>
                  <td class="py-3 text-right text-gray-600">{item.quantity}</td>
                  <td class="py-3 text-right text-gray-600">{formatCurrency(item.unitPrice)}</td>
                  <td class="py-3 text-right text-gray-900 font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
{/each}
            </tbody>
          </table>

          <div class="flex justify-end">
            <div class="w-64">
              <div class="flex justify-between py-2 text-sm">
                <span class="text-gray-500">{t('subtotal')}</span>
                <span class="text-gray-900">{formatCurrency(calculations.subtotal)}</span>
              </div>
              <div class="flex justify-between py-2 text-sm border-b border-gray-200">
                <span class="text-gray-500">{t('tax')} ({invoice.taxRate}%)</span>
                <span class="text-gray-900">{formatCurrency(calculations.tax)}</span>
              </div>
              <div class="flex justify-between py-3 text-lg font-bold">
                <span class="text-gray-900">{t('total')}</span>
                <span class="text-amber-600">{formatCurrency(calculations.total)}</span>
              </div>
            </div>
          </div>

          {#if invoice.notes}
<div class="mt-8 pt-4 border-t border-gray-200">
              <p class="text-sm text-gray-500">{invoice.notes}</p>
            </div>
{/if}
        </div>
      </div>
    </div>
  
