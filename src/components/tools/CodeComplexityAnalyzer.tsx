'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface ComplexityResult {
  totalLines: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;
  functions: Array<{
    name: string;
    line: number;
    cyclomaticComplexity: number;
    linesOfCode: number;
    parameters: number;
  }>;
  overallComplexity: number;
  maintainabilityIndex: number;
}

function analyzeComplexity(code: string, language: string): ComplexityResult {
  const lines = code.split('\n');
  let codeLines = 0;
  let commentLines = 0;
  let blankLines = 0;
  let inMultiLineComment = false;
  
  // Count lines
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      blankLines++;
    } else if (inMultiLineComment) {
      commentLines++;
      if (trimmed.includes('*/')) inMultiLineComment = false;
    } else if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
      commentLines++;
    } else if (trimmed.startsWith('/*') || trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
      commentLines++;
      if (!trimmed.endsWith('*/') && !trimmed.slice(3).includes('"""') && !trimmed.slice(3).includes("'''")) {
        inMultiLineComment = true;
      }
    } else {
      codeLines++;
    }
  });

  // Find functions and calculate complexity
  const functions: ComplexityResult['functions'] = [];
  const functionPatterns = [
    /(?:function\s+(\w+)|(\w+)\s*=\s*(?:async\s+)?function|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>|(\w+)\s*\([^)]*\)\s*{)/g,
    /def\s+(\w+)\s*\(/g, // Python
    /func\s+(\w+)\s*\(/g, // Go
  ];

  let match;
  const patternIndex = language === 'python' ? 1 : language === 'go' ? 2 : 0;
  const pattern = functionPatterns[patternIndex];
  
  while ((match = pattern.exec(code)) !== null) {
    const name = match[1] || match[2] || match[3] || match[4] || 'anonymous';
    const startIndex = match.index;
    const lineNumber = code.substring(0, startIndex).split('\n').length;
    
    // Find function body
    let braceCount = 0;
    let started = false;
    let endIndex = startIndex;
    
    for (let i = startIndex; i < code.length; i++) {
      if (code[i] === '{' || (language === 'python' && code[i] === ':' && !started)) {
        braceCount++;
        started = true;
      } else if (code[i] === '}') {
        braceCount--;
        if (braceCount === 0 && started) {
          endIndex = i;
          break;
        }
      }
    }
    
    const functionBody = code.substring(startIndex, endIndex + 1);
    
    // Calculate cyclomatic complexity
    let complexity = 1;
    const complexityPatterns = [
      /\bif\b/g, /\belse\s+if\b/g, /\belif\b/g, /\bwhile\b/g, /\bfor\b/g,
      /\bcase\b/g, /\bcatch\b/g, /\bexcept\b/g, /\?\?/g, /\|\|/g, /&&/g,
      /\?\s*[^:]+\s*:/g, // ternary
    ];
    
    complexityPatterns.forEach(p => {
      const matches = functionBody.match(p);
      if (matches) complexity += matches.length;
    });
    
    // Count parameters
    const paramMatch = functionBody.match(/\(([^)]*)\)/);
    const params = paramMatch ? (paramMatch[1].trim() ? paramMatch[1].split(',').length : 0) : 0;
    
    functions.push({
      name,
      line: lineNumber,
      cyclomaticComplexity: complexity,
      linesOfCode: functionBody.split('\n').length,
      parameters: params,
    });
  }

  // Calculate overall metrics
  const overallComplexity = functions.reduce((sum, f) => sum + f.cyclomaticComplexity, 0);
  
  // Maintainability Index (simplified)
  const avgComplexity = functions.length > 0 ? overallComplexity / functions.length : 1;
  const halsteadVolume = codeLines * Math.log2(codeLines + 1);
  const maintainabilityIndex = Math.max(0, Math.min(100,
    171 - 5.2 * Math.log(halsteadVolume + 1) - 0.23 * avgComplexity - 16.2 * Math.log(codeLines + 1)
  ));

  return {
    totalLines: lines.length,
    codeLines,
    commentLines,
    blankLines,
    functions,
    overallComplexity,
    maintainabilityIndex: Math.round(maintainabilityIndex),
  };
}

function getComplexityColor(complexity: number): string {
  if (complexity <= 5) return 'text-green-600 dark:text-green-400';
  if (complexity <= 10) return 'text-yellow-600 dark:text-yellow-400';
  if (complexity <= 20) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

function getMaintainabilityColor(index: number): string {
  if (index >= 65) return 'text-green-600 dark:text-green-400';
  if (index >= 40) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

const EXAMPLE_CODE = `function calculateTotal(items, taxRate, discount) {
  let total = 0;
  
  for (const item of items) {
    if (item.quantity > 0) {
      if (item.onSale) {
        total += item.price * item.quantity * 0.9;
      } else {
        total += item.price * item.quantity;
      }
    }
  }
  
  if (discount > 0 && total > 100) {
    total = total * (1 - discount);
  } else if (discount > 0) {
    total = total - 5;
  }
  
  return total * (1 + taxRate);
}

function validateEmail(email) {
  return email && email.includes('@') && email.includes('.');
}`;

export default function CodeComplexityAnalyzer() {
  const t = useTranslations('tools.code-complexity-analyzer');
  const tCommon = useTranslations('tools');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  const result = useMemo(() => {
    if (!code.trim()) return null;
    return analyzeComplexity(code, language);
  }, [code, language]);

  const handleClear = useCallback(() => {
    setCode('');
  }, []);

  const loadExample = useCallback(() => {
    setCode(EXAMPLE_CODE);
  }, []);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Code {tCommon('input')}
          </label>
          <div className="flex gap-2 items-center">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="go">Go</option>
            </select>
            <button onClick={loadExample} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">
              {t('loadExample')}
            </button>
          </div>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t("inputPlaceholder")}
          className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
        />
      </div>

      <button
        onClick={handleClear}
        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
      >
        {tCommon('clear')}
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.totalLines}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t('totalLines')}</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.codeLines}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t('codeLines')}</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div className={`text-2xl font-bold ${getComplexityColor(result.overallComplexity)}`}>
                {result.overallComplexity}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t('totalComplexity')}</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div className={`text-2xl font-bold ${getMaintainabilityColor(result.maintainabilityIndex)}`}>
                {result.maintainabilityIndex}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t('maintainability')}</div>
            </div>
          </div>

          {/* Line Breakdown */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('lineBreakdown')}</h3>
            <div className="flex gap-4">
              <div className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded p-2 text-center">
                <div className="text-lg font-medium text-blue-700 dark:text-blue-300">{result.codeLines}</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">{t('code')}</div>
              </div>
              <div className="flex-1 bg-green-100 dark:bg-green-900/30 rounded p-2 text-center">
                <div className="text-lg font-medium text-green-700 dark:text-green-300">{result.commentLines}</div>
                <div className="text-xs text-green-600 dark:text-green-400">{t('comments')}</div>
              </div>
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded p-2 text-center">
                <div className="text-lg font-medium text-gray-700 dark:text-gray-300">{result.blankLines}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{t('blank')}</div>
              </div>
            </div>
          </div>

          {/* Functions */}
          {result.functions.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('functions')} ({result.functions.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="px-4 py-2 text-left">{t('function')}</th>
                      <th className="px-4 py-2 text-center">{t('line')}</th>
                      <th className="px-4 py-2 text-center">{t('complexity')}</th>
                      <th className="px-4 py-2 text-center">{t('loc')}</th>
                      <th className="px-4 py-2 text-center">{t('params')}</th>
                      <th className="px-4 py-2 text-center">{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {result.functions.map((func, idx) => (
                      <tr key={idx} className="bg-white dark:bg-gray-800">
                        <td className="px-4 py-2 font-mono">{func.name}</td>
                        <td className="px-4 py-2 text-center text-gray-500">{func.line}</td>
                        <td className={`px-4 py-2 text-center font-medium ${getComplexityColor(func.cyclomaticComplexity)}`}>
                          {func.cyclomaticComplexity}
                        </td>
                        <td className="px-4 py-2 text-center">{func.linesOfCode}</td>
                        <td className="px-4 py-2 text-center">{func.parameters}</td>
                        <td className="px-4 py-2 text-center">
                          {func.cyclomaticComplexity <= 10 ? '✅' : func.cyclomaticComplexity <= 20 ? '⚠️' : '❌'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">{t('complexityGuide')}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div><span className="text-green-600">1-5:</span> {t('simple')}</div>
              <div><span className="text-yellow-600">6-10:</span> {t('moderate')}</div>
              <div><span className="text-orange-600">11-20:</span> {t('complex')}</div>
              <div><span className="text-red-600">21+:</span> {t('veryComplex')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
