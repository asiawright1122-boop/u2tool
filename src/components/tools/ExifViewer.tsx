'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface ExifData {
  [key: string]: string | number | undefined;
}

export default function ExifViewer() {
  const t = useTranslations('tools.exif-viewer');
  const tg = useTranslations('tools');
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cleanedImage, setCleanedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setFileName(file.name);
    setImage(URL.createObjectURL(file));
    setCleanedImage(null);

    try {
      const ExifReader = await import('exifreader');
      const tags = await ExifReader.load(file);

      const extractedData: ExifData = {};

      // Common EXIF fields
      const fields = [
        'Make', 'Model', 'DateTime', 'DateTimeOriginal',
        'ExposureTime', 'FNumber', 'ISOSpeedRatings', 'FocalLength',
        'Flash', 'WhiteBalance', 'ExposureProgram', 'MeteringMode',
        'ImageWidth', 'ImageHeight', 'Orientation',
        'GPSLatitude', 'GPSLongitude', 'GPSAltitude',
        'Software', 'Artist', 'Copyright',
      ];

      fields.forEach((field) => {
        if (tags[field]) {
          extractedData[field] = tags[field].description || tags[field].value;
        }
      });

      // Also include any other tags
      Object.keys(tags).forEach((key) => {
        if (!fields.includes(key) && tags[key].description) {
          extractedData[key] = tags[key].description;
        }
      });

      setExifData(Object.keys(extractedData).length > 0 ? extractedData : null);
    } catch (error) {
      console.error('EXIF reading error:', error);
      setExifData(null);
    }

    setIsLoading(false);
  };

  const removeExif = () => {
    if (!image) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        setCleanedImage(canvas.toDataURL('image/jpeg', 0.95));
      }
    };
    img.src = image;
  };

  const downloadCleanedImage = () => {
    if (!cleanedImage) return;
    const link = document.createElement('a');
    link.href = cleanedImage;
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}_no_exif.jpg`;
    link.click();
  };

  const clearAll = () => {
    setImage(null);
    setFileName('');
    setExifData(null);
    setCleanedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFieldName = (name: string) => {
    return name.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      {!image ? (
        <label className="block border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/tiff"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="text-4xl mb-2">📷</div>
          <p className="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
          <p className="text-sm text-gray-500 mt-1">{t('supportedFormats')}</p>
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Preview */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{t('image')}</h3>
              <button onClick={clearAll} className="text-sm text-blue-600 hover:underline">
                {tg('clear')}
              </button>
            </div>
            <img
              src={cleanedImage || image}
              alt={fileName}
              className="max-w-full rounded-lg border border-gray-200 dark:border-gray-700"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">{fileName}</p>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={removeExif}
                disabled={!!cleanedImage}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg text-sm"
              >
                {t('removeExif')}
              </button>
              {cleanedImage && (
                <button
                  onClick={downloadCleanedImage}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                >
                  {t('downloadClean')}
                </button>
              )}
            </div>
            {cleanedImage && (
              <p className="text-sm text-green-600 dark:text-green-400">
                ✓ {t('exifRemoved')}
              </p>
            )}
          </div>

          {/* EXIF Data */}
          <div className="space-y-4">
            <h3 className="font-medium">{t('exifData')}</h3>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin text-2xl">⏳</div>
                <p className="text-gray-500 mt-2">{t('loading')}</p>
              </div>
            ) : exifData ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(exifData).map(([key, value]) => (
                      <tr key={key} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <td className="py-2 pr-4 font-medium text-gray-600 dark:text-gray-400">
                          {formatFieldName(key)}
                        </td>
                        <td className="py-2 text-gray-900 dark:text-white break-all">
                          {String(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-500">{t('noExifData')}</p>
              </div>
            )}

            {exifData && (
              <p className="text-sm text-gray-500">
                {t('fieldsFound')}: {Object.keys(exifData).length}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
