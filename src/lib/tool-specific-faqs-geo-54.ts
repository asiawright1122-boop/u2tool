/**
 * GEO 优化工具 FAQ - 第 54 批
 * 开发工具、验证工具和文本工具
 */

import type { ToolSpecificFAQ } from './tool-specific-faqs';

export const GEO_TOOL_FAQS_54: ToolSpecificFAQ[] = [
  {
    slug: 'number-system-converter',
    faqs: {
      en: [
        {
          question: 'What number systems can I convert between?',
          answer: 'Convert between binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16). Also supports custom bases from 2 to 36.',
        },
        {
          question: 'How do I convert a decimal number to binary?',
          answer: 'Enter your decimal number and select binary as the target base. The tool instantly shows the binary representation. Works for integers and can handle large numbers.',
        },
        {
          question: 'Can I convert fractional numbers?',
          answer: 'Yes, the converter handles decimal fractions. Note that some fractions may have repeating patterns in certain bases, which the tool indicates.',
        },
      ],
      zh: [
        {
          question: '可以在哪些数制之间转换？',
          answer: '在二进制（基数 2）、八进制（基数 8）、十进制（基数 10）和十六进制（基数 16）之间转换。还支持 2 到 36 的自定义基数。',
        },
        {
          question: '如何将十进制数转换为二进制？',
          answer: '输入十进制数并选择二进制作为目标基数。工具立即显示二进制表示。适用于整数，可以处理大数。',
        },
        {
          question: '可以转换小数吗？',
          answer: '是的，转换器处理小数。请注意，某些小数在某些基数中可能有重复模式，工具会指出这一点。',
        },
      ],
    },
  },
  {
    slug: 'subnet-calculator-enhanced',
    faqs: {
      en: [
        {
          question: 'What is an enhanced subnet calculator?',
          answer: 'An enhanced subnet calculator provides advanced features like VLSM (Variable Length Subnet Masking), supernetting, and visual subnet mapping. It helps design complex network architectures.',
        },
        {
          question: 'How do I use VLSM for efficient IP allocation?',
          answer: 'Enter your network and specify different subnet sizes needed. The calculator optimally allocates subnets of varying sizes, minimizing wasted IP addresses.',
        },
        {
          question: 'Can I visualize my subnet design?',
          answer: 'Yes, the tool provides a visual map of your subnets showing address ranges, utilization, and relationships. Export the diagram for documentation.',
        },
      ],
      zh: [
        {
          question: '什么是增强型子网计算器？',
          answer: '增强型子网计算器提供高级功能，如 VLSM（可变长度子网掩码）、超网和可视化子网映射。它有助于设计复杂的网络架构。',
        },
        {
          question: '如何使用 VLSM 进行高效的 IP 分配？',
          answer: '输入您的网络并指定所需的不同子网大小。计算器会优化分配不同大小的子网，最大限度地减少浪费的 IP 地址。',
        },
        {
          question: '可以可视化我的子网设计吗？',
          answer: '是的，工具提供子网的可视化地图，显示地址范围、利用率和关系。导出图表用于文档。',
        },
      ],
    },
  },
  {
    slug: 'iban-validator',
    faqs: {
      en: [
        {
          question: 'What is an IBAN validator?',
          answer: 'An IBAN validator checks if an International Bank Account Number is correctly formatted and passes checksum validation. It also identifies the country and bank from the IBAN.',
        },
        {
          question: 'How do I validate an IBAN?',
          answer: 'Enter the IBAN (with or without spaces). The tool validates the format, length for the country, and checksum. It shows the country, bank code, and account number components.',
        },
        {
          question: 'What information can I extract from an IBAN?',
          answer: 'Extract country code, check digits, bank identifier (BIC/SWIFT), branch code, and account number. The tool also shows the bank name when available.',
        },
      ],
      zh: [
        {
          question: '什么是 IBAN 验证器？',
          answer: 'IBAN 验证器检查国际银行账号是否格式正确并通过校验和验证。它还从 IBAN 中识别国家和银行。',
        },
        {
          question: '如何验证 IBAN？',
          answer: '输入 IBAN（带或不带空格）。工具验证格式、国家长度和校验和。它显示国家、银行代码和账号组成部分。',
        },
        {
          question: '可以从 IBAN 中提取哪些信息？',
          answer: '提取国家代码、校验位、银行标识符（BIC/SWIFT）、分行代码和账号。工具还会在可用时显示银行名称。',
        },
      ],
    },
  },
  {
    slug: 'vat-calculator',
    faqs: {
      en: [
        {
          question: 'How do I calculate VAT?',
          answer: 'Enter the amount and VAT rate. The calculator shows VAT amount and total including VAT. You can also calculate backwards from a VAT-inclusive price to find the net amount.',
        },
        {
          question: 'What VAT rates are available?',
          answer: 'Select from standard rates for different countries (EU, UK, etc.) or enter a custom rate. The tool includes common rates like 20%, 19%, 21%, and reduced rates.',
        },
        {
          question: 'Can I calculate VAT for multiple items?',
          answer: 'Yes, add multiple line items with different amounts and rates. The calculator shows individual VAT and totals, useful for invoicing.',
        },
      ],
      zh: [
        {
          question: '如何计算增值税？',
          answer: '输入金额和增值税率。计算器显示增值税金额和含税总额。您也可以从含税价格反向计算以找到净额。',
        },
        {
          question: '有哪些增值税率可用？',
          answer: '从不同国家（欧盟、英国等）的标准税率中选择或输入自定义税率。工具包括常见税率如 20%、19%、21% 和优惠税率。',
        },
        {
          question: '可以为多个项目计算增值税吗？',
          answer: '是的，添加具有不同金额和税率的多个行项目。计算器显示单个增值税和总计，对于开票很有用。',
        },
      ],
    },
  },
  {
    slug: 'carbon-footprint-calculator',
    faqs: {
      en: [
        {
          question: 'How do I calculate my carbon footprint?',
          answer: 'Enter your activities: transportation (car, flights), home energy use, diet, and shopping habits. The calculator estimates your annual CO2 emissions in tons.',
        },
        {
          question: 'What factors affect carbon footprint?',
          answer: 'Major factors include transportation (especially flying), home heating/cooling, electricity source, diet (meat consumption), and consumer goods. The tool breaks down contributions by category.',
        },
        {
          question: 'How can I reduce my carbon footprint?',
          answer: 'The calculator provides personalized tips based on your results. Common reductions include using public transit, reducing flights, switching to renewable energy, and eating less meat.',
        },
      ],
      zh: [
        {
          question: '如何计算我的碳足迹？',
          answer: '输入您的活动：交通（汽车、航班）、家庭能源使用、饮食和购物习惯。计算器估算您的年度二氧化碳排放量（吨）。',
        },
        {
          question: '哪些因素影响碳足迹？',
          answer: '主要因素包括交通（特别是飞行）、家庭供暖/制冷、电力来源、饮食（肉类消费）和消费品。工具按类别分解贡献。',
        },
        {
          question: '如何减少我的碳足迹？',
          answer: '计算器根据您的结果提供个性化建议。常见的减排方法包括使用公共交通、减少飞行、转向可再生能源和少吃肉。',
        },
      ],
    },
  },
  {
    slug: 'gdpr-consent-generator',
    faqs: {
      en: [
        {
          question: 'What is a GDPR consent generator?',
          answer: 'A GDPR consent generator creates compliant consent forms and privacy notices for websites. It helps you collect user consent for cookies, data processing, and marketing communications.',
        },
        {
          question: 'What elements does the consent form include?',
          answer: 'Generated forms include purpose of data collection, types of data collected, data retention period, third-party sharing, user rights, and withdrawal options - all required by GDPR.',
        },
        {
          question: 'Is the generated consent legally compliant?',
          answer: 'The generator follows GDPR guidelines, but you should have a legal professional review it for your specific situation. Laws vary by jurisdiction and business type.',
        },
      ],
      zh: [
        {
          question: '什么是 GDPR 同意书生成器？',
          answer: 'GDPR 同意书生成器为网站创建合规的同意表单和隐私声明。它帮助您收集用户对 cookie、数据处理和营销通信的同意。',
        },
        {
          question: '同意表单包含哪些元素？',
          answer: '生成的表单包括数据收集目的、收集的数据类型、数据保留期限、第三方共享、用户权利和撤回选项 - 这些都是 GDPR 要求的。',
        },
        {
          question: '生成的同意书在法律上合规吗？',
          answer: '生成器遵循 GDPR 指南，但您应该让法律专业人士针对您的具体情况进行审查。法律因司法管辖区和业务类型而异。',
        },
      ],
    },
  },
  {
    slug: 'metric-imperial-converter',
    faqs: {
      en: [
        {
          question: 'What units can I convert?',
          answer: 'Convert between metric and imperial units for length (meters/feet), weight (kg/pounds), volume (liters/gallons), temperature (Celsius/Fahrenheit), and more.',
        },
        {
          question: 'How do I convert meters to feet?',
          answer: 'Enter the value in meters and select feet as the target unit. The converter shows the result instantly. You can also convert in the opposite direction.',
        },
        {
          question: 'Can I convert multiple values at once?',
          answer: 'Yes, enter multiple values separated by commas or line breaks. The tool converts all values and displays results in a table format.',
        },
      ],
      zh: [
        {
          question: '可以转换哪些单位？',
          answer: '在公制和英制单位之间转换长度（米/英尺）、重量（公斤/磅）、体积（升/加仑）、温度（摄氏度/华氏度）等。',
        },
        {
          question: '如何将米转换为英尺？',
          answer: '输入米值并选择英尺作为目标单位。转换器立即显示结果。您也可以反向转换。',
        },
        {
          question: '可以一次转换多个值吗？',
          answer: '是的，输入用逗号或换行符分隔的多个值。工具转换所有值并以表格格式显示结果。',
        },
      ],
    },
  },
  {
    slug: 'bic-swift-lookup',
    faqs: {
      en: [
        {
          question: 'What is a BIC/SWIFT code lookup?',
          answer: 'A BIC/SWIFT lookup tool finds bank information from a BIC (Bank Identifier Code) or SWIFT code. It shows the bank name, branch, city, and country associated with the code.',
        },
        {
          question: 'How do I find a bank\'s SWIFT code?',
          answer: 'Search by bank name and country to find the SWIFT/BIC code. You can also enter a partial code to find matching banks.',
        },
        {
          question: 'What\'s the difference between BIC and SWIFT?',
          answer: 'BIC and SWIFT refer to the same code system. SWIFT is the network that uses these codes, while BIC is the technical term. Both are 8 or 11 characters identifying banks internationally.',
        },
      ],
      zh: [
        {
          question: '什么是 BIC/SWIFT 代码查询？',
          answer: 'BIC/SWIFT 查询工具从 BIC（银行识别码）或 SWIFT 代码中查找银行信息。它显示与代码关联的银行名称、分行、城市和国家。',
        },
        {
          question: '如何找到银行的 SWIFT 代码？',
          answer: '按银行名称和国家搜索以找到 SWIFT/BIC 代码。您也可以输入部分代码来查找匹配的银行。',
        },
        {
          question: 'BIC 和 SWIFT 有什么区别？',
          answer: 'BIC 和 SWIFT 指的是同一个代码系统。SWIFT 是使用这些代码的网络，而 BIC 是技术术语。两者都是 8 或 11 个字符，用于国际识别银行。',
        },
      ],
    },
  },
  {
    slug: 'email-validator',
    faqs: {
      en: [
        {
          question: 'How does email validation work?',
          answer: 'Email validation checks format (syntax), domain existence (DNS), and optionally mailbox existence (SMTP). It identifies typos, fake domains, and potentially invalid addresses.',
        },
        {
          question: 'What types of email issues can be detected?',
          answer: 'Detect syntax errors, invalid domains, disposable email addresses, role-based emails (info@, support@), and potentially non-existent mailboxes.',
        },
        {
          question: 'Can I validate emails in bulk?',
          answer: 'Yes, upload a list of emails or paste multiple addresses. The tool validates each one and provides a report with valid, invalid, and risky addresses.',
        },
      ],
      zh: [
        {
          question: '电子邮件验证如何工作？',
          answer: '电子邮件验证检查格式（语法）、域名存在性（DNS），以及可选的邮箱存在性（SMTP）。它识别拼写错误、假域名和可能无效的地址。',
        },
        {
          question: '可以检测哪些类型的电子邮件问题？',
          answer: '检测语法错误、无效域名、一次性电子邮件地址、基于角色的电子邮件（info@、support@）和可能不存在的邮箱。',
        },
        {
          question: '可以批量验证电子邮件吗？',
          answer: '是的，上传电子邮件列表或粘贴多个地址。工具验证每个地址并提供包含有效、无效和风险地址的报告。',
        },
      ],
    },
  },
  {
    slug: 'phone-formatter',
    faqs: {
      en: [
        {
          question: 'What is a phone number formatter?',
          answer: 'A phone formatter standardizes phone numbers into consistent formats. It can convert to international format (E.164), national format, or custom formats for different countries.',
        },
        {
          question: 'How do I format phone numbers?',
          answer: 'Enter phone numbers in any format. Select the target country and format style. The tool parses and reformats numbers, handling country codes and local conventions.',
        },
        {
          question: 'Can I validate phone numbers?',
          answer: 'Yes, the formatter validates that numbers have the correct length and format for their country. It identifies invalid numbers and suggests corrections.',
        },
      ],
      zh: [
        {
          question: '什么是电话号码格式化器？',
          answer: '电话格式化器将电话号码标准化为一致的格式。它可以转换为国际格式（E.164）、国内格式或不同国家的自定义格式。',
        },
        {
          question: '如何格式化电话号码？',
          answer: '以任何格式输入电话号码。选择目标国家和格式样式。工具解析并重新格式化号码，处理国家代码和本地惯例。',
        },
        {
          question: '可以验证电话号码吗？',
          answer: '是的，格式化器验证号码是否具有其国家的正确长度和格式。它识别无效号码并建议更正。',
        },
      ],
    },
  },
];
