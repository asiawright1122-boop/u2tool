#!/usr/bin/env node

/**
 * Comprehensive Directory Discovery - 200+ directories
 */

const DIRECTORIES = [
  // Major Tech & Developer
  { name: 'TechCrunch', url: 'https://techcrunch.com', category: 'Tech News' },
  { name: 'The Verge', url: 'https://www.theverge.com', category: 'Tech News' },
  { name: 'Wired', url: 'https://www.wired.com', category: 'Tech News' },
  { name: 'Ars Technica', url: 'https://arstechnica.com', category: 'Tech News' },
  { name: 'ZDNet', url: 'https://www.zdnet.com', category: 'Tech News' },
  { name: 'CNET', url: 'https://www.cnet.com', category: 'Tech News' },
  { name: 'Engadget', url: 'https://www.engadget.com', category: 'Tech News' },
  { name: 'Mashable', url: 'https://mashable.com', category: 'Tech News' },
  { name: 'The Next Web', url: 'https://thenextweb.com', category: 'Tech News' },
  { name: 'VentureBeat', url: 'https://venturebeat.com', category: 'Tech News' },
  
  // Developer Communities
  { name: 'CodeProject', url: 'https://www.codeproject.com', category: 'Developer' },
  { name: 'DZone', url: 'https://dzone.com', category: 'Developer' },
  { name: 'SitePoint', url: 'https://www.sitepoint.com', category: 'Developer' },
  { name: 'Tuts+', url: 'https://tutsplus.com', category: 'Developer' },
  { name: 'CSS-Tricks', url: 'https://css-tricks.com', category: 'Developer' },
  { name: 'Smashing Magazine', url: 'https://www.smashingmagazine.com', category: 'Developer' },
  { name: 'JavaScript Weekly', url: 'https://javascriptweekly.com', category: 'Newsletter' },
  { name: 'Frontend Focus', url: 'https://frontendfocus.co', category: 'Newsletter' },
  { name: 'Node Weekly', url: 'https://nodeweekly.com', category: 'Newsletter' },
  { name: 'Python Weekly', url: 'https://pythonweekly.com', category: 'Newsletter' },
  
  // Bookmarking & Social
  { name: 'Diigo', url: 'https://www.diigo.com', category: 'Bookmark' },
  { name: 'BibSonomy', url: 'https://www.bibsonomy.org', category: 'Bookmark' },
  { name: 'Instapaper', url: 'https://www.instapaper.com', category: 'Bookmark' },
  { name: 'Pocket', url: 'https://getpocket.com', category: 'Bookmark' },
  { name: 'Flipboard', url: 'https://flipboard.com', category: 'Social' },
  { name: 'Feedly', url: 'https://feedly.com', category: 'RSS' },
  
  // Business Directories
  { name: 'Crunchbase', url: 'https://www.crunchbase.com', category: 'Business' },
  { name: 'AngelList', url: 'https://angel.co', category: 'Business' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com', category: 'Social' },
  { name: 'Indeed', url: 'https://www.indeed.com', category: 'Jobs' },
  { name: 'Glassdoor', url: 'https://www.glassdoor.com', category: 'Jobs' },
  
  // Tool Directories
  { name: 'Product Hunt', url: 'https://producthunt.com', category: 'Discovery' },
  { name: 'StackShare', url: 'https://stackshare.io', category: 'Discovery' },
  { name: 'AlternativeTo', url: 'https://alternativeto.net', category: 'Discovery' },
  { name: 'G2', url: 'https://www.g2.com', category: 'Discovery' },
  { name: 'Capterra', url: 'https://www.capterra.com', category: 'Discovery' },
  { name: 'TrustRadius', url: 'https://www.trustradius.com', category: 'Discovery' },
  { name: 'GetApp', url: 'https://www.getapp.com', category: 'Discovery' },
  { name: 'Software Advice', url: 'https://www.softwareadvice.com', category: 'Discovery' },
  
  // Chinese Platforms
  { name: 'Juejin', url: 'https://juejin.cn', category: 'Chinese' },
  { name: 'SegmentFault', url: 'https://segmentfault.com', category: 'Chinese' },
  { name: 'OSChina', url: 'https://www.oschina.net', category: 'Chinese' },
  { name: 'Cnblogs', url: 'https://www.cnblogs.com', category: 'Chinese' },
  { name: 'CSDN', url: 'https://blog.csdn.net', category: 'Chinese' },
  { name: '51CTO', url: 'https://blog.51cto.com', category: 'Chinese' },
  { name: 'ITEye', url: 'https://www.iteye.com', category: 'Chinese' },
  { name: 'ChinaUnix', url: 'https://www.chinaunix.net', category: 'Chinese' },
  
  // Japanese Platforms
  { name: 'Qiita', url: 'https://qiita.com', category: 'Japanese' },
  { name: 'Hatena', url: 'https://hatena.ne.jp', category: 'Japanese' },
  { name: 'FC2', url: 'https://fc2.com', category: 'Japanese' },
  
  // Korean Platforms
  { name: 'Naver', url: 'https://www.naver.com', category: 'Korean' },
  { name: 'Kakao', url: 'https://www.kakao.com', category: 'Korean' },
  
  // Indian Platforms
  { name: 'IndiaFred', url: 'https://www.indianfrro.gov.in', category: 'India' },
  { name: 'Sulekha', url: 'https://www.sulekha.com', category: 'India' },
  
  // European Platforms
  { name: '01net', url: 'https://www.01net.com', category: 'French' },
  { name: 'Numerama', url: 'https://www.numerama.com', category: 'French' },
  { name: 'Heise', url: 'https://www.heise.de', category: 'German' },
  { name: 'Chip Online', url: 'https://www.chip.de', category: 'German' },
  { name: 'T-online', url: 'https://www.t-online.de', category: 'German' },
  
  // Russian Platforms
  { name: 'Habr', url: 'https://habr.com', category: 'Russian' },
  { name: 'VC.ru', url: 'https://vc.ru', category: 'Russian' },
  { name: 'Toster', url: 'https://toster.ru', category: 'Russian' },
  
  // Brazilian/Portuguese
  { name: 'Imasters', url: 'https://imasters.com.br', category: 'Portuguese' },
  { name: 'DevMedia', url: 'https://www.devmedia.com.br', category: 'Portuguese' },
  { name: 'Tableless', url: 'https://tableless.com.br', category: 'Portuguese' },
  
  // Spanish
  { name: 'Genbeta', url: 'https://www.genbeta.com', category: 'Spanish' },
  { name: 'Incuba', url: 'https://incuba.es', category: 'Spanish' },
  { name: 'Bloguers', url: 'https://bloguers.net', category: 'Spanish' },
  
  // Tool Specific
  { name: 'JSONPlaceholder', url: 'https://jsonplaceholder.typicode.com', category: 'Tools' },
  { name: 'Public APIs', url: 'https://publicapis.dev', category: 'Tools' },
  { name: 'RapidAPI', url: 'https://rapidapi.com', category: 'API' },
  { name: 'ProgrammableWeb', url: 'https://www.programmableweb.com', category: 'API' },
  { name: 'APIs.io', url: 'https://apis.io', category: 'API' },
  
  // Open Source
  { name: 'SourceForge', url: 'https://sourceforge.net', category: 'Open Source' },
  { name: 'GitLab', url: 'https://gitlab.com', category: 'Open Source' },
  { name: 'Bitbucket', url: 'https://bitbucket.org', category: 'Open Source' },
  { name: 'NPM', url: 'https://www.npmjs.com', category: 'Package' },
  { name: 'Packagist', url: 'https://packagist.org', category: 'Package' },
  { name: 'PyPI', url: 'https://pypi.org', category: 'Package' },
  { name: 'Maven Central', url: 'https://mvnrepository.com', category: 'Package' },
  
  // Reference
  { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', category: 'Reference' },
  { name: 'W3Schools', url: 'https://www.w3schools.com', category: 'Reference' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com', category: 'Q&A' },
  { name: 'Quora', url: 'https://www.quora.com', category: 'Q&A' },
  { name: 'Reddit', url: 'https://www.reddit.com', category: 'Social' },
  { name: 'Twitter', url: 'https://twitter.com', category: 'Social' },
  { name: 'Facebook', url: 'https://www.facebook.com', category: 'Social' },
  
  // Video
  { name: 'YouTube', url: 'https://www.youtube.com', category: 'Video' },
  { name: 'Vimeo', url: 'https://vimeo.com', category: 'Video' },
  { name: 'Bilibili', url: 'https://www.bilibili.com', category: 'Video' },
  
  // Podcast
  { name: 'Spotify', url: 'https://open.spotify.com', category: 'Podcast' },
  { name: 'Apple Podcasts', url: 'https://podcasts.apple.com', category: 'Podcast' },
  { name: 'Google Podcasts', url: 'https://podcasts.google.com', category: 'Podcast' },
  
  // News Letters
  { name: 'Substack', url: 'https://substack.com', category: 'Newsletter' },
  { name: 'Medium', url: 'https://medium.com', category: 'Blog' },
  { name: 'Ghost', url: 'https://ghost.org', category: 'Blog' },
  
  // SEO
  { name: 'Moz', url: 'https://moz.com', category: 'SEO' },
  { name: 'Ahrefs', url: 'https://ahrefs.com', category: 'SEO' },
  { name: 'SEMrush', url: 'https://www.semrush.com', category: 'SEO' },
  
  // Analytics
  { name: 'Google Analytics', url: 'https://analytics.google.com', category: 'Analytics' },
  { name: 'Mixpanel', url: 'https://mixpanel.com', category: 'Analytics' },
  { name: 'Amplitude', url: 'https://amplitude.com', category: 'Analytics' },
  
  // Hosting
  { name: 'Vercel', url: 'https://vercel.com', category: 'Hosting' },
  { name: 'Netlify', url: 'https://www.netlify.com', category: 'Hosting' },
  { name: 'Cloudflare', url: 'https://www.cloudflare.com', category: 'CDN' },
  
  // Domain
  { name: 'Namecheap', url: 'https://www.namecheap.com', category: 'Domain' },
  { name: 'GoDaddy', url: 'https://www.godaddy.com', category: 'Domain' },
  { name: 'Domainr', url: 'https://domainr.com', category: 'Domain' },
  
  // Design
  { name: 'Dribbble', url: 'https://dribbble.com', category: 'Design' },
  { name: 'Behance', url: 'https://www.behance.net', category: 'Design' },
  { name: 'Figma', url: 'https://www.figma.com', category: 'Design' },
  { name: 'Canva', url: 'https://www.canva.com', category: 'Design' },
  
  // Font
  { name: 'Google Fonts', url: 'https://fonts.google.com', category: 'Font' },
  { name: 'Adobe Fonts', url: 'https://fonts.adobe.com', category: 'Font' },
  
  // Icon
  { name: 'Font Awesome', url: 'https://fontawesome.com', category: 'Icon' },
  { name: 'Flaticon', url: 'https://www.flaticon.com', category: 'Icon' },
  { name: 'Icons8', url: 'https://icons8.com', category: 'Icon' },
  
  // Image
  { name: 'Unsplash', url: 'https://unsplash.com', category: 'Image' },
  { name: 'Pexels', url: 'https://www.pexels.com', category: 'Image' },
  { name: 'Pixabay', url: 'https://pixabay.com', category: 'Image' },
  { name: 'Imgur', url: 'https://imgur.com', category: 'Image' },
  
  // Color
  { name: 'Coolors', url: 'https://coolors.co', category: 'Color' },
  { name: 'Color Hunt', url: 'https://colorhunt.co', category: 'Color' },
  { name: 'Adobe Color', url: 'https://color.adobe.com', category: 'Color' },
];

console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║            COMPREHENSIVE DIRECTORY LIST - ${DIRECTORIES.length} sites      ║
╚══════════════════════════════════════════════════════════════════════╝
`);

const categories = {};
DIRECTORIES.forEach(d => {
  if (!categories[d.category]) categories[d.category] = [];
  categories[d.category].push(d);
});

Object.entries(categories).forEach(([cat, sites]) => {
  console.log(`\n📁 ${cat} (${sites.length}):`);
  sites.forEach(s => console.log(`   - ${s.name}: ${s.url}`));
});

console.log(`\n\n💡 Action Items:`);
console.log('1. Create accounts on: Product Hunt, StackShare, Dev.to, Hashnode');
console.log('2. Post on: Reddit, Hacker News, Juejin, SegmentFault');
console.log('3. Answer: Stack Overflow, Quora, Japanese/Chinese Q&A');
console.log('4. Add to: AlternativeTo, G2, Capterra');
console.log('5. Create content: Medium, Substack, YouTube, Bilibili');
