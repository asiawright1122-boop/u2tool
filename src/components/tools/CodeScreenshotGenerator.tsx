'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const themes = {
  'dracula': { bg: '#282a36', text: '#f8f8f2', keyword: '#ff79c6', string: '#f1fa8c', comment: '#6272a4' },
  'monokai': { bg: '#272822', text: '#f8f8f2', keyword: '#f92672', string: '#e6db74', comment: '#75715e' },
  'github': { bg: '#ffffff', text: '#24292e', keyword: '#d73a49', string: '#032f62', comment: '#6a737d' },
  'nord': { bg: '#2e3440', text: '#d8dee9', keyword: '#81a1c1', string: '#a3be8c', comment: '#616e88' },
  'solarized': { bg: '#002b36', text: '#839496', keyword: '#859900', string: '#2aa198', comment: '#586e75' },
};

const languages = ['javascript', 'typescript', 'python', 'java', 'html', 'css', 'json', 'sql', 'bash', 'go'];

export default function CodeScreenshotGenerator() {
  const t = useTranslations('tools.code-screenshot-generator');
  const tCommon = useTranslations('tools');
  const [code, setCode] = useState('function hello() {\n  console.log("Hello, World!");\n}');
  const [theme, setTheme] = useState<keyof typeof themes>('dracula');
  const [language, setLanguage] = useState('javascript');
  const [padding, setPadding] = useState(32);
  const [fontSize, setFontSize] = useState(14);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [windowControls, setWindowControls] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  const highlightCode = useCallback((code: string) => {
    const currentTheme = themes[theme];
    const keywords = /\b(function|const|let|var|if|else|for|while|return|import|export|class|async|await|try|catch)\b/g;
    const strings = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g;
    const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
    
    let highlighted = code
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(comments, `<span style="color:${currentTheme.comment}">$1</span>`)
      .replace(strings, `<span style="color:${currentTheme.string}">$&</span>`)
      .replace(keywords, `<span style="color:${currentTheme.keyword}">$1</span>`);
    return highlighted;
  }, [theme]);

  const downloadImage = async () => {
    if (!previewRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(previewRef.current, { backgroundColor: null, scale: 2 } as Parameters<typeof html2canvas>[1]);
      const link = document.createElement('a');
      link.download = `code-screenshot-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) { /* ignore */ }
  };

  const lines = code.split('\n');
  const currentTheme = themes[theme];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{tCommon('input')}</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-48 p-3 border rounded-lg font-mono text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
              placeholder={tCommon('inputPlaceholder')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('theme')}</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value as keyof typeof themes)}
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
                {Object.keys(themes).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('language')}</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
                {languages.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('padding')}: {padding}px</label>
              <input type="range" min="16" max="64" value={padding} onChange={(e) => setPadding(Number(e.target.value))}
                className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('fontSize')}: {fontSize}px</label>
              <input type="range" min="12" max="24" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full" />
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showLineNumbers} onChange={(e) => setShowLineNumbers(e.target.checked)} />
              <span className="text-sm text-gray-700 dark:text-gray-300">{t('lineNumbers')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={windowControls} onChange={(e) => setWindowControls(e.target.checked)} />
              <span className="text-sm text-gray-700 dark:text-gray-300">{t('windowControls')}</span>
            </label>
          </div>
          <button onClick={downloadImage}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {tCommon('download')} PNG
          </button>
        </div>

        <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg p-8 min-h-[400px]">
          <div ref={previewRef} style={{ padding, backgroundColor: currentTheme.bg, borderRadius: '12px', boxShadow: '0 20px 68px rgba(0,0,0,0.55)' }}>
            {windowControls && (
              <div className="flex gap-2 mb-4 px-4 pt-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            )}
            <pre className="overflow-x-auto" style={{ margin: 0, padding: windowControls ? '0 16px 16px' : '16px', fontSize }}>
              <code style={{ color: currentTheme.text, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
                {lines.map((line, i) => (
                  <div key={i} className="flex">
                    {showLineNumbers && (
                      <span className="select-none mr-4 opacity-50" style={{ minWidth: '2em', textAlign: 'right' }}>{i + 1}</span>
                    )}
                    <span dangerouslySetInnerHTML={{ __html: highlightCode(line) || '&nbsp;' }} />
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
