/**
 * 使用场景配置
 * 为热门工具提供详细的使用场景数据
 * @see Requirements 7.1, 7.2
 */

import type { UseCase, UserPersona } from '@/lib/use-cases';

// 热门工具的使用场景配置
export const TOOL_USE_CASES: Record<string, UseCase[]> = {
  // JSON Formatter
  'json-formatter': [
    {
      id: 'api-debugging',
      title: 'API 响应调试',
      description: '格式化 API 返回的 JSON 数据，便于分析和调试',
      persona: 'developer',
      tools: ['json-formatter'],
      steps: [
        { order: 1, title: '复制 API 响应', description: '从浏览器开发者工具或 Postman 复制 JSON 响应' },
        { order: 2, title: '粘贴到工具', description: '将 JSON 数据粘贴到输入框' },
        { order: 3, title: '格式化', description: '点击格式化按钮，查看结构化的数据' },
        { order: 4, title: '分析数据', description: '检查数据结构，定位问题字段' },
      ],
      examples: ['调试 REST API 响应', '分析 GraphQL 查询结果', '检查 Webhook 数据'],
    },
    {
      id: 'config-editing',
      title: '配置文件编辑',
      description: '格式化和编辑 JSON 配置文件',
      persona: 'developer',
      tools: ['json-formatter'],
      steps: [
        { order: 1, title: '打开配置', description: '复制 package.json 或其他配置文件内容' },
        { order: 2, title: '格式化', description: '使用工具格式化 JSON' },
        { order: 3, title: '编辑', description: '修改需要更改的配置项' },
        { order: 4, title: '验证', description: '确保 JSON 语法正确' },
      ],
      examples: ['编辑 package.json', '修改 tsconfig.json', '更新 .eslintrc.json'],
    },
  ],

  // Base64
  'base64': [
    {
      id: 'image-embedding',
      title: '图片嵌入 HTML',
      description: '将图片转换为 Base64 格式，直接嵌入 HTML 或 CSS',
      persona: 'developer',
      tools: ['base64', 'image-to-base64'],
      steps: [
        { order: 1, title: '选择图片', description: '选择需要嵌入的小图片（建议 < 10KB）' },
        { order: 2, title: '编码', description: '将图片转换为 Base64 字符串' },
        { order: 3, title: '添加前缀', description: '添加 data:image/png;base64, 前缀' },
        { order: 4, title: '使用', description: '在 img src 或 CSS background 中使用' },
      ],
      examples: ['嵌入小图标', '内联 SVG 图片', 'CSS 背景图片'],
    },
    {
      id: 'api-auth',
      title: 'API 认证',
      description: '编码 API 认证凭据',
      persona: 'developer',
      tools: ['base64'],
      steps: [
        { order: 1, title: '准备凭据', description: '格式化为 username:password' },
        { order: 2, title: '编码', description: '使用 Base64 编码凭据' },
        { order: 3, title: '添加头部', description: '创建 Authorization: Basic {encoded} 头部' },
        { order: 4, title: '发送请求', description: '在 API 请求中使用认证头部' },
      ],
      examples: ['HTTP Basic 认证', 'API 密钥编码'],
    },
  ],

  // UUID Generator
  'uuid-generator': [
    {
      id: 'database-keys',
      title: '数据库主键生成',
      description: '为数据库记录生成唯一标识符',
      persona: 'developer',
      tools: ['uuid-generator'],
      steps: [
        { order: 1, title: '选择版本', description: '选择 UUID v4（随机）或 v1（时间戳）' },
        { order: 2, title: '生成', description: '点击生成按钮创建 UUID' },
        { order: 3, title: '复制', description: '复制生成的 UUID' },
        { order: 4, title: '使用', description: '在数据库插入语句中使用' },
      ],
      examples: ['用户 ID', '订单 ID', '会话 ID'],
    },
    {
      id: 'batch-generation',
      title: '批量 ID 生成',
      description: '为测试数据或批量导入生成多个 UUID',
      persona: 'developer',
      tools: ['uuid-generator'],
      steps: [
        { order: 1, title: '设置数量', description: '输入需要生成的 UUID 数量' },
        { order: 2, title: '批量生成', description: '一次性生成多个 UUID' },
        { order: 3, title: '导出', description: '复制或下载 UUID 列表' },
      ],
      examples: ['测试数据准备', '数据迁移', '批量导入'],
    },
  ],

  // QR Generator
  'qr-generator': [
    {
      id: 'marketing-campaign',
      title: '营销活动二维码',
      description: '为营销活动创建可追踪的二维码',
      persona: 'marketer',
      tools: ['qr-generator'],
      steps: [
        { order: 1, title: '准备链接', description: '创建带 UTM 参数的营销链接' },
        { order: 2, title: '生成二维码', description: '将链接转换为二维码' },
        { order: 3, title: '自定义', description: '添加品牌颜色和 Logo' },
        { order: 4, title: '下载', description: '下载高清二维码用于印刷' },
      ],
      examples: ['产品包装二维码', '海报二维码', '名片二维码'],
    },
    {
      id: 'wifi-sharing',
      title: 'WiFi 密码分享',
      description: '创建 WiFi 连接二维码，方便访客连接',
      persona: 'general',
      tools: ['qr-generator'],
      steps: [
        { order: 1, title: '选择 WiFi 类型', description: '选择 WiFi 二维码模式' },
        { order: 2, title: '输入信息', description: '输入 SSID、密码和加密类型' },
        { order: 3, title: '生成', description: '生成 WiFi 连接二维码' },
        { order: 4, title: '打印', description: '打印并放置在显眼位置' },
      ],
      examples: ['办公室 WiFi', '咖啡店 WiFi', '家庭访客 WiFi'],
    },
  ],

  // Password Generator
  'password-generator': [
    {
      id: 'account-security',
      title: '账户安全密码',
      description: '为重要账户创建强密码',
      persona: 'general',
      tools: ['password-generator'],
      steps: [
        { order: 1, title: '设置长度', description: '选择 16 个或更多字符' },
        { order: 2, title: '选择字符类型', description: '包含大小写字母、数字和符号' },
        { order: 3, title: '生成', description: '生成随机强密码' },
        { order: 4, title: '保存', description: '保存到密码管理器' },
      ],
      examples: ['银行账户密码', '邮箱密码', '社交媒体密码'],
    },
  ],

  // Hash Generator
  'hash-generator': [
    {
      id: 'file-integrity',
      title: '文件完整性验证',
      description: '生成文件哈希值用于验证文件完整性',
      persona: 'developer',
      tools: ['hash-generator', 'file-hash'],
      steps: [
        { order: 1, title: '选择算法', description: '选择 SHA-256 或 MD5' },
        { order: 2, title: '计算哈希', description: '计算文件或文本的哈希值' },
        { order: 3, title: '记录', description: '保存哈希值用于后续验证' },
        { order: 4, title: '验证', description: '比较哈希值确认文件未被修改' },
      ],
      examples: ['软件下载验证', '备份文件校验', '数据传输验证'],
    },
  ],

  // Color Converter
  'color-converter': [
    {
      id: 'design-handoff',
      title: '设计交付',
      description: '将设计稿中的颜色转换为开发所需格式',
      persona: 'designer',
      tools: ['color-converter', 'color-picker'],
      steps: [
        { order: 1, title: '获取颜色', description: '从设计稿中获取颜色值' },
        { order: 2, title: '转换格式', description: '将 HEX 转换为 RGB 或 HSL' },
        { order: 3, title: '复制代码', description: '复制 CSS 颜色代码' },
        { order: 4, title: '交付', description: '提供给开发人员使用' },
      ],
      examples: ['品牌色转换', '渐变色值', '透明度颜色'],
    },
  ],

  // Word Counter
  'word-counter': [
    {
      id: 'seo-optimization',
      title: 'SEO 内容优化',
      description: '检查内容长度是否符合 SEO 要求',
      persona: 'marketer',
      tools: ['word-counter'],
      steps: [
        { order: 1, title: '粘贴内容', description: '将文章内容粘贴到工具' },
        { order: 2, title: '查看统计', description: '检查字数、段落数等' },
        { order: 3, title: '优化', description: '根据 SEO 建议调整内容长度' },
      ],
      examples: ['博客文章字数', 'Meta 描述长度', '标题字符数'],
    },
  ],

  // Image Resizer
  'image-resizer': [
    {
      id: 'social-media',
      title: '社交媒体图片',
      description: '调整图片尺寸以适应不同社交平台',
      persona: 'marketer',
      tools: ['image-resizer', 'image-compressor'],
      steps: [
        { order: 1, title: '上传图片', description: '上传原始图片' },
        { order: 2, title: '选择尺寸', description: '选择目标平台的推荐尺寸' },
        { order: 3, title: '调整', description: '裁剪或缩放图片' },
        { order: 4, title: '下载', description: '下载调整后的图片' },
      ],
      examples: ['Instagram 帖子', 'Facebook 封面', 'Twitter 头图'],
    },
  ],

  // Regex Tester
  'regex-tester': [
    {
      id: 'data-validation',
      title: '数据验证',
      description: '测试正则表达式用于表单验证',
      persona: 'developer',
      tools: ['regex-tester'],
      steps: [
        { order: 1, title: '编写正则', description: '编写验证规则的正则表达式' },
        { order: 2, title: '测试', description: '使用测试数据验证正则' },
        { order: 3, title: '调试', description: '查看匹配结果和捕获组' },
        { order: 4, title: '优化', description: '优化正则表达式性能' },
      ],
      examples: ['邮箱验证', '手机号验证', '密码强度检查'],
    },
  ],
};

/**
 * 获取工具的使用场景
 * @param toolSlug - 工具 slug
 * @returns 使用场景数组
 */
export function getToolUseCases(toolSlug: string): UseCase[] {
  return TOOL_USE_CASES[toolSlug] || [];
}

/**
 * 获取所有有使用场景的工具
 * @returns 工具 slug 数组
 */
export function getToolsWithUseCases(): string[] {
  return Object.keys(TOOL_USE_CASES);
}

/**
 * 按角色获取使用场景
 * @param persona - 用户角色
 * @returns 使用场景数组
 */
export function getUseCasesByPersona(persona: UserPersona): UseCase[] {
  const useCases: UseCase[] = [];
  
  for (const toolUseCases of Object.values(TOOL_USE_CASES)) {
    for (const uc of toolUseCases) {
      if (uc.persona === persona) {
        useCases.push(uc);
      }
    }
  }
  
  return useCases;
}
