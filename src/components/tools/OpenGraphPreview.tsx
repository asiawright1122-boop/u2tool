'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function OpenGraphPreview() {
  const t = useTranslations('tools');
  
  // 模式：manual（手动输入）或 fetch（抓取URL）
  const [mode, setMode] = useState<'manual' | 'fetch'>('manual');
  const [fetchUrl, setFetchUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  
  // 初始化状态
  const [isInitialized, setIsInitialized] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // 使用空字符串初始化，在 useEffect 中设置翻译值
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [siteName, setSiteName] = useState('');
  const [previewType, setPreviewType] = useState<'facebook' | 'twitter' | 'linkedin'>('facebook');

  // 初始化翻译值（只在组件挂载时执行一次）
  useEffect(() => {
    if (!isInitialized) {
      setTitle(t('openGraphPreview.defaultTitle'));
      setDescription(t('openGraphPreview.defaultDescription'));
      setSiteName(t('openGraphPreview.defaultSiteName'));
      setUrl('https://example.com/page');
      setIsInitialized(true);
    }
  }, [t, isInitialized]);

  // 抓取 URL 的 OG 标签
  const fetchOgTags = async () => {
    if (!fetchUrl.trim()) return;
    
    setLoading(true);
    setFetchError('');
    
    try {
      // 使用 allorigins 代理来绕过 CORS
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(fetchUrl)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch URL');
      }
      
      const html = await response.text();
      
      // 解析 HTML 获取 OG 标签
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // 获取 OG 标签
      const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') 
        || doc.querySelector('title')?.textContent || '';
      const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content')
        || doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
      const ogSiteName = doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content') || '';
      const ogUrl = doc.querySelector('meta[property="og:url"]')?.getAttribute('content') || fetchUrl;
      
      // 处理相对路径的图片 URL
      let finalImage = ogImage;
      if (ogImage && !ogImage.startsWith('http')) {
        try {
          const baseUrl = new URL(fetchUrl);
          finalImage = new URL(ogImage, baseUrl.origin).href;
        } catch {
          finalImage = ogImage;
        }
      }
      
      setTitle(ogTitle);
      setDescription(ogDescription);
      setImage(finalImage);
      setSiteName(ogSiteName);
      setUrl(ogUrl);
      setImageError(false);
      
    } catch (err) {
      setFetchError(t('openGraphPreview.fetchError'));
      console.error('Error fetching OG tags:', err);
    } finally {
      setLoading(false);
    }
  };

  // 当图片 URL 改变时重置错误状态
  useEffect(() => {
    setImageError(false);
  }, [image]);

  const truncate = (str: string, len: number) => {
    return str.length > len ? str.substring(0, len) + '...' : str;
  };

  // 安全获取 hostname，避免 hydration 错误
  const getHostname = (urlStr: string) => {
    if (!urlStr) return 'example.com';
    try {
      return new URL(urlStr).hostname;
    } catch {
      return 'example.com';
    }
  };

  // 生成 OG 标签代码
  const generateOgTags = () => {
    const tags = [
      `<meta property="og:title" content="${title}" />`,
      `<meta property="og:description" content="${description}" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:type" content="website" />`,
    ];
    
    if (siteName) {
      tags.push(`<meta property="og:site_name" content="${siteName}" />`);
    }
    
    if (image) {
      tags.push(`<meta property="og:image" content="${image}" />`);
      tags.push(`<meta property="og:image:width" content="1200" />`);
      tags.push(`<meta property="og:image:height" content="630" />`);
    }
    
    // Twitter Card 标签
    tags.push('');
    tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
    tags.push(`<meta name="twitter:title" content="${title}" />`);
    tags.push(`<meta name="twitter:description" content="${description}" />`);
    if (image) {
      tags.push(`<meta name="twitter:image" content="${image}" />`);
    }
    
    return tags.join('\n');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateOgTags());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 复制失败
    }
  };

  // 渲染图片或占位符
  const renderImage = (aspectClass: string) => {
    // 如果没有图片URL，显示默认占位图（模拟真实社交媒体预览）
    if (!image) {
      return (
        <div className={`${aspectClass} bg-gradient-to-br from-gray-600 to-gray-800 relative`}>
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      );
    }
    
    return (
      <div className={`${aspectClass} bg-gray-700 relative`}>
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">{t('openGraphPreview.imageLoadError')}</span>
            </div>
          </div>
        ) : (
          <img 
            src={image} 
            alt={title || 'Open Graph preview image'} 
            className="w-full h-full object-cover" 
            onError={() => setImageError(true)} 
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 模式选择 */}
      <div className="flex gap-4 p-4 bg-gray-800/50 rounded-lg">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="mode"
            checked={mode === 'fetch'}
            onChange={() => setMode('fetch')}
            className="w-4 h-4"
          />
          <span>{t('openGraphPreview.modeFetch')}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="mode"
            checked={mode === 'manual'}
            onChange={() => setMode('manual')}
            className="w-4 h-4"
          />
          <span>{t('openGraphPreview.modeManual')}</span>
        </label>
      </div>

      {/* URL 抓取模式 */}
      {mode === 'fetch' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('openGraphPreview.fetchUrlLabel')}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={fetchUrl}
                onChange={(e) => setFetchUrl(e.target.value)}
                className="tool-input flex-1"
                placeholder="https://example.com/article"
                onKeyDown={(e) => e.key === 'Enter' && fetchOgTags()}
              />
              <button
                onClick={fetchOgTags}
                disabled={loading || !fetchUrl.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition-colors"
              >
                {loading ? t('openGraphPreview.fetching') : t('openGraphPreview.fetchButton')}
              </button>
            </div>
            {fetchError && (
              <p className="text-red-400 text-sm mt-2">{fetchError}</p>
            )}
          </div>
        </div>
      )}

      {/* 手动输入模式 */}
      {mode === 'manual' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('openGraphPreview.title')}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="tool-input"
                placeholder={t('openGraphPreview.titlePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('openGraphPreview.siteName')}</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="tool-input"
                placeholder={t('openGraphPreview.siteNamePlaceholder')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('openGraphPreview.description')}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="tool-input"
              rows={2}
              placeholder={t('openGraphPreview.descriptionPlaceholder')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('openGraphPreview.imageUrl')}</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="tool-input"
                placeholder={t('openGraphPreview.imageUrlPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('openGraphPreview.pageUrl')}</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="tool-input"
                placeholder={t('openGraphPreview.pageUrlPlaceholder')}
              />
            </div>
          </div>
        </>
      )}

      {/* 抓取模式下显示获取到的信息（只读） */}
      {mode === 'fetch' && title && (
        <div className="p-4 bg-gray-800/30 rounded-lg space-y-2 text-sm">
          <div><span className="text-gray-400">{t('openGraphPreview.title')}:</span> {title}</div>
          <div><span className="text-gray-400">{t('openGraphPreview.description')}:</span> {description || '-'}</div>
          <div><span className="text-gray-400">{t('openGraphPreview.siteName')}:</span> {siteName || '-'}</div>
          <div><span className="text-gray-400">{t('openGraphPreview.imageUrl')}:</span> {image || '-'}</div>
        </div>
      )}

      {/* Preview Type Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setPreviewType('facebook')}
          className={`px-4 py-2 rounded ${previewType === 'facebook' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          {t('openGraphPreview.platform.facebook')}
        </button>
        <button
          onClick={() => setPreviewType('twitter')}
          className={`px-4 py-2 rounded ${previewType === 'twitter' ? 'bg-blue-400' : 'bg-gray-700'}`}
        >
          {t('openGraphPreview.platform.twitter')}
        </button>
        <button
          onClick={() => setPreviewType('linkedin')}
          className={`px-4 py-2 rounded ${previewType === 'linkedin' ? 'bg-blue-700' : 'bg-gray-700'}`}
        >
          {t('openGraphPreview.platform.linkedin')}
        </button>
      </div>

      {/* Preview */}
      <div>
        <label className="block text-sm font-medium mb-2">{t('openGraphPreview.preview')}</label>
        
        {previewType === 'facebook' && (
          <div className="max-w-[500px] bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            {renderImage('aspect-[1.91/1]')}
            <div className="p-3 border-t border-gray-700">
              <div className="text-xs text-gray-300 uppercase">{getHostname(url)}</div>
              <div className="text-gray-100 font-semibold mt-1">{truncate(title, 60)}</div>
              <div className="text-gray-300 text-sm mt-1">{truncate(description, 150)}</div>
            </div>
          </div>
        )}

        {previewType === 'twitter' && (
          <div className="max-w-[500px] bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
            {renderImage('aspect-[2/1]')}
            <div className="p-3">
              <div className="text-gray-100 font-bold">{truncate(title, 70)}</div>
              <div className="text-gray-300 text-sm mt-1">{truncate(description, 125)}</div>
              <div className="text-gray-300 text-sm mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {getHostname(url)}
              </div>
            </div>
          </div>
        )}

        {previewType === 'linkedin' && (
          <div className="max-w-[500px] bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
            {renderImage('aspect-[1.91/1]')}
            <div className="p-3">
              <div className="text-gray-100 font-semibold">{truncate(title, 100)}</div>
              <div className="text-gray-300 text-xs mt-1">{getHostname(url)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Generated Code */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">{t('openGraphPreview.generatedCode')}</label>
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <pre className="tool-input font-mono text-sm overflow-x-auto whitespace-pre-wrap">
          {generateOgTags()}
        </pre>
      </div>

      {/* Recommendations */}
      <div className="p-4 bg-gray-800/50 rounded-lg text-sm">
        <h3 className="font-medium mb-2">{t('openGraphPreview.recommendations.title')}</h3>
        <ul className="space-y-1 text-gray-300">
          <li>• {t('openGraphPreview.recommendations.imageSize')}</li>
          <li>• {t('openGraphPreview.recommendations.titleLength')}</li>
          <li>• {t('openGraphPreview.recommendations.descriptionLength')}</li>
          <li>• {t('openGraphPreview.recommendations.highQuality')}</li>
          <li>• {t('openGraphPreview.recommendations.testDebugger')}</li>
        </ul>
      </div>
    </div>
  );
}
