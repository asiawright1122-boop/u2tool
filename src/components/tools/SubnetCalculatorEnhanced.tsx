'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface SubnetInfo {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
  subnetMask: string;
  wildcardMask: string;
  cidr: number;
  ipClass: string;
  isPrivate: boolean;
}

export default function SubnetCalculatorEnhanced() {
  const t = useTranslations('tools.subnet-calculator-enhanced');
  const tCommon = useTranslations('tools');
  const [ipAddress, setIpAddress] = useState('192.168.1.0');
  const [cidr, setCidr] = useState(24);
  const [result, setResult] = useState<SubnetInfo | null>(null);
  const [error, setError] = useState('');

  const ipToNumber = (ip: string): number => {
    const parts = ip.split('.').map(Number);
    return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
  };

  const numberToIp = (num: number): string => {
    return [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.');
  };

  const getIpClass = (ip: string): string => {
    const firstOctet = parseInt(ip.split('.')[0]);
    if (firstOctet < 128) return 'A';
    if (firstOctet < 192) return 'B';
    if (firstOctet < 224) return 'C';
    if (firstOctet < 240) return 'D';
    return 'E';
  };

  const isPrivateIp = (ip: string): boolean => {
    const parts = ip.split('.').map(Number);
    return (parts[0] === 10) || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168);
  };

  const calculate = useCallback(() => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ipAddress)) { setError(t('invalidIp')); setResult(null); return; }
    const parts = ipAddress.split('.').map(Number);
    if (parts.some(p => p > 255)) { setError(t('invalidIp')); setResult(null); return; }
    if (cidr < 0 || cidr > 32) { setError(t('invalidCidr')); setResult(null); return; }
    setError('');

    const subnetMaskNum = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const wildcardMaskNum = ~subnetMaskNum >>> 0;
    const ipNum = ipToNumber(ipAddress);
    const networkNum = (ipNum & subnetMaskNum) >>> 0;
    const broadcastNum = (networkNum | wildcardMaskNum) >>> 0;
    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : totalHosts - 2;

    setResult({
      networkAddress: numberToIp(networkNum),
      broadcastAddress: numberToIp(broadcastNum),
      firstHost: cidr >= 31 ? numberToIp(networkNum) : numberToIp(networkNum + 1),
      lastHost: cidr >= 31 ? numberToIp(broadcastNum) : numberToIp(broadcastNum - 1),
      totalHosts, usableHosts,
      subnetMask: numberToIp(subnetMaskNum),
      wildcardMask: numberToIp(wildcardMaskNum),
      cidr, ipClass: getIpClass(ipAddress), isPrivate: isPrivateIp(ipAddress)
    });
  }, [ipAddress, cidr, t]);

  const commonSubnets = [
    { cidr: 8, name: '/8 (Class A)' }, { cidr: 16, name: '/16 (Class B)' }, { cidr: 24, name: '/24 (Class C)' },
    { cidr: 25, name: '/25 (128 hosts)' }, { cidr: 26, name: '/26 (64 hosts)' }, { cidr: 27, name: '/27 (32 hosts)' },
    { cidr: 28, name: '/28 (16 hosts)' }, { cidr: 29, name: '/29 (8 hosts)' }, { cidr: 30, name: '/30 (4 hosts)' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('ipAddress')}</label>
            <input type="text" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)}
              className="w-full p-3 border rounded-lg font-mono dark:bg-gray-700 dark:border-gray-600"
              placeholder="192.168.1.0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CIDR: /{cidr}</label>
            <input type="range" min="0" max="32" value={cidr} onChange={(e) => setCidr(Number(e.target.value))} className="w-full" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {commonSubnets.map(s => (
            <button key={s.cidr} onClick={() => setCidr(s.cidr)}
              className={`px-3 py-1 text-sm rounded-lg ${cidr === s.cidr ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
              {s.name}
            </button>
          ))}
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <button onClick={calculate} className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{tCommon('convert')}</button>
      </div>

      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('results')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: t('networkAddress'), value: result.networkAddress },
              { label: t('broadcastAddress'), value: result.broadcastAddress },
              { label: t('firstHost'), value: result.firstHost },
              { label: t('lastHost'), value: result.lastHost },
              { label: t('subnetMask'), value: result.subnetMask },
              { label: t('wildcardMask'), value: result.wildcardMask },
              { label: t('totalHosts'), value: result.totalHosts.toLocaleString() },
              { label: t('usableHosts'), value: result.usableHosts.toLocaleString() },
            ].map((item, i) => (
              <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">{item.label}</div>
                <div className="font-mono text-lg text-gray-900 dark:text-white">{item.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4">
            <span className={`px-3 py-1 rounded-full text-sm ${result.isPrivate ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
              {result.isPrivate ? t('privateIp') : t('publicIp')}
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {t('class')} {result.ipClass}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
