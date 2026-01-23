# 依赖分析报告

**分析时间**: 2026/1/23 12:40:25

## 📊 依赖统计

| 指标 | 数值 |
|------|------|
| 总依赖数 | 55 |
| 生产依赖 | 34 |
| 开发依赖 | 21 |
| 总大小 | 20700 KB (20.21 MB) |
| Gzip 后 | 6288 KB (6.14 MB) |

## 📦 大型依赖 (> 100KB)

| # | 名称 | 大小 | Gzip | 类型 | 动态导入 |
|---|------|------|------|------|----------|
| 1 | tailwindcss | 5567 KB | 1670 KB | 开发 | ❌ |
| 2 | eslint | 2924 KB | 877 KB | 开发 | ❌ |
| 3 | @types/node | 2229 KB | 669 KB | 开发 | ❌ |
| 4 | fast-check | 1619 KB | 486 KB | 开发 | ❌ |
| 5 | vitest | 1557 KB | 467 KB | 开发 | ❌ |
| 6 | echarts | 800 KB | 300 KB | 生产 | ❌ |
| 7 | @eslint/eslintrc | 793 KB | 238 KB | 开发 | ❌ |
| 8 | xlsx | 600 KB | 180 KB | 生产 | ❌ |
| 9 | next | 500 KB | 150 KB | 生产 | ❌ |
| 10 | pdfjs-dist | 400 KB | 120 KB | 生产 | ✅ |
| 11 | @types/react | 393 KB | 118 KB | 开发 | ❌ |
| 12 | typescript | 300 KB | 90 KB | 开发 | ❌ |
| 13 | eslint-config-next | 206 KB | 62 KB | 开发 | ❌ |
| 14 | jspdf | 200 KB | 60 KB | 生产 | ✅ |
| 15 | lucide-react | 200 KB | 60 KB | 生产 | ❌ |
| 16 | postcss | 200 KB | 60 KB | 开发 | ❌ |
| 17 | autoprefixer | 194 KB | 58 KB | 开发 | ❌ |
| 18 | globals | 194 KB | 58 KB | 开发 | ❌ |
| 19 | pdf-lib | 180 KB | 55 KB | 生产 | ❌ |
| 20 | html2pdf.js | 150 KB | 45 KB | 生产 | ✅ |
| 21 | mammoth | 150 KB | 45 KB | 生产 | ❌ |
| 22 | react-dom | 130 KB | 45 KB | 生产 | ❌ |
| 23 | react | 120 KB | 40 KB | 生产 | ❌ |

## ⚠️ 未使用依赖

1. colorthief
2. dijkstrajs

## 💡 优化建议

## 大型依赖优化

## 未使用依赖
- **colorthief**: 似乎未在代码中使用，考虑移除
- **dijkstrajs**: 似乎未在代码中使用，考虑移除

## 通用优化建议
- 使用 webpack-bundle-analyzer 可视化分析 bundle 组成
- 启用 tree-shaking 移除未使用的代码
- 考虑使用 CDN 加载大型第三方库
- 定期运行 `npm audit` 检查安全漏洞
- 使用 `npm outdated` 检查过时的依赖
