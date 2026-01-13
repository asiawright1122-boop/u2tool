/**
 * GEO 优化的工具 FAQ 配置 - 第二十八批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_28: ToolSpecificFAQ[] = [
  // Whiteboard
  {
    slug: 'whiteboard',
    faqs: {
      en: [
        { question: 'How do I use the online whiteboard?', answer: 'Draw with pen tool, add shapes, text, and images. Use different colors and sizes. Infinite canvas to work on.' },
        { question: 'Can I collaborate in real-time?', answer: 'Share board link for viewing. Some versions support live collaboration. Check feature availability.' },
        { question: 'Can I save my whiteboard?', answer: 'Yes, save to browser storage or export as image/PDF. Import saved boards to continue working.' },
      ],
      zh: [
        { question: '如何使用在线白板？', answer: '用画笔工具绘制，添加形状、文本和图像。使用不同的颜色和大小。无限画布可供使用。' },
        { question: '可以实时协作吗？', answer: '分享白板链接供查看。某些版本支持实时协作。检查功能可用性。' },
        { question: '可以保存我的白板吗？', answer: '是的，保存到浏览器存储或导出为图像/PDF。导入保存的白板继续工作。' },
      ],
    },
  },

  // Drawing Tool
  {
    slug: 'drawing-tool',
    faqs: {
      en: [
        { question: 'What drawing tools are available?', answer: 'Pen, pencil, brush, eraser, shapes, fill, text. Adjust size, color, opacity. Layers for complex drawings.' },
        { question: 'Can I draw with a stylus?', answer: 'Yes, supports pressure sensitivity on compatible devices. Better precision than mouse for detailed work.' },
        { question: 'What formats can I export?', answer: 'PNG (with transparency), JPG, SVG for vector. Choose resolution for print or web use.' },
      ],
      zh: [
        { question: '有哪些绘图工具可用？', answer: '钢笔、铅笔、画笔、橡皮擦、形状、填充、文本。调整大小、颜色、不透明度。图层用于复杂绘图。' },
        { question: '可以用触控笔绘图吗？', answer: '是的，在兼容设备上支持压力感应。比鼠标更精确，适合详细工作。' },
        { question: '可以导出什么格式？', answer: 'PNG（带透明度）、JPG、矢量 SVG。选择分辨率用于打印或网页使用。' },
      ],
    },
  },

  // Chart Generator
  {
    slug: 'chart-generator',
    faqs: {
      en: [
        { question: 'What chart types are available?', answer: 'Bar, line, pie, doughnut, area, scatter, radar, and more. Choose based on your data type.' },
        { question: 'How do I input data?', answer: 'Paste from spreadsheet, enter manually, or upload CSV. We auto-detect data format.' },
        { question: 'Can I customize chart appearance?', answer: 'Yes, colors, fonts, labels, legends, gridlines, animations. Match your brand or presentation style.' },
      ],
      zh: [
        { question: '有哪些图表类型可用？', answer: '柱状图、折线图、饼图、环形图、面积图、散点图、雷达图等。根据数据类型选择。' },
        { question: '如何输入数据？', answer: '从电子表格粘贴、手动输入或上传 CSV。我们自动检测数据格式。' },
        { question: '可以自定义图表外观吗？', answer: '是的，颜色、字体、标签、图例、网格线、动画。匹配您的品牌或演示风格。' },
      ],
    },
  },

  // Graph Maker
  {
    slug: 'graph-maker',
    faqs: {
      en: [
        { question: 'What is the difference between chart and graph?', answer: 'Often used interchangeably. Graphs typically show relationships (line, scatter). Charts include categorical data (bar, pie).' },
        { question: 'How do I create a line graph?', answer: 'Enter X and Y values. We plot points and connect with lines. Add multiple series for comparison.' },
        { question: 'Can I add trend lines?', answer: 'Yes, add linear, polynomial, or moving average trend lines. Shows data patterns and predictions.' },
      ],
      zh: [
        { question: '图表和图形有什么区别？', answer: '通常可互换使用。图形通常显示关系（折线、散点）。图表包括分类数据（柱状、饼图）。' },
        { question: '如何创建折线图？', answer: '输入 X 和 Y 值。我们绘制点并用线连接。添加多个系列进行比较。' },
        { question: '可以添加趋势线吗？', answer: '是的，添加线性、多项式或移动平均趋势线。显示数据模式和预测。' },
      ],
    },
  },

  // Table Generator
  {
    slug: 'table-generator',
    faqs: {
      en: [
        { question: 'How do I create a table?', answer: 'Set rows and columns, enter data. We generate HTML, Markdown, or CSV format. Copy to your document.' },
        { question: 'Can I import data from spreadsheet?', answer: 'Yes, paste from Excel/Sheets. We convert to table format. Also import CSV files.' },
        { question: 'What output formats are available?', answer: 'HTML (for web), Markdown (for docs), CSV (for data), LaTeX (for academic). Choose based on destination.' },
      ],
      zh: [
        { question: '如何创建表格？', answer: '设置行和列，输入数据。我们生成 HTML、Markdown 或 CSV 格式。复制到您的文档。' },
        { question: '可以从电子表格导入数据吗？', answer: '是的，从 Excel/Sheets 粘贴。我们转换为表格格式。也可导入 CSV 文件。' },
        { question: '有哪些输出格式可用？', answer: 'HTML（用于网页）、Markdown（用于文档）、CSV（用于数据）、LaTeX（用于学术）。根据目的地选择。' },
      ],
    },
  },

  // Spreadsheet
  {
    slug: 'spreadsheet',
    faqs: {
      en: [
        { question: 'What can I do with the online spreadsheet?', answer: 'Enter data, use formulas, create charts. Basic Excel/Sheets functionality in browser. No software needed.' },
        { question: 'What formulas are supported?', answer: 'SUM, AVERAGE, COUNT, IF, VLOOKUP, and 100+ more. Standard spreadsheet formula syntax.' },
        { question: 'Can I import/export Excel files?', answer: 'Yes, import .xlsx files. Export to Excel, CSV, or PDF. Formatting is preserved.' },
      ],
      zh: [
        { question: '在线电子表格可以做什么？', answer: '输入数据、使用公式、创建图表。浏览器中的基本 Excel/Sheets 功能。无需软件。' },
        { question: '支持哪些公式？', answer: 'SUM、AVERAGE、COUNT、IF、VLOOKUP 等 100 多个。标准电子表格公式语法。' },
        { question: '可以导入/导出 Excel 文件吗？', answer: '是的，导入 .xlsx 文件。导出为 Excel、CSV 或 PDF。格式会保留。' },
      ],
    },
  },

  // Calendar
  {
    slug: 'calendar',
    faqs: {
      en: [
        { question: 'How do I use the online calendar?', answer: 'View month/week/day. Click to add events. Set reminders, recurring events, and categories.' },
        { question: 'Can I sync with Google Calendar?', answer: 'Export as ICS file to import elsewhere. Some versions support direct sync. Check features.' },
        { question: 'Can I share my calendar?', answer: 'Export and share ICS file. Generate view-only link for others. Privacy controls available.' },
      ],
      zh: [
        { question: '如何使用在线日历？', answer: '查看月/周/日。点击添加事件。设置提醒、重复事件和类别。' },
        { question: '可以与 Google 日历同步吗？', answer: '导出为 ICS 文件以导入其他地方。某些版本支持直接同步。检查功能。' },
        { question: '可以分享我的日历吗？', answer: '导出并分享 ICS 文件。为他人生成只读链接。提供隐私控制。' },
      ],
    },
  },

  // Habit Tracker
  {
    slug: 'habit-tracker',
    faqs: {
      en: [
        { question: 'How do I track habits?', answer: 'Add habits you want to build. Check off daily completion. See streaks and statistics over time.' },
        { question: 'What makes habit tracking effective?', answer: 'Consistency is key. Visual streaks motivate. Start small, build gradually. Track 3-5 habits max.' },
        { question: 'Can I set reminders?', answer: 'Yes, set daily reminders for each habit. Browser notifications or email reminders available.' },
      ],
      zh: [
        { question: '如何跟踪习惯？', answer: '添加您想养成的习惯。勾选每日完成情况。查看连续记录和随时间变化的统计数据。' },
        { question: '什么使习惯跟踪有效？', answer: '一致性是关键。视觉连续记录激励人。从小处开始，逐渐建立。最多跟踪 3-5 个习惯。' },
        { question: '可以设置提醒吗？', answer: '是的，为每个习惯设置每日提醒。提供浏览器通知或电子邮件提醒。' },
      ],
    },
  },

  // Goal Tracker
  {
    slug: 'goal-tracker',
    faqs: {
      en: [
        { question: 'How do I set and track goals?', answer: 'Define goal, set deadline, break into milestones. Track progress percentage. Celebrate achievements.' },
        { question: 'What is SMART goal setting?', answer: 'Specific, Measurable, Achievable, Relevant, Time-bound. Our tool helps structure goals this way.' },
        { question: 'Can I track multiple goals?', answer: 'Yes, organize by category (health, career, finance). See dashboard of all goals and progress.' },
      ],
      zh: [
        { question: '如何设定和跟踪目标？', answer: '定义目标，设置截止日期，分解为里程碑。跟踪进度百分比。庆祝成就。' },
        { question: '什么是 SMART 目标设定？', answer: '具体、可衡量、可实现、相关、有时限。我们的工具帮助以这种方式构建目标。' },
        { question: '可以跟踪多个目标吗？', answer: '是的，按类别组织（健康、职业、财务）。查看所有目标和进度的仪表板。' },
      ],
    },
  },

  // Expense Tracker
  {
    slug: 'expense-tracker',
    faqs: {
      en: [
        { question: 'How do I track expenses?', answer: 'Add transactions with amount, category, date. See spending breakdown by category. Set budgets and alerts.' },
        { question: 'What categories should I use?', answer: 'Common: Food, Transport, Housing, Utilities, Entertainment, Shopping, Health. Customize to your needs.' },
        { question: 'Can I set a budget?', answer: 'Yes, set monthly budgets per category. Get alerts when approaching or exceeding limits.' },
      ],
      zh: [
        { question: '如何跟踪支出？', answer: '添加带金额、类别、日期的交易。按类别查看支出明细。设置预算和警报。' },
        { question: '我应该使用什么类别？', answer: '常见：食物、交通、住房、水电、娱乐、购物、健康。根据需要自定义。' },
        { question: '可以设置预算吗？', answer: '是的，为每个类别设置月度预算。接近或超过限额时收到警报。' },
      ],
    },
  },
];
