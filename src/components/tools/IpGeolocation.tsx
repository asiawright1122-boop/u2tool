'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface GeoData {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
}

export default function IpGeolocation() {
  const t = useTranslations('tools');
  const [ip, setIp] = useState('');
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookupIp = useCallback(async (targetIp?: string) => {
    setLoading(true);
    setError('');
    setGeoData(null);

    try {
      // 使用 ipapi.co - 支持 HTTPS 的免费 IP 地理位置 API
      // 免费版本：每天 1000 次请求
      const url = targetIp 
        ? `https://ipapi.co/${targetIp}/json/`
        : `https://ipapi.co/json/`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        setError(data.reason || t('ip-geolocation.invalidIp'));
        return;
      }

      setGeoData({
        ip: data.ip,
        country: data.country_name,
        countryCode: data.country_code,
        region: data.region_code || '',
        regionName: data.region || '',
        city: data.city || '',
        zip: data.postal || '',
        lat: data.latitude,
        lon: data.longitude,
        timezone: data.timezone || '',
        isp: data.org || '',
        org: data.org || '',
        as: data.asn ? `${data.asn} ${data.org || ''}` : '',
      });
    } catch {
      setError(t('ip-geolocation.lookupError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupIp(ip.trim() || undefined);
  };

  const handleMyIp = () => {
    setIp('');
    lookupIp();
  };

  return (
    <div className="space-y-6">
      {/* 输入区域 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('ip-geolocation.ipAddress')}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder={t('ip-geolocation.placeholder')}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? t('ip-geolocation.loading') : t('ip-geolocation.lookup')}
            </button>
          </div>
        </div>
        
        <button
          type="button"
          onClick={handleMyIp}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {t('ip-geolocation.myIp')}
        </button>
      </form>

      {/* 错误提示 */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* 结果显示 */}
      {geoData && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('ip-geolocation.results')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label={t('ip-geolocation.ipAddress')} value={geoData.ip} />
            <InfoCard label={t('ip-geolocation.country')} value={`${geoData.country} (${geoData.countryCode})`} />
            <InfoCard label={t('ip-geolocation.region')} value={geoData.regionName || geoData.region} />
            <InfoCard label={t('ip-geolocation.city')} value={geoData.city} />
            <InfoCard label={t('ip-geolocation.zipCode')} value={geoData.zip || '-'} />
            <InfoCard label={t('ip-geolocation.timezone')} value={geoData.timezone} />
            <InfoCard label={t('ip-geolocation.coordinates')} value={`${geoData.lat}, ${geoData.lon}`} />
            <InfoCard label={t('ip-geolocation.isp')} value={geoData.isp} />
            <InfoCard label={t('ip-geolocation.organization')} value={geoData.org || '-'} />
            <InfoCard label={t('ip-geolocation.asn')} value={geoData.as || '-'} />
          </div>

          {/* 地图链接 */}
          <div className="pt-4">
            <a
              href={`https://www.google.com/maps?q=${geoData.lat},${geoData.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              🗺️ {t('ip-geolocation.viewOnMap')}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-lg font-medium text-gray-900 dark:text-white mt-1">{value}</div>
    </div>
  );
}
