'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

// IPv4 验证正则
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

// IPv6 验证正则（简化版）
const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|^(?:[0-9a-fA-F]{1,4}:){0,6}::(?:[0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}$/;

interface ValidationResult {
  isValid: boolean;
  type: 'IPv4' | 'IPv6' | 'Invalid';
  details: {
    isPrivate?: boolean;
    isLoopback?: boolean;
    isMulticast?: boolean;
    class?: string;
  };
}

function validateIP(ip: string): ValidationResult {
  const trimmed = ip.trim();
  
  if (ipv4Regex.test(trimmed)) {
    const parts = trimmed.split('.').map(Number);
    const isLoopback = parts[0] === 127;
    const isPrivate = 
      parts[0] === 10 ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168);
    const isMulticast = parts[0] >= 224 && parts[0] <= 239;
    
    let ipClass = 'Unknown';
    if (parts[0] >= 1 && parts[0] <= 126) ipClass = 'A';
    else if (parts[0] >= 128 && parts[0] <= 191) ipClass = 'B';
    else if (parts[0] >= 192 && parts[0] <= 223) ipClass = 'C';
    else if (parts[0] >= 224 && parts[0] <= 239) ipClass = 'D (Multicast)';
    else if (parts[0] >= 240 && parts[0] <= 255) ipClass = 'E (Reserved)';
    
    return {
      isValid: true,
      type: 'IPv4',
      details: { isPrivate, isLoopback, isMulticast, class: ipClass }
    };
  }
  
  if (ipv6Regex.test(trimmed)) {
    const isLoopback = trimmed === '::1';
    return {
      isValid: true,
      type: 'IPv6',
      details: { isLoopback }
    };
  }
  
  return { isValid: false, type: 'Invalid', details: {} };
}

export default function IpValidator() {
  const t = useTranslations('tools.ip-validator');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidate = () => {
    if (!input.trim()) {
      setResult(null);
      return;
    }
    setResult(validateIP(input));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t('inputLabel')}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
            placeholder={t('placeholder')}
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleValidate}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('validate')}
          </button>
        </div>
      </div>

      {result && (
        <div className={`p-4 rounded-lg ${result.isValid ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-2xl ${result.isValid ? 'text-green-400' : 'text-red-400'}`}>
              {result.isValid ? '✓' : '✗'}
            </span>
            <span className={`font-semibold ${result.isValid ? 'text-green-400' : 'text-red-400'}`}>
              {result.isValid ? t('valid') : t('invalid')}
            </span>
          </div>
          
          {result.isValid && (
            <div className="space-y-2 text-gray-300">
              <p><span className="text-gray-400">{t('type')}:</span> {result.type}</p>
              {result.type === 'IPv4' && (
                <>
                  <p><span className="text-gray-400">{t('class')}:</span> {result.details.class}</p>
                  <p><span className="text-gray-400">{t('private')}:</span> {result.details.isPrivate ? t('yes') : t('no')}</p>
                  <p><span className="text-gray-400">{t('loopback')}:</span> {result.details.isLoopback ? t('yes') : t('no')}</p>
                  <p><span className="text-gray-400">{t('multicast')}:</span> {result.details.isMulticast ? t('yes') : t('no')}</p>
                </>
              )}
              {result.type === 'IPv6' && (
                <p><span className="text-gray-400">{t('loopback')}:</span> {result.details.isLoopback ? t('yes') : t('no')}</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="text-sm text-gray-400">
        <p className="font-medium mb-2">{t('examples')}:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>192.168.1.1 (IPv4 {t('privateAddress')})</li>
          <li>8.8.8.8 (IPv4 {t('publicAddress')})</li>
          <li>::1 (IPv6 {t('loopbackAddress')})</li>
          <li>2001:0db8:85a3:0000:0000:8a2e:0370:7334 (IPv6)</li>
        </ul>
      </div>
    </div>
  );
}
