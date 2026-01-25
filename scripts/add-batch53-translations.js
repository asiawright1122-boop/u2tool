const fs = require('fs');
const enPath = 'src/messages/en.json';
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Batch 53 translations
const batch53 = {
  "text-spinner": {
    "name": "Text Spinner",
    "description": "Rewrite text using synonyms to create unique variations",
    "seo_title": "Free Text Spinner Online - Rewrite Content with Synonyms",
    "seo_description": "Spin and rewrite text using synonyms to create unique content variations. Free online tool.",
    "detailed_description": "Text Spinner transforms your text by replacing words with synonyms.",
    "usage_steps": ["Paste text", "Select level", "Click Spin", "Copy result"],
    "usage_examples": ["Create product description variations", "Generate unique articles"]
  },
  "readability-checker": {
    "name": "Readability Checker",
    "description": "Analyze text readability with Flesch-Kincaid and other scores",
    "seo_title": "Free Readability Checker Online - Flesch-Kincaid Calculator",
    "seo_description": "Check text readability with multiple formulas. Get reading level and suggestions.",
    "detailed_description": "Readability Checker analyzes text using multiple readability formulas.",
    "usage_steps": ["Paste text", "View scores", "Check suggestions"],
    "usage_examples": ["Check blog readability", "Optimize marketing copy"]
  }
};

Object.assign(enData.tools, batch53);
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
console.log('Added translations');
