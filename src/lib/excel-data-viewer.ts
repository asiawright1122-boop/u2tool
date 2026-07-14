import * as XLSX from 'xlsx';

export interface ExcelCellView {
  address: string;
  value: string | number | boolean | null;
  formula: string | null;
}

export interface ExcelSheetView {
  name: string;
  range: string;
  headers: string[];
  rows: ExcelCellView[][];
  merges: string[];
}

export interface ExcelWorkbookView {
  sheets: ExcelSheetView[];
  warnings: string[];
}

type WorkbookStyleMetadata = {
  Fonts?: unknown[];
  Fills?: unknown[];
  Borders?: unknown[];
  CellXf?: Array<Record<string, unknown>>;
};

type WorkbookWithMetadata = XLSX.WorkBook & {
  keys?: string[];
  Styles?: WorkbookStyleMetadata;
};

function cellValue(cell: XLSX.CellObject | undefined): ExcelCellView['value'] {
  if (!cell || cell.v === undefined || cell.v === null) {
    return null;
  }
  if (cell.v instanceof Date) {
    return cell.w || cell.v.toISOString();
  }
  if (typeof cell.v === 'string' || typeof cell.v === 'number' || typeof cell.v === 'boolean') {
    return cell.v;
  }
  return cell.w || String(cell.v);
}

function cellView(worksheet: XLSX.WorkSheet, address: string): ExcelCellView {
  const cell = worksheet[address];
  return {
    address,
    value: cellValue(cell),
    formula: typeof cell?.f === 'string' ? cell.f : null,
  };
}

function sheetView(name: string, worksheet: XLSX.WorkSheet): ExcelSheetView {
  const range = worksheet['!ref'] || '';
  if (!range) {
    return { name, range, headers: [], rows: [], merges: [] };
  }

  const bounds = XLSX.utils.decode_range(range);
  const headers: string[] = [];
  for (let column = bounds.s.c; column <= bounds.e.c; column += 1) {
    const address = XLSX.utils.encode_cell({ r: bounds.s.r, c: column });
    const value = cellValue(worksheet[address]);
    headers.push(value === null ? '' : String(value));
  }

  const rows: ExcelCellView[][] = [];
  for (let row = bounds.s.r + 1; row <= bounds.e.r; row += 1) {
    const cells: ExcelCellView[] = [];
    for (let column = bounds.s.c; column <= bounds.e.c; column += 1) {
      cells.push(cellView(worksheet, XLSX.utils.encode_cell({ r: row, c: column })));
    }
    rows.push(cells);
  }

  return {
    name,
    range,
    headers,
    rows,
    merges: (worksheet['!merges'] || []).map((merge) => XLSX.utils.encode_range(merge)),
  };
}

function hasExcelFileSignature(bytes: Uint8Array): boolean {
  const isZip = bytes.length >= 4
    && bytes[0] === 0x50
    && bytes[1] === 0x4b
    && ((bytes[2] === 0x03 && bytes[3] === 0x04)
      || (bytes[2] === 0x05 && bytes[3] === 0x06)
      || (bytes[2] === 0x07 && bytes[3] === 0x08));
  const isCompoundFile = bytes.length >= 8
    && bytes[0] === 0xd0
    && bytes[1] === 0xcf
    && bytes[2] === 0x11
    && bytes[3] === 0xe0
    && bytes[4] === 0xa1
    && bytes[5] === 0xb1
    && bytes[6] === 0x1a
    && bytes[7] === 0xe1;
  return isZip || isCompoundFile;
}

function workbookHasFormula(workbook: XLSX.WorkBook): boolean {
  return workbook.SheetNames.some((name) => Object.entries(workbook.Sheets[name]).some(
    ([key, cell]) => !key.startsWith('!')
      && typeof cell === 'object'
      && cell !== null
      && typeof (cell as XLSX.CellObject).f === 'string',
  ));
}

function workbookHasComplexFormatting(workbook: WorkbookWithMetadata): boolean {
  const styles = workbook.Styles;
  const hasNonDefaultStyles = Boolean(
    (styles?.Fonts?.length || 0) > 1
    || (styles?.Fills?.length || 0) > 2
    || (styles?.Borders?.length || 0) > 1
    || styles?.CellXf?.some((style) => {
      const fontId = Number(style.fontId ?? style.fontid ?? 0);
      const fillId = Number(style.fillId ?? style.fillid ?? 0);
      const borderId = Number(style.borderId ?? style.borderid ?? 0);
      return fontId > 0
        || fillId > 0
        || borderId > 0
        || 'alignment' in style
        || 'protection' in style;
    }),
  );
  const hasSheetLayoutFormatting = workbook.SheetNames.some((name) => {
    const worksheet = workbook.Sheets[name];
    return Boolean(
      worksheet['!cols']?.length
      || worksheet['!rows']?.length
      || worksheet['!protect']
      || worksheet['!margins'],
    );
  });
  return hasNonDefaultStyles || hasSheetLayoutFormatting;
}

function workbookWarnings(workbook: WorkbookWithMetadata): string[] {
  const fileKeys = workbook.keys || [];
  const warnings: string[] = [];
  if (workbook.vbaraw || fileKeys.some((key) => /(^|\/)vbaProject\.bin$/i.test(key))) {
    warnings.push('Macros are present but are not executed.');
  }
  if (fileKeys.some((key) => /(^|\/)charts\/[^/]+\.xml$/i.test(key))) {
    warnings.push('Charts are present but are not reproduced.');
  }
  if (workbookHasComplexFormatting(workbook)) {
    warnings.push('Complex formatting may not be fully reproduced.');
  }
  if (workbookHasFormula(workbook)) {
    warnings.push("Formulas are displayed but not recalculated; values are the workbook's cached results.");
  }
  return warnings;
}

export async function parseExcelWorkbook(bytes: Uint8Array): Promise<ExcelWorkbookView> {
  if (!hasExcelFileSignature(bytes)) {
    throw new Error('Invalid Excel workbook.');
  }

  let workbook: WorkbookWithMetadata;
  try {
    workbook = XLSX.read(bytes, {
      type: 'array',
      cellFormula: true,
      cellDates: true,
      cellNF: true,
      cellStyles: true,
      bookFiles: true,
      bookVBA: true,
    });
  } catch {
    throw new Error('Invalid Excel workbook.');
  }

  return {
    sheets: workbook.SheetNames.map((name) => sheetView(name, workbook.Sheets[name])),
    warnings: workbookWarnings(workbook),
  };
}

export function filterExcelRows(
  sheet: ExcelSheetView,
  column: number,
  query: string,
): ExcelCellView[][] {
  if (query === '') {
    return [...sheet.rows];
  }
  const normalizedQuery = query.toLocaleLowerCase();
  return sheet.rows.filter((row) => {
    const value = row[column]?.value;
    return value !== null
      && value !== undefined
      && String(value).toLocaleLowerCase().includes(normalizedQuery);
  });
}

function compareCellValues(
  left: ExcelCellView['value'],
  right: ExcelCellView['value'],
): number {
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }
  if (typeof left === 'boolean' && typeof right === 'boolean') {
    return Number(left) - Number(right);
  }
  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

export function sortExcelRows(
  sheet: ExcelSheetView,
  column: number,
  direction: 'asc' | 'desc',
): ExcelCellView[][] {
  return sheet.rows
    .map((row, index) => ({ row, index }))
    .sort((leftEntry, rightEntry) => {
      const left = leftEntry.row[column]?.value ?? null;
      const right = rightEntry.row[column]?.value ?? null;
      if (left === null || right === null) {
        if (left === right) {
          return leftEntry.index - rightEntry.index;
        }
        return left === null ? 1 : -1;
      }
      const comparison = compareCellValues(left, right);
      return comparison === 0
        ? leftEntry.index - rightEntry.index
        : comparison * (direction === 'asc' ? 1 : -1);
    })
    .map(({ row }) => row);
}

function csvField(value: ExcelCellView['value'] | string): string {
  const text = value === null ? '' : String(value);
  if (!/[",\r\n]/.test(text)) {
    return text;
  }
  return `"${text.replace(/"/g, '""')}"`;
}

export function sheetToCsv(sheet: ExcelSheetView): string {
  if (sheet.headers.length === 0 && sheet.rows.length === 0) {
    return '';
  }
  return [
    sheet.headers.map(csvField),
    ...sheet.rows.map((row) => row.map((cell) => csvField(cell.value))),
  ].map((row) => row.join(',')).join('\r\n');
}
