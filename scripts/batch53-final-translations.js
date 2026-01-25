const fs = require('fs');
const enPath = 'src/messages/en.json';
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const tools = {
  "aspect-ratio-box-generator": {
    "name": "Aspect Ratio Box Generator",
    "description": "Generate CSS for responsive aspect ratio containers",
    "seo_title": "Free CSS Aspect Ratio Box Generator Online",
    "seo_description": "Create responsive aspect ratio boxes with CSS. Support padding-bottom and aspect-ratio.",
    "detailed_description": "Aspect Ratio Box Generator creates CSS for maintaining aspect ratios.",
    "usage_steps": ["Enter ratio or select preset", "Choose CSS method", "Preview", "Copy CSS"],
    "usage_examples": ["Create video containers", "Design responsive image frames"]
  },
  "screen-time-calculator": {
    "name": "Screen Time Calculator",
    "description": "Calculate daily, weekly, and yearly screen time",
    "seo_title": "Free Screen Time Calculator Online",
    "seo_description": "Calculate your total screen time per day, week, month, and year. Get health tips.",
    "detailed_description": "Screen Time Calculator helps you understand your screen usage patterns.",
    "usage_steps": ["Enter daily screen hours", "View calculated totals", "Read health suggestions"],
    "usage_examples": ["Track phone usage", "Set screen time goals"]
  },
  "typing-time-calculator": {
    "name": "Typing Time Calculator",
    "description": "Estimate time needed to type a document",
    "seo_title": "Free Typing Time Calculator Online",
    "seo_description": "Calculate how long it takes to type a document based on word count and typing speed.",
    "detailed_description": "Typing Time Calculator estimates typing duration based on your speed.",
    "usage_steps": ["Enter word count or paste text", "Set typing speed", "View time estimate"],
    "usage_examples": ["Plan writing sessions", "Estimate project timelines"]
  },
  "download-time-calculator": {
    "name": "Download Time Calculator",
    "description": "Calculate file download time based on connection speed",
    "seo_title": "Free Download Time Calculator Online",
    "seo_description": "Calculate how long a file download will take at different internet speeds.",
    "detailed_description": "Download Time Calculator estimates download duration for any file size.",
    "usage_steps": ["Enter file size", "Select or enter connection speed", "View download time"],
    "usage_examples": ["Plan large downloads", "Compare connection speeds"]
  },
  "ical-parser": {
    "name": "iCal Parser",
    "description": "Parse and view iCalendar (.ics) files",
    "seo_title": "Free iCal Parser Online - View ICS Calendar Files",
    "seo_description": "Parse iCalendar ICS files and view events in a readable format. Handle recurring events.",
    "detailed_description": "iCal Parser reads ICS files and displays calendar events in a table.",
    "usage_steps": ["Upload ICS file or paste content", "View parsed events", "Export to JSON"],
    "usage_examples": ["View calendar exports", "Extract event data"]
  },
  "vcard-parser": {
    "name": "vCard Parser",
    "description": "Parse and view vCard (.vcf) contact files",
    "seo_title": "Free vCard Parser Online - View VCF Contact Files",
    "seo_description": "Parse vCard VCF files and view contacts. Support vCard 2.1 and 3.0 formats.",
    "detailed_description": "vCard Parser reads VCF files and displays contact information.",
    "usage_steps": ["Upload VCF file or paste content", "View parsed contacts", "Export to JSON"],
    "usage_examples": ["View contact exports", "Extract contact data"]
  }
};

Object.assign(enData.tools, tools);
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
console.log('Added final translations');
