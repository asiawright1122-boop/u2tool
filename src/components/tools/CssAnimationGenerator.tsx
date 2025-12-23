'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const presetKeys = ['bounce', 'pulse', 'shake', 'spin', 'fadeIn', 'slideIn', 'zoomIn', 'flip'] as const;

const presetKeyframes: Record<string, string> = {
  bounce: '@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }',
  pulse: '@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }',
  shake: '@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }',
  spin: '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }',
  fadeIn: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }',
  slideIn: '@keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }',
  zoomIn: '@keyframes zoomIn { from { transform: scale(0); } to { transform: scale(1); } }',
  flip: '@keyframes flip { from { transform: rotateY(0); } to { transform: rotateY(180deg); } }',
};

// Inject all keyframes into document head
const allKeyframes = Object.values(presetKeyframes).join('\n');

export default function CssAnimationGenerator() {
  const t = useTranslations('tools');
  const [animation, setAnimation] = useState('bounce');
  const [duration, setDuration] = useState('1');
  const [timing, setTiming] = useState('ease');
  const [iteration, setIteration] = useState('infinite');
  const [copied, setCopied] = useState(false);

  const timingFunctions = ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'];
  const iterations = ['1', '2', '3', 'infinite'];

  // Inject keyframes into document
  useEffect(() => {
    const styleId = 'css-animation-keyframes';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = allKeyframes;
      document.head.appendChild(style);
    }
    return () => {
      const style = document.getElementById(styleId);
      if (style) style.remove();
    };
  }, []);

  const animationCSS = `animation: ${animation} ${duration}s ${timing} ${iteration};`;
  const fullCSS = `${presetKeyframes[animation]}\n\n.animated {\n  ${animationCSS}\n}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('cssAnimation.preset')}</label>
            <div className="grid grid-cols-4 gap-2">
              {presetKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => setAnimation(key)}
                  className={`p-2 rounded text-xs ${animation === key ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                >
                  {t(`cssAnimation.${key}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">{t('cssAnimation.duration')}</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="0.1"
                step="0.1"
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">{t('cssAnimation.timing')}</label>
              <select
                value={timing}
                onChange={(e) => setTiming(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
              >
                {timingFunctions.map(tf => <option key={tf} value={tf}>{tf}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">{t('cssAnimation.iteration')}</label>
              <select
                value={iteration}
                onChange={(e) => setIteration(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
              >
                {iterations.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('cssAnimation.preview')}</label>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
            <div
              className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"
              style={{ animation: `${animation} ${duration}s ${timing} ${iteration}` }}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-300">{t('output')}</label>
          <button onClick={copyToClipboard} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm font-mono text-green-400 overflow-x-auto">
          {fullCSS}
        </pre>
      </div>
    </div>
  );
}
