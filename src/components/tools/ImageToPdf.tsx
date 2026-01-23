'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { saveAs } from 'file-saver';

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

export default function ImageToPdf() {
  const t = useTranslations('tools');
  
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<number>(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [outputFileName, setOutputFileName] = useState<string>('images');

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const newImages: ImageItem[] = [];

    Array.from(files).forEach(file => {
      if (!validTypes.includes(file.type)) {
        setError(t('imageToPdf.invalidFileType'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        newImages.push({ id: Date.now().toString() + Math.random(), file, preview: ev.target?.result as string });
        if (newImages.length === files.length) {
          setImages(prev => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeImage = (id: string) => setImages(prev => prev.filter(img => img.id !== id));

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    const newImages = [...images];
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setImages(newImages);
  };

  const handleConvert = async () => {
    if (images.length === 0) {
      setError(t('imageToPdf.noImages'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();
      
      const pageSizes: Record<string, [number, number]> = {
        a4: [595.28, 841.89],
        letter: [612, 792],
      };

      for (const img of images) {
        const imgBytes = await fetch(img.preview).then(r => r.arrayBuffer());
        let embeddedImg;
        
        if (img.file.type === 'image/png') {
          embeddedImg = await pdfDoc.embedPng(imgBytes);
        } else {
          embeddedImg = await pdfDoc.embedJpg(imgBytes);
        }

        let pageWidth: number, pageHeight: number;
        
        if (pageSize === 'fit') {
          pageWidth = embeddedImg.width + margin * 2;
          pageHeight = embeddedImg.height + margin * 2;
        } else {
          [pageWidth, pageHeight] = pageSizes[pageSize];
          if (orientation === 'landscape') {
            [pageWidth, pageHeight] = [pageHeight, pageWidth];
          }
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        const availableWidth = pageWidth - margin * 2;
        const availableHeight = pageHeight - margin * 2;
        
        const scale = Math.min(availableWidth / embeddedImg.width, availableHeight / embeddedImg.height);
        const scaledWidth = embeddedImg.width * scale;
        const scaledHeight = embeddedImg.height * scale;
        
        const x = (pageWidth - scaledWidth) / 2;
        const y = (pageHeight - scaledHeight) / 2;

        page.drawImage(embeddedImg, { x, y, width: scaledWidth, height: scaledHeight });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      saveAs(blob, `${outputFileName}.pdf`);
    } catch {
      setError(t('imageToPdf.convertError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" multiple onChange={handleFileUpload} className="hidden" id="image-upload" />
        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
          <span className="text-4xl mb-2">📄</span>
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">{t('imageToPdf.uploadImages')}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('imageToPdf.supportedFormats')}</span>
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('imageToPdf.pageSize')}</label>
              <select value={pageSize} onChange={e => setPageSize(e.target.value as 'a4' | 'letter' | 'fit')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="fit">{t('imageToPdf.fitToImage')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('imageToPdf.orientation')}</label>
              <select value={orientation} onChange={e => setOrientation(e.target.value as 'portrait' | 'landscape')} disabled={pageSize === 'fit'} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 disabled:opacity-50">
                <option value="portrait">{t('imageToPdf.portrait')}</option>
                <option value="landscape">{t('imageToPdf.landscape')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('imageToPdf.margin')}</label>
              <input type="number" value={margin} onChange={e => setMargin(Number(e.target.value))} min={0} max={100} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('imageToPdf.fileName')}</label>
              <input type="text" value={outputFileName} onChange={e => setOutputFileName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('imageToPdf.imageList')} ({images.length})</h3>
            {images.map((img, index) => (
              <div key={img.id} className="flex items-center gap-3 p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                <img src={img.preview} alt="" className="w-16 h-16 object-cover rounded" />
                <span className="flex-1 truncate text-sm">{img.file.name}</span>
                <div className="flex gap-1">
                  <button onClick={() => moveImage(index, 'up')} disabled={index === 0} className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30">↑</button>
                  <button onClick={() => moveImage(index, 'down')} disabled={index === images.length - 1} className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30">↓</button>
                  <button onClick={() => removeImage(img.id)} className="p-1 text-red-500 hover:text-red-700">✕</button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleConvert} disabled={loading} className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
            {loading ? t('imageToPdf.converting') : t('imageToPdf.convert')}
          </button>
        </>
      )}
    </div>
  );
}
