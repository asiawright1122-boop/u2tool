import { describe, expect, it } from 'vitest';
import {
  createCorruptExcelWorkbookFixture,
  createEmptyExcelWorkbookFixture,
  createExcelWorkbookFixture,
  createExcelWorkbookMetadataFixture,
} from './excel-data-viewer.fixture';
import {
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

  it('rejects bytes that are not an XLS or XLSX workbook', async () => {
    await expect(parseExcelWorkbook(createCorruptExcelWorkbookFixture()))
      .rejects.toThrow('Invalid Excel workbook.');
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

  it('reports safely detected workbook features that the viewer does not execute or reproduce', async () => {
    const workbook = await parseExcelWorkbook(await createExcelWorkbookMetadataFixture());

    expect(workbook.warnings).toEqual([
      'Macros are present but are not executed.',
      'Charts are present but are not reproduced.',
      'Complex formatting may not be fully reproduced.',
    ]);
  });
});
