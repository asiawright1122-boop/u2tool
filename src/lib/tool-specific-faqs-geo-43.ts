/**
 * GEO 优化的工具 FAQ 配置 - 第四十三批 - 图表生成器
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_43: ToolSpecificFAQ[] = [
  // Bar Chart Generator
  {
    slug: 'bar-chart-generator',
    faqs: {
      en: [
        { question: 'How do I create a bar chart?', answer: 'Enter labels and values. We generate interactive bar chart. Customize colors, labels, and orientation.' },
        { question: 'Can I create horizontal bar charts?', answer: 'Yes, toggle orientation. Horizontal bars better for long labels or many categories.' },
        { question: 'How do I export the chart?', answer: 'Download as PNG, SVG, or PDF. Also copy chart code for embedding in websites.' },
      ],
      zh: [
        { question: '如何创建条形图？', answer: '输入标签和值。我们生成交互式条形图。自定义颜色、标签和方向。' },
        { question: '可以创建水平条形图吗？', answer: '是的，切换方向。水平条形图更适合长标签或多类别。' },
        { question: '如何导出图表？', answer: '下载为 PNG、SVG 或 PDF。也可以复制图表代码以嵌入网站。' },
      ],
    },
  },

  // Line Chart Generator
  {
    slug: 'line-chart-generator',
    faqs: {
      en: [
        { question: 'How do I create a line chart?', answer: 'Enter data points (x, y values). We plot connected line. Add multiple series for comparison.' },
        { question: 'Can I show data points?', answer: 'Yes, toggle markers on/off. Customize marker size and shape. Hover shows exact values.' },
        { question: 'How do I add trend lines?', answer: 'Enable trend line option. Choose linear, polynomial, or moving average. Shows data direction.' },
      ],
      zh: [
        { question: '如何创建折线图？', answer: '输入数据点（x、y 值）。我们绘制连接线。添加多个系列进行比较。' },
        { question: '可以显示数据点吗？', answer: '是的，切换标记开/关。自定义标记大小和形状。悬停显示确切值。' },
        { question: '如何添加趋势线？', answer: '启用趋势线选项。选择线性、多项式或移动平均。显示数据方向。' },
      ],
    },
  },

  // Pie Chart Generator
  {
    slug: 'pie-chart-generator',
    faqs: {
      en: [
        { question: 'How do I create a pie chart?', answer: 'Enter categories and values. We calculate percentages and create pie slices automatically.' },
        { question: 'When should I use pie charts?', answer: 'Best for showing parts of a whole. Limit to 5-7 slices. Use bar chart for more categories.' },
        { question: 'Can I create a donut chart?', answer: 'Yes, adjust inner radius to create donut/ring chart. Center can show total or label.' },
      ],
      zh: [
        { question: '如何创建饼图？', answer: '输入类别和值。我们自动计算百分比并创建饼图切片。' },
        { question: '什么时候应该使用饼图？', answer: '最适合显示整体的部分。限制在 5-7 个切片。更多类别使用条形图。' },
        { question: '可以创建环形图吗？', answer: '是的，调整内半径以创建环形图。中心可以显示总计或标签。' },
      ],
    },
  },

  // Radar Chart Generator
  {
    slug: 'radar-chart-generator',
    faqs: {
      en: [
        { question: 'What is a radar chart?', answer: 'Spider/web chart showing multiple variables. Each axis represents a metric. Good for comparisons.' },
        { question: 'When should I use radar charts?', answer: 'Comparing multiple items across several dimensions. Skills assessment, product comparison, performance metrics.' },
        { question: 'How many axes should I use?', answer: 'Best with 5-8 axes. Too few lacks detail, too many becomes hard to read.' },
      ],
      zh: [
        { question: '什么是雷达图？', answer: '显示多个变量的蜘蛛/网状图。每个轴代表一个指标。适合比较。' },
        { question: '什么时候应该使用雷达图？', answer: '在多个维度上比较多个项目。技能评估、产品比较、性能指标。' },
        { question: '应该使用多少个轴？', answer: '最好 5-8 个轴。太少缺乏细节，太多难以阅读。' },
      ],
    },
  },

  // Scatter Chart Generator
  {
    slug: 'scatter-chart-generator',
    faqs: {
      en: [
        { question: 'What is a scatter chart?', answer: 'Plots individual data points by x,y coordinates. Shows relationships, clusters, and outliers.' },
        { question: 'How do I show correlation?', answer: 'Add trend line to visualize correlation. Positive slope = positive correlation, negative = inverse.' },
        { question: 'Can I add bubble sizes?', answer: 'Yes, third dimension as bubble size. Larger bubbles = higher values. Creates bubble chart.' },
      ],
      zh: [
        { question: '什么是散点图？', answer: '按 x、y 坐标绘制单个数据点。显示关系、聚类和异常值。' },
        { question: '如何显示相关性？', answer: '添加趋势线以可视化相关性。正斜率 = 正相关，负斜率 = 反相关。' },
        { question: '可以添加气泡大小吗？', answer: '是的，第三维度作为气泡大小。更大的气泡 = 更高的值。创建气泡图。' },
      ],
    },
  },

  // Area Chart Generator
  {
    slug: 'area-chart-generator',
    faqs: {
      en: [
        { question: 'What is an area chart?', answer: 'Line chart with filled area below. Shows volume/magnitude over time. Good for cumulative data.' },
        { question: 'When to use area vs line chart?', answer: 'Area emphasizes volume/total. Line emphasizes trend/change. Stacked area shows composition.' },
        { question: 'Can I stack multiple areas?', answer: 'Yes, stacked area chart shows how parts contribute to total over time.' },
      ],
      zh: [
        { question: '什么是面积图？', answer: '下方填充区域的折线图。显示随时间变化的体积/幅度。适合累积数据。' },
        { question: '什么时候使用面积图而不是折线图？', answer: '面积强调体积/总量。折线强调趋势/变化。堆叠面积显示组成。' },
        { question: '可以堆叠多个区域吗？', answer: '是的，堆叠面积图显示各部分如何随时间贡献总量。' },
      ],
    },
  },

  // Funnel Chart Generator
  {
    slug: 'funnel-chart-generator',
    faqs: {
      en: [
        { question: 'What is a funnel chart?', answer: 'Shows progressive reduction through stages. Wide top, narrow bottom. Perfect for conversion funnels.' },
        { question: 'When should I use funnel charts?', answer: 'Sales pipelines, conversion rates, user journey stages, process flow with drop-offs.' },
        { question: 'How do I show conversion rates?', answer: 'We calculate and display percentage between stages. Shows where users drop off.' },
      ],
      zh: [
        { question: '什么是漏斗图？', answer: '显示通过各阶段的逐步减少。顶部宽，底部窄。非常适合转化漏斗。' },
        { question: '什么时候应该使用漏斗图？', answer: '销售管道、转化率、用户旅程阶段、有流失的流程。' },
        { question: '如何显示转化率？', answer: '我们计算并显示各阶段之间的百分比。显示用户在哪里流失。' },
      ],
    },
  },

  // Gauge Chart Generator
  {
    slug: 'gauge-chart-generator',
    faqs: {
      en: [
        { question: 'What is a gauge chart?', answer: 'Speedometer-style chart showing single value against a scale. Good for KPIs and metrics.' },
        { question: 'How do I set ranges?', answer: 'Define min, max, and color zones (red/yellow/green). Needle shows current value position.' },
        { question: 'When should I use gauge charts?', answer: 'Single metric dashboards, performance indicators, progress toward goals, real-time monitoring.' },
      ],
      zh: [
        { question: '什么是仪表图？', answer: '显示单个值相对于刻度的速度计式图表。适合 KPI 和指标。' },
        { question: '如何设置范围？', answer: '定义最小值、最大值和颜色区域（红/黄/绿）。指针显示当前值位置。' },
        { question: '什么时候应该使用仪表图？', answer: '单一指标仪表板、性能指标、目标进度、实时监控。' },
      ],
    },
  },

  // Heatmap Chart Generator
  {
    slug: 'heatmap-chart-generator',
    faqs: {
      en: [
        { question: 'What is a heatmap?', answer: 'Grid visualization where color intensity represents values. Shows patterns in two-dimensional data.' },
        { question: 'What data works best for heatmaps?', answer: 'Time-based patterns (hour x day), correlation matrices, geographic density, activity logs.' },
        { question: 'How do I choose colors?', answer: 'Sequential (light to dark) for magnitude. Diverging (two colors) for positive/negative values.' },
      ],
      zh: [
        { question: '什么是热力图？', answer: '颜色强度代表值的网格可视化。显示二维数据中的模式。' },
        { question: '什么数据最适合热力图？', answer: '基于时间的模式（小时 x 天）、相关矩阵、地理密度、活动日志。' },
        { question: '如何选择颜色？', answer: '顺序（浅到深）用于幅度。发散（两种颜色）用于正/负值。' },
      ],
    },
  },

  // Treemap Chart Generator
  {
    slug: 'treemap-chart-generator',
    faqs: {
      en: [
        { question: 'What is a treemap?', answer: 'Hierarchical data as nested rectangles. Size represents value. Shows part-to-whole relationships.' },
        { question: 'When should I use treemaps?', answer: 'File system visualization, budget allocation, market share, any hierarchical proportional data.' },
        { question: 'How do I show hierarchy?', answer: 'Nested rectangles show parent-child relationships. Color can indicate category or another metric.' },
      ],
      zh: [
        { question: '什么是树图？', answer: '作为嵌套矩形的层次数据。大小代表值。显示部分与整体的关系。' },
        { question: '什么时候应该使用树图？', answer: '文件系统可视化、预算分配、市场份额、任何层次比例数据。' },
        { question: '如何显示层次结构？', answer: '嵌套矩形显示父子关系。颜色可以表示类别或另一个指标。' },
      ],
    },
  },
];
