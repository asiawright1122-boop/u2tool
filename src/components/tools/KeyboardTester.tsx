'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface KeyInfo {
  key: string;
  code: string;
  keyCode: number;
  pressed: boolean;
}

const keyboardLayout = [
  ['Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
  ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
  ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
  ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
  ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight'],
  ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'MetaRight', 'ControlRight'],
];

const keyLabels: Record<string, string> = {
  Escape: 'Esc', Backspace: '⌫', Tab: 'Tab', CapsLock: 'Caps', Enter: 'Enter',
  ShiftLeft: 'Shift', ShiftRight: 'Shift', ControlLeft: 'Ctrl', ControlRight: 'Ctrl',
  AltLeft: 'Alt', AltRight: 'Alt', MetaLeft: '⌘', MetaRight: '⌘', Space: 'Space',
  Backquote: '`', Minus: '-', Equal: '=', BracketLeft: '[', BracketRight: ']',
  Backslash: '\\', Semicolon: ';', Quote: "'", Comma: ',', Period: '.', Slash: '/',
};

export default function KeyboardTester() {
  const t = useTranslations('tools.keyboard-tester');

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [lastKey, setLastKey] = useState<KeyInfo | null>(null);
  const [keyHistory, setKeyHistory] = useState<KeyInfo[]>([]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    const keyInfo: KeyInfo = {
      key: e.key,
      code: e.code,
      keyCode: e.keyCode,
      pressed: true,
    };
    setLastKey(keyInfo);
    setKeyHistory((prev) => [keyInfo, ...prev.slice(0, 9)]);
    setPressedKeys((prev) => new Set(prev).add(e.code));
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    setPressedKeys((prev) => {
      const next = new Set(prev);
      next.delete(e.code);
      return next;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const getKeyLabel = (code: string) => {
    if (keyLabels[code]) return keyLabels[code];
    if (code.startsWith('Key')) return code.slice(3);
    if (code.startsWith('Digit')) return code.slice(5);
    if (code.startsWith('F') && code.length <= 3) return code;
    return code;
  };

  const getKeyWidth = (code: string) => {
    if (code === 'Space') return 'w-48';
    if (code === 'Backspace' || code === 'Tab' || code === 'CapsLock' || code === 'Enter') return 'w-20';
    if (code.includes('Shift')) return 'w-24';
    if (code.includes('Control') || code.includes('Alt') || code.includes('Meta')) return 'w-14';
    return 'w-10';
  };

  const clearHistory = () => {
    setKeyHistory([]);
    setLastKey(null);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
        <p className="text-blue-700 dark:text-blue-300">{t('pressAnyKey')}</p>
      </div>

      {lastKey && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-3">{t('lastKeyPressed')}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('key')}</div>
              <div className="text-2xl font-mono font-bold">{lastKey.key}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('code')}</div>
              <div className="text-lg font-mono">{lastKey.code}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('keyCode')}</div>
              <div className="text-lg font-mono">{lastKey.keyCode}</div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-gray-900 rounded-lg overflow-x-auto">
        <div className="min-w-max space-y-1">
          {keyboardLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1 justify-center">
              {row.map((code) => (
                <button
                  key={code}
                  className={`${getKeyWidth(code)} h-10 rounded text-xs font-medium transition-all ${
                    pressedKeys.has(code)
                      ? 'bg-blue-500 text-white scale-95'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {getKeyLabel(code)}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">{t('keyHistory')}</h3>
          <button
            onClick={clearHistory}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {t('clear')}
          </button>
        </div>
        {keyHistory.length > 0 ? (
          <div className="space-y-2">
            {keyHistory.map((key, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-2 bg-white dark:bg-gray-700 rounded text-sm"
              >
                <span className="font-mono font-bold w-16">{key.key}</span>
                <span className="font-mono text-gray-500">{key.code}</span>
                <span className="font-mono text-gray-400">({key.keyCode})</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">{t('noKeysPressed')}</p>
        )}
      </div>

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h3 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">{t('tips')}</h3>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>• {t('tip1')}</li>
          <li>• {t('tip2')}</li>
          <li>• {t('tip3')}</li>
        </ul>
      </div>
    </div>
  );
}
