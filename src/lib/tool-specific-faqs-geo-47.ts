/**
 * GEO 优化工具 FAQ - 第 47 批
 * 图表生成器和开发工具
 */

import type { ToolSpecificFAQ } from './tool-specific-faqs';

export const GEO_TOOL_FAQS_47: ToolSpecificFAQ[] = [
  {
    slug: 'nested-pie-chart-generator',
    faqs: {
      en: [
        {
          question: 'What is a nested pie chart?',
          answer: 'A nested pie chart (or sunburst chart) shows hierarchical data with concentric rings. The inner ring represents top-level categories, and outer rings show subcategories, revealing part-to-whole relationships at multiple levels.',
        },
        {
          question: 'How do I create a nested pie chart?',
          answer: 'Enter your hierarchical data with parent-child relationships. Our tool automatically creates concentric rings with matching colors for related segments. Click segments to drill down into details.',
        },
        {
          question: 'When should I use nested pie vs treemap?',
          answer: 'Use nested pie charts for circular, radial layouts that emphasize hierarchy. Use treemaps when you need to compare sizes more precisely or have many categories that would make a pie chart cluttered.',
        },
      ],
      zh: [
        {
          question: '什么是嵌套饼图？',
          answer: '嵌套饼图（或旭日图）用同心环显示层级数据。内环代表顶级类别，外环显示子类别，在多个层级揭示部分与整体的关系。',
        },
        {
          question: '如何创建嵌套饼图？',
          answer: '输入具有父子关系的层级数据。我们的工具会自动创建同心环，相关段使用匹配的颜色。点击段可深入查看详情。',
        },
        {
          question: '什么时候应该使用嵌套饼图而不是树图？',
          answer: '当需要强调层级的圆形径向布局时使用嵌套饼图。当需要更精确地比较大小或有很多类别会使饼图杂乱时使用树图。',
        },
      ],
    },
  },
  {
    slug: 'pictorial-bar-chart-generator',
    faqs: {
      en: [
        {
          question: 'What is a pictorial bar chart?',
          answer: 'A pictorial bar chart uses icons or images instead of plain bars to represent data. It\'s more engaging and memorable, perfect for infographics, presentations, and reports targeting general audiences.',
        },
        {
          question: 'How do I create a pictorial chart with custom icons?',
          answer: 'Enter your data and choose from our icon library or upload custom SVG icons. Our tool repeats or scales icons to represent values. Customize colors, spacing, and layout direction.',
        },
        {
          question: 'What icons work best for pictorial charts?',
          answer: 'Simple, recognizable icons work best - people for population data, coins for money, trees for environmental data. Avoid complex icons that become unclear when scaled small.',
        },
      ],
      zh: [
        {
          question: '什么是象形条形图？',
          answer: '象形条形图使用图标或图像而不是普通条形来表示数据。更具吸引力和记忆性，非常适合信息图、演示和面向普通受众的报告。',
        },
        {
          question: '如何创建带自定义图标的象形图？',
          answer: '输入数据并从图标库中选择或上传自定义 SVG 图标。我们的工具会重复或缩放图标来表示值。可自定义颜色、间距和布局方向。',
        },
        {
          question: '什么图标最适合象形图？',
          answer: '简单、易识别的图标效果最好 - 人口数据用人形、金钱用硬币、环境数据用树木。避免使用缩小后不清晰的复杂图标。',
        },
      ],
    },
  },
  {
    slug: 'env-parser',
    faqs: {
      en: [
        {
          question: 'What is an ENV parser tool?',
          answer: 'An ENV parser reads and validates .env files used for environment variables in applications. It helps you check syntax, find duplicates, identify missing variables, and convert between different formats.',
        },
        {
          question: 'How do I validate my .env file?',
          answer: 'Paste your .env file content into the tool. It will parse each line, highlight syntax errors, show duplicate keys, and validate the format. You can also compare against a template file.',
        },
        {
          question: 'Can I convert .env to JSON or other formats?',
          answer: 'Yes, our tool can convert .env files to JSON, YAML, or shell export format. This is useful for different deployment environments or configuration management systems.',
        },
      ],
      zh: [
        {
          question: '什么是 ENV 解析器工具？',
          answer: 'ENV 解析器读取和验证应用程序中用于环境变量的 .env 文件。它帮助您检查语法、查找重复项、识别缺失变量，并在不同格式之间转换。',
        },
        {
          question: '如何验证我的 .env 文件？',
          answer: '将 .env 文件内容粘贴到工具中。它会解析每一行，高亮语法错误，显示重复键，并验证格式。您还可以与模板文件进行比较。',
        },
        {
          question: '可以将 .env 转换为 JSON 或其他格式吗？',
          answer: '是的，我们的工具可以将 .env 文件转换为 JSON、YAML 或 shell 导出格式。这对于不同的部署环境或配置管理系统很有用。',
        },
      ],
    },
  },
  {
    slug: 'json-schema-generator',
    faqs: {
      en: [
        {
          question: 'What is a JSON Schema generator?',
          answer: 'A JSON Schema generator creates a schema definition from sample JSON data. The schema describes the structure, data types, and constraints of your JSON, useful for validation and documentation.',
        },
        {
          question: 'How do I generate a JSON Schema from my data?',
          answer: 'Paste your sample JSON data into the tool. It analyzes the structure and generates a JSON Schema with inferred types, required fields, and nested object definitions. Customize the output as needed.',
        },
        {
          question: 'What JSON Schema draft version does this tool support?',
          answer: 'Our tool supports JSON Schema Draft-07 (most common), Draft-06, and Draft-04. You can select your preferred version and the output will conform to that specification.',
        },
      ],
      zh: [
        {
          question: '什么是 JSON Schema 生成器？',
          answer: 'JSON Schema 生成器从示例 JSON 数据创建模式定义。模式描述 JSON 的结构、数据类型和约束，用于验证和文档。',
        },
        {
          question: '如何从数据生成 JSON Schema？',
          answer: '将示例 JSON 数据粘贴到工具中。它会分析结构并生成带有推断类型、必需字段和嵌套对象定义的 JSON Schema。根据需要自定义输出。',
        },
        {
          question: '这个工具支持哪个 JSON Schema 草案版本？',
          answer: '我们的工具支持 JSON Schema Draft-07（最常用）、Draft-06 和 Draft-04。您可以选择首选版本，输出将符合该规范。',
        },
      ],
    },
  },
  {
    slug: 'time-calculator',
    faqs: {
      en: [
        {
          question: 'What can I calculate with the time calculator?',
          answer: 'Calculate time differences between two times, add or subtract hours/minutes/seconds from a time, convert between time formats, and calculate total duration from multiple time entries.',
        },
        {
          question: 'How do I calculate hours between two times?',
          answer: 'Enter the start time and end time. The tool calculates the difference in hours, minutes, and seconds. It handles overnight calculations and can account for breaks.',
        },
        {
          question: 'Can I calculate time across different time zones?',
          answer: 'Yes, select the time zones for each time entry. The tool converts and calculates the difference accounting for time zone offsets, including daylight saving time adjustments.',
        },
      ],
      zh: [
        {
          question: '时间计算器可以计算什么？',
          answer: '计算两个时间之间的差异、从时间中加减小时/分钟/秒、在时间格式之间转换，以及从多个时间条目计算总持续时间。',
        },
        {
          question: '如何计算两个时间之间的小时数？',
          answer: '输入开始时间和结束时间。工具会计算小时、分钟和秒的差异。它处理跨夜计算，并可以考虑休息时间。',
        },
        {
          question: '可以计算不同时区的时间吗？',
          answer: '是的，为每个时间条目选择时区。工具会转换并计算考虑时区偏移的差异，包括夏令时调整。',
        },
      ],
    },
  },
  {
    slug: 'batch-timestamp-converter',
    faqs: {
      en: [
        {
          question: 'What is a batch timestamp converter?',
          answer: 'A batch timestamp converter processes multiple timestamps at once, converting between Unix timestamps, ISO 8601, and human-readable formats. Perfect for processing log files or database exports.',
        },
        {
          question: 'How do I convert multiple timestamps at once?',
          answer: 'Paste your timestamps (one per line or comma-separated). Select the input and output formats. The tool converts all timestamps instantly and lets you copy or download the results.',
        },
        {
          question: 'What timestamp formats are supported?',
          answer: 'We support Unix timestamps (seconds and milliseconds), ISO 8601, RFC 2822, and custom formats. You can also specify the output time zone for all conversions.',
        },
      ],
      zh: [
        {
          question: '什么是批量时间戳转换器？',
          answer: '批量时间戳转换器一次处理多个时间戳，在 Unix 时间戳、ISO 8601 和人类可读格式之间转换。非常适合处理日志文件或数据库导出。',
        },
        {
          question: '如何一次转换多个时间戳？',
          answer: '粘贴时间戳（每行一个或逗号分隔）。选择输入和输出格式。工具会立即转换所有时间戳，并让您复制或下载结果。',
        },
        {
          question: '支持哪些时间戳格式？',
          answer: '我们支持 Unix 时间戳（秒和毫秒）、ISO 8601、RFC 2822 和自定义格式。您还可以为所有转换指定输出时区。',
        },
      ],
    },
  },
  {
    slug: 'regex-visualizer',
    faqs: {
      en: [
        {
          question: 'What is a regex visualizer?',
          answer: 'A regex visualizer creates a visual diagram of your regular expression, showing how patterns match. It helps you understand complex regex by displaying groups, quantifiers, and alternatives graphically.',
        },
        {
          question: 'How do I visualize my regular expression?',
          answer: 'Enter your regex pattern and the tool generates an interactive railroad diagram. Hover over elements to see explanations. Test against sample text to see matches highlighted.',
        },
        {
          question: 'Can I debug why my regex isn\'t matching?',
          answer: 'Yes, the visualizer shows step-by-step matching, highlighting where the pattern fails. This helps identify issues with greedy quantifiers, missing escapes, or incorrect grouping.',
        },
      ],
      zh: [
        {
          question: '什么是正则表达式可视化器？',
          answer: '正则表达式可视化器为您的正则表达式创建可视化图表，显示模式如何匹配。它通过图形显示组、量词和替代项，帮助您理解复杂的正则表达式。',
        },
        {
          question: '如何可视化我的正则表达式？',
          answer: '输入正则表达式模式，工具会生成交互式铁路图。悬停在元素上查看解释。针对示例文本测试以查看高亮的匹配项。',
        },
        {
          question: '可以调试为什么我的正则表达式不匹配吗？',
          answer: '是的，可视化器显示逐步匹配，高亮模式失败的位置。这有助于识别贪婪量词、缺失转义或不正确分组的问题。',
        },
      ],
    },
  },
  {
    slug: 'crontab-calendar',
    faqs: {
      en: [
        {
          question: 'What is a crontab calendar?',
          answer: 'A crontab calendar visualizes when your cron jobs will run by displaying scheduled executions on a calendar view. It helps you understand complex cron expressions and avoid scheduling conflicts.',
        },
        {
          question: 'How do I see when my cron job will run?',
          answer: 'Enter your cron expression (e.g., "0 9 * * 1-5"). The calendar shows all scheduled runs for the selected time period. Hover over dates to see exact execution times.',
        },
        {
          question: 'Can I visualize multiple cron jobs together?',
          answer: 'Yes, add multiple cron expressions with different colors. The calendar displays all jobs, making it easy to spot overlaps or gaps in your scheduling.',
        },
      ],
      zh: [
        {
          question: '什么是 crontab 日历？',
          answer: 'crontab 日历通过在日历视图上显示计划执行来可视化 cron 作业何时运行。它帮助您理解复杂的 cron 表达式并避免调度冲突。',
        },
        {
          question: '如何查看我的 cron 作业何时运行？',
          answer: '输入 cron 表达式（例如 "0 9 * * 1-5"）。日历显示所选时间段内的所有计划运行。悬停在日期上查看确切的执行时间。',
        },
        {
          question: '可以一起可视化多个 cron 作业吗？',
          answer: '是的，添加多个不同颜色的 cron 表达式。日历显示所有作业，便于发现调度中的重叠或间隙。',
        },
      ],
    },
  },
  {
    slug: 'fake-data-generator',
    faqs: {
      en: [
        {
          question: 'What is a fake data generator?',
          answer: 'A fake data generator creates realistic but fictional data for testing, development, and demos. Generate names, addresses, emails, phone numbers, and more without using real personal information.',
        },
        {
          question: 'How do I generate test data for my application?',
          answer: 'Select the data types you need (name, email, address, etc.), specify the quantity, and choose the output format (JSON, CSV, SQL). The tool generates realistic data instantly.',
        },
        {
          question: 'Can I generate data in different languages/locales?',
          answer: 'Yes, select from multiple locales to generate culturally appropriate names, addresses, and phone formats. This is essential for testing internationalized applications.',
        },
      ],
      zh: [
        {
          question: '什么是假数据生成器？',
          answer: '假数据生成器为测试、开发和演示创建逼真但虚构的数据。生成姓名、地址、电子邮件、电话号码等，无需使用真实个人信息。',
        },
        {
          question: '如何为我的应用程序生成测试数据？',
          answer: '选择所需的数据类型（姓名、电子邮件、地址等），指定数量，选择输出格式（JSON、CSV、SQL）。工具会立即生成逼真的数据。',
        },
        {
          question: '可以生成不同语言/地区的数据吗？',
          answer: '是的，从多个地区中选择以生成文化上适当的姓名、地址和电话格式。这对于测试国际化应用程序至关重要。',
        },
      ],
    },
  },
  {
    slug: 'image-collage',
    faqs: {
      en: [
        {
          question: 'How do I create a photo collage online?',
          answer: 'Upload multiple images, choose a layout template or create a custom grid. Drag and drop to arrange photos, adjust sizes, add borders and spacing. Download your collage in high resolution.',
        },
        {
          question: 'What collage layouts are available?',
          answer: 'Choose from grid layouts (2x2, 3x3, etc.), mosaic patterns, freeform arrangements, and themed templates. You can also create custom layouts by specifying rows and columns.',
        },
        {
          question: 'Can I add text and decorations to my collage?',
          answer: 'Yes, add text overlays with custom fonts and colors, stickers, borders, and backgrounds. Adjust image filters and effects for a cohesive look across all photos.',
        },
      ],
      zh: [
        {
          question: '如何在线创建照片拼贴？',
          answer: '上传多张图片，选择布局模板或创建自定义网格。拖放排列照片，调整大小，添加边框和间距。以高分辨率下载拼贴。',
        },
        {
          question: '有哪些拼贴布局可用？',
          answer: '可选择网格布局（2x2、3x3 等）、马赛克图案、自由排列和主题模板。您还可以通过指定行和列创建自定义布局。',
        },
        {
          question: '可以在拼贴中添加文字和装饰吗？',
          answer: '是的，添加带有自定义字体和颜色的文字叠加、贴纸、边框和背景。调整图像滤镜和效果，使所有照片具有统一的外观。',
        },
      ],
    },
  },
];
