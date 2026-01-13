/**
 * GEO 优化的工具 FAQ 配置 - 第二十批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_20: ToolSpecificFAQ[] = [
  // Emoji Picker
  {
    slug: 'emoji-picker',
    faqs: {
      en: [
        { question: 'How do I find and copy emojis?', answer: 'Browse categories or search by name/keyword. Click emoji to copy. Paste anywhere that supports Unicode.' },
        { question: 'What emoji categories are available?', answer: 'Smileys, People, Animals, Food, Travel, Activities, Objects, Symbols, Flags. Search works across all categories.' },
        { question: 'Do emojis work everywhere?', answer: 'Most modern apps support emojis. Appearance varies by platform (Apple, Google, Windows show different designs).' },
      ],
      zh: [
        { question: '如何查找和复制表情符号？', answer: '浏览类别或按名称/关键词搜索。点击表情符号复制。粘贴到任何支持 Unicode 的地方。' },
        { question: '有哪些表情符号类别可用？', answer: '笑脸、人物、动物、食物、旅行、活动、物品、符号、旗帜。搜索适用于所有类别。' },
        { question: '表情符号到处都能用吗？', answer: '大多数现代应用支持表情符号。外观因平台而异（Apple、Google、Windows 显示不同的设计）。' },
      ],
    },
  },

  // Unicode Character Lookup
  {
    slug: 'unicode-lookup',
    faqs: {
      en: [
        { question: 'How do I find a Unicode character?', answer: 'Search by name, code point (U+0041), or paste character to look up. We show all details and related characters.' },
        { question: 'What information is shown?', answer: 'Character name, code point, UTF-8/16 encoding, HTML entity, category, block, and related characters.' },
        { question: 'How do I type special characters?', answer: 'Copy from our tool, use HTML entities (&#x2665;), or keyboard shortcuts. We show all input methods.' },
      ],
      zh: [
        { question: '如何查找 Unicode 字符？', answer: '按名称、码点（U+0041）搜索，或粘贴字符查找。我们显示所有详细信息和相关字符。' },
        { question: '显示哪些信息？', answer: '字符名称、码点、UTF-8/16 编码、HTML 实体、类别、区块和相关字符。' },
        { question: '如何输入特殊字符？', answer: '从我们的工具复制、使用 HTML 实体（&#x2665;）或键盘快捷键。我们显示所有输入方法。' },
      ],
    },
  },

  // ASCII Art Generator
  {
    slug: 'ascii-art-generator',
    faqs: {
      en: [
        { question: 'How do I create ASCII art from text?', answer: 'Enter text, choose font style (banner, block, script, etc.). We generate ASCII art you can copy and paste.' },
        { question: 'How do I convert images to ASCII?', answer: 'Upload image. We convert to ASCII characters based on brightness. Adjust width and character set.' },
        { question: 'What are ASCII art use cases?', answer: 'Code comments, README files, terminal banners, retro designs, text-only environments.' },
      ],
      zh: [
        { question: '如何从文本创建 ASCII 艺术？', answer: '输入文本，选择字体样式（横幅、块、脚本等）。我们生成可复制粘贴的 ASCII 艺术。' },
        { question: '如何将图像转换为 ASCII？', answer: '上传图像。我们根据亮度转换为 ASCII 字符。调整宽度和字符集。' },
        { question: 'ASCII 艺术有哪些用例？', answer: '代码注释、README 文件、终端横幅、复古设计、纯文本环境。' },
      ],
    },
  },

  // Text to Binary
  {
    slug: 'text-to-binary',
    faqs: {
      en: [
        { question: 'How do I convert text to binary?', answer: 'Enter text. Each character converts to 8-bit binary (ASCII). "A" = 01000001. Copy binary output.' },
        { question: 'What encoding is used?', answer: 'ASCII/UTF-8 by default. Each character becomes 8 bits (or more for Unicode). Space-separated for readability.' },
        { question: 'How do I convert binary back to text?', answer: 'Use our Binary to Text tool. Paste binary, we decode to original text. Works with space or no-space format.' },
      ],
      zh: [
        { question: '如何将文本转换为二进制？', answer: '输入文本。每个字符转换为 8 位二进制（ASCII）。"A" = 01000001。复制二进制输出。' },
        { question: '使用什么编码？', answer: '默认 ASCII/UTF-8。每个字符变成 8 位（Unicode 更多）。用空格分隔以提高可读性。' },
        { question: '如何将二进制转换回文本？', answer: '使用我们的二进制转文本工具。粘贴二进制，我们解码为原始文本。适用于有空格或无空格格式。' },
      ],
    },
  },

  // Text to Hex
  {
    slug: 'text-to-hex',
    faqs: {
      en: [
        { question: 'How do I convert text to hexadecimal?', answer: 'Enter text. Each character converts to hex code. "A" = 41, "Hello" = 48 65 6C 6C 6F. Copy hex output.' },
        { question: 'What is hexadecimal used for?', answer: 'Color codes (#FF0000), memory addresses, MAC addresses, encoding binary data in text format.' },
        { question: 'How do I convert hex back to text?', answer: 'Use our Hex to Text tool. Paste hex values, we decode to original text. Supports various formats.' },
      ],
      zh: [
        { question: '如何将文本转换为十六进制？', answer: '输入文本。每个字符转换为十六进制代码。"A" = 41，"Hello" = 48 65 6C 6C 6F。复制十六进制输出。' },
        { question: '十六进制用于什么？', answer: '颜色代码（#FF0000）、内存地址、MAC 地址、以文本格式编码二进制数据。' },
        { question: '如何将十六进制转换回文本？', answer: '使用我们的十六进制转文本工具。粘贴十六进制值，我们解码为原始文本。支持各种格式。' },
      ],
    },
  },

  // URL Shortener
  {
    slug: 'url-shortener',
    faqs: {
      en: [
        { question: 'How do I shorten a URL?', answer: 'Paste long URL, click Shorten. Get a short link that redirects to original. Easy to share and remember.' },
        { question: 'Can I customize the short URL?', answer: 'Yes, create custom aliases (e.g., u2tool.com/my-link). Subject to availability.' },
        { question: 'Can I track link clicks?', answer: 'Yes, view click statistics: total clicks, geographic location, referrers, devices. Great for marketing.' },
      ],
      zh: [
        { question: '如何缩短 URL？', answer: '粘贴长 URL，点击缩短。获得重定向到原始链接的短链接。易于分享和记忆。' },
        { question: '可以自定义短 URL 吗？', answer: '是的，创建自定义别名（例如 u2tool.com/my-link）。取决于可用性。' },
        { question: '可以跟踪链接点击吗？', answer: '是的，查看点击统计：总点击数、地理位置、来源、设备。非常适合营销。' },
      ],
    },
  },

  // QR Code Reader
  {
    slug: 'qr-code-reader',
    faqs: {
      en: [
        { question: 'How do I scan a QR code?', answer: 'Upload QR code image or use camera to scan. We decode and display the content (URL, text, contact, etc.).' },
        { question: 'What QR code types can be read?', answer: 'URLs, text, WiFi credentials, vCards, email, phone numbers, SMS, calendar events, and more.' },
        { question: 'Can I scan from screen?', answer: 'Yes, upload screenshot or image file containing QR code. No camera needed for existing images.' },
      ],
      zh: [
        { question: '如何扫描二维码？', answer: '上传二维码图像或使用相机扫描。我们解码并显示内容（URL、文本、联系人等）。' },
        { question: '可以读取哪些二维码类型？', answer: 'URL、文本、WiFi 凭据、vCard、电子邮件、电话号码、短信、日历事件等。' },
        { question: '可以从屏幕扫描吗？', answer: '是的，上传包含二维码的截图或图像文件。现有图像不需要相机。' },
      ],
    },
  },

  // Barcode Generator
  {
    slug: 'barcode-generator',
    faqs: {
      en: [
        { question: 'How do I create a barcode?', answer: 'Enter data, select barcode type (Code 128, EAN, UPC, etc.), customize size and colors. Download image.' },
        { question: 'What barcode types are available?', answer: 'Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E, ITF, Codabar, and more. Each has specific use cases.' },
        { question: 'Which barcode type should I use?', answer: 'Retail products: EAN/UPC. General purpose: Code 128. Inventory: Code 39. Check industry requirements.' },
      ],
      zh: [
        { question: '如何创建条形码？', answer: '输入数据，选择条形码类型（Code 128、EAN、UPC 等），自定义大小和颜色。下载图像。' },
        { question: '有哪些条形码类型可用？', answer: 'Code 128、Code 39、EAN-13、EAN-8、UPC-A、UPC-E、ITF、Codabar 等。每种都有特定的用例。' },
        { question: '我应该使用哪种条形码类型？', answer: '零售产品：EAN/UPC。通用：Code 128。库存：Code 39。检查行业要求。' },
      ],
    },
  },

  // IP Address Lookup
  {
    slug: 'ip-lookup',
    faqs: {
      en: [
        { question: 'How do I look up an IP address?', answer: 'Enter IP address or leave blank for your own. We show location, ISP, organization, and other details.' },
        { question: 'What information is shown?', answer: 'Country, city, region, ISP, organization, timezone, coordinates. Accuracy varies by IP type.' },
        { question: 'How accurate is IP geolocation?', answer: 'Country: 95-99% accurate. City: 50-80% accurate. VPNs and proxies show VPN server location, not user.' },
      ],
      zh: [
        { question: '如何查找 IP 地址？', answer: '输入 IP 地址或留空查找您自己的。我们显示位置、ISP、组织和其他详细信息。' },
        { question: '显示哪些信息？', answer: '国家、城市、地区、ISP、组织、时区、坐标。准确性因 IP 类型而异。' },
        { question: 'IP 地理定位有多准确？', answer: '国家：95-99% 准确。城市：50-80% 准确。VPN 和代理显示 VPN 服务器位置，而非用户位置。' },
      ],
    },
  },

  // DNS Lookup
  {
    slug: 'dns-lookup',
    faqs: {
      en: [
        { question: 'How do I perform a DNS lookup?', answer: 'Enter domain name, select record type (A, AAAA, MX, TXT, etc.). We query DNS and show results.' },
        { question: 'What DNS record types are available?', answer: 'A (IPv4), AAAA (IPv6), MX (mail), TXT (text), CNAME (alias), NS (nameserver), SOA, PTR, and more.' },
        { question: 'What is DNS used for?', answer: 'Translates domain names to IP addresses. MX records for email routing. TXT for verification and SPF/DKIM.' },
      ],
      zh: [
        { question: '如何执行 DNS 查找？', answer: '输入域名，选择记录类型（A、AAAA、MX、TXT 等）。我们查询 DNS 并显示结果。' },
        { question: '有哪些 DNS 记录类型可用？', answer: 'A（IPv4）、AAAA（IPv6）、MX（邮件）、TXT（文本）、CNAME（别名）、NS（域名服务器）、SOA、PTR 等。' },
        { question: 'DNS 用于什么？', answer: '将域名转换为 IP 地址。MX 记录用于邮件路由。TXT 用于验证和 SPF/DKIM。' },
      ],
    },
  },
];
