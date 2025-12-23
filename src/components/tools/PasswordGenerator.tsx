'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function PasswordGenerator() {
  const t = useTranslations('tools');
  const tp = useTranslations('tools.password-generator');
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let chars = '';
    if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (options.numbers) chars += '0123456789';
    if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      setPassword(tp('selectOption'));
      return;
    }

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, []);

  const copyPassword = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleOption = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Password Display */}
      <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="font-mono text-lg break-all select-all">{password}</span>
          <button
            onClick={copyPassword}
            className={`ml-4 px-4 py-2 rounded ${copied ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
      </div>

      {/* Length Slider */}
      <div>
        <label className="block text-sm font-medium mb-2">
          {t('length')}: {length}
        </label>
        <input
          type="range"
          min="8"
          max="64"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { key: 'uppercase', label: t('password.uppercase') },
          { key: 'lowercase', label: t('password.lowercase') },
          { key: 'numbers', label: t('password.numbers') },
          { key: 'symbols', label: t('password.symbols') },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options[key as keyof typeof options]}
              onChange={() => toggleOption(key as keyof typeof options)}
              className="w-4 h-4"
            />
            <span>{label}</span>
          </label>
        ))}
      </div>

      {/* Generate Button */}
      <button onClick={generatePassword} className="btn-primary w-full">
        {t('generate')} {t('password.newPassword')}
      </button>
    </div>
  );
}
