'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const ICO_SIZES = [16, 32, 48, 64, 128, 256];

export default function ImageToIco() {
  const t = useTranslations('tools.image-to-ico');
  const tg = useTranslations('tools');
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([16, 32, 48]);
  const [previews, setPreviews] = useState<{ size: number; dataUrl: string }[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setImage(event.target?.result as string);
        generatePreviews(img);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const generatePreviews = (img: HTMLImageElement) => {
    const newPreviews = ICO_SIZES.map((size) => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, size, size);
      }
      return { size, dataUrl: canvas.toDataURL('image/png') };
    });
    setPreviews(newPreviews);
  };

  const toggleSize = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size].sort((a, b) => a - b)
    );
  };

  const downloadIco = async () => {
    if (!originalImage || selectedSizes.length === 0) return;

    // Generate ICO file
    const images: { size: number; data: Uint8Array }[] = [];

    for (const size of selectedSizes) {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      ctx.drawImage(originalImage, 0, 0, size, size);

      // Get PNG data
      const dataUrl = canvas.toDataURL('image/png');
      const base64 = dataUrl.split(',')[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      images.push({ size, data: bytes });
    }

    // Build ICO file
    const iconDir = new ArrayBuffer(6 + images.length * 16);
    const iconDirView = new DataView(iconDir);

    // ICONDIR header
    iconDirView.setUint16(0, 0, true); // Reserved
    iconDirView.setUint16(2, 1, true); // Type (1 = ICO)
    iconDirView.setUint16(4, images.length, true); // Number of images

    let dataOffset = 6 + images.length * 16;
    const imageDataParts: Uint8Array[] = [];

    images.forEach((img, index) => {
      const offset = 6 + index * 16;
      iconDirView.setUint8(offset, img.size < 256 ? img.size : 0); // Width
      iconDirView.setUint8(offset + 1, img.size < 256 ? img.size : 0); // Height
      iconDirView.setUint8(offset + 2, 0); // Color palette
      iconDirView.setUint8(offset + 3, 0); // Reserved
      iconDirView.setUint16(offset + 4, 1, true); // Color planes
      iconDirView.setUint16(offset + 6, 32, true); // Bits per pixel
      iconDirView.setUint32(offset + 8, img.data.length, true); // Image size
      iconDirView.setUint32(offset + 12, dataOffset, true); // Image offset

      dataOffset += img.data.length;
      imageDataParts.push(img.data);
    });

    // Combine all parts
    const totalSize = 6 + images.length * 16 + imageDataParts.reduce((sum, p) => sum + p.length, 0);
    const icoData = new Uint8Array(totalSize);
    icoData.set(new Uint8Array(iconDir), 0);

    let currentOffset = 6 + images.length * 16;
    imageDataParts.forEach((part) => {
      icoData.set(part, currentOffset);
      currentOffset += part.length;
    });

    // Download
    const blob = new Blob([icoData], { type: 'image/x-icon' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'favicon.ico';
    link.click();
  };

  const downloadPng = (size: number) => {
    const preview = previews.find((p) => p.size === size);
    if (!preview) return;
    const link = document.createElement('a');
    link.href = preview.dataUrl;
    link.download = `icon-${size}x${size}.png`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      {!image ? (
        <label className="block border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
        </label>
      ) : (
        <div className="space-y-6">
          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('selectSizes')}</label>
            <div className="flex flex-wrap gap-2">
              {ICO_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedSizes.includes(size)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {size}×{size}
                </button>
              ))}
            </div>
          </div>

          {/* Previews */}
          <div>
            <h3 className="text-sm font-medium mb-2">{t('preview')}</h3>
            <div className="flex flex-wrap gap-4 items-end">
              {previews.map((preview) => (
                <div
                  key={preview.size}
                  className={`text-center p-2 rounded-lg ${
                    selectedSizes.includes(preview.size)
                      ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <img
                    src={preview.dataUrl}
                    alt={`${preview.size}x${preview.size}`}
                    className="mx-auto border border-gray-300 dark:border-gray-600"
                    style={{ width: preview.size, height: preview.size, imageRendering: 'pixelated' }}
                  />
                  <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">{preview.size}px</p>
                  <button
                    onClick={() => downloadPng(preview.size)}
                    className="text-xs text-blue-600 hover:underline mt-1"
                  >
                    PNG
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={downloadIco}
              disabled={selectedSizes.length === 0}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg"
            >
              {t('downloadIco')} ({selectedSizes.length} {t('sizes')})
            </button>
            <button
              onClick={() => { setImage(null); setPreviews([]); }}
              className="btn-secondary"
            >
              {tg('clear')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
