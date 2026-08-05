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
  },
  {
    "slug": "sankey-diagrams-for-conversion-tracking",
    "title": "Sankey diagrams for conversion tracking",
    "description": "Sankey diagrams map flows between stages: where users drop off, where value moves. How to read them, when they beat funnels, and how to make one free.",
    "eyebrow": "Guide",
    "updated": "Updated August 4, 2026",
    "sections": [
      {
        "title": "What a Sankey diagram shows",
        "paragraphs": [
          "A Sankey diagram draws flows as arrows whose width is proportional to quantity. In conversion tracking, each stage is a node and the arrows show how many users moved from one stage to the next — and how many dropped out."
        ]
      },
      {
        "title": "Why it beats a funnel table",
        "paragraphs": [
          "A funnel table shows totals per step but hides the paths between them. A Sankey reveals the actual journeys: how many went A to B directly, how many detoured through C, and where the biggest leaks are."
        ]
      },
      {
        "title": "When to use it",
        "paragraphs": [
          "Use Sankey for multi-path flows: checkout funnels with alternative payment routes, user journeys across pages, or budget allocations across projects. Avoid it for simple linear funnels, where a plain funnel chart is clearer."
        ]
      },
      {
        "title": "How to make one free",
        "paragraphs": [
          "The Sankey generator on U2Tool draws the flow in the browser: define nodes and the amounts between them, and the width of each arrow is computed automatically.",
          "Colors, labels and layout are adjustable; export as PNG or SVG. Everything runs locally, no account needed."
        ]
      }
    ],
    "faqs": [
      {
        "question": "How many stages work best?",
        "answer": "Five to ten stages keep the diagram readable; more than that, group similar steps into one node."
      },
      {
        "question": "Can I show multiple entry points?",
        "answer": "Yes, that is exactly where Sankey shines: each entry path becomes its own arrow into the flow."
      },
      {
        "question": "Is my data uploaded anywhere?",
        "answer": "No. The generator processes everything in your browser."
      }
    ],
    "relatedTools": [
      "sankey-chart-generator",
      "bar-chart-generator",
      "calendar-heatmap-generator"
    ]
  },
  {
    "slug": "how-to-open-ical-files",
    "title": "How to open iCal files",
    "description": "iCal (.ics) files hold calendar events. How to open one on iPhone, Google Calendar and Outlook, plus a free browser tool to read the raw data.",
    "eyebrow": "Guide",
    "updated": "Updated August 4, 2026",
    "sections": [
      {
        "title": "What an iCal file is",
        "paragraphs": [
          "An .ics file stores calendar data in the iCalendar format: events, dates, times and attendees. It is how calendars export and import events — from a booking confirmation to a shared team calendar."
        ]
      },
      {
        "title": "Open it on your phone",
        "paragraphs": [
          "iPhone: open the .ics file and tap Add All to create the events in Calendar. Android: opening the file prompts you to import into Google Calendar or your default calendar app."
        ]
      },
      {
        "title": "Open it on the web",
        "paragraphs": [
          "Google Calendar: click the gear icon, Import & export, then Upload to import the file into a chosen calendar. Outlook on the web: Calendar → Add calendar → Upload from file."
        ]
      },
      {
        "title": "Read the raw data",
        "paragraphs": [
          "If you need to inspect what is actually inside — event titles, times, repeated rules — the iCal parser on U2Tool renders the events as a readable list in your browser, with no upload to a server."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Why will my calendar not import the file?",
        "answer": "The file may be malformed or use an unsupported extension. Check that it starts with BEGIN:VCALENDAR and ends with END:VCALENDAR."
      },
      {
        "question": "Can I convert iCal to another format?",
        "answer": "Most calendars import .ics directly; for contacts you would convert CSV to vCard instead."
      },
      {
        "question": "Is my data uploaded?",
        "answer": "No, the parser processes the file entirely in your browser."
      }
    ],
    "relatedTools": [
      "ical-parser",
      "csv-to-vcard-converter",
      "excel-viewer"
    ]
  },
  {
    "slug": "csv-to-vcard-for-your-contacts",
    "title": "CSV to vCard: move your contacts between apps",
    "description": "Convert a CSV contact list to vCard (.vcf) so you can import it into any phone, Gmail or Outlook. Free browser conversion, no upload.",
    "eyebrow": "Guide",
    "updated": "Updated August 4, 2026",
    "sections": [
      {
        "title": "Why convert CSV to vCard",
        "paragraphs": [
          "CSV files are great for editing contact lists in a spreadsheet, but phones and email apps import contacts as vCards. Converting turns your editable list into a portable .vcf that any device understands."
        ]
      },
      {
        "title": "What your CSV needs",
        "paragraphs": [
          "Column headers for first name, last name, phone and email are enough. The converter maps each row to a card; empty cells are simply skipped, so you do not need to clean every field."
        ]
      },
      {
        "title": "Convert for free in the browser",
        "paragraphs": [
          "The CSV to vCard converter on U2Tool runs entirely in your browser: paste the CSV, check the column mapping, and download a single .vcf containing every contact. Nothing is uploaded."
        ]
      },
      {
        "title": "Import on any device",
        "paragraphs": [
          "Android and iPhone: open the .vcf and confirm the import into contacts. Gmail: Contacts → Import. Outlook: Contacts → Manage → Import from file. The same file works everywhere."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Can one file hold all my contacts?",
        "answer": "Yes, each CSV row becomes a card and the result is a single .vcf with all of them."
      },
      {
        "question": "Do I need exact columns?",
        "answer": "Only name plus phone or email. Extra columns such as company or address are used when present."
      },
      {
        "question": "Is this private?",
        "answer": "Yes, all processing happens locally in your browser; your contacts never leave your device."
      }
    ],
    "relatedTools": [
      "csv-to-vcard-converter",
      "ical-parser",
      "excel-viewer"
    ]
  },
  {
    "slug": "how-to-capitalize-titles-correctly",
    "title": "How to capitalize titles correctly",
    "description": "Title case rules for headlines, book titles and headings: which words get capitalized, which stay lowercase, and a free tool to do it for you.",
    "eyebrow": "Guide",
    "updated": "Updated August 4, 2026",
    "sections": [
      {
        "title": "The basic rule",
        "paragraphs": [
          "In title case, the first and last words are always capitalized, and so are the major words in between: nouns, verbs, adjectives and adverbs. Minor words — articles (a, an, the), short conjunctions (and, or, but) and short prepositions (in, on, at, for) — stay lowercase."
        ]
      },
      {
        "title": "Where styles disagree",
        "paragraphs": [
          "Styles differ on prepositions: APA capitalizes prepositions of four or more letters (from, with, about), while Chicago keeps all prepositions lowercase regardless of length. Pick one style and stay consistent."
        ]
      },
      {
        "title": "Hyphenated words",
        "paragraphs": [
          "In a hyphenated compound, capitalize both parts (State-of-the-Art) in most styles, though the second part of an open or suspended compound can vary. When in doubt, follow the style guide of your publication."
        ]
      },
      {
        "title": "Do it automatically",
        "paragraphs": [
          "The title capitalization tool on U2Tool converts your heading to title case in the browser: paste the text, choose a style, and copy the result. It also handles sentence case, so you can compare both before publishing."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Is every word capitalized?",
        "answer": "No. Articles, short conjunctions and short prepositions stay lowercase unless they start or end the title."
      },
      {
        "question": "Which style should I use?",
        "answer": "Match your audience: academic writing often uses APA, books and magazines use Chicago or AP. Consistency matters more than the choice."
      },
      {
        "question": "What about German and other languages?",
        "answer": "Rules differ by language; the tool supports the common English title case rules, and sentence case for other conventions."
      }
    ],
    "relatedTools": [
      "title-capitalization-tool",
      "word-counter",
      "grammar-checker"
    ]
  },
  {
    "slug": "how-to-write-a-table-of-contents",
    "title": "How to write a table of contents",
    "description": "Structure a clear table of contents: headings, hierarchy and numbering. Why it helps readers and SEO, plus a free generator in the browser.",
    "eyebrow": "Guide",
    "updated": "Updated August 4, 2026",
    "sections": [
      {
        "title": "What a table of contents is for",
        "paragraphs": [
          "A table of contents gives readers a map of the document: they scan the headings, find the section they need and jump straight there. It also tells you whether your structure is balanced — if one section dwarfs the rest, the outline needs work."
        ]
      },
      {
        "title": "Build a clean hierarchy",
        "paragraphs": [
          "Use one level of headings for main sections and a second for subsections; two levels are enough for most documents. Each heading should be a complete phrase that says what the section covers, not a vague label."
        ]
      },
      {
        "title": "Numbering and links",
        "paragraphs": [
          "Numbered lists (1., 1.1, 1.2) work well for long technical documents; unnumbered TOCs feel lighter for articles. In online content, make each entry a link that jumps to the heading — this is what search engines also use to understand structure."
        ]
      },
      {
        "title": "Generate it free",
        "paragraphs": [
          "The table of contents generator on U2Tool builds a linked TOC from your headings in the browser: paste the outline, choose numbering, and copy the result. It works for Markdown and HTML so you can drop it into any page."
        ]
      }
    ],
    "faqs": [
      {
        "question": "How many levels should a TOC have?",
        "answer": "Two levels for most documents, three at most. Deeper structures are hard to scan."
      },
      {
        "question": "Do headings help SEO?",
        "answer": "Yes: clear heading hierarchy helps search engines interpret the page structure and can enable rich results."
      },
      {
        "question": "Should every heading be in the TOC?",
        "answer": "Include levels one and two; skip sub-subsections unless the document is very long."
      }
    ],
    "relatedTools": [
      "table-of-contents-generator",
      "title-capitalization-tool",
      "word-counter"
    ]
  },
  {
    "slug": "sql-index-basics-when-to-add-an-index",
    "title": "SQL index basics: when to add an index",
    "description": "Database indexes speed up queries but cost writes. When they help, when they hurt, and how to check a query plan before adding one.",
    "eyebrow": "Guide",
    "updated": "Updated August 4, 2026",
    "sections": [
      {
        "title": "What an index does",
        "paragraphs": [
          "An index is a sorted copy of one or more columns that lets the database find rows without scanning the whole table. Lookups on indexed columns drop from a full scan to a few page reads — the difference between milliseconds and seconds on large tables."
        ]
      },
      {
        "title": "When an index pays off",
        "paragraphs": [
          "Index columns you filter on frequently (WHERE), join on, or order by. The classic wins are primary keys, foreign keys, and columns in hot queries. A query that runs once a day on 100 rows needs no index; one that runs every request on millions of rows does."
        ]
      },
      {
        "title": "When it hurts",
        "paragraphs": [
          "Every index slows INSERT, UPDATE and DELETE because the index must be kept in sync, and it consumes disk and memory. Indexes on low-selectivity columns (yes/no flags) often do not help. Measure: explain the query, look for full scans, and index only what the plan shows is slow."
        ]
      },
      {
        "title": "Check before you add",
        "paragraphs": [
          "The SQL query optimizer on U2Tool parses EXPLAIN output and highlights full scans and missing indexes in your browser. Paste the plan, see which step dominates, and add an index only where it changes the plan."
        ]
      }
    ],
    "faqs": [
      {
        "question": "How many indexes is too many?",
        "answer": "There is no fixed number. The rule is to index hot query paths and drop unused ones; check each index with your workload, not with a checklist."
      },
      {
        "question": "Do indexes help writes?",
        "answer": "No, they make writes slower. That is why you index read-heavy paths and avoid indexing columns you barely filter on."
      },
      {
        "question": "Can an index make a query slower?",
        "answer": "Rarely, but a poorly chosen index can make the planner pick a worse plan. Always verify with EXPLAIN after adding one."
      }
    ],
    "relatedTools": [
      "sql-query-optimizer",
      "compound-interest-calculator",
      "excel-viewer"
    ]
  }

];
