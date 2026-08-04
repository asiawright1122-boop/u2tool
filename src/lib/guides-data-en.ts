import type { Guide } from './guides-types';

export const guidesEn: Guide[] = [
  {
    slug: 'json-to-excel-3-ways',
    title: 'JSON to Excel: 3 ways to convert',
    description: 'Convert JSON to Excel three ways: an online converter, a quick script, and a manual spreadsheet approach. With trade-offs for each.',
    eyebrow: 'Practical guide',
    updated: 'Updated August 4, 2026',
    sections: [
      {
        title: 'Way 1: online converter (fastest)',
        paragraphs: [
          'Paste your JSON into a converter, review the auto-detected columns, and download a spreadsheet-compatible file. This is the fastest path when the data comes from an API and you need a table in minutes.',
          'The online converter flattens nested fields into columns and runs locally in the browser, so your data never leaves your device.',
        ],
      },
      {
        title: 'Way 2: a small script (repeatable)',
        paragraphs: [
          'If you convert the same feed regularly, a short script beats a web tool: read the JSON, normalize the rows, and write a CSV or XLSX. It is repeatable, versionable, and easy to schedule.',
          'The trade-off is setup time and maintenance; choose this only when the pipeline is stable.',
        ],
      },
      {
        title: 'Way 3: manual spreadsheet mapping',
        paragraphs: [
          'For one-off data with messy nesting, paste the JSON into a spreadsheet tool that imports JSON directly, then adjust columns by hand. Fine for exploration, slow for everything else.',
        ],
      },
      {
        title: 'Which one should you pick?',
        paragraphs: [
          'One-off or irregular data: use the online converter. Recurring pipeline: write a script. Exploring unknown structures: import into a spreadsheet and iterate. For related formats, an Excel viewer and a JSON converter cover the round trip.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does the online converter upload my data?',
        answer: 'No. The conversion runs entirely in your browser.',
      },
      {
        question: 'How are nested objects handled?',
        answer: 'Nested fields are flattened into separate columns; review the result before downloading.',
      },
      {
        question: 'Can I open the result in Excel?',
        answer: 'Yes, the output is a spreadsheet-compatible file you can open and edit directly.',
      },
    ],
    relatedTools: ['excel-to-csv', 'excel-viewer', 'typescript-to-json'],
  },
  {
    slug: 'gantt-chart-vs-timeline',
    title: 'Gantt chart vs timeline: which to use',
    description: 'Gantt charts manage tasks, dates and dependencies; timelines communicate events. A practical comparison with examples and when to pick each.',
    eyebrow: 'Practical guide',
    updated: 'Updated August 4, 2026',
    sections: [
      {
        title: 'What each one does',
        paragraphs: [
          'A Gantt chart shows tasks as bars on a calendar: each bar has a start, a duration, and can link to other tasks through dependencies. It is a planning tool: it answers "what, by when, and in what order".',
          'A timeline (or timeline chart) places events on a single axis. It is a communication tool: it answers "when did things happen", without durations or dependencies.',
        ],
      },
      {
        title: 'Choose Gantt when…',
        paragraphs: [
          '…you are running a project with several people, concrete dates, and dependencies: a launch, a campaign, a delivery. You need to track progress, spot the critical path, and manage delays.',
        ],
      },
      {
        title: 'Choose timeline when…',
        paragraphs: [
          '…you are presenting a story: a product history, a roadmap for an audience, a sequence of milestones. The goal is clarity and visual impact, not task management.',
        ],
      },
      {
        title: 'Using both',
        paragraphs: [
          'Teams often use both: a timeline to communicate the plan outward and a Gantt chart to execute it internally. If you only need one, match the tool to the question you are answering.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can I turn a Gantt chart into a timeline?',
        answer: 'Not automatically in most tools, but the same underlying dates can be re-rendered as a timeline for presentations.',
      },
      {
        question: 'Which is easier for a client to read?',
        answer: 'Usually the timeline: no dependencies to explain. Use it for external communication and the Gantt for internal tracking.',
      },
      {
        question: 'Do both run locally?',
        answer: 'Yes, the online generators process everything in the browser with no upload and no account.',
      },
    ],
    relatedTools: ['gantt-chart-generator', 'timeline-chart-generator', 'waterfall-chart-generator'],
  },
  {
    slug: 'sql-explain-for-beginners',
    title: 'SQL EXPLAIN explained for beginners',
    description: 'Learn to read SQL EXPLAIN output: what the rows mean, how to spot a full table scan, and how to test queries locally without a database.',
    eyebrow: 'Practical guide',
    updated: 'Updated August 4, 2026',
    sections: [
      {
        title: 'Why EXPLAIN matters',
        paragraphs: [
          'When a query is slow, EXPLAIN shows how the database plans to execute it: which indexes it uses, how it joins tables, and how many rows it expects. That is the fastest way to know whether a query is healthy or needs an index.',
        ],
      },
      {
        title: 'Reading the output',
        paragraphs: [
          'The most important columns are the access type and the estimated rows. A full table scan on a large table is usually the first thing to fix, often by adding an index on the filtered column.',
          'Sequential steps with small row estimates are fine. Sudden jumps in estimated rows are where you should look next.',
        ],
      },
      {
        title: 'Practice without a database',
        paragraphs: [
          'You can paste EXPLAIN output into a local analyzer that formats it, highlights suspicious access patterns, and suggests index candidates, without connecting to a database or executing the query.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Do I need to run the query to get EXPLAIN?',
        answer: 'EXPLAIN estimates the plan without executing the full query in most databases; it is safe to run in development.',
      },
      {
        question: 'What is a full table scan?',
        answer: 'The database reads every row to find matches. It is fine for small tables and a warning sign for large ones.',
      },
      {
        question: 'Can I analyze EXPLAIN output locally?',
        answer: 'Yes, paste the output into an analyzer and it will format and flag issues in your browser.',
      },
    ],
    relatedTools: ['sql-query-optimizer', 'database-backup-scheduler', 'excel-viewer'],
  },
  {
    slug: 'what-is-a-sankey-diagram',
    title: 'What is a Sankey diagram (with real examples)',
    description: 'Sankey diagrams visualize flows between nodes: energy, money, traffic, users. How to read them and create one online with real examples.',
    eyebrow: 'Practical guide',
    updated: 'Updated August 4, 2026',
    sections: [
      {
        title: 'The idea behind Sankey diagrams',
        paragraphs: [
          'A Sankey diagram shows how a quantity flows from sources to destinations. The width of each link is proportional to the value, so the eye reads volume at a glance.',
          'Classic examples: energy flows from fuel to end use, money from revenue to cost categories, users from acquisition channels to conversion, traffic between website pages.',
        ],
      },
      {
        title: 'How to read one',
        paragraphs: [
          'Start at the left: the sources. Follow the bands to the right: each band is a flow, and its width is the value. Where bands split or merge, you can see how a share of a source lands in each destination.',
          'The key question is always "where does the volume go", which is exactly what a table of totals hides.',
        ],
      },
      {
        title: 'Creating one online',
        paragraphs: [
          'A Sankey generator takes a list of source, target, and value triples and lays out the diagram automatically. You customize colors and labels and export the result as an image or data, all locally in the browser.',
        ],
      },
    ],
    faqs: [
      {
        question: 'When is a Sankey better than a stacked bar?',
        answer: 'When you need to show paths, not just totals: which share of a source ends up in which destination. Stacked bars show composition; Sankey shows flow.',
      },
      {
        question: 'What data format does the generator take?',
        answer: 'A simple list of source, target, and value for each flow.',
      },
      {
        question: 'Can I export the diagram?',
        answer: 'Yes, as an image (PNG/SVG) or as the underlying data, with all processing done locally.',
      },
    ],
    relatedTools: ['sankey-chart-generator', 'nested-pie-chart-generator', 'tree-chart-generator'],
  },

  {
    "slug": "nested-pie-charts-explained",
    "title": "Nested pie charts explained: when and how to use them",
    "description": "Nested pie charts (multi-level donuts) show part-to-whole across two levels. When they help, when they confuse, and how to make one free in your browser.",
    "eyebrow": "Guide",
    "updated": "Updated August 4, 2026",
    "sections": [
      {
        "title": "What a nested pie chart is",
        "paragraphs": [
          "A nested pie chart places two or more rings around the same center. The inner ring shows the first level of a breakdown, and the outer ring splits each inner segment further. The classic example is market share by region (inner) and by product within each region (outer)."
        ]
      },
      {
        "title": "When they work",
        "paragraphs": [
          "Use nested pies when you need part-to-whole at two levels and the top level has at most five to seven segments. They are effective in dashboards where viewers already know the metric, because the shape communicates hierarchy at a glance."
        ]
      },
      {
        "title": "When they fail",
        "paragraphs": [
          "Avoid them when the outer ring has many tiny segments: thin slices become unreadable and labels overlap. For precise comparisons across levels, a treemap or a grouped bar chart is often clearer. If you only need one level, a simple pie or donut is better."
        ]
      },
      {
        "title": "How to make one free",
        "paragraphs": [
          "The nested pie generator on U2Tool builds multi-ring charts in the browser: define the two-level breakdown, pick colors, and export as PNG or SVG. Processing stays local, so no data leaves your machine."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Is a nested pie the same as a donut?",
        "answer": "A donut is a single ring with a hole; a nested pie stacks multiple rings to show two levels of a hierarchy."
      },
      {
        "question": "What is the maximum sensible size?",
        "answer": "Keep the outer ring to roughly 10-15 segments; beyond that slices get too thin to read."
      },
      {
        "question": "Can I export the chart?",
        "answer": "Yes, as PNG or SVG, and the data structure can be saved too."
      }
    ],
    "relatedTools": [
      "nested-pie-chart-generator",
      "sankey-chart-generator",
      "tree-chart-generator"
    ]
  }

];
