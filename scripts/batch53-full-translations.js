const fs = require('fs');
const enPath = 'src/messages/en.json';
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const tools = {
  "grammar-checker": {
    "name": "Grammar Checker",
    "description": "Check text for grammar errors and get correction suggestions",
    "seo_title": "Free Grammar Checker Online - Fix Grammar Mistakes",
    "seo_description": "Check grammar, spelling, and punctuation errors. Get suggestions to improve writing.",
    "detailed_description": "Grammar Checker analyzes text for common grammar mistakes and suggests corrections.",
    "usage_steps": ["Paste text", "View errors highlighted", "Apply suggestions", "Copy corrected text"],
    "usage_examples": ["Proofread emails", "Check essays", "Improve blog posts"]
  },
  "typescript-playground": {
    "name": "TypeScript Playground",
    "description": "Write and compile TypeScript code in the browser",
    "seo_title": "Free TypeScript Playground Online - Compile TS to JS",
    "seo_description": "Write TypeScript code and see compiled JavaScript output instantly. Free online compiler.",
    "detailed_description": "TypeScript Playground lets you write TypeScript and see the compiled JavaScript.",
    "usage_steps": ["Write TypeScript", "Configure options", "View compiled JS", "Copy output"],
    "usage_examples": ["Learn TypeScript", "Test type definitions", "Share code snippets"]
  },
  "python-formatter": {
    "name": "Python Formatter",
    "description": "Format Python code according to PEP 8 style guide",
    "seo_title": "Free Python Formatter Online - PEP 8 Code Formatter",
    "seo_description": "Format Python code following PEP 8 guidelines. Customize indentation and line width.",
    "detailed_description": "Python Formatter formats your code according to PEP 8 style guidelines.",
    "usage_steps": ["Paste Python code", "Set options", "Click Format", "Copy formatted code"],
    "usage_examples": ["Clean up scripts", "Standardize team code", "Prepare for code review"]
  }
};

Object.assign(enData.tools, tools);
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
console.log('Added more translations');
