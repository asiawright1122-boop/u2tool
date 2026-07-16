import { describe, expect, it } from 'vitest';
import {
  createCorruptExcelWorkbookFixture,
  createEmptyExcelWorkbookFixture,
  createExcelWorkbookCustomPathMetadataFixture,
  createExcelWorkbookDeclaredRangeFixture,
  createExcelWorkbookDisplayFixture,
  createExcelWorkbookFixture,
  createExcelWorkbookMetadataFixture,
  createExcelWorkbookOrphanMetadataFixture,
  createExcelWorkbookSpanFixture,
} from './excel-data-viewer.fixture';
import {
  EXCEL_MAX_CELLS_PER_SHEET,
  EXCEL_MAX_COLUMNS_PER_SHEET,
  EXCEL_MAX_ROWS_PER_SHEET,
  ExcelWorkbookLimitError,
  filterExcelRows,
  parseExcelWorkbook,
  sheetToCsv,
  sortExcelRows,
} from './excel-data-viewer';

describe('Excel data viewer model', () => {
  it('parses worksheet cells with addresses, cached values, formulas, and merged ranges', async () => {
    const workbook = await parseExcelWorkbook(createExcelWorkbookFixture());

    expect(workbook.sheets).toHaveLength(2);
    expect(workbook.sheets[0]).toMatchObject({
      name: 'People',
      range: 'A1:F5',
      headers: ['Name', 'Score', 'Active', 'Joined', 'Note', 'Double score'],
      merges: ['A5:B5'],
    });
    expect(workbook.sheets[0].rows[0][0]).toEqual({
      address: 'A2',
      value: 'Alice',
      formula: null,
    });
    expect(workbook.sheets[0].rows[0][5]).toEqual({
      address: 'F2',
      value: 999,
      formula: 'B2*2',
    });
    expect(workbook.sheets[0].rows[1][4]).toEqual({
      address: 'E3',
      value: null,
      formula: null,
    });
    expect(workbook.sheets[0].rows[0][2].value).toBe(true);
    expect(workbook.sheets[0].rows[0][3].value).toBe('1/2/24');
    expect(workbook.sheets[1]).toMatchObject({
      name: 'Inventory',
      range: 'A1:B3',
      headers: ['Item', 'Quantity'],
      merges: [],
    });
    expect(workbook.warnings).toEqual([
      "Formulas are displayed but not recalculated; values are the workbook's cached results.",
    ]);
  });

  it('returns an empty model for a worksheet without a used range', async () => {
    const workbook = await parseExcelWorkbook(createEmptyExcelWorkbookFixture());

    expect(workbook.sheets).toEqual([{
      name: 'Empty',
      range: '',
      headers: [],
      rows: [],
      merges: [],
    }]);
  });

  it('derives worksheet bounds from actual cells instead of a hostile declared range [capability:excel-viewer:profile:release-readiness]', async () => {
    const workbook = await parseExcelWorkbook(
      await createExcelWorkbookDeclaredRangeFixture(),
    );

    expect(workbook.sheets[0]).toEqual({
      name: 'Sparse',
      range: 'A1',
      headers: ['Only actual cell'],
      rows: [],
      merges: [],
    });
  });

  it('rejects actual worksheet spans beyond row, column, or cell limits before allocation [capability:excel-viewer:limit:worksheet-data-limits]', async () => {
    const cases = [
      {
        bytes: createExcelWorkbookSpanFixture({
          r: EXCEL_MAX_ROWS_PER_SHEET,
          c: 0,
        }),
        dimension: 'rows',
        actual: EXCEL_MAX_ROWS_PER_SHEET + 1,
        limit: EXCEL_MAX_ROWS_PER_SHEET,
      },
      {
        bytes: createExcelWorkbookSpanFixture({
          r: 0,
          c: EXCEL_MAX_COLUMNS_PER_SHEET,
        }),
        dimension: 'columns',
        actual: EXCEL_MAX_COLUMNS_PER_SHEET + 1,
        limit: EXCEL_MAX_COLUMNS_PER_SHEET,
      },
      {
        bytes: createExcelWorkbookSpanFixture({ r: 999, c: 250 }),
        dimension: 'cells',
        actual: 251_000,
        limit: EXCEL_MAX_CELLS_PER_SHEET,
      },
    ] as const;

    for (const testCase of cases) {
      await expect(parseExcelWorkbook(testCase.bytes)).rejects.toMatchObject({
        name: 'ExcelWorkbookLimitError',
        sheetName: 'Limit',
        dimension: testCase.dimension,
        actual: testCase.actual,
        limit: testCase.limit,
      } satisfies Partial<ExcelWorkbookLimitError>);
    }
  });

  it('rejects bytes that are not an XLS or XLSX workbook', async () => {
    await expect(parseExcelWorkbook(createCorruptExcelWorkbookFixture()))
      .rejects.toThrow('Invalid Excel workbook.');
  });

  it('uses error display text while keeping formatted numeric cells raw and sortable', async () => {
    const workbook = await parseExcelWorkbook(createExcelWorkbookDisplayFixture());
    const [row] = workbook.sheets[0].rows;

    expect(row.map((cell) => cell.value)).toEqual(['#DIV/0!', 1234.5, 0.25, 2]);
    expect(row[0].formula).toBe('1/0');
    expect(workbook.warnings).toEqual([
      'Complex formatting may not be fully reproduced.',
      "Formulas are displayed but not recalculated; values are the workbook's cached results.",
    ]);
  });

  it('filters rows case-insensitively using displayed scalar values', async () => {
    const { sheets: [sheet] } = await parseExcelWorkbook(createExcelWorkbookFixture());

    expect(filterExcelRows(sheet, 0, 'ali').map((row) => row[0].address)).toEqual(['A2']);
    expect(filterExcelRows(sheet, 2, 'TRUE').map((row) => row[0].address)).toEqual(['A2', 'A4']);
    expect(filterExcelRows(sheet, 0, '')).toEqual(sheet.rows);
  });

  it('sorts rows stably without mutating the parsed sheet and keeps blanks last', async () => {
    const { sheets: [sheet] } = await parseExcelWorkbook(createExcelWorkbookFixture());
    const originalAddresses = sheet.rows.map((row) => row[0].address);

    expect(sortExcelRows(sheet, 1, 'asc').map((row) => row[0].value))
      .toEqual(['Bob', 'Alice', 'Cara', 'Summary']);
    expect(sortExcelRows(sheet, 1, 'desc').map((row) => row[0].value))
      .toEqual(['Alice', 'Cara', 'Bob', 'Summary']);
    expect(sheet.rows.map((row) => row[0].address)).toEqual(originalAddresses);
  });

  it('exports headers and displayed values with RFC-style CSV escaping', async () => {
    const { sheets: [sheet] } = await parseExcelWorkbook(createExcelWorkbookFixture());

    expect(sheetToCsv(sheet)).toBe([
      'Name,Score,Active,Joined,Note,Double score',
      'Alice,20,true,1/2/24,"comma, quote ""and""\nline",999',
      'Bob,10,false,2/3/24,,',
      'Cara,20,true,3/4/24,plain,',
      'Summary,,,,,',
    ].join('\r\n'));
  });

  it('neutralizes formula-leading CSV cells after whitespace or control characters', () => {
    const values = ['=SUM(A1:A2)', ' +1', '\t-2', '\u0001@command', "'=intentional"];
    const sheet = {
      name: 'Formula safety',
      range: 'A1:E2',
      headers: values,
      rows: [values.map((value, index) => ({
        address: `${String.fromCharCode(65 + index)}2`,
        value,
        formula: null,
      }))],
      merges: [],
    };

    expect(sheetToCsv(sheet)).toBe([
      "'=SUM(A1:A2),' +1,'\t-2,'\u0001@command,''=intentional",
      "'=SUM(A1:A2),' +1,'\t-2,'\u0001@command,''=intentional",
    ].join('\r\n'));
  });

  it('preserves numeric and boolean CSV scalars while neutralizing formula-like strings', () => {
    const sheet = {
      name: 'Scalar safety',
      range: 'A1:E2',
      headers: ['Number', 'Boolean', 'String', 'Whitespace', 'Control'],
      rows: [[
        { address: 'A2', value: -42, formula: null },
        { address: 'B2', value: true, formula: null },
        { address: 'C2', value: '-42', formula: null },
        { address: 'D2', value: ' \t=SUM(A1:A2)', formula: null },
        { address: 'E2', value: '\u0001@command', formula: null },
      ]],
      merges: [],
    };

    expect(sheetToCsv(sheet)).toBe([
      'Number,Boolean,String,Whitespace,Control',
      "-42,true,'-42,' \t=SUM(A1:A2),'\u0001@command",
    ].join('\r\n'));
  });

  it('reports safely detected workbook features that the viewer does not execute or reproduce', async () => {
    const workbook = await parseExcelWorkbook(await createExcelWorkbookMetadataFixture());

    expect(workbook.warnings).toEqual([
      'Macros are present but are not executed.',
      'Charts are present but are not reproduced.',
      'Complex formatting may not be fully reproduced.',
    ]);
  });

  it('does not report orphan macro or chart ZIP entries as workbook features', async () => {
    const workbook = await parseExcelWorkbook(await createExcelWorkbookOrphanMetadataFixture());

    expect(workbook.warnings).toEqual([]);
  });

  it('detects reachable macro and chart parts at non-standard package paths', async () => {
    const workbook = await parseExcelWorkbook(await createExcelWorkbookCustomPathMetadataFixture());

    expect(workbook.warnings).toEqual([
      'Macros are present but are not executed.',
      'Charts are present but are not reproduced.',
      'Complex formatting may not be fully reproduced.',
    ]);
  });
});
