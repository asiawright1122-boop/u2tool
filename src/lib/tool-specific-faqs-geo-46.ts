/**
 * GEO 优化工具 FAQ - 第 46 批
 * 图表生成器工具 (Chart Generators Part 3)
 */

import type { ToolSpecificFAQ } from './tool-specific-faqs';

export const GEO_TOOL_FAQS_46: ToolSpecificFAQ[] = [
  {
    slug: 'step-line-chart-generator',
    faqs: {
      en: [
        {
          question: 'What is a step line chart?',
          answer: 'A step line chart connects data points with horizontal and vertical lines instead of diagonal lines. It\'s ideal for showing data that changes at discrete intervals, like pricing tiers, inventory levels, or status changes.',
        },
        {
          question: 'When should I use a step chart instead of a regular line chart?',
          answer: 'Use step charts when values remain constant between data points and change abruptly. Examples include subscription prices, stock quantities, or any stepped/tiered data where interpolation doesn\'t make sense.',
        },
        {
          question: 'Can I customize the step direction?',
          answer: 'Yes, you can choose step-before (vertical then horizontal), step-after (horizontal then vertical), or step-middle. Each style affects how the transition between points is displayed.',
        },
      ],
      zh: [
        {
          question: '什么是阶梯折线图？',
          answer: '阶梯折线图用水平和垂直线而不是对角线连接数据点。非常适合显示在离散间隔变化的数据，如定价层级、库存水平或状态变化。',
        },
        {
          question: '什么时候应该使用阶梯图而不是普通折线图？',
          answer: '当值在数据点之间保持恒定并突然变化时使用阶梯图。例如订阅价格、库存数量或任何阶梯/分层数据，其中插值没有意义。',
        },
        {
          question: '可以自定义阶梯方向吗？',
          answer: '是的，您可以选择前置阶梯（先垂直后水平）、后置阶梯（先水平后垂直）或中间阶梯。每种样式都会影响点之间过渡的显示方式。',
        },
      ],
    },
  },
  {
    slug: 'waterfall-chart-generator',
    faqs: {
      en: [
        {
          question: 'What is a waterfall chart used for?',
          answer: 'A waterfall chart shows how an initial value is affected by positive and negative changes. It\'s commonly used in finance to show profit/loss breakdowns, budget analysis, or inventory changes.',
        },
        {
          question: 'How do I create a waterfall chart online?',
          answer: 'Enter your starting value and subsequent changes (positive or negative). Our tool automatically colors increases and decreases differently and shows running totals with connecting lines.',
        },
        {
          question: 'Can I customize colors for positive and negative values?',
          answer: 'Yes, you can set custom colors for increases (typically green), decreases (typically red), and totals (typically blue). You can also add subtotals at any point in the chart.',
        },
      ],
      zh: [
        {
          question: '瀑布图用于什么？',
          answer: '瀑布图显示初始值如何受正负变化影响。常用于财务中显示利润/亏损分解、预算分析或库存变化。',
        },
        {
          question: '如何在线创建瀑布图？',
          answer: '输入起始值和后续变化（正或负）。我们的工具会自动用不同颜色标记增加和减少，并用连接线显示累计总计。',
        },
        {
          question: '可以自定义正负值的颜色吗？',
          answer: '是的，您可以为增加（通常为绿色）、减少（通常为红色）和总计（通常为蓝色）设置自定义颜色。还可以在图表的任何位置添加小计。',
        },
      ],
    },
  },
  {
    slug: 'stacked-area-chart-generator',
    faqs: {
      en: [
        {
          question: 'What is a stacked area chart?',
          answer: 'A stacked area chart shows how multiple data series contribute to a total over time. Areas are stacked on top of each other, making it easy to see both individual trends and cumulative totals.',
        },
        {
          question: 'How do I create a stacked area chart?',
          answer: 'Enter your time series data with multiple categories. Our tool stacks the areas automatically with smooth curves and distinct colors. Customize transparency, colors, and add interactive tooltips.',
        },
        {
          question: 'What\'s the difference between stacked and overlapping area charts?',
          answer: 'Stacked area charts add values together (areas don\'t overlap). Overlapping area charts show each series from the baseline, useful when you want to compare shapes rather than cumulative values.',
        },
      ],
      zh: [
        {
          question: '什么是堆叠面积图？',
          answer: '堆叠面积图显示多个数据系列如何随时间构成总计。面积相互堆叠，便于同时查看单个趋势和累计总计。',
        },
        {
          question: '如何创建堆叠面积图？',
          answer: '输入包含多个类别的时间序列数据。我们的工具会自动堆叠面积，使用平滑曲线和不同颜色。可自定义透明度、颜色并添加交互式提示。',
        },
        {
          question: '堆叠面积图和重叠面积图有什么区别？',
          answer: '堆叠面积图将值相加（面积不重叠）。重叠面积图从基线显示每个系列，当您想比较形状而不是累计值时很有用。',
        },
      ],
    },
  },
  {
    slug: 'positive-negative-bar-chart-generator',
    faqs: {
      en: [
        {
          question: 'What is a positive-negative bar chart?',
          answer: 'A positive-negative bar chart (or diverging bar chart) displays bars extending in both directions from a central axis. It\'s perfect for showing gains vs losses, sentiment analysis, or any data with positive and negative values.',
        },
        {
          question: 'How do I create a diverging bar chart?',
          answer: 'Enter your categories and values (positive and negative). Our tool automatically positions bars on either side of the zero line with distinct colors for positive and negative values.',
        },
        {
          question: 'Can I use this for survey results or ratings?',
          answer: 'Yes, it\'s excellent for Likert scale data, showing agree/disagree responses, or any bipolar data. You can customize the center point and colors for each direction.',
        },
      ],
      zh: [
        {
          question: '什么是正负条形图？',
          answer: '正负条形图（或发散条形图）显示从中心轴向两个方向延伸的条形。非常适合显示收益与损失、情感分析或任何具有正负值的数据。',
        },
        {
          question: '如何创建发散条形图？',
          answer: '输入类别和值（正和负）。我们的工具会自动将条形放置在零线两侧，并为正负值使用不同颜色。',
        },
        {
          question: '可以用于调查结果或评分吗？',
          answer: '是的，非常适合李克特量表数据、显示同意/不同意回复或任何双极数据。您可以自定义中心点和每个方向的颜色。',
        },
      ],
    },
  },
  {
    slug: 'percentage-stacked-bar-chart-generator',
    faqs: {
      en: [
        {
          question: 'What is a 100% stacked bar chart?',
          answer: 'A 100% stacked bar chart shows the percentage composition of each category. All bars have the same height (100%), making it easy to compare proportions across different groups.',
        },
        {
          question: 'When should I use percentage stacked bars?',
          answer: 'Use them when comparing proportions is more important than absolute values. Great for market share analysis, demographic breakdowns, or any comparison where relative sizes matter.',
        },
        {
          question: 'How do I create a percentage stacked bar chart?',
          answer: 'Enter your raw values - our tool automatically calculates percentages and creates normalized bars. Each segment shows its percentage, and you can customize colors and labels.',
        },
      ],
      zh: [
        {
          question: '什么是百分比堆叠条形图？',
          answer: '百分比堆叠条形图显示每个类别的百分比组成。所有条形高度相同（100%），便于比较不同组之间的比例。',
        },
        {
          question: '什么时候应该使用百分比堆叠条形图？',
          answer: '当比较比例比绝对值更重要时使用。非常适合市场份额分析、人口统计细分或任何相对大小重要的比较。',
        },
        {
          question: '如何创建百分比堆叠条形图？',
          answer: '输入原始值 - 我们的工具会自动计算百分比并创建标准化条形。每个段显示其百分比，您可以自定义颜色和标签。',
        },
      ],
    },
  },
  {
    slug: 'mixed-chart-generator',
    faqs: {
      en: [
        {
          question: 'What is a mixed or combo chart?',
          answer: 'A mixed chart combines different chart types (like bars and lines) in one visualization. It\'s useful for showing related data with different scales or emphasizing different aspects of your data.',
        },
        {
          question: 'How do I create a bar and line combo chart?',
          answer: 'Enter your data and select which series should be bars and which should be lines. Our tool supports dual Y-axes for data with different scales, like revenue (bars) and growth rate (line).',
        },
        {
          question: 'What chart type combinations work best?',
          answer: 'Common combinations include bar+line (volume and trend), area+line (cumulative and rate), and bar+scatter (categories and outliers). Avoid combining too many types as it can confuse readers.',
        },
      ],
      zh: [
        {
          question: '什么是混合图或组合图？',
          answer: '混合图在一个可视化中组合不同的图表类型（如条形和折线）。用于显示具有不同比例的相关数据或强调数据的不同方面。',
        },
        {
          question: '如何创建条形和折线组合图？',
          answer: '输入数据并选择哪些系列应为条形，哪些应为折线。我们的工具支持双 Y 轴，用于不同比例的数据，如收入（条形）和增长率（折线）。',
        },
        {
          question: '哪些图表类型组合效果最好？',
          answer: '常见组合包括条形+折线（数量和趋势）、面积+折线（累计和比率）和条形+散点（类别和异常值）。避免组合太多类型，因为会让读者困惑。',
        },
      ],
    },
  },
  {
    slug: 'ring-progress-chart-generator',
    faqs: {
      en: [
        {
          question: 'What is a ring progress chart?',
          answer: 'A ring progress chart (or radial progress bar) shows completion percentage as a circular arc. It\'s commonly used in dashboards, fitness apps, and goal tracking to display progress toward a target.',
        },
        {
          question: 'How do I create a ring progress indicator?',
          answer: 'Enter your current value and target value. Our tool calculates the percentage and generates a beautiful ring chart. Customize colors, thickness, animation, and add center text.',
        },
        {
          question: 'Can I create multiple ring progress charts?',
          answer: 'Yes, you can create multiple concentric rings to show different metrics, or arrange separate rings in a grid. Great for comparing progress across different goals or KPIs.',
        },
      ],
      zh: [
        {
          question: '什么是环形进度图？',
          answer: '环形进度图（或径向进度条）以圆弧形式显示完成百分比。常用于仪表板、健身应用和目标跟踪，显示朝目标的进度。',
        },
        {
          question: '如何创建环形进度指示器？',
          answer: '输入当前值和目标值。我们的工具会计算百分比并生成美观的环形图。可自定义颜色、粗细、动画并添加中心文本。',
        },
        {
          question: '可以创建多个环形进度图吗？',
          answer: '是的，您可以创建多个同心环来显示不同指标，或在网格中排列单独的环。非常适合比较不同目标或 KPI 的进度。',
        },
      ],
    },
  },
  {
    slug: 'liquid-fill-chart-generator',
    faqs: {
      en: [
        {
          question: 'What is a liquid fill chart?',
          answer: 'A liquid fill chart shows percentage values with an animated liquid wave effect inside a container (usually circular). It\'s visually engaging for displaying single metrics like completion rate or capacity.',
        },
        {
          question: 'How do I create a liquid fill gauge?',
          answer: 'Enter your percentage value (0-100). Our tool generates an animated liquid fill chart with customizable wave speed, colors, and container shape. Perfect for dashboards and presentations.',
        },
        {
          question: 'Can I customize the liquid animation?',
          answer: 'Yes, you can adjust wave amplitude, speed, and direction. You can also change the liquid color, add gradients, and customize the container outline and background.',
        },
      ],
      zh: [
        {
          question: '什么是水球图？',
          answer: '水球图在容器（通常是圆形）内用动画液体波浪效果显示百分比值。用于显示完成率或容量等单一指标时视觉效果很吸引人。',
        },
        {
          question: '如何创建水球仪表？',
          answer: '输入百分比值（0-100）。我们的工具会生成带有可自定义波浪速度、颜色和容器形状的动画水球图。非常适合仪表板和演示。',
        },
        {
          question: '可以自定义液体动画吗？',
          answer: '是的，您可以调整波浪振幅、速度和方向。还可以更改液体颜色、添加渐变，并自定义容器轮廓和背景。',
        },
      ],
    },
  },
  {
    slug: 'multi-ring-chart-generator',
    faqs: {
      en: [
        {
          question: 'What is a multi-ring chart?',
          answer: 'A multi-ring chart displays multiple metrics as concentric rings, each showing a different value or category. It\'s effective for comparing several related percentages or progress indicators in one compact visualization.',
        },
        {
          question: 'How do I create a multi-ring progress chart?',
          answer: 'Enter multiple values with labels. Our tool creates concentric rings with distinct colors for each metric. Customize ring thickness, spacing, colors, and add a legend.',
        },
        {
          question: 'What\'s the best use case for multi-ring charts?',
          answer: 'Use them for comparing related metrics like department budgets, skill levels, or goal progress. They work best with 3-5 rings; more can become hard to read.',
        },
      ],
      zh: [
        {
          question: '什么是多环图？',
          answer: '多环图将多个指标显示为同心环，每个环显示不同的值或类别。在一个紧凑的可视化中比较多个相关百分比或进度指标非常有效。',
        },
        {
          question: '如何创建多环进度图？',
          answer: '输入多个带标签的值。我们的工具会为每个指标创建不同颜色的同心环。可自定义环的粗细、间距、颜色并添加图例。',
        },
        {
          question: '多环图的最佳使用场景是什么？',
          answer: '用于比较相关指标，如部门预算、技能水平或目标进度。3-5 个环效果最好；更多会变得难以阅读。',
        },
      ],
    },
  },
  {
    slug: 'half-doughnut-chart-generator',
    faqs: {
      en: [
        {
          question: 'What is a half doughnut chart?',
          answer: 'A half doughnut (or semi-circle) chart is a gauge-style visualization showing a value within a range. It\'s commonly used for speedometers, satisfaction scores, or any metric with a defined minimum and maximum.',
        },
        {
          question: 'How do I create a half doughnut gauge?',
          answer: 'Enter your value and the range (min/max). Our tool creates a semi-circular gauge with customizable colors, needle position, and scale markers. Add labels and thresholds for context.',
        },
        {
          question: 'Can I add color zones to the gauge?',
          answer: 'Yes, you can define color zones (like red/yellow/green) to indicate different ranges. This is useful for showing whether a value is in a good, warning, or critical range.',
        },
      ],
      zh: [
        {
          question: '什么是半环图？',
          answer: '半环图（或半圆图）是一种仪表式可视化，显示范围内的值。常用于速度计、满意度分数或任何具有定义最小和最大值的指标。',
        },
        {
          question: '如何创建半环仪表？',
          answer: '输入值和范围（最小/最大）。我们的工具会创建带有可自定义颜色、指针位置和刻度标记的半圆仪表。添加标签和阈值以提供上下文。',
        },
        {
          question: '可以在仪表上添加颜色区域吗？',
          answer: '是的，您可以定义颜色区域（如红/黄/绿）来指示不同范围。这对于显示值是否在良好、警告或危险范围内很有用。',
        },
      ],
    },
  },
];
