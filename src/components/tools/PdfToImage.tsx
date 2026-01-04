'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface PagePreview {
  pageNum: number;
  dataUrl: string;
  selected: boolean;
}

export default function PdfToImage() {
  const t = useTranslations('tools');
  
  const [pages, setPages] = useState<PagePreview[]>([]);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [dpi, setDpi] = useState<number>(150);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  // Initialize PDF.js worker on client side only
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }, []);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError(t('pdfToImage.invalidFileType'));
      return;
    }

    setLoading(true);
    setError('');
    setFileName(file.name.replace('.pdf', ''));

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const previews: PagePreview[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const scale = 0.5;
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        previews.push({ pageNum: i, dataUrl: canvas.toDataURL('image/png'), selected: true });
      }

      setPages(previews);
    } catch {
      setError(t('pdfToImage.parseError'));
    } finally {
      setLoading(false);
    }
    e.target.value = '';
  }, [t]);

  const togglePage = (pageNum: number) => {
    setPages(prev => prev.map(p => p.pageNum === pageNum ? { ...p, selected: !p.selected } : p));
  };

  const selectAll = () => setPages(prev => prev.map(p => ({ ...p, selected: true })));
  const deselectAll = () => setPages(prev => prev.map(p => ({ ...p, selected: false })));

  const handleConvert = async () => {
    const selectedPages = pages.filter(p => p.selected);
    if (selectedPages.length === 0) {
      setError(t('pdfToImage.noPagesSelected'));
      return;
    }

    setLoading(true);
    try {
      const file = document.querySelector<HTMLInputElement>('#pdf-upload')?.files?.[0];
      if (!file) return;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const scale = dpi / 72;

      if (selectedPages.length === 1) {
        const page = await pdf.getPage(selectedPages[0].pageNum);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        
        canvas.toBlob(blob => {
          if (blob) saveAs(blob, `${fileName}_page${selectedPages[0].pageNum}.${format}`);
        }, `image/${format}`, format === 'jpeg' ? 0.92 : undefined);
      } else {
        const zip = new JSZip();
        for (const sp of selectedPages) {
          const page = await pdf.getPage(sp.pageNum);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d')!;
          await page.render({ canvasContext: ctx, viewport, canvas }).promise;
          
          const dataUrl = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.92 : undefined);
          const base64 = dataUrl.split(',')[1];
          zip.file(`${fileName}_page${sp.pageNum}.${format}`, base64, { base64: true });
        }
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `${fileName}_images.zip`);
      }
    } catch {
      setError(t('pdfToImage.convertError'));
    } finally {
      setLoading(false);
    }
  };

  const selectedCount = pages.filter(p => p.selected).length;

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" id="pdf-upload" />
        <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
          <span className="text-4xl mb-2">🖼️</span>
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">{t('pdfToImage.uploadPdf')}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('pdfToImage.selectPdf')}</span>
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
          <p className="mt-2 text-gray-600 dark:text-gray-400">{t('pdfToImage.processing')}</p>
        </div>
      )}

      {pages.length > 0 && !loading && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pdfToImage.format')}</label>
              <select value={format} onChange={e => setFormat(e.target.value as 'png' | 'jpeg')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pdfToImage.dpi')}</label>
              <select value={dpi} onChange={e => setDpi(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                <option value={72}>72 DPI</option>
                <option value={150}>150 DPI</option>
                <option value={300}>300 DPI</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={selectAll} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">{t('pdfToImage.selectAll')}</button>
            <button onClick={deselectAll} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">{t('pdfToImage.deselectAll')}</button>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {pages.map(page => (
              <div key={page.pageNum} onClick={() => togglePage(page.pageNum)} className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${page.selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 dark:border-gray-700'}`}>
                <img src={page.dataUrl} alt={`Page ${page.pageNum}`} className="w-full" />
                <div className="text-center text-xs py-1 bg-gray-50 dark:bg-gray-800">{page.pageNum}</div>
              </div>
            ))}
          </div>

          <button onClick={handleConvert} disabled={selectedCount === 0 || loading} className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
            {t('pdfToImage.convert')} ({selectedCount} {t('pdfToImage.pages')})
          </button>
        </>
      )}
    </div>
  );
}
