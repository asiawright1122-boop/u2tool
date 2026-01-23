'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Rule {
  userAgent: string;
  allow: string[];
  disallow: string[];
}

export default function RobotsTxtGenerator() {
  const t = useTranslations('tools');
  const tr = useTranslations('tools.robots-txt-generator');
  const [rules, setRules] = useState<Rule[]>([
    { userAgent: '*', allow: ['/'], disallow: ['/admin/', '/private/'] }
  ]);
  const [sitemap, setSitemap] = useState('');
  const [crawlDelay, setCrawlDelay] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const addRule = () => {
    setRules([...rules, { userAgent: '*', allow: [], disallow: [] }]);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, field: keyof Rule, value: string | string[]) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const generateRobotsTxt = () => {
    let output = '';
    
    rules.forEach((rule, index) => {
      if (index > 0) output += '\n';
      output += `User-agent: ${rule.userAgent}\n`;
      
      rule.allow.forEach(path => {
        if (path.trim()) output += `Allow: ${path.trim()}\n`;
      });
      
      rule.disallow.forEach(path => {
        if (path.trim()) output += `Disallow: ${path.trim()}\n`;
      });
      
      if (crawlDelay && rule.userAgent === '*') {
        output += `Crawl-delay: ${crawlDelay}\n`;
      }
    });
    
    if (sitemap) {
      output += `\nSitemap: ${sitemap}`;
    }
    
    return output;
  };

  const output = generateRobotsTxt();

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const loadPreset = (preset: string) => {
    switch (preset) {
      case 'allow-all':
        setRules([{ userAgent: '*', allow: ['/'], disallow: [] }]);
        break;
      case 'block-all':
        setRules([{ userAgent: '*', allow: [], disallow: ['/'] }]);
        break;
      case 'standard':
        setRules([{ userAgent: '*', allow: ['/'], disallow: ['/admin/', '/api/', '/private/', '/*.json$'] }]);
        break;
      case 'wordpress':
        setRules([{ userAgent: '*', allow: ['/'], disallow: ['/wp-admin/', '/wp-includes/', '/wp-content/plugins/', '/trackback/', '/feed/', '/comments/'] }]);
        break;
    }
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => loadPreset('allow-all')} className="btn-secondary text-sm">{tr('allowAll')}</button>
        <button onClick={() => loadPreset('block-all')} className="btn-secondary text-sm">{tr('blockAll')}</button>
        <button onClick={() => loadPreset('standard')} className="btn-secondary text-sm">{tr('standard')}</button>
        <button onClick={() => loadPreset('wordpress')} className="btn-secondary text-sm">{tr('wordpress')}</button>
      </div>

      {rules.map((rule, index) => (
        <div key={index} className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-900 dark:text-white">{tr('rule', { index: index + 1 })}</h3>
            {rules.length > 1 && (
              <button onClick={() => removeRule(index)} className="text-red-400 hover:text-red-300 text-sm">
                {tr('remove')}
              </button>
            )}
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{tr('userAgent')}</label>
            <input
              type="text"
              value={rule.userAgent}
              onChange={(e) => updateRule(index, 'userAgent', e.target.value)}
              className="tool-input"
              placeholder="*"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{tr('allow')}</label>
            <textarea
              value={rule.allow.join('\n')}
              onChange={(e) => updateRule(index, 'allow', e.target.value.split('\n'))}
              className="tool-input"
              rows={2}
              placeholder="/public/"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{tr('disallow')}</label>
            <textarea
              value={rule.disallow.join('\n')}
              onChange={(e) => updateRule(index, 'disallow', e.target.value.split('\n'))}
              className="tool-input"
              rows={2}
              placeholder="/admin/&#10;/private/"
            />
          </div>
        </div>
      ))}

      <button onClick={addRule} className="btn-secondary">{tr('addRule')}</button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{tr('sitemapUrl')}</label>
          <input
            type="text"
            value={sitemap}
            onChange={(e) => setSitemap(e.target.value)}
            className="tool-input"
            placeholder="https://example.com/sitemap.xml"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{tr('crawlDelay')}</label>
          <input
            type="number"
            value={crawlDelay}
            onChange={(e) => setCrawlDelay(e.target.value)}
            className="tool-input"
            placeholder="10"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">{tr('output')}</label>
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
