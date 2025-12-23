'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CsvToJson() {
  const t = useTranslations('tools');
  const [csv, setCsv] = useState('');
  const [json, setJson] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeader, setHasHeader] = useState(true);
  const [copied, setCopied] = useState(false);

  const convert = () => {
    try {
      const lines = csv.trim().split('\n').map(line => line.split(delimiter));
      if (lines.length === 0) return;
      
      if (hasHeader) {
        const headers = lines[0];
        const data = lines.slice(1).map(row => {
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => obj[h.trim()] = row[i]?.trim() || '');
          return obj;
        });
        setJson(JSON.stringify(data, null, 2));
      } else {
        setJson(JSON.stringify(lines, null, 2));
      }
    } catch {
      setJson(t('csvToJson.error'));
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm">{t('csvJson.delimiter')}:</label>
          <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className="px-3 py-2 bg-gray-800 border border-gray-700 rounded">
            <option value=",">,</option>
            <option value=";">;</option>
            <option value="\t">{t('csvToJson.delimiterTab')}</option>
            <option value="|">|</option>
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} className="w-4 h-4" />
          <span className="text-sm">{t('csvJson.hasHeader')}</span>
        </label>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('csvToJson.csv')}</label>
          <textarea value={csv} onChange={(e) => setCsv(e.target.value)} className="w-full h-64 p-3 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm" placeholder={t('csvToJson.csvPlaceholder')} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('csvToJson.json')}</label>
          <textarea value={json} readOnly className="w-full h-64 p-3 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t('convert')}</button>
        <button onClick={copy} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">{copied ? t('copied') : t('copy')}</button>
      </div>
    </div>
  );
}
