import * as XLSX from 'xlsx';

import { neutralizeCsvFormula } from './csv-formula-safety';

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

export const EXCEL_MAX_ROWS_PER_SHEET = 10_000;
export const EXCEL_MAX_COLUMNS_PER_SHEET = 256;
export const EXCEL_MAX_CELLS_PER_SHEET = 250_000;

export type ExcelWorkbookLimitDimension = 'rows' | 'columns' | 'cells';

export class ExcelWorkbookLimitError extends Error {
  readonly sheetName: string;
  readonly dimension: ExcelWorkbookLimitDimension;
  readonly actual: number;
  readonly limit: number;

  constructor(input: {
    sheetName: string;
    dimension: ExcelWorkbookLimitDimension;
    actual: number;
    limit: number;
  }) {
    super(
      `Worksheet ${JSON.stringify(input.sheetName)} exceeds the ${input.dimension} limit (${input.actual} > ${input.limit}).`,
    );
    this.name = 'ExcelWorkbookLimitError';
    this.sheetName = input.sheetName;
    this.dimension = input.dimension;
    this.actual = input.actual;
    this.limit = input.limit;
  }
}

type WorkbookStyleMetadata = {
  Fonts?: unknown[];
  Fills?: unknown[];
  Borders?: unknown[];
  CellXf?: Array<Record<string, unknown>>;
};

type WorkbookWithMetadata = XLSX.WorkBook & {
  keys?: string[];
  files?: Record<string, { content?: string | Uint8Array | ArrayBuffer }>;
  Styles?: WorkbookStyleMetadata;
};

type PackageRelationship = {
  id: string;
  owner: string;
  target: string;
  type: string;
};

type PackageContentTypes = {
  defaults: Map<string, string>;
  overrides: Map<string, string>;
};

function cellValue(cell: XLSX.CellObject | undefined): ExcelCellView['value'] {
  if (!cell || cell.v === undefined || cell.v === null) {
    return null;
  }
  if (cell.t === 'e') {
    return cell.w || String(cell.v);
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

function actualWorksheetBounds(worksheet: XLSX.WorkSheet): XLSX.Range | null {
  let startRow = Number.POSITIVE_INFINITY;
  let startColumn = Number.POSITIVE_INFINITY;
  let endRow = -1;
  let endColumn = -1;

  for (const address of Object.keys(worksheet)) {
    if (!/^[A-Z]{1,3}[1-9]\d*$/.test(address)) {
      continue;
    }
    const cell = XLSX.utils.decode_cell(address);
    startRow = Math.min(startRow, cell.r);
    startColumn = Math.min(startColumn, cell.c);
    endRow = Math.max(endRow, cell.r);
    endColumn = Math.max(endColumn, cell.c);
  }

  if (endRow < 0 || endColumn < 0) {
    return null;
  }
  return {
    s: { r: startRow, c: startColumn },
    e: { r: endRow, c: endColumn },
  };
}

function assertWorksheetLimits(name: string, bounds: XLSX.Range): void {
  const rows = bounds.e.r - bounds.s.r + 1;
  const columns = bounds.e.c - bounds.s.c + 1;
  const cells = rows * columns;
  const checks: Array<{
    dimension: ExcelWorkbookLimitDimension;
    actual: number;
    limit: number;
  }> = [
    { dimension: 'rows', actual: rows, limit: EXCEL_MAX_ROWS_PER_SHEET },
    { dimension: 'columns', actual: columns, limit: EXCEL_MAX_COLUMNS_PER_SHEET },
    { dimension: 'cells', actual: cells, limit: EXCEL_MAX_CELLS_PER_SHEET },
  ];
  const exceeded = checks.find(({ actual, limit }) => actual > limit);
  if (exceeded) {
    throw new ExcelWorkbookLimitError({ sheetName: name, ...exceeded });
  }
}

function sheetView(name: string, worksheet: XLSX.WorkSheet): ExcelSheetView {
  const bounds = actualWorksheetBounds(worksheet);
  if (!bounds) {
    return { name, range: '', headers: [], rows: [], merges: [] };
  }
  assertWorksheetLimits(name, bounds);

  const range = XLSX.utils.encode_range(bounds);
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

function decodeXmlAttribute(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function xmlAttribute(tag: string, name: string): string | null {
  const match = new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i').exec(tag);
  return match ? decodeXmlAttribute(match[2]) : null;
}

function normalizePackagePart(path: string): string {
  const parts: string[] = [];
  for (const part of path.replace(/\\/g, '/').replace(/^\/+/, '').split('/')) {
    if (!part || part === '.') {
      continue;
    }
    if (part === '..') {
      parts.pop();
    } else {
      parts.push(part);
    }
  }
  return parts.join('/');
}

function packageFiles(workbook: WorkbookWithMetadata): Map<string, { content?: string | Uint8Array | ArrayBuffer }> {
  return new Map(Object.entries(workbook.files || {}).map(
    ([path, file]) => [normalizePackagePart(path), file],
  ));
}

function packagePartText(
  files: Map<string, { content?: string | Uint8Array | ArrayBuffer }>,
  path: string,
): string | null {
  const content = files.get(normalizePackagePart(path))?.content;
  if (typeof content === 'string') {
    return content;
  }
  if (content instanceof Uint8Array) {
    return new TextDecoder().decode(content);
  }
  if (content instanceof ArrayBuffer) {
    return new TextDecoder().decode(new Uint8Array(content));
  }
  return null;
}

function relationshipOwner(path: string): string | null {
  if (path === '_rels/.rels') {
    return '';
  }
  const match = /^(.*\/)?_rels\/([^/]+)\.rels$/i.exec(path);
  return match ? normalizePackagePart(`${match[1] || ''}${match[2]}`) : null;
}

function resolveRelationshipTarget(owner: string, target: string): string {
  if (target.startsWith('/')) {
    return normalizePackagePart(target);
  }
  const slash = owner.lastIndexOf('/');
  const directory = slash >= 0 ? owner.slice(0, slash + 1) : '';
  return normalizePackagePart(`${directory}${target}`);
}

function parsePackageRelationships(
  files: Map<string, { content?: string | Uint8Array | ArrayBuffer }>,
): Map<string, PackageRelationship[]> {
  const byOwner = new Map<string, PackageRelationship[]>();
  for (const path of files.keys()) {
    const owner = relationshipOwner(path);
    const xml = owner === null ? null : packagePartText(files, path);
    if (owner === null || !xml) {
      continue;
    }
    const relationships: PackageRelationship[] = [];
    for (const tag of xml.match(/<(?:[A-Za-z][\w.-]*:)?Relationship\b[^>]*>/gi) || []) {
      const id = xmlAttribute(tag, 'Id');
      const target = xmlAttribute(tag, 'Target');
      const type = xmlAttribute(tag, 'Type');
      const targetMode = xmlAttribute(tag, 'TargetMode');
      if (id && target && type && targetMode?.toLowerCase() !== 'external') {
        relationships.push({ id, owner, target: resolveRelationshipTarget(owner, target), type });
      }
    }
    byOwner.set(owner, relationships);
  }
  return byOwner;
}

function parsePackageContentTypes(
  files: Map<string, { content?: string | Uint8Array | ArrayBuffer }>,
): PackageContentTypes | null {
  const xml = packagePartText(files, '[Content_Types].xml');
  if (!xml) {
    return null;
  }
  const result: PackageContentTypes = { defaults: new Map(), overrides: new Map() };
  for (const tag of xml.match(/<(?:[A-Za-z][\w.-]*:)?(?:Default|Override)\b[^>]*>/gi) || []) {
    const contentType = xmlAttribute(tag, 'ContentType');
    const extension = xmlAttribute(tag, 'Extension');
    const partName = xmlAttribute(tag, 'PartName');
    if (contentType && extension) {
      result.defaults.set(extension.toLowerCase(), contentType);
    } else if (contentType && partName) {
      result.overrides.set(normalizePackagePart(partName), contentType);
    }
  }
  return result;
}

function packageContentType(contentTypes: PackageContentTypes, part: string): string | null {
  const normalized = normalizePackagePart(part);
  const override = contentTypes.overrides.get(normalized);
  if (override) {
    return override;
  }
  const extension = normalized.includes('.') ? normalized.split('.').pop()?.toLowerCase() : undefined;
  return extension ? contentTypes.defaults.get(extension) || null : null;
}

function relationshipIsReferenced(
  files: Map<string, { content?: string | Uint8Array | ArrayBuffer }>,
  relationship: PackageRelationship,
): boolean {
  if (!/(?:\/worksheet|\/drawing|\/chart)$/i.test(relationship.type)) {
    return true;
  }
  const source = packagePartText(files, relationship.owner);
  if (!source) {
    return false;
  }
  const escapedId = relationship.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:[A-Za-z][\\w.-]*:)?id\\s*=\\s*(["'])${escapedId}\\1`, 'i').test(source);
}

function workbookPackageFeatures(workbook: WorkbookWithMetadata): { charts: boolean; macros: boolean } {
  const files = packageFiles(workbook);
  const contentTypes = parsePackageContentTypes(files);
  if (!contentTypes) {
    return { charts: false, macros: Boolean(workbook.vbaraw) };
  }

  const relationships = parsePackageRelationships(files);
  const reachable = new Set<string>(['']);
  const queue = [''];
  let charts = false;
  let macros = false;

  while (queue.length > 0) {
    const owner = queue.shift() || '';
    for (const relationship of relationships.get(owner) || []) {
      if (!files.has(relationship.target) || !relationshipIsReferenced(files, relationship)) {
        continue;
      }
      const ownerContentType = packageContentType(contentTypes, owner);
      const targetContentType = packageContentType(contentTypes, relationship.target);
      if (
        /\/vbaProject$/i.test(relationship.type)
        && targetContentType === 'application/vnd.ms-office.vbaProject'
        && ownerContentType?.includes('.macroEnabled.main')
      ) {
        macros = true;
      }
      if (
        /\/chart$/i.test(relationship.type)
        && ownerContentType === 'application/vnd.openxmlformats-officedocument.drawing+xml'
        && targetContentType === 'application/vnd.openxmlformats-officedocument.drawingml.chart+xml'
      ) {
        charts = true;
      }
      if (!reachable.has(relationship.target)) {
        reachable.add(relationship.target);
        queue.push(relationship.target);
      }
    }
  }

  return { charts, macros };
}

function workbookHasUnsupportedNumberFormat(workbook: XLSX.WorkBook): boolean {
  return workbook.SheetNames.some((name) => Object.entries(workbook.Sheets[name]).some(
    ([key, cell]) => {
      if (key.startsWith('!') || typeof cell !== 'object' || cell === null) {
        return false;
      }
      const format = (cell as XLSX.CellObject).z;
      return typeof format === 'string'
        && format !== 'General'
        && !XLSX.SSF.is_date(format);
    },
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
  return hasNonDefaultStyles
    || hasSheetLayoutFormatting
    || workbookHasUnsupportedNumberFormat(workbook);
}

function workbookWarnings(workbook: WorkbookWithMetadata): string[] {
  const features = workbookPackageFeatures(workbook);
  const warnings: string[] = [];
  if (features.macros) {
    warnings.push('Macros are present but are not executed.');
  }
  if (features.charts) {
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
  const text = typeof value === 'string'
    ? neutralizeCsvFormula(value)
    : value === null
      ? ''
      : String(value);
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
