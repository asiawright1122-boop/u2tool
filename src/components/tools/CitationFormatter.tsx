'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface Citation {
  type: 'book' | 'article' | 'website' | 'journal';
  authors: string;
  title: string;
  year: string;
  publisher?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  url?: string;
  accessDate?: string;
  doi?: string;
}

type CitationStyle = 'apa' | 'mla' | 'chicago' | 'harvard' | 'ieee';

function formatAuthorsAPA(authors: string): string {
  const authorList = authors.split(',').map(a => a.trim());
  if (authorList.length === 1) {
    const parts = authorList[0].split(' ');
    if (parts.length >= 2) {
      return `${parts[parts.length - 1]}, ${parts.slice(0, -1).map(p => p[0] + '.').join(' ')}`;
    }
    return authorList[0];
  }
  return authorList.map(author => {
    const parts = author.split(' ');
    if (parts.length >= 2) {
      return `${parts[parts.length - 1]}, ${parts.slice(0, -1).map(p => p[0] + '.').join(' ')}`;
    }
    return author;
  }).join(', ');
}

function formatAuthorsMLA(authors: string): string {
  const authorList = authors.split(',').map(a => a.trim());
  if (authorList.length === 1) {
    const parts = authorList[0].split(' ');
    if (parts.length >= 2) {
      return `${parts[parts.length - 1]}, ${parts.slice(0, -1).join(' ')}`;
    }
    return authorList[0];
  }
  const first = authorList[0].split(' ');
  const firstFormatted = first.length >= 2 
    ? `${first[first.length - 1]}, ${first.slice(0, -1).join(' ')}`
    : first[0];
  return `${firstFormatted}, et al.`;
}

function formatCitation(citation: Citation, style: CitationStyle): string {
  const { type, authors, title, year, publisher, journal, volume, issue, pages, url, accessDate, doi } = citation;
  
  switch (style) {
    case 'apa':
      if (type === 'book') {
        return `${formatAuthorsAPA(authors)} (${year}). *${title}*. ${publisher || ''}.${doi ? ` https://doi.org/${doi}` : ''}`;
      } else if (type === 'journal' || type === 'article') {
        return `${formatAuthorsAPA(authors)} (${year}). ${title}. *${journal}*${volume ? `, ${volume}` : ''}${issue ? `(${issue})` : ''}${pages ? `, ${pages}` : ''}.${doi ? ` https://doi.org/${doi}` : ''}`;
      } else {
        return `${formatAuthorsAPA(authors)} (${year}). *${title}*. ${url || ''}${accessDate ? ` Retrieved ${accessDate}` : ''}`;
      }
    
    case 'mla':
      if (type === 'book') {
        return `${formatAuthorsMLA(authors)}. *${title}*. ${publisher || ''}, ${year}.`;
      } else if (type === 'journal' || type === 'article') {
        return `${formatAuthorsMLA(authors)}. "${title}." *${journal}*${volume ? `, vol. ${volume}` : ''}${issue ? `, no. ${issue}` : ''}, ${year}${pages ? `, pp. ${pages}` : ''}.`;
      } else {
        return `${formatAuthorsMLA(authors)}. "${title}." *${publisher || 'Website'}*, ${year}, ${url || ''}.`;
      }
    
    case 'chicago':
      if (type === 'book') {
        return `${authors}. *${title}*. ${publisher ? `${publisher}, ` : ''}${year}.`;
      } else if (type === 'journal' || type === 'article') {
        return `${authors}. "${title}." *${journal}* ${volume || ''}${issue ? `, no. ${issue}` : ''} (${year})${pages ? `: ${pages}` : ''}.`;
      } else {
        return `${authors}. "${title}." ${publisher || ''}. ${accessDate ? `Accessed ${accessDate}. ` : ''}${url || ''}.`;
      }
    
    case 'harvard':
      if (type === 'book') {
        return `${formatAuthorsAPA(authors)} (${year}) *${title}*. ${publisher || ''}.`;
      } else if (type === 'journal' || type === 'article') {
        return `${formatAuthorsAPA(authors)} (${year}) '${title}', *${journal}*${volume ? `, ${volume}` : ''}${issue ? `(${issue})` : ''}${pages ? `, pp. ${pages}` : ''}.`;
      } else {
        return `${formatAuthorsAPA(authors)} (${year}) *${title}*. Available at: ${url || ''} (Accessed: ${accessDate || 'N/A'}).`;
      }
    
    case 'ieee':
      if (type === 'book') {
        return `${authors}, *${title}*. ${publisher || ''}, ${year}.`;
      } else if (type === 'journal' || type === 'article') {
        return `${authors}, "${title}," *${journal}*${volume ? `, vol. ${volume}` : ''}${issue ? `, no. ${issue}` : ''}${pages ? `, pp. ${pages}` : ''}, ${year}.`;
      } else {
        return `${authors}, "${title}," ${publisher || ''}. [Online]. Available: ${url || ''}. [Accessed: ${accessDate || 'N/A'}].`;
      }
    
    default:
      return '';
  }
}

export default function CitationFormatter() {
  const t = useTranslations('tools.citation-formatter');
  const tCommon = useTranslations('tools');
  const [citation, setCitation] = useState<Citation>({
    type: 'book',
    authors: 'John Smith, Jane Doe',
    title: 'Introduction to Computer Science',
    year: '2024',
    publisher: 'Academic Press',
    journal: '',
    volume: '',
    issue: '',
    pages: '',
    url: '',
    accessDate: '',
    doi: '',
  });
  const [style, setStyle] = useState<CitationStyle>('apa');
  const [copied, setCopied] = useState(false);

  const formattedCitation = useMemo(() => formatCitation(citation, style), [citation, style]);

  const updateCitation = useCallback(<K extends keyof Citation>(key: K, value: Citation[K]) => {
    setCitation(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(formattedCitation.replace(/\*/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [formattedCitation]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(['apa', 'mla', 'chicago', 'harvard', 'ieee'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            className={`px-4 py-2 text-sm rounded-lg ${
              style === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('sourceType')}</label>
          <select
            value={citation.type}
            onChange={(e) => updateCitation('type', e.target.value as Citation['type'])}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="book">Book</option>
            <option value="journal">Journal Article</option>
            <option value="article">Article</option>
            <option value="website">Website</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('year')}</label>
          <input
            type="text"
            value={citation.year}
            onChange={(e) => updateCitation('year', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('authors')} ({t('authorsHint')})</label>
          <input
            type="text"
            value={citation.authors}
            onChange={(e) => updateCitation('authors', e.target.value)}
            placeholder={t("authorsPlaceholder")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('title')}</label>
          <input
            type="text"
            value={citation.title}
            onChange={(e) => updateCitation('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        
        {(citation.type === 'book' || citation.type === 'website') && (
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('publisher')}</label>
            <input
              type="text"
              value={citation.publisher}
              onChange={(e) => updateCitation('publisher', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        )}
        
        {(citation.type === 'journal' || citation.type === 'article') && (
          <>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('journalName')}</label>
              <input
                type="text"
                value={citation.journal}
                onChange={(e) => updateCitation('journal', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('volume')}</label>
              <input
                type="text"
                value={citation.volume}
                onChange={(e) => updateCitation('volume', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('issue')}</label>
              <input
                type="text"
                value={citation.issue}
                onChange={(e) => updateCitation('issue', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('pages')}</label>
              <input
                type="text"
                value={citation.pages}
                onChange={(e) => updateCitation('pages', e.target.value)}
                placeholder={t("pagesPlaceholder")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('doi')}</label>
              <input
                type="text"
                value={citation.doi}
                onChange={(e) => updateCitation('doi', e.target.value)}
                placeholder={t("doiPlaceholder")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </>
        )}
        
        {citation.type === 'website' && (
          <>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('url')}</label>
              <input
                type="text"
                value={citation.url}
                onChange={(e) => updateCitation('url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('accessDate')}</label>
              <input
                type="text"
                value={citation.accessDate}
                onChange={(e) => updateCitation('accessDate', e.target.value)}
                placeholder={t("datePlaceholder")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('formattedCitation')} ({style.toUpperCase()})
          </label>
          <button
            onClick={handleCopy}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {copied ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ 
            __html: formattedCitation.replace(/\*([^*]+)\*/g, '<em>$1</em>') 
          }} />
        </div>
      </div>
    </div>
  );
}
