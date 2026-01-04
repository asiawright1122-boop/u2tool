# Requirements Document

## Introduction

本功能为 U2Tool 工具网站添加 Excel 和 PDF 类办公工具，扩展现有的办公工具分类。这些工具将帮助用户在浏览器中处理常见的 Excel 和 PDF 文件操作，无需安装额外软件。

## Glossary

- **Tool_System**: U2Tool 工具网站的核心系统，负责工具的注册、渲染和管理
- **Excel_Tool**: 处理 Excel 相关操作的工具组件
- **PDF_Tool**: 处理 PDF 相关操作的工具组件
- **File_Processor**: 负责文件上传、解析和处理的模块
- **Export_Module**: 负责将处理结果导出为文件的模块

## Requirements

### Requirement 1: Excel 转 JSON 工具

**User Story:** As a developer, I want to convert Excel files to JSON format, so that I can easily use spreadsheet data in my applications.

#### Acceptance Criteria

1. WHEN a user uploads an Excel file (.xlsx, .xls), THE Excel_Tool SHALL parse the file and display a preview of the data
2. WHEN the Excel file contains multiple sheets, THE Excel_Tool SHALL allow the user to select which sheet to convert
3. WHEN the user clicks the convert button, THE Excel_Tool SHALL generate valid JSON output from the selected sheet
4. WHEN the conversion is complete, THE Excel_Tool SHALL provide options to copy or download the JSON result
5. IF the uploaded file is not a valid Excel format, THEN THE Excel_Tool SHALL display a clear error message

### Requirement 2: JSON 转 Excel 工具

**User Story:** As a developer, I want to convert JSON data to Excel format, so that I can share data with non-technical users.

#### Acceptance Criteria

1. WHEN a user inputs valid JSON data, THE Excel_Tool SHALL parse and validate the JSON structure
2. WHEN the JSON is an array of objects, THE Excel_Tool SHALL use object keys as column headers
3. WHEN the user clicks the convert button, THE Excel_Tool SHALL generate a downloadable Excel file
4. IF the JSON structure is invalid or empty, THEN THE Excel_Tool SHALL display a descriptive error message
5. THE Excel_Tool SHALL support nested JSON by flattening the structure with dot notation

### Requirement 3: Excel 数据查看器

**User Story:** As a user, I want to view Excel file contents in my browser, so that I can quickly check spreadsheet data without opening Excel.

#### Acceptance Criteria

1. WHEN a user uploads an Excel file, THE Excel_Tool SHALL display the data in a table format
2. WHEN the file contains multiple sheets, THE Excel_Tool SHALL provide tabs to switch between sheets
3. THE Excel_Tool SHALL support sorting columns by clicking on column headers
4. THE Excel_Tool SHALL support filtering data by column values
5. THE Excel_Tool SHALL display cell formatting information (bold, colors) when available

### Requirement 4: Excel 合并工具

**User Story:** As a user, I want to merge multiple Excel files into one, so that I can consolidate data from different sources.

#### Acceptance Criteria

1. WHEN a user uploads multiple Excel files, THE Excel_Tool SHALL list all uploaded files
2. THE Excel_Tool SHALL allow the user to select which sheets to merge from each file
3. WHEN merging, THE Excel_Tool SHALL align columns by header names
4. THE Excel_Tool SHALL provide options to merge vertically (append rows) or horizontally (append columns)
5. WHEN the merge is complete, THE Excel_Tool SHALL generate a downloadable merged Excel file

### Requirement 5: PDF 转图片工具

**User Story:** As a user, I want to convert PDF pages to images, so that I can use them in presentations or documents.

#### Acceptance Criteria

1. WHEN a user uploads a PDF file, THE PDF_Tool SHALL display a preview of all pages
2. THE PDF_Tool SHALL allow the user to select specific pages or all pages for conversion
3. THE PDF_Tool SHALL support output formats including PNG and JPEG
4. THE PDF_Tool SHALL allow the user to set the output image resolution (DPI)
5. WHEN conversion is complete, THE PDF_Tool SHALL provide individual downloads or a ZIP file for multiple images

### Requirement 6: 图片转 PDF 工具

**User Story:** As a user, I want to convert images to PDF format, so that I can create documents from scanned images or photos.

#### Acceptance Criteria

1. WHEN a user uploads one or more images, THE PDF_Tool SHALL display previews of all images
2. THE PDF_Tool SHALL allow the user to reorder images by drag and drop
3. THE PDF_Tool SHALL support common image formats (PNG, JPEG, WebP, GIF)
4. THE PDF_Tool SHALL allow the user to set page size (A4, Letter, etc.) and orientation
5. WHEN conversion is complete, THE PDF_Tool SHALL generate a downloadable PDF file

### Requirement 7: PDF 合并工具

**User Story:** As a user, I want to merge multiple PDF files into one, so that I can combine related documents.

#### Acceptance Criteria

1. WHEN a user uploads multiple PDF files, THE PDF_Tool SHALL list all uploaded files with page counts
2. THE PDF_Tool SHALL allow the user to reorder files by drag and drop
3. THE PDF_Tool SHALL allow the user to select specific page ranges from each file
4. WHEN merging is complete, THE PDF_Tool SHALL generate a downloadable merged PDF file
5. THE PDF_Tool SHALL preserve bookmarks and links from original files when possible

### Requirement 8: PDF 拆分工具

**User Story:** As a user, I want to split a PDF file into multiple files, so that I can extract specific sections.

#### Acceptance Criteria

1. WHEN a user uploads a PDF file, THE PDF_Tool SHALL display thumbnails of all pages
2. THE PDF_Tool SHALL allow the user to select pages to extract
3. THE PDF_Tool SHALL support splitting by page ranges (e.g., 1-5, 10-15)
4. THE PDF_Tool SHALL support splitting into individual pages
5. WHEN splitting is complete, THE PDF_Tool SHALL provide downloads for each resulting PDF file

### Requirement 9: PDF 压缩工具

**User Story:** As a user, I want to compress PDF files, so that I can reduce file size for sharing or storage.

#### Acceptance Criteria

1. WHEN a user uploads a PDF file, THE PDF_Tool SHALL display the original file size
2. THE PDF_Tool SHALL provide compression level options (low, medium, high)
3. WHEN compression is complete, THE PDF_Tool SHALL display the new file size and compression ratio
4. THE PDF_Tool SHALL preserve text quality while compressing images
5. WHEN compression is complete, THE PDF_Tool SHALL provide a downloadable compressed PDF file

### Requirement 10: PDF 页面旋转工具

**User Story:** As a user, I want to rotate pages in a PDF file, so that I can correct page orientation.

#### Acceptance Criteria

1. WHEN a user uploads a PDF file, THE PDF_Tool SHALL display thumbnails of all pages
2. THE PDF_Tool SHALL allow the user to select pages to rotate
3. THE PDF_Tool SHALL support rotation angles of 90°, 180°, and 270°
4. THE PDF_Tool SHALL allow rotating all pages at once or individual pages
5. WHEN rotation is complete, THE PDF_Tool SHALL generate a downloadable PDF file with rotated pages
