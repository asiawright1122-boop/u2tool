'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const MORSE_CODE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/'
};

const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_CODE).map(([k, v]) => [v, k])
);

export default function MorseCode() {
  const t = useTranslations('tools.morseCode');
  const [text, setText] = useState('');
  const [morse, setMorse] = useState('');

  const textToMorse = () => {
    if (!text.trim()) {
      setMorse('');
      return;
    }
    
    const result = text
      .toUpperCase()
      .split('')
      .map(char => MORSE_CODE[char] || char)
      .join(' ');
    setMorse(result);
  };

  const morseToText = () => {
    if (!morse.trim()) {
      setText('');
      return;
    }
    
    const result = morse
      .split(' ')
      .map(code => {
        if (code === '/') return ' ';
        return REVERSE_MORSE[code] || code;
      })
      .join('');
    setText(result);
  };

  const playMorse = () => {
    if (!morse.trim()) return;
    
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const dotDuration = 0.1;
    const dashDuration = 0.3;
    const pauseDuration = 0.1;
    const letterPause = 0.3;
    const wordPause = 0.7;
    
    let time = audioContext.currentTime;
    
    for (const char of morse) {
      if (char === '.') {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = 600;
        gain.gain.value = 0.5;
        osc.start(time);
        osc.stop(time + dotDuration);
        time += dotDuration + pauseDuration;
      } else if (char === '-') {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = 600;
        gain.gain.value = 0.5;
        osc.start(time);
        osc.stop(time + dashDuration);
        time += dashDuration + pauseDuration;
      } else if (char === ' ') {
        time += letterPause;
      } else if (char === '/') {
        time += wordPause;
      }
    }
  };

  const copyMorse = () => {
    navigator.clipboard.writeText(morse);
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-gray-300">{t('text')}</label>
            <div className="flex gap-2">
              <button
                onClick={copyText}
                disabled={!text}
                className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 disabled:opacity-50 rounded transition-colors"
              >
                {t('copy')}
              </button>
              <button
                onClick={textToMorse}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                {t('toMorse')} →
              </button>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-48 bg-gray-700 rounded-lg px-4 py-3 text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder={t('textPlaceholder')}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-gray-300">{t('morse')}</label>
            <div className="flex gap-2">
              <button
                onClick={morseToText}
                className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 rounded transition-colors"
              >
                ← {t('toText')}
              </button>
              <button
                onClick={copyMorse}
                disabled={!morse}
                className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 disabled:opacity-50 rounded transition-colors"
              >
                {t('copy')}
              </button>
              <button
                onClick={playMorse}
                disabled={!morse}
                className="px-3 py-1 text-sm bg-orange-600 hover:bg-orange-700 disabled:opacity-50 rounded transition-colors"
              >
                🔊 {t('play')}
              </button>
            </div>
          </div>
          <textarea
            value={morse}
            onChange={(e) => setMorse(e.target.value)}
            className="w-full h-48 bg-gray-700 rounded-lg px-4 py-3 text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder={t('morsePlaceholder')}
          />
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-sm text-gray-300 mb-2">{t('reference')}</h3>
        <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-2 text-xs font-mono">
          {Object.entries(MORSE_CODE).slice(0, 36).map(([char, code]) => (
            <div key={char} className="text-center">
              <div className="text-white">{char === ' ' ? '␣' : char}</div>
              <div className="text-gray-300">{code}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
