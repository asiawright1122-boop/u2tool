'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const NATO_ALPHABET: Record<string, string> = {
  'A': 'Alpha', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta',
  'E': 'Echo', 'F': 'Foxtrot', 'G': 'Golf', 'H': 'Hotel',
  'I': 'India', 'J': 'Juliet', 'K': 'Kilo', 'L': 'Lima',
  'M': 'Mike', 'N': 'November', 'O': 'Oscar', 'P': 'Papa',
  'Q': 'Quebec', 'R': 'Romeo', 'S': 'Sierra', 'T': 'Tango',
  'U': 'Uniform', 'V': 'Victor', 'W': 'Whiskey', 'X': 'X-ray',
  'Y': 'Yankee', 'Z': 'Zulu',
  '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three',
  '4': 'Four', '5': 'Five', '6': 'Six', '7': 'Seven',
  '8': 'Eight', '9': 'Nine',
  ' ': '(space)', '.': 'Stop', ',': 'Comma', '?': 'Question',
  '!': 'Exclamation', '-': 'Dash', '/': 'Slash', '@': 'At',
};

export default function TextToNato() {
  const t = useTranslations('tools.text-to-nato');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [separator, setSeparator] = useState<'newline' | 'dash' | 'space'>('newline');
  const [showOriginal, setShowOriginal] = useState(true);

  const textToNato = useCallback((text: string): string => {
    const chars = text.toUpperCase().split('');
    const results: string[] = [];

    for (const char of chars) {
      if (NATO_ALPHABET[char]) {
        if (showOriginal) {
          results.push(`${char} - ${NATO_ALPHABET[char]}`);
        } else {
          results.push(NATO_ALPHABET[char]);
        }
      } else if (char.trim()) {
        results.push(showOriginal ? `${char} - [${t('unknown')}]` : `[${char}]`);
      }
    }

    const sep = separator === 'newline' ? '\n' : separator === 'dash' ? ' - ' : ' ';
    return results.join(sep);
  }, [separator, showOriginal, t]);

  const handleConvert = () => {
    setOutput(textToNato(input));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const loadSample = () => {
    setInput(t('sampleText'));
    setOutput('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">{t('separator')}:</label>
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value as 'newline' | 'dash' | 'space')}
            className="p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100"
          >
            <option value="newline">{t('sepNewline')}</option>
            <option value="dash">{t('sepDash')}</option>
            <option value="space">{t('sepSpace')}</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOriginal}
            onChange={(e) => setShowOriginal(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-300">{t('showOriginal')}</span>
        </label>

        <button
          onClick={loadSample}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {t('loadSample')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            {t('textInput')}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('textPlaceholder')}
            className="w-full h-48 p-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-100"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-300">
              {t('natoOutput')}
            </label>
            {output && (
              <button
                onClick={handleCopy}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {t('copy')}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={t('natoPlaceholder')}
            className="w-full h-48 p-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-100 font-mono"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleConvert}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('convert')}
        </button>
      </div>

      <div className="p-4 bg-gray-900 rounded-lg">
        <h3 className="font-medium text-gray-100 mb-3">{t('alphabet')}</h3>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2 text-sm">
          {Object.entries(NATO_ALPHABET).slice(0, 26).map(([letter, word]) => (
            <div key={letter} className="p-2 bg-gray-800 rounded text-center">
              <div className="font-bold text-blue-600">{letter}</div>
              <div className="text-gray-300 text-xs">{word}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
