'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { textToMorse, morseToText } from '@/lib/calculator-utils';

export default function MorseCodePlayer() {
  const t = useTranslations('tools.morse-code-player');
  const tc = useTranslations('tools');

  const [inputText, setInputText] = useState<string>('HELLO WORLD');
  const [morseCode, setMorseCode] = useState<string>('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [frequency, setFrequency] = useState<number>(600);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    if (mode === 'encode') {
      const morse = textToMorse(inputText);
      setMorseCode(morse);
    } else {
      const text = morseToText(inputText);
      setMorseCode(text);
    }
  }, [inputText, mode]);

  const playMorse = async () => {
    if (isPlaying) return;

    const morse = mode === 'encode' ? textToMorse(inputText) : inputText;
    if (!morse) return;

    setIsPlaying(true);

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    const dotDuration = 100 / speed;
    const dashDuration = dotDuration * 3;
    const pauseDuration = dotDuration;
    const letterPause = dotDuration * 3;
    const wordPause = dotDuration * 7;

    let currentTime = ctx.currentTime;

    for (const char of morse) {
      if (char === '.') {
        playTone(ctx, currentTime, dotDuration / 1000, frequency);
        currentTime += dotDuration / 1000 + pauseDuration / 1000;
      } else if (char === '-') {
        playTone(ctx, currentTime, dashDuration / 1000, frequency);
        currentTime += dashDuration / 1000 + pauseDuration / 1000;
      } else if (char === ' ') {
        currentTime += letterPause / 1000;
      } else if (char === '/') {
        currentTime += wordPause / 1000;
      }
    }

    setTimeout(() => {
      setIsPlaying(false);
    }, (currentTime - ctx.currentTime) * 1000);
  };

  const playTone = (ctx: AudioContext, startTime: number, duration: number, freq: number) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = freq;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(morseCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('encode')}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
            mode === 'encode'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('textToMorse')}
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
            mode === 'decode'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('morseToText')}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {mode === 'encode' ? t('inputText') : t('inputMorse')}
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value.toUpperCase())}
          className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono resize-none"
          placeholder={mode === 'encode' ? 'HELLO WORLD' : '.... . .-.. .-.. ---'}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('speed')}: {speed}x
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('frequency')}: {frequency}Hz
          </label>
          <input
            type="range"
            min="400"
            max="1000"
            step="50"
            value={frequency}
            onChange={(e) => setFrequency(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={convert}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {tc('convert')}
        </button>
        <button
          onClick={playMorse}
          disabled={isPlaying}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
            isPlaying
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isPlaying ? t('playing') : t('play')} 🔊
        </button>
      </div>

      {morseCode && (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {mode === 'encode' ? t('morseOutput') : t('textOutput')}
              </label>
              <button
                onClick={copyToClipboard}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {copied ? tc('copied') : tc('copy')}
              </button>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono text-lg break-all">
              {morseCode}
            </div>
          </div>

          {mode === 'encode' && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('visualization')}</div>
              <div className="flex flex-wrap gap-1">
                {morseCode.split('').map((char, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center justify-center ${
                      char === '.'
                        ? 'w-3 h-3 bg-blue-500 rounded-full'
                        : char === '-'
                        ? 'w-8 h-3 bg-blue-500 rounded'
                        : char === ' '
                        ? 'w-2'
                        : char === '/'
                        ? 'w-4'
                        : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('legend')}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full" />
                <span>{t('dot')} (.)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-3 bg-blue-500 rounded" />
                <span>{t('dash')} (-)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-3 bg-gray-300 dark:bg-gray-600" />
                <span>{t('letterSpace')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-3 bg-gray-300 dark:bg-gray-600" />
                <span>{t('wordSpace')} (/)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
