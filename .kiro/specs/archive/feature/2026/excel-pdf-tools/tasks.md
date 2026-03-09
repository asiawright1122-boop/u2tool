# Implementation Plan: Excel & PDF Office Tools

## Overview

本实现计划将 10 个 Excel 和 PDF 办公工具分阶段实现，每个工具作为独立任务，确保增量交付和可测试性。

## Tasks

- [x] 1. 项目准备和依赖安装
  - 安装所需的 npm 依赖包 (xlsx, pdf-lib, pdfjs-dist, jszip, file-saver)
  - 验证依赖安装成功
  - _Requirements: 所有工具的基础依赖_

- [x] 2. 实现 Excel 转 JSON 工具
  - [x] 2.1 创建 ExcelToJson.tsx 组件
    - 实现文件上传和 Excel 解析
    - 实现多 sheet 选择功能
    - 实现 JSON 输出和下载
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [x] 2.2 添加 excel-to-json 工具配置和翻译
    - 在 tools.ts 添加工具配置
    - 在 ToolWrapper.tsx 添加动态导入
    - 在所有 10 个语言文件中添加翻译
    - _Requirements: 1.1_

- [x] 3. 实现 JSON 转 Excel 工具
  - [x] 3.1 创建 JsonToExcel.tsx 组件
    - 实现 JSON 输入和验证
    - 实现列头提取和 Excel 生成
    - 实现嵌套 JSON 扁平化
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [x] 3.2 添加 json-to-excel 工具配置和翻译
    - 在 tools.ts 添加工具配置
    - 在 ToolWrapper.tsx 添加动态导入
    - 在所有 10 个语言文件中添加翻译
    - _Requirements: 2.1_

- [x] 4. 实现 Excel 查看器工具
  - [x] 4.1 创建 ExcelViewer.tsx 组件
    - 实现文件上传和数据表格显示
    - 实现多 sheet 切换
    - 实现列排序功能
    - 实现数据过滤功能
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [x] 4.2 添加 excel-viewer 工具配置和翻译
    - 在 tools.ts 添加工具配置
    - 在 ToolWrapper.tsx 添加动态导入
    - 在所有 10 个语言文件中添加翻译
    - _Requirements: 3.1_

- [x] 5. 实现 Excel 合并工具
  - [x] 5.1 创建 ExcelMerger.tsx 组件
    - 实现多文件上传
    - 实现 sheet 选择
    - 实现垂直/水平合并
    - 实现列对齐
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  - [x] 5.2 添加 excel-merger 工具配置和翻译
    - 在 tools.ts 添加工具配置
    - 在 ToolWrapper.tsx 添加动态导入
    - 在所有 10 个语言文件中添加翻译
    - _Requirements: 4.1_

- [x] 6. Checkpoint - Excel 工具完成检查
  - 确保所有 Excel 工具测试通过
  - 验证所有翻译文件完整
  - 如有问题请询问用户

- [x] 7. 实现 PDF 转图片工具
  - [x] 7.1 创建 PdfToImage.tsx 组件
    - 实现 PDF 上传和页面预览
    - 实现页面选择
    - 实现 PNG/JPEG 格式输出
    - 实现 DPI 设置
    - 实现批量下载 (ZIP)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [x] 7.2 添加 pdf-to-image 工具配置和翻译
    - 在 tools.ts 添加工具配置
    - 在 ToolWrapper.tsx 添加动态导入
    - 在所有 10 个语言文件中添加翻译
    - _Requirements: 5.1_

- [x] 8. 实现图片转 PDF 工具
  - [x] 8.1 创建 ImageToPdf.tsx 组件
    - 实现多图片上传和预览
    - 实现拖拽排序
    - 实现页面大小和方向设置
    - 实现 PDF 生成和下载
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [x] 8.2 添加 image-to-pdf 工具配置和翻译
    - 在 tools.ts 添加工具配置
    - 在 ToolWrapper.tsx 添加动态导入
    - 在所有 10 个语言文件中添加翻译
    - _Requirements: 6.1_

- [x] 9. 实现 PDF 合并工具
  - [x] 9.1 创建 PdfMerger.tsx 组件
    - 实现多 PDF 上传
    - 实现文件列表和页数显示
    - 实现拖拽排序
    - 实现页面范围选择
    - 实现合并和下载
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  - [x] 9.2 添加 pdf-merger 工具配置和翻译
    - 在 tools.ts 添加工具配置
    - 在 ToolWrapper.tsx 添加动态导入
    - 在所有 10 个语言文件中添加翻译
    - _Requirements: 7.1_

- [x] 10. 实现 PDF 拆分工具
  - [x] 10.1 创建 PdfSplitter.tsx 组件
    - 实现 PDF 上传和页面缩略图
    - 实现页面选择
    - 实现页面范围拆分
    - 实现单页拆分
    - 实现批量下载
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  - [x] 10.2 添加 pdf-splitter 工具配置和翻译
    - 在 tools.ts 添加工具配置
    - 在 ToolWrapper.tsx 添加动态导入
    - 在所有 10 个语言文件中添加翻译
    - _Requirements: 8.1_

- [x] 11. 实现 PDF 压缩工具
  - [x] 11.1 创建 PdfCompressor.tsx 组件
    - 实现 PDF 上传和文件大小显示
    - 实现压缩级别选择
    - 实现压缩处理
    - 实现压缩比显示
    - 实现下载
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  - [x] 11.2 添加 pdf-compressor 工具配置和翻译
    - 在 tools.ts 添加工具配置
    - 在 ToolWrapper.tsx 添加动态导入
    - 在所有 10 个语言文件中添加翻译
    - _Requirements: 9.1_

- [x] 12. 实现 PDF 页面旋转工具
  - [x] 12.1 创建 PdfRotator.tsx 组件
    - 实现 PDF 上传和页面缩略图
    - 实现页面选择
    - 实现旋转角度选择 (90°, 180°, 270°)
    - 实现批量/单页旋转
    - 实现下载
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  - [x] 12.2 添加 pdf-rotator 工具配置和翻译
    - 在 tools.ts 添加工具配置
    - 在 ToolWrapper.tsx 添加动态导入
    - 在所有 10 个语言文件中添加翻译
    - _Requirements: 10.1_

- [x] 13. Checkpoint - PDF 工具完成检查
  - 确保所有 PDF 工具测试通过
  - 验证所有翻译文件完整
  - 如有问题请询问用户

- [x] 14. 更新工具目录文档
  - 更新 docs/TOOLS_CATALOG.md
  - 在办公工具分类中添加 10 个新工具
  - 更新工具统计数量
  - 更新更新日志
  - _Requirements: 所有工具_

- [x] 15. Final Checkpoint - 最终验证
  - 运行所有测试确保通过
  - 验证所有工具可正常访问
  - 验证所有语言翻译完整
  - 如有问题请询问用户

## Notes

- 所有任务已完成
- 每个工具已在 10 个语言文件中添加翻译
- Excel 工具使用 SheetJS (xlsx) 库
- PDF 工具使用 pdf-lib 和 pdfjs-dist 库
- 所有文件处理在浏览器端完成，无需服务器
