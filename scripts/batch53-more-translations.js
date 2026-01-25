const fs = require('fs');
const enPath = 'src/messages/en.json';
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const tools = {
  "go-formatter": {
    "name": "Go Formatter",
    "description": "Format Go code in gofmt style",
    "seo_title": "Free Go Formatter Online - gofmt Style Formatter",
    "seo_description": "Format Go code following gofmt conventions. Clean and standardize your Go code.",
    "detailed_description": "Go Formatter formats your Go code following the official gofmt style.",
    "usage_steps": ["Paste Go code", "Click Format", "Copy formatted code"],
    "usage_examples": ["Format Go packages", "Clean up code before commit"]
  },
  "rust-formatter": {
    "name": "Rust Formatter",
    "description": "Format Rust code in rustfmt style",
    "seo_title": "Free Rust Formatter Online - rustfmt Style Formatter",
    "seo_description": "Format Rust code following rustfmt conventions. Standardize your Rust code.",
    "detailed_description": "Rust Formatter formats your Rust code following rustfmt style guidelines.",
    "usage_steps": ["Paste Rust code", "Click Format", "Copy formatted code"],
    "usage_examples": ["Format Rust modules", "Prepare code for review"]
  },
  "yaml-formatter": {
    "name": "YAML Formatter",
    "description": "Format and validate YAML with customizable options",
    "seo_title": "Free YAML Formatter Online - Validate and Format YAML",
    "seo_description": "Format YAML files with custom indentation. Validate syntax and sort keys.",
    "detailed_description": "YAML Formatter validates and formats YAML with customizable indentation.",
    "usage_steps": ["Paste YAML", "Set indent size", "Click Format", "Copy result"],
    "usage_examples": ["Format config files", "Validate Kubernetes manifests"]
  },
  "text-shadow-generator": {
    "name": "Text Shadow Generator",
    "description": "Create CSS text shadows with visual editor",
    "seo_title": "Free CSS Text Shadow Generator Online",
    "seo_description": "Create CSS text shadows visually. Multiple layers, presets, and live preview.",
    "detailed_description": "Text Shadow Generator creates CSS text-shadow effects with a visual editor.",
    "usage_steps": ["Adjust shadow settings", "Add multiple layers", "Preview effect", "Copy CSS"],
    "usage_examples": ["Create glow effects", "Design 3D text", "Add depth to headings"]
  },
  "svg-pattern-generator": {
    "name": "SVG Pattern Generator",
    "description": "Generate SVG patterns for backgrounds",
    "seo_title": "Free SVG Pattern Generator Online - Background Patterns",
    "seo_description": "Generate SVG patterns for web backgrounds. Dots, lines, grids, and more.",
    "detailed_description": "SVG Pattern Generator creates seamless patterns for web backgrounds.",
    "usage_steps": ["Select pattern type", "Customize colors and size", "Preview", "Export SVG or CSS"],
    "usage_examples": ["Create website backgrounds", "Design card patterns"]
  },
  "css-triangle-generator": {
    "name": "CSS Triangle Generator",
    "description": "Generate CSS triangles using border technique",
    "seo_title": "Free CSS Triangle Generator Online",
    "seo_description": "Create CSS triangles pointing any direction. Pure CSS with border technique.",
    "detailed_description": "CSS Triangle Generator creates triangles using the CSS border technique.",
    "usage_steps": ["Select direction", "Set size and color", "Preview", "Copy CSS"],
    "usage_examples": ["Create tooltip arrows", "Design navigation indicators"]
  }
};

Object.assign(enData.tools, tools);
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
console.log('Added more translations');
