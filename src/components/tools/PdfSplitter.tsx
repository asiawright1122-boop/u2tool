'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface PageInfo {
  pageNum: number;
  thumbnail: string;
  selected: boolean;
}

export default function PdfSplitter() {
  const t = useTranslations('tools');
  
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [splitMode, setSplitMode] = useState<'selected' | 'range' | 'each'>('selected');
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(1);
  const [fileName, setFileName] = useState<string>('');

  // Initialize PDF.js worker on client side only
  useEffect(() => {
    import('pdfjs-dist').then((pdfjsLib) => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    });
  }, []);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError(t('pdfSplitter.invalidFileType'));
      return;
    }
    setLoading(true);
    setError('');
    setPdfFile(file);
    setFileName(file.name.replace('.pdf', ''));

    try {
      const pdfjsLib = await import('pdfjs-dist');
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
        pageInfos.push({ pageNum: i, thumbnail: canvas.toDataURL('image/png'), selected: false });
      }

      setPages(pageInfos);
      setRangeEnd(pdf.numPages);
    } catch {
      setError(t('pdfSplitter.parseError'));
    } finally {
      setLoading(false);
    }
    e.target.value = '';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePage = (pageNum: number) => {
    setPages(prev => prev.map(p => p.pageNum === pageNum ? { ...p, selected: !p.selected } : p));
  };

  const selectAll = () => setPages(prev => prev.map(p => ({ ...p, selected: true })));
  const deselectAll = () => setPages(prev => prev.map(p => ({ ...p, selected: false })));

  const handleSplit = async () => {
    if (!pdfFile) return;
    setLoading(true);
    setError('');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const arrayBuffer = await pdfFile.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = srcDoc.getPageCount();

      let pagesToExtract: number[] = [];

      if (splitMode === 'selected') {
        pagesToExtract = pages.filter(p => p.selected).map(p => p.pageNum);
        if (pagesToExtract.length === 0) {
          setError(t('pdfSplitter.noPagesSelected'));
          setLoading(false);
          return;
        }
      } else if (splitMode === 'range') {
        for (let i = rangeStart; i <= Math.min(rangeEnd, totalPages); i++) {
          pagesToExtract.push(i);
        }
      } else {
        pagesToExtract = Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      if (splitMode === 'each') {
        const zip = new JSZip();
        for (const pageNum of pagesToExtract) {
          const newDoc = await PDFDocument.create();
          const [page] = await newDoc.copyPages(srcDoc, [pageNum - 1]);
          newDoc.addPage(page);
          const pdfBytes = await newDoc.save();
          zip.file(`${fileName}_page${pageNum}.pdf`, pdfBytes);
        }
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `${fileName}_split.zip`);
      } else {
        const newDoc = await PDFDocument.create();
        for (const pageNum of pagesToExtract) {
          const [page] = await newDoc.copyPages(srcDoc, [pageNum - 1]);
          newDoc.addPage(page);
        }
        const pdfBytes = await newDoc.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
        saveAs(blob, `${fileName}_split.pdf`);
      }
    } catch {
      setError(t('pdfSplitter.splitError'));
    } finally {
      setLoading(false);
    }
  };

  const selectedCount = pages.filter(p => p.selected).length;

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" id="pdf-split-upload" />
        <label htmlFor="pdf-split-upload" className="cursor-pointer flex flex-col items-center">
          <span className="text-4xl mb-2">✂️</span>
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">{t('pdfSplitter.uploadPdf')}</span>
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
          <p className="mt-2 text-gray-600 dark:text-gray-400">{t('pdfSplitter.processing')}</p>
        </div>
      )}

      {pages.length > 0 && !loading && (
        <>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pdfSplitter.splitMode')}</label>
              <select value={splitMode} onChange={e => setSplitMode(e.target.value as 'selected' | 'range' | 'each')} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                <option value="selected">{t('pdfSplitter.selectedPages')}</option>
                <option value="range">{t('pdfSplitter.pageRange')}</option>
                <option value="each">{t('pdfSplitter.eachPage')}</option>
              </select>
            </div>
            {splitMode === 'range' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pdfSplitter.from')}</label>
                  <input type="number" value={rangeStart} onChange={e => setRangeStart(Number(e.target.value))} min={1} max={pages.length} className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pdfSplitter.to')}</label>
                  <input type="number" value={rangeEnd} onChange={e => setRangeEnd(Number(e.target.value))} min={1} max={pages.length} className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
                </div>
              </>
            )}
          </div>

          {splitMode === 'selected' && (
            <>
              <div className="flex gap-2">
                <button onClick={selectAll} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">{t('pdfSplitter.selectAll')}</button>
                <button onClick={deselectAll} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">{t('pdfSplitter.deselectAll')}</button>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {pages.map(page => (
                  <div key={page.pageNum} onClick={() => togglePage(page.pageNum)} className={`cursor-pointer border-2 rounded overflow-hidden transition-all ${page.selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 dark:border-gray-700'}`}>
                    <img src={page.thumbnail} alt={`Page ${page.pageNum}`} className="w-full" />
                    <div className="text-center text-xs py-1 bg-gray-50 dark:bg-gray-800">{page.pageNum}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <button onClick={handleSplit} disabled={loading || (splitMode === 'selected' && selectedCount === 0)} className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
            {t('pdfSplitter.split')} {splitMode === 'selected' && `(${selectedCount} ${t('pdfSplitter.pages')})`}
          </button>
        </>
      )}
    </div>
  );
}
