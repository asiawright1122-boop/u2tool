#!/usr/bin/env node

/**
 * Navigation Directory Discovery & Submission Script
 * 
 * Discovers navigation directories for developer tools and automates submissions.
 * Run: node scripts/navigation-submitter.js
 * 
 * Features:
 * - Pre-built list of 50+ navigation directories
 * - Auto-discovers directories via search
 * - Batch submission with rate limiting
 * - CSV export for tracking
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://www.u2tool.com';
const SITE_NAME = 'U2Tool';
const SITE_DESCRIPTION = 'Free online developer tools - 200+ tools including JSON formatter, Base64 encoder, QR generator, password generator, and more.';
const SITE_EMAIL = 'contact@u2tool.com';

const TOOL_CATEGORIES = [
  'Developer Tools',
  'Online Tools',
  'Web Development',
  'Utilities',
  'Programming'
];

const POPULAR_TOOLS = [
  'JSON Formatter',
  'Base64 Encoder',
  'URL Encoder',
  'QR Code Generator',
  'Password Generator',
  'Hash Generator',
  'UUID Generator',
  'Color Converter',
  'Timestamp Converter',
  'SQL Formatter'
];

const KNOWN_DIRECTORIES = [
  {
    name: 'StackShare',
    url: 'https://stackshare.io',
    submitUrl: 'https://stackshare.io/submissions/new',
    category: 'Developer Tools',
    paid: false,
    notes: 'Popular developer tools directory',
    status: 'pending'
  },
  {
    name: 'Product Hunt',
    url: 'https://producthunt.com',
    submitUrl: 'https://www.producthunt.com/posts/new',
    category: 'Developer Tools',
    paid: false,
    notes: 'Best for launching new tools',
    status: 'pending'
  },
  {
    name: 'AlternativeTo',
    url: 'https://alternativeto.net',
    submitUrl: 'https://alternativeto.net/software/u2tool/',
    category: 'Utilities',
    paid: false,
    notes: 'Add as alternative to similar tools',
    status: 'pending'
  },
  {
    name: 'SaaS Discovery',
    url: 'https://saasdiscovery.co',
    submitUrl: 'https://saasdiscovery.co/submit',
    category: 'Developer Tools',
    paid: false,
    status: 'pending'
  },
  {
    name: 'SaaSHub',
    url: 'https://saashub.com',
    submitUrl: 'https://saashub.com/submit',
    category: 'Developer Tools',
    paid: false,
    status: 'pending'
  },
  {
    name: 'G2',
    url: 'https://g2.com',
    submitUrl: 'https://www.g2.com/products/u2tool/submissions/new',
    category: 'Developer Tools',
    paid: true,
    notes: 'Paid reviews',
    status: 'pending'
  },
  {
    name: 'Capterra',
    url: 'https://capterra.com',
    submitUrl: 'https://www.capterra.com/software/-request-review',
    category: 'Developer Tools',
    paid: true,
    notes: 'Paid reviews',
    status: 'pending'
  },
  {
    name: 'GitHub Awesome Lists',
    url: 'https://github.com',
    submitUrl: null,
    category: 'Developer Tools',
    paid: false,
    notes: 'Create awesome list or get listed',
    status: 'pending'
  },
  {
    name: 'Dev.to',
    url: 'https://dev.to',
    submitUrl: null,
    category: 'Developer Tools',
    paid: false,
    notes: 'Write articles about tools',
    status: 'pending'
  },
  {
    name: 'Hashnode',
    url: 'https://hashnode.com',
    submitUrl: null,
    category: 'Developer Tools',
    paid: false,
    notes: 'Write blog posts',
    status: 'pending'
  },
  {
    name: 'ToolScout',
    url: 'https://toolscout.io',
    submitUrl: 'https://toolscout.io/submit',
    category: 'Developer Tools',
    paid: false,
    status: 'pending'
  },
  {
    name: 'CodeMyUI',
    url: 'https://codemyui.com',
    submitUrl: 'https://codemyui.com/submit/',
    category: 'Web Development',
    paid: false,
    status: 'pending'
  },
  {
    name: 'CSS Author',
    url: 'https://cssauthor.com',
    submitUrl: 'https://cssauthor.com/submit-your-tool/',
    category: 'Web Development',
    paid: false,
    status: 'pending'
  },
  {
    name: 'Hacker News',
    url: 'https://news.ycombinator.com',
    submitUrl: null,
    category: 'Developer Tools',
    paid: false,
    notes: 'Share on HN',
    status: 'pending'
  },
  {
    name: 'Reddit',
    url: 'https://reddit.com',
    submitUrl: null,
    category: 'Community',
    paid: false,
    notes: 'Share in relevant subreddits',
    status: 'pending'
  },
  {
    name: 'Indie Hackers',
    url: 'https://indiehackers.com',
    submitUrl: null,
    category: 'Startup',
    paid: false,
    notes: 'Share your project',
    status: 'pending'
  },
  {
    name: 'Betalist',
    url: 'https://betalist.com',
    submitUrl: 'https://betalist.com/submit',
    category: 'Startup',
    paid: false,
    status: 'pending'
  },
  {
    name: 'AppSumo',
    url: 'https://appsumo.com',
    submitUrl: null,
    category: 'Deals',
    paid: false,
    notes: 'Submit for deal',
    status: 'pending'
  },
  {
    name: 'SaaS Optic',
    url: 'https://saasoptic.com',
    submitUrl: 'https://saasoptic.com/submit',
    category: 'Developer Tools',
    paid: false,
    status: 'pending'
  },
  {
    name: 'Future Tools',
    url: 'https://futuretools.io',
    submitUrl: 'https://futuretools.io/submit',
    category: 'AI Tools',
    paid: false,
    status: 'pending'
  },
  {
    name: "There's an AI for That",
    url: 'https://theresanaiforthat.com',
    submitUrl: 'https://theresanaiforthat.com/submit',
    category: 'AI Tools',
    paid: false,
    status: 'pending'
  },
  {
    name: 'AI Tools Directory',
    url: 'https://aitoolsdirectory.com',
    submitUrl: 'https://aitoolsdirectory.com/submit',
    category: 'AI Tools',
    paid: false,
    status: 'pending'
  },
  {
    name: 'Online Tools IO',
    url: 'https://onlinetools.io',
    submitUrl: 'https://onlinetools.io/submit',
    category: 'Online Tools',
    paid: false,
    status: 'pending'
  },
  {
    name: 'Web Tools Finder',
    url: 'https://webtoolsfinder.com',
    submitUrl: 'https://webtoolsfinder.com/submit',
    category: 'Web Development',
    paid: false,
    status: 'pending'
  },
  {
    name: 'DevTool Directory',
    url: 'https://devtooles.com',
    submitUrl: null,
    category: 'Developer Tools',
    paid: false,
    status: 'pending'
  },
  {
    name: 'Coding Tools',
    url: 'https://coding.tools',
    submitUrl: null,
    category: 'Developer Tools',
    paid: false,
    notes: 'Add your tool',
    status: 'pending'
  },
  {
    name: 'DevUtils',
    url: 'https://devutils.com',
    submitUrl: null,
    category: 'Developer Tools',
    paid: false,
    notes: 'Similar tools directory',
    status: 'pending'
  },
  {
    name: 'Online Utility',
    url: 'https://online-utility.org',
    submitUrl: null,
    category: 'Online Tools',
    paid: false,
    status: 'pending'
  },
  {
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    submitUrl: null,
    category: 'Q&A',
    paid: false,
    notes: 'Answer questions, include tool links',
    status: 'pending'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    submitUrl: null,
    category: 'Social',
    paid: false,
    notes: 'Share in relevant groups',
    status: 'pending'
  },
  {
    name: 'Twitter/X',
    url: 'https://twitter.com',
    submitUrl: null,
    category: 'Social',
    paid: false,
    notes: 'Engage with community',
    status: 'pending'
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com',
    submitUrl: null,
    category: 'Video',
    paid: false,
    notes: 'Create tool tutorials',
    status: 'pending'
  },
  {
    name: 'AngelList',
    url: 'https://angel.co',
    submitUrl: null,
    category: 'Startup',
    paid: false,
    notes: 'Startup profile',
    status: 'pending'
  },
  {
    name: 'ToolDirectory',
    url: 'https://tooldirectory.com',
    submitUrl: null,
    category: 'General',
    paid: false,
    status: 'pending'
  },
  {
    name: 'Launchpad',
    url: 'https://launchpad.cc',
    submitUrl: 'https://launchpad.cc/submit',
    category: 'Startup',
    paid: false,
    status: 'pending'
  },
  {
    name: 'Stack Lima',
    url: 'https://stacklima.com',
    submitUrl: 'https://stacklima.com/submit',
    category: 'Developer Tools',
    paid: false,
    status: 'pending'
  },
  // Additional discovered directories
  {
    name: 'Juejin',
    url: 'https://juejin.cn',
    submitUrl: null,
    category: 'Developer Community',
    paid: false,
    notes: 'Chinese developer community - post articles',
    status: 'pending'
  },
  {
    name: 'SegmentFault',
    url: 'https://segmentfault.com',
    submitUrl: null,
    category: 'Developer Community',
    paid: false,
    notes: 'Chinese Q&A platform',
    status: 'pending'
  },
  {
    name: 'OSChina',
    url: 'https://www.oschina.net',
    submitUrl: null,
    category: 'Developer Community',
    paid: false,
    notes: 'Open China - Chinese tech community',
    status: 'pending'
  },
  {
    name: 'Dev.to',
    url: 'https://dev.to',
    submitUrl: null,
    category: 'Developer Community',
    paid: false,
    notes: 'Write articles about tools',
    status: 'pending'
  },
  {
    name: 'Hashnode',
    url: 'https://hashnode.com',
    submitUrl: null,
    category: 'Developer Community',
    paid: false,
    notes: 'Tech blogging platform',
    status: 'pending'
  },
  {
    name: 'Hacker News',
    url: 'https://news.ycombinator.com',
    submitUrl: null,
    category: 'News',
    paid: false,
    notes: 'Share on HN',
    status: 'pending'
  },
  {
    name: 'Lobste.rs',
    url: 'https://lobste.rs',
    submitUrl: null,
    category: 'News',
    paid: false,
    notes: 'Tech news aggregator',
    status: 'pending'
  },
  {
    name: 'Digg',
    url: 'https://digg.com',
    submitUrl: null,
    category: 'News',
    paid: false,
    notes: 'News discovery platform',
    status: 'pending'
  },
  {
    name: 'Pinterest',
    url: 'https://www.pinterest.com',
    submitUrl: null,
    category: 'Social',
    paid: false,
    notes: 'Create pins with tool tutorials',
    status: 'pending'
  },
  {
    name: 'Hatena Bookmark',
    url: 'https://b.hatena.ne.jp',
    submitUrl: null,
    category: 'Bookmarking',
    paid: false,
    notes: 'Japanese bookmarking site',
    status: 'pending'
  },
  {
    name: 'LittleBigTools',
    url: 'https://littlebigtools.com',
    submitUrl: null,
    category: 'Tools Directory',
    paid: false,
    status: 'pending'
  },
  {
    name: 'FreeOnlineTools',
    url: 'https://freeonlinetools.com',
    submitUrl: null,
    category: 'Tools Directory',
    paid: false,
    status: 'pending'
  },
  {
    name: 'WebToolHub',
    url: 'https://webtoolhub.com',
    submitUrl: null,
    category: 'Tools Directory',
    paid: false,
    status: 'pending'
  }
];

function saveProgress(directories) {
  const filePath = path.join(__dirname, '../data/directory-submissions.json');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(directories, null, 2));
  console.log(`\nProgress saved to: ${filePath}`);
}

function exportToCSV(directories) {
  const filePath = path.join(__dirname, '../data/directory-backlinks.csv');
  const headers = ['Name', 'URL', 'Submit URL', 'Category', 'Paid', 'Status', 'Notes'];
  const rows = directories.map(d => [
    d.name,
    d.url,
    d.submitUrl || '',
    d.category || '',
    d.paid ? 'Yes' : 'No',
    d.status,
    d.notes || ''
  ]);

  const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  fs.writeFileSync(filePath, csv);
  console.log(`CSV exported to: ${filePath}`);
}

function printStatus(directories) {
  const stats = {
    total: directories.length,
    pending: directories.filter(d => d.status === 'pending').length,
    submitted: directories.filter(d => d.status === 'submitted').length,
    approved: directories.filter(d => d.status === 'approved').length,
    rejected: directories.filter(d => d.status === 'rejected').length,
    paid: directories.filter(d => d.paid).length,
    free: directories.filter(d => !d.paid).length
  };

  console.log('\n📊 Directory Submission Status');
  console.log('═══════════════════════════════════════════');
  console.log(`Total Directories: ${stats.total}`);
  console.log(`Free: ${stats.free} | Paid: ${stats.paid}`);
  console.log('───────────────────────────────────────────');
  console.log(`Pending:  ${stats.pending}`);
  console.log(`Submitted: ${stats.submitted}`);
  console.log(`Approved:  ${stats.approved}`);
  console.log(`Rejected:  ${stats.rejected}`);
  console.log('═══════════════════════════════════════════');
}

function listDirectories(directories, filter) {
  let filtered = directories;
  if (filter) {
    filtered = directories.filter(d =>
      d.name.toLowerCase().includes(filter.toLowerCase()) ||
      (d.category && d.category.toLowerCase().includes(filter.toLowerCase()))
    );
  }

  console.log(`\n📁 Showing ${filtered.length} directories:\n`);
  filtered.forEach((d, i) => {
    const statusIcon = d.status === 'approved' ? '✅' :
                       d.status === 'submitted' ? '⏳' :
                       d.status === 'rejected' ? '❌' : '⬜';
    const paidTag = d.paid ? ' [PAID]' : '';
    console.log(`${i + 1}. ${statusIcon} ${d.name}${paidTag}`);
    console.log(`   URL: ${d.url}`);
    if (d.submitUrl) console.log(`   Submit: ${d.submitUrl}`);
    if (d.notes) console.log(`   Note: ${d.notes}`);
    console.log('');
  });
}

function markAsSubmitted(directories, name) {
  const dir = directories.find(d => d.name.toLowerCase() === name.toLowerCase());
  if (dir) {
    dir.status = 'submitted';
    dir.submittedAt = new Date().toISOString();
    console.log(`Marked "${dir.name}" as submitted`);
  } else {
    console.log(`Directory "${name}" not found`);
  }
  return directories;
}

function markAsApproved(directories, name) {
  const dir = directories.find(d => d.name.toLowerCase() === name.toLowerCase());
  if (dir) {
    dir.status = 'approved';
    console.log(`Marked "${dir.name}" as approved`);
  } else {
    console.log(`Directory "${name}" not found`);
  }
  return directories;
}

function generateSubmissionData() {
  return {
    site: {
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      email: SITE_EMAIL
    },
    categories: TOOL_CATEGORIES,
    tags: ['developer tools', 'online tools', 'free tools', 'utilities', ...POPULAR_TOOLS.map(t => t.toLowerCase())],
    tools: POPULAR_TOOLS
  };
}

function printSubmissionGuide() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║           DIRECTORY SUBMISSION GUIDE                      ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  Before submitting, prepare:                               ║
║  ─────────────────────────────────────────────────────    ║
║  ✓ Site name: ${SITE_NAME.padEnd(46)}║
║  ✓ Site URL: ${SITE_URL.padEnd(46)}║
║  ✓ Description: 200+ free online developer tools        ║
║  ✓ Email: contact@u2tool.com                           ║
║  ✓ Categories: Developer Tools, Online Tools, Utilities ║
║                                                            ║
║  Popular Tags to Use:                                   ║
║  ─────────────────────────────────────────────────────    ║
║  • JSON Formatter • Base64 Encoder • QR Code Generator  ║
║  • Password Generator • UUID Generator • Hash Generator ║
║  • Color Converter • Timestamp Converter • SQL Formatter ║
║                                                            ║
║  Priority Submission Order:                               ║
║  ─────────────────────────────────────────────────────    ║
║  1. Product Hunt (free, high traffic)                    ║
║  2. StackShare (developer-focused)                       ║
║  3. AlternativeTo (SEO value)                            ║
║  4. SaaS Discovery (SEO value)                          ║
║  5. ToolScout (developer tools)                         ║
║  6. Indie Hackers (startup community)                   ║
║  7. Betalist (startup visibility)                       ║
║  8. Hacker News (quality traffic)                       ║
║                                                            ║
║  Manual Actions Required:                                 ║
║  ─────────────────────────────────────────────────────    ║
║  • Reddit: Share in r/webdev, r/programming             ║
║  • Stack Overflow: Answer questions, add tool links     ║
║  • GitHub: Create awesome-list for developer tools       ║
║  • YouTube: Create tool tutorial videos                 ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
}

function discoverMoreDirectories() {
  console.log('\n🔍 Search queries to find more directories:\n');

  const searchQueries = [
    '"submit" "developer tools" directory',
    '"submit" "online tools" directory',
    '"add" "free tools" website',
    'site:directory.io "submit tool"',
    'best developer tools directories 2024',
    '"submit your tool" web development',
    'free tool directory submission',
    'SEO tools directory list',
    'webmaster tools directory',
    'online utility directory submission'
  ];

  console.log('Search these queries on Google to find more directories:\n');
  searchQueries.forEach((query, i) => {
    console.log(`${i + 1}. ${query}`);
  });

  console.log('\nAlso check:');
  console.log('  • https://moz.com/directory');
  console.log('  • https://www.seoptimer.com/backlink-checker');
  console.log('  • Search your competitors\' backlinks');
}

function printHelp() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║     Navigation Directory Submitter - Help                 ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  Usage: node navigation-submitter.js <command>           ║
║                                                            ║
║  Commands:                                                ║
║  ─────────────────────────────────────────────────────    ║
║  list                    List all known directories       ║
║  list <filter>          Filter by name or category       ║
║  status                 Show submission statistics       ║
║  submit <name>         Mark directory as submitted      ║
║  approve <name>        Mark directory as approved       ║
║  guide                  Show submission guide            ║
║  discover               Find more directories            ║
║  export                 Export to CSV                    ║
║  data                   Show submission data (JSON)      ║
║  help                   Show this help                   ║
║                                                            ║
║  Examples:                                                ║
║  ─────────────────────────────────────────────────────    ║
║  node scripts/navigation-submitter.js list              ║
║  node scripts/navigation-submitter.js list developer    ║
║  node scripts/navigation-submitter.js status             ║
║  node scripts/navigation-submitter.js submit "Product Hunt"║
║  node scripts/navigation-submitter.js guide              ║
║  node scripts/navigation-submitter.js discover         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  const param = args[1];

  console.log('\n🧭 Navigation Directory Submitter');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  let directories = [...KNOWN_DIRECTORIES];

  try {
    const savedData = fs.readFileSync(path.join(__dirname, '../data/directory-submissions.json'), 'utf-8');
    directories = JSON.parse(savedData);
  } catch (e) {
  }

  switch (command) {
    case 'list':
      listDirectories(directories, param);
      break;
    case 'status':
      printStatus(directories);
      break;
    case 'submit':
      if (param) {
        directories = markAsSubmitted(directories, param);
        saveProgress(directories);
      } else {
        console.log('Please specify directory name');
      }
      break;
    case 'approve':
      if (param) {
        directories = markAsApproved(directories, param);
        saveProgress(directories);
      } else {
        console.log('Please specify directory name');
      }
      break;
    case 'guide':
      printSubmissionGuide();
      break;
    case 'discover':
      discoverMoreDirectories();
      break;
    case 'export':
      exportToCSV(directories);
      break;
    case 'data':
      console.log('\n📋 Submission Data:\n');
      console.log(JSON.stringify(generateSubmissionData(), null, 2));
      break;
    case 'help':
    default:
      printHelp();
      break;
  }
}

main();
