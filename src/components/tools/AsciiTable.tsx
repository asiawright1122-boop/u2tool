'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface AsciiChar {
  dec: number;
  hex: string;
  oct: string;
  bin: string;
  char: string;
  description: string;
}

export default function AsciiTable() {
  const t = useTranslations('tools.ascii-table');
  const [searchTerm, setSearchTerm] = useState('');
  const [showExtended, setShowExtended] = useState(false);
  const [selectedChar, setSelectedChar] = useState<AsciiChar | null>(null);

  const controlCharDescriptions: Record<number, string> = {
    0: 'NUL (Null)',
    1: 'SOH (Start of Heading)',
    2: 'STX (Start of Text)',
    3: 'ETX (End of Text)',
    4: 'EOT (End of Transmission)',
    5: 'ENQ (Enquiry)',
    6: 'ACK (Acknowledge)',
    7: 'BEL (Bell)',
    8: 'BS (Backspace)',
    9: 'HT (Horizontal Tab)',
    10: 'LF (Line Feed)',
    11: 'VT (Vertical Tab)',
    12: 'FF (Form Feed)',
    13: 'CR (Carriage Return)',
    14: 'SO (Shift Out)',
    15: 'SI (Shift In)',
    16: 'DLE (Data Link Escape)',
    17: 'DC1 (Device Control 1)',
    18: 'DC2 (Device Control 2)',
    19: 'DC3 (Device Control 3)',
    20: 'DC4 (Device Control 4)',
    21: 'NAK (Negative Acknowledge)',
    22: 'SYN (Synchronous Idle)',
    23: 'ETB (End of Trans. Block)',
    24: 'CAN (Cancel)',
    25: 'EM (End of Medium)',
    26: 'SUB (Substitute)',
    27: 'ESC (Escape)',
    28: 'FS (File Separator)',
    29: 'GS (Group Separator)',
    30: 'RS (Record Separator)',
    31: 'US (Unit Separator)',
    32: 'Space',
    127: 'DEL (Delete)',
  };

  const asciiChars = useMemo(() => {
    const chars: AsciiChar[] = [];
    const maxCode = showExtended ? 255 : 127;

    for (let i = 0; i <= maxCode; i++) {
      let char = '';
      let description = '';

      if (i < 32) {
        char = `^${String.fromCharCode(64 + i)}`;
        description = controlCharDescriptions[i] || '';
      } else if (i === 32) {
        char = '␣';
        description = controlCharDescriptions[32];
      } else if (i === 127) {
        char = '^?';
        description = controlCharDescriptions[127];
      } else if (i > 127) {
        char = String.fromCharCode(i);
        description = `Extended ASCII ${i}`;
      } else {
        char = String.fromCharCode(i);
        description = `Printable: ${char}`;
      }

      chars.push({
        dec: i,
        hex: i.toString(16).toUpperCase().padStart(2, '0'),
        oct: i.toString(8).padStart(3, '0'),
        bin: i.toString(2).padStart(8, '0'),
        char,
        description,
      });
    }

    return chars;
  }, [showExtended]);

  const filteredChars = useMemo(() => {
    if (!searchTerm) return asciiChars;

    const term = searchTerm.toLowerCase();
    return asciiChars.filter(
      (c) =>
        c.dec.toString().includes(term) ||
        c.hex.toLowerCase().includes(term) ||
        c.char.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term)
    );
  }, [asciiChars, searchTerm]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showExtended}
            onChange={(e) => setShowExtended(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">{t('showExtended')}</span>
        </label>
      </div>

      {selectedChar && (
        <div className="p-4 bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-blue-300">{t('selectedChar')}</h3>
            <button
              onClick={() => setSelectedChar(null)}
              className="text-blue-400 hover:text-blue-300"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-300">{t('decimal')}:</span>
              <span className="ml-2 font-mono text-gray-100">{selectedChar.dec}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-300">{t('hex')}:</span>
              <span className="ml-2 font-mono text-gray-100">0x{selectedChar.hex}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-300">{t('octal')}:</span>
              <span className="ml-2 font-mono text-gray-100">0{selectedChar.oct}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-300">{t('binary')}:</span>
              <span className="ml-2 font-mono text-gray-100">{selectedChar.bin}</span>
            </div>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{selectedChar.description}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-2 text-left font-medium text-gray-700 dark:text-gray-200">{t('decimal')}</th>
              <th className="p-2 text-left font-medium text-gray-700 dark:text-gray-200">{t('hex')}</th>
              <th className="p-2 text-left font-medium text-gray-700 dark:text-gray-200">{t('octal')}</th>
              <th className="p-2 text-left font-medium text-gray-700 dark:text-gray-200">{t('binary')}</th>
              <th className="p-2 text-left font-medium text-gray-700 dark:text-gray-200">{t('char')}</th>
              <th className="p-2 text-left font-medium text-gray-700 dark:text-gray-200">{t('descriptionHeader')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredChars.map((c) => (
              <tr
                key={c.dec}
                onClick={() => setSelectedChar(c)}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <td className="p-2 font-mono text-gray-900 dark:text-gray-100">{c.dec}</td>
                <td className="p-2 font-mono text-gray-900 dark:text-gray-100">0x{c.hex}</td>
                <td className="p-2 font-mono text-gray-900 dark:text-gray-100">0{c.oct}</td>
                <td className="p-2 font-mono text-gray-900 dark:text-gray-100">{c.bin}</td>
                <td className="p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (c.dec >= 32 && c.dec !== 127) {
                        copyToClipboard(String.fromCharCode(c.dec));
                      }
                    }}
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded font-mono text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    {c.char}
                  </button>
                </td>
                <td className="p-2 text-gray-600 dark:text-gray-300 truncate max-w-xs">{c.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredChars.length === 0 && (
        <div className="text-center py-8 text-gray-600 dark:text-gray-300">
          {t('noResults')}
        </div>
      )}

      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{t('quickReference')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-300">0-31:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">{t('controlChars')}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-300">32-47:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">{t('punctuation')}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-300">48-57:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">{t('digits')}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-300">65-90:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">{t('uppercase')}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-300">97-122:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">{t('lowercase')}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-300">128-255:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">{t('extended')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
