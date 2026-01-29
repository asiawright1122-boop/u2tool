'use client';

import { useTranslations } from 'next-intl';
import { useState, useCallback, useMemo, useRef } from 'react';

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

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

export default function InvoiceTemplateGenerator() {
  const t = useTranslations('tools.invoice-template-generator');
  const tCommon = useTranslations('tools');
  const [invoice, setInvoice] = useState<InvoiceData>({
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

  const previewRef = useRef<HTMLDivElement>(null);

  const updateInvoice = useCallback(<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    setInvoice(prev => ({ ...prev, [key]: value }));
  }, []);

  const addItem = useCallback(() => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }],
    }));
  }, []);

  const updateItem = useCallback((id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item),
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  }, []);

  const currencySymbol = useMemo(() => {
    return CURRENCIES.find(c => c.code === invoice.currency)?.symbol || '$';
  }, [invoice.currency]);

  const calculations = useMemo(() => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const tax = subtotal * (invoice.taxRate / 100);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [invoice.items, invoice.taxRate]);

  const formatCurrency = useCallback((amount: number) => {
    return `${currencySymbol}${amount.toFixed(2)}`;
  }, [currencySymbol]);

  const downloadHTML = useCallback(() => {
    if (!previewRef.current) return;
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Invoice ${invoice.invoiceNumber}</title><style>body{font-family:system-ui,-apple-system,sans-serif;margin:0;padding:40px;background:#fff}${previewRef.current.querySelector('style')?.textContent || ''}</style></head><body>${previewRef.current.innerHTML}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoice.invoiceNumber}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [invoice.invoiceNumber]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex gap-2 mb-4">
          {(['modern', 'classic', 'minimal'] as const).map(tmpl => (
            <button
              key={tmpl}
              onClick={() => updateInvoice('template', tmpl)}
              className={`px-4 py-2 rounded-lg capitalize ${
                invoice.template === tmpl
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t(tmpl)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('invoiceNumber')}</label>
            <input
              type="text"
              value={invoice.invoiceNumber}
              onChange={(e) => updateInvoice('invoiceNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('currency')}</label>
            <select
              value={invoice.currency}
              onChange={(e) => updateInvoice('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('invoiceDate')}</label>
            <input
              type="date"
              value={invoice.date}
              onChange={(e) => updateInvoice('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('dueDate')}</label>
            <input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => updateInvoice('dueDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 className="font-medium mb-3">{t('yourCompany')}</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={invoice.companyName}
              onChange={(e) => updateInvoice('companyName', e.target.value)}
              placeholder={t("companyNamePlaceholder")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <input
              type="text"
              value={invoice.companyAddress}
              onChange={(e) => updateInvoice('companyAddress', e.target.value)}
              placeholder={t("addressPlaceholder")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="email"
                value={invoice.companyEmail}
                onChange={(e) => updateInvoice('companyEmail', e.target.value)}
                placeholder={t("emailPlaceholder")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                type="tel"
                value={invoice.companyPhone}
                onChange={(e) => updateInvoice('companyPhone', e.target.value)}
                placeholder={t("phonePlaceholder")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 className="font-medium mb-3">{t('billTo')}</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={invoice.clientName}
              onChange={(e) => updateInvoice('clientName', e.target.value)}
              placeholder={t("clientNamePlaceholder")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <input
              type="text"
              value={invoice.clientAddress}
              onChange={(e) => updateInvoice('clientAddress', e.target.value)}
              placeholder={t("clientAddressPlaceholder")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <input
              type="email"
              value={invoice.clientEmail}
              onChange={(e) => updateInvoice('clientEmail', e.target.value)}
              placeholder={t("clientEmailPlaceholder")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{t('items')}</h3>
            <button onClick={addItem} className="text-sm text-blue-600 hover:text-blue-700">{t('addItem')}</button>
          </div>
          <div className="space-y-2">
            {invoice.items.map(item => (
              <div key={item.id} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  placeholder={t("descriptionPlaceholder")}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  min="0"
                />
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  min="0"
                  step="0.01"
                />
                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 px-2">×</button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('taxRate')}</label>
            <input
              type="number"
              value={invoice.taxRate}
              onChange={(e) => updateInvoice('taxRate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('notes')}</label>
            <input
              type="text"
              value={invoice.notes}
              onChange={(e) => updateInvoice('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <button
          onClick={downloadHTML}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {t('downloadInvoice')}
        </button>
      </div>

      <div ref={previewRef} className="bg-white p-8 rounded-lg shadow-lg overflow-auto max-h-[800px]">
        <style>{`
          .invoice-modern { font-family: system-ui, -apple-system, sans-serif; }
          .invoice-classic { font-family: Georgia, serif; }
          .invoice-minimal { font-family: 'Helvetica Neue', sans-serif; }
        `}</style>
        <div className={`invoice-${invoice.template}`}>
          {invoice.template === 'modern' && (
            <div className="border-l-4 border-blue-600 pl-4 mb-6">
              <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
              <p className="text-gray-500">#{invoice.invoiceNumber}</p>
            </div>
          )}
          {invoice.template === 'classic' && (
            <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
              <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
              <p className="text-gray-600">No. {invoice.invoiceNumber}</p>
            </div>
          )}
          {invoice.template === 'minimal' && (
            <div className="mb-6">
              <h1 className="text-2xl font-light text-gray-900 tracking-wide">INVOICE</h1>
              <p className="text-sm text-gray-400">{invoice.invoiceNumber}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">From</p>
              <p className="font-semibold text-gray-900">{invoice.companyName}</p>
              <p className="text-sm text-gray-600">{invoice.companyAddress}</p>
              <p className="text-sm text-gray-600">{invoice.companyEmail}</p>
              <p className="text-sm text-gray-600">{invoice.companyPhone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Bill To</p>
              <p className="font-semibold text-gray-900">{invoice.clientName}</p>
              <p className="text-sm text-gray-600">{invoice.clientAddress}</p>
              <p className="text-sm text-gray-600">{invoice.clientEmail}</p>
            </div>
          </div>

          <div className="flex gap-8 mb-8 text-sm">
            <div>
              <p className="text-gray-500">Invoice Date</p>
              <p className="font-medium text-gray-900">{invoice.date}</p>
            </div>
            <div>
              <p className="text-gray-500">Due Date</p>
              <p className="font-medium text-gray-900">{invoice.dueDate}</p>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-sm text-gray-500">Description</th>
                <th className="text-right py-2 text-sm text-gray-500">Qty</th>
                <th className="text-right py-2 text-sm text-gray-500">Price</th>
                <th className="text-right py-2 text-sm text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map(item => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3 text-gray-900">{item.description || 'Item'}</td>
                  <td className="py-3 text-right text-gray-600">{item.quantity}</td>
                  <td className="py-3 text-right text-gray-600">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-3 text-right text-gray-900 font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2 text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">{formatCurrency(calculations.subtotal)}</span>
              </div>
              <div className="flex justify-between py-2 text-sm border-b border-gray-200">
                <span className="text-gray-500">Tax ({invoice.taxRate}%)</span>
                <span className="text-gray-900">{formatCurrency(calculations.tax)}</span>
              </div>
              <div className="flex justify-between py-3 text-lg font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-blue-600">{formatCurrency(calculations.total)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-8 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
