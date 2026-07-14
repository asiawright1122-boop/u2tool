import * as XLSX from 'xlsx';
import JSZip from 'jszip';

function writeWorkbook(workbook: XLSX.WorkBook, bookType: XLSX.BookType = 'xlsx'): Uint8Array {
  return new Uint8Array(XLSX.write(workbook, { type: 'array', bookType }));
}

export function createExcelWorkbookFixture(): Uint8Array {
  const workbook = XLSX.utils.book_new();
  const people = XLSX.utils.aoa_to_sheet([
    ['Name', 'Score', 'Active', 'Joined', 'Note', 'Double score'],
    ['Alice', 20, true, new Date('2024-01-02T00:00:00.000Z'), 'comma, quote "and"\nline', null],
    ['Bob', 10, false, new Date('2024-02-03T00:00:00.000Z'), null, null],
    ['Cara', 20, true, new Date('2024-03-04T00:00:00.000Z'), 'plain', null],
    ['Summary', null, null, null, null, null],
  ], { cellDates: true });

  people.F2 = { t: 'n', v: 999, f: 'B2*2' };
  people['!merges'] = [XLSX.utils.decode_range('A5:B5')];
  XLSX.utils.book_append_sheet(workbook, people, 'People');

  const inventory = XLSX.utils.aoa_to_sheet([
    ['Item', 'Quantity'],
    ['Pencil', 3],
    ['Notebook', 1],
  ]);
  XLSX.utils.book_append_sheet(workbook, inventory, 'Inventory');

  return writeWorkbook(workbook);
}

export function createEmptyExcelWorkbookFixture(): Uint8Array {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, {}, 'Empty');
  return writeWorkbook(workbook);
}

export function createCorruptExcelWorkbookFixture(): Uint8Array {
  return new TextEncoder().encode('this is not a workbook');
}

export async function createExcelWorkbookMetadataFixture(): Promise<Uint8Array> {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([
    ['Label', 'Value'],
    ['Styled layout', 1],
  ]);
  worksheet['!cols'] = [{ wch: 28, hidden: true }, { wch: 12 }];
  worksheet['!rows'] = [{ hpt: 24 }, { hpt: 18, level: 1 }];
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Metadata');

  const archive = await JSZip.loadAsync(writeWorkbook(workbook));
  archive.file('xl/vbaProject.bin', new Uint8Array([0x00, 0x01, 0x02, 0x03]));
  archive.file(
    'xl/charts/chart1.xml',
    '<?xml version="1.0"?><c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart"/>',
  );
  return archive.generateAsync({ type: 'uint8array' });
}
