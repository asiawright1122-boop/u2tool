'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function MetaTagGenerator() {
  const t = useTranslations('tools');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [ogUrl, setOgUrl] = useState('');
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [twitterSite, setTwitterSite] = useState('');
  const [robots, setRobots] = useState('index, follow');
  const [viewport, setViewport] = useState('width=device-width, initial-scale=1');
  const [copied, setCopied] = useState(false);

  const generateMetaTags = () => {
    const tags: string[] = [];
    tags.push('<meta charset="UTF-8">');
    if (viewport) tags.push(`<meta name="viewport" content="${viewport}">`);
    if (title) tags.push(`<title>${title}</title>`);
    if (description) tags.push(`<meta name="description" content="${description}">`);
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}">`);
    if (author) tags.push(`<meta name="author" content="${author}">`);
    if (robots) tags.push(`<meta name="robots" content="${robots}">`);
    
    // Open Graph
    if (title) tags.push(`<meta property="og:title" content="${title}">`);
    if (description) tags.push(`<meta property="og:description" content="${description}">`);
    if (ogImage) tags.push(`<meta property="og:image" content="${ogImage}">`);
    if (ogUrl) tags.push(`<meta property="og:url" content="${ogUrl}">`);
    tags.push('<meta property="og:type" content="website">');
    
    // Twitter
    tags.push(`<meta name="twitter:card" content="${twitterCard}">`);
    if (title) tags.push(`<meta name="twitter:title" content="${title}">`);
    if (description) tags.push(`<meta name="twitter:description" content="${description}">`);
    if (ogImage) tags.push(`<meta name="twitter:image" content="${ogImage}">`);
    if (twitterSite) tags.push(`<meta name="twitter:site" content="${twitterSite}">`);
    
    return tags.join('\n');
  };

  const output = generateMetaTags();

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('metaTagGenerator.pageTitle')}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="tool-input"
            placeholder={t('metaTagGenerator.pageTitlePlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('metaTagGenerator.author')}</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="tool-input"
            placeholder={t('metaTagGenerator.authorPlaceholder')}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t('metaTagGenerator.description')}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="tool-input"
          rows={2}
          placeholder={t('metaTagGenerator.descriptionPlaceholder')}
        />
        <div className="text-xs text-gray-300 mt-1">{description.length} {t('metaTagGenerator.characters')}</div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t('metaTagGenerator.keywords')}</label>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="tool-input"
          placeholder={t('metaTagGenerator.keywordsPlaceholder')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('metaTagGenerator.ogImageUrl')}</label>
          <input
            type="text"
            value={ogImage}
            onChange={(e) => setOgImage(e.target.value)}
            className="tool-input"
            placeholder={t('metaTagGenerator.ogImageUrlPlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('metaTagGenerator.pageUrl')}</label>
          <input
            type="text"
            value={ogUrl}
            onChange={(e) => setOgUrl(e.target.value)}
            className="tool-input"
            placeholder={t('metaTagGenerator.pageUrlPlaceholder')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('metaTagGenerator.twitterCardType')}</label>
          <select
            value={twitterCard}
            onChange={(e) => setTwitterCard(e.target.value)}
            className="tool-input"
          >
            <option value="summary">{t('metaTagGenerator.twitterCardSummary')}</option>
            <option value="summary_large_image">{t('metaTagGenerator.twitterCardSummaryLargeImage')}</option>
            <option value="app">{t('metaTagGenerator.twitterCardApp')}</option>
            <option value="player">{t('metaTagGenerator.twitterCardPlayer')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('metaTagGenerator.twitterUsername')}</label>
          <input
            type="text"
            value={twitterSite}
            onChange={(e) => setTwitterSite(e.target.value)}
            className="tool-input"
            placeholder={t('metaTagGenerator.twitterUsernamePlaceholder')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('metaTagGenerator.robots')}</label>
          <select
            value={robots}
            onChange={(e) => setRobots(e.target.value)}
            className="tool-input"
          >
            <option value="index, follow">{t('metaTagGenerator.robotsIndexFollow')}</option>
            <option value="noindex, follow">{t('metaTagGenerator.robotsNoindexFollow')}</option>
            <option value="index, nofollow">{t('metaTagGenerator.robotsIndexNofollow')}</option>
            <option value="noindex, nofollow">{t('metaTagGenerator.robotsNoindexNofollow')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('metaTagGenerator.viewport')}</label>
          <input
            type="text"
            value={viewport}
            onChange={(e) => setViewport(e.target.value)}
            className="tool-input"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">{t('metaTagGenerator.generatedMetaTags')}</label>
          <button
            onClick={copyOutput}
            className={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <pre className="tool-textarea font-mono text-sm whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
}
