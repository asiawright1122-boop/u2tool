'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

function formatXml(xml: string, indent = '  '): string {
  let formatted = '';
  let pad = 0;
  const nodes = xml.replace(/></g, '>\n<').split('\n');
  
  nodes.forEach((node) => {
    let padding = '';
    if (node.match(/^<\/\w/)) {
      pad -= 1;
    }
    padding = indent.repeat(Math.max(0, pad));
    if (node.match(/^<\w[^>]*[^/]>.*$/)) {
      pad += 1;
    }
    formatted += padding + node.trim() + '\n';
  });
  
  return formatted.trim();
}

function minifyXml(xml: string): string {
  return xml
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .replace(/>\s+/g, '>')
    .replace(/\s+</g, '<')
    .trim();
}

export default function XmlFormatter() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const format = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'text/xml');
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Invalid XML');
      }
      setOutput(formatXml(input));
      setError('');
    } catch (_e) {
      setError(t('xml.invalidXml'));
      setOutput('');
    }
  };

  const minify = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'text/xml');
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Invalid XML');
      }
      setOutput(minifyXml(input));
      setError('');
    } catch (_e) {
      setError(t('xml.invalidXml'));
      setOutput('');
    }
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

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
          placeholder='<root><item>value</item></root>'
          rows={8}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={format} className="btn-primary">
          {t('format')}
        </button>
        <button onClick={minify} className="btn-secondary">
          {t('minify')}
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-secondary">
          {t('clear')}
        </button>
      </div>

      {error && (
        <div className="tool-error">
          {error}
        </div>
      )}

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('output')}</label>
            <button
              onClick={copyOutput}
              className={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <textarea
            className="tool-textarea"
            value={output}
            readOnly
            rows={8}
          />
        </div>
      )}
    </div>
  );
}
