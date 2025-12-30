'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface CidrResult {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  subnetMask: string;
  wildcardMask: string;
  totalHosts: number;
  usableHosts: number;
  ipClass: string;
  binaryMask: string;
}

export function calculateCidr(cidr: string): CidrResult | null {
  const match = cidr.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
  if (!match) return null;

  const octets = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), parseInt(match[4])];
  const prefix = parseInt(match[5]);

  if (octets.some(o => o > 255) || prefix > 32) return null;

  const ipInt = (octets[0] << 24) + (octets[1] << 16) + (octets[2] << 8) + octets[3];
  const maskInt = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  const wildcardInt = ~maskInt >>> 0;

  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;

  const intToIp = (n: number): string => {
    return [
      (n >>> 24) & 255,
      (n >>> 16) & 255,
      (n >>> 8) & 255,
      n & 255
    ].join('.');
  };

  const intToBinary = (n: number): string => {
    return [
      ((n >>> 24) & 255).toString(2).padStart(8, '0'),
      ((n >>> 16) & 255).toString(2).padStart(8, '0'),
      ((n >>> 8) & 255).toString(2).padStart(8, '0'),
      (n & 255).toString(2).padStart(8, '0')
    ].join('.');
  };

  const totalHosts = Math.pow(2, 32 - prefix);
  const usableHosts = prefix >= 31 ? totalHosts : totalHosts - 2;

  let ipClass = 'N/A';
  if (octets[0] >= 1 && octets[0] <= 126) ipClass = 'A';
  else if (octets[0] >= 128 && octets[0] <= 191) ipClass = 'B';
  else if (octets[0] >= 192 && octets[0] <= 223) ipClass = 'C';
  else if (octets[0] >= 224 && octets[0] <= 239) ipClass = 'D (Multicast)';
  else if (octets[0] >= 240 && octets[0] <= 255) ipClass = 'E (Reserved)';

  return {
    networkAddress: intToIp(networkInt),
    broadcastAddress: intToIp(broadcastInt),
    firstHost: prefix >= 31 ? intToIp(networkInt) : intToIp(networkInt + 1),
    lastHost: prefix >= 31 ? intToIp(broadcastInt) : intToIp(broadcastInt - 1),
    subnetMask: intToIp(maskInt),
    wildcardMask: intToIp(wildcardInt),
    totalHosts,
    usableHosts,
    ipClass,
    binaryMask: intToBinary(maskInt),
  };
}

export default function CidrCalculator() {
  const t = useTranslations('tools');
  const [cidr, setCidr] = useState('192.168.1.0/24');
  const [result, setResult] = useState<CidrResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cidr) {
      const calculated = calculateCidr(cidr);
      if (calculated) {
        setResult(calculated);
        setError('');
      } else {
        setResult(null);
        setError(t('cidr.invalid'));
      }
    } else {
      setResult(null);
      setError('');
    }
  }, [cidr, t]);

  const commonPrefixes = [8, 16, 24, 25, 26, 27, 28, 29, 30, 31, 32];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">{t('cidr.input')}</label>
        <input
          type="text"
          value={cidr}
          onChange={(e) => setCidr(e.target.value)}
          placeholder="192.168.1.0/24"
          className="w-full p-3 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t('cidr.commonPrefixes')}</label>
        <div className="flex flex-wrap gap-2">
          {commonPrefixes.map((prefix) => (
            <button
              key={prefix}
              onClick={() => {
                const ip = cidr.split('/')[0] || '192.168.1.0';
                setCidr(`${ip}/${prefix}`);
              }}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm"
            >
              /{prefix}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('cidr.networkAddress')}</div>
            <div className="font-mono text-lg text-gray-900 dark:text-white">{result.networkAddress}</div>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('cidr.broadcastAddress')}</div>
            <div className="font-mono text-lg text-gray-900 dark:text-white">{result.broadcastAddress}</div>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('cidr.firstHost')}</div>
            <div className="font-mono text-lg text-gray-900 dark:text-white">{result.firstHost}</div>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('cidr.lastHost')}</div>
            <div className="font-mono text-lg text-gray-900 dark:text-white">{result.lastHost}</div>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('cidr.subnetMask')}</div>
            <div className="font-mono text-lg text-gray-900 dark:text-white">{result.subnetMask}</div>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('cidr.wildcardMask')}</div>
            <div className="font-mono text-lg text-gray-900 dark:text-white">{result.wildcardMask}</div>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('cidr.totalHosts')}</div>
            <div className="font-mono text-lg text-gray-900 dark:text-white">{result.totalHosts.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('cidr.usableHosts')}</div>
            <div className="font-mono text-lg text-gray-900 dark:text-white">{result.usableHosts.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg col-span-full">
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('cidr.binaryMask')}</div>
            <div className="font-mono text-sm break-all text-gray-900 dark:text-white">{result.binaryMask}</div>
          </div>
        </div>
      )}
    </div>
  );
}
