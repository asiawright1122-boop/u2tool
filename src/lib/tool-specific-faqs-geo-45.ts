/**
 * GEO 优化工具 FAQ - 第 45 批
 * 图表生成器工具 (Chart Generators Part 2)
 */

import type { ToolSpecificFAQ } from './tool-specific-faqs';

export const GEO_TOOL_FAQS_45: ToolSpecificFAQ[] = [
  {
    slug: 'bubble-chart-generator',
    faqs: {
      en: [
        {
          question: 'What is a bubble chart and when should I use it?',
          answer: 'A bubble chart displays three dimensions of data using X/Y coordinates and bubble size. Use it to show relationships between three variables, such as comparing products by price, sales volume, and profit margin simultaneously.',
        },
        {
          question: 'How do I create a bubble chart online?',
          answer: 'Enter your data with X values, Y values, and bubble sizes. Our tool automatically generates an interactive bubble chart. You can customize colors, labels, and export as PNG or SVG.',
        },
        {
          question: 'Can I customize bubble colors and sizes?',
          answer: 'Yes, you can set custom colors for each bubble or use color gradients based on values. Bubble sizes are automatically scaled based on your data, with options to adjust the size range.',
        },
      ],
      zh: [
        {
          question: '什么是气泡图，什么时候应该使用它？',
          answer: '气泡图使用 X/Y 坐标和气泡大小显示三维数据。用于同时展示三个变量之间的关系，例如按价格、销量和利润率比较产品。',
        },
        {
          question: '如何在线创建气泡图？',
          answer: '输入包含 X 值、Y 值和气泡大小的数据。我们的工具会自动生成交互式气泡图。您可以自定义颜色、标签，并导出为 PNG 或 SVG。',
        },
        {
          question: '可以自定义气泡颜色和大小吗？',
          answer: '是的，您可以为每个气泡设置自定义颜色或使用基于值的颜色渐变。气泡大小根据数据自动缩放，并可调整大小范围。',
        },
      ],
    },
  },
  {
    slug: 'tree-chart-generator',
    faqs: {
      en: [
        {
          question: 'What is a tree chart used for?',
          answer: 'A tree chart (or tree diagram) visualizes hierarchical data structures like organizational charts, family trees, file systems, or decision trees. It shows parent-child relationships clearly.',
        },
        {
          question: 'How do I create a tree chart from my data?',
          answer: 'Enter your hierarchical data in JSON format or use our visual editor to build the tree structure. The tool automatically arranges nodes and generates an interactive tree visualization.',
        },
        {
          question: 'Can I customize the tree layout direction?',
          answer: 'Yes, you can choose from top-to-bottom, bottom-to-top, left-to-right, or right-to-left layouts. You can also adjust node spacing, colors, and connection line styles.',
        },
      ],
      zh: [
        {
          question: '树形图用于什么？',
          answer: '树形图用于可视化层级数据结构，如组织架构图、家谱、文件系统或决策树。它清晰地展示父子关系。',
        },
        {
          question: '如何从数据创建树形图？',
          answer: '以 JSON 格式输入层级数据，或使用可视化编辑器构建树结构。工具会自动排列节点并生成交互式树形可视化。',
        },
        {
          question: '可以自定义树的布局方向吗？',
          answer: '是的，您可以选择从上到下、从下到上、从左到右或从右到左的布局。还可以调整节点间距、颜色和连接线样式。',
        },
      ],
    },
  },
  {
    slug: 'theme-river-generator',
    faqs: {
      en: [
        {
          question: 'What is a theme river chart?',
          answer: 'A theme river (or streamgraph) shows how different categories change over time, with flowing river-like shapes. It\'s ideal for visualizing trends in topics, genres, or categories across time periods.',
        },
        {
          question: 'How do I create a theme river visualization?',
          answer: 'Input your time-series data with categories and values. Our tool generates a smooth, flowing visualization showing how each category\'s proportion changes over time.',
        },
        {
          question: 'When should I use a theme river instead of a stacked area chart?',
          answer: 'Use theme rivers when you want to emphasize the flow and organic nature of data changes. They\'re more visually appealing for presentations but stacked area charts are better for precise value reading.',
        },
      ],
      zh: [
        {
          question: '什么是主题河流图？',
          answer: '主题河流图（或流图）以流动的河流形状展示不同类别随时间的变化。非常适合可视化主题、类型或类别在不同时期的趋势。',
        },
        {
          question: '如何创建主题河流可视化？',
          answer: '输入包含类别和值的时间序列数据。我们的工具会生成平滑流动的可视化，展示每个类别的比例如何随时间变化。',
        },
        {
          question: '什么时候应该使用主题河流而不是堆叠面积图？',
          answer: '当您想强调数据变化的流动性和有机性时使用主题河流。它们在演示中更具视觉吸引力，但堆叠面积图更适合精确读取数值。',
        },
      ],
    },
  },
  {
    slug: 'gantt-chart-generator',
    faqs: {
      en: [
        {
          question: 'What is a Gantt chart and how is it used in project management?',
          answer: 'A Gantt chart is a horizontal bar chart showing project tasks over time. It displays task names, start/end dates, duration, and dependencies. Essential for project planning, scheduling, and tracking progress.',
        },
        {
          question: 'How do I create a Gantt chart online for free?',
          answer: 'Enter your tasks with start dates, end dates, and optional dependencies. Our tool generates an interactive Gantt chart you can customize with colors, milestones, and progress indicators.',
        },
        {
          question: 'Can I show task dependencies in the Gantt chart?',
          answer: 'Yes, you can define dependencies between tasks (finish-to-start, start-to-start, etc.). The chart will display connecting arrows showing the relationship between dependent tasks.',
        },
      ],
      zh: [
        {
          question: '什么是甘特图，它在项目管理中如何使用？',
          answer: '甘特图是显示项目任务时间线的水平条形图。它显示任务名称、开始/结束日期、持续时间和依赖关系。对于项目规划、调度和进度跟踪至关重要。',
        },
        {
          question: '如何免费在线创建甘特图？',
          answer: '输入任务及其开始日期、结束日期和可选的依赖关系。我们的工具会生成交互式甘特图，您可以自定义颜色、里程碑和进度指示器。',
        },
        {
          question: '甘特图中可以显示任务依赖关系吗？',
          answer: '是的，您可以定义任务之间的依赖关系（完成到开始、开始到开始等）。图表将显示连接箭头，展示依赖任务之间的关系。',
        },
      ],
    },
  },
  {
    slug: 'venn-diagram-generator',
    faqs: {
      en: [
        {
          question: 'What is a Venn diagram used for?',
          answer: 'A Venn diagram shows logical relationships between sets using overlapping circles. Use it to compare groups, show commonalities and differences, or illustrate set theory concepts in education and business.',
        },
        {
          question: 'How do I create a Venn diagram with custom labels?',
          answer: 'Enter your set names and values for each region (including overlaps). Our tool generates a proportional Venn diagram with customizable colors, labels, and intersection values.',
        },
        {
          question: 'Can I create Venn diagrams with more than 3 circles?',
          answer: 'Yes, our tool supports 2, 3, and 4-set Venn diagrams. For more than 4 sets, consider using Euler diagrams or other visualization methods as traditional Venn diagrams become complex.',
        },
      ],
      zh: [
        {
          question: '维恩图用于什么？',
          answer: '维恩图使用重叠的圆圈显示集合之间的逻辑关系。用于比较群组、展示共同点和差异，或在教育和商业中说明集合论概念。',
        },
        {
          question: '如何创建带自定义标签的维恩图？',
          answer: '输入集合名称和每个区域（包括重叠部分）的值。我们的工具会生成比例维恩图，可自定义颜色、标签和交集值。',
        },
        {
          question: '可以创建超过 3 个圆的维恩图吗？',
          answer: '是的，我们的工具支持 2、3 和 4 集维恩图。对于超过 4 个集合，建议使用欧拉图或其他可视化方法，因为传统维恩图会变得复杂。',
        },
      ],
    },
  },
  {
    slug: 'timeline-chart-generator',
    faqs: {
      en: [
        {
          question: 'What is a timeline chart?',
          answer: 'A timeline chart displays events or milestones in chronological order along a horizontal or vertical axis. Perfect for showing project history, company milestones, historical events, or personal achievements.',
        },
        {
          question: 'How do I create an interactive timeline online?',
          answer: 'Enter your events with dates and descriptions. Our tool generates a beautiful timeline with customizable styles, colors, and icons. Export as image or embed in your website.',
        },
        {
          question: 'Can I add images and links to timeline events?',
          answer: 'Yes, each event can include images, links, and detailed descriptions. You can also categorize events with different colors and add custom icons for visual distinction.',
        },
      ],
      zh: [
        {
          question: '什么是时间线图？',
          answer: '时间线图沿水平或垂直轴按时间顺序显示事件或里程碑。非常适合展示项目历史、公司里程碑、历史事件或个人成就。',
        },
        {
          question: '如何在线创建交互式时间线？',
          answer: '输入带有日期和描述的事件。我们的工具会生成美观的时间线，可自定义样式、颜色和图标。导出为图片或嵌入网站。',
        },
        {
          question: '可以在时间线事件中添加图片和链接吗？',
          answer: '是的，每个事件都可以包含图片、链接和详细描述。您还可以用不同颜色对事件进行分类，并添加自定义图标以进行视觉区分。',
        },
      ],
    },
  },
  {
    slug: 'nightingale-rose-chart-generator',
    faqs: {
      en: [
        {
          question: 'What is a Nightingale rose chart?',
          answer: 'A Nightingale rose chart (or polar area diagram) is a circular chart where sectors have equal angles but different radii based on values. Created by Florence Nightingale, it\'s effective for comparing cyclical data.',
        },
        {
          question: 'When should I use a Nightingale chart instead of a pie chart?',
          answer: 'Use Nightingale charts when you have many categories or want to emphasize differences in magnitude. The varying radii make differences more visible than pie chart slices of similar sizes.',
        },
        {
          question: 'How do I create a Nightingale rose chart?',
          answer: 'Enter your category names and values. Our tool generates a beautiful rose chart with customizable colors, labels, and styling options. Export in PNG or SVG format.',
        },
      ],
      zh: [
        {
          question: '什么是南丁格尔玫瑰图？',
          answer: '南丁格尔玫瑰图（或极坐标面积图）是一种圆形图表，扇区角度相等但半径根据值不同。由弗洛伦斯·南丁格尔创建，非常适合比较周期性数据。',
        },
        {
          question: '什么时候应该使用南丁格尔图而不是饼图？',
          answer: '当您有很多类别或想强调数量差异时使用南丁格尔图。变化的半径比相似大小的饼图扇区更能突出差异。',
        },
        {
          question: '如何创建南丁格尔玫瑰图？',
          answer: '输入类别名称和值。我们的工具会生成美观的玫瑰图，可自定义颜色、标签和样式选项。导出为 PNG 或 SVG 格式。',
        },
      ],
    },
  },
  {
    slug: 'grouped-bar-chart-generator',
    faqs: {
      en: [
        {
          question: 'What is a grouped bar chart?',
          answer: 'A grouped bar chart displays multiple data series side by side for each category. It\'s ideal for comparing values across different groups, like sales by product across different regions or quarters.',
        },
        {
          question: 'How do I create a grouped bar chart online?',
          answer: 'Enter your categories and multiple data series. Our tool automatically groups bars together and assigns distinct colors. Customize bar width, spacing, colors, and labels.',
        },
        {
          question: 'What\'s the difference between grouped and stacked bar charts?',
          answer: 'Grouped bars sit side by side for easy comparison of individual values. Stacked bars are placed on top of each other to show totals and part-to-whole relationships.',
        },
      ],
      zh: [
        {
          question: '什么是分组条形图？',
          answer: '分组条形图为每个类别并排显示多个数据系列。非常适合比较不同组之间的值，如不同地区或季度的产品销售额。',
        },
        {
          question: '如何在线创建分组条形图？',
          answer: '输入类别和多个数据系列。我们的工具会自动将条形分组并分配不同颜色。可自定义条形宽度、间距、颜色和标签。',
        },
        {
          question: '分组条形图和堆叠条形图有什么区别？',
          answer: '分组条形并排放置，便于比较单个值。堆叠条形叠放在一起，用于显示总计和部分与整体的关系。',
        },
      ],
    },
  },
  {
    slug: 'stacked-bar-chart-generator',
    faqs: {
      en: [
        {
          question: 'What is a stacked bar chart used for?',
          answer: 'A stacked bar chart shows how different parts contribute to a whole. Each bar is divided into segments representing different categories, making it easy to see both totals and composition.',
        },
        {
          question: 'How do I create a stacked bar chart?',
          answer: 'Enter your categories and multiple data series. Our tool stacks the values automatically with distinct colors for each series. Customize colors, labels, and choose horizontal or vertical orientation.',
        },
        {
          question: 'Should I use stacked or 100% stacked bar charts?',
          answer: 'Use regular stacked bars when absolute values matter. Use 100% stacked bars when you want to compare proportions across categories, as each bar becomes the same height showing percentages.',
        },
      ],
      zh: [
        {
          question: '堆叠条形图用于什么？',
          answer: '堆叠条形图显示不同部分如何构成整体。每个条形被分成代表不同类别的段，便于同时查看总计和组成。',
        },
        {
          question: '如何创建堆叠条形图？',
          answer: '输入类别和多个数据系列。我们的工具会自动堆叠值，并为每个系列分配不同颜色。可自定义颜色、标签，选择水平或垂直方向。',
        },
        {
          question: '应该使用堆叠还是百分比堆叠条形图？',
          answer: '当绝对值重要时使用常规堆叠条形图。当您想比较各类别的比例时使用百分比堆叠条形图，因为每个条形高度相同，显示百分比。',
        },
      ],
    },
  },
  {
    slug: 'grouped-line-chart-generator',
    faqs: {
      en: [
        {
          question: 'What is a grouped line chart?',
          answer: 'A grouped line chart displays multiple data series as separate lines on the same chart. It\'s perfect for comparing trends over time across different categories, products, or regions.',
        },
        {
          question: 'How do I create a multi-line chart online?',
          answer: 'Enter your X-axis values (usually time) and multiple Y-axis data series. Our tool plots each series as a distinct line with different colors. Add legends, customize styles, and export.',
        },
        {
          question: 'How many lines can I add to a grouped line chart?',
          answer: 'While there\'s no strict limit, we recommend 5-7 lines maximum for readability. Too many lines make the chart cluttered and hard to interpret. Use interactive features to highlight specific lines.',
        },
      ],
      zh: [
        {
          question: '什么是分组折线图？',
          answer: '分组折线图在同一图表上将多个数据系列显示为单独的线条。非常适合比较不同类别、产品或地区随时间的趋势。',
        },
        {
          question: '如何在线创建多线图？',
          answer: '输入 X 轴值（通常是时间）和多个 Y 轴数据系列。我们的工具会将每个系列绘制为不同颜色的独立线条。添加图例、自定义样式并导出。',
        },
        {
          question: '分组折线图可以添加多少条线？',
          answer: '虽然没有严格限制，但为了可读性，我们建议最多 5-7 条线。太多线条会使图表杂乱且难以解读。使用交互功能突出显示特定线条。',
        },
      ],
    },
  },
];
