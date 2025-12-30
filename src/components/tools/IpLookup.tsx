'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface IpInfo {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  isp?: string;
  timezone?: string;
  lat?: number;
  lon?: number;
}

export default function IpLookup() {
  const t = useTranslations('tools.ipLookup');
  const [ip, setIp] = useState('');
  const [info, setInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookupIp = async (targetIp?: string) => {
    setLoading(true);
    setError('');
    try {
      const url = targetIp 
        ? `http://ip-api.com/json/${targetIp}`
        : 'http://ip-api.com/json/';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'success') {
        setInfo({
          ip: data.query,
          country: data.country,
          region: data.regionName,
          city: data.city,
          isp: data.isp,
          timezone: data.timezone,
          lat: data.lat,
          lon: data.lon,
        });
      } else {
        setError(data.message || t('error'));
      }
    } catch {
      setError(t('error'));
    }
    setLoading(false);
  };

  const getMyIp = () => {
    lookupIp();
  };

  const lookupCustomIp = () => {
    if (!ip.trim()) return;
    lookupIp(ip.trim());
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder={t('placeholder')}
          className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={lookupCustomIp}
          disabled={loading || !ip.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 dark:disabled:bg-gray-600 rounded-lg transition-colors"
        >
          {t('lookup')}
        </button>
        <button
          onClick={getMyIp}
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 dark:disabled:bg-gray-600 rounded-lg transition-colors"
        >
          {t('myIp')}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-500 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center text-gray-500 dark:text-gray-300 py-8">
          {t('loading')}
        </div>
      )}

      {info && !loading && (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500 dark:text-gray-300">{t('ipAddress')}:</span>
              <span className="ml-2 text-gray-900 dark:text-white font-mono">{info.ip}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-300">{t('country')}:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{info.country || '-'}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-300">{t('region')}:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{info.region || '-'}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-300">{t('city')}:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{info.city || '-'}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-300">{t('isp')}:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{info.isp || '-'}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-300">{t('timezone')}:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{info.timezone || '-'}</span>
            </div>
            {info.lat && info.lon && (
              <div className="col-span-2">
                <span className="text-gray-500 dark:text-gray-300">{t('coordinates')}:</span>
                <span className="ml-2 text-gray-900 dark:text-white font-mono">
                  {info.lat.toFixed(4)}, {info.lon.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
