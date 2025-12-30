'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

export default function SitemapGenerator() {
  const t = useTranslations('tools.sitemap-generator');
  const [baseUrl, setBaseUrl] = useState('https://example.com');
  const [urls, setUrls] = useState<SitemapUrl[]>([
    { loc: '/', lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: '1.0' },
    { loc: '/about', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.8' },
    { loc: '/contact', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.5' },
  ]);
  const [output, setOutput] = useState('');

  const addUrl = () => {
    setUrls([...urls, {
      loc: '/new-page',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.5'
    }]);
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const updateUrl = (index: number, field: keyof SitemapUrl, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = { ...newUrls[index], [field]: value };
    setUrls(newUrls);
  };

  const generate = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    setOutput(xml);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('baseUrl')}</label>
        <input type="text" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)}
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
          placeholder="https://example.com" />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('urls')}</label>
          <button onClick={addUrl} className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm text-white">
            {t('addUrl')}
          </button>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {urls.map((url, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-2">
              <input type="text" value={url.loc} onChange={(e) => updateUrl(index, 'loc', e.target.value)}
                className="col-span-4 px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-gray-900 dark:text-white text-sm"
                placeholder="/path" />
              <input type="date" value={url.lastmod} onChange={(e) => updateUrl(index, 'lastmod', e.target.value)}
                className="col-span-2 px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-gray-900 dark:text-white text-sm" />
              <select value={url.changefreq} onChange={(e) => updateUrl(index, 'changefreq', e.target.value)}
                className="col-span-2 px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-gray-900 dark:text-white text-sm">
                <option value="always">always</option>
                <option value="hourly">hourly</option>
                <option value="daily">daily</option>
                <option value="weekly">weekly</option>
                <option value="monthly">monthly</option>
                <option value="yearly">yearly</option>
                <option value="never">never</option>
              </select>
              <select value={url.priority} onChange={(e) => updateUrl(index, 'priority', e.target.value)}
                className="col-span-2 px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-gray-900 dark:text-white text-sm">
                {['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <button onClick={() => removeUrl(index)}
                className="col-span-2 px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-sm text-white">{t('remove')}</button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={generate} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors text-white">
          {t('generate')}
        </button>
        <button onClick={copyToClipboard} disabled={!output}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 rounded-lg font-medium transition-colors">
          {t('copy')}
        </button>
        <button onClick={downloadFile} disabled={!output}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg font-medium transition-colors text-white">
          {t('download')}
        </button>
      </div>

      {output && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('output')}</label>
          <pre className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 font-mono text-sm text-green-600 dark:text-green-400 overflow-x-auto max-h-64">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
