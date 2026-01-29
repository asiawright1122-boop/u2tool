'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface LeakResult {
  issues: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    line: number;
    code: string;
    description: string;
    fix: string;
  }>;
  score: number;
}

function detectMemoryLeaks(code: string): LeakResult {
  const issues: LeakResult['issues'] = [];
  const lines = code.split('\n');
  
  const patterns = [
    {
      regex: /addEventListener\s*\([^)]+\)/g,
      check: (code: string) => !code.includes('removeEventListener'),
      type: 'Event Listener Leak',
      severity: 'high' as const,
      description: 'Event listener added without corresponding removeEventListener',
      fix: 'Add removeEventListener in cleanup/unmount function',
    },
    {
      regex: /setInterval\s*\([^)]+\)/g,
      check: (code: string) => !code.includes('clearInterval'),
      type: 'Interval Leak',
      severity: 'high' as const,
      description: 'setInterval without clearInterval can cause memory leaks',
      fix: 'Store interval ID and call clearInterval in cleanup',
    },
    {
      regex: /setTimeout\s*\([^)]+\)/g,
      check: (code: string) => !code.includes('clearTimeout') && code.includes('setTimeout'),
      type: 'Timeout Leak',
      severity: 'medium' as const,
      description: 'setTimeout without clearTimeout may cause issues if component unmounts',
      fix: 'Store timeout ID and call clearTimeout in cleanup',
    },
    {
      regex: /new\s+WebSocket\s*\(/g,
      check: (code: string) => !code.includes('.close()'),
      type: 'WebSocket Leak',
      severity: 'high' as const,
      description: 'WebSocket connection opened without close()',
      fix: 'Call websocket.close() when done or on unmount',
    },
    {
      regex: /new\s+MutationObserver\s*\(/g,
      check: (code: string) => !code.includes('.disconnect()'),
      type: 'Observer Leak',
      severity: 'high' as const,
      description: 'MutationObserver without disconnect()',
      fix: 'Call observer.disconnect() in cleanup',
    },
    {
      regex: /new\s+IntersectionObserver\s*\(/g,
      check: (code: string) => !code.includes('.disconnect()'),
      type: 'Observer Leak',
      severity: 'high' as const,
      description: 'IntersectionObserver without disconnect()',
      fix: 'Call observer.disconnect() in cleanup',
    },
    {
      regex: /window\.\w+\s*=/g,
      check: () => true,
      type: 'Global Variable',
      severity: 'medium' as const,
      description: 'Global variable assignment can prevent garbage collection',
      fix: 'Avoid global variables or set to null when done',
    },
    {
      regex: /\.subscribe\s*\(/g,
      check: (code: string) => !code.includes('.unsubscribe'),
      type: 'Subscription Leak',
      severity: 'high' as const,
      description: 'Subscription without unsubscribe',
      fix: 'Store subscription and call unsubscribe() in cleanup',
    },
    {
      regex: /useEffect\s*\(\s*\(\)\s*=>\s*{[^}]*}\s*\)/g,
      check: (code: string) => code.includes('useEffect') && !code.includes('return'),
      type: 'React useEffect Cleanup',
      severity: 'medium' as const,
      description: 'useEffect without cleanup function',
      fix: 'Return a cleanup function from useEffect',
    },
    {
      regex: /\.on\s*\(['"][^'"]+['"]\s*,/g,
      check: (code: string) => !code.includes('.off(') && !code.includes('.removeListener('),
      type: 'Event Emitter Leak',
      severity: 'high' as const,
      description: 'Event listener added without removal',
      fix: 'Call .off() or .removeListener() in cleanup',
    },
    {
      regex: /createObjectURL\s*\(/g,
      check: (code: string) => !code.includes('revokeObjectURL'),
      type: 'Object URL Leak',
      severity: 'medium' as const,
      description: 'createObjectURL without revokeObjectURL',
      fix: 'Call URL.revokeObjectURL() when done with the URL',
    },
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.regex.exec(code)) !== null) {
      if (pattern.check(code)) {
        const lineNumber = code.substring(0, match.index).split('\n').length;
        const lineCode = lines[lineNumber - 1]?.trim() || '';
        issues.push({
          type: pattern.type,
          severity: pattern.severity,
          line: lineNumber,
          code: lineCode,
          description: pattern.description,
          fix: pattern.fix,
        });
      }
    }
  });
  
  // Calculate score (100 = no issues)
  const severityWeights = { high: 20, medium: 10, low: 5 };
  const totalPenalty = issues.reduce((sum, issue) => sum + severityWeights[issue.severity], 0);
  const score = Math.max(0, 100 - totalPenalty);
  
  return { issues, score };
}

const EXAMPLE_CODE = `import { useEffect, useState } from 'react';

function MyComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Memory leak: no cleanup
    window.addEventListener('resize', handleResize);
    
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    
    const ws = new WebSocket('ws://example.com');
    ws.onmessage = (e) => setData(e.data);
    
    const observer = new MutationObserver(callback);
    observer.observe(document.body, { childList: true });
    
    // Missing cleanup function!
  });
  
  function handleResize() {
    console.log('resized');
  }
  
  return <div>{data}</div>;
}`;

export default function MemoryLeakDetector() {
  const t = useTranslations('tools.memory-leak-detector');
  const tCommon = useTranslations('tools');
  const [code, setCode] = useState('');

  const result = useMemo(() => {
    if (!code.trim()) return null;
    return detectMemoryLeaks(code);
  }, [code]);

  const handleClear = useCallback(() => setCode(''), []);
  const loadExample = useCallback(() => setCode(EXAMPLE_CODE), []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Code {tCommon('input')}</label>
          <button onClick={loadExample} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">{t('loadExample')}</button>
        </div>
        <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("inputPlaceholder")}
          className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none" />
      </div>

      <button onClick={handleClear} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">{tCommon('clear')}</button>

      {result && (
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className={`p-6 rounded-lg text-center ${result.score >= 80 ? 'bg-green-50 dark:bg-green-900/20' : result.score >= 50 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <div className={`text-4xl font-bold ${result.score >= 80 ? 'text-green-600' : result.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {result.score}
              </div>
              <div className="text-sm text-gray-500">Memory Safety Score</div>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                <div className="text-xl font-bold text-red-600">{result.issues.filter(i => i.severity === 'high').length}</div>
                <div className="text-xs text-red-500">High</div>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
                <div className="text-xl font-bold text-yellow-600">{result.issues.filter(i => i.severity === 'medium').length}</div>
                <div className="text-xs text-yellow-500">Medium</div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                <div className="text-xl font-bold text-blue-600">{result.issues.filter(i => i.severity === 'low').length}</div>
                <div className="text-xs text-blue-500">Low</div>
              </div>
            </div>
          </div>

          {result.issues.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Potential Memory Leaks</h3>
              {result.issues.map((issue, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-l-4 ${getSeverityColor(issue.severity)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{issue.type}</span>
                    <span className="text-xs text-gray-500">Line {issue.line}</span>
                  </div>
                  <code className="block text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mb-2 font-mono">{issue.code}</code>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{issue.description}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">💡 {issue.fix}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-green-700 dark:text-green-300 font-medium">No potential memory leaks detected!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
