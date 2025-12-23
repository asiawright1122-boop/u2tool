'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function TextDiffPatch() {
  const t = useTranslations('tools.text-diff-patch');
  const [original, setOriginal] = useState('Hello World\nThis is line 2\nThis is line 3\nThis is line 4');
  const [modified, setModified] = useState('Hello World\nThis is modified line 2\nThis is line 3\nNew line inserted\nThis is line 4');
  const [patch, setPatch] = useState('');
  const [mode, setMode] = useState<'create' | 'apply'>('create');
  const [patchInput, setPatchInput] = useState('');
  const [patchResult, setPatchResult] = useState('');

  const createPatch = () => {
    const origLines = original.split('\n');
    const modLines = modified.split('\n');
    const patches: string[] = [];
    
    patches.push('--- original');
    patches.push('+++ modified');
    
    let i = 0, j = 0;
    while (i < origLines.length || j < modLines.length) {
      if (i >= origLines.length) {
        patches.push(`@@ -${i + 1},0 +${j + 1},1 @@`);
        patches.push(`+${modLines[j]}`);
        j++;
      } else if (j >= modLines.length) {
        patches.push(`@@ -${i + 1},1 +${j + 1},0 @@`);
        patches.push(`-${origLines[i]}`);
        i++;
      } else if (origLines[i] === modLines[j]) {
        i++; j++;
      } else {
        patches.push(`@@ -${i + 1},1 +${j + 1},1 @@`);
        patches.push(`-${origLines[i]}`);
        patches.push(`+${modLines[j]}`);
        i++; j++;
      }
    }
    
    setPatch(patches.join('\n'));
  };

  const applyPatch = () => {
    try {
      const lines = original.split('\n');
      const patchLines = patchInput.split('\n');
      const result = [...lines];
      let offset = 0;
      
      for (let i = 0; i < patchLines.length; i++) {
        const line = patchLines[i];
        if (line.startsWith('@@')) {
          const match = line.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/);
          if (match) {
            const origLine = parseInt(match[1]) - 1 + offset;
            const nextLine = patchLines[i + 1];
            if (nextLine?.startsWith('-')) {
              result.splice(origLine, 1);
              offset--;
              if (patchLines[i + 2]?.startsWith('+')) {
                result.splice(origLine, 0, patchLines[i + 2].slice(1));
                offset++;
                i += 2;
              } else { i++; }
            } else if (nextLine?.startsWith('+')) {
              result.splice(origLine, 0, nextLine.slice(1));
              offset++;
              i++;
            }
          }
        }
      }
      setPatchResult(result.join('\n'));
    } catch { setPatchResult(t('errorApply')); }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button onClick={() => setMode('create')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'create' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          {t('createPatch')}
        </button>
        <button onClick={() => setMode('apply')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'apply' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          {t('applyPatch')}
        </button>
      </div>

      {mode === 'create' ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('originalText')}</label>
              <textarea value={original} onChange={(e) => setOriginal(e.target.value)}
                className="w-full h-48 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('modifiedText')}</label>
              <textarea value={modified} onChange={(e) => setModified(e.target.value)}
                className="w-full h-48 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm" />
            </div>
          </div>
          <button onClick={createPatch}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
            {t('createPatch')}
          </button>
          {patch && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('generatedPatch')}</label>
              <pre className="bg-gray-700 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                {patch.split('\n').map((line, i) => (
                  <div key={i} className={line.startsWith('+') ? 'text-green-400' : line.startsWith('-') ? 'text-red-400' : line.startsWith('@@') ? 'text-blue-400' : 'text-gray-300'}>
                    {line}
                  </div>
                ))}
              </pre>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('originalText')}</label>
              <textarea value={original} onChange={(e) => setOriginal(e.target.value)}
                className="w-full h-40 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('patch')}</label>
              <textarea value={patchInput} onChange={(e) => setPatchInput(e.target.value)}
                className="w-full h-40 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm"
                placeholder={t('patchPlaceholder')} />
            </div>
          </div>
          <button onClick={applyPatch}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors">
            {t('applyPatch')}
          </button>
          {patchResult && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('result')}</label>
              <textarea value={patchResult} readOnly
                className="w-full h-40 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
