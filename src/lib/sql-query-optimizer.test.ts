import { describe, expect, it } from 'vitest';

import { analyzeSql } from './sql-query-optimizer';

describe('analyzeSql', () => {
  it('reports SELECT * and an unbounded read with evidence [capability:sql-query-optimizer:profile:release-readiness] [capability:sql-query-optimizer:mode:local-static-analysis] [capability:sql-query-optimizer:accepted-input:sql-text] [capability:sql-query-optimizer:produced-output:analysis-score] [capability:sql-query-optimizer:produced-output:diagnostic-findings] [capability:sql-query-optimizer:browser-feature:static-heuristics]', () => {
    const result = analyzeSql({
      sql: 'SELECT * FROM orders;',
      dialect: 'postgresql',
    });

    expect(result.dialect).toBe('postgresql');
    expect(result.score).toBeLessThan(100);
    expect(result.suggestions.map(({ code }) => code)).toEqual(
      expect.arrayContaining(['select-star', 'unbounded-read']),
    );
    expect(result.suggestions.every(({ evidence }) => evidence.trim().length > 0)).toBe(true);
  });

  it('warns when UPDATE or DELETE may affect every row', () => {
    for (const sql of ['UPDATE users SET active = false;', 'DELETE FROM sessions;']) {
      const result = analyzeSql({ sql, dialect: 'generic' });
      const finding = result.suggestions.find(
        ({ code }) => code === 'write-without-where',
      );

      expect(finding).toMatchObject({ severity: 'warning' });
      expect(finding?.message).toMatch(/may|could/i);
      expect(finding?.evidence).toContain(sql.split(' ')[0]);
    }
  });

  it('flags leading wildcards, filtered-column functions, and OR-heavy filters', () => {
    const result = analyzeSql({
      sql: `SELECT id
FROM users
WHERE LOWER(email) LIKE '%@example.com' OR tenant_id = 7
LIMIT 25;`,
      dialect: 'mysql',
    });

    expect(result.suggestions.map(({ code }) => code)).toEqual(
      expect.arrayContaining([
        'leading-wildcard-like',
        'filtered-column-function',
        'or-filter',
      ]),
    );
    for (const finding of result.suggestions) {
      expect(finding.evidence).not.toBe('');
      expect(finding.message).toMatch(/may|might|could|review|consider/i);
    }
  });

  it('returns a composite index candidate from equality filters followed by ordering [capability:sql-query-optimizer:produced-output:index-candidates] [capability:sql-query-optimizer:browser-feature:composite-index-candidates]', () => {
    const result = analyzeSql({
      sql: `SELECT id
FROM orders
WHERE customer_id = 7 AND status = 'open'
ORDER BY created_at DESC
LIMIT 50;`,
      dialect: 'postgresql',
    });

    const finding = result.suggestions.find(
      ({ code }) => code === 'composite-index-candidate',
    );
    expect(finding?.indexCandidates).toContain(
      'orders (customer_id, status, created_at)',
    );
    expect(finding?.message).toMatch(/candidate|review|might/i);
    expect(finding?.evidence).toContain('customer_id = 7');
  });

  it('interprets pasted scan tokens for each supported database family [capability:sql-query-optimizer:mode:pasted-explain-analysis] [capability:sql-query-optimizer:accepted-input:sql-dialect] [capability:sql-query-optimizer:accepted-input:explain-text] [capability:sql-query-optimizer:produced-output:explain-findings] [capability:sql-query-optimizer:browser-feature:explain-token-analysis]', () => {
    const cases = [
      {
        dialect: 'postgresql' as const,
        explainText: 'Seq Scan on orders  (cost=0.00..431.00 rows=10000 width=32)',
        code: 'postgresql-sequential-scan',
      },
      {
        dialect: 'mysql' as const,
        explainText: 'table: orders\ntype: ALL\nrows: 10000',
        code: 'mysql-full-scan',
      },
      {
        dialect: 'sqlite' as const,
        explainText: 'SCAN orders',
        code: 'sqlite-table-scan',
      },
      {
        dialect: 'sql-server' as const,
        explainText: 'Clustered Index Scan followed by Table Scan on [orders]',
        code: 'sql-server-table-scan',
      },
    ];

    for (const fixture of cases) {
      const result = analyzeSql({
        sql: 'SELECT id FROM orders WHERE status = 1;',
        dialect: fixture.dialect,
        explainText: fixture.explainText,
      });
      const finding = result.explainFindings.find(
        ({ code }) => code === fixture.code,
      );

      expect(finding?.evidence).toContain(
        fixture.explainText.split(/\s+/).slice(0, 2).join(' '),
      );
      expect(finding?.message).toMatch(/may|might|could|review/i);
    }
  });

  it('ignores clause-like text inside comments and string literals', () => {
    const result = analyzeSql({
      sql: `/* SELECT * FROM users; DELETE FROM users; */
SELECT id
FROM notes
WHERE message = 'OR LOWER(email) LIKE ''%example.com'' DELETE FROM users'
LIMIT 10; -- UPDATE users SET active = false`,
      dialect: 'postgresql',
    });

    const falsePositiveCodes = new Set([
      'select-star',
      'unbounded-read',
      'write-without-where',
      'leading-wildcard-like',
      'filtered-column-function',
      'or-filter',
    ]);
    expect(
      result.suggestions
        .map(({ code }) => code)
        .filter((code) => falsePositiveCodes.has(code)),
    ).toEqual([]);
  });

  it('returns a bounded, reviewable result for malformed SQL', () => {
    const result = analyzeSql({
      sql: "SELECT * FROM users WHERE note = 'unfinished",
      dialect: 'generic',
      explainText: 'not a recognized plan',
    });

    expect(result.formattedSql).toEqual(expect.any(String));
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.suggestions.map(({ code }) => code)).toContain(
      'possibly-malformed-sql',
    );
  });

  it('formats SQL without changing the submitted text and keeps local diagnostics in English [capability:sql-query-optimizer:produced-output:formatted-sql] [capability:sql-query-optimizer:browser-feature:sql-formatting] [capability:sql-query-optimizer:engine:language-support]', () => {
    const sql = 'select * from users where active = true limit 10;';
    const result = analyzeSql({ sql, dialect: 'sqlite' });

    expect(result.formattedSql).toContain('SELECT');
    expect(result.formattedSql).toContain('\nFROM users');
    expect(sql).toBe('select * from users where active = true limit 10;');
    expect(result.suggestions[0]?.message).toContain(
      'SELECT * may read columns the caller does not need',
    );
  });

  it('respects standard LIMIT and SQL Server TOP row bounds', () => {
    const fixtures = [
      { dialect: 'postgresql' as const, sql: 'SELECT id FROM users LIMIT 10;' },
      { dialect: 'sql-server' as const, sql: 'SELECT TOP (10) id FROM users;' },
      {
        dialect: 'sql-server' as const,
        sql: 'SELECT id FROM users ORDER BY id OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY;',
      },
    ];

    for (const fixture of fixtures) {
      const result = analyzeSql(fixture);
      expect(result.suggestions.map(({ code }) => code)).not.toContain(
        'unbounded-read',
      );
    }
  });
});
