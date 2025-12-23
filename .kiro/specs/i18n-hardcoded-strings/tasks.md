# Implementation Plan

## 1. 设置和准备工作

- [x] 1.1 创建翻译键完整性测试
  - 创建测试文件验证所有语言文件包含相同的键
  - 使用 vitest 框架
  - _Requirements: 1.2, 4.3_

- [x] 1.2 编写属性测试验证翻译键完整性
  - **Property 1: Translation Key Completeness**
  - **Validates: Requirements 1.2**

## 2. 审查和提取硬编码字符串 - 批次1（编码/解码工具）

- [x] 2.1 审查并更新 RegexGenerator.tsx
  - 提取 "Common Patterns", "Custom Pattern", "Test String", "Test Pattern", "Matches" 等
  - 提取各模式的 label 和 description
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 2.2 审查并更新 DnsLookup.tsx
  - 提取 "{type} Records" 模板字符串
  - 提取 DNS 记录类型说明（A, AAAA, CNAME, MX, NS, TXT）
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 2.3 审查并更新 SqlToMongo.tsx
  - 提取示例描述（"Simple SELECT", "SELECT with projection", "INSERT", "UPDATE", "DELETE"）
  - 提取错误消息
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 2.4 审查并更新 CurlToCode.tsx 和 CurlConverter.tsx
  - 提取语言选项标签
  - 提取错误消息
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

## 3. 审查和提取硬编码字符串 - 批次2（JSON工具）

- [x] 3.1 审查并更新 JsonToSwift.tsx, JsonToRust.tsx, JsonToPhp.tsx
  - 提取错误消息 "// Error: Invalid JSON input"
  - 提取选项标签
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 3.2 审查并更新 JsonToGraphql.tsx, JsonToCsharp.tsx
  - 提取选项标签和错误消息
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 3.3 审查并更新 JsonSchemaValidator.tsx
  - 提取类型名称和验证消息
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 3.4 审查并更新 JsonPathFinder.tsx, JsonFlattener.tsx, JsonViewer.tsx
  - 提取类型标签（"null", "array", "object"）
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

## 4. Checkpoint - 确保所有测试通过
- [x] 4. Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## 5. 审查和提取硬编码字符串 - 批次3（CSS/样式工具）

- [x] 5.1 审查并更新 CssClipPathGenerator.tsx
  - 提取预设名称（circle, ellipse, triangle 等）
  - 提取语法参考文本
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 5.2 审查并更新 CssAnimationGenerator.tsx
  - 提取动画预设名称
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 5.3 审查并更新 CssFilterGenerator.tsx, CssGradientText.tsx
  - 提取滤镜名称和选项
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 5.4 审查并更新 BoxShadowGenerator.tsx, BorderRadiusGenerator.tsx
  - 提取选项标签
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

## 6. 审查和提取硬编码字符串 - 批次4（文本工具）

- [x] 6.1 审查并更新 TextDiffPatch.tsx, TextCleaner.tsx
  - 提取操作标签和选项
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 6.2 审查并更新 TextToAsciiArt.tsx, TextToNato.tsx, TextToHex.tsx
  - 提取标签和说明文本
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 6.3 审查并更新 StringObfuscator.tsx, RegexEscape.tsx
  - 提取选项和说明
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

## 7. 审查和提取硬编码字符串 - 批次5（网络工具）

- [x] 7.1 审查并更新 UrlShortenerPreview.tsx
  - 提取 "Note:" 警告文本
  - 提取状态消息
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 7.2 审查并更新 WebSocketTester.tsx, PortScanner.tsx
  - 提取连接状态消息
  - 提取错误消息
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 7.3 审查并更新 SslChecker.tsx, WhoisLookup.tsx
  - 提取字段标签和状态消息
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

## 8. Checkpoint - 确保所有测试通过
- [x] 8. Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## 9. 审查和提取硬编码字符串 - 批次6（图像工具）

- [x] 9.1 审查并更新 ImageWatermark.tsx
  - 提取选项标签
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 9.2 审查并更新 SvgToImage.tsx, LoremPicsum.tsx
  - 提取格式选项和说明
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

## 10. 审查和提取硬编码字符串 - 批次7（生成器工具）

- [x] 10.1 审查并更新 HtaccessGenerator.tsx, HtaccessToNginx.tsx
  - 提取规则类型和说明
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 10.2 审查并更新 NginxConfigGenerator.tsx
  - 提取配置选项标签
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 10.3 审查并更新 CookiePolicyGenerator.tsx
  - 提取表单标签和选项
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

## 11. 审查和提取硬编码字符串 - 批次8（计算器工具）

- [x] 11.1 审查并更新 FileSizeCalculator.tsx, ReadingTimeCalculator.tsx
  - 提取单位标签和说明
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 11.2 审查并更新 Crc32Calculator.tsx
  - 提取标签和说明
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

## 12. 审查和提取硬编码字符串 - 批次9（编码工具）

- [x] 12.1 审查并更新 Base85.tsx, HexBase64Converter.tsx
  - 提取模式标签
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 12.2 审查并更新 EncodingDetector.tsx
  - 提取编码名称和说明
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 12.3 审查并更新 AudioToBase64.tsx, VideoToBase64.tsx, PdfToBase64.tsx
  - 提取文件类型说明
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

## 13. Checkpoint - 确保所有测试通过
- [x] 13. Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## 14. 审查和提取硬编码字符串 - 批次10（其他工具）

- [x] 14.1 审查并更新 AsciiTable.tsx
  - 提取表格标题和说明
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 14.2 审查并更新 MimeTypeLookup.tsx
  - 提取搜索提示和类别名称
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 14.3 审查并更新 HttpStatusCodes.tsx
  - 提取状态码类别名称
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 14.4 审查并更新 ListRandomizer.tsx, MacAddressGenerator.tsx, IpAddressGenerator.tsx
  - 提取选项标签
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 14.5 审查并更新 JsObfuscator.tsx
  - 提取混淆选项标签
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 14.6 审查并更新 ColorShadesGenerator.tsx, CssVariablesGenerator.tsx
  - 提取选项和说明
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 14.7 审查并更新 HtmlToText.tsx, HtmlToMarkdown.tsx
  - 提取选项标签
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 14.8 审查并更新 OctalConverter.tsx, BinaryToDecimal.tsx
  - 提取进制名称
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 14.9 审查并更新 JsonToTsv.tsx, XmlToJson.tsx
  - 提取错误消息和选项
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

- [x] 14.10 审查并更新 TextHashComparator.tsx
  - 提取比较结果消息
  - 添加翻译键到所有语言文件
  - _Requirements: 1.1, 1.2_

## 15. Final Checkpoint - 确保所有测试通过
- [x] 15. Final Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## 16. 验证和清理

- [x] 16.1 运行翻译完整性验证
  - 验证所有语言文件包含相同的键
  - 验证 JSON 格式正确
  - _Requirements: 1.2, 4.3_

- [x] 16.2 编写属性测试验证 JSON 有效性
  - **Property 4: Valid JSON Structure**
  - **Validates: Requirements 4.3**
