'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface ImportInfo {
  line: number;
  statement: string;
  imports: string[];
  source: string;
  used: string[];
  unused: string[];
}

function findUnusedImports(code: string): ImportInfo[] {
  const lines = code.split('\n');
  const imports: ImportInfo[] = [];
  
  // Find all import statements
  const importRegex = /^import\s+(?:(\w+)(?:\s*,\s*)?)?(?:\{([^}]+)\})?\s+from\s+['"]([^'"]+)['"]/;
  const importTypeRegex = /^import\s+type\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/;
  
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    let match = trimmed.match(importRegex);
    let isTypeImport = false;
    
    if (!match) {
      match = trimmed.match(importTypeRegex);
      isTypeImport = true;
    }
    
    if (match) {
      const defaultImport = isTypeImport ? null : match[1];
      const namedImports = (isTypeImport ? match[1] : match[2])?.split(',').map(s => {
        const parts = s.trim().split(/\s+as\s+/);
        return parts[parts.length - 1].trim();
      }).filter(Boolean) || [];
      const source = isTypeImport ? match[2] : match[3];
      
      const allImports = defaultImport ? [defaultImport, ...namedImports] : namedImports;
      
      imports.push({
        line: idx + 1,
        statement: trimmed,
        imports: allImports,
        source,
        used: [],
        unused: [],
      });
    }
  });
  
  // Check usage of each import
  const codeWithoutImports = lines.filter(l => !l.trim().startsWith('import ')).join('\n');
  
  imports.forEach(imp => {
    imp.imports.forEach(name => {
      // Check if the import is used in the code
      const usagePatterns = [
        new RegExp(`\\b${name}\\s*\\(`), // Function call
        new RegExp(`\\b${name}\\s*\\.`), // Property access
        new RegExp(`<${name}[\\s/>]`), // JSX component
        new RegExp(`:\\s*${name}\\b`), // Type annotation
        new RegExp(`extends\\s+${name}\\b`), // Class extension
        new RegExp(`implements\\s+${name}\\b`), // Interface implementation
        new RegExp(`new\\s+${name}\\b`), // Constructor
        new RegExp(`\\b${name}\\s*[,\\)]`), // As argument
        new RegExp(`=\\s*${name}\\b`), // Assignment
        new RegExp(`\\[${name}\\]`), // Array access
      ];
      
      const isUsed = usagePatterns.some(pattern => pattern.test(codeWithoutImports));
      
      if (isUsed) {
        imp.used.push(name);
      } else {
        imp.unused.push(name);
      }
    });
  });
  
  return imports;
}

function generateCleanedCode(code: string, imports: ImportInfo[]): string {
  const lines = code.split('\n');
  const linesToRemove = new Set<number>();
  const linesToModify = new Map<number, string>();
  
  imports.forEach(imp => {
    if (imp.unused.length === imp.imports.length) {
      // Remove entire import
      linesToRemove.add(imp.line - 1);
    } else if (imp.unused.length > 0) {
      // Modify import to remove unused
      const usedImports = imp.used;
      const hasDefault = imp.statement.match(/^import\s+(\w+)\s*,/);
      const defaultImport = hasDefault ? hasDefault[1] : null;
      
      if (defaultImport && imp.unused.includes(defaultImport)) {
        // Default import is unused
        if (usedImports.length > 0) {
          linesToModify.set(imp.line - 1, `import { ${usedImports.join(', ')} } from '${imp.source}';`);
        } else {
          linesToRemove.add(imp.line - 1);
        }
      } else {
        const namedUsed = usedImports.filter(u => u !== defaultImport);
        if (defaultImport && imp.used.includes(defaultImport)) {
          if (namedUsed.length > 0) {
            linesToModify.set(imp.line - 1, `import ${defaultImport}, { ${namedUsed.join(', ')} } from '${imp.source}';`);
          } else {
            linesToModify.set(imp.line - 1, `import ${defaultImport} from '${imp.source}';`);
          }
        } else if (namedUsed.length > 0) {
          linesToModify.set(imp.line - 1, `import { ${namedUsed.join(', ')} } from '${imp.source}';`);
        }
      }
    }
  });
  
  return lines
    .map((line, idx) => {
      if (linesToRemove.has(idx)) return null;
      if (linesToModify.has(idx)) return linesToModify.get(idx);
      return line;
    })
    .filter(line => line !== null)
    .join('\n');
}

const EXAMPLE_CODE = `import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Input, Modal, Tooltip } from '@/components/ui';
import { formatDate, formatNumber, formatCurrency } from '@/utils/format';
import axios from 'axios';
import lodash from 'lodash';
import type { User, Post, Comment } from '@/types';

export default function MyComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    axios.get('/api/data').then(res => setData(res.data));
  }, []);
  
  return (
    <div>
      <Button onClick={() => {}}>Click</Button>
      <p>{formatDate(new Date())}</p>
    </div>
  );
}`;

export default function UnusedImportsFinder() {
  const t = useTranslations('tools.unused-imports-finder');
  const tCommon = useTranslations('tools');
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!code.trim()) return null;
    const imports = findUnusedImports(code);
    const cleanedCode = generateCleanedCode(code, imports);
    const unusedCount = imports.reduce((sum, imp) => sum + imp.unused.length, 0);
    return { imports, cleanedCode, unusedCount };
  }, [code]);

  const handleClear = useCallback(() => setCode(''), []);
  const loadExample = useCallback(() => setCode(EXAMPLE_CODE), []);
  const handleCopy = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(result.cleanedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

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
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.imports.length}</div>
              <div className="text-sm text-gray-500">Import Statements</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div className={`text-2xl font-bold ${result.unusedCount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {result.unusedCount}
              </div>
              <div className="text-sm text-gray-500">Unused Imports</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {result.imports.reduce((sum, imp) => sum + imp.used.length, 0)}
              </div>
              <div className="text-sm text-gray-500">Used Imports</div>
            </div>
          </div>

          {result.imports.filter(imp => imp.unused.length > 0).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Unused Imports</h3>
              {result.imports.filter(imp => imp.unused.length > 0).map((imp, idx) => (
                <div key={idx} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-orange-600 dark:text-orange-400">Line {imp.line}</span>
                    <span className="text-xs text-gray-500">{imp.source}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {imp.imports.map((name, i) => (
                      <span key={i} className={`px-2 py-0.5 text-xs rounded ${
                        imp.unused.includes(name) 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 line-through' 
                          : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                      }`}>
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cleaned Code</label>
              <button onClick={handleCopy} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
            </div>
            <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 max-h-64">
              {result.cleanedCode}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
