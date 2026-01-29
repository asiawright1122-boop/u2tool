'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface DeadCodeItem {
  type: 'function' | 'variable' | 'class' | 'export';
  name: string;
  line: number;
  code: string;
  reason: string;
}

function analyzeDeadCode(code: string): DeadCodeItem[] {
  const deadCode: DeadCodeItem[] = [];
  const lines = code.split('\n');
  
  // Find all declarations
  const declarations: Array<{ type: string; name: string; line: number; code: string }> = [];
  
  // Functions
  const funcRegex = /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?(?:function|\([^)]*\)\s*=>))/g;
  let match;
  while ((match = funcRegex.exec(code)) !== null) {
    const name = match[1] || match[2];
    const lineNum = code.substring(0, match.index).split('\n').length;
    declarations.push({ type: 'function', name, line: lineNum, code: lines[lineNum - 1]?.trim() || '' });
  }
  
  // Variables
  const varRegex = /(?:const|let|var)\s+(\w+)\s*=/g;
  while ((match = varRegex.exec(code)) !== null) {
    const name = match[1];
    const lineNum = code.substring(0, match.index).split('\n').length;
    // Skip if already added as function
    if (!declarations.find(d => d.name === name && d.line === lineNum)) {
      declarations.push({ type: 'variable', name, line: lineNum, code: lines[lineNum - 1]?.trim() || '' });
    }
  }
  
  // Classes
  const classRegex = /class\s+(\w+)/g;
  while ((match = classRegex.exec(code)) !== null) {
    const name = match[1];
    const lineNum = code.substring(0, match.index).split('\n').length;
    declarations.push({ type: 'class', name, line: lineNum, code: lines[lineNum - 1]?.trim() || '' });
  }
  
  // Check usage
  declarations.forEach(decl => {
    // Skip exports
    if (code.includes(`export ${decl.type}`) || code.includes(`export { ${decl.name}`) || code.includes(`export default ${decl.name}`)) {
      return;
    }
    
    // Count occurrences (excluding declaration)
    const usageRegex = new RegExp(`\\b${decl.name}\\b`, 'g');
    const matches = code.match(usageRegex) || [];
    
    // If only appears once (the declaration), it's unused
    if (matches.length <= 1) {
      deadCode.push({
        type: decl.type as DeadCodeItem['type'],
        name: decl.name,
        line: decl.line,
        code: decl.code,
        reason: `${decl.type} "${decl.name}" is declared but never used`,
      });
    }
  });
  
  // Find unreachable code after return/throw
  const unreachableRegex = /(?:return|throw)\s+[^;]+;\s*\n\s*(?!}|\s*$)([^}]+)/g;
  while ((match = unreachableRegex.exec(code)) !== null) {
    const lineNum = code.substring(0, match.index).split('\n').length + 1;
    const unreachableCode = match[1].trim().split('\n')[0];
    if (unreachableCode && !unreachableCode.startsWith('}') && !unreachableCode.startsWith('//')) {
      deadCode.push({
        type: 'variable',
        name: 'unreachable',
        line: lineNum,
        code: unreachableCode,
        reason: 'Code after return/throw statement is unreachable',
      });
    }
  }
  
  // Find commented out code blocks
  const commentedCodeRegex = /\/\*[\s\S]*?\*\/|\/\/.*(?:function|const|let|var|class|if|for|while)/g;
  while ((match = commentedCodeRegex.exec(code)) !== null) {
    if (match[0].includes('function') || match[0].includes('const') || match[0].includes('class')) {
      const lineNum = code.substring(0, match.index).split('\n').length;
      deadCode.push({
        type: 'variable',
        name: 'commented',
        line: lineNum,
        code: match[0].substring(0, 50) + '...',
        reason: 'Commented out code should be removed',
      });
    }
  }
  
  return deadCode;
}

const EXAMPLE_CODE = `import { useState } from 'react';

// Old implementation - remove later
// function oldCalculate(x) {
//   return x * 2;
// }

function unusedHelper(data) {
  return data.map(x => x * 2);
}

const UNUSED_CONSTANT = 42;

class UnusedClass {
  constructor() {
    this.value = 0;
  }
}

export default function Calculator() {
  const [result, setResult] = useState(0);
  const unusedVar = 'never used';
  
  function calculate(x) {
    if (x < 0) {
      return 0;
      console.log('This is unreachable');
      const dead = 'code';
    }
    return x * 2;
  }
  
  return (
    <div>
      <button onClick={() => setResult(calculate(5))}>
        Calculate
      </button>
      <p>Result: {result}</p>
    </div>
  );
}`;

export default function DeadCodeAnalyzer() {
  const t = useTranslations('tools.dead-code-analyzer');
  const tCommon = useTranslations('tools');
  const [code, setCode] = useState('');

  const result = useMemo(() => {
    if (!code.trim()) return null;
    return analyzeDeadCode(code);
  }, [code]);

  const handleClear = useCallback(() => setCode(''), []);
  const loadExample = useCallback(() => setCode(EXAMPLE_CODE), []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'function': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300';
      case 'variable': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300';
      case 'class': return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
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
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-center">
              <div className={`text-3xl font-bold ${result.length > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {result.length}
              </div>
              <div className="text-sm text-gray-500">{t('deadCodeItemsFound')}</div>
            </div>
          </div>

          {result.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('deadCodeAnalysis')}</h3>
              {result.map((item, idx) => (
                <div key={idx} className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                    <span className="font-mono font-medium text-gray-900 dark:text-white">{item.name}</span>
                    <span className="text-xs text-gray-500">{t('line')} {item.line}</span>
                  </div>
                  <code className="block text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mb-2 font-mono text-gray-700 dark:text-gray-300">
                    {item.code}
                  </code>
                  <p className="text-sm text-orange-700 dark:text-orange-400">{item.reason}</p>
                </div>
              ))}
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">💡 {t('recommendations')}</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• {t('tip1')}</li>
                  <li>• {t('tip2')}</li>
                  <li>• {t('tip3')}</li>
                  <li>• {t('tip4')}</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-green-700 dark:text-green-300 font-medium">{t('noDeadCodeDetected')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
