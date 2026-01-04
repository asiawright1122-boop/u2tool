# Design Document: Excel & PDF Office Tools

## Overview

本设计文档描述了为 U2Tool 添加 10 个 Excel 和 PDF 办公工具的技术实现方案。这些工具将在浏览器端运行，使用 JavaScript 库处理文件，无需服务器端处理。

## Architecture

### 技术栈

- **前端框架**: Next.js 14 + React 18
- **Excel 处理**: SheetJS (xlsx) - 用于读写 Excel 文件
- **PDF 处理**: pdf-lib + pdfjs-dist - 用于 PDF 操作和渲染
- **图片处理**: Canvas API + html2canvas
- **文件下载**: FileSaver.js / Blob API
- **压缩打包**: JSZip - 用于多文件打包下载

### 组件架构

```
src/components/tools/
├── ExcelToJson.tsx          # Excel 转 JSON
├── JsonToExcel.tsx          # JSON 转 Excel
├── ExcelViewer.tsx          # Excel 查看器
├── ExcelMerger.tsx          # Excel 合并
├── PdfToImage.tsx           # PDF 转图片
├── ImageToPdf.tsx           # 图片转 PDF
├── PdfMerger.tsx            # PDF 合并
├── PdfSplitter.tsx          # PDF 拆分
├── PdfCompressor.tsx        # PDF 压缩
└── PdfRotator.tsx           # PDF 页面旋转
```

## Components and Interfaces

### 1. Excel 工具共享接口

```typescript
// Excel 数据结构
interface ExcelSheet {
  name: string;
  data: Record<string, unknown>[];
  headers: string[];
}

interface ExcelFile {
  fileName: string;
  sheets: ExcelSheet[];
}

// 文件上传处理
interface FileUploadProps {
  accept: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
}
```

### 2. PDF 工具共享接口

```typescript
// PDF 页面信息
interface PdfPageInfo {
  pageNumber: number;
  width: number;
  height: number;
  thumbnail?: string;
}

interface PdfFile {
  fileName: string;
  pageCount: number;
  pages: PdfPageInfo[];
  fileSize: number;
}

// 页面范围
interface PageRange {
  start: number;
  end: number;
}
```

### 3. 工具组件结构

每个工具组件遵循统一的结构：

```typescript
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ToolName() {
  const t = useTranslations('tools');
  
  // 状态管理
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 文件处理逻辑
  const handleFileUpload = async (files: File[]) => { /* ... */ };
  const handleProcess = async () => { /* ... */ };
  const handleDownload = () => { /* ... */ };
  
  return (
    <div className="space-y-6">
      {/* 文件上传区域 */}
      {/* 配置选项 */}
      {/* 预览区域 */}
      {/* 操作按钮 */}
      {/* 结果输出 */}
    </div>
  );
}
```

## Data Models

### Excel 数据模型

```typescript
// Excel 转 JSON 输出
type JsonOutput = Record<string, unknown>[];

// JSON 转 Excel 输入
interface JsonToExcelInput {
  data: Record<string, unknown>[];
  sheetName?: string;
  fileName?: string;
}

// Excel 合并配置
interface MergeConfig {
  mode: 'vertical' | 'horizontal';
  alignByHeaders: boolean;
}
```

### PDF 数据模型

```typescript
// PDF 转图片配置
interface PdfToImageConfig {
  format: 'png' | 'jpeg';
  dpi: number;
  pages: number[] | 'all';
}

// 图片转 PDF 配置
interface ImageToPdfConfig {
  pageSize: 'a4' | 'letter' | 'legal' | 'custom';
  orientation: 'portrait' | 'landscape';
  margin: number;
}

// PDF 压缩配置
interface CompressionConfig {
  level: 'low' | 'medium' | 'high';
}

// PDF 旋转配置
interface RotationConfig {
  angle: 90 | 180 | 270;
  pages: number[] | 'all';
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Excel 解析数据完整性

*For any* valid Excel file with N rows and M columns, parsing the file SHALL produce a JSON array with exactly N data rows and M column headers.

**Validates: Requirements 1.1, 1.3, 3.1**

### Property 2: JSON 转 Excel 往返一致性

*For any* valid JSON array of objects, converting to Excel and then back to JSON SHALL produce an equivalent data structure (ignoring type coercion for numbers/strings).

**Validates: Requirements 2.1, 2.2, 2.3**

### Property 3: 嵌套 JSON 扁平化正确性

*For any* nested JSON object, flattening with dot notation SHALL produce keys that correctly represent the path to each leaf value, and unflattening SHALL restore the original structure.

**Validates: Requirements 2.5**

### Property 4: Excel 数据排序正确性

*For any* Excel data set and sort column, sorting SHALL produce data ordered according to the column values (ascending or descending).

**Validates: Requirements 3.3**

### Property 5: Excel 数据过滤正确性

*For any* Excel data set and filter condition, filtering SHALL return only rows that match the condition, and the count of filtered rows SHALL be less than or equal to the original count.

**Validates: Requirements 3.4**

### Property 6: Excel 合并列对齐正确性

*For any* two Excel sheets with overlapping column headers, merging SHALL align data by header names, with matching columns containing data from both sheets.

**Validates: Requirements 4.3, 4.4**

### Property 7: PDF 页面计数正确性

*For any* PDF file, the reported page count SHALL equal the actual number of pages in the file.

**Validates: Requirements 7.1, 8.1**

### Property 8: PDF 拆分页面范围正确性

*For any* PDF file and valid page range, splitting SHALL produce a PDF containing exactly the specified pages in the correct order.

**Validates: Requirements 8.3, 8.4**

### Property 9: PDF 压缩文件大小

*For any* PDF file, compression SHALL produce a file with size less than or equal to the original (compression ratio >= 0%).

**Validates: Requirements 9.3**

### Property 10: PDF 旋转角度正确性

*For any* PDF page and rotation angle (90°, 180°, 270°), rotating SHALL change the page orientation by the specified angle, and rotating by 360° (4x90°) SHALL restore the original orientation.

**Validates: Requirements 10.3, 10.4**

## Error Handling

### 文件验证错误

```typescript
class FileValidationError extends Error {
  constructor(
    message: string,
    public readonly fileType: string,
    public readonly expectedTypes: string[]
  ) {
    super(message);
    this.name = 'FileValidationError';
  }
}
```

### 错误处理策略

1. **文件类型验证**: 在上传时检查文件扩展名和 MIME 类型
2. **文件大小限制**: 设置合理的文件大小上限（如 50MB）
3. **解析错误**: 捕获并显示友好的错误消息
4. **内存管理**: 大文件分块处理，避免内存溢出

### 错误消息国际化

所有错误消息通过 i18n 系统提供多语言支持：

```typescript
const errorMessages = {
  invalidFileType: t('excel.errors.invalidFileType'),
  fileTooLarge: t('excel.errors.fileTooLarge'),
  parseError: t('excel.errors.parseError'),
  emptyFile: t('excel.errors.emptyFile'),
};
```

## Testing Strategy

### 单元测试

使用 Vitest 进行单元测试：

- 测试 Excel 解析函数
- 测试 JSON 转换函数
- 测试 PDF 页面操作函数
- 测试错误处理逻辑

### 属性测试

使用 fast-check 进行属性测试：

- 测试数据转换的往返一致性
- 测试排序和过滤的正确性
- 测试页面范围解析的正确性

### 测试配置

```typescript
// vitest.config.ts
export default {
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
};
```

### 属性测试示例

```typescript
import { fc } from 'fast-check';
import { describe, it, expect } from 'vitest';

describe('Excel to JSON conversion', () => {
  it('should preserve row count', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({ name: fc.string(), value: fc.integer() }), { minLength: 1 }),
        (data) => {
          const excel = jsonToExcel(data);
          const result = excelToJson(excel);
          return result.length === data.length;
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

## Dependencies

### 新增依赖

```json
{
  "dependencies": {
    "xlsx": "^0.18.5",
    "pdf-lib": "^1.17.1",
    "pdfjs-dist": "^4.0.379",
    "jszip": "^3.10.1",
    "file-saver": "^2.0.5"
  },
  "devDependencies": {
    "@types/file-saver": "^2.0.7",
    "fast-check": "^3.15.0"
  }
}
```

## Tool Slugs and Components

| Slug | Component | Category | Icon |
|------|-----------|----------|------|
| `excel-to-json` | ExcelToJson | office | 📊 |
| `json-to-excel` | JsonToExcel | office | 📑 |
| `excel-viewer` | ExcelViewer | office | 👁️ |
| `excel-merger` | ExcelMerger | office | 🔗 |
| `pdf-to-image` | PdfToImage | office | 🖼️ |
| `image-to-pdf` | ImageToPdf | office | 📄 |
| `pdf-merger` | PdfMerger | office | 📎 |
| `pdf-splitter` | PdfSplitter | office | ✂️ |
| `pdf-compressor` | PdfCompressor | office | 📦 |
| `pdf-rotator` | PdfRotator | office | 🔄 |
