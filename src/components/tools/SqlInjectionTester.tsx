'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface TestResult {
  vulnerable: boolean;
  issues: Array<{ severity: 'high' | 'medium' | 'low'; type: string; description: string; fix: string }>;
  score: number;
}

const SQL_INJECTION_PATTERNS = [
  { pattern: /['"].*['"].*=.*['"].*['"]/i, type: 'String Concatenation', severity: 'high' as const, description: 'Direct string concatenation in query', fix: 'Use parameterized queries or prepared statements' },
  { pattern: /\$\{.*\}/g, type: 'Template Literal Injection', severity: 'high' as const, description: 'Template literal used in SQL query', fix: 'Use parameterized queries instead of template literals' },
  { pattern: /\+\s*['"]?\w+['"]?\s*\+/g, type: 'String Concatenation', severity: 'high' as const, description: 'Variable concatenated into query string', fix: 'Use prepared statements with placeholders' },
  { pattern: /query\s*\(\s*['"`].*\$|query\s*\(\s*['"`].*\+/i, type: 'Dynamic Query', severity: 'high' as const, description: 'Dynamic query construction detected', fix: 'Use ORM or query builder with parameterization' },
  { pattern: /execute\s*\(\s*['"`].*\+/i, type: 'Dynamic Execute', severity: 'high' as const, description: 'Dynamic SQL execution', fix: 'Use parameterized execute statements' },
  { pattern: /WHERE\s+\w+\s*=\s*['"]?\s*\+/i, type: 'WHERE Clause Injection', severity: 'high' as const, description: 'User input in WHERE clause', fix: 'Use parameterized WHERE conditions' },
  { pattern: /ORDER\s+BY\s+['"]?\s*\+/i, type: 'ORDER BY Injection', severity: 'medium' as const, description: 'Dynamic ORDER BY clause', fix: 'Whitelist allowed column names' },
  { pattern: /LIMIT\s+['"]?\s*\+/i, type: 'LIMIT Injection', severity: 'low' as const, description: 'Dynamic LIMIT value', fix: 'Validate and cast to integer' },
];

function testForInjection(code: string): TestResult {
  const issues: TestResult['issues'] = [];
  
  SQL_INJECTION_PATTERNS.forEach(({ pattern, type, severity, description, fix }) => {
    if (pattern.test(code)) {
      issues.push({ severity, type, description, fix });
    }
  });
  
  // Check for safe patterns
  const safePatterns = [
    /\?\s*,|\$\d+|:\w+/g, // Parameterized placeholders
    /prepare\s*\(/i, // Prepared statements
    /bindParam|bindValue/i, // Parameter binding
    /createQueryBuilder/i, // Query builders
  ];
  
  const hasSafePatterns = safePatterns.some(p => p.test(code));
  
  const score = Math.max(0, 100 - issues.reduce((sum, i) => sum + (i.severity === 'high' ? 30 : i.severity === 'medium' ? 15 : 5), 0));
  
  return {
    vulnerable: issues.length > 0,
    issues,
    score: hasSafePatterns && issues.length === 0 ? 100 : score,
  };
}

const EXAMPLE_CODE = `// Vulnerable code examples
const userId = req.params.id;
const query = "SELECT * FROM users WHERE id = " + userId;
db.query(query);

// Another vulnerable pattern
const search = req.query.search;
const sql = \`SELECT * FROM products WHERE name LIKE '%\${search}%'\`;

// ORDER BY injection
const sortBy = req.query.sort;
db.query("SELECT * FROM items ORDER BY " + sortBy);`;

export default function SqlInjectionTester() {
  const t = useTranslations('tools.sql-injection-tester');
  const tCommon = useTranslations('tools');
  const [code, setCode] = useState('');

  const result = useMemo(() => {
    if (!code.trim()) return null;
    return testForInjection(code);
  }, [code]);

  const handleClear = useCallback(() => setCode(''), []);
  const loadExample = useCallback(() => setCode(EXAMPLE_CODE), []);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Code to Analyze</label>
          <button onClick={loadExample} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">{t('loadExample')}</button>
        </div>
        <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("inputPlaceholder")}
          className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none" />
      </div>

      <button onClick={handleClear} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">{tCommon('clear')}</button>

      {result && (
        <div className="space-y-6">
          <div className={`p-6 rounded-lg text-center ${result.vulnerable ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
            <div className={`text-4xl font-bold ${result.vulnerable ? 'text-red-600' : 'text-green-600'}`}>
              {result.vulnerable ? '⚠️ VULNERABLE' : '✅ SAFE'}
            </div>
            <div className="text-sm text-gray-500 mt-2">Security Score: {result.score}/100</div>
          </div>

          {result.issues.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Vulnerabilities Found</h3>
              {result.issues.map((issue, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                  issue.severity === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                  issue.severity === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                  'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                      issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{issue.severity.toUpperCase()}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{issue.type}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{issue.description}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">💡 {issue.fix}</p>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Safe Query Examples</h4>
            <pre className="text-xs font-mono text-blue-700 dark:text-blue-400 whitespace-pre-wrap">
{`// Parameterized query (Node.js)
db.query('SELECT * FROM users WHERE id = ?', [userId]);

// Prepared statement (PHP)
$stmt = $pdo->prepare('SELECT * FROM users WHERE id = :id');
$stmt->execute(['id' => $userId]);

// ORM (Prisma)
prisma.user.findUnique({ where: { id: userId } });`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
