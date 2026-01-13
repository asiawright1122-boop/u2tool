/**
 * GEO 优化工具 FAQ - 第 50 批
 * 办公工具和计算器
 */

import type { ToolSpecificFAQ } from './tool-specific-faqs';

export const GEO_TOOL_FAQS_50: ToolSpecificFAQ[] = [
  {
    slug: 'note-pad',
    faqs: {
      en: [
        {
          question: 'What is an online notepad?',
          answer: 'An online notepad is a simple text editor in your browser for quick notes, drafts, and temporary text storage. No account needed - just start typing. Your notes can be saved locally or downloaded.',
        },
        {
          question: 'Are my notes saved automatically?',
          answer: 'Yes, notes are auto-saved to your browser\'s local storage as you type. They persist even if you close the browser. You can also manually save as a text file.',
        },
        {
          question: 'Can I access my notes from another device?',
          answer: 'Notes saved in local storage are device-specific. To access from another device, download your notes as a file or copy the text. We don\'t store notes on servers for privacy.',
        },
      ],
      zh: [
        {
          question: '什么是在线记事本？',
          answer: '在线记事本是浏览器中的简单文本编辑器，用于快速笔记、草稿和临时文本存储。无需账户 - 直接开始输入。您的笔记可以本地保存或下载。',
        },
        {
          question: '我的笔记会自动保存吗？',
          answer: '是的，笔记在您输入时会自动保存到浏览器的本地存储。即使关闭浏览器也会保留。您也可以手动保存为文本文件。',
        },
        {
          question: '可以从另一台设备访问我的笔记吗？',
          answer: '保存在本地存储中的笔记是特定于设备的。要从另一台设备访问，请将笔记下载为文件或复制文本。为了隐私，我们不在服务器上存储笔记。',
        },
      ],
    },
  },
  {
    slug: 'pdf-to-text',
    faqs: {
      en: [
        {
          question: 'How do I extract text from a PDF?',
          answer: 'Upload your PDF and the tool extracts all text content. Works with text-based PDFs (not scanned images). Download as plain text or copy to clipboard.',
        },
        {
          question: 'Can I extract text from scanned PDFs?',
          answer: 'This tool works best with text-based PDFs. For scanned documents (images), you\'ll need OCR (Optical Character Recognition) which we offer in a separate tool.',
        },
        {
          question: 'Will the text formatting be preserved?',
          answer: 'Basic structure like paragraphs and line breaks are preserved. Complex formatting (columns, tables) may need manual adjustment as plain text doesn\'t support rich formatting.',
        },
      ],
      zh: [
        {
          question: '如何从 PDF 中提取文本？',
          answer: '上传 PDF，工具会提取所有文本内容。适用于基于文本的 PDF（非扫描图像）。下载为纯文本或复制到剪贴板。',
        },
        {
          question: '可以从扫描的 PDF 中提取文本吗？',
          answer: '此工具最适合基于文本的 PDF。对于扫描文档（图像），您需要 OCR（光学字符识别），我们在单独的工具中提供。',
        },
        {
          question: '文本格式会保留吗？',
          answer: '段落和换行等基本结构会保留。复杂格式（列、表格）可能需要手动调整，因为纯文本不支持富格式。',
        },
      ],
    },
  },
  {
    slug: 'word-to-txt',
    faqs: {
      en: [
        {
          question: 'How do I convert Word to plain text?',
          answer: 'Upload your Word document (.docx, .doc) and the tool extracts all text content, removing formatting. Download as a .txt file or copy the text directly.',
        },
        {
          question: 'What formatting is removed in the conversion?',
          answer: 'All formatting is removed: fonts, colors, bold/italic, images, tables, and headers/footers. Only the raw text content remains, making it universal and lightweight.',
        },
        {
          question: 'Can I convert multiple Word files at once?',
          answer: 'Yes, upload multiple files for batch conversion. Each file is converted separately, and you can download all results as a ZIP file.',
        },
      ],
      zh: [
        {
          question: '如何将 Word 转换为纯文本？',
          answer: '上传 Word 文档（.docx、.doc），工具会提取所有文本内容，删除格式。下载为 .txt 文件或直接复制文本。',
        },
        {
          question: '转换中会删除哪些格式？',
          answer: '所有格式都会删除：字体、颜色、粗体/斜体、图像、表格和页眉/页脚。只保留原始文本内容，使其通用且轻量。',
        },
        {
          question: '可以一次转换多个 Word 文件吗？',
          answer: '是的，上传多个文件进行批量转换。每个文件单独转换，您可以将所有结果下载为 ZIP 文件。',
        },
      ],
    },
  },
  {
    slug: 'word-to-html',
    faqs: {
      en: [
        {
          question: 'How do I convert Word to HTML?',
          answer: 'Upload your Word document and the tool converts it to clean HTML code. Formatting like headings, bold, italic, lists, and tables are preserved as HTML elements.',
        },
        {
          question: 'Is the generated HTML clean and semantic?',
          answer: 'Yes, we generate clean, semantic HTML without unnecessary inline styles. Headings use proper H1-H6 tags, lists use UL/OL, and paragraphs use P tags.',
        },
        {
          question: 'Can I customize the HTML output?',
          answer: 'Yes, choose to include or exclude images, preserve or simplify formatting, and select whether to generate a complete HTML document or just the body content.',
        },
      ],
      zh: [
        {
          question: '如何将 Word 转换为 HTML？',
          answer: '上传 Word 文档，工具会将其转换为干净的 HTML 代码。标题、粗体、斜体、列表和表格等格式会保留为 HTML 元素。',
        },
        {
          question: '生成的 HTML 干净且语义化吗？',
          answer: '是的，我们生成干净、语义化的 HTML，没有不必要的内联样式。标题使用正确的 H1-H6 标签，列表使用 UL/OL，段落使用 P 标签。',
        },
        {
          question: '可以自定义 HTML 输出吗？',
          answer: '是的，选择是否包含图像、保留或简化格式，以及选择生成完整的 HTML 文档还是仅生成正文内容。',
        },
      ],
    },
  },
  {
    slug: 'excel-to-csv',
    faqs: {
      en: [
        {
          question: 'How do I convert Excel to CSV?',
          answer: 'Upload your Excel file and select the sheet to convert. The tool exports it as a CSV file with comma-separated values. Choose delimiter (comma, semicolon, tab) and encoding.',
        },
        {
          question: 'What happens to Excel formulas in CSV?',
          answer: 'Formulas are converted to their calculated values. CSV is a plain text format that doesn\'t support formulas, so only the results are preserved.',
        },
        {
          question: 'Can I convert multiple sheets to CSV?',
          answer: 'Yes, select multiple sheets and each will be converted to a separate CSV file. Download them individually or as a ZIP archive.',
        },
      ],
      zh: [
        {
          question: '如何将 Excel 转换为 CSV？',
          answer: '上传 Excel 文件并选择要转换的工作表。工具将其导出为逗号分隔值的 CSV 文件。选择分隔符（逗号、分号、制表符）和编码。',
        },
        {
          question: 'CSV 中 Excel 公式会怎样？',
          answer: '公式会转换为其计算值。CSV 是不支持公式的纯文本格式，因此只保留结果。',
        },
        {
          question: '可以将多个工作表转换为 CSV 吗？',
          answer: '是的，选择多个工作表，每个都将转换为单独的 CSV 文件。单独下载或作为 ZIP 存档下载。',
        },
      ],
    },
  },
  {
    slug: 'csv-to-excel',
    faqs: {
      en: [
        {
          question: 'How do I convert CSV to Excel?',
          answer: 'Upload your CSV file and the tool converts it to an Excel spreadsheet (.xlsx). Column data types are auto-detected, and you can adjust formatting before downloading.',
        },
        {
          question: 'How are CSV delimiters handled?',
          answer: 'The tool auto-detects common delimiters (comma, semicolon, tab). If detection fails, you can manually specify the delimiter used in your CSV file.',
        },
        {
          question: 'Can I merge multiple CSV files into one Excel?',
          answer: 'Yes, upload multiple CSV files and choose to combine them into separate sheets in one workbook or merge rows into a single sheet.',
        },
      ],
      zh: [
        {
          question: '如何将 CSV 转换为 Excel？',
          answer: '上传 CSV 文件，工具会将其转换为 Excel 电子表格（.xlsx）。列数据类型会自动检测，您可以在下载前调整格式。',
        },
        {
          question: 'CSV 分隔符如何处理？',
          answer: '工具会自动检测常见分隔符（逗号、分号、制表符）。如果检测失败，您可以手动指定 CSV 文件中使用的分隔符。',
        },
        {
          question: '可以将多个 CSV 文件合并到一个 Excel 中吗？',
          answer: '是的，上传多个 CSV 文件，选择将它们合并到一个工作簿的不同工作表中，或将行合并到单个工作表中。',
        },
      ],
    },
  },
  {
    slug: 'loan-calculator',
    faqs: {
      en: [
        {
          question: 'How do I calculate my loan payment?',
          answer: 'Enter the loan amount, interest rate, and loan term. The calculator shows your monthly payment, total interest, and total amount paid. View an amortization schedule for payment breakdown.',
        },
        {
          question: 'What types of loans can I calculate?',
          answer: 'Calculate any fixed-rate loan: mortgages, car loans, personal loans, student loans. The calculator uses standard amortization formulas applicable to most loan types.',
        },
        {
          question: 'Can I see how extra payments affect my loan?',
          answer: 'Yes, add extra monthly or one-time payments to see how they reduce total interest and shorten the loan term. Compare scenarios side by side.',
        },
      ],
      zh: [
        {
          question: '如何计算我的贷款还款额？',
          answer: '输入贷款金额、利率和贷款期限。计算器显示您的月还款额、总利息和总还款额。查看还款计划以了解还款明细。',
        },
        {
          question: '可以计算哪些类型的贷款？',
          answer: '计算任何固定利率贷款：抵押贷款、汽车贷款、个人贷款、学生贷款。计算器使用适用于大多数贷款类型的标准摊销公式。',
        },
        {
          question: '可以看到额外还款如何影响贷款吗？',
          answer: '是的，添加额外的月度或一次性还款，查看它们如何减少总利息并缩短贷款期限。并排比较不同方案。',
        },
      ],
    },
  },
  {
    slug: 'binary-calculator',
    faqs: {
      en: [
        {
          question: 'How do I perform binary calculations?',
          answer: 'Enter binary numbers (0s and 1s) and select an operation: addition, subtraction, multiplication, division, AND, OR, XOR, NOT. Results are shown in binary and decimal.',
        },
        {
          question: 'What binary operations are supported?',
          answer: 'Arithmetic operations (add, subtract, multiply, divide) and bitwise operations (AND, OR, XOR, NOT, left shift, right shift). Perfect for programming and digital logic.',
        },
        {
          question: 'Can I convert between binary and other number systems?',
          answer: 'Yes, the calculator shows results in binary, decimal, octal, and hexadecimal. You can also input numbers in any of these formats.',
        },
      ],
      zh: [
        {
          question: '如何进行二进制计算？',
          answer: '输入二进制数（0 和 1）并选择运算：加法、减法、乘法、除法、AND、OR、XOR、NOT。结果以二进制和十进制显示。',
        },
        {
          question: '支持哪些二进制运算？',
          answer: '算术运算（加、减、乘、除）和位运算（AND、OR、XOR、NOT、左移、右移）。非常适合编程和数字逻辑。',
        },
        {
          question: '可以在二进制和其他数制之间转换吗？',
          answer: '是的，计算器以二进制、十进制、八进制和十六进制显示结果。您也可以用这些格式中的任何一种输入数字。',
        },
      ],
    },
  },
  {
    slug: 'hex-calculator',
    faqs: {
      en: [
        {
          question: 'How do I calculate with hexadecimal numbers?',
          answer: 'Enter hexadecimal numbers (0-9, A-F) and select an operation. The calculator performs arithmetic and bitwise operations, showing results in hex, decimal, and binary.',
        },
        {
          question: 'What is hexadecimal used for?',
          answer: 'Hexadecimal is widely used in programming for memory addresses, color codes (#FF0000), MAC addresses, and representing binary data compactly. Each hex digit represents 4 binary bits.',
        },
        {
          question: 'Can I convert hex colors to RGB?',
          answer: 'Yes, enter a hex color code and the calculator converts it to RGB values. This is useful for web development and design work.',
        },
      ],
      zh: [
        {
          question: '如何用十六进制数进行计算？',
          answer: '输入十六进制数（0-9、A-F）并选择运算。计算器执行算术和位运算，以十六进制、十进制和二进制显示结果。',
        },
        {
          question: '十六进制用于什么？',
          answer: '十六进制广泛用于编程中的内存地址、颜色代码（#FF0000）、MAC 地址和紧凑表示二进制数据。每个十六进制数字代表 4 个二进制位。',
        },
        {
          question: '可以将十六进制颜色转换为 RGB 吗？',
          answer: '是的，输入十六进制颜色代码，计算器会将其转换为 RGB 值。这对于网页开发和设计工作很有用。',
        },
      ],
    },
  },
  {
    slug: 'ip-subnet-calculator',
    faqs: {
      en: [
        {
          question: 'What is an IP subnet calculator?',
          answer: 'An IP subnet calculator helps you divide networks into smaller subnets. Enter an IP address and subnet mask to see network address, broadcast address, usable host range, and number of hosts.',
        },
        {
          question: 'How do I calculate subnets from CIDR notation?',
          answer: 'Enter the IP address with CIDR notation (e.g., 192.168.1.0/24). The calculator shows the subnet mask, network details, and can divide it into smaller subnets.',
        },
        {
          question: 'Can I plan subnets for multiple networks?',
          answer: 'Yes, specify how many subnets you need or hosts per subnet. The calculator suggests optimal subnet sizes and shows the addressing scheme for each subnet.',
        },
      ],
      zh: [
        {
          question: '什么是 IP 子网计算器？',
          answer: 'IP 子网计算器帮助您将网络划分为更小的子网。输入 IP 地址和子网掩码，查看网络地址、广播地址、可用主机范围和主机数量。',
        },
        {
          question: '如何从 CIDR 表示法计算子网？',
          answer: '输入带 CIDR 表示法的 IP 地址（例如 192.168.1.0/24）。计算器显示子网掩码、网络详情，并可将其划分为更小的子网。',
        },
        {
          question: '可以为多个网络规划子网吗？',
          answer: '是的，指定您需要多少子网或每个子网的主机数。计算器会建议最佳子网大小并显示每个子网的寻址方案。',
        },
      ],
    },
  },
];
