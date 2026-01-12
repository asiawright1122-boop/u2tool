'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface CardInfo {
  isValid: boolean;
  cardType: string;
  cardIcon: string;
  issuer: string;
  length: number;
  luhnValid: boolean;
}

const cardPatterns: { type: string; pattern: RegExp; icon: string; issuer: string }[] = [
  { type: 'Visa', pattern: /^4/, icon: '💳', issuer: 'Visa Inc.' },
  { type: 'Mastercard', pattern: /^5[1-5]|^2[2-7]/, icon: '💳', issuer: 'Mastercard Inc.' },
  { type: 'American Express', pattern: /^3[47]/, icon: '💳', issuer: 'American Express' },
  { type: 'Discover', pattern: /^6(?:011|5)/, icon: '💳', issuer: 'Discover Financial' },
  { type: 'JCB', pattern: /^35(?:2[89]|[3-8])/, icon: '💳', issuer: 'JCB Co., Ltd.' },
  { type: 'Diners Club', pattern: /^3(?:0[0-5]|[68])/, icon: '💳', issuer: 'Diners Club International' },
  { type: 'UnionPay', pattern: /^62/, icon: '💳', issuer: 'China UnionPay' },
  { type: 'Maestro', pattern: /^(?:5[06789]|6)/, icon: '💳', issuer: 'Mastercard Inc.' },
];

export default function CreditCardValidator() {
  const t = useTranslations('tools.credit-card-validator');
  const [cardNumber, setCardNumber] = useState('');
  const [result, setResult] = useState<CardInfo | null>(null);

  const luhnCheck = (num: string): boolean => {
    const digits = num.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  const detectCardType = (num: string): { type: string; icon: string; issuer: string } => {
    const digits = num.replace(/\D/g, '');
    
    for (const card of cardPatterns) {
      if (card.pattern.test(digits)) {
        return { type: card.type, icon: card.icon, issuer: card.issuer };
      }
    }
    
    return { type: 'Unknown', icon: '❓', issuer: 'Unknown' };
  };

  const validateCard = () => {
    const digits = cardNumber.replace(/\D/g, '');
    
    if (!digits) {
      setResult(null);
      return;
    }

    const cardInfo = detectCardType(digits);
    const luhnValid = luhnCheck(digits);
    const isValidLength = digits.length >= 13 && digits.length <= 19;
    
    setResult({
      isValid: luhnValid && isValidLength,
      cardType: cardInfo.type,
      cardIcon: cardInfo.icon,
      issuer: cardInfo.issuer,
      length: digits.length,
      luhnValid,
    });
  };

  const formatCardNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(' ') : digits;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('cardNumber')}
        </label>
        <input
          type="text"
          value={cardNumber}
          onChange={handleInputChange}
          placeholder={t('inputPlaceholder')}
          maxLength={23}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-lg tracking-wider"
        />
      </div>

      <button
        onClick={validateCard}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        {t('validate')}
      </button>

      {result && (
        <div className={`p-6 rounded-lg border-2 ${
          result.isValid 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-500' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-500'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{result.cardIcon}</span>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {result.cardType}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {result.issuer}
              </div>
            </div>
            <div className={`ml-auto px-4 py-2 rounded-full font-medium ${
              result.isValid 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {result.isValid ? t('valid') : t('invalid')}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400">{t('luhnCheck')}</div>
              <div className={`font-medium ${result.luhnValid ? 'text-green-600' : 'text-red-600'}`}>
                {result.luhnValid ? '✓ ' + t('passed') : '✗ ' + t('failed')}
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400">{t('digits')}</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {result.length} {t('digitsCount')}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-yellow-600">⚠️</span>
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            {t('disclaimer')}
          </p>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('supportedCards')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {cardPatterns.slice(0, 8).map((card) => (
            <div key={card.type} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span>{card.icon}</span>
              <span>{card.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
