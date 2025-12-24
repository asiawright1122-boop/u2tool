/**
 * FAQ 内容系统
 * 为工具页面生成 FAQ 内容和结构化数据
 * 支持多语言、自然语言问题格式、JSON-LD 输出
 */

import { generateFAQJsonLd as generateFAQJsonLdFromSeo, type JsonLdData } from './seo';

// FAQ 项目接口
export interface FAQItem {
  question: string;
  answer: string;
}

// 工具 FAQ 配置接口
export interface ToolFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>; // locale -> FAQs
}

// 问题模式前缀（用于生成自然语言问题）
const QUESTION_PATTERNS = {
  en: {
    howTo: 'How do I',
    whatIs: 'What is',
    why: 'Why should I use',
    can: 'Can I',
    is: 'Is',
  },
  zh: {
    howTo: '如何',
    whatIs: '什么是',
    why: '为什么要使用',
    can: '我可以',
    is: '这个工具是否',
  },
  es: {
    howTo: 'Cómo',
    whatIs: 'Qué es',
    why: 'Por qué debería usar',
    can: 'Puedo',
    is: 'Es',
  },
  pt: {
    howTo: 'Como',
    whatIs: 'O que é',
    why: 'Por que devo usar',
    can: 'Posso',
    is: 'É',
  },
  ja: {
    howTo: 'どのように',
    whatIs: 'とは何ですか',
    why: 'なぜ使うべきですか',
    can: 'できますか',
    is: 'ですか',
  },
} as const;

// 通用 FAQ 模板（按分类）
const GENERIC_FAQ_TEMPLATES: Record<string, Record<string, FAQItem[]>> = {
  formatters: {
    en: [
      {
        question: 'How do I use this formatter tool?',
        answer: 'Simply paste your code or data into the input field, adjust any formatting options if needed, and click the Format button. The formatted result will appear in the output area.',
      },
      {
        question: 'What is the maximum input size supported?',
        answer: 'This tool processes data entirely in your browser, so there is no server-side limit. However, very large files may affect browser performance.',
      },
      {
        question: 'Is my data safe when using this tool?',
        answer: 'Yes, absolutely. All processing happens locally in your browser. Your data never leaves your device and is not sent to any server.',
      },
    ],
    zh: [
      {
        question: '如何使用这个格式化工具？',
        answer: '只需将代码或数据粘贴到输入框中，根据需要调整格式化选项，然后点击格式化按钮。格式化后的结果将显示在输出区域。',
      },
      {
        question: '支持的最大输入大小是多少？',
        answer: '此工具完全在浏览器中处理数据，因此没有服务器端限制。但是，非常大的文件可能会影响浏览器性能。',
      },
      {
        question: '使用此工具时我的数据安全吗？',
        answer: '是的，绝对安全。所有处理都在您的浏览器本地进行。您的数据永远不会离开您的设备，也不会发送到任何服务器。',
      },
    ],
  },
  encoders: {
    en: [
      {
        question: 'How do I encode or decode data with this tool?',
        answer: 'Enter your text in the input field, select encode or decode mode, and click the corresponding button. The result will be displayed instantly.',
      },
      {
        question: 'What character encoding does this tool support?',
        answer: 'This tool supports UTF-8 encoding by default, which covers most international characters and symbols.',
      },
      {
        question: 'Can I use this tool offline?',
        answer: 'Yes, once the page is loaded, you can use this tool without an internet connection as all processing happens in your browser.',
      },
    ],
    zh: [
      {
        question: '如何使用此工具编码或解码数据？',
        answer: '在输入框中输入文本，选择编码或解码模式，然后点击相应的按钮。结果将立即显示。',
      },
      {
        question: '此工具支持什么字符编码？',
        answer: '此工具默认支持 UTF-8 编码，涵盖大多数国际字符和符号。',
      },
      {
        question: '我可以离线使用此工具吗？',
        answer: '是的，页面加载后，您可以在没有互联网连接的情况下使用此工具，因为所有处理都在浏览器中进行。',
      },
    ],
  },
  generators: {
    en: [
      {
        question: 'How do I generate data with this tool?',
        answer: 'Configure your desired options and parameters, then click the Generate button. You can copy the result or generate new data as needed.',
      },
      {
        question: 'Is the generated data unique?',
        answer: 'Yes, each generation produces unique results based on cryptographically secure random algorithms.',
      },
      {
        question: 'Can I customize the output format?',
        answer: 'Yes, most generator tools offer various customization options. Check the settings panel for available options.',
      },
    ],
    zh: [
      {
        question: '如何使用此工具生成数据？',
        answer: '配置所需的选项和参数，然后点击生成按钮。您可以复制结果或根据需要生成新数据。',
      },
      {
        question: '生成的数据是唯一的吗？',
        answer: '是的，每次生成都会基于加密安全的随机算法产生唯一的结果。',
      },
      {
        question: '我可以自定义输出格式吗？',
        answer: '是的，大多数生成器工具提供各种自定义选项。请查看设置面板了解可用选项。',
      },
    ],
  },
  converters: {
    en: [
      {
        question: 'How do I convert data between formats?',
        answer: 'Paste or upload your source data, select the target format if applicable, and click Convert. The converted result will be ready to copy or download.',
      },
      {
        question: 'What happens if my input data is invalid?',
        answer: 'The tool will display an error message indicating what went wrong. Check your input format and try again.',
      },
      {
        question: 'Can I convert large files?',
        answer: 'Yes, but performance depends on your browser and device. For very large files, consider splitting them into smaller chunks.',
      },
    ],
    zh: [
      {
        question: '如何在不同格式之间转换数据？',
        answer: '粘贴或上传源数据，如果适用请选择目标格式，然后点击转换。转换后的结果可以复制或下载。',
      },
      {
        question: '如果输入数据无效会怎样？',
        answer: '工具将显示错误消息，指出问题所在。请检查输入格式并重试。',
      },
      {
        question: '我可以转换大文件吗？',
        answer: '可以，但性能取决于您的浏览器和设备。对于非常大的文件，建议将其分成较小的块。',
      },
    ],
  },
  security: {
    en: [
      {
        question: 'Is this security tool safe to use?',
        answer: 'Yes, all cryptographic operations are performed locally in your browser using standard Web Crypto APIs. No data is transmitted to external servers.',
      },
      {
        question: 'How secure are the generated passwords/keys?',
        answer: 'Generated values use cryptographically secure random number generators, making them suitable for production use.',
      },
      {
        question: 'Can I trust the encryption/hashing results?',
        answer: 'Yes, this tool uses industry-standard algorithms implemented in your browser\'s native crypto library.',
      },
    ],
    zh: [
      {
        question: '使用此安全工具安全吗？',
        answer: '是的，所有加密操作都使用标准 Web Crypto API 在浏览器本地执行。没有数据传输到外部服务器。',
      },
      {
        question: '生成的密码/密钥有多安全？',
        answer: '生成的值使用加密安全的随机数生成器，适合生产环境使用。',
      },
      {
        question: '我可以信任加密/哈希结果吗？',
        answer: '是的，此工具使用浏览器原生加密库中实现的行业标准算法。',
      },
    ],
  },
};

// 默认通用 FAQ（当分类没有特定模板时使用）
const DEFAULT_FAQ_TEMPLATES: Record<string, FAQItem[]> = {
  en: [
    {
      question: 'How do I use this tool?',
      answer: 'Enter your data in the input area, configure any options as needed, and click the action button. Results will appear in the output area.',
    },
    {
      question: 'Is this tool free to use?',
      answer: 'Yes, this tool is completely free with no registration required. You can use it as many times as you need.',
    },
    {
      question: 'Is my data private and secure?',
      answer: 'Absolutely. All processing happens in your browser. Your data never leaves your device and is not stored anywhere.',
    },
  ],
  zh: [
    {
      question: '如何使用此工具？',
      answer: '在输入区域输入数据，根据需要配置选项，然后点击操作按钮。结果将显示在输出区域。',
    },
    {
      question: '此工具免费使用吗？',
      answer: '是的，此工具完全免费，无需注册。您可以根据需要多次使用。',
    },
    {
      question: '我的数据是否私密和安全？',
      answer: '绝对安全。所有处理都在您的浏览器中进行。您的数据永远不会离开您的设备，也不会存储在任何地方。',
    },
  ],
  es: [
    {
      question: '¿Cómo uso esta herramienta?',
      answer: 'Ingrese sus datos en el área de entrada, configure las opciones según sea necesario y haga clic en el botón de acción. Los resultados aparecerán en el área de salida.',
    },
    {
      question: '¿Es gratuita esta herramienta?',
      answer: 'Sí, esta herramienta es completamente gratuita sin necesidad de registro. Puede usarla tantas veces como necesite.',
    },
    {
      question: '¿Mis datos son privados y seguros?',
      answer: 'Absolutamente. Todo el procesamiento ocurre en su navegador. Sus datos nunca salen de su dispositivo.',
    },
  ],
  pt: [
    {
      question: 'Como uso esta ferramenta?',
      answer: 'Insira seus dados na área de entrada, configure as opções conforme necessário e clique no botão de ação. Os resultados aparecerão na área de saída.',
    },
    {
      question: 'Esta ferramenta é gratuita?',
      answer: 'Sim, esta ferramenta é completamente gratuita sem necessidade de registro. Você pode usá-la quantas vezes precisar.',
    },
    {
      question: 'Meus dados são privados e seguros?',
      answer: 'Absolutamente. Todo o processamento acontece no seu navegador. Seus dados nunca saem do seu dispositivo.',
    },
  ],
  ja: [
    {
      question: 'このツールの使い方は？',
      answer: '入力エリアにデータを入力し、必要に応じてオプションを設定し、アクションボタンをクリックします。結果は出力エリアに表示されます。',
    },
    {
      question: 'このツールは無料ですか？',
      answer: 'はい、このツールは登録不要で完全に無料です。必要なだけ何度でも使用できます。',
    },
    {
      question: 'データはプライベートで安全ですか？',
      answer: 'はい、完全に安全です。すべての処理はブラウザ内で行われます。データがデバイスから離れることはありません。',
    },
  ],
};


/**
 * 获取工具的 FAQ 内容
 * @param slug - 工具 slug
 * @param locale - 语言代码
 * @param category - 工具分类
 * @returns FAQ 项目数组
 */
export function getToolFAQs(
  slug: string,
  locale: string,
  category?: string
): FAQItem[] {
  // 首先尝试获取分类特定的 FAQ
  if (category && GENERIC_FAQ_TEMPLATES[category]) {
    const categoryFaqs = GENERIC_FAQ_TEMPLATES[category][locale];
    if (categoryFaqs && categoryFaqs.length >= 3) {
      return categoryFaqs;
    }
    // 回退到英文分类 FAQ
    const enCategoryFaqs = GENERIC_FAQ_TEMPLATES[category]['en'];
    if (enCategoryFaqs && enCategoryFaqs.length >= 3) {
      return enCategoryFaqs;
    }
  }

  // 回退到默认 FAQ
  return DEFAULT_FAQ_TEMPLATES[locale] || DEFAULT_FAQ_TEMPLATES['en'];
}

/**
 * 生成通用工具 FAQ（基于工具名称和分类）
 * @param toolName - 工具名称
 * @param category - 工具分类
 * @param locale - 语言代码
 * @returns FAQ 项目数组
 */
export function generateGenericFAQs(
  toolName: string,
  category: string,
  locale: string
): FAQItem[] {
  const patterns = QUESTION_PATTERNS[locale as keyof typeof QUESTION_PATTERNS] || QUESTION_PATTERNS.en;
  
  // 直接使用传入的 category 作为分类名称
  const categoryName = category;

  const faqs: FAQItem[] = [];

  // 问题 1: How to use（使用自然语言格式）
  if (locale === 'zh') {
    faqs.push({
      question: `${patterns.howTo}使用 ${toolName}？`,
      answer: `使用 ${toolName} 非常简单。只需在输入区域输入或粘贴您的数据，根据需要调整设置，然后点击处理按钮即可获得结果。`,
    });
  } else if (locale === 'ja') {
    faqs.push({
      question: `${toolName} ${patterns.howTo}使いますか？`,
      answer: `${toolName} の使用は簡単です。入力エリアにデータを入力または貼り付け、必要に応じて設定を調整し、処理ボタンをクリックするだけです。`,
    });
  } else if (locale === 'es') {
    faqs.push({
      question: `¿${patterns.howTo} usar ${toolName}?`,
      answer: `Usar ${toolName} es simple. Solo ingrese o pegue sus datos en el área de entrada, ajuste la configuración según sea necesario y haga clic en el botón de proceso.`,
    });
  } else if (locale === 'pt') {
    faqs.push({
      question: `${patterns.howTo} usar ${toolName}?`,
      answer: `Usar ${toolName} é simples. Basta inserir ou colar seus dados na área de entrada, ajustar as configurações conforme necessário e clicar no botão de processo.`,
    });
  } else {
    faqs.push({
      question: `${patterns.howTo} use ${toolName}?`,
      answer: `Using ${toolName} is simple. Just enter or paste your data in the input area, adjust settings as needed, and click the process button to get your result.`,
    });
  }

  // 问题 2: What is（定义问题）
  if (locale === 'zh') {
    faqs.push({
      question: `${patterns.whatIs} ${toolName}？`,
      answer: `${toolName} 是一个免费的在线工具，属于 ${categoryName} 类别。它可以帮助您快速处理数据，无需安装任何软件。`,
    });
  } else if (locale === 'ja') {
    faqs.push({
      question: `${toolName} ${patterns.whatIs}`,
      answer: `${toolName} は ${categoryName} カテゴリの無料オンラインツールです。ソフトウェアをインストールすることなく、データを素早く処理できます。`,
    });
  } else if (locale === 'es') {
    faqs.push({
      question: `¿${patterns.whatIs} ${toolName}?`,
      answer: `${toolName} es una herramienta en línea gratuita en la categoría ${categoryName}. Le ayuda a procesar datos rápidamente sin instalar ningún software.`,
    });
  } else if (locale === 'pt') {
    faqs.push({
      question: `${patterns.whatIs} ${toolName}?`,
      answer: `${toolName} é uma ferramenta online gratuita na categoria ${categoryName}. Ajuda você a processar dados rapidamente sem instalar nenhum software.`,
    });
  } else {
    faqs.push({
      question: `${patterns.whatIs} ${toolName}?`,
      answer: `${toolName} is a free online tool in the ${categoryName} category. It helps you process data quickly without installing any software.`,
    });
  }

  // 问题 3: Why use（价值问题）
  if (locale === 'zh') {
    faqs.push({
      question: `${patterns.why} ${toolName}？`,
      answer: `${toolName} 完全免费、无需注册、数据在本地处理确保隐私安全。它快速、可靠，随时可用。`,
    });
  } else if (locale === 'ja') {
    faqs.push({
      question: `${toolName} を${patterns.why}`,
      answer: `${toolName} は完全無料で、登録不要、データはローカルで処理されるためプライバシーが保護されます。高速で信頼性が高く、いつでも利用可能です。`,
    });
  } else if (locale === 'es') {
    faqs.push({
      question: `¿${patterns.why} ${toolName}?`,
      answer: `${toolName} es completamente gratuito, no requiere registro y los datos se procesan localmente para garantizar la privacidad. Es rápido, confiable y siempre disponible.`,
    });
  } else if (locale === 'pt') {
    faqs.push({
      question: `${patterns.why} ${toolName}?`,
      answer: `${toolName} é completamente gratuito, não requer registro e os dados são processados localmente para garantir privacidade. É rápido, confiável e sempre disponível.`,
    });
  } else {
    faqs.push({
      question: `${patterns.why} ${toolName}?`,
      answer: `${toolName} is completely free, requires no registration, and processes data locally to ensure privacy. It's fast, reliable, and always available.`,
    });
  }

  return faqs;
}

/**
 * 生成 FAQ JSON-LD 结构化数据
 * 使用 seo.ts 中的函数确保类型一致性
 * @param faqs - FAQ 项目数组
 * @returns FAQPage JSON-LD 对象
 */
export function generateFAQJsonLd(faqs: FAQItem[]): JsonLdData {
  return generateFAQJsonLdFromSeo(faqs);
}

/**
 * 将 FAQ JSON-LD 转换为字符串
 * @param jsonLd - JSON-LD 对象
 * @returns JSON 字符串
 */
export function faqJsonLdToString(jsonLd: JsonLdData): string {
  return JSON.stringify(jsonLd);
}

/**
 * 验证问题是否使用自然语言格式
 * @param question - 问题文本
 * @returns 是否为自然语言格式
 */
export function isNaturalLanguageQuestion(question: string): boolean {
  // 检查是否以常见问题词开头
  const naturalPatterns = [
    // 英文
    /^(how|what|why|when|where|who|which|can|is|are|do|does|will|would|should)/i,
    // 中文
    /^(如何|什么|为什么|何时|哪里|谁|哪个|可以|是否|怎么|怎样)/,
    // 西班牙语
    /^(cómo|qué|por qué|cuándo|dónde|quién|cuál|puede|es|son)/i,
    // 葡萄牙语
    /^(como|o que|por que|quando|onde|quem|qual|pode|é|são)/i,
    // 日语
    /^.*(どう|何|なぜ|いつ|どこ|誰|どの|できる|ですか)/,
    // 以问号结尾
    /\?$/,
    // 中文问号
    /？$/,
  ];

  return naturalPatterns.some(pattern => pattern.test(question));
}

/**
 * 获取 FAQ 的最小数量要求
 */
export const MIN_FAQ_COUNT = 3;

/**
 * 验证 FAQ 数组是否满足要求
 * @param faqs - FAQ 数组
 * @returns 是否满足要求
 */
export function validateFAQs(faqs: FAQItem[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 检查数量
  if (faqs.length < MIN_FAQ_COUNT) {
    errors.push(`FAQ count (${faqs.length}) is less than minimum required (${MIN_FAQ_COUNT})`);
  }

  // 检查每个问题是否为自然语言格式
  faqs.forEach((faq, index) => {
    if (!isNaturalLanguageQuestion(faq.question)) {
      errors.push(`FAQ ${index + 1} question is not in natural language format: "${faq.question}"`);
    }
    if (!faq.answer || faq.answer.trim().length === 0) {
      errors.push(`FAQ ${index + 1} has empty answer`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
