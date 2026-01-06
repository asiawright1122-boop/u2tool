/**
 * 创建简单的 ICO 文件
 * ICO 文件格式：https://en.wikipedia.org/wiki/ICO_(file_format)
 * 
 * 这个脚本创建一个包含 16x16 和 32x32 图标的 ICO 文件
 */

import * as fs from 'fs';
import * as path from 'path';

// 创建一个简单的 16x16 BMP 图像数据（青色背景 + 简单的 UT 图案）
function create16x16BmpData(): Buffer {
  const width = 16;
  const height = 16;
  const bpp = 32; // 32 bits per pixel (BGRA)
  const rowSize = width * 4;
  const imageSize = rowSize * height;
  
  // BMP 数据（从底部到顶部，BGRA 格式）
  const pixels = Buffer.alloc(imageSize);
  
  // 颜色定义 (BGRA)
  const teal = [0x6e, 0x76, 0x0f, 0xff]; // #0f766e
  const lightTeal = [0xe4, 0xf6, 0x99, 0xff]; // #99f6e4
  const bg = [0xfa, 0xfd, 0xf0, 0xff]; // #f0fdfa
  
  // 简单的 UT 图案（16x16）
  const pattern = [
    '................',
    '..UU........UU..',
    '..UU........UU..',
    '..UU........UU..',
    '..UU........UU..',
    '..UU........UU..',
    '..UU........UU..',
    '..UU........UU..',
    '..UU........UU..',
    '..UUUUUUUUUUUU..',
    '....UUUUUUUU....',
    '....TTTTTTTT....',
    '......TTTT......',
    '......TTTT......',
    '......TTTT......',
    '................',
  ];
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const char = pattern[height - 1 - y][x]; // BMP 从底部开始
      const offset = (y * width + x) * 4;
      let color = bg;
      if (char === 'U') color = teal;
      if (char === 'T') color = lightTeal;
      pixels[offset] = color[0];     // B
      pixels[offset + 1] = color[1]; // G
      pixels[offset + 2] = color[2]; // R
      pixels[offset + 3] = color[3]; // A
    }
  }
  
  return pixels;
}

// 创建 32x32 BMP 数据
function create32x32BmpData(): Buffer {
  const width = 32;
  const height = 32;
  const rowSize = width * 4;
  const imageSize = rowSize * height;
  
  const pixels = Buffer.alloc(imageSize);
  
  // 颜色定义 (BGRA)
  const teal = [0x6e, 0x76, 0x0f, 0xff]; // #0f766e
  const midTeal = [0x88, 0x94, 0x0d, 0xff]; // #0d9488
  const lightTeal = [0xe4, 0xf6, 0x99, 0xff]; // #99f6e4
  const bg = [0xfa, 0xfd, 0xf0, 0xff]; // #f0fdfa
  
  // 32x32 图案
  const pattern = [
    '................................',
    '................................',
    '....UUUU..............UUUU.....',
    '....UUUU..............UUUU.....',
    '....UUUU..............UUUU.....',
    '....UUUU..............UUUU.....',
    '....UUUU..............UUUU.....',
    '....UUUU..............UUUU.....',
    '....UUUU..............UUUU.....',
    '....UUUU..............UUUU.....',
    '....UUUU..............UUUU.....',
    '....UUUU..............UUUU.....',
    '....UUUU..............UUUU.....',
    '....UUUU..............UUUU.....',
    '....UUUU..............UUUU.....',
    '....UUUU..............UUUU.....',
    '....UUUUUUUUUUUUUUUUUUUUUU.....',
    '....UUUUUUUUUUUUUUUUUUUUUU.....',
    '......UUUUUUUUUUUUUUUUUU.......',
    '........UUUUUUUUUUUUUU.........',
    '........TTTTTTTTTTTTTT.........',
    '........TTTTTTTTTTTTTT.........',
    '..........MMMMMMMMMM...........',
    '............MMMMMM.............',
    '............LLLLLL.............',
    '............LLLLLL.............',
    '............LLLLLL.............',
    '............LLLLLL.............',
    '............LLLLLL.............',
    '............LLLLLL.............',
    '................................',
    '................................',
  ];
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const char = pattern[height - 1 - y][x];
      const offset = (y * width + x) * 4;
      let color = bg;
      if (char === 'U') color = teal;
      if (char === 'M') color = midTeal;
      if (char === 'T') color = midTeal;
      if (char === 'L') color = lightTeal;
      pixels[offset] = color[0];
      pixels[offset + 1] = color[1];
      pixels[offset + 2] = color[2];
      pixels[offset + 3] = color[3];
    }
  }
  
  return pixels;
}

function createIcoFile(): void {
  const images = [
    { width: 16, height: 16, data: create16x16BmpData() },
    { width: 32, height: 32, data: create32x32BmpData() },
  ];
  
  // ICO 文件头 (6 bytes)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);      // Reserved
  header.writeUInt16LE(1, 2);      // Type (1 = ICO)
  header.writeUInt16LE(images.length, 4); // Number of images
  
  // 计算偏移量
  const dirEntrySize = 16;
  let dataOffset = 6 + (dirEntrySize * images.length);
  
  // 目录条目
  const dirEntries: Buffer[] = [];
  const imageDataList: Buffer[] = [];
  
  for (const img of images) {
    const bpp = 32;
    const imageSize = img.width * img.height * 4;
    
    // BITMAPINFOHEADER (40 bytes)
    const bmpHeader = Buffer.alloc(40);
    bmpHeader.writeUInt32LE(40, 0);           // Header size
    bmpHeader.writeInt32LE(img.width, 4);     // Width
    bmpHeader.writeInt32LE(img.height * 2, 8); // Height (doubled for ICO)
    bmpHeader.writeUInt16LE(1, 12);           // Planes
    bmpHeader.writeUInt16LE(bpp, 14);         // Bits per pixel
    bmpHeader.writeUInt32LE(0, 16);           // Compression
    bmpHeader.writeUInt32LE(imageSize, 20);   // Image size
    bmpHeader.writeInt32LE(0, 24);            // X pixels per meter
    bmpHeader.writeInt32LE(0, 28);            // Y pixels per meter
    bmpHeader.writeUInt32LE(0, 32);           // Colors used
    bmpHeader.writeUInt32LE(0, 36);           // Important colors
    
    const fullImageData = Buffer.concat([bmpHeader, img.data]);
    
    // 目录条目 (16 bytes)
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width === 256 ? 0 : img.width, 0);   // Width
    entry.writeUInt8(img.height === 256 ? 0 : img.height, 1); // Height
    entry.writeUInt8(0, 2);                    // Color palette
    entry.writeUInt8(0, 3);                    // Reserved
    entry.writeUInt16LE(1, 4);                 // Color planes
    entry.writeUInt16LE(bpp, 6);               // Bits per pixel
    entry.writeUInt32LE(fullImageData.length, 8);  // Size of image data
    entry.writeUInt32LE(dataOffset, 12);       // Offset to image data
    
    dirEntries.push(entry);
    imageDataList.push(fullImageData);
    dataOffset += fullImageData.length;
  }
  
  // 组合所有部分
  const ico = Buffer.concat([header, ...dirEntries, ...imageDataList]);
  
  // 写入文件
  const outputPath = path.join(process.cwd(), 'public', 'favicon.ico');
  fs.writeFileSync(outputPath, ico);
  console.log(`✅ Created favicon.ico (${ico.length} bytes)`);
}

createIcoFile();
