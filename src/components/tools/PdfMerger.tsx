'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

interface PdfItem {
  id: string;
  file: File;
  name: string;
  pageCount: number;
}

export default function PdfMerger() {
  const t = useTranslations('tools');
  
  const [pdfs, setPdfs] = useState<PdfItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [outputFileName, setOutputFileName] = useState<string>('merged');

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setError('');
    const newPdfs: PdfItem[] = [];

    for (const file of Array.from(files)) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setError(t('pdfMerger.invalidFileType'));
        continue;
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        newPdfs.push({
          id: Date.now().toString() + Math.random(),
          file,
          name: file.name,
          pageCount: pdfDoc.getPageCount()
        });
      } catch {
        setError(t('pdfMerger.parseError'));
      }
    }

    setPdfs(prev => [...prev, ...newPdfs]);
    e.target.value = '';
  }, [t]);

  const removePdf = (id: string) => setPdfs(prev => prev.filter(p => p.id !== id));

  const movePdf = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= pdfs.length) return;
    const newPdfs = [...pdfs];
    [newPdfs[index], newPdfs[newIndex]] = [newPdfs[newIndex], newPdfs[index]];
    setPdfs(newPdfs);
  };

  const handleMerge = async () => {
    if (pdfs.length < 2) {
      setError(t('pdfMerger.needMoreFiles'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const mergedPdf = await PDFDocument.create();

      for (const pdf of pdfs) {
        const arrayBuffer = await pdf.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      saveAs(blob, `${outputFileName}.pdf`);
    } catch {
      setError(t('pdfMerger.mergeError'));
    } finally {
      setLoading(false);
    }
  };

  const totalPages = pdfs.reduce((sum, p) => sum + p.pageCount, 0);

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input type="file" accept=".pdf" multiple onChange={handleFileUpload} className="hidden" id="pdf-merger-upload" />
        <label htmlFor="pdf-merger-upload" className="cursor-pointer flex flex-col items-center">
          <span className="text-4xl mb-2">📎</span>
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">{t('pdfMerger.uploadPdfs')}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('pdfMerger.multipleFiles')}</span>
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {pdfs.length > 0 && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pdfMerger.outputFileName')}</label>
            <input type="text" value={outputFileName} onChange={e => setOutputFileName(e.target.value)} className="w-full md:w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('pdfMerger.fileList')} ({pdfs.length} {t('pdfMerger.files')}, {totalPages} {t('pdfMerger.totalPages')})
            </h3>
            {pdfs.map((pdf, index) => (
              <div key={pdf.id} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <span className="text-2xl">📄</span>
                <div className="flex-1">
                  <div className="font-medium text-sm truncate">{pdf.name}</div>
                  <div className="text-xs text-gray-500">{pdf.pageCount} {t('pdfMerger.pages')}</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => movePdf(index, 'up')} disabled={index === 0} className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30">↑</button>
                  <button onClick={() => movePdf(index, 'down')} disabled={index === pdfs.length - 1} className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30">↓</button>
                  <button onClick={() => removePdf(pdf.id)} className="p-1 text-red-500 hover:text-red-700">✕</button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleMerge} disabled={pdfs.length < 2 || loading} className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
            {loading ? t('pdfMerger.merging') : t('pdfMerger.merge')}
          </button>
        </>
      )}
    </div>
  );
}
