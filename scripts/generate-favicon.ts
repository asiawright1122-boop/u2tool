/**
 * Favicon 生成脚本
 * 
 * 由于没有 sharp 或 canvas 库，我们使用 SVG 作为 favicon
 * Next.js 支持 SVG favicon，这是一个现代且有效的解决方案
 * 
 * 运行: npx tsx scripts/generate-favicon.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// 简化的 SVG favicon（基于 u2tool logo）
const faviconSvg = `<svg width="32" height="32" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="240" rx="54" fill="#f0fdfa"/>
  <path d="M40 50 L40 145 C40 185 75 215 120 215 C165 215 200 185 200 145 L200 50" 
        stroke="#0f766e" stroke-width="28" stroke-linecap="round" fill="none"/>
  <polygon points="75,70 165,70 155,85 85,85" fill="#14b8a6"/>
  <polygon points="100,85 140,85 120,165" fill="#0d9488"/>
  <polygon points="108,95 132,95 120,145" fill="#99f6e4"/>
</svg>`;

// 创建一个简单的 ICO 文件头（包含 SVG 数据的 PNG 占位符）
// 注意：这是一个简化的方法，真正的 ICO 需要二进制处理
function createFaviconFiles() {
  const publicDir = path.join(process.cwd(), 'public');
  const iconsDir = path.join(publicDir, 'icons');

  // 确保目录存在
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // 创建 SVG favicon
  const svgFaviconPath = path.join(publicDir, 'favicon.svg');
  fs.writeFileSync(svgFaviconPath, faviconSvg);
  console.log('✅ Created favicon.svg');

  // 创建不同尺寸的 SVG 图标
  const sizes = [16, 32, 48, 64, 128, 180, 192, 512];
  
  for (const size of sizes) {
    const sizedSvg = faviconSvg.replace('width="32" height="32"', `width="${size}" height="${size}"`);
    const filename = size === 180 
      ? 'apple-touch-icon.png' 
      : size === 192 || size === 512 
        ? `icon-${size}x${size}.png`
        : `icon-${size}x${size}.png`;
    
    // 由于我们没有图像处理库，先创建 SVG 版本
    const svgFilename = filename.replace('.png', '.svg');
    fs.writeFileSync(path.join(iconsDir, svgFilename), sizedSvg);
    console.log(`✅ Created icons/${svgFilename}`);
  }

  // 创建 safari-pinned-tab.svg（单色版本）
  const safariSvg = `<svg width="32" height="32" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M40 50 L40 145 C40 185 75 215 120 215 C165 215 200 185 200 145 L200 50" 
        stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
  <polygon points="75,70 165,70 155,85 85,85" fill="#000000"/>
  <polygon points="100,85 140,85 120,165" fill="#000000"/>
</svg>`;
  fs.writeFileSync(path.join(iconsDir, 'safari-pinned-tab.svg'), safariSvg);
  console.log('✅ Created icons/safari-pinned-tab.svg');

  console.log('\n📝 Note: For production, you should convert these SVGs to PNG/ICO using:');
  console.log('   - https://realfavicongenerator.net/');
  console.log('   - Or install sharp: npm install sharp');
}

createFaviconFiles();
