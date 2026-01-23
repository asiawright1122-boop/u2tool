'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

type TextStyle = 'subscript' | 'superscript' | 'smallcaps';

const subscriptMap: Record<string, string> = {
  'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ',
  'n': 'ₙ', 'o': 'ₒ', 'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ', 'v': 'ᵥ',
  'x': 'ₓ',
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇',
  '8': '₈', '9': '₉', '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
};

const superscriptMap: Record<string, string> = {
  'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ',
  'i': 'ⁱ', 'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ',
  'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ',
  'z': 'ᶻ',
  'A': 'ᴬ', 'B': 'ᴮ', 'D': 'ᴰ', 'E': 'ᴱ', 'G': 'ᴳ', 'H': 'ᴴ', 'I': 'ᴵ', 'J': 'ᴶ',
  'K': 'ᴷ', 'L': 'ᴸ', 'M': 'ᴹ', 'N': 'ᴺ', 'O': 'ᴼ', 'P': 'ᴾ', 'R': 'ᴿ', 'T': 'ᵀ',
  'U': 'ᵁ', 'V': 'ⱽ', 'W': 'ᵂ',
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷',
  '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
};

const smallCapsMap: Record<string, string> = {
  'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ',
  'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ',
  'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x',
  'y': 'ʏ', 'z': 'ᴢ',
};

export default function SmallTextGenerator() {
  const t = useTranslations('tools.small-text-generator');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const convertText = (text: string, style: TextStyle): string => {
    const map = style === 'subscript' ? subscriptMap : style === 'superscript' ? superscriptMap : smallCapsMap;
    return text.split('').map(char => {
      const lower = char.toLowerCase();
      return map[char] || map[lower] || char;
    }).join('');
  };

  const copyToClipboard = (text: string, style: string) => {
    navigator.clipboard.writeText(text);
    setCopied(style);
    setTimeout(() => setCopied(null), 2000);
  };

  const styles: { type: TextStyle; label: string; example: string }[] = [
    { type: 'superscript', label: t('superscript'), example: 'ˢᵘᵖᵉʳˢᶜʳⁱᵖᵗ' },
    { type: 'subscript', label: t('subscript'), example: 'ₛᵤᵦₛ꜀ᵣᵢₚₜ' },
    { type: 'smallcaps', label: t('smallCaps'), example: 'sᴍᴀʟʟ ᴄᴀᴘs' },
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
        {styles.map(({ type, label, example }) => (
          <div key={type} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">{label}</span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">({example})</span>
              </div>
              <button
                onClick={() => copyToClipboard(convertText(input, type), type)}
                disabled={!input}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied === type ? t('copied') : t('copy')}
              </button>
            </div>
            <div className="text-lg text-gray-900 dark:text-white break-all min-h-[2rem] p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
              {input ? convertText(input, type) : <span className="text-gray-400">{t('outputPlaceholder')}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('usageTitle')}</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">{t('usageDescription')}</p>
      </div>
    </div>
  );
}
