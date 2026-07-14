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

    expect(
      analyzeSql({
        sql: 'SELECT id FROM users WHERE name LIKE "%admin" LIMIT 5;',
        dialect: 'mysql',
      }).suggestions.map(({ code }) => code),
    ).toContain('leading-wildcard-like');
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
        explainText: '|--Table Scan(OBJECT:([dbo].[orders]))',
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

  it('does not describe PostgreSQL planned-only text or JSON scans as executed', () => {
    const plannedOnly = [
      'Seq Scan on orders  (cost=0.00..431.00 rows=10000 width=32)',
      'EXPLAIN (ANALYZE FALSE, FORMAT TEXT)\nSeq Scan on orders  (cost=0.00..431.00 rows=10000 width=32)',
      JSON.stringify({ Plan: { 'Node Type': 'Seq Scan' } }),
    ];

    for (const explainText of plannedOnly) {
      const finding = analyzeSql({
        sql: 'SELECT id FROM orders LIMIT 1;',
        dialect: 'postgresql',
        explainText,
      }).explainFindings.find(
        ({ code }) => code === 'postgresql-sequential-scan',
      );

      expect(finding?.message).toMatch(/planned/i);
      expect(finding?.message).not.toMatch(/executed/i);
    }
  });

  it('may describe PostgreSQL scans as executed when ANALYZE evidence is present', () => {
    const executedPlans = [
      'EXPLAIN (ANALYZE TRUE, FORMAT TEXT)\nSeq Scan on orders  (cost=0.00..431.00 rows=10000 width=32)',
      'Seq Scan on orders  (cost=0.00..431.00 rows=10000 width=32) (actual time=0.01..0.20 rows=12 loops=1)',
      JSON.stringify({
        Plan: { 'Node Type': 'Seq Scan', 'Actual Loops': 1 },
      }),
    ];

    for (const explainText of executedPlans) {
      const finding = analyzeSql({
        sql: 'SELECT id FROM orders LIMIT 1;',
        dialect: 'postgresql',
        explainText,
      }).explainFindings.find(
        ({ code }) => code === 'postgresql-sequential-scan',
      );

      expect(finding?.message).toMatch(/executed/i);
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

  it('preserves the newline that terminates a line comment while formatting', () => {
    const sql = 'SELECT -- comment\nid FROM users LIMIT 1;';

    expect(analyzeSql({ sql, dialect: 'postgresql' }).formattedSql).toBe(
      'SELECT\n  -- comment\n  id\nFROM users\nLIMIT 1;',
    );
    expect(
      analyzeSql({
        sql: 'SELECT id\n-- comment\nFROM users LIMIT 1;',
        dialect: 'postgresql',
      }).formattedSql,
    ).toBe('SELECT\n  id -- comment\nFROM users\nLIMIT 1;');
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

  it('scopes findings to each top-level statement and resolves CTE root statements', () => {
    const result = analyzeSql({
      sql: `SELECT id FROM users WHERE id IN (SELECT user_id FROM sessions LIMIT 1);
SELECT id FROM audit_log LIMIT 5;
WITH active AS (SELECT id FROM users WHERE active = true LIMIT 10)
UPDATE accounts SET reviewed = true;
WITH stale AS (SELECT id FROM sessions WHERE expired = true)
DELETE FROM sessions;
WITH recent AS (SELECT id FROM orders LIMIT 10)
SELECT * FROM recent;`,
      dialect: 'postgresql',
    });

    const unboundedReads = result.suggestions.filter(
      ({ code }) => code === 'unbounded-read',
    );
    expect(unboundedReads).toHaveLength(2);
    expect(unboundedReads[0]?.evidence).toContain('SELECT id FROM users');
    expect(unboundedReads[1]?.evidence).toContain('SELECT * FROM recent');

    const unsafeWrites = result.suggestions.filter(
      ({ code }) => code === 'write-without-where',
    );
    expect(unsafeWrites).toHaveLength(2);
    expect(unsafeWrites[0]?.evidence).toContain('UPDATE accounts');
    expect(unsafeWrites[1]?.evidence).toContain('DELETE FROM sessions');
    expect(result.suggestions.map(({ code }) => code)).toContain('select-star');
  });

  it('preserves dialect strings, comments, and quoted identifiers byte-for-byte while masking their contents', () => {
    const fixtures = [
      {
        dialect: 'mysql' as const,
        sql:
          'SELECT `odd``SELECT`, ' +
          String.raw`'it\'s OR DELETE', "double\"quote"` +
          ' FROM notes LIMIT 1; # SELECT *',
        protected: [
          '`odd``SELECT`',
          String.raw`'it\'s OR DELETE'`,
          String.raw`"double\"quote"`,
          '# SELECT *',
        ],
      },
      {
        dialect: 'postgresql' as const,
        sql: String.raw`SELECT "odd""SELECT", E'it\'s OR DELETE', $tag$SELECT *; LIMIT 1$tag$ FROM notes LIMIT 1; /* UPDATE notes */`,
        protected: [
          '"odd""SELECT"',
          String.raw`E'it\'s OR DELETE'`,
          '$tag$SELECT *; LIMIT 1$tag$',
          '/* UPDATE notes */',
        ],
      },
      {
        dialect: 'sql-server' as const,
        sql: `SELECT [odd]]SELECT], 'DELETE FROM notes; ''quoted''' FROM notes ORDER BY [odd]]SELECT] OFFSET 0 ROWS FETCH NEXT 1 ROW ONLY;`,
        protected: ['[odd]]SELECT]', "'DELETE FROM notes; ''quoted'''"],
      },
      {
        dialect: 'sqlite' as const,
        sql: `SELECT "odd""SELECT", 'OR '' DELETE' FROM notes LIMIT 1; -- SELECT *`,
        protected: ['"odd""SELECT"', "'OR '' DELETE'", '-- SELECT *'],
      },
      {
        dialect: 'generic' as const,
        sql: `SELECT \`odd\`\`SELECT\`, [bracket]]DELETE], $$SELECT *$$ FROM notes LIMIT 1;`,
        protected: ['`odd``SELECT`', '[bracket]]DELETE]', '$$SELECT *$$'],
      },
    ];

    for (const fixture of fixtures) {
      const result = analyzeSql(fixture);
      expect(
        result.suggestions.map(({ code }) => code),
        fixture.dialect,
      ).not.toContain('possibly-malformed-sql');
      for (const token of fixture.protected) {
        expect(result.formattedSql, `${fixture.dialect}: ${token}`).toContain(token);
      }
      expect(
        result.suggestions
          .map(({ code }) => code)
          .filter((code) =>
            [
              'select-star',
              'unbounded-read',
              'write-without-where',
              'leading-wildcard-like',
              'filtered-column-function',
              'or-filter',
            ].includes(code),
          ),
        fixture.dialect,
      ).toEqual([]);
    }
  });

  it('does not split statements at protected semicolons or borrow bounds and clauses across statements', () => {
    const result = analyzeSql({
      dialect: 'sql-server',
      sql: `SELECT '; SELECT * FROM hidden' AS note, [semi;colon] FROM notes FETCH FIRST 1 ROW ONLY;
/* ; DELETE FROM hidden; */
SELECT id FROM audit_log;
UPDATE users SET active = 0;
SELECT id FROM users WHERE id = 1;`,
    });

    expect(
      result.suggestions.filter(({ code }) => code === 'unbounded-read'),
    ).toHaveLength(2);
    expect(
      result.suggestions.filter(({ code }) => code === 'write-without-where'),
    ).toHaveLength(1);
    expect(result.suggestions.map(({ code }) => code)).not.toContain(
      'select-star',
    );
  });

  it('applies write safety to vendor UPDATE and DELETE roots rather than nested or later WHERE clauses', () => {
    const unsafe = [
      {
        dialect: 'mysql' as const,
        sql: 'DELETE u FROM users u JOIN stale s ON s.id = u.id;',
      },
      {
        dialect: 'sql-server' as const,
        sql: 'UPDATE TOP (100) users SET archived = 1;',
      },
      {
        dialect: 'postgresql' as const,
        sql: 'DELETE FROM users USING stale_users WHERE stale_users.id = users.id; UPDATE accounts SET active = false;',
      },
      {
        dialect: 'sqlite' as const,
        sql: 'UPDATE OR REPLACE users SET active = 0;',
      },
    ];

    expect(
      unsafe.map(({ dialect, sql }) =>
        analyzeSql({ dialect, sql }).suggestions.filter(
          ({ code }) => code === 'write-without-where',
        ).length,
      ),
    ).toEqual([1, 1, 1, 1]);
  });

  it('accepts only actual executed scan node and field shapes from pasted plans', () => {
    const negatives = [
      {
        dialect: 'postgresql' as const,
        explainText: 'No Seq Scan was used.\n-> Seq Scan on orders (never executed)',
      },
      {
        dialect: 'postgresql' as const,
        explainText: JSON.stringify({
          Plan: { 'Node Type': 'Seq Scan', 'Actual Loops': 0 },
        }),
      },
      {
        dialect: 'mysql' as const,
        explainText: 'type: ALL was not used\ntype: ALL (never executed)',
      },
      {
        dialect: 'sqlite' as const,
        explainText: 'SCAN CONSTANT ROW\nSCAN SUBQUERY 1\nSCAN (subquery-2)',
      },
      {
        dialect: 'sql-server' as const,
        explainText:
          'No Table Scan was selected.\n|--Table Scan(OBJECT:([dbo].[orders]), Actual Executions=0)',
      },
      {
        dialect: 'generic' as const,
        explainText: 'Seq Scan on orders\ntype: ALL\nSCAN orders\nTable Scan',
      },
    ];

    for (const fixture of negatives) {
      expect(analyzeSql({ sql: 'SELECT 1 LIMIT 1;', ...fixture }).explainFindings).toEqual([]);
    }
  });

  it('bounds SQL and EXPLAIN evidence around the matched node on both sides', () => {
    const result = analyzeSql({
      dialect: 'postgresql',
      sql: `${'x'.repeat(400)}; SELECT * FROM orders; ${'y'.repeat(400)}`,
      explainText: `${'a'.repeat(400)}\nSeq Scan on orders  (cost=0.00..1.00 rows=1 width=4)\n${'b'.repeat(400)}`,
    });

    for (const evidence of [
      ...result.suggestions.map((finding) => finding.evidence),
      ...result.explainFindings.map((finding) => finding.evidence),
    ]) {
      expect(evidence.length).toBeLessThanOrEqual(182);
      expect(evidence.startsWith('…')).toBe(true);
      expect(evidence.endsWith('…')).toBe(true);
    }
  });
});
