'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

type CodeType = 'html' | 'css' | 'js';

function minifyHtml(code: string): string {
  return code
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s+>/g, '>')
    .replace(/<\s+/g, '<')
    .trim();
}

function minifyCss(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*;\s*/g, ';')
    .replace(/;}/g, '}')
    .trim();
}

function minifyJs(code: string): string {
  return code
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,=+\-*/<>!&|?:])\s*/g, '$1')
    .trim();
}

export default function CodeMinifier() {
  const t = useTranslations('tools');
  const tc = useTranslations('tools.code-minifier');
  const [codeType, setCodeType] = useState<CodeType>('html');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const minify = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    
    let result = '';
    switch (codeType) {
      case 'html':
        result = minifyHtml(input);
        break;
      case 'css':
        result = minifyCss(input);
        break;
      case 'js':
        result = minifyJs(input);
        break;
    }
    setOutput(result);
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const stats = {
    original: input.length,
    minified: output.length,
    saved: input.length > 0 ? Math.round((1 - output.length / input.length) * 100) : 0,
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-4">
      {/* Code Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{tc('codeType')}</label>
        <div className="flex gap-2">
          {(['html', 'css', 'js'] as CodeType[]).map((type) => (
            <button
              key={type}
              onClick={() => setCodeType(type)}
              className={`px-4 py-2 rounded-lg uppercase font-medium text-white ${
                codeType === type ? 'bg-blue-600' : 'bg-gray-500 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t('input')}</label>
        <textarea
          className="tool-textarea font-mono text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={tc('placeholder', { type: codeType.toUpperCase() })}
          rows={8}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={minify} className="btn-primary">
          {t('minify')}
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-secondary">
          {t('clear')}
        </button>
      </div>

      {output && (
        <>
          {/* Stats */}
          <div className="flex gap-4 text-sm">
            <span className="text-gray-600 dark:text-gray-300">{tc('original')}: {stats.original} bytes</span>
            <span className="text-gray-600 dark:text-gray-300">{tc('minified')}: {stats.minified} bytes</span>
            <span className="text-green-600 dark:text-green-400">{tc('saved')}: {stats.saved}%</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">{t('output')}</label>
              <button
                onClick={copyOutput}
                className={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                {copied ? t('copied') : t('copy')}
              </button>
            </div>
            <textarea
              className="tool-textarea font-mono text-sm"
              value={output}
              readOnly
              rows={6}
            />
          </div>
        </>
      )}
    </div>
  );
}
