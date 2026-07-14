import * as XLSX from 'xlsx';
import JSZip from 'jszip';

function writeWorkbook(workbook: XLSX.WorkBook, bookType: XLSX.BookType = 'xlsx'): Uint8Array {
  return new Uint8Array(XLSX.write(workbook, { type: 'array', bookType }));
}

async function archiveText(archive: JSZip, path: string): Promise<string> {
  const file = archive.file(path);
  if (!file) {
    throw new Error(`Missing fixture package part: ${path}`);
  }
  return file.async('string');
}

async function moveArchivePart(archive: JSZip, from: string, to: string): Promise<void> {
  const file = archive.file(from);
  if (!file) {
    throw new Error(`Missing fixture package part: ${from}`);
  }
  archive.file(to, await file.async('uint8array'));
  archive.remove(from);
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

export function createExcelWorkbookDisplayFixture(): Uint8Array {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([
    ['Formula error', 'Currency', 'Percent', 'General'],
    [null, null, null, 2],
  ]);
  worksheet.A2 = { t: 'e', v: 0x07, w: '#DIV/0!', f: '1/0' };
  worksheet.B2 = { t: 'n', v: 1234.5, z: '$#,##0.00' };
  worksheet.C2 = { t: 'n', v: 0.25, z: '0%' };
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Display');
  return writeWorkbook(workbook);
}

export async function createExcelWorkbookMetadataFixture(): Promise<Uint8Array> {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([
    ['Label', 'Value'],
    ['Styled layout', 1],
  ]);
  worksheet.B2.z = '$0.00';
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Metadata');

  const archive = await JSZip.loadAsync(writeWorkbook(workbook));
  const contentTypes = (await archiveText(archive, '[Content_Types].xml'))
    .replace(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml',
      'application/vnd.ms-excel.sheet.macroEnabled.main+xml',
    )
    .replace('</Types>', [
      '<Override PartName="/xl/vbaProject.bin" ContentType="application/vnd.ms-office.vbaProject"/>',
      '<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>',
      '<Override PartName="/xl/charts/chart1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>',
      '</Types>',
    ].join(''));
  archive.file('[Content_Types].xml', contentTypes);

  const workbookRelationships = (await archiveText(archive, 'xl/_rels/workbook.xml.rels'))
    .replace(
      '</Relationships>',
      '<Relationship Id="rIdVba" Type="http://schemas.microsoft.com/office/2006/relationships/vbaProject" Target="vbaProject.bin"/></Relationships>',
    );
  archive.file('xl/_rels/workbook.xml.rels', workbookRelationships);

  const worksheetXml = (await archiveText(archive, 'xl/worksheets/sheet1.xml'))
    .replace('</worksheet>', '<drawing r:id="rIdDrawing1"/></worksheet>');
  archive.file('xl/worksheets/sheet1.xml', worksheetXml);
  archive.file(
    'xl/worksheets/_rels/sheet1.xml.rels',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
      + '<Relationship Id="rIdDrawing1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing1.xml"/>'
      + '</Relationships>',
  );

  archive.file(
    'xl/drawings/drawing1.xml',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      + '<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" '
      + 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
      + 'xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" '
      + 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
      + '<xdr:twoCellAnchor><xdr:from><xdr:col>0</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>0</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from>'
      + '<xdr:to><xdr:col>4</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>8</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to>'
      + '<xdr:graphicFrame macro=""><xdr:nvGraphicFramePr><xdr:cNvPr id="2" name="Chart 1"/><xdr:cNvGraphicFramePr/></xdr:nvGraphicFramePr>'
      + '<xdr:xfrm/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart"><c:chart r:id="rIdChart1"/></a:graphicData></a:graphic>'
      + '</xdr:graphicFrame><xdr:clientData/></xdr:twoCellAnchor></xdr:wsDr>',
  );
  archive.file(
    'xl/drawings/_rels/drawing1.xml.rels',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
      + '<Relationship Id="rIdChart1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="../charts/chart1.xml"/>'
      + '</Relationships>',
  );
  archive.file('xl/vbaProject.bin', new Uint8Array([0x00, 0x01, 0x02, 0x03]));
  archive.file(
    'xl/charts/chart1.xml',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      + '<c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart"><c:chart/></c:chartSpace>',
  );
  return archive.generateAsync({ type: 'uint8array' });
}

export async function createExcelWorkbookOrphanMetadataFixture(): Promise<Uint8Array> {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([
    ['Label', 'Value'],
    ['Plain workbook', 1],
  ]), 'Orphans');

  const archive = await JSZip.loadAsync(writeWorkbook(workbook));
  archive.file('xl/vbaProject.bin', new Uint8Array([0x00, 0x01, 0x02, 0x03]));
  archive.file(
    'xl/charts/chart1.xml',
    '<?xml version="1.0"?><c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart"/>',
  );
  return archive.generateAsync({ type: 'uint8array' });
}

export async function createExcelWorkbookCustomPathMetadataFixture(): Promise<Uint8Array> {
  const archive = await JSZip.loadAsync(await createExcelWorkbookMetadataFixture());

  const contentTypes = (await archiveText(archive, '[Content_Types].xml'))
    .replace('/xl/workbook.xml', '/custom/workbook-main.xml')
    .replace('/xl/vbaProject.bin', '/custom/vbaProject.bin')
    .replace('/xl/drawings/drawing1.xml', '/custom/visuals/canvas.xml')
    .replace('/xl/charts/chart1.xml', '/custom/visuals/chart-data.xml');
  archive.file('[Content_Types].xml', contentTypes);

  const rootRelationships = (await archiveText(archive, '_rels/.rels'))
    .replace('Target="xl/workbook.xml"', 'Target="custom/workbook-main.xml"');
  archive.file('_rels/.rels', rootRelationships);

  const workbookRelationships = (await archiveText(archive, 'xl/_rels/workbook.xml.rels'))
    .replace('Target="worksheets/sheet1.xml"', 'Target="/xl/worksheets/sheet1.xml"')
    .replace('Target="theme/theme1.xml"', 'Target="/xl/theme/theme1.xml"')
    .replace('Target="styles.xml"', 'Target="/xl/styles.xml"')
    .replace('Target="metadata.xml"', 'Target="/xl/metadata.xml"')
    .replace('Target="vbaProject.bin"', 'Target="/custom/vbaProject.bin"');
  archive.file('custom/_rels/workbook-main.xml.rels', workbookRelationships);

  const worksheetRelationships = (await archiveText(archive, 'xl/worksheets/_rels/sheet1.xml.rels'))
    .replace('Target="../drawings/drawing1.xml"', 'Target="/custom/visuals/canvas.xml"');
  archive.file('xl/worksheets/_rels/sheet1.xml.rels', worksheetRelationships);

  const drawingRelationships = (await archiveText(archive, 'xl/drawings/_rels/drawing1.xml.rels'))
    .replace('Target="../charts/chart1.xml"', 'Target="chart-data.xml"');
  archive.file('custom/visuals/_rels/canvas.xml.rels', drawingRelationships);

  await moveArchivePart(archive, 'xl/workbook.xml', 'custom/workbook-main.xml');
  archive.remove('xl/_rels/workbook.xml.rels');
  await moveArchivePart(archive, 'xl/vbaProject.bin', 'custom/vbaProject.bin');
  await moveArchivePart(archive, 'xl/drawings/drawing1.xml', 'custom/visuals/canvas.xml');
  archive.remove('xl/drawings/_rels/drawing1.xml.rels');
  await moveArchivePart(archive, 'xl/charts/chart1.xml', 'custom/visuals/chart-data.xml');

  return archive.generateAsync({ type: 'uint8array' });
}
