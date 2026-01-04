'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { saveAs } from 'file-saver';

interface PageInfo {
  pageNum: number;
  thumbnail: string;
  rotation: number;
}

export default function PdfRotator() {
  const t = useTranslations('tools');
  
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [globalRotation, setGlobalRotation] = useState<number>(90);

  // Initialize PDF.js worker on client side only
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }, []);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError(t('pdfRotator.invalidFileType'));
      return;
    }
    setLoading(true);
    setError('');
    setPdfFile(file);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageInfos: PageInfo[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const scale = 0.3;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        pageInfos.push({ pageNum: i, thumbnail: canvas.toDataURL('image/png'), rotation: 0 });
      }

      setPages(pageInfos);
    } catch {
      setError(t('pdfRotator.parseError'));
    } finally {
      setLoading(false);
    }
    e.target.value = '';
  }, [t]);

  const rotatePage = (pageNum: number, angle: number) => {
    setPages(prev => prev.map(p => 
      p.pageNum === pageNum ? { ...p, rotation: (p.rotation + angle + 360) % 360 } : p
    ));
  };

  const rotateAll = (angle: number) => {
    setPages(prev => prev.map(p => ({ ...p, rotation: (p.rotation + angle + 360) % 360 })));
  };

  const resetAll = () => {
    setPages(prev => prev.map(p => ({ ...p, rotation: 0 })));
  };

  const handleSave = async () => {
    if (!pdfFile) return;
    setLoading(true);
    setError('');

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pdfPages = pdfDoc.getPages();

      pages.forEach((pageInfo, index) => {
        if (pageInfo.rotation !== 0) {
          const page = pdfPages[index];
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + pageInfo.rotation));
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      saveAs(blob, pdfFile.name.replace('.pdf', '_rotated.pdf'));
    } catch {
      setError(t('pdfRotator.saveError'));
    } finally {
      setLoading(false);
    }
  };


  const hasChanges = pages.some(p => p.rotation !== 0);

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" id="pdf-rotate-upload" />
        <label htmlFor="pdf-rotate-upload" className="cursor-pointer flex flex-col items-center">
          <span className="text-4xl mb-2">🔄</span>
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">{t('pdfRotator.uploadPdf')}</span>
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{t('pdfRotator.processing')}</p>
        </div>
      )}

      {pages.length > 0 && !loading && (
        <>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('pdfRotator.rotateAll')}:</span>
              <select value={globalRotation} onChange={e => setGlobalRotation(Number(e.target.value))} className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800">
                <option value={90}>90°</option>
                <option value={180}>180°</option>
                <option value={270}>270°</option>
              </select>
              <button onClick={() => rotateAll(globalRotation)} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">{t('pdfRotator.apply')}</button>
            </div>
            <button onClick={resetAll} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">{t('pdfRotator.reset')}</button>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {pages.map(page => (
              <div key={page.pageNum} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="relative bg-gray-100 dark:bg-gray-800 p-2">
                  <img src={page.thumbnail} alt={`Page ${page.pageNum}`} className="w-full transition-transform" style={{ transform: `rotate(${page.rotation}deg)` }} />
                  {page.rotation !== 0 && (
                    <span className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1 rounded">{page.rotation}°</span>
                  )}
                </div>
                <div className="flex items-center justify-between p-1 bg-gray-50 dark:bg-gray-800">
                  <span className="text-xs">{page.pageNum}</span>
                  <div className="flex gap-1">
                    <button onClick={() => rotatePage(page.pageNum, -90)} className="p-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-700 rounded">↺</button>
                    <button onClick={() => rotatePage(page.pageNum, 90)} className="p-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-700 rounded">↻</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleSave} disabled={!hasChanges || loading} className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
            {t('pdfRotator.save')}
          </button>
        </>
      )}
    </div>
  );
}
