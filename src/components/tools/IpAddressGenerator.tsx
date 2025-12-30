'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function IpAddressGenerator() {
  const t = useTranslations('tools.ip-address-generator');
  const [ipType, setIpType] = useState<'ipv4' | 'ipv6' | 'private' | 'public'>('ipv4');
  const [count, setCount] = useState(10);
  const [generated, setGenerated] = useState<string[]>([]);

  const generateIPv4 = (): string => {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
  };

  const generateIPv6 = (): string => {
    return Array.from({ length: 8 }, () => 
      Math.floor(Math.random() * 65536).toString(16).padStart(4, '0')
    ).join(':');
  };

  const generatePrivateIPv4 = (): string => {
    const ranges = [
      () => `10.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
      () => `172.${16 + Math.floor(Math.random() * 16)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
      () => `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
    ];
    return ranges[Math.floor(Math.random() * ranges.length)]();
  };

  const generatePublicIPv4 = (): string => {
    let ip: string;
    while (true) {
      ip = generateIPv4();
      const parts = ip.split('.').map(Number);
      // Exclude private, loopback, and reserved ranges
      const isPrivate = 
        parts[0] === 10 ||
        (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
        (parts[0] === 192 && parts[1] === 168) ||
        parts[0] === 127 ||
        parts[0] === 0 ||
        parts[0] >= 224;
      if (!isPrivate) break;
    }
    return ip;
  };

  const generate = () => {
    const generators: Record<string, () => string> = {
      ipv4: generateIPv4,
      ipv6: generateIPv6,
      private: generatePrivateIPv4,
      public: generatePublicIPv4,
    };
    
    const ips = Array.from({ length: count }, () => generators[ipType]());
    setGenerated(ips);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated.join('\n'));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('ipType')}</label>
          <select value={ipType} onChange={(e) => setIpType(e.target.value as typeof ipType)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
            <option value="ipv4">{t('ipv4Random')}</option>
            <option value="ipv6">{t('ipv6')}</option>
            <option value="private">{t('privateIpv4')}</option>
            <option value="public">{t('publicIpv4')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('count')}: {count}</label>
          <input type="range" min="1" max="100" value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="w-full mt-2" />
        </div>
        <div className="flex items-end gap-2">
          <button onClick={generate}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            {t('generate')}
          </button>
          <button onClick={copyToClipboard} disabled={generated.length === 0}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white disabled:opacity-50 rounded-lg font-medium transition-colors">
            {t('copy')}
          </button>
        </div>
      </div>

      {generated.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('generatedIps')} ({generated.length})
          </label>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {generated.map((ip, index) => (
                <div key={index} onClick={() => navigator.clipboard.writeText(ip)}
                  className="px-3 py-2 bg-white dark:bg-gray-600 rounded font-mono text-sm text-green-600 dark:text-green-400 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-500">
                  {ip}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
