'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$' }, { code: 'EUR', symbol: '€' }, { code: 'GBP', symbol: '£' },
  { code: 'CNY', symbol: '¥' }, { code: 'JPY', symbol: '¥' }, { code: 'KRW', symbol: '₩' },
];

export default function InvoiceGenerator() {
  const t = useTranslations('tools');
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState(0);
  
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [notes, setNotes] = useState('');
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0 }
  ]);

  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  };

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const canvas = await html2canvas(invoiceRef.current, { scale: 2, backgroundColor: '#ffffff' } as Parameters<typeof html2canvas>[1]);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoiceNumber}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.invoiceNumber')}</label>
              <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.currency')}</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.invoiceDate')}</label>
              <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.dueDate')}</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.from')}</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder={t('invoice.companyName')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 mb-2" />
              <textarea value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} placeholder={t('invoice.address')} rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.to')}</label>
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder={t('invoice.clientName')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 mb-2" />
              <textarea value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder={t('invoice.address')} rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
          </div>

          {/* Items */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">{t('invoice.items')}</h3>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                  <input type="text" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder={t('invoice.description')} className="col-span-5 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm" />
                  <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    placeholder={t('invoice.quantity')} className="col-span-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm" />
                  <input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    placeholder={t('invoice.unitPrice')} className="col-span-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm" />
                  <span className="col-span-1 text-sm text-gray-600 dark:text-gray-400 text-right">{formatCurrency(item.quantity * item.unitPrice)}</span>
                  <button onClick={() => removeItem(item.id)} disabled={items.length === 1} className="col-span-1 text-red-500 hover:text-red-700 disabled:opacity-30">×</button>
                </div>
              ))}
            </div>
            <button onClick={addItem} className="mt-3 text-sm text-blue-600 hover:text-blue-800">{t('invoice.addItem')}</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.taxRate')} (%)</label>
              <input type="number" min="0" max="100" step="0.1" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('invoice.notes')}</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
          </div>

          <button onClick={downloadPDF} className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            {t('invoice.downloadPdf')}
          </button>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div ref={invoiceRef} className="p-8 bg-white text-gray-900" style={{ minHeight: '600px' }}>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('invoice.invoice')}</h1>
                <p className="text-gray-600 mt-1">#{invoiceNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{t('invoice.invoiceDate')}: {invoiceDate}</p>
                <p className="text-sm text-gray-600">{t('invoice.dueDate')}: {dueDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">{t('invoice.from')}</h3>
                <p className="font-medium text-gray-900">{companyName || '—'}</p>
                <p className="text-sm text-gray-600 whitespace-pre-line">{companyAddress}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">{t('invoice.to')}</h3>
                <p className="font-medium text-gray-900">{clientName || '—'}</p>
                <p className="text-sm text-gray-600 whitespace-pre-line">{clientAddress}</p>
              </div>
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 text-sm font-semibold text-gray-600">{t('invoice.description')}</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-600">{t('invoice.quantity')}</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-600">{t('invoice.unitPrice')}</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-600">{t('invoice.amount')}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 text-gray-900">{item.description || '—'}</td>
                    <td className="py-3 text-right text-gray-600">{item.quantity}</td>
                    <td className="py-3 text-right text-gray-600">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3 text-right text-gray-900">{formatCurrency(item.quantity * item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2"><span className="text-gray-600">{t('invoice.subtotal')}</span><span>{formatCurrency(subtotal)}</span></div>
                {taxRate > 0 && <div className="flex justify-between py-2"><span className="text-gray-600">{t('invoice.tax')} ({taxRate}%)</span><span>{formatCurrency(taxAmount)}</span></div>}
                <div className="flex justify-between py-3 border-t-2 border-gray-900 font-bold text-lg"><span>{t('invoice.total')}</span><span>{formatCurrency(total)}</span></div>
              </div>
            </div>

            {notes && <div className="mt-8 pt-4 border-t border-gray-200"><p className="text-sm text-gray-600">{notes}</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
