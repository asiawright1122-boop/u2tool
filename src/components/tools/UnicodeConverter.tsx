'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function UnicodeConverter() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState<'unicode' | 'html' | 'css'>('unicode');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const textToUnicode = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    
    let result = '';
    for (let i = 0; i < input.length; i++) {
      const code = input.charCodeAt(i);
      switch (format) {
        case 'unicode':
          result += '\\u' + code.toString(16).padStart(4, '0').toUpperCase();
          break;
        case 'html':
          result += '&#' + code + ';';
          break;
        case 'css':
          result += '\\' + code.toString(16).toUpperCase();
          break;
      }
    }
    setOutput(result);
  };

  const unicodeToText = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    
    try {
      let result = input;
      
      // Handle \uXXXX format
      result = result.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => 
        String.fromCharCode(parseInt(hex, 16))
      );
      
      // Handle &#XXXX; format (decimal)
      result = result.replace(/&#(\d+);/g, (_, dec) => 
        String.fromCharCode(parseInt(dec, 10))
      );
      
      // Handle &#xXXXX; format (hex)
      result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => 
        String.fromCharCode(parseInt(hex, 16))
      );
      
      // Handle CSS \XXXX format
      result = result.replace(/\\([0-9a-fA-F]{1,6})\s?/g, (_, hex) => 
        String.fromCharCode(parseInt(hex, 16))
      );
      
      setOutput(result);
    } catch (_e) {
      setOutput('Error: Invalid Unicode format');
    }
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const examples = [
    { text: '你好世界', desc: 'Chinese' },
    { text: 'Hello 🌍', desc: 'Emoji' },
    { text: '日本語', desc: 'Japanese' },
    { text: '한국어', desc: 'Korean' },
  ];

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">{t('input')}</label>
        <textarea
          className="tool-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('unicode.placeholder')}
          rows={4}
        />
      </div>

      {/* Format Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('unicode.format')}</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFormat('unicode')}
            className={`px-4 py-2 rounded-lg text-sm ${format === 'unicode' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white'}`}
          >
            Unicode (\u0000)
          </button>
          <button
            onClick={() => setFormat('html')}
            className={`px-4 py-2 rounded-lg text-sm ${format === 'html' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white'}`}
          >
            HTML (&#0000;)
          </button>
          <button
            onClick={() => setFormat('css')}
            className={`px-4 py-2 rounded-lg text-sm ${format === 'css' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white'}`}
          >
            CSS (\0000)
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={textToUnicode} className="btn-primary">
          {t('unicode.textToUnicode')}
        </button>
        <button onClick={unicodeToText} className="btn-secondary">
          {t('unicode.unicodeToText')}
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-secondary">
          {t('clear')}
        </button>
      </div>

      {/* Quick Examples */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('unicode.examples')}</label>
        <div className="flex flex-wrap gap-2">
          {examples.map((ex) => (
            <button
              key={ex.text}
              onClick={() => setInput(ex.text)}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-white"
            >
              {ex.text} ({ex.desc})
            </button>
          ))}
        </div>
      </div>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-white">{t('output')}</label>
            <button
              onClick={copyOutput}
              className={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white'}`}
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <textarea
            className="tool-textarea font-mono"
            value={output}
            readOnly
            rows={4}
          />
        </div>
      )}

      {/* Reference */}
      <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-300">
        <p className="mb-2">{t('unicode.reference')}:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><code className="text-blue-600 dark:text-blue-400">\u4E2D</code> → 中 (Unicode)</li>
          <li><code className="text-blue-600 dark:text-blue-400">&#20013;</code> → 中 (HTML Decimal)</li>
          <li><code className="text-blue-600 dark:text-blue-400">&#x4E2D;</code> → 中 (HTML Hex)</li>
          <li><code className="text-blue-600 dark:text-blue-400">\4E2D</code> → 中 (CSS)</li>
        </ul>
      </div>
    </div>
  );
}
