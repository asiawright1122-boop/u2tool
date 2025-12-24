'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import QRCode from 'qrcode';

export default function QrGenerator() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('https://example.com');
  const [qrDataUrl, setQrDataUrl] = useState('');

  const generateQR = async () => {
    if (!input.trim()) return;
    
    try {
      // 生成二维码，设置颜色为黑色前景和白色背景
      const dataUrl = await QRCode.toDataURL(input, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrDataUrl(dataUrl);
    } catch (_err) {
      console.error('Error generating QR code:', err);
    }
  };

  useEffect(() => {
    generateQR();
  }, []);

  const downloadQR = () => {
    if (!qrDataUrl) return;
    
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">{t('input')}</label>
        <textarea
          className="tool-textarea h-24"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('inputPlaceholder')}
        />
      </div>

      <div className="flex gap-2">
        <button onClick={generateQR} className="btn-primary">
          {t('qr.generateQr')}
        </button>
        {qrDataUrl && (
          <button onClick={downloadQR} className="btn-secondary">
            {t('qr.downloadPng')}
          </button>
        )}
      </div>

      {qrDataUrl && (
        <div className="flex justify-center p-4 bg-gray-800 rounded-lg">
          <img src={qrDataUrl} alt="QR Code" className="max-w-[300px]" />
        </div>
      )}
    </div>
  );
}
