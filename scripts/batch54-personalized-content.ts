/**
 * 为 Batch 54 工具生成个性化内容并翻译到所有语言
 * 
 * 使用方法:
 *   npx tsx scripts/batch54-personalized-content.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const CONFIG = {
  apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
  messagesDir: path.join(process.cwd(), 'src', 'messages'),
  model: 'THUDM/glm-4-9b-chat',
};

const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  zh: 'Simplified Chinese (简体中文)',
  ja: 'Japanese (日本語)',
  ko: 'Korean (한국어)',
  es: 'Spanish (Español)',
  pt: 'Portuguese (Português)',
  fr: 'French (Français)',
  de: 'German (Deutsch)',
  ru: 'Russian (Русский)',
  ar: 'Arabic (العربية)',
};


// Batch 54 工具的个性化内容定义
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
    seo_description: 'Convert cURL commands to Python, JavaScript, Go, PHP code instantly. Free online tool, no registration required. Perfect for API development.',
    detailed_description: 'cURL to Code Generator converts cURL commands into working code snippets for multiple programming languages including Python (requests), JavaScript (fetch/axios), Go, PHP, Ruby, and more. Simply paste your cURL command and get clean, ready-to-use code.',
    usage_steps: [
      'Paste your cURL command in the input field',
      'Select your target programming language',
      'Choose the HTTP library (e.g., requests, axios)',
      'Click Convert to generate the code',
      'Copy the generated code to your project'
    ],
    usage_examples: [
      'Convert API test cURL commands to Python requests code',
      'Generate JavaScript fetch code from browser DevTools cURL',
      'Create Go HTTP client code from cURL examples in documentation'
    ]
  },
  'http-status-code-reference': {
    name: 'HTTP Status Code Reference',
    description: 'Complete HTTP status code reference with explanations and solutions',
    seo_title: 'HTTP Status Codes Reference - Complete List & Solutions | U2Tool',
    seo_description: 'Complete HTTP status code reference with detailed explanations, common causes, and solutions. Search 1xx-5xx codes instantly. Free developer tool.',
    detailed_description: 'HTTP Status Code Reference provides a comprehensive guide to all HTTP response codes from 1xx to 5xx. Each code includes detailed explanations, common causes, troubleshooting tips, and best practices for handling in your applications.',
    usage_steps: [
      'Enter the HTTP status code you want to look up',
      'Or browse by category (1xx, 2xx, 3xx, 4xx, 5xx)',
      'View the detailed explanation and common causes',
      'Check the recommended solutions and best practices',
      'Copy code examples for error handling'
    ],
    usage_examples: [
      'Debug API responses by understanding status codes',
      'Learn proper error handling for 4xx and 5xx errors',
      'Understand redirect codes (301, 302, 307, 308) for SEO'
    ]
  },
  'jwt-payload-decoder': {
    name: 'JWT Payload Decoder',
    description: 'Decode and inspect JWT token payloads without verification',
    seo_title: 'Free JWT Decoder Online - Decode Token Payload | U2Tool',
    seo_description: 'Decode JWT tokens instantly and inspect payload claims. Free online JWT decoder, no verification needed. View header, payload, and expiration.',
    detailed_description: 'JWT Payload Decoder extracts and displays the header and payload from JSON Web Tokens without requiring the secret key. View claims like iss, sub, exp, iat, and custom data. Perfect for debugging authentication issues.',
    usage_steps: [
      'Paste your JWT token in the input field',
      'The token is automatically decoded',
      'View the decoded header (algorithm, type)',
      'Inspect the payload claims and custom data',
      'Check token expiration and validity timestamps'
    ],
    usage_examples: [
      'Debug authentication issues by inspecting token claims',
      'Verify token expiration times during development',
      'Extract user information from access tokens'
    ]
  },
  'base64-image-converter': {
    name: 'Base64 Image Converter',
    description: 'Convert images to Base64 strings and Base64 to images',
    seo_title: 'Free Base64 Image Converter Online - Encode/Decode | U2Tool',
    seo_description: 'Convert images to Base64 data URIs and decode Base64 back to images. Free online tool for embedding images in HTML, CSS, and JSON.',
    detailed_description: 'Base64 Image Converter encodes images (PNG, JPG, GIF, SVG, WebP) to Base64 data URI strings for embedding in HTML/CSS, and decodes Base64 strings back to downloadable images. Supports drag-and-drop and clipboard paste.',
    usage_steps: [
      'Upload an image or paste Base64 string',
      'For encoding: drag image or click to upload',
      'For decoding: paste the Base64 string',
      'Preview the result in real-time',
      'Copy the Base64 string or download the image'
    ],
    usage_examples: [
      'Embed small icons directly in CSS as data URIs',
      'Convert API response Base64 images to viewable files',
      'Create inline images for HTML email templates'
    ]
  },
  'url-query-string-parser': {
    name: 'URL Query String Parser',
    description: 'Parse and analyze URL query parameters into key-value pairs',
    seo_title: 'Free URL Query String Parser Online - Decode Parameters | U2Tool',
    seo_description: 'Parse URL query strings into readable key-value pairs. Decode URL-encoded parameters instantly. Free online tool for developers.',
    detailed_description: 'URL Query String Parser breaks down complex URLs into their components, extracting and decoding query parameters into a readable table format. Supports URL-encoded values, arrays, and nested parameters.',
    usage_steps: [
      'Paste the full URL or just the query string',
      'View parsed parameters in a table format',
      'See decoded values for URL-encoded strings',
      'Edit parameter values if needed',
      'Copy individual values or rebuild the URL'
    ],
    usage_examples: [
      'Debug tracking parameters in marketing URLs',
      'Analyze OAuth callback URLs and tokens',
      'Extract and modify API endpoint parameters'
    ]
  },
  'request-header-builder': {
    name: 'HTTP Request Header Builder',
    description: 'Build and format HTTP request headers for API testing',
    seo_title: 'Free HTTP Header Builder Online - API Testing Tool | U2Tool',
    seo_description: 'Build HTTP request headers easily with our free online tool. Add Authorization, Content-Type, custom headers. Export for cURL, Postman.',
    detailed_description: 'HTTP Request Header Builder helps you construct properly formatted HTTP headers for API requests. Includes common headers like Authorization, Content-Type, Accept, and custom headers. Export to cURL, fetch, or copy as JSON.',
    usage_steps: [
      'Select common headers from the dropdown',
      'Or add custom header name and value',
      'Configure Authorization (Bearer, Basic, API Key)',
      'Set Content-Type and Accept headers',
      'Export headers in your preferred format'
    ],
    usage_examples: [
      'Build Authorization headers for API testing',
      'Create CORS headers for cross-origin requests',
      'Generate headers for webhook integrations'
    ]
  },
  'webhook-tester': {
    name: 'Webhook Tester',
    description: 'Test and debug webhook endpoints with custom payloads',
    seo_title: 'Free Webhook Tester Online - Test Endpoints | U2Tool',
    seo_description: 'Test webhook endpoints with custom JSON payloads. Debug webhook integrations easily. Free online tool with request/response logging.',
    detailed_description: 'Webhook Tester allows you to send test requests to webhook endpoints with custom payloads, headers, and HTTP methods. View detailed request and response information for debugging integrations.',
    usage_steps: [
      'Enter your webhook endpoint URL',
      'Select the HTTP method (POST, PUT, etc.)',
      'Add custom headers if required',
      'Enter your JSON payload',
      'Send the request and view the response'
    ],
    usage_examples: [
      'Test Stripe webhook endpoints during development',
      'Debug GitHub webhook integrations',
      'Verify Slack incoming webhook configurations'
    ]
  },
  'api-response-formatter': {
    name: 'API Response Formatter',
    description: 'Format and beautify API responses (JSON, XML) for readability',
    seo_title: 'Free API Response Formatter Online - JSON/XML Beautifier | U2Tool',
    seo_description: 'Format and beautify API responses instantly. Support for JSON and XML. Syntax highlighting, collapsible nodes. Free online developer tool.',
    detailed_description: 'API Response Formatter beautifies and formats raw API responses in JSON or XML format. Features syntax highlighting, collapsible tree view, search functionality, and the ability to copy formatted or minified output.',
    usage_steps: [
      'Paste your API response (JSON or XML)',
      'Auto-detect format or select manually',
      'View formatted output with syntax highlighting',
      'Expand/collapse nested objects and arrays',
      'Copy formatted or minified version'
    ],
    usage_examples: [
      'Format minified JSON responses for debugging',
      'Beautify XML SOAP responses for analysis',
      'Compare API responses side by side'
    ]
  },
  'sql-to-mongodb-converter': {
    name: 'SQL to MongoDB Converter',
    description: 'Convert SQL queries to MongoDB query syntax',
    seo_title: 'Free SQL to MongoDB Converter Online - Query Translator | U2Tool',
    seo_description: 'Convert SQL queries to MongoDB syntax instantly. Support SELECT, INSERT, UPDATE, DELETE. Free online tool for database migration.',
    detailed_description: 'SQL to MongoDB Converter translates SQL queries into equivalent MongoDB query syntax. Supports SELECT, INSERT, UPDATE, DELETE statements and converts WHERE clauses, JOINs, and aggregations to MongoDB operators.',
    usage_steps: [
      'Paste your SQL query in the input field',
      'Select the target MongoDB driver (Node.js, Python, etc.)',
      'Click Convert to generate MongoDB query',
      'View the equivalent MongoDB syntax',
      'Copy the query for use in your application'
    ],
    usage_examples: [
      'Migrate SQL queries to MongoDB during database transition',
      'Learn MongoDB syntax by comparing with familiar SQL',
      'Convert complex WHERE clauses to MongoDB $match'
    ]
  },
  'json-to-protobuf-converter': {
    name: 'JSON to Protobuf Converter',
    description: 'Generate Protocol Buffer definitions from JSON data',
    seo_title: 'Free JSON to Protobuf Converter Online - Proto Generator | U2Tool',
    seo_description: 'Generate Protocol Buffer (.proto) definitions from JSON data. Automatic type inference. Free online tool for gRPC development.',
    detailed_description: 'JSON to Protobuf Converter analyzes JSON data structure and generates corresponding Protocol Buffer message definitions. Automatically infers field types, handles nested objects, and creates valid .proto files.',
    usage_steps: [
      'Paste your JSON data in the input field',
      'Enter the message name for the root object',
      'Configure options (package name, syntax version)',
      'Click Generate to create .proto definition',
      'Download or copy the generated .proto file'
    ],
    usage_examples: [
      'Create .proto files from existing JSON API responses',
      'Generate message definitions for gRPC services',
      'Convert JSON schemas to Protocol Buffers'
    ]
  },
  'regex-to-code-generator': {
    name: 'Regex to Code Generator',
    description: 'Generate code snippets for regex patterns in multiple languages',
    seo_title: 'Free Regex to Code Generator Online - Pattern to Code | U2Tool',
    seo_description: 'Generate regex code for Python, JavaScript, Java, Go, and more. Convert patterns to working code snippets. Free online developer tool.',
    detailed_description: 'Regex to Code Generator converts regular expression patterns into ready-to-use code snippets for various programming languages. Includes match, search, replace, and split operations with proper escaping and flags.',
    usage_steps: [
      'Enter your regular expression pattern',
      'Select the target programming language',
      'Choose the operation (match, replace, split)',
      'Configure flags (global, case-insensitive, etc.)',
      'Copy the generated code snippet'
    ],
    usage_examples: [
      'Generate Python re module code from regex patterns',
      'Create JavaScript RegExp code with proper escaping',
      'Convert regex to Java Pattern/Matcher code'
    ]
  },
  'swagger-to-code-generator': {
    name: 'Swagger to Code Generator',
    description: 'Generate API client code from Swagger/OpenAPI specifications',
    seo_title: 'Free Swagger to Code Generator Online - OpenAPI Client | U2Tool',
    seo_description: 'Generate API client code from Swagger/OpenAPI specs. Support TypeScript, Python, Go. Free online code generator for API integration.',
    detailed_description: 'Swagger to Code Generator creates API client code from OpenAPI/Swagger specifications. Generates typed interfaces, API methods, and request/response models for TypeScript, Python, Go, and other languages.',
    usage_steps: [
      'Paste your Swagger/OpenAPI JSON or YAML',
      'Select the target programming language',
      'Choose the HTTP client library',
      'Configure generation options',
      'Download the generated client code'
    ],
    usage_examples: [
      'Generate TypeScript API client from OpenAPI spec',
      'Create Python SDK from Swagger documentation',
      'Build Go HTTP client from API specification'
    ]
  },
  'database-migration-generator': {
    name: 'Database Migration Generator',
    description: 'Generate database migration scripts for schema changes',
    seo_title: 'Free Database Migration Generator Online - SQL Scripts | U2Tool',
    seo_description: 'Generate database migration scripts for MySQL, PostgreSQL, SQLite. Create tables, add columns, indexes. Free online migration tool.',
    detailed_description: 'Database Migration Generator creates migration scripts for common database operations. Supports creating tables, adding/modifying columns, indexes, and foreign keys for MySQL, PostgreSQL, and SQLite.',
    usage_steps: [
      'Select the migration type (create table, add column, etc.)',
      'Choose your database type (MySQL, PostgreSQL, SQLite)',
      'Define the schema changes',
      'Generate up and down migration scripts',
      'Copy or download the migration files'
    ],
    usage_examples: [
      'Generate CREATE TABLE migrations for new features',
      'Create ALTER TABLE scripts for schema updates',
      'Build index migrations for query optimization'
    ]
  },
  'environment-variables-generator': {
    name: 'Environment Variables Generator',
    description: 'Generate .env files and environment variable configurations',
    seo_title: 'Free .env File Generator Online - Environment Variables | U2Tool',
    seo_description: 'Generate .env files with proper formatting. Create environment variable templates. Free online tool for configuration management.',
    detailed_description: 'Environment Variables Generator helps create properly formatted .env files for your projects. Includes templates for common services (databases, APIs, cloud providers) and validates variable naming conventions.',
    usage_steps: [
      'Select a template or start from scratch',
      'Add environment variable names and values',
      'Use the secret generator for secure values',
      'Validate variable naming conventions',
      'Export as .env, .env.example, or JSON'
    ],
    usage_examples: [
      'Create .env.example templates for team projects',
      'Generate secure API keys and secrets',
      'Build configuration files for Docker deployments'
    ]
  },
  'docker-compose-generator-advanced': {
    name: 'Docker Compose Generator',
    description: 'Generate Docker Compose configurations for multi-container apps',
    seo_title: 'Free Docker Compose Generator Online - YAML Config | U2Tool',
    seo_description: 'Generate Docker Compose YAML files easily. Configure services, networks, volumes. Free online tool for container orchestration.',
    detailed_description: 'Docker Compose Generator creates docker-compose.yml configurations for multi-container applications. Includes templates for common stacks (LAMP, MEAN, etc.) and supports services, networks, volumes, and environment variables.',
    usage_steps: [
      'Select services from the template library',
      'Configure ports, volumes, and environment variables',
      'Set up networks and dependencies',
      'Add health checks and restart policies',
      'Download the generated docker-compose.yml'
    ],
    usage_examples: [
      'Create development environment with database and cache',
      'Generate production-ready compose files',
      'Build microservices stack configurations'
    ]
  },
  'kubernetes-manifest-generator': {
    name: 'Kubernetes Manifest Generator',
    description: 'Generate Kubernetes deployment manifests (YAML)',
    seo_title: 'Free Kubernetes YAML Generator Online - K8s Manifests | U2Tool',
    seo_description: 'Generate Kubernetes deployment, service, and ingress manifests. Create K8s YAML files easily. Free online tool for container orchestration.',
    detailed_description: 'Kubernetes Manifest Generator creates YAML manifests for Deployments, Services, ConfigMaps, Secrets, Ingress, and other K8s resources. Includes best practices for resource limits, probes, and security contexts.',
    usage_steps: [
      'Select the resource type (Deployment, Service, etc.)',
      'Configure container image and ports',
      'Set resource limits and requests',
      'Add environment variables and secrets',
      'Download the generated YAML manifest'
    ],
    usage_examples: [
      'Generate Deployment manifests for microservices',
      'Create Service and Ingress configurations',
      'Build ConfigMap and Secret resources'
    ]
  },
  'code-complexity-analyzer': {
    name: 'Code Complexity Analyzer',
    description: 'Analyze code complexity metrics (cyclomatic complexity, LOC)',
    seo_title: 'Free Code Complexity Analyzer Online - Metrics Tool | U2Tool',
    seo_description: 'Analyze code complexity with cyclomatic complexity, lines of code, and maintainability index. Free online code quality tool.',
    detailed_description: 'Code Complexity Analyzer calculates various complexity metrics including cyclomatic complexity, lines of code (LOC), Halstead metrics, and maintainability index. Supports JavaScript, TypeScript, Python, and Java.',
    usage_steps: [
      'Paste your code in the input field',
      'Select the programming language',
      'Click Analyze to calculate metrics',
      'View complexity scores and recommendations',
      'Identify functions that need refactoring'
    ],
    usage_examples: [
      'Identify overly complex functions for refactoring',
      'Track code quality metrics over time',
      'Enforce complexity limits in code reviews'
    ]
  },
  'dependency-vulnerability-checker': {
    name: 'Dependency Vulnerability Checker',
    description: 'Check package dependencies for known security vulnerabilities',
    seo_title: 'Free Dependency Vulnerability Scanner Online | U2Tool',
    seo_description: 'Scan package.json, requirements.txt for security vulnerabilities. Check npm, pip dependencies. Free online security tool.',
    detailed_description: 'Dependency Vulnerability Checker scans your project dependencies for known security vulnerabilities. Supports package.json (npm), requirements.txt (pip), and other package manifests. Shows CVE details and fix recommendations.',
    usage_steps: [
      'Paste your package.json or requirements.txt',
      'Click Scan to check for vulnerabilities',
      'View vulnerability details and severity levels',
      'See recommended version upgrades',
      'Export the security report'
    ],
    usage_examples: [
      'Audit npm dependencies before deployment',
      'Check Python packages for security issues',
      'Generate security reports for compliance'
    ]
  },
  'performance-profiler': {
    name: 'Code Performance Profiler',
    description: 'Profile code performance and identify bottlenecks',
    seo_title: 'Free Code Performance Profiler Online - Benchmark Tool | U2Tool',
    seo_description: 'Profile JavaScript code performance. Measure execution time, identify bottlenecks. Free online benchmarking tool for developers.',
    detailed_description: 'Code Performance Profiler measures execution time and identifies performance bottlenecks in your code. Run benchmarks, compare implementations, and get optimization suggestions for JavaScript and TypeScript.',
    usage_steps: [
      'Paste your code functions to profile',
      'Set the number of iterations for benchmarking',
      'Click Run to execute the profiler',
      'View execution times and statistics',
      'Compare multiple implementations'
    ],
    usage_examples: [
      'Benchmark different algorithm implementations',
      'Identify slow functions in your codebase',
      'Compare library performance for the same task'
    ]
  },
  'memory-leak-detector': {
    name: 'Memory Leak Detector',
    description: 'Detect potential memory leaks in code patterns',
    seo_title: 'Free Memory Leak Detector Online - Code Analysis | U2Tool',
    seo_description: 'Detect potential memory leaks in JavaScript code. Find event listener leaks, closure issues. Free online code analysis tool.',
    detailed_description: 'Memory Leak Detector analyzes code patterns to identify potential memory leaks. Detects common issues like unremoved event listeners, closure references, circular references, and timer leaks in JavaScript/TypeScript.',
    usage_steps: [
      'Paste your JavaScript/TypeScript code',
      'Click Analyze to scan for leak patterns',
      'View detected potential memory leaks',
      'Read explanations and fix suggestions',
      'Apply recommended code changes'
    ],
    usage_examples: [
      'Find event listener leaks in React components',
      'Detect closure-related memory issues',
      'Identify timer and interval leaks'
    ]
  },
  'code-duplication-finder': {
    name: 'Code Duplication Finder',
    description: 'Find duplicate code blocks and suggest refactoring',
    seo_title: 'Free Code Duplication Finder Online - DRY Analysis | U2Tool',
    seo_description: 'Find duplicate code blocks in your codebase. Identify copy-paste code for refactoring. Free online code quality tool.',
    detailed_description: 'Code Duplication Finder identifies duplicate or similar code blocks that violate the DRY (Don\'t Repeat Yourself) principle. Highlights duplicates, calculates similarity scores, and suggests refactoring opportunities.',
    usage_steps: [
      'Paste your code in the input field',
      'Set the minimum block size to detect',
      'Click Find Duplicates to analyze',
      'View highlighted duplicate blocks',
      'Get refactoring suggestions'
    ],
    usage_examples: [
      'Find copy-pasted code for refactoring',
      'Identify candidates for utility functions',
      'Reduce code maintenance burden'
    ]
  },
  'unused-imports-finder': {
    name: 'Unused Imports Finder',
    description: 'Identify unused imports and dependencies in code',
    seo_title: 'Free Unused Imports Finder Online - Code Cleanup | U2Tool',
    seo_description: 'Find unused imports in JavaScript, TypeScript, Python code. Clean up dead imports. Free online code optimization tool.',
    detailed_description: 'Unused Imports Finder scans your code to identify imports that are declared but never used. Supports JavaScript, TypeScript, and Python. Helps reduce bundle size and improve code cleanliness.',
    usage_steps: [
      'Paste your code with import statements',
      'Select the programming language',
      'Click Analyze to find unused imports',
      'View the list of unused imports',
      'Copy cleaned code without unused imports'
    ],
    usage_examples: [
      'Clean up unused npm package imports',
      'Reduce JavaScript bundle size',
      'Maintain clean import statements'
    ]
  },
  'dead-code-analyzer': {
    name: 'Dead Code Analyzer',
    description: 'Find unreachable or dead code that can be removed',
    seo_title: 'Free Dead Code Analyzer Online - Unreachable Code Finder | U2Tool',
    seo_description: 'Find dead and unreachable code in your codebase. Identify unused functions and variables. Free online code cleanup tool.',
    detailed_description: 'Dead Code Analyzer identifies code that is never executed or referenced. Finds unreachable code after return statements, unused functions, and variables that are declared but never used.',
    usage_steps: [
      'Paste your code in the input field',
      'Select the programming language',
      'Click Analyze to find dead code',
      'View unreachable code locations',
      'Get suggestions for safe removal'
    ],
    usage_examples: [
      'Find functions that are never called',
      'Identify code after return statements',
      'Clean up legacy code safely'
    ]
  },
  'sql-query-optimizer': {
    name: 'SQL Query Optimizer',
    description: 'Analyze and optimize SQL queries for better performance',
    seo_title: 'Free SQL Query Optimizer Online - Performance Tips | U2Tool',
    seo_description: 'Optimize SQL queries for better performance. Get index suggestions, query rewrites. Free online database optimization tool.',
    detailed_description: 'SQL Query Optimizer analyzes your SQL queries and provides optimization suggestions. Identifies missing indexes, inefficient JOINs, and suboptimal WHERE clauses. Supports MySQL, PostgreSQL, and SQL Server syntax.',
    usage_steps: [
      'Paste your SQL query in the input field',
      'Select your database type',
      'Click Optimize to analyze the query',
      'View optimization suggestions',
      'Apply recommended changes'
    ],
    usage_examples: [
      'Optimize slow SELECT queries',
      'Get index recommendations for tables',
      'Rewrite inefficient subqueries'
    ]
  },
  'database-schema-visualizer': {
    name: 'Database Schema Visualizer',
    description: 'Visualize database schemas and table relationships',
    seo_title: 'Free Database Schema Visualizer Online - ER Diagram | U2Tool',
    seo_description: 'Visualize database schemas as ER diagrams. See table relationships and foreign keys. Free online database design tool.',
    detailed_description: 'Database Schema Visualizer creates visual ER diagrams from SQL CREATE TABLE statements. Shows tables, columns, data types, primary keys, foreign keys, and relationships in an interactive diagram.',
    usage_steps: [
      'Paste your CREATE TABLE statements',
      'Click Visualize to generate the diagram',
      'View tables and their relationships',
      'Drag tables to arrange the layout',
      'Export the diagram as PNG or SVG'
    ],
    usage_examples: [
      'Document database structure for team',
      'Understand legacy database relationships',
      'Plan database schema changes visually'
    ]
  },
  'sql-injection-tester': {
    name: 'SQL Injection Tester',
    description: 'Test SQL queries for injection vulnerabilities',
    seo_title: 'Free SQL Injection Tester Online - Security Scanner | U2Tool',
    seo_description: 'Test SQL queries for injection vulnerabilities. Identify security risks in database queries. Free online security testing tool.',
    detailed_description: 'SQL Injection Tester analyzes SQL queries and code patterns to identify potential SQL injection vulnerabilities. Tests for common attack vectors and provides secure coding recommendations.',
    usage_steps: [
      'Paste your SQL query or code snippet',
      'Enter test input values',
      'Click Test to check for vulnerabilities',
      'View detected security issues',
      'Get parameterized query examples'
    ],
    usage_examples: [
      'Test user input handling in queries',
      'Identify vulnerable string concatenation',
      'Learn secure parameterized query patterns'
    ]
  },
  'database-connection-tester': {
    name: 'Database Connection Tester',
    description: 'Test database connection strings and configurations',
    seo_title: 'Free Database Connection Tester Online - Validate Config | U2Tool',
    seo_description: 'Test and validate database connection strings. Parse MySQL, PostgreSQL, MongoDB URIs. Free online database configuration tool.',
    detailed_description: 'Database Connection Tester parses and validates database connection strings for MySQL, PostgreSQL, MongoDB, and other databases. Extracts host, port, database name, and credentials for verification.',
    usage_steps: [
      'Paste your database connection string',
      'Select the database type',
      'Click Parse to extract components',
      'View parsed connection details',
      'Validate the connection string format'
    ],
    usage_examples: [
      'Validate connection strings before deployment',
      'Parse complex MongoDB URIs',
      'Debug connection configuration issues'
    ]
  },
  'query-execution-planner': {
    name: 'Query Execution Planner',
    description: 'Analyze query execution plans and suggest optimizations',
    seo_title: 'Free Query Execution Plan Analyzer Online | U2Tool',
    seo_description: 'Analyze SQL query execution plans. Understand EXPLAIN output. Get optimization tips. Free online database performance tool.',
    detailed_description: 'Query Execution Planner helps you understand and optimize SQL query execution plans. Parses EXPLAIN output, visualizes query steps, and identifies performance bottlenecks like full table scans.',
    usage_steps: [
      'Paste your EXPLAIN output or SQL query',
      'Select your database type',
      'Click Analyze to parse the plan',
      'View the execution plan visualization',
      'Get optimization recommendations'
    ],
    usage_examples: [
      'Understand why a query is slow',
      'Identify full table scans to optimize',
      'Compare execution plans before and after optimization'
    ]
  },
  'database-backup-scheduler': {
    name: 'Database Backup Scheduler',
    description: 'Generate backup schedules and scripts for databases',
    seo_title: 'Free Database Backup Scheduler Online - Cron Generator | U2Tool',
    seo_description: 'Generate database backup schedules and scripts. Create cron jobs for MySQL, PostgreSQL backups. Free online backup planning tool.',
    detailed_description: 'Database Backup Scheduler helps you create backup schedules and generates backup scripts for MySQL, PostgreSQL, and MongoDB. Includes cron expressions, retention policies, and cloud storage integration.',
    usage_steps: [
      'Select your database type',
      'Configure backup frequency and retention',
      'Set backup destination (local, S3, etc.)',
      'Generate the backup script',
      'Copy the cron expression for scheduling'
    ],
    usage_examples: [
      'Create daily backup scripts for production databases',
      'Generate cron jobs for automated backups',
      'Plan backup retention and rotation policies'
    ]
  },
  'git-commit-message-generator': {
    name: 'Git Commit Message Generator',
    description: 'Generate conventional commit messages following best practices',
    seo_title: 'Free Git Commit Message Generator Online - Conventional Commits | U2Tool',
    seo_description: 'Generate conventional commit messages. Follow best practices for git commits. Free online tool for better version control.',
    detailed_description: 'Git Commit Message Generator creates well-formatted commit messages following the Conventional Commits specification. Supports types like feat, fix, docs, style, refactor, test, and chore with scope and description.',
    usage_steps: [
      'Select the commit type (feat, fix, docs, etc.)',
      'Enter the scope (optional)',
      'Write a short description',
      'Add body and footer if needed',
      'Copy the formatted commit message'
    ],
    usage_examples: [
      'Create consistent commit messages for team projects',
      'Generate changelog-friendly commit formats',
      'Follow semantic versioning commit conventions'
    ]
  },
  'git-branch-naming-validator': {
    name: 'Git Branch Naming Validator',
    description: 'Validate Git branch names against naming conventions',
    seo_title: 'Free Git Branch Name Validator Online - Naming Rules | U2Tool',
    seo_description: 'Validate Git branch names against conventions. Check feature, bugfix, release branch formats. Free online git workflow tool.',
    detailed_description: 'Git Branch Naming Validator checks branch names against common naming conventions like GitFlow, GitHub Flow, and custom patterns. Validates format, suggests corrections, and ensures consistency.',
    usage_steps: [
      'Enter your branch name',
      'Select the naming convention to validate against',
      'Click Validate to check the name',
      'View validation results and suggestions',
      'Copy the corrected branch name if needed'
    ],
    usage_examples: [
      'Validate feature branch names before creation',
      'Enforce team branch naming standards',
      'Check branch names in CI/CD pipelines'
    ]
  },
  'merge-conflict-resolver': {
    name: 'Merge Conflict Resolver',
    description: 'Help resolve Git merge conflicts with visual diff',
    seo_title: 'Free Git Merge Conflict Resolver Online - Visual Diff | U2Tool',
    seo_description: 'Resolve Git merge conflicts visually. Compare conflicting changes side by side. Free online merge tool for developers.',
    detailed_description: 'Merge Conflict Resolver provides a visual interface to resolve Git merge conflicts. Shows conflicting changes side by side, allows selecting changes from either version, and generates the resolved output.',
    usage_steps: [
      'Paste the conflicted file content',
      'View the conflict markers highlighted',
      'Choose changes from current or incoming',
      'Edit the merged result if needed',
      'Copy the resolved content'
    ],
    usage_examples: [
      'Resolve merge conflicts in code files',
      'Compare and merge configuration changes',
      'Handle conflicts in package.json or lock files'
    ]
  },
  'git-history-visualizer': {
    name: 'Git History Visualizer',
    description: 'Visualize Git commit history and branch structure',
    seo_title: 'Free Git History Visualizer Online - Commit Graph | U2Tool',
    seo_description: 'Visualize Git commit history as a graph. See branch structure and merges. Free online git visualization tool.',
    detailed_description: 'Git History Visualizer creates visual representations of Git commit history. Shows branches, merges, and commit relationships in an interactive graph. Parse git log output to generate the visualization.',
    usage_steps: [
      'Paste your git log output',
      'Or enter commit data manually',
      'Click Visualize to generate the graph',
      'Explore branches and merge points',
      'Export the visualization as an image'
    ],
    usage_examples: [
      'Understand complex branch histories',
      'Document release branch strategies',
      'Visualize merge patterns in repositories'
    ]
  },
  'changelog-generator-advanced': {
    name: 'Changelog Generator',
    description: 'Generate changelogs from Git commits in various formats',
    seo_title: 'Free Changelog Generator Online - From Git Commits | U2Tool',
    seo_description: 'Generate changelogs from Git commits. Support Keep a Changelog format. Free online release notes generator.',
    detailed_description: 'Changelog Generator creates formatted changelogs from Git commit messages. Supports Keep a Changelog format, groups changes by type (Added, Changed, Fixed, etc.), and generates Markdown or HTML output.',
    usage_steps: [
      'Paste your Git commit messages',
      'Select the changelog format',
      'Configure version and date',
      'Click Generate to create the changelog',
      'Copy or download the formatted changelog'
    ],
    usage_examples: [
      'Generate release notes from commits',
      'Create CHANGELOG.md for open source projects',
      'Document version history for users'
    ]
  },
  'git-tag-manager': {
    name: 'Git Tag Manager',
    description: 'Manage and organize Git tags for releases',
    seo_title: 'Free Git Tag Manager Online - Version Tags | U2Tool',
    seo_description: 'Manage Git tags for releases. Generate semantic version tags. Free online version control tool.',
    detailed_description: 'Git Tag Manager helps organize and create Git tags following semantic versioning. Generate tag names, create annotated tag commands, and manage release versions systematically.',
    usage_steps: [
      'Enter your current version or tag list',
      'Select the version bump type (major, minor, patch)',
      'Add tag message and annotations',
      'Generate the git tag command',
      'Copy commands for creating and pushing tags'
    ],
    usage_examples: [
      'Create semantic version tags for releases',
      'Generate annotated tags with release notes',
      'Plan version numbering for projects'
    ]
  },
  'markdown-to-html-converter': {
    name: 'Markdown to HTML Converter',
    description: 'Convert Markdown documents to HTML with styling options',
    seo_title: 'Free Markdown to HTML Converter Online - MD to HTML | U2Tool',
    seo_description: 'Convert Markdown to HTML instantly. Support GFM, tables, code blocks. Free online Markdown converter with preview.',
    detailed_description: 'Markdown to HTML Converter transforms Markdown documents into clean HTML. Supports GitHub Flavored Markdown (GFM), tables, code blocks with syntax highlighting, and custom CSS styling options.',
    usage_steps: [
      'Paste your Markdown content',
      'Select conversion options (GFM, syntax highlighting)',
      'Preview the HTML output in real-time',
      'Customize CSS styling if needed',
      'Copy or download the HTML'
    ],
    usage_examples: [
      'Convert README.md to HTML for websites',
      'Generate HTML documentation from Markdown',
      'Create styled HTML emails from Markdown'
    ]
  },
  'document-outline-generator': {
    name: 'Document Outline Generator',
    description: 'Generate document outlines from headings and structure',
    seo_title: 'Free Document Outline Generator Online - Structure Extractor | U2Tool',
    seo_description: 'Generate document outlines from headings. Extract structure from Markdown, HTML. Free online document organization tool.',
    detailed_description: 'Document Outline Generator extracts the heading structure from documents to create hierarchical outlines. Supports Markdown, HTML, and plain text. Shows document organization and navigation structure.',
    usage_steps: [
      'Paste your document content',
      'Select the document format',
      'Click Generate to extract the outline',
      'View the hierarchical structure',
      'Copy the outline in various formats'
    ],
    usage_examples: [
      'Create outlines for long documents',
      'Analyze document structure and organization',
      'Generate navigation menus from headings'
    ]
  },
  'table-of-contents-generator': {
    name: 'Table of Contents Generator',
    description: 'Create table of contents from document headings',
    seo_title: 'Free Table of Contents Generator Online - TOC Creator | U2Tool',
    seo_description: 'Generate table of contents from Markdown headings. Create TOC with anchor links. Free online documentation tool.',
    detailed_description: 'Table of Contents Generator creates navigable TOC from document headings. Generates Markdown or HTML with anchor links, supports custom depth levels, and creates GitHub-compatible TOC for README files.',
    usage_steps: [
      'Paste your Markdown or HTML document',
      'Set the heading depth to include',
      'Choose the output format (Markdown, HTML)',
      'Click Generate to create the TOC',
      'Copy and insert into your document'
    ],
    usage_examples: [
      'Add TOC to GitHub README files',
      'Create navigation for documentation',
      'Generate TOC for long blog posts'
    ]
  },
  'document-word-counter': {
    name: 'Document Word Counter',
    description: 'Count words, characters, sentences, and paragraphs',
    seo_title: 'Free Document Word Counter Online - Character Count | U2Tool',
    seo_description: 'Count words, characters, sentences, paragraphs in documents. Reading time estimation. Free online text statistics tool.',
    detailed_description: 'Document Word Counter provides detailed statistics for your text including word count, character count (with/without spaces), sentence count, paragraph count, and estimated reading time.',
    usage_steps: [
      'Paste your document text',
      'View real-time word and character counts',
      'Check sentence and paragraph statistics',
      'See estimated reading and speaking time',
      'Export statistics as needed'
    ],
    usage_examples: [
      'Check essay word count for assignments',
      'Verify article length for publishing',
      'Estimate reading time for blog posts'
    ]
  },
  'document-formatter': {
    name: 'Document Formatter',
    description: 'Format and clean up document text with various options',
    seo_title: 'Free Document Formatter Online - Text Cleanup Tool | U2Tool',
    seo_description: 'Format and clean up document text. Remove extra spaces, fix line breaks. Free online text formatting tool.',
    detailed_description: 'Document Formatter cleans and formats text documents. Remove extra whitespace, fix line breaks, normalize quotes, convert case, and apply consistent formatting throughout your document.',
    usage_steps: [
      'Paste your document text',
      'Select formatting options to apply',
      'Preview the formatted result',
      'Adjust settings as needed',
      'Copy the cleaned document'
    ],
    usage_examples: [
      'Clean up text copied from PDFs',
      'Normalize formatting from different sources',
      'Prepare text for publishing or printing'
    ]
  },
  'citation-formatter': {
    name: 'Citation Formatter',
    description: 'Format citations in APA, MLA, Chicago, and other styles',
    seo_title: 'Free Citation Formatter Online - APA, MLA, Chicago | U2Tool',
    seo_description: 'Format citations in APA, MLA, Chicago, Harvard styles. Generate bibliography entries. Free online citation generator.',
    detailed_description: 'Citation Formatter generates properly formatted citations and bibliography entries. Supports APA 7th, MLA 9th, Chicago, Harvard, and IEEE styles for books, articles, websites, and other sources.',
    usage_steps: [
      'Select the source type (book, article, website)',
      'Enter the source details',
      'Choose the citation style',
      'Click Format to generate the citation',
      'Copy the formatted citation'
    ],
    usage_examples: [
      'Format book citations for academic papers',
      'Generate website citations with access dates',
      'Create bibliography entries for research'
    ]
  },
  'project-estimation-calculator': {
    name: 'Project Estimation Calculator',
    description: 'Calculate project effort estimates using PERT and story points',
    seo_title: 'Free Project Estimation Calculator Online - PERT Tool | U2Tool',
    seo_description: 'Calculate project estimates using PERT, story points. Estimate development time. Free online project planning tool.',
    detailed_description: 'Project Estimation Calculator helps estimate project effort using PERT (Program Evaluation and Review Technique), story points, and t-shirt sizing. Calculate expected duration with optimistic, pessimistic, and most likely estimates.',
    usage_steps: [
      'Enter task descriptions',
      'Provide optimistic, most likely, and pessimistic estimates',
      'Or use story points/t-shirt sizing',
      'Calculate the expected duration',
      'View confidence intervals and totals'
    ],
    usage_examples: [
      'Estimate software development projects',
      'Calculate sprint capacity with story points',
      'Plan project timelines with PERT analysis'
    ]
  },
  'sprint-velocity-calculator': {
    name: 'Sprint Velocity Calculator',
    description: 'Calculate and track sprint velocity for agile teams',
    seo_title: 'Free Sprint Velocity Calculator Online - Agile Metrics | U2Tool',
    seo_description: 'Calculate sprint velocity for agile teams. Track story points completed. Free online Scrum planning tool.',
    detailed_description: 'Sprint Velocity Calculator tracks and calculates team velocity across sprints. Enter completed story points per sprint to calculate average velocity, predict future capacity, and plan releases.',
    usage_steps: [
      'Enter story points completed per sprint',
      'Add multiple sprints for better accuracy',
      'View average velocity calculation',
      'See velocity trend over time',
      'Use velocity for sprint planning'
    ],
    usage_examples: [
      'Calculate team velocity for sprint planning',
      'Track velocity trends over multiple sprints',
      'Predict release dates based on velocity'
    ]
  },
  'resource-allocation-planner': {
    name: 'Resource Allocation Planner',
    description: 'Plan and optimize resource allocation across projects',
    seo_title: 'Free Resource Allocation Planner Online - Team Planning | U2Tool',
    seo_description: 'Plan resource allocation across projects. Optimize team utilization. Free online project management tool.',
    detailed_description: 'Resource Allocation Planner helps distribute team members across projects and tasks. Visualize allocation, identify over/under-utilization, and optimize resource distribution for better project outcomes.',
    usage_steps: [
      'Add team members and their availability',
      'Create projects and tasks',
      'Assign resources to tasks',
      'View allocation visualization',
      'Identify and resolve conflicts'
    ],
    usage_examples: [
      'Plan team allocation for multiple projects',
      'Balance workload across team members',
      'Identify resource bottlenecks'
    ]
  },
  'project-risk-analyzer': {
    name: 'Project Risk Analyzer',
    description: 'Identify and assess project risks with mitigation strategies',
    seo_title: 'Free Project Risk Analyzer Online - Risk Assessment | U2Tool',
    seo_description: 'Analyze project risks with probability and impact assessment. Create risk matrices. Free online risk management tool.',
    detailed_description: 'Project Risk Analyzer helps identify, assess, and prioritize project risks. Create risk matrices, calculate risk scores based on probability and impact, and develop mitigation strategies.',
    usage_steps: [
      'Add potential project risks',
      'Assess probability and impact for each',
      'View the risk matrix visualization',
      'Prioritize risks by score',
      'Document mitigation strategies'
    ],
    usage_examples: [
      'Assess risks for new project initiatives',
      'Create risk registers for stakeholders',
      'Prioritize risk mitigation efforts'
    ]
  },
  'milestone-tracker': {
    name: 'Milestone Tracker',
    description: 'Track project milestones and deadlines',
    seo_title: 'Free Milestone Tracker Online - Project Timeline | U2Tool',
    seo_description: 'Track project milestones and deadlines. Visualize project timeline. Free online project tracking tool.',
    detailed_description: 'Milestone Tracker helps you define, track, and visualize project milestones. Set target dates, track completion status, and see progress on a timeline view. Get alerts for upcoming and overdue milestones.',
    usage_steps: [
      'Add project milestones with target dates',
      'Set milestone descriptions and owners',
      'Track completion status',
      'View timeline visualization',
      'Export milestone report'
    ],
    usage_examples: [
      'Track software release milestones',
      'Monitor project phase completions',
      'Report progress to stakeholders'
    ]
  },
  'team-capacity-planner': {
    name: 'Team Capacity Planner',
    description: 'Plan team capacity and workload distribution',
    seo_title: 'Free Team Capacity Planner Online - Workload Planning | U2Tool',
    seo_description: 'Plan team capacity and workload. Calculate available hours. Free online team management tool.',
    detailed_description: 'Team Capacity Planner calculates available team capacity considering holidays, PTO, and meetings. Plan workload distribution, identify capacity gaps, and ensure realistic sprint commitments.',
    usage_steps: [
      'Add team members and their roles',
      'Set working hours and holidays',
      'Account for meetings and overhead',
      'Calculate available capacity',
      'Plan work allocation accordingly'
    ],
    usage_examples: [
      'Plan sprint capacity for agile teams',
      'Account for holidays in project planning',
      'Balance workload across team members'
    ]
  },
  'meeting-minutes-generator': {
    name: 'Meeting Minutes Generator',
    description: 'Generate structured meeting minutes from notes',
    seo_title: 'Free Meeting Minutes Generator Online - Notes Template | U2Tool',
    seo_description: 'Generate professional meeting minutes. Structured templates for notes. Free online meeting documentation tool.',
    detailed_description: 'Meeting Minutes Generator creates professional, structured meeting minutes from your notes. Includes sections for attendees, agenda items, decisions, action items, and next steps with assignees and due dates.',
    usage_steps: [
      'Enter meeting details (date, attendees)',
      'Add agenda items and discussion points',
      'Record decisions made',
      'List action items with owners and dates',
      'Generate and export the minutes'
    ],
    usage_examples: [
      'Document team meeting outcomes',
      'Create board meeting minutes',
      'Track action items from discussions'
    ]
  },
  'timezone-meeting-scheduler': {
    name: 'Timezone Meeting Scheduler',
    description: 'Schedule meetings across multiple time zones',
    seo_title: 'Free Timezone Meeting Scheduler Online - World Clock | U2Tool',
    seo_description: 'Schedule meetings across time zones. Find best meeting times globally. Free online timezone converter.',
    detailed_description: 'Timezone Meeting Scheduler helps find optimal meeting times for participants across different time zones. Shows local times for all participants, highlights business hours, and suggests best meeting slots.',
    usage_steps: [
      'Add participant locations/time zones',
      'Set your preferred meeting duration',
      'View time comparison across zones',
      'Find overlapping business hours',
      'Select and share the meeting time'
    ],
    usage_examples: [
      'Schedule calls with international teams',
      'Find meeting times across US and Europe',
      'Coordinate with remote team members'
    ]
  },
  'meeting-agenda-builder': {
    name: 'Meeting Agenda Builder',
    description: 'Create structured meeting agendas with time allocations',
    seo_title: 'Free Meeting Agenda Builder Online - Agenda Template | U2Tool',
    seo_description: 'Create professional meeting agendas. Set time allocations for topics. Free online meeting planning tool.',
    detailed_description: 'Meeting Agenda Builder helps create structured, time-boxed meeting agendas. Add topics with time allocations, assign presenters, include objectives, and generate shareable agenda documents.',
    usage_steps: [
      'Set meeting title and duration',
      'Add agenda items with time allocations',
      'Assign presenters for each topic',
      'Add objectives and preparation notes',
      'Export and share the agenda'
    ],
    usage_examples: [
      'Plan effective team meetings',
      'Create agendas for client presentations',
      'Structure workshop sessions'
    ]
  },
  'calendar-availability-finder': {
    name: 'Calendar Availability Finder',
    description: 'Find common available time slots across calendars',
    seo_title: 'Free Calendar Availability Finder Online - Schedule Tool | U2Tool',
    seo_description: 'Find common free time slots across multiple calendars. Schedule meetings easily. Free online availability checker.',
    detailed_description: 'Calendar Availability Finder helps find common free time slots when scheduling with multiple people. Input availability for each participant and find overlapping free times for meetings.',
    usage_steps: [
      'Add participants and their availability',
      'Set the meeting duration needed',
      'Specify the date range to search',
      'View common available slots',
      'Select and confirm the meeting time'
    ],
    usage_examples: [
      'Find meeting times for team members',
      'Schedule interviews with multiple interviewers',
      'Coordinate group events'
    ]
  },
  'meeting-room-finder': {
    name: 'Meeting Room Finder',
    description: 'Find and book available meeting rooms',
    seo_title: 'Free Meeting Room Finder Online - Room Booking | U2Tool',
    seo_description: 'Find available meeting rooms by capacity and amenities. Plan room bookings. Free online room scheduling tool.',
    detailed_description: 'Meeting Room Finder helps locate available meeting rooms based on capacity, amenities, and time requirements. Filter by room size, equipment (projector, whiteboard), and location.',
    usage_steps: [
      'Enter meeting date and time',
      'Specify required capacity',
      'Select needed amenities',
      'View available rooms',
      'Select and book the room'
    ],
    usage_examples: [
      'Find rooms for team meetings',
      'Book conference rooms with video equipment',
      'Reserve spaces for workshops'
    ]
  },
  'invoice-template-generator': {
    name: 'Invoice Template Generator',
    description: 'Generate professional invoice templates with customization',
    seo_title: 'Free Invoice Generator Online - Professional Templates | U2Tool',
    seo_description: 'Generate professional invoices with customizable templates. Add logo, items, taxes. Free online invoice maker.',
    detailed_description: 'Invoice Template Generator creates professional invoices with customizable templates. Add your logo, business details, line items, taxes, and payment terms. Export as PDF or print directly.',
    usage_steps: [
      'Enter your business information',
      'Add client details',
      'List products/services with prices',
      'Configure taxes and discounts',
      'Generate and download the invoice'
    ],
    usage_examples: [
      'Create invoices for freelance work',
      'Generate recurring invoices for clients',
      'Customize invoice templates for branding'
    ]
  },
  'expense-report-generator': {
    name: 'Expense Report Generator',
    description: 'Create expense reports with categorization and totals',
    seo_title: 'Free Expense Report Generator Online - Expense Tracker | U2Tool',
    seo_description: 'Create expense reports with categories and totals. Track business expenses. Free online expense management tool.',
    detailed_description: 'Expense Report Generator creates organized expense reports with categorization, receipt tracking, and automatic totals. Perfect for business travel, project expenses, and reimbursement requests.',
    usage_steps: [
      'Add expense items with dates',
      'Categorize expenses (travel, meals, etc.)',
      'Attach receipt references',
      'Review totals by category',
      'Export the expense report'
    ],
    usage_examples: [
      'Create travel expense reports',
      'Track project-related expenses',
      'Generate reimbursement requests'
    ]
  },
  'budget-variance-analyzer': {
    name: 'Budget Variance Analyzer',
    description: 'Analyze budget vs actual spending variances',
    seo_title: 'Free Budget Variance Analyzer Online - Financial Analysis | U2Tool',
    seo_description: 'Analyze budget vs actual spending. Calculate variances and percentages. Free online budget analysis tool.',
    detailed_description: 'Budget Variance Analyzer compares planned budget against actual spending to identify variances. Calculate percentage differences, highlight over/under budget items, and generate variance reports.',
    usage_steps: [
      'Enter budget line items and amounts',
      'Add actual spending for each item',
      'View calculated variances',
      'Analyze percentage differences',
      'Export the variance report'
    ],
    usage_examples: [
      'Analyze monthly budget performance',
      'Track project budget variances',
      'Report financial variances to stakeholders'
    ]
  },
  'cost-benefit-analyzer': {
    name: 'Cost-Benefit Analyzer',
    description: 'Calculate ROI and analyze cost-benefit ratios',
    seo_title: 'Free Cost-Benefit Analyzer Online - ROI Calculator | U2Tool',
    seo_description: 'Calculate ROI and cost-benefit ratios. Analyze investment decisions. Free online financial analysis tool.',
    detailed_description: 'Cost-Benefit Analyzer helps evaluate investments by calculating ROI, payback period, and cost-benefit ratios. Compare alternatives, factor in time value of money, and make data-driven decisions.',
    usage_steps: [
      'Enter initial investment costs',
      'Add expected benefits over time',
      'Include ongoing costs',
      'Calculate ROI and payback period',
      'Compare multiple scenarios'
    ],
    usage_examples: [
      'Evaluate software purchase decisions',
      'Analyze project investment returns',
      'Compare vendor proposals'
    ]
  },
  'financial-forecast-calculator': {
    name: 'Financial Forecast Calculator',
    description: 'Create financial forecasts using various models',
    seo_title: 'Free Financial Forecast Calculator Online - Projections | U2Tool',
    seo_description: 'Create financial forecasts and projections. Use trend analysis and growth models. Free online forecasting tool.',
    detailed_description: 'Financial Forecast Calculator creates projections using historical data and growth models. Supports linear trends, exponential growth, and seasonal adjustments for revenue, expenses, and cash flow forecasting.',
    usage_steps: [
      'Enter historical financial data',
      'Select the forecasting model',
      'Set the forecast period',
      'Adjust growth assumptions',
      'View and export projections'
    ],
    usage_examples: [
      'Forecast revenue for budget planning',
      'Project cash flow for the next quarter',
      'Create financial projections for investors'
    ]
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

async function translateContent(
  content: ToolTranslation,
  targetLocale: string
): Promise<ToolTranslation | null> {
  const apiKey = process.env.SILICONFLOW_API_KEY;
  if (!apiKey) {
    console.error('❌ 请设置 SILICONFLOW_API_KEY');
    process.exit(1);
  }

  const localeName = LOCALE_NAMES[targetLocale];
  
  const systemPrompt = `You are a professional translator. Translate the JSON content to ${localeName}.
Rules:
1. Keep the exact same JSON structure
2. Only translate string values, keep keys unchanged
3. For arrays, keep the same number of elements
4. Return ONLY valid JSON - no markdown, no explanations
5. Make translations natural and SEO-friendly for the target language`;

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
  console.log('🚀 开始更新 Batch 54 工具的个性化翻译...\n');

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
  const targetLocales = LOCALES.filter(l => l !== 'en');
  
  for (const locale of targetLocales) {
    console.log(`\n🌐 翻译到 ${locale} (${LOCALE_NAMES[locale]})...`);
    const localePath = path.join(CONFIG.messagesDir, `${locale}.json`);
    const localeData = readJsonFile(localePath) as { tools: Record<string, ToolTranslation> };
    
    let success = 0;
    let fail = 0;
    
    for (let i = 0; i < toolSlugs.length; i++) {
      const slug = toolSlugs[i];
      const enContent = enData.tools[slug];
      
      process.stdout.write(`  [${i + 1}/${toolSlugs.length}] ${slug}... `);
      
      const translated = await translateContent(enContent, locale);
      
      if (translated) {
        localeData.tools[slug] = translated;
        console.log('✅');
        success++;
      } else {
        console.log('❌');
        fail++;
      }
      
      // 每 10 个保存一次
      if ((i + 1) % 10 === 0) {
        writeJsonFile(localePath, localeData);
      }
      
      await new Promise(r => setTimeout(r, 500));
    }
    
    writeJsonFile(localePath, localeData);
    console.log(`  完成: ${success}/${toolSlugs.length} 成功, ${fail} 失败`);
  }

  console.log('\n✅ 所有翻译完成！');
  console.log('📋 后续步骤: npx tsx scripts/split-translations.ts');
}

main().catch(console.error);
