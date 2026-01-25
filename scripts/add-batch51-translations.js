/**
 * 添加 Batch 51 工具的英文翻译
 */

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(process.cwd(), 'src', 'messages');

// Batch 51 英文翻译
const batch51Translations = {
  'dockerfile-generator': {
    name: 'Dockerfile Generator',
    description: 'Generate Dockerfile configurations for your projects',
    seo_title: 'Free Dockerfile Generator Online - Create Docker Configurations',
    seo_description: 'Generate Dockerfile configurations easily with our free online tool. Create optimized Docker images with base image selection, commands, ports, and environment variables. No installation required.',
    detailed_description: 'Dockerfile Generator is a comprehensive online tool that helps you create Dockerfile configurations for containerizing your applications. Select from popular base images like Node.js, Python, Go, or custom images. Configure working directories, copy commands, run commands, exposed ports, and environment variables. The tool generates optimized, production-ready Dockerfiles following best practices. Perfect for developers new to Docker or those who want to quickly scaffold container configurations.',
    usage_steps: [
      'Select a base image from the dropdown or enter a custom image',
      'Configure the working directory for your application',
      'Add COPY and RUN commands as needed',
      'Specify ports to expose',
      'Add environment variables if required',
      'Click Generate to create your Dockerfile',
      'Copy or download the generated Dockerfile'
    ],
    usage_examples: [
      'Create a Node.js application container',
      'Build a Python Flask/Django container',
      'Set up a multi-stage build for Go applications',
      'Configure a development environment container'
    ]
  },
  'eslint-config-generator': {
    name: 'ESLint Config Generator',
    description: 'Generate ESLint configuration files for JavaScript/TypeScript projects',
    seo_title: 'Free ESLint Config Generator Online - Create .eslintrc Configuration',
    seo_description: 'Generate ESLint configuration files easily with our free online tool. Choose from popular style guides like Airbnb, Standard, or Google. Configure rules for React, Vue, TypeScript, and more.',
    detailed_description: 'ESLint Config Generator helps you create customized ESLint configuration files for your JavaScript and TypeScript projects. Choose from popular style guides including Airbnb, Standard, Google, and more. Configure framework-specific rules for React, Vue, Angular, or Node.js. Enable TypeScript support, set up Prettier integration, and customize individual rules. The tool generates a complete .eslintrc.json file ready to use in your project.',
    usage_steps: [
      'Select your preferred style guide (Airbnb, Standard, Google, etc.)',
      'Choose your framework (React, Vue, Angular, Node.js)',
      'Enable TypeScript support if needed',
      'Configure Prettier integration',
      'Customize individual rules as needed',
      'Click Generate to create your ESLint config',
      'Copy the configuration to your project'
    ],
    usage_examples: [
      'Set up ESLint for a React TypeScript project',
      'Configure ESLint with Airbnb style guide',
      'Create a Node.js backend linting configuration',
      'Set up ESLint with Prettier integration'
    ]
  },
  'prettier-config-generator': {
    name: 'Prettier Config Generator',
    description: 'Generate Prettier configuration files for code formatting',
    seo_title: 'Free Prettier Config Generator Online - Create .prettierrc Configuration',
    seo_description: 'Generate Prettier configuration files easily with our free online tool. Customize tab width, quotes, semicolons, trailing commas, and more. Create consistent code formatting across your team.',
    detailed_description: 'Prettier Config Generator helps you create customized Prettier configuration files for consistent code formatting. Configure all major options including print width, tab width, single vs double quotes, semicolons, trailing commas, bracket spacing, and more. Preview how your code will be formatted with different settings. The tool generates .prettierrc files in JSON format ready to use in any JavaScript, TypeScript, CSS, or HTML project.',
    usage_steps: [
      'Set your preferred print width (default 80)',
      'Choose tab width and whether to use tabs or spaces',
      'Select single or double quotes',
      'Configure semicolon usage',
      'Set trailing comma preference',
      'Adjust bracket spacing and other options',
      'Click Generate and copy the configuration'
    ],
    usage_examples: [
      'Create a Prettier config for a team project',
      'Set up consistent formatting for a monorepo',
      'Configure Prettier for a React project',
      'Customize formatting for legacy codebase migration'
    ]
  },
  'tsconfig-generator': {
    name: 'TSConfig Generator',
    description: 'Generate TypeScript configuration files for your projects',
    seo_title: 'Free TSConfig Generator Online - Create tsconfig.json Configuration',
    seo_description: 'Generate TypeScript tsconfig.json files easily with our free online tool. Configure compiler options, module resolution, strict mode, and more. Perfect for React, Node.js, and library projects.',
    detailed_description: 'TSConfig Generator helps you create customized TypeScript configuration files for your projects. Configure compiler options including target ECMAScript version, module system, strict mode settings, and path aliases. Choose from presets for React, Node.js, library development, or create a custom configuration. The tool explains each option and generates a complete tsconfig.json file with comments explaining the settings.',
    usage_steps: [
      'Select a project type preset (React, Node.js, Library, etc.)',
      'Choose the target ECMAScript version',
      'Configure module system and resolution',
      'Enable strict mode options as needed',
      'Set up path aliases for imports',
      'Configure output directory and other options',
      'Click Generate and copy the tsconfig.json'
    ],
    usage_examples: [
      'Set up TypeScript for a new React project',
      'Configure TypeScript for a Node.js backend',
      'Create a tsconfig for a npm package library',
      'Set up path aliases for cleaner imports'
    ]
  },
  'editorconfig-generator': {
    name: 'EditorConfig Generator',
    description: 'Generate EditorConfig files for consistent coding styles',
    seo_title: 'Free EditorConfig Generator Online - Create .editorconfig Files',
    seo_description: 'Generate EditorConfig files easily with our free online tool. Configure indent style, indent size, end of line, charset, and more. Ensure consistent coding styles across different editors and IDEs.',
    detailed_description: 'EditorConfig Generator helps you create .editorconfig files to maintain consistent coding styles across different editors and IDEs. Configure settings for indent style (tabs vs spaces), indent size, end of line characters, charset, and trailing whitespace handling. Set up different rules for different file types. The tool generates a complete .editorconfig file that works with VS Code, Sublime Text, Vim, and many other editors.',
    usage_steps: [
      'Set the root property to true for project root',
      'Configure default settings for all files',
      'Set indent style (tabs or spaces)',
      'Choose indent size (2, 4, etc.)',
      'Configure end of line character (lf, crlf)',
      'Add file-type specific overrides if needed',
      'Click Generate and copy the .editorconfig'
    ],
    usage_examples: [
      'Create consistent formatting across a team',
      'Set up different rules for different file types',
      'Configure EditorConfig for a monorepo',
      'Ensure consistent line endings across platforms'
    ]
  },
  'github-readme-generator': {
    name: 'GitHub README Generator',
    description: 'Generate professional README.md files for GitHub projects',
    seo_title: 'Free GitHub README Generator Online - Create Professional README Files',
    seo_description: 'Generate professional README.md files for your GitHub projects with our free online tool. Add badges, features, installation instructions, usage examples, and more. Make your projects stand out.',
    detailed_description: 'GitHub README Generator helps you create professional, well-structured README.md files for your GitHub repositories. Add project title, description, badges (build status, license, npm version), features list, installation instructions, usage examples, API documentation, contributing guidelines, and license information. The tool generates Markdown with proper formatting, making your projects more discoverable and user-friendly.',
    usage_steps: [
      'Enter your project name and description',
      'Add badges for build status, license, etc.',
      'List key features of your project',
      'Write installation instructions',
      'Add usage examples with code blocks',
      'Include contributing guidelines',
      'Select a license and generate the README'
    ],
    usage_examples: [
      'Create a README for an open source library',
      'Document a CLI tool with usage examples',
      'Set up a README for a web application',
      'Create documentation for an API project'
    ]
  },
  'changelog-generator': {
    name: 'Changelog Generator',
    description: 'Generate CHANGELOG.md files following Keep a Changelog format',
    seo_title: 'Free Changelog Generator Online - Create CHANGELOG.md Files',
    seo_description: 'Generate CHANGELOG.md files following the Keep a Changelog format with our free online tool. Track Added, Changed, Deprecated, Removed, Fixed, and Security changes for each version.',
    detailed_description: 'Changelog Generator helps you create well-structured CHANGELOG.md files following the Keep a Changelog format. Add version entries with dates and categorize changes into Added, Changed, Deprecated, Removed, Fixed, and Security sections. The tool generates Markdown that follows semantic versioning conventions and makes it easy for users to understand what changed between versions of your software.',
    usage_steps: [
      'Enter the version number (e.g., 1.0.0)',
      'Set the release date',
      'Add entries under appropriate categories',
      'Use Added for new features',
      'Use Changed for changes in existing functionality',
      'Use Fixed for bug fixes',
      'Generate and copy the changelog entry'
    ],
    usage_examples: [
      'Document a major version release',
      'Track bug fixes in a patch release',
      'Record breaking changes in a new version',
      'Maintain a changelog for an npm package'
    ]
  },
  'license-generator': {
    name: 'License Generator',
    description: 'Generate open source license files for your projects',
    seo_title: 'Free License Generator Online - Create Open Source License Files',
    seo_description: 'Generate open source license files with our free online tool. Choose from MIT, Apache 2.0, GPL 3.0, BSD, ISC, and more. Add your name and year automatically. Perfect for GitHub projects.',
    detailed_description: 'License Generator helps you create license files for your open source projects. Choose from popular licenses including MIT, Apache 2.0, GPL 3.0, BSD 2-Clause, BSD 3-Clause, ISC, Mozilla Public License, and more. Enter your name and the tool automatically fills in the year and generates the complete license text. Each license includes a brief description of its terms to help you choose the right one for your project.',
    usage_steps: [
      'Browse available licenses and their descriptions',
      'Select the license that fits your needs',
      'Enter your name or organization',
      'The current year is automatically filled',
      'Click Generate to create the license',
      'Copy the license text to your LICENSE file'
    ],
    usage_examples: [
      'Add an MIT license to a new npm package',
      'Choose Apache 2.0 for a corporate open source project',
      'Select GPL for a copyleft project',
      'Use ISC for a simple permissive license'
    ]
  },
  'rot13-encoder': {
    name: 'ROT13 Encoder',
    description: 'Encode and decode text using ROT13 cipher',
    seo_title: 'Free ROT13 Encoder/Decoder Online - Caesar Cipher Tool',
    seo_description: 'Encode and decode text using ROT13 cipher with our free online tool. ROT13 is a simple letter substitution cipher that replaces each letter with the letter 13 positions after it in the alphabet.',
    detailed_description: 'ROT13 Encoder is a simple tool for encoding and decoding text using the ROT13 cipher. ROT13 (rotate by 13 places) is a special case of the Caesar cipher that replaces each letter with the letter 13 positions after it in the alphabet. Since the alphabet has 26 letters, applying ROT13 twice returns the original text, making it its own inverse. ROT13 is commonly used to hide spoilers, puzzle solutions, or mildly obscure text.',
    usage_steps: [
      'Enter or paste your text in the input area',
      'The ROT13 transformation is applied automatically',
      'View the encoded/decoded result',
      'Copy the result to clipboard',
      'Apply ROT13 again to decode'
    ],
    usage_examples: [
      'Hide spoilers in online discussions',
      'Encode puzzle solutions',
      'Learn about basic cryptography',
      'Decode ROT13 encoded messages'
    ]
  },
  'caesar-cipher': {
    name: 'Caesar Cipher',
    description: 'Encrypt and decrypt text using Caesar cipher with custom shift',
    seo_title: 'Free Caesar Cipher Tool Online - Encrypt and Decrypt Text',
    seo_description: 'Encrypt and decrypt text using Caesar cipher with our free online tool. Choose any shift value from 1-25. Learn about one of the oldest encryption methods used by Julius Caesar.',
    detailed_description: 'Caesar Cipher tool allows you to encrypt and decrypt text using the classic Caesar cipher algorithm. Named after Julius Caesar who used it for military communications, this cipher shifts each letter by a fixed number of positions in the alphabet. Choose any shift value from 1 to 25, with ROT13 being the special case of shift 13. The tool supports both encryption and decryption modes and preserves non-alphabetic characters.',
    usage_steps: [
      'Enter your text in the input area',
      'Select the shift value (1-25)',
      'Choose encrypt or decrypt mode',
      'View the transformed result',
      'Copy the result to clipboard',
      'Use the same shift value to decrypt'
    ],
    usage_examples: [
      'Learn about classical cryptography',
      'Create simple encoded messages',
      'Solve Caesar cipher puzzles',
      'Teach encryption basics to students'
    ]
  },
  'vigenere-cipher': {
    name: 'Vigenère Cipher',
    description: 'Encrypt and decrypt text using Vigenère cipher with a keyword',
    seo_title: 'Free Vigenère Cipher Tool Online - Polyalphabetic Encryption',
    seo_description: 'Encrypt and decrypt text using Vigenère cipher with our free online tool. Use a keyword for polyalphabetic substitution. More secure than simple Caesar cipher.',
    detailed_description: 'Vigenère Cipher tool allows you to encrypt and decrypt text using the Vigenère cipher, a polyalphabetic substitution cipher. Unlike the Caesar cipher which uses a single shift, the Vigenère cipher uses a keyword where each letter determines a different shift. This makes it much harder to crack than simple substitution ciphers. The tool supports both encryption and decryption and preserves non-alphabetic characters.',
    usage_steps: [
      'Enter your text in the input area',
      'Enter a keyword (letters only)',
      'Choose encrypt or decrypt mode',
      'View the transformed result',
      'Copy the result to clipboard',
      'Use the same keyword to decrypt'
    ],
    usage_examples: [
      'Create more secure encoded messages',
      'Learn about polyalphabetic ciphers',
      'Solve Vigenère cipher puzzles',
      'Study historical cryptography methods'
    ]
  },
  'checksum-verifier': {
    name: 'Checksum Verifier',
    description: 'Calculate and verify file checksums (MD5, SHA-1, SHA-256, SHA-512)',
    seo_title: 'Free Checksum Verifier Online - MD5, SHA-1, SHA-256, SHA-512',
    seo_description: 'Calculate and verify file checksums with our free online tool. Support for MD5, SHA-1, SHA-256, and SHA-512 hash algorithms. Verify file integrity and detect tampering.',
    detailed_description: 'Checksum Verifier is a comprehensive tool for calculating and verifying file checksums using multiple hash algorithms. Upload any file to calculate its MD5, SHA-1, SHA-256, and SHA-512 hashes simultaneously. Compare calculated hashes against expected values to verify file integrity. The tool processes files entirely in your browser using the Web Crypto API, ensuring your files are never uploaded to any server.',
    usage_steps: [
      'Upload a file by clicking or dragging',
      'Wait for hash calculation to complete',
      'View MD5, SHA-1, SHA-256, and SHA-512 hashes',
      'Optionally enter an expected checksum',
      'The tool will indicate if checksums match',
      'Copy any hash value to clipboard'
    ],
    usage_examples: [
      'Verify downloaded software integrity',
      'Check if a file was corrupted during transfer',
      'Compare file versions using hashes',
      'Validate backup file integrity'
    ]
  },
  'inflation-calculator': {
    name: 'Inflation Calculator',
    description: 'Calculate the effect of inflation on purchasing power over time',
    seo_title: 'Free Inflation Calculator Online - Calculate Purchasing Power',
    seo_description: 'Calculate the effect of inflation on purchasing power with our free online tool. See how much money from the past is worth today, or how much you will need in the future.',
    detailed_description: 'Inflation Calculator helps you understand how inflation affects the value of money over time. Enter an amount, select start and end years, and specify an inflation rate to see the equivalent value. Calculate how much past money is worth in today\'s dollars, or estimate how much you\'ll need in the future to maintain the same purchasing power. The tool shows both the adjusted value and the total percentage change.',
    usage_steps: [
      'Enter the original amount',
      'Select the start year',
      'Select the end year',
      'Enter the annual inflation rate',
      'Click Calculate to see results',
      'View the inflation-adjusted value',
      'See the total percentage change'
    ],
    usage_examples: [
      'Calculate what $100 from 1990 is worth today',
      'Estimate future retirement savings needs',
      'Compare historical prices to current values',
      'Plan for inflation in long-term investments'
    ]
  },
  'break-even-calculator': {
    name: 'Break-Even Calculator',
    description: 'Calculate the break-even point for your business',
    seo_title: 'Free Break-Even Calculator Online - Business Analysis Tool',
    seo_description: 'Calculate your break-even point with our free online tool. Enter fixed costs, variable costs, and selling price to find how many units you need to sell to cover costs.',
    detailed_description: 'Break-Even Calculator helps businesses determine the point at which total revenue equals total costs. Enter your fixed costs (rent, salaries, etc.), variable cost per unit (materials, labor), and selling price per unit. The tool calculates the break-even point in units and revenue, showing exactly how many units you need to sell to cover all costs. Essential for pricing decisions, business planning, and financial analysis.',
    usage_steps: [
      'Enter your total fixed costs',
      'Enter the variable cost per unit',
      'Enter the selling price per unit',
      'Click Calculate to see results',
      'View break-even point in units',
      'See break-even revenue amount',
      'Analyze contribution margin'
    ],
    usage_examples: [
      'Determine pricing for a new product',
      'Analyze profitability of a business venture',
      'Plan production volumes',
      'Make informed pricing decisions'
    ]
  },
  'margin-calculator': {
    name: 'Margin Calculator',
    description: 'Calculate profit margin and markup percentages',
    seo_title: 'Free Margin Calculator Online - Profit Margin and Markup',
    seo_description: 'Calculate profit margin and markup percentages with our free online tool. Enter cost and selling price to see gross margin, markup percentage, and profit amount.',
    detailed_description: 'Margin Calculator helps you understand the profitability of your products or services. Enter the cost and selling price to calculate gross profit margin (profit as percentage of selling price) and markup percentage (profit as percentage of cost). The tool also shows the absolute profit amount. Essential for pricing strategy, competitive analysis, and financial planning.',
    usage_steps: [
      'Enter the cost price',
      'Enter the selling price',
      'Click Calculate to see results',
      'View the profit amount',
      'See the profit margin percentage',
      'See the markup percentage',
      'Compare margin vs markup'
    ],
    usage_examples: [
      'Analyze product profitability',
      'Compare margins across products',
      'Set competitive pricing',
      'Evaluate supplier pricing'
    ]
  },
  'markup-calculator': {
    name: 'Markup Calculator',
    description: 'Calculate selling price based on cost and desired markup',
    seo_title: 'Free Markup Calculator Online - Calculate Selling Price',
    seo_description: 'Calculate selling price based on cost and desired markup with our free online tool. Enter cost and markup percentage to find the optimal selling price and profit.',
    detailed_description: 'Markup Calculator helps you determine the selling price for your products based on cost and desired markup percentage. Enter the cost and your target markup percentage, and the tool calculates the selling price and profit amount. Useful for retail pricing, wholesale calculations, and ensuring consistent profit margins across your product line.',
    usage_steps: [
      'Enter the cost price',
      'Enter the desired markup percentage',
      'Click Calculate to see results',
      'View the calculated selling price',
      'See the profit amount',
      'Adjust markup to optimize pricing'
    ],
    usage_examples: [
      'Set retail prices from wholesale costs',
      'Calculate prices with consistent markup',
      'Determine pricing for services',
      'Plan promotional pricing'
    ]
  },
  'hashtag-generator': {
    name: 'Hashtag Generator',
    description: 'Generate relevant hashtags for social media posts',
    seo_title: 'Free Hashtag Generator Online - Social Media Hashtags',
    seo_description: 'Generate relevant hashtags for your social media posts with our free online tool. Enter a topic and get hashtag suggestions for Instagram, Twitter, TikTok, and more.',
    detailed_description: 'Hashtag Generator helps you find relevant hashtags for your social media content. Enter a topic or keywords, select your target platform (Instagram, Twitter, TikTok, LinkedIn), and get a curated list of hashtags. The tool generates a mix of popular, niche, and trending hashtags to maximize your content\'s reach. Copy all hashtags with one click and paste directly into your posts.',
    usage_steps: [
      'Enter your topic or keywords',
      'Select the target platform',
      'Choose the number of hashtags',
      'Click Generate to get suggestions',
      'Review and customize the list',
      'Copy all hashtags to clipboard',
      'Paste into your social media post'
    ],
    usage_examples: [
      'Find hashtags for Instagram posts',
      'Generate Twitter hashtags for trending topics',
      'Create TikTok hashtag strategies',
      'Optimize LinkedIn post visibility'
    ]
  },
  'email-signature-generator': {
    name: 'Email Signature Generator',
    description: 'Create professional email signatures with HTML and plain text',
    seo_title: 'Free Email Signature Generator Online - Professional Signatures',
    seo_description: 'Create professional email signatures with our free online tool. Add your name, title, company, contact info, and social links. Generate HTML and plain text versions.',
    detailed_description: 'Email Signature Generator helps you create professional email signatures for Gmail, Outlook, Apple Mail, and other email clients. Enter your name, job title, company, phone number, email, website, and social media links. Choose from multiple design templates and customize colors. The tool generates both HTML (for rich formatting) and plain text versions of your signature, ready to copy and paste into your email settings.',
    usage_steps: [
      'Enter your name and job title',
      'Add your company name',
      'Enter contact information (phone, email)',
      'Add your website URL',
      'Include social media links',
      'Choose a design template',
      'Copy HTML or plain text signature'
    ],
    usage_examples: [
      'Create a professional business signature',
      'Design a signature with social links',
      'Make a minimalist email signature',
      'Generate signatures for team members'
    ]
  }
};

// 更新英文翻译文件
function updateEnglishTranslations() {
  const enPath = path.join(messagesDir, 'en.json');
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  
  for (const [slug, translation] of Object.entries(batch51Translations)) {
    enData.tools[slug] = translation;
  }
  
  fs.writeFileSync(enPath, JSON.stringify(enData, null, 2) + '\n');
  console.log('✅ 更新 en.json - 添加 ' + Object.keys(batch51Translations).length + ' 个工具翻译');
}

// 主函数
function main() {
  console.log('🚀 添加 Batch 51 工具英文翻译\n');
  updateEnglishTranslations();
  console.log('\n✅ 英文翻译添加完成！');
  console.log('\n📋 后续步骤:');
  console.log('   1. 运行 AI 翻译脚本翻译到其他语言');
  console.log('   2. 运行 npx tsx scripts/split-translations.ts 更新拆分文件');
}

main();
