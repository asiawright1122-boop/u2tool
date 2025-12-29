# Implementation Plan: Comprehensive i18n Translation

## Overview

本实现计划将全面国际化翻译工作分解为可执行的任务。任务按优先级和依赖关系排序，确保增量交付和持续验证。

## Tasks

- [x] 1. 创建翻译验证基础设施
  - [x] 1.1 创建翻译验证脚本 (scripts/validate-translations.ts)
    - 实现读取所有语言文件的功能
    - 实现键完整性检查（以en.json为基准）
    - 实现空值检查
    - 输出详细的验证报告
    - _Requirements: 10.4_
  - [x] 1.2 编写翻译键完整性属性测试
    - **Property 1: Translation Key Completeness**
    - **Validates: Requirements 1.2, 2.1, 2.2, 3.1-3.4, 4.1-4.2, 5.1-5.2, 6.1-6.2, 7.1-7.2, 8.1-8.3, 9.3, 10.4**
    - ✅ 已在 src/messages/translations.test.ts 中实现，已更新支持全部10种语言
  - [x] 1.3 编写非空翻译值属性测试
    - **Property 2: Non-Empty Translation Values**
    - **Validates: Requirements 1.1, 4.3, 6.3, 6.4**
    - ✅ 已在 src/messages/translations.test.ts 中实现

- [x] 2. 翻译站点基础信息和导航 (P0)
  - [ ] 2.1 翻译 site.* 键到所有9种非英语语言
    - site.name, site.tagline, site.description
    - _Requirements: 1.1, 1.2, 1.3_
    - ⚠️ 需要运行翻译脚本: `python scripts/translate-missing.py --lang all`
  - [ ] 2.2 翻译 nav.* 键到所有9种非英语语言
    - home, tools, about, viewAllTools, searchPlaceholder, noResults, relatedTools
    - _Requirements: 2.1, 2.3_
  - [ ] 2.3 翻译 categories.* 键到所有9种非英语语言
    - text, encoding, generators, converters, development, security, network, image, math, charts
    - _Requirements: 2.2_

- [ ] 3. 翻译首页内容 (P0)
  - [ ] 3.1 翻译 home.hero.* 键到所有9种非英语语言
    - title, subtitle, cta, tryNow, tryTool, badge
    - _Requirements: 3.1_
  - [ ] 3.2 翻译 home.features.* 键到所有9种非英语语言
    - title, subtitle, fast.*, secure.*, i18n.*
    - _Requirements: 3.2_
  - [ ] 3.3 翻译 home.stats.* 和 home.cta.* 键到所有9种非英语语言
    - stats: tools, upload, free
    - cta: title, desc
    - _Requirements: 3.3, 3.4_

- [ ] 4. 翻译通用工具UI字符串 (P0)
  - [ ] 4.1 翻译 tools.* 通用键到所有9种非英语语言
    - input, output, copy, clear, add, generate, convert, format, copied, paste, minify, beautify, encode, decode, download, result, matches, match, length, count, all, new, error, errorEncoding, errorDecoding, errorInvalidInput, errorInvalidJson, errorInvalidBase64, errorInvalidFormat, errorProcessing, invalidCronExpression, inputPlaceholder, outputPlaceholder, searchPlaceholder
    - _Requirements: 6.1_
  - [ ] 4.2 翻译 tools.regex.* 键到所有9种非英语语言
    - pattern, testString, flags, global, caseInsensitive, multiline, dotall, atIndex
    - _Requirements: 6.2_
  - [ ] 4.3 翻译 tools.password.* 键到所有9种非英语语言
    - uppercase, lowercase, numbers, symbols, newPassword
    - _Requirements: 6.2_

- [ ] 5. Checkpoint - 验证P0翻译完成
  - 运行翻译验证脚本
  - 确保所有P0翻译键在所有语言中存在
  - 确保所有测试通过，如有问题请询问用户

- [ ] 6. 翻译工具名称和描述 - 批次1 (工具1-50)
  - [ ] 6.1 翻译前50个工具的 name 和 description 到所有9种非英语语言
    - json-formatter, base64, url-encoder, html-encoder, jwt-decoder, xml-formatter, unicode-converter, uuid-generator, password-generator, hash-generator, qr-generator, lorem-ipsum, cron-generator, gradient-generator, word-counter, case-converter, markdown-preview, diff-checker, text-to-slug, chinese-converter, pinyin-converter, color-converter, timestamp-converter, json-to-csv, image-to-base64, number-base-converter, unit-converter, regex-tester, json-path-tester, code-minifier, sql-formatter, color-picker, aspect-ratio, css-beautifier, js-beautifier, html-preview, ip-lookup, morse-code, random-generator, text-reverser, line-counter, string-escape, yaml-json, date-calculator, text-deduplicator, color-blender, json-sorter, placeholder-image, text-encryption, file-hash
    - _Requirements: 4.1, 4.2_

- [ ] 7. 翻译工具名称和描述 - 批次2 (工具51-100)
  - [ ] 7.1 翻译工具51-100的 name 和 description 到所有9种非英语语言
    - html-table-generator, json-schema-validator, regex-patterns, byte-counter, json-to-typescript, svg-optimizer, text-to-binary, markdown-to-html, html-minifier, json-diff, base32, epoch-converter, css-unit-converter, text-statistics, hex-editor, color-palette, http-status, json-to-yaml, data-uri, text-compare, json-to-go, html-to-jsx, chmod-calculator, barcode-generator, text-to-speech, url-parser, json-to-xml, text-wrapper, csv-to-json, html-entity, number-formatter, hmac-generator, password-strength, totp-generator, user-agent-parser, cidr-calculator, http-header-parser, percentage-calculator, statistics-calculator, scientific-calculator, text-sorter, text-extractor, emoji-picker, json-to-sql, toml-json, json-to-java, json-to-python, json-to-kotlin, image-compressor, image-converter
    - _Requirements: 4.1, 4.2_

- [ ] 8. 翻译工具名称和描述 - 批次3 (工具101-150)
  - [ ] 8.1 翻译工具101-150的 name 和 description 到所有9种非英语语言
    - favicon-generator, image-cropper, gitignore-generator, docker-compose-generator, package-json-generator, json-minifier, timezone-converter, color-contrast-checker, markdown-table-generator, base58, meta-tag-generator, robots-txt-generator, opengraph-preview, css-grid-generator, css-flexbox-generator, jwt-generator, cron-explainer, json-to-graphql, sql-to-mongo, json-to-csharp, json-to-rust, json-to-swift, css-minifier, js-minifier, box-shadow-generator, border-radius-generator, text-to-ascii-art, color-shades-generator, json-flattener, base85, html-to-markdown, regex-generator, url-shortener-preview, json-viewer, xml-to-json, ip-address-generator, css-gradient-text, sitemap-generator, json-to-php, css-filter-generator, text-diff-patch, encoding-detector, css-clip-path-generator, uuid-validator, text-hash-comparator, json-path-finder, canvas-drawing, json-escape, css-animation-generator, text-case-counter
    - _Requirements: 4.1, 4.2_

- [ ] 9. 翻译工具名称和描述 - 批次4 (工具151-200+)
  - [ ] 9.1 翻译剩余工具的 name 和 description 到所有9种非英语语言
    - dns-lookup, image-resizer, ssl-checker, whois-lookup, port-reference, privacy-policy-generator, terms-generator, cookie-policy-generator, json-to-tsv, csv-viewer, htaccess-generator, nginx-config-generator, curl-converter, reading-time-calculator, open-graph-generator, twitter-card-generator, mime-type-lookup, http-status-codes, string-obfuscator, text-cleaner, list-randomizer, sql-generator, htaccess-to-nginx, js-obfuscator, image-watermark, svg-to-image, hex-base64-converter, pdf-to-base64, audio-to-base64, video-to-base64, file-size-calculator, ascii-table, text-to-hex, css-variables-generator, lorem-picsum, regex-escape, html-to-text, binary-to-decimal, octal-converter, text-to-nato, crc32-calculator, mac-address-generator, ip-validator, json-merger, text-template, base-calculator, color-name-finder, char-frequency, json-to-dart, sql-to-json, 以及所有图表工具
    - _Requirements: 4.1, 4.2_

- [ ] 10. Checkpoint - 验证工具名称和描述翻译
  - 运行翻译验证脚本
  - 确保所有工具的 name 和 description 在所有语言中存在
  - 确保所有测试通过，如有问题请询问用户

- [ ] 11. 翻译工具SEO元数据 - 批次1 (工具1-50)
  - [ ] 11.1 翻译前50个工具的 seo_title 和 seo_description 到所有9种非英语语言
    - 确保 seo_title ≤ 60字符
    - 确保 seo_description 在 100-200字符之间
    - _Requirements: 5.1, 5.2, 5.4_
  - [ ] 11.2 编写SEO长度约束属性测试
    - **Property 3: SEO Title Length Constraint**
    - **Property 4: SEO Description Length Constraint**
    - **Validates: Requirements 5.4**

- [ ] 12. 翻译工具SEO元数据 - 批次2 (工具51-100)
  - [ ] 12.1 翻译工具51-100的 seo_title 和 seo_description 到所有9种非英语语言
    - _Requirements: 5.1, 5.2, 5.4_

- [ ] 13. 翻译工具SEO元数据 - 批次3 (工具101-150)
  - [ ] 13.1 翻译工具101-150的 seo_title 和 seo_description 到所有9种非英语语言
    - _Requirements: 5.1, 5.2, 5.4_

- [ ] 14. 翻译工具SEO元数据 - 批次4 (工具151-200+)
  - [ ] 14.1 翻译剩余工具的 seo_title 和 seo_description 到所有9种非英语语言
    - _Requirements: 5.1, 5.2, 5.4_

- [ ] 15. Checkpoint - 验证SEO元数据翻译
  - 运行翻译验证脚本
  - 运行SEO长度约束测试
  - 确保所有测试通过，如有问题请询问用户

- [ ] 16. 翻译工具特定UI字符串 - 批次1
  - [ ] 16.1 翻译 tools.base64.*, tools.json.*, tools.hash.*, tools.qr.*, tools.color.*, tools.timestamp.*, tools.wordCounter.*, tools.case.*, tools.html.*, tools.markdown.*, tools.lorem.*, tools.url.*, tools.xml.*, tools.chinese.*, tools.unit.*, tools.gradient.* 到所有9种非英语语言
    - _Requirements: 6.2_

- [ ] 17. 翻译工具特定UI字符串 - 批次2
  - [ ] 17.1 翻译 tools.diffChecker.*, tools.colorContrast.*, tools.unicode.*, tools.minifier.*, tools.sql.*, tools.pinyin.*, tools.colorPicker.*, tools.aspect.*, tools.cssBeautifier.*, tools.jsBeautifier.*, tools.htmlPreview.*, tools.ipLookup.*, tools.morseCode.*, tools.random.*, tools.textReverser.*, tools.lineCounter.*, tools.stringEscape.*, tools.yamlJson.*, tools.dateCalc.*, tools.dedup.*, tools.colorBlend.*, tools.jsonSort.* 到所有9种非英语语言
    - _Requirements: 6.2_

- [ ] 18. 翻译工具特定UI字符串 - 批次3
  - [ ] 18.1 翻译 tools.placeholder.*, tools.encryption.*, tools.fileHash.*, tools.tableGen.*, tools.schemaValidator.*, tools.regexPatterns.*, tools.byteCounter.*, tools.jsonTs.*, tools.svgOptimizer.*, tools.textBinary.*, tools.mdToHtml.*, tools.epoch.*, tools.cssUnit.*, tools.textStats.*, tools.hexEditor.*, tools.palette.*, tools.httpStatus.*, tools.dataUri.*, tools.textCompare.*, tools.jsonGo.*, tools.chmod.*, tools.barcode.*, tools.tts.*, tools.urlParser.*, tools.textWrapper.*, tools.csvJson.*, tools.csvViewer.*, tools.csvToJson.*, tools.htmlEntity.*, tools.numberFormat.* 到所有9种非英语语言
    - _Requirements: 6.2_

- [ ] 19. 翻译工具特定UI字符串 - 批次4
  - [ ] 19.1 翻译 tools.hmac.*, tools.jwt.*, tools.metaTagGenerator.*, tools.openGraphGenerator.*, tools.twitterCardGenerator.*, tools.sqlGenerator.*, tools.termsGenerator.*, tools.cssFlexboxGenerator.*, tools.privacyPolicyGenerator.*, tools.openGraphPreview.*, tools.pwStrength.*, tools.totp.*, tools.uaParser.*, tools.cidr.* 以及其他剩余工具特定UI字符串到所有9种非英语语言
    - _Requirements: 6.2_

- [ ] 20. Checkpoint - 验证工具UI字符串翻译
  - 运行翻译验证脚本
  - 确保所有工具特定UI字符串在所有语言中存在
  - 确保所有测试通过，如有问题请询问用户

- [ ] 21. 翻译页脚和法律页面
  - [ ] 21.1 翻译 footer.* 键到所有9种非英语语言
    - copyright, privacy, terms, contact 等
    - _Requirements: 8.1_
  - [ ] 21.2 翻译 privacy.* 键到所有9种非英语语言
    - 隐私政策页面内容
    - _Requirements: 8.2_
  - [ ] 21.3 翻译 terms.* 键到所有9种非英语语言
    - 服务条款页面内容
    - _Requirements: 8.3_

- [ ] 22. 翻译错误页面和加载状态
  - [ ] 22.1 翻译 errors.* 键到所有9种非英语语言
    - 404错误、通用错误消息
    - _Requirements: 9.1, 9.3_
  - [ ] 22.2 翻译 loading.* 键到所有9种非英语语言
    - 加载提示文本
    - _Requirements: 9.2, 9.3_

- [ ] 23. 编写工具翻译完整性属性测试
  - [ ] 23.1 编写工具翻译完整性属性测试
    - **Property 5: Tool Translation Completeness**
    - **Validates: Requirements 4.1, 4.2, 5.1, 5.2**

- [ ] 24. Final Checkpoint - 全面验证
  - 运行所有翻译验证脚本
  - 运行所有属性测试
  - 验证所有页面在各语言下正确渲染
  - 确保所有测试通过，如有问题请询问用户

## Notes

- 所有任务都是必需的，包括属性测试任务
- 每个任务都引用了具体的需求以确保可追溯性
- Checkpoint任务确保增量验证
- 属性测试验证通用正确性属性
- 单元测试验证具体示例和边缘情况
- 翻译工作量巨大（约200个工具 × 10种语言 × 4个字段 = 8000+翻译条目），建议使用翻译API或专业翻译服务辅助

## 当前翻译状态 (2024-12-28 验证)

验证脚本运行结果显示：
- 总翻译键数：5,876
- 工具数量：226

**翻译完成率（实际翻译 vs 英文副本）：**
| 语言 | 已翻译 | 未翻译 | 完成率 |
|------|--------|--------|--------|
| zh   | 100    | 5,775  | 1.7%   |
| es   | 100    | 5,775  | 1.7%   |
| pt   | 1,035  | 4,840  | 17.6%  |
| ja   | 1,042  | 4,833  | 17.7%  |
| ru   | 1,042  | 4,833  | 17.7%  |
| fr   | 1,012  | 4,863  | 17.2%  |
| ar   | 1,042  | 4,833  | 17.7%  |
| de   | 1,013  | 4,862  | 17.2%  |
| ko   | 1,042  | 4,833  | 17.7%  |

**结论：** 翻译键结构完整，但大部分值仍为英文副本，需要实际翻译工作。建议使用翻译API（如Google Translate API、DeepL API）或专业翻译服务来完成大规模翻译。
