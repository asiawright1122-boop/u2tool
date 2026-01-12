'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ValidationResult {
  isValid: boolean;
  email: string;
  localPart: string;
  domain: string;
  tld: string;
  isDisposable: boolean;
  isFreeProvider: boolean;
  suggestions: string[];
}

const disposableDomains = ['tempmail.com', 'throwaway.com', 'guerrillamail.com', 'mailinator.com', '10minutemail.com', 'temp-mail.org'];
const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'protonmail.com', 'mail.com', 'aol.com'];
const commonTypos: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'hotmal.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'outloo.com': 'outlook.com',
  'outlok.com': 'outlook.com',
};

export default function EmailValidator() {
  const t = useTranslations('tools.email-validator');
  const [email, setEmail] = useState('');
  const [results, setResults] = useState<ValidationResult[]>([]);

  const validateEmail = (emailStr: string): ValidationResult => {
    const trimmed = emailStr.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    const isValid = emailRegex.test(trimmed);
    const parts = trimmed.split('@');
    const localPart = parts[0] || '';
    const domain = parts[1] || '';
    const tld = domain.split('.').pop() || '';
    
    const isDisposable = disposableDomains.some(d => domain.includes(d));
    const isFreeProvider = freeProviders.includes(domain);
    
    const suggestions: string[] = [];
    if (commonTypos[domain]) {
      suggestions.push(`${localPart}@${commonTypos[domain]}`);
    }
    
    return {
      isValid,
      email: trimmed,
      localPart,
      domain,
      tld,
      isDisposable,
      isFreeProvider,
      suggestions,
    };
  };

  const handleValidate = () => {
    const emails = email.split('\n').filter(e => e.trim());
    const validationResults = emails.map(validateEmail);
    setResults(validationResults);
  };

  const validCount = results.filter(r => r.isValid).length;
  const invalidCount = results.filter(r => !r.isValid).length;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('inputLabel')}
        </label>
        <textarea
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('inputPlaceholder')}
          className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
        />
      </div>

      <button
        onClick={handleValidate}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        {t('validate')}
      </button>

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <span className="text-green-700 dark:text-green-400 font-medium">
                ✓ {t('valid')}: {validCount}
              </span>
            </div>
            <div className="px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <span className="text-red-700 dark:text-red-400 font-medium">
                ✗ {t('invalid')}: {invalidCount}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.isValid
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={result.isValid ? 'text-green-600' : 'text-red-600'}>
                    {result.isValid ? '✓' : '✗'}
                  </span>
                  <span className="font-mono text-gray-900 dark:text-white">{result.email}</span>
                </div>
                
                {result.isValid && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{t('localPart')}:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">{result.localPart}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{t('domain')}:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">{result.domain}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{t('tld')}:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">.{result.tld}</span>
                    </div>
                    <div className="flex gap-2">
                      {result.isFreeProvider && (
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs">
                          {t('freeProvider')}
                        </span>
                      )}
                      {result.isDisposable && (
                        <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded text-xs">
                          {t('disposable')}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {result.suggestions.length > 0 && (
                  <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                    💡 {t('didYouMean')}: {result.suggestions.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
