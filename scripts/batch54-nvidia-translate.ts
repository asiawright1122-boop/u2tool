/**
 * Batch 54 工具批量翻译脚本 - 使用 NVIDIA NIM API
 * 
 * 使用方法:
 *   npx tsx scripts/batch54-nvidia-translate.ts
 * 
 * 环境变量:
 *   NVIDIA_API_KEY - NVIDIA NIM API 密钥
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const CONFIG = {
  apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
  model: process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct',
  messagesDir: path.join(process.cwd(), 'src', 'messages'),
};

const TARGET_LOCALES = ['zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

const LOCALE_NAMES: Record<string, string> = {
  zh: 'Simplified Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  es: 'Spanish',
  pt: 'Portuguese',
  fr: 'French',
  de: 'German',
  ru: 'Russian',
  ar: 'Arabic',
};


// Batch 54 工具的个性化英文内容
const BATCH54_CONTENT: Record<string, {
  name: string;
  description: string;
  seo_title: string;
  seo_description: string;
  detailed_description: string;
  usage_steps: string[];
  usage_examples: string[];
}> = {
  'curl-to-code-generator': {
    name: 'cURL to Code Generator',
    description: 'Convert cURL commands to code in Python, JavaScript, Go, PHP and more',
    seo_title: 'Free cURL to Code Converter Online - Python, JS, Go | U2Tool',
    seo_description: 'Convert cURL commands to Python, JavaScript, Go, PHP code instantly. Free online tool for API development.',
    detailed_description: 'cURL to Code Generator converts cURL commands into working code snippets for multiple programming languages including Python (requests), JavaScript (fetch/axios), Go, PHP, Ruby, and more.',
    usage_steps: ['Paste your cURL command', 'Select target language', 'Choose HTTP library', 'Click Convert', 'Copy generated code'],
    usage_examples: ['Convert API test cURL to Python requests', 'Generate JS fetch from DevTools cURL', 'Create Go HTTP client from docs']
  },
  'http-status-code-reference': {
    name: 'HTTP Status Code Reference',
    description: 'Complete HTTP status code reference with explanations and solutions',
    seo_title: 'HTTP Status Codes Reference - Complete List & Solutions | U2Tool',
    seo_description: 'Complete HTTP status code reference with explanations, causes, and solutions. Search 1xx-5xx codes instantly.',
    detailed_description: 'HTTP Status Code Reference provides a comprehensive guide to all HTTP response codes from 1xx to 5xx with detailed explanations and troubleshooting tips.',
    usage_steps: ['Enter status code to look up', 'Or browse by category', 'View explanation and causes', 'Check solutions', 'Copy code examples'],
    usage_examples: ['Debug API responses', 'Learn error handling for 4xx/5xx', 'Understand redirect codes for SEO']
  },
  'jwt-payload-decoder': {
    name: 'JWT Payload Decoder',
    description: 'Decode and inspect JWT token payloads without verification',
    seo_title: 'Free JWT Decoder Online - Decode Token Payload | U2Tool',
    seo_description: 'Decode JWT tokens instantly and inspect payload claims. Free online JWT decoder, view header, payload, expiration.',
    detailed_description: 'JWT Payload Decoder extracts and displays the header and payload from JSON Web Tokens without requiring the secret key.',
    usage_steps: ['Paste JWT token', 'Token auto-decodes', 'View header info', 'Inspect payload claims', 'Check expiration'],
    usage_examples: ['Debug authentication issues', 'Verify token expiration', 'Extract user info from tokens']
  },
  'base64-image-converter': {
    name: 'Base64 Image Converter',
    description: 'Convert images to Base64 strings and Base64 to images',
    seo_title: 'Free Base64 Image Converter Online - Encode/Decode | U2Tool',
    seo_description: 'Convert images to Base64 data URIs and decode Base64 to images. Free tool for embedding images in HTML/CSS.',
    detailed_description: 'Base64 Image Converter encodes images (PNG, JPG, GIF, SVG, WebP) to Base64 data URI strings and decodes Base64 back to images.',
    usage_steps: ['Upload image or paste Base64', 'For encoding: drag image', 'For decoding: paste Base64', 'Preview result', 'Copy or download'],
    usage_examples: ['Embed icons in CSS as data URIs', 'Convert API Base64 images', 'Create inline images for emails']
  },
  'url-query-string-parser': {
    name: 'URL Query String Parser',
    description: 'Parse and analyze URL query parameters into key-value pairs',
    seo_title: 'Free URL Query String Parser Online - Decode Parameters | U2Tool',
    seo_description: 'Parse URL query strings into readable key-value pairs. Decode URL-encoded parameters instantly.',
    detailed_description: 'URL Query String Parser breaks down complex URLs into components, extracting and decoding query parameters into a readable table.',
    usage_steps: ['Paste full URL or query string', 'View parsed parameters', 'See decoded values', 'Edit values if needed', 'Copy or rebuild URL'],
    usage_examples: ['Debug tracking parameters', 'Analyze OAuth callbacks', 'Extract API endpoint params']
  },
  'request-header-builder': {
    name: 'HTTP Request Header Builder',
    description: 'Build and format HTTP request headers for API testing',
    seo_title: 'Free HTTP Header Builder Online - API Testing Tool | U2Tool',
    seo_description: 'Build HTTP request headers easily. Add Authorization, Content-Type, custom headers. Export for cURL, Postman.',
    detailed_description: 'HTTP Request Header Builder helps construct properly formatted HTTP headers for API requests with common headers and export options.',
    usage_steps: ['Select common headers', 'Or add custom headers', 'Configure Authorization', 'Set Content-Type', 'Export in preferred format'],
    usage_examples: ['Build Authorization headers', 'Create CORS headers', 'Generate webhook headers']
  },
  'webhook-tester': {
    name: 'Webhook Tester',
    description: 'Test and debug webhook endpoints with custom payloads',
    seo_title: 'Free Webhook Tester Online - Test Endpoints | U2Tool',
    seo_description: 'Test webhook endpoints with custom JSON payloads. Debug webhook integrations with request/response logging.',
    detailed_description: 'Webhook Tester allows you to send test requests to webhook endpoints with custom payloads, headers, and HTTP methods.',
    usage_steps: ['Enter webhook URL', 'Select HTTP method', 'Add custom headers', 'Enter JSON payload', 'Send and view response'],
    usage_examples: ['Test Stripe webhooks', 'Debug GitHub integrations', 'Verify Slack webhooks']
  },
  'api-response-formatter': {
    name: 'API Response Formatter',
    description: 'Format and beautify API responses (JSON, XML) for readability',
    seo_title: 'Free API Response Formatter Online - JSON/XML Beautifier | U2Tool',
    seo_description: 'Format and beautify API responses instantly. Support for JSON and XML with syntax highlighting.',
    detailed_description: 'API Response Formatter beautifies raw API responses in JSON or XML format with syntax highlighting and collapsible tree view.',
    usage_steps: ['Paste API response', 'Auto-detect or select format', 'View formatted output', 'Expand/collapse nodes', 'Copy formatted version'],
    usage_examples: ['Format minified JSON', 'Beautify XML SOAP responses', 'Compare API responses']
  },
  'sql-to-mongodb-converter': {
    name: 'SQL to MongoDB Converter',
    description: 'Convert SQL queries to MongoDB query syntax',
    seo_title: 'Free SQL to MongoDB Converter Online - Query Translator | U2Tool',
    seo_description: 'Convert SQL queries to MongoDB syntax instantly. Support SELECT, INSERT, UPDATE, DELETE.',
    detailed_description: 'SQL to MongoDB Converter translates SQL queries into equivalent MongoDB query syntax for database migration.',
    usage_steps: ['Paste SQL query', 'Select MongoDB driver', 'Click Convert', 'View MongoDB syntax', 'Copy the query'],
    usage_examples: ['Migrate SQL to MongoDB', 'Learn MongoDB syntax', 'Convert WHERE to $match']
  },
  'json-to-protobuf-converter': {
    name: 'JSON to Protobuf Converter',
    description: 'Generate Protocol Buffer definitions from JSON data',
    seo_title: 'Free JSON to Protobuf Converter Online - Proto Generator | U2Tool',
    seo_description: 'Generate Protocol Buffer (.proto) definitions from JSON data. Automatic type inference for gRPC.',
    detailed_description: 'JSON to Protobuf Converter analyzes JSON data structure and generates corresponding Protocol Buffer message definitions.',
    usage_steps: ['Paste JSON data', 'Enter message name', 'Configure options', 'Click Generate', 'Download .proto file'],
    usage_examples: ['Create .proto from JSON APIs', 'Generate gRPC messages', 'Convert JSON schemas']
  },
  'regex-to-code-generator': {
    name: 'Regex to Code Generator',
    description: 'Generate code snippets for regex patterns in multiple languages',
    seo_title: 'Free Regex to Code Generator Online - Pattern to Code | U2Tool',
    seo_description: 'Generate regex code for Python, JavaScript, Java, Go. Convert patterns to working code snippets.',
    detailed_description: 'Regex to Code Generator converts regular expression patterns into ready-to-use code snippets for various languages.',
    usage_steps: ['Enter regex pattern', 'Select target language', 'Choose operation', 'Configure flags', 'Copy code snippet'],
    usage_examples: ['Generate Python re code', 'Create JS RegExp code', 'Convert to Java Pattern']
  },
  'swagger-to-code-generator': {
    name: 'Swagger to Code Generator',
    description: 'Generate API client code from Swagger/OpenAPI specifications',
    seo_title: 'Free Swagger to Code Generator Online - OpenAPI Client | U2Tool',
    seo_description: 'Generate API client code from Swagger/OpenAPI specs. Support TypeScript, Python, Go.',
    detailed_description: 'Swagger to Code Generator creates API client code from OpenAPI/Swagger specifications with typed interfaces.',
    usage_steps: ['Paste Swagger JSON/YAML', 'Select target language', 'Choose HTTP library', 'Configure options', 'Download client code'],
    usage_examples: ['Generate TypeScript client', 'Create Python SDK', 'Build Go HTTP client']
  },
  'database-migration-generator': {
    name: 'Database Migration Generator',
    description: 'Generate database migration scripts for schema changes',
    seo_title: 'Free Database Migration Generator Online - SQL Scripts | U2Tool',
    seo_description: 'Generate database migration scripts for MySQL, PostgreSQL, SQLite. Create tables, add columns, indexes.',
    detailed_description: 'Database Migration Generator creates migration scripts for common database operations supporting multiple databases.',
    usage_steps: ['Select migration type', 'Choose database type', 'Define schema changes', 'Generate up/down scripts', 'Copy or download'],
    usage_examples: ['Generate CREATE TABLE migrations', 'Create ALTER TABLE scripts', 'Build index migrations']
  },
  'environment-variables-generator': {
    name: 'Environment Variables Generator',
    description: 'Generate .env files and environment variable configurations',
    seo_title: 'Free .env File Generator Online - Environment Variables | U2Tool',
    seo_description: 'Generate .env files with proper formatting. Create environment variable templates.',
    detailed_description: 'Environment Variables Generator helps create properly formatted .env files with templates for common services.',
    usage_steps: ['Select template or start fresh', 'Add variable names and values', 'Use secret generator', 'Validate naming', 'Export as .env'],
    usage_examples: ['Create .env.example templates', 'Generate secure API keys', 'Build Docker configs']
  },
  'docker-compose-generator-advanced': {
    name: 'Docker Compose Generator',
    description: 'Generate Docker Compose configurations for multi-container apps',
    seo_title: 'Free Docker Compose Generator Online - YAML Config | U2Tool',
    seo_description: 'Generate Docker Compose YAML files easily. Configure services, networks, volumes.',
    detailed_description: 'Docker Compose Generator creates docker-compose.yml configurations for multi-container applications.',
    usage_steps: ['Select services from templates', 'Configure ports and volumes', 'Set up networks', 'Add health checks', 'Download docker-compose.yml'],
    usage_examples: ['Create dev environment', 'Generate production compose', 'Build microservices stack']
  },
  'kubernetes-manifest-generator': {
    name: 'Kubernetes Manifest Generator',
    description: 'Generate Kubernetes deployment manifests (YAML)',
    seo_title: 'Free Kubernetes YAML Generator Online - K8s Manifests | U2Tool',
    seo_description: 'Generate Kubernetes deployment, service, and ingress manifests. Create K8s YAML files easily.',
    detailed_description: 'Kubernetes Manifest Generator creates YAML manifests for Deployments, Services, ConfigMaps, and other K8s resources.',
    usage_steps: ['Select resource type', 'Configure container image', 'Set resource limits', 'Add environment variables', 'Download YAML manifest'],
    usage_examples: ['Generate Deployment manifests', 'Create Service configs', 'Build ConfigMap resources']
  },
  'code-complexity-analyzer': {
    name: 'Code Complexity Analyzer',
    description: 'Analyze code complexity metrics (cyclomatic complexity, LOC)',
    seo_title: 'Free Code Complexity Analyzer Online - Metrics Tool | U2Tool',
    seo_description: 'Analyze code complexity with cyclomatic complexity, lines of code, maintainability index.',
    detailed_description: 'Code Complexity Analyzer calculates various complexity metrics including cyclomatic complexity and maintainability index.',
    usage_steps: ['Paste your code', 'Select language', 'Click Analyze', 'View complexity scores', 'Identify refactoring needs'],
    usage_examples: ['Identify complex functions', 'Track code quality', 'Enforce complexity limits']
  },
  'dependency-vulnerability-checker': {
    name: 'Dependency Vulnerability Checker',
    description: 'Check package dependencies for known security vulnerabilities',
    seo_title: 'Free Dependency Vulnerability Scanner Online | U2Tool',
    seo_description: 'Scan package.json, requirements.txt for security vulnerabilities. Check npm, pip dependencies.',
    detailed_description: 'Dependency Vulnerability Checker scans project dependencies for known security vulnerabilities with CVE details.',
    usage_steps: ['Paste package.json or requirements.txt', 'Click Scan', 'View vulnerability details', 'See version upgrades', 'Export report'],
    usage_examples: ['Audit npm dependencies', 'Check Python packages', 'Generate security reports']
  },
  'performance-profiler': {
    name: 'Code Performance Profiler',
    description: 'Profile code performance and identify bottlenecks',
    seo_title: 'Free Code Performance Profiler Online - Benchmark Tool | U2Tool',
    seo_description: 'Profile JavaScript code performance. Measure execution time, identify bottlenecks.',
    detailed_description: 'Code Performance Profiler measures execution time and identifies performance bottlenecks in your code.',
    usage_steps: ['Paste code functions', 'Set iteration count', 'Click Run', 'View execution times', 'Compare implementations'],
    usage_examples: ['Benchmark algorithms', 'Identify slow functions', 'Compare library performance']
  },
  'memory-leak-detector': {
    name: 'Memory Leak Detector',
    description: 'Detect potential memory leaks in code patterns',
    seo_title: 'Free Memory Leak Detector Online - Code Analysis | U2Tool',
    seo_description: 'Detect potential memory leaks in JavaScript code. Find event listener leaks, closure issues.',
    detailed_description: 'Memory Leak Detector analyzes code patterns to identify potential memory leaks like unremoved event listeners.',
    usage_steps: ['Paste JS/TS code', 'Click Analyze', 'View detected leaks', 'Read fix suggestions', 'Apply changes'],
    usage_examples: ['Find React component leaks', 'Detect closure issues', 'Identify timer leaks']
  },
  'code-duplication-finder': {
    name: 'Code Duplication Finder',
    description: 'Find duplicate code blocks and suggest refactoring',
    seo_title: 'Free Code Duplication Finder Online - DRY Analysis | U2Tool',
    seo_description: 'Find duplicate code blocks in your codebase. Identify copy-paste code for refactoring.',
    detailed_description: 'Code Duplication Finder identifies duplicate or similar code blocks that violate the DRY principle.',
    usage_steps: ['Paste your code', 'Set minimum block size', 'Click Find Duplicates', 'View highlighted blocks', 'Get refactoring suggestions'],
    usage_examples: ['Find copy-pasted code', 'Identify utility candidates', 'Reduce maintenance burden']
  },
  'unused-imports-finder': {
    name: 'Unused Imports Finder',
    description: 'Identify unused imports and dependencies in code',
    seo_title: 'Free Unused Imports Finder Online - Code Cleanup | U2Tool',
    seo_description: 'Find unused imports in JavaScript, TypeScript, Python code. Clean up dead imports.',
    detailed_description: 'Unused Imports Finder scans your code to identify imports that are declared but never used.',
    usage_steps: ['Paste code with imports', 'Select language', 'Click Analyze', 'View unused imports', 'Copy cleaned code'],
    usage_examples: ['Clean npm imports', 'Reduce bundle size', 'Maintain clean imports']
  },
  'dead-code-analyzer': {
    name: 'Dead Code Analyzer',
    description: 'Find unreachable or dead code that can be removed',
    seo_title: 'Free Dead Code Analyzer Online - Unreachable Code Finder | U2Tool',
    seo_description: 'Find dead and unreachable code in your codebase. Identify unused functions and variables.',
    detailed_description: 'Dead Code Analyzer identifies code that is never executed or referenced in your codebase.',
    usage_steps: ['Paste your code', 'Select language', 'Click Analyze', 'View unreachable code', 'Get removal suggestions'],
    usage_examples: ['Find uncalled functions', 'Identify code after return', 'Clean legacy code']
  },
  'sql-query-optimizer': {
    name: 'SQL Query Optimizer',
    description: 'Analyze and optimize SQL queries for better performance',
    seo_title: 'Free SQL Query Optimizer Online - Performance Tips | U2Tool',
    seo_description: 'Optimize SQL queries for better performance. Get index suggestions, query rewrites.',
    detailed_description: 'SQL Query Optimizer analyzes your SQL queries and provides optimization suggestions for better performance.',
    usage_steps: ['Paste SQL query', 'Select database type', 'Click Optimize', 'View suggestions', 'Apply changes'],
    usage_examples: ['Optimize slow SELECT', 'Get index recommendations', 'Rewrite subqueries']
  },
  'database-schema-visualizer': {
    name: 'Database Schema Visualizer',
    description: 'Visualize database schemas and table relationships',
    seo_title: 'Free Database Schema Visualizer Online - ER Diagram | U2Tool',
    seo_description: 'Visualize database schemas as ER diagrams. See table relationships and foreign keys.',
    detailed_description: 'Database Schema Visualizer creates visual ER diagrams from SQL CREATE TABLE statements.',
    usage_steps: ['Paste CREATE TABLE statements', 'Click Visualize', 'View relationships', 'Drag to arrange', 'Export as PNG/SVG'],
    usage_examples: ['Document database structure', 'Understand legacy databases', 'Plan schema changes']
  },
  'sql-injection-tester': {
    name: 'SQL Injection Tester',
    description: 'Test SQL queries for injection vulnerabilities',
    seo_title: 'Free SQL Injection Tester Online - Security Scanner | U2Tool',
    seo_description: 'Test SQL queries for injection vulnerabilities. Identify security risks in database queries.',
    detailed_description: 'SQL Injection Tester analyzes SQL queries and code patterns to identify potential SQL injection vulnerabilities.',
    usage_steps: ['Paste SQL query or code', 'Enter test inputs', 'Click Test', 'View security issues', 'Get parameterized examples'],
    usage_examples: ['Test user input handling', 'Identify string concatenation', 'Learn secure patterns']
  },
  'database-connection-tester': {
    name: 'Database Connection Tester',
    description: 'Test database connection strings and configurations',
    seo_title: 'Free Database Connection Tester Online - Validate Config | U2Tool',
    seo_description: 'Test and validate database connection strings. Parse MySQL, PostgreSQL, MongoDB URIs.',
    detailed_description: 'Database Connection Tester parses and validates database connection strings for various databases.',
    usage_steps: ['Paste connection string', 'Select database type', 'Click Parse', 'View parsed details', 'Validate format'],
    usage_examples: ['Validate before deployment', 'Parse MongoDB URIs', 'Debug connection issues']
  },
  'query-execution-planner': {
    name: 'Query Execution Planner',
    description: 'Analyze query execution plans and suggest optimizations',
    seo_title: 'Free Query Execution Plan Analyzer Online | U2Tool',
    seo_description: 'Analyze SQL query execution plans. Understand EXPLAIN output. Get optimization tips.',
    detailed_description: 'Query Execution Planner helps understand and optimize SQL query execution plans.',
    usage_steps: ['Paste EXPLAIN output', 'Select database type', 'Click Analyze', 'View plan visualization', 'Get recommendations'],
    usage_examples: ['Understand slow queries', 'Identify full table scans', 'Compare execution plans']
  },
  'database-backup-scheduler': {
    name: 'Database Backup Scheduler',
    description: 'Generate backup schedules and scripts for databases',
    seo_title: 'Free Database Backup Scheduler Online - Cron Generator | U2Tool',
    seo_description: 'Generate database backup schedules and scripts. Create cron jobs for MySQL, PostgreSQL backups.',
    detailed_description: 'Database Backup Scheduler helps create backup schedules and generates backup scripts for databases.',
    usage_steps: ['Select database type', 'Configure frequency', 'Set destination', 'Generate script', 'Copy cron expression'],
    usage_examples: ['Create daily backup scripts', 'Generate cron jobs', 'Plan retention policies']
  },
  'git-commit-message-generator': {
    name: 'Git Commit Message Generator',
    description: 'Generate conventional commit messages following best practices',
    seo_title: 'Free Git Commit Message Generator Online - Conventional Commits | U2Tool',
    seo_description: 'Generate conventional commit messages. Follow best practices for git commits.',
    detailed_description: 'Git Commit Message Generator creates well-formatted commit messages following the Conventional Commits specification.',
    usage_steps: ['Select commit type', 'Enter scope', 'Write description', 'Add body/footer', 'Copy formatted message'],
    usage_examples: ['Create consistent commits', 'Generate changelog-friendly format', 'Follow semantic versioning']
  },
  'git-branch-naming-validator': {
    name: 'Git Branch Naming Validator',
    description: 'Validate Git branch names against naming conventions',
    seo_title: 'Free Git Branch Name Validator Online - Naming Rules | U2Tool',
    seo_description: 'Validate Git branch names against conventions. Check feature, bugfix, release branch formats.',
    detailed_description: 'Git Branch Naming Validator checks branch names against common naming conventions like GitFlow.',
    usage_steps: ['Enter branch name', 'Select convention', 'Click Validate', 'View results', 'Copy corrected name'],
    usage_examples: ['Validate feature branches', 'Enforce team standards', 'Check in CI/CD']
  },
  'merge-conflict-resolver': {
    name: 'Merge Conflict Resolver',
    description: 'Help resolve Git merge conflicts with visual diff',
    seo_title: 'Free Git Merge Conflict Resolver Online - Visual Diff | U2Tool',
    seo_description: 'Resolve Git merge conflicts visually. Compare conflicting changes side by side.',
    detailed_description: 'Merge Conflict Resolver provides a visual interface to resolve Git merge conflicts.',
    usage_steps: ['Paste conflicted content', 'View highlighted conflicts', 'Choose changes', 'Edit merged result', 'Copy resolved content'],
    usage_examples: ['Resolve code conflicts', 'Merge config changes', 'Handle package.json conflicts']
  },
  'git-history-visualizer': {
    name: 'Git History Visualizer',
    description: 'Visualize Git commit history and branch structure',
    seo_title: 'Free Git History Visualizer Online - Commit Graph | U2Tool',
    seo_description: 'Visualize Git commit history as a graph. See branch structure and merges.',
    detailed_description: 'Git History Visualizer creates visual representations of Git commit history.',
    usage_steps: ['Paste git log output', 'Or enter commit data', 'Click Visualize', 'Explore branches', 'Export as image'],
    usage_examples: ['Understand branch histories', 'Document release strategies', 'Visualize merge patterns']
  },
  'changelog-generator-advanced': {
    name: 'Changelog Generator',
    description: 'Generate changelogs from Git commits in various formats',
    seo_title: 'Free Changelog Generator Online - From Git Commits | U2Tool',
    seo_description: 'Generate changelogs from Git commits. Support Keep a Changelog format.',
    detailed_description: 'Changelog Generator creates formatted changelogs from Git commit messages.',
    usage_steps: ['Paste commit messages', 'Select format', 'Configure version/date', 'Click Generate', 'Copy or download'],
    usage_examples: ['Generate release notes', 'Create CHANGELOG.md', 'Document version history']
  },
  'git-tag-manager': {
    name: 'Git Tag Manager',
    description: 'Manage and organize Git tags for releases',
    seo_title: 'Free Git Tag Manager Online - Version Tags | U2Tool',
    seo_description: 'Manage Git tags for releases. Generate semantic version tags.',
    detailed_description: 'Git Tag Manager helps organize and create Git tags following semantic versioning.',
    usage_steps: ['Enter current version', 'Select bump type', 'Add tag message', 'Generate command', 'Copy tag commands'],
    usage_examples: ['Create semantic version tags', 'Generate annotated tags', 'Plan version numbering']
  },
  'markdown-to-html-converter': {
    name: 'Markdown to HTML Converter',
    description: 'Convert Markdown documents to HTML with styling options',
    seo_title: 'Free Markdown to HTML Converter Online - MD to HTML | U2Tool',
    seo_description: 'Convert Markdown to HTML instantly. Support GFM, tables, code blocks.',
    detailed_description: 'Markdown to HTML Converter transforms Markdown documents into clean HTML with GFM support.',
    usage_steps: ['Paste Markdown content', 'Select options', 'Preview HTML output', 'Customize CSS', 'Copy or download'],
    usage_examples: ['Convert README to HTML', 'Generate HTML docs', 'Create styled emails']
  },
  'document-outline-generator': {
    name: 'Document Outline Generator',
    description: 'Generate document outlines from headings and structure',
    seo_title: 'Free Document Outline Generator Online - Structure Extractor | U2Tool',
    seo_description: 'Generate document outlines from headings. Extract structure from Markdown, HTML.',
    detailed_description: 'Document Outline Generator extracts the heading structure from documents to create hierarchical outlines.',
    usage_steps: ['Paste document content', 'Select format', 'Click Generate', 'View structure', 'Copy outline'],
    usage_examples: ['Create outlines for docs', 'Analyze document structure', 'Generate navigation menus']
  },
  'table-of-contents-generator': {
    name: 'Table of Contents Generator',
    description: 'Create table of contents from document headings',
    seo_title: 'Free Table of Contents Generator Online - TOC Creator | U2Tool',
    seo_description: 'Generate table of contents from Markdown headings. Create TOC with anchor links.',
    detailed_description: 'Table of Contents Generator creates navigable TOC from document headings with anchor links.',
    usage_steps: ['Paste Markdown/HTML', 'Set heading depth', 'Choose output format', 'Click Generate', 'Copy and insert'],
    usage_examples: ['Add TOC to README', 'Create doc navigation', 'Generate blog post TOC']
  },
  'document-word-counter': {
    name: 'Document Word Counter',
    description: 'Count words, characters, sentences, and paragraphs',
    seo_title: 'Free Document Word Counter Online - Character Count | U2Tool',
    seo_description: 'Count words, characters, sentences, paragraphs in documents. Reading time estimation.',
    detailed_description: 'Document Word Counter provides detailed statistics including word count, character count, and reading time.',
    usage_steps: ['Paste document text', 'View real-time counts', 'Check statistics', 'See reading time', 'Export stats'],
    usage_examples: ['Check essay word count', 'Verify article length', 'Estimate reading time']
  },
  'document-formatter': {
    name: 'Document Formatter',
    description: 'Format and clean up document text with various options',
    seo_title: 'Free Document Formatter Online - Text Cleanup Tool | U2Tool',
    seo_description: 'Format and clean up document text. Remove extra spaces, fix line breaks.',
    detailed_description: 'Document Formatter cleans and formats text documents with whitespace removal and formatting options.',
    usage_steps: ['Paste document text', 'Select formatting options', 'Preview result', 'Adjust settings', 'Copy cleaned document'],
    usage_examples: ['Clean PDF text', 'Normalize formatting', 'Prepare text for publishing']
  },
  'citation-formatter': {
    name: 'Citation Formatter',
    description: 'Format citations in APA, MLA, Chicago, and other styles',
    seo_title: 'Free Citation Formatter Online - APA, MLA, Chicago | U2Tool',
    seo_description: 'Format citations in APA, MLA, Chicago, Harvard styles. Generate bibliography entries.',
    detailed_description: 'Citation Formatter generates properly formatted citations and bibliography entries in various styles.',
    usage_steps: ['Select source type', 'Enter source details', 'Choose citation style', 'Click Format', 'Copy citation'],
    usage_examples: ['Format book citations', 'Generate website citations', 'Create bibliography entries']
  },
  'project-estimation-calculator': {
    name: 'Project Estimation Calculator',
    description: 'Calculate project effort estimates using PERT and story points',
    seo_title: 'Free Project Estimation Calculator Online - PERT Tool | U2Tool',
    seo_description: 'Calculate project estimates using PERT, story points. Estimate development time.',
    detailed_description: 'Project Estimation Calculator helps estimate project effort using PERT and story points.',
    usage_steps: ['Enter task descriptions', 'Provide estimates', 'Or use story points', 'Calculate duration', 'View confidence intervals'],
    usage_examples: ['Estimate software projects', 'Calculate sprint capacity', 'Plan timelines with PERT']
  },
  'sprint-velocity-calculator': {
    name: 'Sprint Velocity Calculator',
    description: 'Calculate and track sprint velocity for agile teams',
    seo_title: 'Free Sprint Velocity Calculator Online - Agile Metrics | U2Tool',
    seo_description: 'Calculate sprint velocity for agile teams. Track story points completed.',
    detailed_description: 'Sprint Velocity Calculator tracks and calculates team velocity across sprints.',
    usage_steps: ['Enter story points per sprint', 'Add multiple sprints', 'View average velocity', 'See velocity trend', 'Use for planning'],
    usage_examples: ['Calculate team velocity', 'Track velocity trends', 'Predict release dates']
  },
  'resource-allocation-planner': {
    name: 'Resource Allocation Planner',
    description: 'Plan and optimize resource allocation across projects',
    seo_title: 'Free Resource Allocation Planner Online - Team Planning | U2Tool',
    seo_description: 'Plan resource allocation across projects. Optimize team utilization.',
    detailed_description: 'Resource Allocation Planner helps distribute team members across projects and tasks.',
    usage_steps: ['Add team members', 'Create projects/tasks', 'Assign resources', 'View visualization', 'Resolve conflicts'],
    usage_examples: ['Plan multi-project allocation', 'Balance workload', 'Identify bottlenecks']
  },
  'project-risk-analyzer': {
    name: 'Project Risk Analyzer',
    description: 'Identify and assess project risks with mitigation strategies',
    seo_title: 'Free Project Risk Analyzer Online - Risk Assessment | U2Tool',
    seo_description: 'Analyze project risks with probability and impact assessment. Create risk matrices.',
    detailed_description: 'Project Risk Analyzer helps identify, assess, and prioritize project risks.',
    usage_steps: ['Add potential risks', 'Assess probability/impact', 'View risk matrix', 'Prioritize by score', 'Document mitigation'],
    usage_examples: ['Assess project risks', 'Create risk registers', 'Prioritize mitigation']
  },
  'milestone-tracker': {
    name: 'Milestone Tracker',
    description: 'Track project milestones and deadlines',
    seo_title: 'Free Milestone Tracker Online - Project Timeline | U2Tool',
    seo_description: 'Track project milestones and deadlines. Visualize project timeline.',
    detailed_description: 'Milestone Tracker helps define, track, and visualize project milestones.',
    usage_steps: ['Add milestones with dates', 'Set descriptions/owners', 'Track completion', 'View timeline', 'Export report'],
    usage_examples: ['Track release milestones', 'Monitor phase completions', 'Report to stakeholders']
  },
  'team-capacity-planner': {
    name: 'Team Capacity Planner',
    description: 'Plan team capacity and workload distribution',
    seo_title: 'Free Team Capacity Planner Online - Workload Planning | U2Tool',
    seo_description: 'Plan team capacity and workload. Calculate available hours.',
    detailed_description: 'Team Capacity Planner calculates available team capacity considering holidays and meetings.',
    usage_steps: ['Add team members', 'Set working hours', 'Account for meetings', 'Calculate capacity', 'Plan allocation'],
    usage_examples: ['Plan sprint capacity', 'Account for holidays', 'Balance workload']
  },
  'meeting-minutes-generator': {
    name: 'Meeting Minutes Generator',
    description: 'Generate structured meeting minutes from notes',
    seo_title: 'Free Meeting Minutes Generator Online - Notes Template | U2Tool',
    seo_description: 'Generate professional meeting minutes. Structured templates for notes.',
    detailed_description: 'Meeting Minutes Generator creates professional, structured meeting minutes from your notes.',
    usage_steps: ['Enter meeting details', 'Add agenda items', 'Record decisions', 'List action items', 'Generate and export'],
    usage_examples: ['Document team meetings', 'Create board minutes', 'Track action items']
  },
  'timezone-meeting-scheduler': {
    name: 'Timezone Meeting Scheduler',
    description: 'Schedule meetings across multiple time zones',
    seo_title: 'Free Timezone Meeting Scheduler Online - World Clock | U2Tool',
    seo_description: 'Schedule meetings across time zones. Find best meeting times globally.',
    detailed_description: 'Timezone Meeting Scheduler helps find optimal meeting times for participants across different time zones.',
    usage_steps: ['Add participant locations', 'Set meeting duration', 'View time comparison', 'Find overlapping hours', 'Select and share time'],
    usage_examples: ['Schedule international calls', 'Find US-Europe meeting times', 'Coordinate remote teams']
  },
  'meeting-agenda-builder': {
    name: 'Meeting Agenda Builder',
    description: 'Create structured meeting agendas with time allocations',
    seo_title: 'Free Meeting Agenda Builder Online - Agenda Template | U2Tool',
    seo_description: 'Create professional meeting agendas. Set time allocations for topics.',
    detailed_description: 'Meeting Agenda Builder helps create structured, time-boxed meeting agendas.',
    usage_steps: ['Set meeting title/duration', 'Add agenda items', 'Assign presenters', 'Add objectives', 'Export and share'],
    usage_examples: ['Plan team meetings', 'Create client agendas', 'Structure workshops']
  },
  'calendar-availability-finder': {
    name: 'Calendar Availability Finder',
    description: 'Find common available time slots across calendars',
    seo_title: 'Free Calendar Availability Finder Online - Schedule Tool | U2Tool',
    seo_description: 'Find common free time slots across multiple calendars. Schedule meetings easily.',
    detailed_description: 'Calendar Availability Finder helps find common free time slots when scheduling with multiple people.',
    usage_steps: ['Add participant availability', 'Set meeting duration', 'Specify date range', 'View common slots', 'Select meeting time'],
    usage_examples: ['Find team meeting times', 'Schedule interviews', 'Coordinate group events']
  },
  'meeting-room-finder': {
    name: 'Meeting Room Finder',
    description: 'Find and book available meeting rooms',
    seo_title: 'Free Meeting Room Finder Online - Room Booking | U2Tool',
    seo_description: 'Find available meeting rooms by capacity and amenities. Plan room bookings.',
    detailed_description: 'Meeting Room Finder helps locate available meeting rooms based on capacity and amenities.',
    usage_steps: ['Enter meeting date/time', 'Specify capacity', 'Select amenities', 'View available rooms', 'Select and book'],
    usage_examples: ['Find team meeting rooms', 'Book conference rooms', 'Reserve workshop spaces']
  },
  'invoice-template-generator': {
    name: 'Invoice Template Generator',
    description: 'Generate professional invoice templates with customization',
    seo_title: 'Free Invoice Generator Online - Professional Templates | U2Tool',
    seo_description: 'Generate professional invoices with customizable templates. Add logo, items, taxes.',
    detailed_description: 'Invoice Template Generator creates professional invoices with customizable templates.',
    usage_steps: ['Enter business info', 'Add client details', 'List products/services', 'Configure taxes', 'Generate and download'],
    usage_examples: ['Create freelance invoices', 'Generate recurring invoices', 'Customize for branding']
  },
  'expense-report-generator': {
    name: 'Expense Report Generator',
    description: 'Create expense reports with categorization and totals',
    seo_title: 'Free Expense Report Generator Online - Expense Tracker | U2Tool',
    seo_description: 'Create expense reports with categories and totals. Track business expenses.',
    detailed_description: 'Expense Report Generator creates organized expense reports with categorization and automatic totals.',
    usage_steps: ['Add expense items', 'Categorize expenses', 'Attach receipts', 'Review totals', 'Export report'],
    usage_examples: ['Create travel reports', 'Track project expenses', 'Generate reimbursement requests']
  },
  'budget-variance-analyzer': {
    name: 'Budget Variance Analyzer',
    description: 'Analyze budget vs actual spending variances',
    seo_title: 'Free Budget Variance Analyzer Online - Financial Analysis | U2Tool',
    seo_description: 'Analyze budget vs actual spending. Calculate variances and percentages.',
    detailed_description: 'Budget Variance Analyzer compares planned budget against actual spending to identify variances.',
    usage_steps: ['Enter budget items', 'Add actual spending', 'View variances', 'Analyze percentages', 'Export report'],
    usage_examples: ['Analyze monthly budget', 'Track project variances', 'Report to stakeholders']
  },
  'cost-benefit-analyzer': {
    name: 'Cost-Benefit Analyzer',
    description: 'Calculate ROI and analyze cost-benefit ratios',
    seo_title: 'Free Cost-Benefit Analyzer Online - ROI Calculator | U2Tool',
    seo_description: 'Calculate ROI and cost-benefit ratios. Analyze investment decisions.',
    detailed_description: 'Cost-Benefit Analyzer helps evaluate investments by calculating ROI and payback period.',
    usage_steps: ['Enter investment costs', 'Add expected benefits', 'Include ongoing costs', 'Calculate ROI', 'Compare scenarios'],
    usage_examples: ['Evaluate software purchases', 'Analyze project returns', 'Compare vendor proposals']
  },
  'financial-forecast-calculator': {
    name: 'Financial Forecast Calculator',
    description: 'Create financial forecasts using various models',
    seo_title: 'Free Financial Forecast Calculator Online - Projections | U2Tool',
    seo_description: 'Create financial forecasts and projections. Use trend analysis and growth models.',
    detailed_description: 'Financial Forecast Calculator creates projections using historical data and growth models.',
    usage_steps: ['Enter historical data', 'Select forecast model', 'Set forecast period', 'Adjust assumptions', 'View projections'],
    usage_examples: ['Forecast revenue', 'Project cash flow', 'Create investor projections']
  },
};


interface ToolTranslation {
  name: string;
  description: string;
  seo_title: string;
  seo_description: string;
  detailed_description: string;
  usage_steps: string[];
  usage_examples: string[];
  input?: string;
  output?: string;
  process?: string;
  copy?: string;
  clear?: string;
  inputPlaceholder?: string;
  outputPlaceholder?: string;
  errors?: { emptyInput?: string };
}

const LOCALE_SEO_HINTS: Record<string, string> = {
  zh: '使用"免费"、"在线"、"工具"等中国用户常用搜索词',
  ja: '「無料」「オンライン」「登録不要」などのキーワードを含める',
  ko: '"무료", "온라인", "가입 불필요" 등의 키워드 포함',
  es: 'Incluir "gratis", "online", "sin registro"',
  pt: 'Incluir "grátis", "online", "sem cadastro"',
  fr: 'Inclure "gratuit", "en ligne", "sans inscription"',
  de: 'Schlüsselwörter "kostenlos", "online", "ohne Anmeldung"',
  ru: 'Включить "бесплатно", "онлайн", "без регистрации"',
  ar: 'تضمين "مجاني"، "أونلاين"، "بدون تسجيل"',
};

async function translateWithNvidia(
  content: ToolTranslation,
  targetLocale: string
): Promise<ToolTranslation | null> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    console.error('❌ 请设置 NVIDIA_API_KEY 环境变量');
    process.exit(1);
  }

  const localeName = LOCALE_NAMES[targetLocale];
  const seoHints = LOCALE_SEO_HINTS[targetLocale] || '';

  const systemPrompt = `You are an expert translator. Translate JSON content from English to ${localeName} with SEO optimization.
Rules:
1. Write naturally as a native speaker
2. Optimize for search engines: ${seoHints}
3. Keep exact JSON structure, only translate string values
4. Return ONLY valid JSON - no markdown, no explanations`;

  const userPrompt = `Translate to ${localeName}. Return ONLY JSON:
${JSON.stringify(content, null, 2)}`;

  try {
    const response = await fetch(CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: CONFIG.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) return null;

    let jsonStr = text;
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const match = jsonStr.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]) as ToolTranslation;
    }
    return null;
  } catch {
    return null;
  }
}

function readJsonFile(filePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJsonFile(filePath: string, data: Record<string, unknown>): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

async function main(): Promise<void> {
  console.log('🚀 开始使用 NVIDIA API 更新 Batch 54 工具翻译...\n');
  console.log(`📦 使用模型: ${CONFIG.model}\n`);

  const toolSlugs = Object.keys(BATCH54_CONTENT);
  
  // 首先更新英文
  console.log('📝 更新英文翻译...');
  const enPath = path.join(CONFIG.messagesDir, 'en.json');
  const enData = readJsonFile(enPath) as { tools: Record<string, ToolTranslation> };
  
  for (const slug of toolSlugs) {
    const content = BATCH54_CONTENT[slug];
    enData.tools[slug] = {
      ...content,
      input: 'Input',
      output: 'Output',
      process: 'Process',
      copy: 'Copy',
      clear: 'Clear',
      inputPlaceholder: 'Enter your input here...',
      outputPlaceholder: 'Results will appear here...',
      errors: { emptyInput: 'Please enter some input' }
    };
  }
  writeJsonFile(enPath, enData);
  console.log(`✅ 英文翻译已更新 (${toolSlugs.length} 个工具)\n`);

  // 翻译到其他语言
  for (const locale of TARGET_LOCALES) {
    console.log(`\n🌐 翻译到 ${locale} (${LOCALE_NAMES[locale]})...`);
    const localePath = path.join(CONFIG.messagesDir, `${locale}.json`);
    const localeData = readJsonFile(localePath) as { tools: Record<string, ToolTranslation> };
    
    let success = 0, fail = 0;
    
    for (let i = 0; i < toolSlugs.length; i++) {
      const slug = toolSlugs[i];
      const enContent = enData.tools[slug];
      
      process.stdout.write(`  [${i + 1}/${toolSlugs.length}] ${slug}... `);
      
      const translated = await translateWithNvidia(enContent, locale);
      
      if (translated) {
        localeData.tools[slug] = translated;
        console.log('✅');
        success++;
      } else {
        console.log('❌');
        fail++;
      }
      
      if ((i + 1) % 10 === 0) writeJsonFile(localePath, localeData);
      await new Promise(r => setTimeout(r, 300));
    }
    
    writeJsonFile(localePath, localeData);
    console.log(`  完成: ${success}/${toolSlugs.length} 成功`);
  }

  console.log('\n✅ 所有翻译完成！');
  console.log('📋 后续步骤: npx tsx scripts/split-translations.ts');
}

main().catch(console.error);
