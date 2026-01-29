'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface PlanStep {
  operation: string;
  table?: string;
  cost: number;
  rows: number;
  details: string;
  warning?: string;
}

function analyzeQuery(sql: string): PlanStep[] {
  const steps: PlanStep[] = [];
  const upperSql = sql.toUpperCase();
  
  // Parse SELECT
  if (upperSql.includes('SELECT')) {
    const hasWhere = upperSql.includes('WHERE');
    const hasJoin = upperSql.includes('JOIN');
    const hasOrderBy = upperSql.includes('ORDER BY');
    const hasGroupBy = upperSql.includes('GROUP BY');
    const hasSubquery = (sql.match(/SELECT/gi) || []).length > 1;
    
    // Table scan or index scan
    const tableMatch = sql.match(/FROM\s+(\w+)/i);
    if (tableMatch) {
      steps.push({
        operation: hasWhere ? 'Index Scan' : 'Sequential Scan',
        table: tableMatch[1],
        cost: hasWhere ? 10 : 100,
        rows: hasWhere ? 100 : 10000,
        details: hasWhere ? 'Using index on WHERE condition' : 'Full table scan - no WHERE clause',
        warning: !hasWhere ? 'Consider adding WHERE clause to limit rows' : undefined,
      });
    }
    
    // JOIN operations
    if (hasJoin) {
      const joinMatches = sql.match(/JOIN\s+(\w+)/gi) || [];
      joinMatches.forEach((match, idx) => {
        const tableName = match.replace(/JOIN\s+/i, '');
        steps.push({
          operation: 'Nested Loop Join',
          table: tableName,
          cost: 50 * (idx + 1),
          rows: 1000,
          details: `Joining with ${tableName}`,
        });
      });
    }
    
    // Subquery
    if (hasSubquery) {
      steps.push({
        operation: 'Subquery Scan',
        cost: 200,
        rows: 500,
        details: 'Executing subquery',
        warning: 'Subqueries can be slow - consider using JOIN',
      });
    }
    
    // GROUP BY
    if (hasGroupBy) {
      steps.push({
        operation: 'Hash Aggregate',
        cost: 30,
        rows: 50,
        details: 'Grouping results',
      });
    }
    
    // ORDER BY
    if (hasOrderBy) {
      steps.push({
        operation: 'Sort',
        cost: 40,
        rows: steps[steps.length - 1]?.rows || 100,
        details: 'Sorting results',
        warning: 'Ensure ORDER BY columns are indexed',
      });
    }
  }
  
  // Parse INSERT
  if (upperSql.includes('INSERT')) {
    const tableMatch = sql.match(/INTO\s+(\w+)/i);
    steps.push({
      operation: 'Insert',
      table: tableMatch?.[1],
      cost: 5,
      rows: 1,
      details: 'Inserting row(s)',
    });
  }
  
  // Parse UPDATE
  if (upperSql.includes('UPDATE')) {
    const tableMatch = sql.match(/UPDATE\s+(\w+)/i);
    const hasWhere = upperSql.includes('WHERE');
    steps.push({
      operation: hasWhere ? 'Index Update' : 'Sequential Update',
      table: tableMatch?.[1],
      cost: hasWhere ? 10 : 500,
      rows: hasWhere ? 10 : 10000,
      details: hasWhere ? 'Updating matching rows' : 'Updating all rows',
      warning: !hasWhere ? 'UPDATE without WHERE affects all rows!' : undefined,
    });
  }
  
  // Parse DELETE
  if (upperSql.includes('DELETE')) {
    const tableMatch = sql.match(/FROM\s+(\w+)/i);
    const hasWhere = upperSql.includes('WHERE');
    steps.push({
      operation: hasWhere ? 'Index Delete' : 'Sequential Delete',
      table: tableMatch?.[1],
      cost: hasWhere ? 10 : 500,
      rows: hasWhere ? 10 : 10000,
      details: hasWhere ? 'Deleting matching rows' : 'Deleting all rows',
      warning: !hasWhere ? 'DELETE without WHERE removes all rows!' : undefined,
    });
  }
  
  return steps;
}

const EXAMPLE_SQL = `SELECT u.name, u.email, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
  AND u.created_at > '2024-01-01'
GROUP BY u.id, u.name, u.email
ORDER BY order_count DESC
LIMIT 100`;

export default function QueryExecutionPlanner() {
  const t = useTranslations('tools.query-execution-planner');
  const tCommon = useTranslations('tools');
  const [sql, setSql] = useState('');

  const plan = useMemo(() => {
    if (!sql.trim()) return [];
    return analyzeQuery(sql);
  }, [sql]);

  const totalCost = useMemo(() => plan.reduce((sum, step) => sum + step.cost, 0), [plan]);

  const handleClear = useCallback(() => setSql(''), []);
  const loadExample = useCallback(() => setSql(EXAMPLE_SQL), []);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SQL Query</label>
          <button onClick={loadExample} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">{t('loadExample')}</button>
        </div>
        <textarea value={sql} onChange={(e) => setSql(e.target.value)} placeholder={t("inputPlaceholder")}
          className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none" />
      </div>

      <button onClick={handleClear} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">{tCommon('clear')}</button>

      {plan.length > 0 && (
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalCost}</div>
            <div className="text-sm text-gray-500">Estimated Total Cost</div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Execution Plan</h3>
            {plan.map((step, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${step.warning ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white text-xs rounded-full">{idx + 1}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{step.operation}</span>
                    {step.table && <span className="text-sm text-gray-500">on {step.table}</span>}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Cost: {step.cost}</div>
                    <div className="text-xs text-gray-500">~{step.rows} rows</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{step.details}</p>
                {step.warning && (
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-2">⚠️ {step.warning}</p>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              <strong>Note:</strong> This is a simplified execution plan analysis. 
              For accurate plans, use EXPLAIN ANALYZE in your database client.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
