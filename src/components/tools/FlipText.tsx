'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const flipMap: Record<string, string> = {
  'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
  'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
  'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
  'y': 'ʎ', 'z': 'z',
  'A': '∀', 'B': 'q', 'C': 'Ɔ', 'D': 'p', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': '⅁', 'H': 'H',
  'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ',
  'Q': 'Q', 'R': 'ɹ', 'S': 'S', 'T': '⊥', 'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X',
  'Y': '⅄', 'Z': 'Z',
  '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ',
  '8': '8', '9': '6',
  '.': '˙', ',': '\'', '\'': ',', '"': '„', '`': ',', '?': '¿', '!': '¡',
  '[': ']', ']': '[', '(': ')', ')': '(', '{': '}', '}': '{',
  '<': '>', '>': '<', '&': '⅋', '_': '‾',
};

const mirrorMap: Record<string, string> = {
  'a': 'ɒ', 'b': 'd', 'c': 'ɔ', 'd': 'b', 'e': 'ɘ', 'f': 'ʇ', 'g': 'ǫ', 'h': 'ʜ',
  'i': 'i', 'j': 'ꞁ', 'k': 'ʞ', 'l': 'l', 'm': 'm', 'n': 'ᴎ', 'o': 'o', 'p': 'q',
  'q': 'p', 'r': 'ɿ', 's': 'ꙅ', 't': 'ƚ', 'u': 'u', 'v': 'v', 'w': 'w', 'x': 'x',
  'y': 'ʏ', 'z': 'ꙃ',
  'A': 'A', 'B': 'ᙠ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'ꟻ', 'G': 'Ꭾ', 'H': 'H',
  'I': 'I', 'J': 'Ⴑ', 'K': 'ꓘ', 'L': '⅃', 'M': 'M', 'N': 'И', 'O': 'O', 'P': 'ꟼ',
  'Q': 'Ọ', 'R': 'Я', 'S': 'Ꙅ', 'T': 'T', 'U': 'U', 'V': 'V', 'W': 'W', 'X': 'X',
  'Y': 'Y', 'Z': 'Ꙃ',
  '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{',
  '<': '>', '>': '<', '/': '\\', '\\': '/',
};

export default function FlipText() {
  const t = useTranslations('tools.flip-text');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const flipText = (text: string): string => {
    return text.split('').map(char => flipMap[char] || char).reverse().join('');
  };

  const mirrorText = (text: string): string => {
    return text.split('').map(char => mirrorMap[char] || char).reverse().join('');
  };

  const reverseText = (text: string): string => {
    return text.split('').reverse().join('');
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const results = [
    { type: 'flipped', label: t('upsideDown'), text: flipText(input) },
    { type: 'mirrored', label: t('mirrored'), text: mirrorText(input) },
    { type: 'reversed', label: t('reversed'), text: reverseText(input) },
  ];

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('inputLabel')}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('inputPlaceholder')}
          className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div className="space-y-4">
        {results.map(({ type, label, text }) => (
          <div key={type} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
              <button
                onClick={() => copyToClipboard(text, type)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {copied === type ? t('copied') : t('copy')}
              </button>
            </div>
            <div className="text-lg font-mono text-gray-900 dark:text-white break-all min-h-[2rem]">
              {text || <span className="text-gray-400">{t('outputPlaceholder')}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('aboutTitle')}</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">{t('aboutDescription')}</p>
      </div>
    </div>
  );
}
