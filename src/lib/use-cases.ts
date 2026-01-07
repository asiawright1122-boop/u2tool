/**
 * 使用场景模块
 * 为工具提供使用场景数据和 FAQ 生成
 * @see Requirements 7.1, 7.3, 7.5
 */

import { tools, type Tool } from '@/config/tools';

// 用户角色类型
export type UserPersona = 'developer' | 'designer' | 'marketer' | 'general';

// 使用场景步骤接口
export interface UseCaseStep {
  order: number;
  title: string;
  description: string;
  toolSlug?: string;
}

// 使用场景接口
export interface UseCase {
  id: string;
  title: string;
  description: string;
  persona: UserPersona;
  tools: string[];
  steps: UseCaseStep[];
  examples: string[];
}

// 使用场景 FAQ 接口
export interface UseCaseFAQ {
  question: string;
  answer: string;
  useCase: string;
}

// 角色描述
const PERSONA_DESCRIPTIONS: Record<UserPersona, Record<string, string>> = {
  developer: {
    en: 'Software Developer',
    zh: '软件开发者',
  },
  designer: {
    en: 'UI/UX Designer',
    zh: 'UI/UX 设计师',
  },
  marketer: {
    en: 'Digital Marketer',
    zh: '数字营销人员',
  },
  general: {
    en: 'General User',
    zh: '普通用户',
  },
};

// 分类到角色的映射
const CATEGORY_PERSONAS: Record<string, UserPersona[]> = {
  formatters: ['developer'],
  encoders: ['developer'],
  generators: ['developer', 'marketer'],
  converters: ['developer', 'designer'],
  security: ['developer'],
  text: ['general', 'marketer'],
  image: ['designer', 'marketer'],
  calculators: ['general', 'developer'],
  time: ['general'],
  color: ['designer'],
  seo: ['marketer', 'developer'],
  other: ['general'],
};


// 预定义的使用场景模板
const USE_CASE_TEMPLATES: Record<string, UseCase[]> = {
  formatters: [
    {
      id: 'code-review',
      title: '代码审查准备',
      description: '在提交代码审查前格式化代码，确保一致的代码风格',
      persona: 'developer',
      tools: [],
      steps: [
        { order: 1, title: '粘贴代码', description: '将需要格式化的代码粘贴到输入框' },
        { order: 2, title: '选择格式', description: '选择合适的缩进和格式化选项' },
        { order: 3, title: '格式化', description: '点击格式化按钮处理代码' },
        { order: 4, title: '复制结果', description: '复制格式化后的代码用于提交' },
      ],
      examples: ['格式化 JSON 配置文件', '美化压缩的 JavaScript 代码'],
    },
    {
      id: 'debug-data',
      title: '调试数据分析',
      description: '格式化 API 响应或日志数据以便于分析和调试',
      persona: 'developer',
      tools: [],
      steps: [
        { order: 1, title: '获取数据', description: '从 API 或日志中复制原始数据' },
        { order: 2, title: '格式化', description: '使用工具格式化数据' },
        { order: 3, title: '分析', description: '查看格式化后的结构化数据' },
      ],
      examples: ['格式化 API JSON 响应', '美化 XML 配置'],
    },
  ],
  encoders: [
    {
      id: 'data-transmission',
      title: '安全数据传输',
      description: '编码敏感数据以便安全传输',
      persona: 'developer',
      tools: [],
      steps: [
        { order: 1, title: '准备数据', description: '准备需要编码的数据' },
        { order: 2, title: '选择编码', description: '选择合适的编码方式（如 Base64）' },
        { order: 3, title: '编码', description: '执行编码操作' },
        { order: 4, title: '传输', description: '使用编码后的数据进行传输' },
      ],
      examples: ['Base64 编码图片', 'URL 编码参数'],
    },
  ],
  generators: [
    {
      id: 'secure-password',
      title: '创建安全密码',
      description: '为账户生成强密码',
      persona: 'general',
      tools: [],
      steps: [
        { order: 1, title: '设置长度', description: '选择密码长度（建议 16+ 字符）' },
        { order: 2, title: '选择字符', description: '包含大小写字母、数字和特殊字符' },
        { order: 3, title: '生成', description: '点击生成按钮' },
        { order: 4, title: '保存', description: '将密码保存到密码管理器' },
      ],
      examples: ['生成网站登录密码', '创建 API 密钥'],
    },
    {
      id: 'unique-identifiers',
      title: '生成唯一标识符',
      description: '为数据库记录或 API 生成唯一 ID',
      persona: 'developer',
      tools: [],
      steps: [
        { order: 1, title: '选择格式', description: '选择 UUID 版本或其他格式' },
        { order: 2, title: '生成', description: '生成唯一标识符' },
        { order: 3, title: '使用', description: '在代码中使用生成的 ID' },
      ],
      examples: ['生成 UUID v4', '创建短链接 ID'],
    },
  ],
  converters: [
    {
      id: 'format-migration',
      title: '数据格式迁移',
      description: '将数据从一种格式转换为另一种格式',
      persona: 'developer',
      tools: [],
      steps: [
        { order: 1, title: '导入数据', description: '粘贴或上传源格式数据' },
        { order: 2, title: '转换', description: '执行格式转换' },
        { order: 3, title: '验证', description: '检查转换结果' },
        { order: 4, title: '导出', description: '下载或复制转换后的数据' },
      ],
      examples: ['JSON 转 YAML', 'CSV 转 JSON'],
    },
  ],
  text: [
    {
      id: 'content-analysis',
      title: '内容分析',
      description: '分析文本内容的字数、字符数等统计信息',
      persona: 'marketer',
      tools: [],
      steps: [
        { order: 1, title: '输入文本', description: '粘贴需要分析的文本' },
        { order: 2, title: '查看统计', description: '查看字数、字符数、段落数等' },
        { order: 3, title: '优化', description: '根据统计结果优化内容' },
      ],
      examples: ['检查文章字数', '分析 SEO 描述长度'],
    },
  ],
  image: [
    {
      id: 'social-media-prep',
      title: '社交媒体图片准备',
      description: '为社交媒体平台准备合适尺寸的图片',
      persona: 'marketer',
      tools: [],
      steps: [
        { order: 1, title: '上传图片', description: '上传原始图片' },
        { order: 2, title: '调整尺寸', description: '选择目标平台的尺寸' },
        { order: 3, title: '优化', description: '压缩图片以减小文件大小' },
        { order: 4, title: '下载', description: '下载处理后的图片' },
      ],
      examples: ['Instagram 帖子图片', 'Twitter 头图'],
    },
  ],
};

/**
 * 获取工具的使用场景
 * @param toolSlug - 工具 slug
 * @param locale - 语言
 * @returns 使用场景数组
 */
export function getUseCasesForTool(
  toolSlug: string,
  locale: string = 'en'
): UseCase[] {
  const tool = tools.find(t => t.slug === toolSlug);
  if (!tool) return [];

  const categoryUseCases = USE_CASE_TEMPLATES[tool.category] || [];
  
  // 为每个使用场景添加当前工具
  return categoryUseCases.map(uc => ({
    ...uc,
    tools: [toolSlug, ...uc.tools.filter(t => t !== toolSlug)],
  }));
}

/**
 * 根据使用场景生成 FAQ
 * @param useCase - 使用场景
 * @param locale - 语言
 * @returns FAQ 数组
 */
export function generateUseCaseFAQs(
  useCase: UseCase,
  locale: string = 'en'
): UseCaseFAQ[] {
  const faqs: UseCaseFAQ[] = [];

  // 生成 "如何" 问题
  faqs.push({
    question: locale === 'zh' 
      ? `如何${useCase.title}？`
      : `How to ${useCase.title.toLowerCase()}?`,
    answer: useCase.steps.map(s => `${s.order}. ${s.title}: ${s.description}`).join(' '),
    useCase: useCase.id,
  });

  // 生成 "什么是" 问题
  faqs.push({
    question: locale === 'zh'
      ? `什么是${useCase.title}？`
      : `What is ${useCase.title.toLowerCase()}?`,
    answer: useCase.description,
    useCase: useCase.id,
  });

  // 生成示例问题
  if (useCase.examples.length > 0) {
    faqs.push({
      question: locale === 'zh'
        ? `${useCase.title}有哪些常见示例？`
        : `What are common examples of ${useCase.title.toLowerCase()}?`,
      answer: useCase.examples.join(', '),
      useCase: useCase.id,
    });
  }

  return faqs;
}

/**
 * 获取角色的使用场景
 * @param persona - 用户角色
 * @returns 使用场景数组
 */
export function getUseCasesForPersona(persona: UserPersona): UseCase[] {
  const useCases: UseCase[] = [];
  
  for (const [, categoryUseCases] of Object.entries(USE_CASE_TEMPLATES)) {
    for (const uc of categoryUseCases) {
      if (uc.persona === persona) {
        useCases.push(uc);
      }
    }
  }
  
  return useCases;
}

/**
 * 获取角色描述
 * @param persona - 用户角色
 * @param locale - 语言
 * @returns 角色描述
 */
export function getPersonaDescription(
  persona: UserPersona,
  locale: string = 'en'
): string {
  const descriptions = PERSONA_DESCRIPTIONS[persona];
  return descriptions[locale] || descriptions.en;
}

/**
 * 获取工具适合的角色
 * @param toolSlug - 工具 slug
 * @returns 角色数组
 */
export function getPersonasForTool(toolSlug: string): UserPersona[] {
  const tool = tools.find(t => t.slug === toolSlug);
  if (!tool) return ['general'];
  
  return CATEGORY_PERSONAS[tool.category] || ['general'];
}

/**
 * 生成使用场景的 JSON-LD 结构化数据
 * @param useCase - 使用场景
 * @returns JSON-LD 对象
 */
export function generateUseCaseJsonLd(useCase: UseCase): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: useCase.title,
    description: useCase.description,
    step: useCase.steps.map(step => ({
      '@type': 'HowToStep',
      position: step.order,
      name: step.title,
      text: step.description,
    })),
  };
}

/**
 * 验证使用场景数据
 * @param useCase - 使用场景
 * @returns 验证结果
 */
export function validateUseCase(useCase: UseCase): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!useCase.id) errors.push('缺少 ID');
  if (!useCase.title) errors.push('缺少标题');
  if (!useCase.description) errors.push('缺少描述');
  if (useCase.steps.length === 0) errors.push('缺少步骤');
  
  // 检查步骤顺序
  const orders = useCase.steps.map(s => s.order);
  const expectedOrders = Array.from({ length: orders.length }, (_, i) => i + 1);
  if (JSON.stringify(orders.sort()) !== JSON.stringify(expectedOrders)) {
    errors.push('步骤顺序不正确');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
