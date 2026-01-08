'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { calculateSubnet, validateIpAddress, validateSubnetMask, SubnetResult } from '@/lib/calculator-utils';

export default function IpSubnetCalculator() {
  const t = useTranslations('tools.ip-subnet-calculator');
  const tc = useTranslations('tools');

  const [ipAddress, setIpAddress] = useState<string>('192.168.1.100');
  const [subnetMask, setSubnetMask] = useState<string>('24');
  const [maskType, setMaskType] = useState<'cidr' | 'dotted'>('cidr');
  const [result, setResult] = useState<SubnetResult | null>(null);
  const [error, setError] = useState<string>('');

  const commonCidrs = [8, 16, 24, 25, 26, 27, 28, 29, 30];

  const calculate = () => {
    setError('');

    if (!validateIpAddress(ipAddress)) {
      setError(t('invalidIp'));
      return;
    }

    const mask = maskType === 'cidr' ? parseInt(subnetMask) : subnetMask;
    if (!validateSubnetMask(mask)) {
      setError(t('invalidMask'));
      return;
    }

    try {
      const res = calculateSubnet({ ipAddress, subnetMask: mask });
      setResult(res);
    } catch {
      setError(t('calculationError'));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('ipAddress')}
        </label>
        <input
          type="text"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
          placeholder="192.168.1.100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('subnetMask')}
        </label>
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setMaskType('cidr')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              maskType === 'cidr'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            CIDR
          </button>
          <button
            onClick={() => setMaskType('dotted')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              maskType === 'dotted'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t('dottedDecimal')}
          </button>
        </div>

        {maskType === 'cidr' && (
          <div className="flex flex-wrap gap-2 mb-2">
            {commonCidrs.map((cidr) => (
              <button
                key={cidr}
                onClick={() => setSubnetMask(cidr.toString())}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  subnetMask === cidr.toString()
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                /{cidr}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center">
          {maskType === 'cidr' && (
            <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg text-gray-500">
              /
            </span>
          )}
          <input
            type="text"
            value={subnetMask}
            onChange={(e) => setSubnetMask(e.target.value)}
            className={`flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono ${
              maskType === 'cidr' ? 'rounded-r-lg' : 'rounded-lg'
            }`}
            placeholder={maskType === 'cidr' ? '24' : '255.255.255.0'}
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {tc('calculate')}
      </button>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {result && !error && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label={t('networkAddress')}
              value={result.networkAddress}
              onCopy={() => copyToClipboard(result.networkAddress)}
            />
            <ResultCard
              label={t('broadcastAddress')}
              value={result.broadcastAddress}
              onCopy={() => copyToClipboard(result.broadcastAddress)}
            />
            <ResultCard
              label={t('firstHost')}
              value={result.firstHost}
              onCopy={() => copyToClipboard(result.firstHost)}
            />
            <ResultCard
              label={t('lastHost')}
              value={result.lastHost}
              onCopy={() => copyToClipboard(result.lastHost)}
            />
            <ResultCard
              label={t('subnetMask')}
              value={result.subnetMask}
              onCopy={() => copyToClipboard(result.subnetMask)}
            />
            <ResultCard
              label={t('wildcardMask')}
              value={result.wildcardMask}
              onCopy={() => copyToClipboard(result.wildcardMask)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('cidr')}</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                /{result.cidr}
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('usableHosts')}</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {result.usableHosts.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</div>
      <div className="flex items-center justify-between">
        <span className="font-mono text-gray-900 dark:text-white">{value}</span>
        <button
          onClick={onCopy}
          className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          title="Copy"
        >
          📋
        </button>
      </div>
    </div>
  );
}
