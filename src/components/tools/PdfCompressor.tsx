'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { saveAs } from 'file-saver';

export default function PdfCompressor() {
  const t = useTranslations('tools');
  
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    if (!uploadedFile.name.toLowerCase().endsWith('.pdf')) {
      setError(t('pdfCompressor.invalidFileType'));
      return;
    }
    setFile(uploadedFile);
    setOriginalSize(uploadedFile.size);
    setCompressedSize(0);
    setCompressedBlob(null);
    setError('');
    e.target.value = '';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // PDF compression options based on level
      const options: { useObjectStreams?: boolean } = {};
      if (compressionLevel === 'high') {
        options.useObjectStreams = true;
      }

      const pdfBytes = await pdfDoc.save(options);
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      
      setCompressedSize(blob.size);
      setCompressedBlob(blob);
    } catch {
      setError(t('pdfCompressor.compressError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (compressedBlob && file) {
      saveAs(compressedBlob, file.name.replace('.pdf', '_compressed.pdf'));
    }
  };

  const compressionRatio = originalSize > 0 && compressedSize > 0 
    ? ((1 - compressedSize / originalSize) * 100).toFixed(1) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" id="pdf-compress-upload" />
        <label htmlFor="pdf-compress-upload" className="cursor-pointer flex flex-col items-center">
          <span className="text-4xl mb-2">📦</span>
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">{t('pdfCompressor.uploadPdf')}</span>
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {file && (
        <>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📄</span>
              <div className="flex-1">
                <div className="font-medium">{file.name}</div>
                <div className="text-sm text-gray-500">{t('pdfCompressor.originalSize')}: {formatSize(originalSize)}</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('pdfCompressor.compressionLevel')}</label>
            <div className="flex gap-4">
              {(['low', 'medium', 'high'] as const).map(level => (
                <label key={level} className="flex items-center">
                  <input type="radio" value={level} checked={compressionLevel === level} onChange={() => setCompressionLevel(level)} className="mr-2" />
                  {t(`pdfCompressor.${level}`)}
                </label>
              ))}
            </div>
          </div>

          <button onClick={handleCompress} disabled={loading} className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
            {loading ? t('pdfCompressor.compressing') : t('pdfCompressor.compress')}
          </button>

          {compressedSize > 0 && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-green-700 dark:text-green-400">{t('pdfCompressor.compressionComplete')}</span>
                <span className="text-green-600 dark:text-green-400">{compressionRatio}% {t('pdfCompressor.reduced')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                <span>{t('pdfCompressor.originalSize')}: {formatSize(originalSize)}</span>
                <span>{t('pdfCompressor.compressedSize')}: {formatSize(compressedSize)}</span>
              </div>
              <button onClick={handleDownload} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                {t('pdfCompressor.download')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
