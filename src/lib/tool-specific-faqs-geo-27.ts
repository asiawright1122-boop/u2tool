/**
 * GEO 优化的工具 FAQ 配置 - 第二十七批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_27: ToolSpecificFAQ[] = [
  // Disclaimer Generator
  {
    slug: 'disclaimer-generator',
    faqs: {
      en: [
        { question: 'Why do I need a disclaimer?', answer: 'Limits liability for advice, opinions, or information. Protects against lawsuits. Common for blogs, affiliate sites, professional services.' },
        { question: 'What types of disclaimers exist?', answer: 'General, affiliate disclosure, medical/legal/financial advice, views expressed, copyright, warranty, external links.' },
        { question: 'Where should I place disclaimers?', answer: 'Footer for general. Before content for specific (affiliate links, advice). Dedicated page linked from footer.' },
      ],
      zh: [
        { question: '为什么我需要免责声明？', answer: '限制对建议、意见或信息的责任。防止诉讼。常见于博客、联盟网站、专业服务。' },
        { question: '有哪些类型的免责声明？', answer: '一般性、联盟披露、医疗/法律/财务建议、观点表达、版权、保证、外部链接。' },
        { question: '我应该在哪里放置免责声明？', answer: '页脚用于一般性声明。内容前用于特定声明（联盟链接、建议）。从页脚链接的专用页面。' },
      ],
    },
  },

  // EULA Generator
  {
    slug: 'eula-generator',
    faqs: {
      en: [
        { question: 'What is an EULA?', answer: 'End User License Agreement - contract between software provider and user. Defines usage rights, restrictions, and liability.' },
        { question: 'When do I need an EULA?', answer: 'For any software, app, or digital product. Required by app stores. Protects intellectual property and limits liability.' },
        { question: 'What should an EULA include?', answer: 'License grant, restrictions, intellectual property, termination, warranty disclaimer, limitation of liability, governing law.' },
      ],
      zh: [
        { question: '什么是 EULA？', answer: '最终用户许可协议 - 软件提供商和用户之间的合同。定义使用权、限制和责任。' },
        { question: '我什么时候需要 EULA？', answer: '对于任何软件、应用或数字产品。应用商店要求。保护知识产权并限制责任。' },
        { question: 'EULA 应该包含什么？', answer: '许可授予、限制、知识产权、终止、保证免责声明、责任限制、适用法律。' },
      ],
    },
  },

  // NDA Generator
  {
    slug: 'nda-generator',
    faqs: {
      en: [
        { question: 'What is an NDA?', answer: 'Non-Disclosure Agreement - legal contract protecting confidential information. Prevents sharing of trade secrets, business plans, etc.' },
        { question: 'When should I use an NDA?', answer: 'Before sharing sensitive info: business partnerships, hiring, investor meetings, contractor work, mergers.' },
        { question: 'What types of NDAs exist?', answer: 'Unilateral (one party discloses), mutual (both parties share), multilateral (multiple parties). Choose based on situation.' },
      ],
      zh: [
        { question: '什么是 NDA？', answer: '保密协议 - 保护机密信息的法律合同。防止分享商业秘密、商业计划等。' },
        { question: '我什么时候应该使用 NDA？', answer: '在分享敏感信息之前：商业合作、招聘、投资者会议、承包商工作、并购。' },
        { question: '有哪些类型的 NDA？', answer: '单边（一方披露）、双边（双方分享）、多边（多方）。根据情况选择。' },
      ],
    },
  },

  // Contract Generator
  {
    slug: 'contract-generator',
    faqs: {
      en: [
        { question: 'What contracts can I generate?', answer: 'Freelance, employment, service, sales, rental, partnership agreements. Choose template and customize.' },
        { question: 'Are generated contracts legally binding?', answer: 'Templates provide starting point. For important contracts, have a lawyer review. Enforceability varies by jurisdiction.' },
        { question: 'What makes a contract valid?', answer: 'Offer, acceptance, consideration (exchange of value), capacity, legality. Both parties must agree to terms.' },
      ],
      zh: [
        { question: '我可以生成哪些合同？', answer: '自由职业、雇佣、服务、销售、租赁、合伙协议。选择模板并自定义。' },
        { question: '生成的合同具有法律约束力吗？', answer: '模板提供起点。对于重要合同，请律师审查。可执行性因司法管辖区而异。' },
        { question: '什么使合同有效？', answer: '要约、承诺、对价（价值交换）、能力、合法性。双方必须同意条款。' },
      ],
    },
  },

  // Note Taking
  {
    slug: 'note-taking',
    faqs: {
      en: [
        { question: 'How do I use the online notepad?', answer: 'Start typing. Notes auto-save to browser storage. Organize with folders/tags. Export as text or markdown.' },
        { question: 'Are my notes saved automatically?', answer: 'Yes, auto-save every few seconds to browser storage. Notes persist across sessions. Export for backup.' },
        { question: 'Can I format my notes?', answer: 'Yes, supports markdown: headers, bold, italic, lists, code blocks. See formatted preview.' },
      ],
      zh: [
        { question: '如何使用在线记事本？', answer: '开始输入。笔记自动保存到浏览器存储。用文件夹/标签组织。导出为文本或 markdown。' },
        { question: '我的笔记会自动保存吗？', answer: '是的，每隔几秒自动保存到浏览器存储。笔记在会话之间保持。导出以备份。' },
        { question: '我可以格式化笔记吗？', answer: '是的，支持 markdown：标题、粗体、斜体、列表、代码块。查看格式化预览。' },
      ],
    },
  },

  // Todo List
  {
    slug: 'todo-list',
    faqs: {
      en: [
        { question: 'How do I create a todo list?', answer: 'Add tasks, set due dates, organize by project. Check off completed items. Data saves to browser.' },
        { question: 'Can I organize tasks by priority?', answer: 'Yes, set priority levels (high/medium/low), due dates, and categories. Sort and filter as needed.' },
        { question: 'Does it sync across devices?', answer: 'Browser storage is device-specific. Export/import for manual sync, or use account feature if available.' },
      ],
      zh: [
        { question: '如何创建待办事项列表？', answer: '添加任务，设置截止日期，按项目组织。勾选已完成的项目。数据保存到浏览器。' },
        { question: '可以按优先级组织任务吗？', answer: '是的，设置优先级（高/中/低）、截止日期和类别。根据需要排序和筛选。' },
        { question: '它可以跨设备同步吗？', answer: '浏览器存储是设备特定的。导出/导入进行手动同步，或使用账户功能（如果可用）。' },
      ],
    },
  },

  // Kanban Board
  {
    slug: 'kanban-board',
    faqs: {
      en: [
        { question: 'What is a Kanban board?', answer: 'Visual project management tool. Tasks move through columns (To Do, In Progress, Done). See work status at a glance.' },
        { question: 'How do I use the Kanban board?', answer: 'Create columns for workflow stages. Add cards for tasks. Drag cards between columns as work progresses.' },
        { question: 'Can I customize columns?', answer: 'Yes, add/remove/rename columns. Common setups: To Do/Doing/Done, or Backlog/Sprint/Review/Complete.' },
      ],
      zh: [
        { question: '什么是看板？', answer: '可视化项目管理工具。任务在列之间移动（待办、进行中、完成）。一目了然地查看工作状态。' },
        { question: '如何使用看板？', answer: '为工作流阶段创建列。为任务添加卡片。随着工作进展在列之间拖动卡片。' },
        { question: '可以自定义列吗？', answer: '是的，添加/删除/重命名列。常见设置：待办/进行中/完成，或待办/冲刺/审查/完成。' },
      ],
    },
  },

  // Mind Map
  {
    slug: 'mind-map',
    faqs: {
      en: [
        { question: 'What is a mind map?', answer: 'Visual diagram for organizing ideas. Central topic branches into related subtopics. Great for brainstorming and planning.' },
        { question: 'How do I create a mind map?', answer: 'Start with central idea. Add branches for main topics. Add sub-branches for details. Use colors and icons.' },
        { question: 'Can I export my mind map?', answer: 'Yes, export as image (PNG/SVG), PDF, or structured text. Share or use in presentations.' },
      ],
      zh: [
        { question: '什么是思维导图？', answer: '组织想法的可视化图表。中心主题分支到相关子主题。非常适合头脑风暴和规划。' },
        { question: '如何创建思维导图？', answer: '从中心想法开始。为主要主题添加分支。为细节添加子分支。使用颜色和图标。' },
        { question: '可以导出我的思维导图吗？', answer: '是的，导出为图像（PNG/SVG）、PDF 或结构化文本。分享或用于演示。' },
      ],
    },
  },

  // Flowchart Maker
  {
    slug: 'flowchart-maker',
    faqs: {
      en: [
        { question: 'How do I create a flowchart?', answer: 'Drag shapes onto canvas. Connect with arrows. Add text labels. Standard shapes: rectangle (process), diamond (decision), oval (start/end).' },
        { question: 'What flowchart shapes should I use?', answer: 'Oval: start/end. Rectangle: process/action. Diamond: decision. Parallelogram: input/output. Arrow: flow direction.' },
        { question: 'Can I export my flowchart?', answer: 'Yes, export as PNG, SVG, or PDF. SVG is best for editing later. PNG for sharing.' },
      ],
      zh: [
        { question: '如何创建流程图？', answer: '将形状拖到画布上。用箭头连接。添加文本标签。标准形状：矩形（过程）、菱形（决策）、椭圆（开始/结束）。' },
        { question: '我应该使用什么流程图形状？', answer: '椭圆：开始/结束。矩形：过程/动作。菱形：决策。平行四边形：输入/输出。箭头：流向。' },
        { question: '可以导出我的流程图吗？', answer: '是的，导出为 PNG、SVG 或 PDF。SVG 最适合以后编辑。PNG 用于分享。' },
      ],
    },
  },

  // Diagram Editor
  {
    slug: 'diagram-editor',
    faqs: {
      en: [
        { question: 'What types of diagrams can I create?', answer: 'Flowcharts, org charts, network diagrams, UML, ER diagrams, wireframes, and more. Choose template or start blank.' },
        { question: 'How do I connect shapes?', answer: 'Click connector tool, click source shape, click target shape. Connectors auto-route around obstacles.' },
        { question: 'Can I collaborate on diagrams?', answer: 'Export and share files. Some versions support real-time collaboration. Check feature availability.' },
      ],
      zh: [
        { question: '我可以创建哪些类型的图表？', answer: '流程图、组织结构图、网络图、UML、ER 图、线框图等。选择模板或从空白开始。' },
        { question: '如何连接形状？', answer: '点击连接器工具，点击源形状，点击目标形状。连接器自动绕过障碍物。' },
        { question: '可以协作编辑图表吗？', answer: '导出并分享文件。某些版本支持实时协作。检查功能可用性。' },
      ],
    },
  },
];
