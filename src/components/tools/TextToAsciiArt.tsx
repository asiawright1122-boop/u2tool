'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const ASCII_FONTS: Record<string, Record<string, string[]>> = {
  standard: {
    'A': ['  █  ', ' █ █ ', '█████', '█   █', '█   █'],
    'B': ['████ ', '█   █', '████ ', '█   █', '████ '],
    'C': [' ████', '█    ', '█    ', '█    ', ' ████'],
    'D': ['████ ', '█   █', '█   █', '█   █', '████ '],
    'E': ['█████', '█    ', '████ ', '█    ', '█████'],
    'F': ['█████', '█    ', '████ ', '█    ', '█    '],
    'G': [' ████', '█    ', '█  ██', '█   █', ' ████'],
    'H': ['█   █', '█   █', '█████', '█   █', '█   █'],
    'I': ['█████', '  █  ', '  █  ', '  █  ', '█████'],
    'J': ['█████', '   █ ', '   █ ', '█  █ ', ' ██  '],
    'K': ['█   █', '█  █ ', '███  ', '█  █ ', '█   █'],
    'L': ['█    ', '█    ', '█    ', '█    ', '█████'],
    'M': ['█   █', '██ ██', '█ █ █', '█   █', '█   █'],
    'N': ['█   █', '██  █', '█ █ █', '█  ██', '█   █'],
    'O': [' ███ ', '█   █', '█   █', '█   █', ' ███ '],
    'P': ['████ ', '█   █', '████ ', '█    ', '█    '],
    'Q': [' ███ ', '█   █', '█ █ █', '█  █ ', ' ██ █'],
    'R': ['████ ', '█   █', '████ ', '█  █ ', '█   █'],
    'S': [' ████', '█    ', ' ███ ', '    █', '████ '],
    'T': ['█████', '  █  ', '  █  ', '  █  ', '  █  '],
    'U': ['█   █', '█   █', '█   █', '█   █', ' ███ '],
    'V': ['█   █', '█   █', '█   █', ' █ █ ', '  █  '],
    'W': ['█   █', '█   █', '█ █ █', '██ ██', '█   █'],
    'X': ['█   █', ' █ █ ', '  █  ', ' █ █ ', '█   █'],
    'Y': ['█   █', ' █ █ ', '  █  ', '  █  ', '  █  '],
    'Z': ['█████', '   █ ', '  █  ', ' █   ', '█████'],
    ' ': ['     ', '     ', '     ', '     ', '     '],
    '0': [' ███ ', '█  ██', '█ █ █', '██  █', ' ███ '],
    '1': ['  █  ', ' ██  ', '  █  ', '  █  ', '█████'],
    '2': [' ███ ', '█   █', '  ██ ', ' █   ', '█████'],
    '3': ['████ ', '    █', ' ███ ', '    █', '████ '],
    '4': ['█   █', '█   █', '█████', '    █', '    █'],
    '5': ['█████', '█    ', '████ ', '    █', '████ '],
    '6': [' ███ ', '█    ', '████ ', '█   █', ' ███ '],
    '7': ['█████', '    █', '   █ ', '  █  ', '  █  '],
    '8': [' ███ ', '█   █', ' ███ ', '█   █', ' ███ '],
    '9': [' ███ ', '█   █', ' ████', '    █', ' ███ '],
  }
};

export default function TextToAsciiArt() {
  const t = useTranslations('tools.text-to-ascii-art');
  const [input, setInput] = useState('HELLO');
  const [output, setOutput] = useState('');
  const [char, setChar] = useState('█');

  const convert = () => {
    const text = input.toUpperCase();
    const font = ASCII_FONTS.standard;
    const lines: string[] = ['', '', '', '', ''];
    
    for (const c of text) {
      const charArt = font[c] || font[' '];
      for (let i = 0; i < 5; i++) {
        lines[i] += (charArt[i] || '     ').replace(/█/g, char) + ' ';
      }
    }
    
    setOutput(lines.join('\n'));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('input')}
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={20}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            placeholder={t('placeholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('character')}
          </label>
          <select
            value={char}
            onChange={(e) => setChar(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            <option value="█">{t('charBlock')}</option>
            <option value="#">{t('charHash')}</option>
            <option value="*">{t('charStar')}</option>
            <option value="@">{t('charAt')}</option>
            <option value="$">{t('charDollar')}</option>
            <option value="+">{t('charPlus')}</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={convert}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
        >
          {t('convert')}
        </button>
        <button
          onClick={copyToClipboard}
          disabled={!output}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-9000 disabled:opacity-50 rounded-lg font-medium transition-colors"
        >
          {t('copy')}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t('output')}
        </label>
        <pre className="w-full min-h-[200px] px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-green-400 font-mono text-sm overflow-x-auto whitespace-pre">
          {output || t('outputPlaceholder')}
        </pre>
      </div>
    </div>
  );
}
