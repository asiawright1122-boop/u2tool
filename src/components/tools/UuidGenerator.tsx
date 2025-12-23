'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';

export default function UuidGenerator() {
  const t = useTranslations('tools');
  const [uuids, setUuids] = useState<string[]>([uuidv4()]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState(false);

  const generateUuids = () => {
    const newUuids = Array.from({ length: count }, () => uuidv4());
    setUuids(newUuids);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copySingle = async (uuid: string) => {
    await navigator.clipboard.writeText(uuid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">{t('count')}:</label>
        <input
          type="number"
          min="1"
          max="100"
          value={count}
          onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
          className="w-20 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg"
        />
        <button onClick={generateUuids} className="btn-primary">
          {t('generate')}
        </button>
        <button onClick={copyAll} className={`btn-secondary ${copied ? 'bg-green-600' : ''}`}>
          {copied ? t('copied') : t('copy')} {t('all')}
        </button>
      </div>

      <div className="space-y-2">
        {uuids.map((uuid, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded-lg font-mono text-sm"
          >
            <span className="select-all">{uuid}</span>
            <button
              onClick={() => copySingle(uuid)}
              className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
            >
              {t('copy')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
