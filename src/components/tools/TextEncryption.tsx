'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function TextEncryption() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  const encrypt = async (text: string, key: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const keyData = encoder.encode(key.padEnd(32, '0').slice(0, 32));
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw', keyData, { name: 'AES-GCM' }, false, ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv }, cryptoKey, data
    );
    
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  };

  const decrypt = async (text: string, key: string): Promise<string> => {
    const combined = Uint8Array.from(atob(text), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key.padEnd(32, '0').slice(0, 32));
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw', keyData, { name: 'AES-GCM' }, false, ['decrypt']
    );
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv }, cryptoKey, data
    );
    
    return new TextDecoder().decode(decrypted);
  };

  const handleProcess = async () => {
    if (!input || !password) return;
    try {
      if (mode === 'encrypt') {
        const result = await encrypt(input, password);
        setOutput(result);
      } else {
        const result = await decrypt(input, password);
        setOutput(result);
      }
    } catch {
      setOutput(t('encryption.error'));
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('encrypt')}
          className={`px-4 py-2 rounded ${mode === 'encrypt' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
        >
          {t('encryption.encrypt')}
        </button>
        <button
          onClick={() => setMode('decrypt')}
          className={`px-4 py-2 rounded ${mode === 'decrypt' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
        >
          {t('encryption.decrypt')}
        </button>
      </div>

      <div>
        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">{t('encryption.password')}</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white"
          placeholder={t('encryption.passwordPlaceholder')}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">{t('input')}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white font-mono text-sm"
          placeholder={t('encryption.inputPlaceholder')}
        />
      </div>

      <button
        onClick={handleProcess}
        className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-medium text-white"
      >
        {mode === 'encrypt' ? t('encryption.encrypt') : t('encryption.decrypt')}
      </button>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm text-gray-700 dark:text-gray-300">{t('output')}</label>
          <button onClick={copyOutput} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
            {t('copy')}
          </button>
        </div>
        <textarea
          value={output}
          readOnly
          className="w-full h-32 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white font-mono text-sm"
        />
      </div>
    </div>
  );
}
