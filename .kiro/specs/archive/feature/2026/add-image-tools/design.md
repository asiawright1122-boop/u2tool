# Design Document: Add Image Tools

## Overview

本设计文档描述了为 U2Tool 项目添加 14 个新图片工具的技术方案。所有工具都将在浏览器端使用 Canvas API、File API 和相关 JavaScript 库实现，无需后端服务。

## Architecture

### 技术栈

- **React 18** + **Next.js 14**: 前端框架
- **TypeScript**: 类型安全
- **Canvas API**: 图片处理核心
- **next-intl**: 国际化支持
- **gif.js**: GIF 编码库
- **gifuct-js**: GIF 解码库
- **exif-js**: EXIF 数据处理
- **jszip**: ZIP 文件生成
- **color-thief**: 颜色提取

### 组件架构

```
src/components/tools/
├── ImageCollage.tsx          # 图片拼接
├── ImageSplitter.tsx         # 图片分割
├── ImageRounder.tsx          # 图片圆角
├── ImageBorder.tsx           # 图片加边框
├── ImageFlipRotate.tsx       # 图片翻转旋转
├── ImageAdjustment.tsx       # 图片调色
├── ImageFrostedGlass.tsx     # 毛玻璃效果
├── ImageToIco.tsx            # 图片转ICO
├── GifMaker.tsx              # GIF制作
├── GifSplitter.tsx           # GIF分割
├── GifCompressor.tsx         # GIF压缩
├── ImageToWebp.tsx           # 图片转WEBP
├── ExifViewer.tsx            # EXIF查看器
├── ColorExtractor.tsx        # 颜色提取
```

## Components and Interfaces

### 通用接口

```typescript
// 图片文件信息
interface ImageFile {
  file: File;
  dataUrl: string;
  width: number;
  height: number;
  name: string;
}

// 图片处理结果
interface ProcessedImage {
  dataUrl: string;
  width: number;
  height: number;
  format: 'png' | 'jpg' | 'webp' | 'ico' | 'gif';
  size: number;
}

// 布局方向
type LayoutDirection = 'horizontal' | 'vertical';

// 网格配置
interface GridConfig {
  rows: number;
  cols: number;
}

// 图片调整参数
interface AdjustmentParams {
  brightness: number;  // 0-200, default 100
  contrast: number;    // 0-200, default 100
  saturation: number;  // 0-200, default 100
  hue: number;         // 0-360, default 0
  blur: number;        // 0-20, default 0
}
```

### 组件接口

#### 1. ImageCollage (图片拼接)

```typescript
interface CollageState {
  images: ImageFile[];
  direction: LayoutDirection;
  spacing: number;
  backgroundColor: string;
}

// 核心函数
function createCollage(
  images: ImageFile[],
  direction: LayoutDirection,
  spacing: number,
  bgColor: string
): ProcessedImage;
```

#### 2. ImageSplitter (图片分割)

```typescript
interface SplitterState {
  image: ImageFile | null;
  grid: GridConfig;
  parts: ProcessedImage[];
}

// 核心函数
function splitImage(
  image: ImageFile,
  grid: GridConfig
): ProcessedImage[];
```

#### 3. ImageRounder (图片圆角)

```typescript
interface RounderState {
  image: ImageFile | null;
  radius: number;
  circleMode: boolean;
}

// 核心函数
function applyRoundedCorners(
  image: ImageFile,
  radius: number,
  circleMode: boolean
): ProcessedImage;
```

#### 4. ImageBorder (图片加边框)

```typescript
interface BorderState {
  image: ImageFile | null;
  borderWidth: number;
  borderColor: string;
  paddingMode: boolean;
}

// 核心函数
function addBorder(
  image: ImageFile,
  width: number,
  color: string,
  padding: boolean
): ProcessedImage;
```

#### 5. ImageFlipRotate (图片翻转旋转)

```typescript
interface FlipRotateState {
  image: ImageFile | null;
  flipH: boolean;
  flipV: boolean;
  rotation: number;
}

// 核心函数
function transformImage(
  image: ImageFile,
  flipH: boolean,
  flipV: boolean,
  rotation: number
): ProcessedImage;
```

#### 6. ImageAdjustment (图片调色)

```typescript
interface AdjustmentState {
  image: ImageFile | null;
  params: AdjustmentParams;
}

// 核心函数
function applyAdjustments(
  image: ImageFile,
  params: AdjustmentParams
): ProcessedImage;
```

#### 7. ImageFrostedGlass (毛玻璃效果)

```typescript
interface FrostedGlassState {
  image: ImageFile | null;
  blurIntensity: number;
}

// 核心函数
function applyFrostedGlass(
  image: ImageFile,
  intensity: number
): ProcessedImage;
```

#### 8. ImageToIco (图片转ICO)

```typescript
interface IcoState {
  image: ImageFile | null;
  sizes: number[];  // [16, 32, 48, 64, 128, 256]
  multiSize: boolean;
}

// 核心函数
function generateIco(
  image: ImageFile,
  sizes: number[],
  multiSize: boolean
): Blob;
```

#### 9. GifMaker (GIF制作)

```typescript
interface GifMakerState {
  frames: ImageFile[];
  delay: number;  // ms per frame
  loop: boolean;
  quality: number;
}

// 核心函数
function createGif(
  frames: ImageFile[],
  delay: number,
  loop: boolean,
  quality: number
): Promise<Blob>;
```

#### 10. GifSplitter (GIF分割)

```typescript
interface GifFrame {
  imageData: ImageData;
  delay: number;
  index: number;
}

interface GifSplitterState {
  gif: File | null;
  frames: GifFrame[];
  selectedFrames: number[];
}

// 核心函数
function extractGifFrames(gif: File): Promise<GifFrame[]>;
```

#### 11. GifCompressor (GIF压缩)

```typescript
interface GifCompressorState {
  gif: File | null;
  compressionLevel: number;
  colorReduction: boolean;
  maxColors: number;
}

// 核心函数
function compressGif(
  gif: File,
  level: number,
  reduceColors: boolean,
  maxColors: number
): Promise<Blob>;
```

#### 12. ImageToWebp (图片转WEBP)

```typescript
interface WebpState {
  images: ImageFile[];
  quality: number;
  batchMode: boolean;
}

// 核心函数
function convertToWebp(
  image: ImageFile,
  quality: number
): ProcessedImage;
```

#### 13. ExifViewer (EXIF查看器)

```typescript
interface ExifData {
  make?: string;
  model?: string;
  dateTime?: string;
  exposureTime?: string;
  fNumber?: string;
  iso?: number;
  focalLength?: string;
  gps?: { lat: number; lng: number };
  [key: string]: unknown;
}

interface ExifViewerState {
  image: ImageFile | null;
  exifData: ExifData | null;
}

// 核心函数
function extractExif(image: File): Promise<ExifData>;
function removeExif(image: File): Promise<Blob>;
```

#### 14. ColorExtractor (颜色提取)

```typescript
interface ExtractedColor {
  hex: string;
  rgb: [number, number, number];
  percentage: number;
}

interface ColorExtractorState {
  image: ImageFile | null;
  colors: ExtractedColor[];
  colorCount: number;
}

// 核心函数
function extractColors(
  image: ImageFile,
  count: number
): ExtractedColor[];
```

## Data Models

### 工具配置 (tools.ts)

```typescript
// 新增工具配置
const newImageTools = [
  { slug: 'image-collage', category: 'image', icon: '🖼️', component: 'ImageCollage' },
  { slug: 'image-splitter', category: 'image', icon: '✂️', component: 'ImageSplitter' },
  { slug: 'image-rounder', category: 'image', icon: '⭕', component: 'ImageRounder' },
  { slug: 'image-border', category: 'image', icon: '🖼️', component: 'ImageBorder' },
  { slug: 'image-flip-rotate', category: 'image', icon: '🔄', component: 'ImageFlipRotate' },
  { slug: 'image-adjustment', category: 'image', icon: '🎨', component: 'ImageAdjustment' },
  { slug: 'image-frosted-glass', category: 'image', icon: '🌫️', component: 'ImageFrostedGlass' },
  { slug: 'image-to-ico', category: 'image', icon: '🎯', component: 'ImageToIco' },
  { slug: 'gif-maker', category: 'image', icon: '🎬', component: 'GifMaker' },
  { slug: 'gif-splitter', category: 'image', icon: '📽️', component: 'GifSplitter' },
  { slug: 'gif-compressor', category: 'image', icon: '📦', component: 'GifCompressor' },
  { slug: 'image-to-webp', category: 'image', icon: '🌐', component: 'ImageToWebp' },
  { slug: 'exif-viewer', category: 'image', icon: '📷', component: 'ExifViewer' },
  { slug: 'color-extractor', category: 'image', icon: '🎨', component: 'ColorExtractor' },
];
```

### 翻译键结构

```json
{
  "tools": {
    "image-collage": {
      "name": "Image Collage",
      "description": "Combine multiple images into one",
      "seo_title": "Image Collage Tool - Combine Images Online",
      "seo_description": "Free online tool to combine multiple images into one collage"
    }
    // ... 其他工具翻译
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Collage Layout Dimensions

*For any* set of images and layout configuration (horizontal/vertical with spacing), the output collage dimensions SHALL be calculated correctly:
- Horizontal: width = sum(image widths) + (n-1) * spacing, height = max(image heights)
- Vertical: height = sum(image heights) + (n-1) * spacing, width = max(image widths)

**Validates: Requirements 1.2, 1.3, 1.4**

### Property 2: Image Splitter Grid Output

*For any* image and grid configuration NxM, the splitImage function SHALL produce exactly N*M image parts, where each part has dimensions (originalWidth/M) x (originalHeight/N).

**Validates: Requirements 2.2, 2.3**

### Property 3: Border Dimension Increase

*For any* image with dimensions WxH and border width B, the addBorder function SHALL produce an output with dimensions (W + 2*B) x (H + 2*B).

**Validates: Requirements 4.2, 4.4**

### Property 4: Flip Operation Reversibility

*For any* image, applying the same flip operation twice (horizontal or vertical) SHALL return an image identical to the original.

**Validates: Requirements 5.2, 5.3**

### Property 5: Rotation Round-Trip

*For any* image, rotating by 360 degrees SHALL produce an image with the same dimensions as the original.

**Validates: Requirements 5.4**

### Property 6: Adjustment Reset Restores Defaults

*For any* image with applied adjustments, clicking reset SHALL restore all adjustment parameters to their default values (brightness=100, contrast=100, saturation=100, hue=0).

**Validates: Requirements 6.6**

### Property 7: ICO Size Generation

*For any* image and selected ICO sizes, the generateIco function SHALL produce icons at exactly those specified sizes.

**Validates: Requirements 8.2, 8.3**

### Property 8: GIF Frame Count Preservation

*For any* set of N input images, the createGif function SHALL produce a GIF with exactly N frames.

**Validates: Requirements 9.2, 9.3, 9.4**

### Property 9: GIF Splitter Frame Extraction

*For any* GIF with N frames, the extractGifFrames function SHALL return exactly N frame objects.

**Validates: Requirements 10.1, 10.3**

### Property 10: GIF Compression Size Reduction

*For any* GIF file, the compressGif function SHALL produce an output with size less than or equal to the original size.

**Validates: Requirements 11.4, 11.5**

### Property 11: WEBP Conversion Validity

*For any* valid image file (JPG, PNG, GIF), the convertToWebp function SHALL produce a valid WEBP file that can be decoded.

**Validates: Requirements 12.4**

### Property 12: EXIF Removal Completeness

*For any* image with EXIF data, after calling removeExif, extracting EXIF from the result SHALL return an empty or null EXIF object.

**Validates: Requirements 13.3**

### Property 13: Color Extraction Count

*For any* image and requested color count N (where 5 ≤ N ≤ 10), the extractColors function SHALL return exactly N colors.

**Validates: Requirements 14.2**

## Error Handling

### 文件验证错误

```typescript
class ImageValidationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'ImageValidationError';
  }
}

// 错误代码
const ErrorCodes = {
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  CORRUPTED_IMAGE: 'CORRUPTED_IMAGE',
  UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT',
  CANVAS_ERROR: 'CANVAS_ERROR',
};
```

### 错误处理策略

1. **文件类型验证**: 在上传时检查 MIME 类型
2. **文件大小限制**: 单个文件最大 50MB
3. **Canvas 错误**: 捕获并显示友好错误信息
4. **内存限制**: 对于大图片，使用分块处理

## Testing Strategy

### 单元测试

使用 Vitest 进行单元测试，覆盖核心处理函数：

```typescript
// 示例测试
describe('ImageSplitter', () => {
  it('should split image into correct number of parts', () => {
    const image = createMockImage(300, 300);
    const parts = splitImage(image, { rows: 3, cols: 3 });
    expect(parts.length).toBe(9);
  });
});
```

### 属性测试

使用 fast-check 进行属性测试，验证核心正确性属性：

```typescript
import fc from 'fast-check';

// Property 2: Image Splitter Grid Output
describe('Property: Image Splitter Grid Output', () => {
  it('should produce exactly N*M parts for NxM grid', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),  // rows
        fc.integer({ min: 1, max: 10 }),  // cols
        (rows, cols) => {
          const image = createMockImage(1000, 1000);
          const parts = splitImage(image, { rows, cols });
          return parts.length === rows * cols;
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### 测试配置

- 每个属性测试运行 100 次迭代
- 使用 mock 图片数据避免真实文件 I/O
- 测试文件命名: `ComponentName.test.ts` (单元测试), `ComponentName.property.test.ts` (属性测试)

