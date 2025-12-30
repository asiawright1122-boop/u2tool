'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function BarcodeGenerator() {
  const t = useTranslations('tools');
  const [text, setText] = useState('123456789012');
  const [format, setFormat] = useState<'code128' | 'code39' | 'ean13' | 'upc'>('code128');

  const generateCode128 = (data: string): string => {
    const patterns: Record<string, string> = {
      ' ': '11011001100', '!': '11001101100', '"': '11001100110', '#': '10010011000',
      '$': '10010001100', '%': '10001001100', '&': '10011001000', "'": '10011000100',
      '(': '10001100100', ')': '11001001000', '*': '11001000100', '+': '11000100100',
      ',': '10110011100', '-': '10011011100', '.': '10011001110', '/': '10111001100',
      '0': '10011101100', '1': '11001110010', '2': '11001011100', '3': '11001001110',
      '4': '11011100100', '5': '11001110100', '6': '11101101110', '7': '11101001100',
      '8': '11100101100', '9': '11100100110', ':': '11101100100', ';': '11100110100',
      '<': '11100110010', '=': '11011011000', '>': '11011000110', '?': '11000110110',
      '@': '10100011000', 'A': '10001011000', 'B': '10001000110', 'C': '10110001000',
      'D': '10001101000', 'E': '10001100010', 'F': '11010001000', 'G': '11000101000',
      'H': '11000100010', 'I': '10110111000', 'J': '10110001110', 'K': '10001101110',
      'L': '10111011000', 'M': '10111000110', 'N': '10001110110', 'O': '11101110110',
      'P': '11010001110', 'Q': '11000101110', 'R': '11011101000', 'S': '11011100010',
      'T': '11011101110', 'U': '11101011000', 'V': '11101000110', 'W': '11100010110',
      'X': '11101101000', 'Y': '11101100010', 'Z': '11100011010'
    };
    const start = '11010000100';
    const stop = '1100011101011';
    let bars = start;
    for (const char of data.toUpperCase()) {
      bars += patterns[char] || patterns['?'];
    }
    bars += stop;
    return bars;
  };

  const renderBarcode = () => {
    const bars = generateCode128(text);
    return (
      <svg viewBox={`0 0 ${bars.length * 2} 100`} className="w-full h-24 bg-white dark:bg-gray-800">
        {bars.split('').map((b, i) => (
          b === '1' && <rect key={i} x={i * 2} y="10" width="2" height="80" fill="black" />
        ))}
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('barcode.text')}</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('barcode.format')}</label>
          <select value={format} onChange={(e) => setFormat(e.target.value as typeof format)} className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white">
            <option value="code128">Code 128</option>
            <option value="code39">Code 39</option>
            <option value="ean13">EAN-13</option>
            <option value="upc">UPC-A</option>
          </select>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        {renderBarcode()}
        <p className="text-center text-gray-900 dark:text-black mt-2 font-mono">{text}</p>
      </div>
    </div>
  );
}
