/**
 * 添加 Batch 52 工具的英文翻译
 */

const fs = require('fs');
const path = require('path');

const BATCH52_TRANSLATIONS = {
  'glassmorphism-generator': {
    name: 'Glassmorphism Generator',
    description: 'Create modern glass-like UI effects with customizable blur, transparency, and borders',
    seo_title: 'Free Glassmorphism CSS Generator Online - Glass Effect Tool',
    seo_description: 'Generate beautiful glassmorphism CSS effects with our free online tool. Customize blur, transparency, border, and shadow to create modern frosted glass UI designs.',
    detailed_description: 'Glassmorphism Generator is a powerful CSS tool that helps you create stunning frosted glass effects for modern UI designs. This technique, popularized by Apple and Microsoft, creates a sense of depth and hierarchy in your interfaces. Our generator provides real-time preview and customizable parameters including blur intensity, background transparency, border opacity, and shadow effects. Perfect for creating cards, modals, navigation bars, and other UI components with a contemporary aesthetic.',
    usage_steps: [
      'Adjust the blur slider to control the frosted glass intensity',
      'Set the transparency level for the background',
      'Configure border opacity for subtle edge definition',
      'Customize the shadow opacity for depth',
      'Choose your preferred background color',
      'Copy the generated CSS code to use in your project'
    ],
    usage_examples: [
      'Creating modern card components with glass effect',
      'Designing navigation bars with frosted glass background',
      'Building modal dialogs with glassmorphism style'
    ],
    previewText: 'Beautiful frosted glass effect',
    blur: 'Blur',
    transparency: 'Transparency',
    borderOpacity: 'Border Opacity',
    shadowOpacity: 'Shadow Opacity',
    backgroundColor: 'Background Color'
  },
  'neumorphism-generator': {
    name: 'Neumorphism Generator',
    description: 'Generate soft UI neumorphic effects with customizable shadows and shapes',
    seo_title: 'Free Neumorphism CSS Generator Online - Soft UI Tool',
    seo_description: 'Create beautiful neumorphic soft UI effects with our free online generator. Customize shadows, shapes, and colors to design modern skeuomorphic interfaces.',
    detailed_description: 'Neumorphism Generator creates the popular soft UI design style that combines flat design with subtle 3D effects. This tool generates CSS code for elements that appear to extrude from or press into the background. Customize the light source direction, shadow intensity, blur amount, and border radius to achieve the perfect soft, tactile appearance for buttons, cards, and input fields.',
    usage_steps: [
      'Select your preferred background color',
      'Choose a shape style: flat, concave, convex, or pressed',
      'Adjust the shadow distance for depth effect',
      'Set the intensity for light and dark shadows',
      'Configure blur amount for softness',
      'Copy the CSS code for your project'
    ],
    usage_examples: [
      'Designing soft UI buttons and toggles',
      'Creating neumorphic form inputs',
      'Building dashboard cards with soft shadows'
    ],
    backgroundColor: 'Background Color',
    shape: 'Shape',
    shapes: {
      flat: 'Flat',
      concave: 'Concave',
      convex: 'Convex',
      pressed: 'Pressed'
    },
    distance: 'Distance',
    intensity: 'Intensity',
    blur: 'Blur',
    borderRadius: 'Border Radius'
  },
  'blob-generator': {
    name: 'Blob Generator',
    description: 'Create random organic blob shapes as SVG for backgrounds and decorations',
    seo_title: 'Free Blob Shape Generator Online - SVG Blob Maker',
    seo_description: 'Generate unique organic blob shapes with our free online tool. Create random SVG blobs for backgrounds, decorations, and modern web designs.',
    detailed_description: 'Blob Generator creates unique, organic shapes perfect for modern web design. Generate random blob shapes as SVG that can be used for backgrounds, decorative elements, or as clip-paths. Customize the complexity, contrast, size, and color to create the perfect organic shape for your design needs.',
    usage_steps: [
      'Adjust complexity to control the number of points',
      'Set contrast for shape variation',
      'Choose your preferred size',
      'Select a fill color',
      'Click Generate for a new random shape',
      'Copy SVG code or download the file'
    ],
    usage_examples: [
      'Creating decorative background elements',
      'Designing organic hero section shapes',
      'Making unique avatar masks'
    ],
    complexity: 'Complexity',
    contrast: 'Contrast',
    size: 'Size',
    color: 'Color',
    generate: 'Generate New',
    copySvg: 'Copy SVG'
  },
  'wave-generator': {
    name: 'Wave Generator',
    description: 'Generate SVG wave patterns for section dividers and backgrounds',
    seo_title: 'Free SVG Wave Generator Online - Wave Divider Maker',
    seo_description: 'Create beautiful SVG wave patterns for section dividers with our free online tool. Customize height, frequency, and layers for stunning web designs.',
    detailed_description: 'Wave Generator creates smooth, customizable SVG wave patterns perfect for section dividers, headers, and footers. Generate single or multi-layer waves with adjustable height, frequency, and amplitude. The generated SVG is optimized for web use and can be positioned at the top or bottom of sections.',
    usage_steps: [
      'Set the wave height in pixels',
      'Adjust frequency for wave count',
      'Configure amplitude for wave intensity',
      'Add multiple layers for depth effect',
      'Choose top or bottom position',
      'Copy or download the SVG code'
    ],
    usage_examples: [
      'Creating section dividers between content',
      'Designing wave headers for landing pages',
      'Building animated wave backgrounds'
    ],
    height: 'Height',
    frequency: 'Frequency',
    amplitude: 'Amplitude',
    layers: 'Layers',
    position: 'Position',
    top: 'Top',
    bottom: 'Bottom',
    color: 'Color'
  },
  'mesh-gradient-generator': {
    name: 'Mesh Gradient Generator',
    description: 'Create beautiful mesh gradients with multiple color points',
    seo_title: 'Free Mesh Gradient Generator Online - CSS Gradient Tool',
    seo_description: 'Generate stunning mesh gradients with our free online tool. Create multi-color gradient backgrounds with customizable color points and positions.',
    detailed_description: 'Mesh Gradient Generator creates complex, multi-color gradient backgrounds using radial gradients positioned at different points. Unlike linear gradients, mesh gradients create organic, flowing color transitions that add depth and visual interest to your designs. Customize each color point position and color to create unique gradient effects.',
    usage_steps: [
      'Click on color swatches to change colors',
      'Drag X and Y sliders to position each color point',
      'Adjust blur for gradient softness',
      'Click Randomize for new color combinations',
      'Preview the result in real-time',
      'Copy the CSS code for your project'
    ],
    usage_examples: [
      'Creating vibrant hero section backgrounds',
      'Designing colorful card backgrounds',
      'Building gradient overlays for images'
    ],
    colorPoints: 'Color Points',
    point: 'Point',
    blur: 'Blur',
    randomize: 'Randomize Colors'
  },
  'noise-texture-generator': {
    name: 'Noise Texture Generator',
    description: 'Generate noise textures and grain effects for backgrounds',
    seo_title: 'Free Noise Texture Generator Online - Grain Effect Tool',
    seo_description: 'Create noise textures and grain effects with our free online tool. Generate random, perlin, or film grain patterns for modern web designs.',
    detailed_description: 'Noise Texture Generator creates customizable noise patterns for adding texture to your designs. Choose from random noise, perlin-like patterns, or film grain effects. Adjust intensity, scale, and colors to create the perfect texture overlay for backgrounds, cards, or any design element that needs subtle visual interest.',
    usage_steps: [
      'Select noise type: random, perlin, or grain',
      'Adjust intensity for noise visibility',
      'Set scale for pattern size',
      'Choose base and noise colors',
      'Select output size',
      'Download PNG or copy data URL'
    ],
    usage_examples: [
      'Adding film grain to hero images',
      'Creating textured card backgrounds',
      'Designing vintage-style overlays'
    ],
    noiseType: 'Noise Type',
    types: {
      random: 'Random',
      perlin: 'Perlin',
      grain: 'Grain'
    },
    intensity: 'Intensity',
    scale: 'Scale',
    size: 'Size',
    baseColor: 'Base Color',
    noiseColor: 'Noise Color',
    regenerate: 'Regenerate',
    copyDataUrl: 'Copy Data URL',
    usage: 'Usage'
  },
  'commit-message-generator': {
    name: 'Commit Message Generator',
    description: 'Generate conventional commit messages following best practices',
    seo_title: 'Free Git Commit Message Generator Online - Conventional Commits',
    seo_description: 'Generate well-formatted Git commit messages following conventional commits specification. Create consistent, meaningful commit messages for your projects.',
    detailed_description: 'Commit Message Generator helps you create well-structured Git commit messages following the Conventional Commits specification. This format makes your commit history more readable and enables automated changelog generation. Choose from standard commit types, add optional scope, and write clear descriptions for consistent version control.',
    usage_steps: [
      'Select the commit type (feat, fix, docs, etc.)',
      'Optionally add a scope for the change',
      'Write a clear, concise subject line',
      'Check breaking change if applicable',
      'Add optional body for detailed explanation',
      'Copy the formatted commit message'
    ],
    usage_examples: [
      'Creating feature commits: feat(auth): add login functionality',
      'Writing bug fix commits: fix(api): resolve timeout issue',
      'Documenting changes: docs(readme): update installation guide'
    ],
    type: 'Type',
    scope: 'Scope',
    scopePlaceholder: 'e.g., auth, api, ui',
    subject: 'Subject',
    subjectPlaceholder: 'Short description of the change',
    body: 'Body',
    bodyPlaceholder: 'Detailed explanation of the change...',
    footer: 'Footer',
    footerPlaceholder: 'e.g., Closes #123, BREAKING CHANGE: ...',
    breakingChange: 'Breaking Change',
    commitMessage: 'Commit Message',
    preview: 'Enter subject to preview...',
    optional: 'optional',
    characters: 'characters',
    recommended50: 'recommended max 50',
    tips: 'Tips',
    tip1: 'Use imperative mood: "add" not "added" or "adds"',
    tip2: 'Keep subject under 50 characters',
    tip3: 'Separate subject from body with blank line'
  },
  'bandwidth-calculator': {
    name: 'Bandwidth Calculator',
    description: 'Calculate required bandwidth from file size and transfer time',
    seo_title: 'Free Bandwidth Calculator Online - Network Speed Tool',
    seo_description: 'Calculate required bandwidth from file size and transfer time. Convert between Mbps, Gbps, and other network speed units with our free online tool.',
    detailed_description: 'Bandwidth Calculator helps you determine the required network bandwidth to transfer files within a specific time frame. Enter your file size and desired transfer time to calculate the necessary bandwidth in various units including bps, Kbps, Mbps, Gbps, and bytes per second. Perfect for network planning and capacity estimation.',
    usage_steps: [
      'Enter the file size you want to transfer',
      'Select the appropriate size unit (KB, MB, GB, TB)',
      'Enter the desired transfer time',
      'Choose the time unit (seconds, minutes, hours)',
      'View the required bandwidth in multiple units',
      'Copy the results for your reference'
    ],
    usage_examples: [
      'Planning video streaming bandwidth requirements',
      'Estimating backup transfer speeds',
      'Calculating cloud upload/download needs'
    ],
    fileSize: 'File Size',
    transferTime: 'Transfer Time',
    timeUnits: {
      seconds: 'Seconds',
      minutes: 'Minutes',
      hours: 'Hours'
    },
    requiredBandwidth: 'Required Bandwidth',
    bitsPerSecond: 'Bits per Second',
    bytesPerSecond: 'Bytes per Second',
    commonBandwidths: 'Common Bandwidth References'
  },
  'data-transfer-calculator': {
    name: 'Data Transfer Calculator',
    description: 'Calculate file transfer time based on connection speed',
    seo_title: 'Free Data Transfer Time Calculator Online - Download Time Tool',
    seo_description: 'Calculate how long it takes to transfer files at different connection speeds. Estimate download and upload times with our free online calculator.',
    detailed_description: 'Data Transfer Calculator estimates how long it will take to transfer files based on your connection speed. Enter your file size and network speed to get accurate transfer time estimates. Includes preset speeds for common connection types like 4G, 5G, WiFi, and Ethernet for quick calculations.',
    usage_steps: [
      'Enter the file size to transfer',
      'Select the size unit (KB, MB, GB, TB)',
      'Enter your connection speed',
      'Or click a preset speed button',
      'View the estimated transfer time',
      'Copy the results for reference'
    ],
    usage_examples: [
      'Estimating large file download times',
      'Planning data migration schedules',
      'Comparing transfer times across networks'
    ],
    fileSize: 'File Size',
    connectionSpeed: 'Connection Speed',
    presetSpeeds: 'Preset Speeds',
    estimatedTime: 'Estimated Transfer Time',
    hours: 'hours',
    minutes: 'minutes',
    seconds: 'seconds',
    note: 'Note: Actual transfer times may vary due to network conditions, overhead, and other factors.'
  },
  'pixel-density-calculator': {
    name: 'Pixel Density Calculator',
    description: 'Calculate PPI and pixel pitch from screen resolution and size',
    seo_title: 'Free Pixel Density (PPI) Calculator Online - Screen Resolution Tool',
    seo_description: 'Calculate pixel density (PPI), pixel pitch, and screen dimensions from resolution and display size. Free online tool for display analysis.',
    detailed_description: 'Pixel Density Calculator computes the pixels per inch (PPI) and other display metrics from screen resolution and diagonal size. Understand your display quality by calculating pixel pitch, aspect ratio, and total megapixels. Includes presets for common resolutions from HD to 8K and popular devices.',
    usage_steps: [
      'Enter the screen width in pixels',
      'Enter the screen height in pixels',
      'Enter the diagonal screen size in inches',
      'Or select a common resolution preset',
      'View PPI, pixel pitch, and other metrics',
      'Copy the results for reference'
    ],
    usage_examples: [
      'Comparing display quality across monitors',
      'Evaluating smartphone screen sharpness',
      'Choosing the right display for design work'
    ],
    width: 'Width',
    height: 'Height',
    diagonal: 'Diagonal',
    inches: 'inches',
    commonResolutions: 'Common Resolutions',
    results: 'Results',
    pixelsPerInch: 'Pixels Per Inch',
    pixelPitch: 'Pixel Pitch',
    aspectRatio: 'Aspect Ratio',
    megapixels: 'Megapixels',
    physicalWidth: 'Physical Width',
    physicalHeight: 'Physical Height',
    totalPixels: 'Total Pixels',
    ppiReference: 'PPI Reference',
    quality: {
      excellent: 'Excellent - Retina quality',
      good: 'Good - Sharp display',
      average: 'Average - Standard quality',
      low: 'Low - Visible pixels'
    }
  },
  'dpi-calculator': {
    name: 'DPI Calculator',
    description: 'Calculate DPI for printing or required resolution for target DPI',
    seo_title: 'Free DPI Calculator Online - Print Resolution Tool',
    seo_description: 'Calculate DPI from image resolution and print size, or find required pixels for target DPI. Free online tool for print quality planning.',
    detailed_description: 'DPI Calculator helps you determine the print quality of your images or calculate the required resolution for a target DPI. Switch between two modes: calculate DPI from existing image dimensions and print size, or calculate required pixel dimensions for a specific DPI and print size. Essential for photographers, designers, and print professionals.',
    usage_steps: [
      'Choose calculation mode: DPI or Pixels',
      'For DPI mode: enter image resolution and print size',
      'For Pixels mode: enter target DPI and print size',
      'Select a common print size preset if needed',
      'View the calculated results',
      'Copy the results for reference'
    ],
    usage_examples: [
      'Checking if an image is suitable for printing',
      'Calculating required resolution for large prints',
      'Planning photo book image requirements'
    ],
    calculateDpi: 'Calculate DPI',
    calculatePixels: 'Calculate Pixels',
    imageResolution: 'Image Resolution',
    printSize: 'Print Size',
    targetDpi: 'Target DPI',
    width: 'Width',
    height: 'Height',
    inches: 'inches',
    commonPrintSizes: 'Common Print Sizes',
    calculatedDpi: 'Calculated DPI',
    requiredResolution: 'Required Resolution',
    horizontal: 'Horizontal',
    vertical: 'Vertical',
    megapixels: 'Megapixels',
    dpiGuide: 'DPI Guide',
    screen: 'Screen/Web',
    draft: 'Draft Print',
    print: 'Quality Print',
    highQuality: 'High Quality',
    quality: {
      excellent: 'Excellent print quality',
      good: 'Good print quality',
      acceptable: 'Acceptable for viewing distance',
      low: 'Low quality - may appear pixelated'
    }
  }
};

// 读取并更新英文翻译文件
const enPath = path.join(process.cwd(), 'src', 'messages', 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// 添加新工具翻译
for (const [slug, translation] of Object.entries(BATCH52_TRANSLATIONS)) {
  enData.tools[slug] = translation;
}

// 保存更新
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2) + '\n');

console.log('✅ Batch 52 英文翻译已添加');
console.log(`   添加了 ${Object.keys(BATCH52_TRANSLATIONS).length} 个工具的翻译`);
