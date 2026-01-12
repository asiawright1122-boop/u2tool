'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function TextToPdf() {
  const t = useTranslations('tools.text-to-pdf');
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [fontSize, setFontSize] = useState(12);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const generatePdf = async () => {
    if (!text.trim()) return;
    setIsGenerating(true);

    try {
      // Dynamic import jsPDF
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: pageSize,
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      
      const currentFont = fontFamily === 'Arial' ? 'helvetica' : fontFamily === 'Times New Roman' ? 'times' : 'courier';
      doc.setFont(currentFont);
      doc.setFontSize(fontSize);

      // Add title if provided
      let yPosition = margin;
      if (title.trim()) {
        doc.setFontSize(fontSize + 4);
        doc.setFont(currentFont, 'bold');
        doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 10;
        doc.setFontSize(fontSize);
        doc.setFont(currentFont, 'normal');
      }

      // Split text into lines
      const lines = doc.splitTextToSize(text, maxWidth);
      const lineHeight = fontSize * 0.4;

      for (const line of lines) {
        if (yPosition + lineHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      }

      // Download
      const fileName = title.trim() ? `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf` : 'document.pdf';
      doc.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('title')} ({t('optional')})
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('titlePlaceholder')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('fontSize')}
            </label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {[10, 11, 12, 14, 16, 18, 20, 24].map(size => (
                <option key={size} value={size}>{size}pt</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('font')}
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times</option>
              <option value="Courier">Courier</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('pageSize')}
            </label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as 'a4' | 'letter')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('content')}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('contentPlaceholder')}
          className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
          style={{ fontSize: `${fontSize}px`, fontFamily }}
        />
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {text.length} {t('characters')}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={generatePdf}
          disabled={!text.trim() || isGenerating}
          className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <span className="animate-spin">⏳</span>
              {t('generating')}
            </>
          ) : (
            <>
              📄 {t('downloadPdf')}
            </>
          )}
        </button>
      </div>

      <div ref={previewRef} className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-inner">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{t('preview')}</h3>
        <div
          className="min-h-[200px] whitespace-pre-wrap text-gray-900 dark:text-white"
          style={{ fontSize: `${fontSize}px`, fontFamily }}
        >
          {title && <div className="text-center font-bold mb-4" style={{ fontSize: `${fontSize + 4}px` }}>{title}</div>}
          {text || <span className="text-gray-400">{t('previewPlaceholder')}</span>}
        </div>
      </div>
    </div>
  );
}
