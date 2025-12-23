'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function HtmlPreview() {
  const t = useTranslations('tools.htmlPreview');
  const [html, setHtml] = useState(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #3b82f6; }
    .box { background: #f0f0f0; padding: 15px; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>Hello World!</h1>
  <div class="box">
    <p>This is a preview of your HTML code.</p>
  </div>
</body>
</html>`);

  const [previewKey, setPreviewKey] = useState(0);

  const refreshPreview = () => {
    setPreviewKey(prev => prev + 1);
  };

  const clearAll = () => {
    setHtml('');
    setPreviewKey(prev => prev + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        <button
          onClick={refreshPreview}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          {t('refresh')}
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {t('clear')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-2">{t('htmlCode')}</label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="w-full h-96 bg-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder={t('placeholder')}
            spellCheck={false}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">{t('preview')}</label>
          <div className="w-full h-96 bg-gray-800 rounded-lg overflow-hidden">
            <iframe
              key={previewKey}
              srcDoc={html}
              className="w-full h-full border-0"
              sandbox="allow-scripts"
              title="HTML Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
