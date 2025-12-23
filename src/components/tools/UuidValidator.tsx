'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ValidationResult {
  isValid: boolean;
  version: string | null;
  variant: string | null;
}

export default function UuidValidator() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{ uuid: string; result: ValidationResult }[]>([]);

  const validateUuid = (uuid: string): ValidationResult => {
    const trimmed = uuid.trim();
    
    // Standard UUID regex
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-([1-5])[0-9a-f]{3}-([89ab])[0-9a-f]{3}-[0-9a-f]{12}$/i;
    const match = trimmed.match(uuidRegex);
    
    if (!match) {
      // Check for UUID without dashes
      const noDashRegex = /^[0-9a-f]{32}$/i;
      if (noDashRegex.test(trimmed)) {
        const formatted = `${trimmed.slice(0,8)}-${trimmed.slice(8,12)}-${trimmed.slice(12,16)}-${trimmed.slice(16,20)}-${trimmed.slice(20)}`;
        return validateUuid(formatted);
      }
      return { isValid: false, version: null, variant: null };
    }

    const version = match[1];
    const variantChar = match[2].toLowerCase();
    
    let variant = 'RFC 4122';
    if (variantChar === '8' || variantChar === '9' || variantChar === 'a' || variantChar === 'b') {
      variant = 'RFC 4122';
    }

    return {
      isValid: true,
      version: `v${version}`,
      variant
    };
  };

  const handleValidate = () => {
    const lines = input.split('\n').filter(line => line.trim());
    const validationResults = lines.map(uuid => ({
      uuid: uuid.trim(),
      result: validateUuid(uuid)
    }));
    setResults(validationResults);
  };

  const validCount = results.filter(r => r.result.isValid).length;
  const invalidCount = results.filter(r => !r.result.isValid).length;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t('uuidValidator.input')}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('uuidValidator.placeholder')}
          className="w-full h-40 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleValidate}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          {t('uuidValidator.validate')}
        </button>
        <button
          onClick={() => { setInput(''); setResults([]); }}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
        >
          {t('clear')}
        </button>
      </div>

      {results.length > 0 && (
        <>
          <div className="flex gap-4 text-sm">
            <span className="text-green-400">✓ {t('uuidValidator.valid')}: {validCount}</span>
            <span className="text-red-400">✗ {t('uuidValidator.invalid')}: {invalidCount}</span>
          </div>

          <div className="space-y-2">
            {results.map((item, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  item.result.isValid
                    ? 'bg-green-900/20 border-green-700'
                    : 'bg-red-900/20 border-red-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono">{item.uuid}</code>
                  {item.result.isValid ? (
                    <div className="flex gap-3 text-sm">
                      <span className="text-green-400">{item.result.version}</span>
                      <span className="text-gray-300">{item.result.variant}</span>
                    </div>
                  ) : (
                    <span className="text-red-400 text-sm">{t('uuidValidator.invalidFormat')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="font-medium mb-2">{t('uuidValidator.versions')}</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• v1 - {t('uuidValidator.v1Desc')}</li>
          <li>• v4 - {t('uuidValidator.v4Desc')}</li>
          <li>• v5 - {t('uuidValidator.v5Desc')}</li>
        </ul>
      </div>
    </div>
  );
}
