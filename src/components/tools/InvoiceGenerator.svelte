<script lang="ts">
  import { CURRENCIES } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
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

  let invoiceRef = $state(null);

  let invoiceNumber = $state(`INV-${Date.now().toString().slice(-6)}`);

  let invoiceDate = $state(() => new Date().toISOString().split('T')[0]);

  let dueDate = $state(() => {
    const d = new Date(); d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  let currency = $state('USD');

  let taxRate = $state(0);

  let companyName = $state('');

  let companyAddress = $state('');

  let clientName = $state('');

  let clientAddress = $state('');

  let notes = $state('');

  let items = $state([
    { id: '1', description: '', quantity: 1, unitPrice: 0 }
  ]);

  // Functions
  const _currencySymbol = CURRENCIES.find((item) => item.code === currency)?.symbol || '$';
  /*


    <div class="space-y-6">
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <!-- Form -->
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.invoiceNumber')}</label>
              <input type="text" bind:value={invoiceNumber}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.currency')}</label>
              <select bind:value={currency}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                {#each CURRENCIES as c (c.code)}
<option  value={c.code}>{c.symbol} {c.code}</option>
{/each}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.invoiceDate')}</label>
              <input type="date" bind:value={invoiceDate}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.dueDate')}</label>
              <input type="date" bind:value={dueDate}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.from')}</label>
              <input type="text" bind:value={companyName} placeholder={t('invoice.companyName')}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 mb-2" />
              <textarea bind:value={companyAddress} placeholder={t('invoice.address')} rows={2}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.to')}</label>
              <input type="text" bind:value={clientName} placeholder={t('invoice.clientName')}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 mb-2" />
              <textarea bind:value={clientAddress} placeholder={t('invoice.address')} rows={2}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"></textarea>
            </div>
          </div>

          <!-- Items -->
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-3">{t('invoice.items')}</h3>
            <div class="space-y-2">
              {#each items as item (item.id)}
<div  class="grid grid-cols-12 gap-2 items-center">
                  <input type="text" bind:value={item.description}
                    placeholder={t('invoice.description')} class="col-span-5 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm" />
                  <input type="number" min="1" bind:value={item.quantity}
                    placeholder={t('invoice.quantity')} class="col-span-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm" />
                  <input type="number" min="0" step="0.01" bind:value={item.unitPrice}
                    placeholder={t('invoice.unitPrice')} class="col-span-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm" />
                  <span class="col-span-1 text-sm text-gray-600 dark:text-gray-400 text-right">{formatCurrency(item.quantity * item.unitPrice)}</span>
                  <button onclick={() => removeItem(item.id)} disabled={items.length === 1} class="col-span-1 text-red-500 hover:text-red-700 disabled:opacity-30">×</button>
                </div>
{/each}
            </div>
            <button onclick={addItem} class="mt-3 text-sm text-amber-600 hover:text-amber-800">{t('invoice.addItem')}</button>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.taxRate')} (%)</label>
              <input type="number" min="0" max="100" step="0.1" bind:value={taxRate}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.notes')}</label>
              <textarea bind:value={notes} rows={2}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"></textarea>
            </div>
          </div>

          <button onclick={downloadPDF} class="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium">
            {t('invoice.downloadPdf')}
          </button>
        </div>

        <!-- Preview -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div bind:this={invoiceRef} class="p-8 bg-white text-gray-900" style="min-height: 600px">
            <div class="flex justify-between items-start mb-8">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">{t('invoice.invoice')}</h1>
                <p class="text-gray-600 mt-1">#{invoiceNumber}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-600">{t('invoice.invoiceDate')}: {invoiceDate}</p>
                <p class="text-sm text-gray-600">{t('invoice.dueDate')}: {dueDate}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">{t('invoice.from')}</h3>
                <p class="font-medium text-gray-900">{companyName || '—'}</p>
                <p class="text-sm text-gray-600 whitespace-pre-line">{companyAddress}</p>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">{t('invoice.to')}</h3>
                <p class="font-medium text-gray-900">{clientName || '—'}</p>
                <p class="text-sm text-gray-600 whitespace-pre-line">{clientAddress}</p>
              </div>
            </div>

            <table class="w-full mb-8">
              <thead>
                <tr class="border-b-2 border-gray-200">
                  <th class="text-left py-3 text-sm font-semibold text-gray-600">{t('invoice.description')}</th>
                  <th class="text-right py-3 text-sm font-semibold text-gray-600">{t('invoice.quantity')}</th>
                  <th class="text-right py-3 text-sm font-semibold text-gray-600">{t('invoice.unitPrice')}</th>
                  <th class="text-right py-3 text-sm font-semibold text-gray-600">{t('invoice.amount')}</th>
                </tr>
              </thead>
              <tbody>
                {#each items as item (item.id)}
<tr  class="border-b border-gray-100">
                    <td class="py-3 text-gray-900">{item.description || '—'}</td>
                    <td class="py-3 text-right text-gray-600">{item.quantity}</td>
                    <td class="py-3 text-right text-gray-600">{formatCurrency(item.unitPrice)}</td>
                    <td class="py-3 text-right text-gray-900">{formatCurrency(item.quantity * item.unitPrice)}</td>
                  </tr>
{/each}
              </tbody>
            </table>

            <div class="flex justify-end">
              <div class="w-64">
                <div class="flex justify-between py-2"><span class="text-gray-600">{t('invoice.subtotal')}</span><span>{formatCurrency(subtotal)}</span></div>
                {#if taxRate > 0}
<div class="flex justify-between py-2"><span class="text-gray-600">{t('invoice.tax')} ({taxRate}%)</span><span>{formatCurrency(taxAmount)}</span></div>
{/if}
                <div class="flex justify-between py-3 border-t-2 border-gray-900 font-bold text-lg"><span>{t('invoice.total')}</span><span>{formatCurrency(total)}</span></div>
              </div>
            </div>

            {#if notes}
<div class="mt-8 pt-4 border-t border-gray-200"><p class="text-sm text-gray-600">{notes}</p></div>
{/if}
          </div>
        </div>
      </div>
    </div>
  
*/
  function addItem() {
    items = [...items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }];
  }
  function removeItem(id: string) {
    if (items.length > 1) items = items.filter(item => item.id !== id);
  }
  function updateItem(id: string, field: keyof InvoiceItem, value: string | number) {
    items = items.map(item => item.id === id ? { ...item, [field]: value } : item);
  }
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  function formatCurrency(amount: number) {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  }
  async function downloadPDF() {
    if (!invoiceRef) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const canvas = await html2canvas(invoiceRef, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoiceNumber}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <!-- Form -->
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.invoiceNumber')}</label>
              <input type="text" bind:value={invoiceNumber}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.currency')}</label>
              <select bind:value={currency}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                {#each CURRENCIES as c (c.code)}
<option  value={c.code}>{c.symbol} {c.code}</option>
{/each}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.invoiceDate')}</label>
              <input type="date" bind:value={invoiceDate}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.dueDate')}</label>
              <input type="date" bind:value={dueDate}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.from')}</label>
              <input type="text" bind:value={companyName} placeholder={t('invoice.companyName')}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 mb-2" />
              <textarea bind:value={companyAddress} placeholder={t('invoice.address')} rows={2}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.to')}</label>
              <input type="text" bind:value={clientName} placeholder={t('invoice.clientName')}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 mb-2" />
              <textarea bind:value={clientAddress} placeholder={t('invoice.address')} rows={2}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"></textarea>
            </div>
          </div>

          <!-- Items -->
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-3">{t('invoice.items')}</h3>
            <div class="space-y-2">
              {#each items as item (item.id)}
<div  class="grid grid-cols-12 gap-2 items-center">
                  <input type="text" bind:value={item.description}
                    placeholder={t('invoice.description')} class="col-span-5 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm" />
                  <input type="number" min="1" bind:value={item.quantity}
                    placeholder={t('invoice.quantity')} class="col-span-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm" />
                  <input type="number" min="0" step="0.01" bind:value={item.unitPrice}
                    placeholder={t('invoice.unitPrice')} class="col-span-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm" />
                  <span class="col-span-1 text-sm text-gray-600 dark:text-gray-400 text-right">{formatCurrency(item.quantity * item.unitPrice)}</span>
                  <button onclick={() => removeItem(item.id)} disabled={items.length === 1} class="col-span-1 text-red-500 hover:text-red-700 disabled:opacity-30">×</button>
                </div>
{/each}
            </div>
            <button onclick={addItem} class="mt-3 text-sm text-amber-600 hover:text-amber-800">{t('invoice.addItem')}</button>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.taxRate')} (%)</label>
              <input type="number" min="0" max="100" step="0.1" bind:value={taxRate}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.notes')}</label>
              <textarea bind:value={notes} rows={2}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"></textarea>
            </div>
          </div>

          <button onclick={downloadPDF} class="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium">
            {t('invoice.downloadPdf')}
          </button>
        </div>

        <!-- Preview -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div bind:this={invoiceRef} class="p-8 bg-white text-gray-900" style="min-height: 600px">
            <div class="flex justify-between items-start mb-8">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">{t('invoice.invoice')}</h1>
                <p class="text-gray-600 mt-1">#{invoiceNumber}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-600">{t('invoice.invoiceDate')}: {invoiceDate}</p>
                <p class="text-sm text-gray-600">{t('invoice.dueDate')}: {dueDate}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">{t('invoice.from')}</h3>
                <p class="font-medium text-gray-900">{companyName || '—'}</p>
                <p class="text-sm text-gray-600 whitespace-pre-line">{companyAddress}</p>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">{t('invoice.to')}</h3>
                <p class="font-medium text-gray-900">{clientName || '—'}</p>
                <p class="text-sm text-gray-600 whitespace-pre-line">{clientAddress}</p>
              </div>
            </div>

            <table class="w-full mb-8">
              <thead>
                <tr class="border-b-2 border-gray-200">
                  <th class="text-left py-3 text-sm font-semibold text-gray-600">{t('invoice.description')}</th>
                  <th class="text-right py-3 text-sm font-semibold text-gray-600">{t('invoice.quantity')}</th>
                  <th class="text-right py-3 text-sm font-semibold text-gray-600">{t('invoice.unitPrice')}</th>
                  <th class="text-right py-3 text-sm font-semibold text-gray-600">{t('invoice.amount')}</th>
                </tr>
              </thead>
              <tbody>
                {#each items as item (item.id)}
<tr  class="border-b border-gray-100">
                    <td class="py-3 text-gray-900">{item.description || '—'}</td>
                    <td class="py-3 text-right text-gray-600">{item.quantity}</td>
                    <td class="py-3 text-right text-gray-600">{formatCurrency(item.unitPrice)}</td>
                    <td class="py-3 text-right text-gray-900">{formatCurrency(item.quantity * item.unitPrice)}</td>
                  </tr>
{/each}
              </tbody>
            </table>

            <div class="flex justify-end">
              <div class="w-64">
                <div class="flex justify-between py-2"><span class="text-gray-600">{t('invoice.subtotal')}</span><span>{formatCurrency(subtotal)}</span></div>
                {#if taxRate > 0}
<div class="flex justify-between py-2"><span class="text-gray-600">{t('invoice.tax')} ({taxRate}%)</span><span>{formatCurrency(taxAmount)}</span></div>
{/if}
                <div class="flex justify-between py-3 border-t-2 border-gray-900 font-bold text-lg"><span>{t('invoice.total')}</span><span>{formatCurrency(total)}</span></div>
              </div>
            </div>

            {#if notes}
<div class="mt-8 pt-4 border-t border-gray-200"><p class="text-sm text-gray-600">{notes}</p></div>
{/if}
          </div>
        </div>
      </div>
    </div>
  
