'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function EpochConverter() {
  const t = useTranslations('tools');
  const [epoch, setEpoch] = useState('');
  const [date, setDate] = useState('');
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentEpoch(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  const epochToDate = () => {
    const ts = parseInt(epoch);
    if (isNaN(ts)) return;
    const d = new Date(ts > 9999999999 ? ts : ts * 1000);
    setDate(d.toISOString().slice(0, 19).replace('T', ' '));
  };

  const dateToEpoch = () => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return;
    setEpoch(Math.floor(d.getTime() / 1000).toString());
  };

  const useNow = () => {
    const now = new Date();
    setEpoch(Math.floor(now.getTime() / 1000).toString());
    setDate(now.toISOString().slice(0, 19).replace('T', ' '));
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('epoch.current')}</p>
        <p className="text-3xl font-mono text-blue-600 dark:text-blue-400 cursor-pointer" onClick={() => copy(currentEpoch.toString())}>{currentEpoch}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">{t('epoch.timestamp')}</label>
          <input type="text" value={epoch} onChange={(e) => setEpoch(e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-gray-900 dark:text-white" placeholder="1702400000" />
          <button onClick={epochToDate} className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t('epoch.toDate')}</button>
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">{t('epoch.datetime')}</label>
          <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-gray-900 dark:text-white" placeholder="2024-12-12 12:00:00" />
          <button onClick={dateToEpoch} className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{t('epoch.toEpoch')}</button>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={useNow} className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-700">{t('epoch.useNow')}</button>
        <button onClick={() => copy(epoch || date)} className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-700">{copied ? t('copied') : t('copy')}</button>
      </div>
    </div>
  );
}
