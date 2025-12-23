'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function TextToSpeech() {
  const t = useTranslations('tools');
  const [text, setText] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [voice, setVoice] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const v = speechSynthesis.getVoices();
      if (v.length > 0) setVoices(v);
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = () => {
    if (!text) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    if (voices[voice]) utterance.voice = voices[voice];
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <div className="space-y-4">
      <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-40 p-3 bg-gray-800 border border-gray-700 rounded-lg" placeholder={t('tts.placeholder')} />
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('tts.voice')}</label>
          <select value={voice} onChange={(e) => setVoice(Number(e.target.value))} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg">
            {voices.map((v, i) => <option key={i} value={i}>{v.name} ({v.lang})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('tts.rate')}: {rate}</label>
          <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('tts.pitch')}: {pitch}</label>
          <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(Number(e.target.value))} className="w-full" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={speak} disabled={speaking || !text} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{t('tts.speak')}</button>
        <button onClick={stop} disabled={!speaking} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">{t('tts.stop')}</button>
      </div>
    </div>
  );
}
