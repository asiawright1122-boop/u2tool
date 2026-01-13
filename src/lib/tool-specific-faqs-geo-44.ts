/**
 * GEO 优化的工具 FAQ 配置 - 第四十四批 - 更多图表和图像工具
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_44: ToolSpecificFAQ[] = [
  // Doughnut Chart Generator
  {
    slug: 'doughnut-chart-generator',
    faqs: {
      en: [
        { question: 'What is a doughnut chart?', answer: 'Pie chart with hollow center. Shows proportions while allowing center text/metrics.' },
        { question: 'Doughnut vs pie chart?', answer: 'Doughnut has center space for labels/totals. Slightly harder to compare slice sizes than pie.' },
        { question: 'Can I nest multiple rings?', answer: 'Yes, create multi-ring doughnut for hierarchical data or comparing related datasets.' },
      ],
      zh: [
        { question: '什么是环形图？', answer: '中心空心的饼图。显示比例同时允许中心文本/指标。' },
        { question: '环形图与饼图？', answer: '环形图有中心空间用于标签/总计。比饼图稍难比较切片大小。' },
        { question: '可以嵌套多个环吗？', answer: '是的，为层次数据或比较相关数据集创建多环环形图。' },
      ],
    },
  },

  // Sankey Chart Generator
  {
    slug: 'sankey-chart-generator',
    faqs: {
      en: [
        { question: 'What is a Sankey diagram?', answer: 'Flow diagram where width represents quantity. Shows how values flow between categories.' },
        { question: 'When should I use Sankey?', answer: 'Energy flows, budget allocation, user journeys, material flows, any source-to-destination data.' },
        { question: 'How do I set up the data?', answer: 'Define source, target, and value for each flow. We calculate widths and layout automatically.' },
      ],
      zh: [
        { question: '什么是桑基图？', answer: '宽度代表数量的流程图。显示值如何在类别之间流动。' },
        { question: '什么时候应该使用桑基图？', answer: '能源流、预算分配、用户旅程、物料流、任何源到目标的数据。' },
        { question: '如何设置数据？', answer: '为每个流定义源、目标和值。我们自动计算宽度和布局。' },
      ],
    },
  },

  // Sunburst Chart Generator
  {
    slug: 'sunburst-chart-generator',
    faqs: {
      en: [
        { question: 'What is a sunburst chart?', answer: 'Radial treemap showing hierarchical data. Inner ring is root, outer rings are children.' },
        { question: 'When to use sunburst vs treemap?', answer: 'Sunburst better shows hierarchy levels. Treemap better for comparing sizes. Both show part-to-whole.' },
        { question: 'How do I navigate deep hierarchies?', answer: 'Click to zoom into sections. Breadcrumb shows path. Click center to zoom out.' },
      ],
      zh: [
        { question: '什么是旭日图？', answer: '显示层次数据的径向树图。内环是根，外环是子节点。' },
        { question: '什么时候使用旭日图而不是树图？', answer: '旭日图更好地显示层次级别。树图更好地比较大小。两者都显示部分与整体。' },
        { question: '如何导航深层次结构？', answer: '点击放大部分。面包屑显示路径。点击中心缩小。' },
      ],
    },
  },

  // Candlestick Chart Generator
  {
    slug: 'candlestick-chart-generator',
    faqs: {
      en: [
        { question: 'What is a candlestick chart?', answer: 'Financial chart showing open, high, low, close prices. Body shows open-close, wicks show high-low.' },
        { question: 'How do I read candlesticks?', answer: 'Green/hollow = close > open (bullish). Red/filled = close < open (bearish). Wicks show range.' },
        { question: 'What timeframes work best?', answer: 'Daily for swing trading, hourly for day trading, weekly for long-term. Choose based on strategy.' },
      ],
      zh: [
        { question: '什么是蜡烛图？', answer: '显示开盘、最高、最低、收盘价的金融图表。实体显示开盘-收盘，影线显示最高-最低。' },
        { question: '如何阅读蜡烛图？', answer: '绿色/空心 = 收盘 > 开盘（看涨）。红色/实心 = 收盘 < 开盘（看跌）。影线显示范围。' },
        { question: '什么时间框架最好？', answer: '日线用于波段交易，小时线用于日内交易，周线用于长期。根据策略选择。' },
      ],
    },
  },

  // Boxplot Chart Generator
  {
    slug: 'boxplot-chart-generator',
    faqs: {
      en: [
        { question: 'What is a box plot?', answer: 'Shows data distribution: median, quartiles, and outliers. Box is IQR, whiskers show range.' },
        { question: 'How do I read a box plot?', answer: 'Line in box = median. Box edges = Q1 and Q3. Whiskers = min/max (excluding outliers). Dots = outliers.' },
        { question: 'When should I use box plots?', answer: 'Comparing distributions across groups, identifying outliers, showing data spread and skewness.' },
      ],
      zh: [
        { question: '什么是箱线图？', answer: '显示数据分布：中位数、四分位数和异常值。箱体是 IQR，须显示范围。' },
        { question: '如何阅读箱线图？', answer: '箱中线 = 中位数。箱边缘 = Q1 和 Q3。须 = 最小/最大（不包括异常值）。点 = 异常值。' },
        { question: '什么时候应该使用箱线图？', answer: '比较组间分布、识别异常值、显示数据分散和偏度。' },
      ],
    },
  },

  // Word Cloud Generator
  {
    slug: 'wordcloud-generator',
    faqs: {
      en: [
        { question: 'How do I create a word cloud?', answer: 'Enter text or word list. We analyze frequency and create visual with larger words = more frequent.' },
        { question: 'Can I customize appearance?', answer: 'Yes, choose colors, fonts, shapes, and layouts. Exclude common words (stopwords) optionally.' },
        { question: 'What text works best?', answer: 'Survey responses, social media, articles, reviews. More text = better word frequency analysis.' },
      ],
      zh: [
        { question: '如何创建词云？', answer: '输入文本或单词列表。我们分析频率并创建可视化，更大的单词 = 更频繁。' },
        { question: '可以自定义外观吗？', answer: '是的，选择颜色、字体、形状和布局。可选择排除常见词（停用词）。' },
        { question: '什么文本效果最好？', answer: '调查回复、社交媒体、文章、评论。更多文本 = 更好的词频分析。' },
      ],
    },
  },

  // Graph/Network Chart Generator
  {
    slug: 'graph-chart-generator',
    faqs: {
      en: [
        { question: 'What is a network graph?', answer: 'Nodes connected by edges. Shows relationships between entities. Used for social networks, dependencies.' },
        { question: 'How do I define connections?', answer: 'List node pairs (source, target). Optionally add weights for edge thickness.' },
        { question: 'What layouts are available?', answer: 'Force-directed (physics simulation), circular, hierarchical, grid. Force-directed most common.' },
      ],
      zh: [
        { question: '什么是网络图？', answer: '由边连接的节点。显示实体之间的关系。用于社交网络、依赖关系。' },
        { question: '如何定义连接？', answer: '列出节点对（源、目标）。可选择添加权重用于边的粗细。' },
        { question: '有哪些布局可用？', answer: '力导向（物理模拟）、圆形、层次、网格。力导向最常见。' },
      ],
    },
  },

  // Calendar Heatmap Generator
  {
    slug: 'calendar-heatmap-generator',
    faqs: {
      en: [
        { question: 'What is a calendar heatmap?', answer: 'GitHub-style contribution graph. Shows activity intensity by day over months/years.' },
        { question: 'What data format is needed?', answer: 'Date and value pairs. We plot on calendar grid with color intensity showing values.' },
        { question: 'What can I visualize?', answer: 'Commits, workouts, habits, sales, any daily metric. Great for showing consistency patterns.' },
      ],
      zh: [
        { question: '什么是日历热力图？', answer: 'GitHub 风格的贡献图。显示数月/数年内每天的活动强度。' },
        { question: '需要什么数据格式？', answer: '日期和值对。我们在日历网格上绘制，颜色强度显示值。' },
        { question: '可以可视化什么？', answer: '提交、锻炼、习惯、销售、任何每日指标。非常适合显示一致性模式。' },
      ],
    },
  },

  // Polar Bar Chart Generator
  {
    slug: 'polar-bar-chart-generator',
    faqs: {
      en: [
        { question: 'What is a polar bar chart?', answer: 'Bar chart in circular layout. Bars extend from center. Good for cyclical data like hours or months.' },
        { question: 'When to use polar vs regular bar?', answer: 'Polar for cyclical data (24 hours, 12 months). Regular bar for non-cyclical comparisons.' },
        { question: 'Can I show multiple series?', answer: 'Yes, stacked or grouped polar bars. Compare multiple metrics across the same cycle.' },
      ],
      zh: [
        { question: '什么是极坐标条形图？', answer: '圆形布局的条形图。条从中心延伸。适合小时或月份等周期性数据。' },
        { question: '什么时候使用极坐标而不是普通条形图？', answer: '极坐标用于周期性数据（24 小时、12 个月）。普通条形图用于非周期性比较。' },
        { question: '可以显示多个系列吗？', answer: '是的，堆叠或分组的极坐标条形图。在同一周期内比较多个指标。' },
      ],
    },
  },

  // Parallel Coordinates Chart Generator
  {
    slug: 'parallel-chart-generator',
    faqs: {
      en: [
        { question: 'What is a parallel coordinates chart?', answer: 'Multiple vertical axes, lines connect values across dimensions. Shows patterns in multivariate data.' },
        { question: 'When should I use this chart?', answer: 'Comparing items across many dimensions, finding clusters, identifying outliers in complex data.' },
        { question: 'How do I read the patterns?', answer: 'Similar items have similar line paths. Crossing lines show inverse relationships. Clusters visible as bundles.' },
      ],
      zh: [
        { question: '什么是平行坐标图？', answer: '多个垂直轴，线连接跨维度的值。显示多变量数据中的模式。' },
        { question: '什么时候应该使用这种图表？', answer: '在多个维度上比较项目、查找聚类、识别复杂数据中的异常值。' },
        { question: '如何阅读模式？', answer: '相似的项目有相似的线路径。交叉线显示反向关系。聚类作为束可见。' },
      ],
    },
  },
];
