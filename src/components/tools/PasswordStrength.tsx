'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface StrengthResult {
  score: number;
  label: string;
  color: string;
  suggestions: string[];
}

// Common weak passwords list
const commonPasswords = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 'master',
  'dragon', 'letmein', 'login', 'admin', 'welcome', 'password1', '123456789'
];

export function analyzePassword(password: string): StrengthResult {
  let score = 0;
  const suggestions: string[] = [];

  if (!password) {
    return { score: 0, label: 'empty', color: 'gray', suggestions: [] };
  }

  // Length checks
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (password.length < 8) suggestions.push('length');

  // Character type checks
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password);

  if (hasLower) score += 1;
  if (hasUpper) score += 1;
  if (hasNumber) score += 1;
  if (hasSymbol) score += 1;

  if (!hasLower) suggestions.push('lowercase');
  if (!hasUpper) suggestions.push('uppercase');
  if (!hasNumber) suggestions.push('numbers');
  if (!hasSymbol) suggestions.push('symbols');

  // Penalty for common passwords
  if (commonPasswords.includes(password.toLowerCase())) {
    score = Math.max(0, score - 4);
    suggestions.push('common');
  }

  // Penalty for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(0, score - 1);
    suggestions.push('repeated');
  }

  // Penalty for sequential characters
  if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)) {
    score = Math.max(0, score - 1);
    suggestions.push('sequential');
  }

  // Determine strength label and color
  let label: string;
  let color: string;

  if (score <= 2) {
    label = 'weak';
    color = 'red';
  } else if (score <= 4) {
    label = 'fair';
    color = 'orange';
  } else if (score <= 6) {
    label = 'good';
    color = 'yellow';
  } else {
    label = 'strong';
    color = 'green';
  }

  return { score, label, color, suggestions };
}

export default function PasswordStrength() {
  const t = useTranslations('tools');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<StrengthResult | null>(null);

  useEffect(() => {
    if (password) {
      setResult(analyzePassword(password));
    } else {
      setResult(null);
    }
  }, [password]);

  const getColorClass = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-500';
      case 'orange': return 'bg-orange-500';
      case 'yellow': return 'bg-yellow-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-9000';
    }
  };

  const getTextColorClass = (color: string) => {
    switch (color) {
      case 'red': return 'text-red-500';
      case 'orange': return 'text-orange-500';
      case 'yellow': return 'text-yellow-500';
      case 'green': return 'text-green-500';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('pwStrength.password')}</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('pwStrength.placeholder')}
            className="w-full p-3 pr-20 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            {showPassword ? t('pwStrength.hide') : t('pwStrength.show')}
          </button>
        </div>
      </div>

      {result && (
        <>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{t('pwStrength.strength')}</span>
              <span className={`text-sm font-medium ${getTextColorClass(result.color)}`}>
                {t(`pwStrength.${result.label}`)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${getColorClass(result.color)}`}
                style={{ width: `${Math.min(100, (result.score / 7) * 100)}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
              {t('pwStrength.score')}: {result.score}/7
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <div className="text-gray-600 dark:text-gray-300 mb-1">{t('pwStrength.length')}</div>
              <div className="font-mono text-gray-900 dark:text-white">{password.length} {t('pwStrength.chars')}</div>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <div className="text-gray-600 dark:text-gray-300 mb-1">{t('pwStrength.charTypes')}</div>
              <div className="flex gap-2">
                <span className={/[a-z]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-300'}>a-z</span>
                <span className={/[A-Z]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-300'}>A-Z</span>
                <span className={/[0-9]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-300'}>0-9</span>
                <span className={/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-300'}>!@#</span>
              </div>
            </div>
          </div>

          {result.suggestions.length > 0 && (
            <div className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">{t('pwStrength.suggestions')}</div>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index}>• {t(`pwStrength.suggest.${suggestion}`)}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
