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
          <label className="text-sm text-gray-700 dark:text-gray-300">{t('csvJson.delimiter')}:</label>
          <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className="tool-select-sm">
            <option value=",">,</option>
            <option value=";">;</option>
            <option value="\t">{t('csvToJson.delimiterTab')}</option>
            <option value="|">|</option>
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} className="tool-checkbox" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('csvJson.hasHeader')}</span>
        </label>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="tool-label">{t('csvToJson.csv')}</label>
          <textarea value={csv} onChange={(e) => setCsv(e.target.value)} className="tool-textarea-tall" placeholder={t('csvToJson.csvPlaceholder')} />
        </div>
        <div>
          <label className="tool-label">{t('csvToJson.json')}</label>
          <textarea value={json} readOnly className="tool-textarea-tall" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={convert} className="btn-primary">{t('convert')}</button>
        <button onClick={copy} className="btn-secondary">{copied ? t('copied') : t('copy')}</button>
      </div>
    </div>
  );
}
