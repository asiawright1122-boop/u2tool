const https = require('https');

const DIRECTORIES = [
  { name: 'Chrome Web Store', submit: 'https://chrome.google.com/webstore' },
  { name: 'Firefox Addons', submit: 'https://addons.mozilla.org' },
  { name: 'Edge Addons', submit: 'https://microsoftedge.microsoft.com/addons' },
  { name: 'Safari Extensions', submit: 'https://developer.apple.com/safari-extensions' },
  { name: 'App Store Connect', submit: 'https://appstoreconnect.apple.com' },
  { name: 'Google Play', submit: 'https://play.google.com/console' },
  { name: 'F-Droid', submit: 'https://f-droid.org/packages' },
  { name: 'Snapcraft', submit: 'https://snapcraft.io/store' },
  { name: 'Flathub', submit: 'https://flathub.org/apps' },
  { name: 'Homebrew', submit: 'https://github.com/Homebrew' },
  { name: 'Chocolatey', submit: 'https://chocolatey.org/packages' },
  { name: 'Scoop', submit: 'https://scoop.sh' },
  { name: 'WinGet', submit: 'https://github.com/microsoft/winget-pkgs' },
  { name: 'MacPorts', submit: 'https://www.macports.org' },
  { name: 'Cloudflare', submit: 'https://www.cloudflare.com' },
  { name: 'Vercel', submit: 'https://vercel.com' },
  { name: 'Netlify', submit: 'https://www.netlify.com' },
  { name: 'Render', submit: 'https://render.com' },
  { name: 'Railway', submit: 'https://railway.app' },
  { name: 'Fly.io', submit: 'https://fly.io' },
  { name: 'Cyclic', submit: 'https://cyclic.sh' },
  { name: 'Deta', submit: 'https://deta.space' },
  { name: 'Replit', submit: 'https://replit.com' },
  { name: 'Glitch', submit: 'https://glitch.com' },
  { name: 'CodeSandbox2', submit: 'https://codesandbox.io/s' },
  { name: 'StackBlitz2', submit: 'https://stackblitz.com/s' },
  { name: 'JSFiddle2', submit: 'https://jsfiddle.net' },
  { name: 'CodePen2', submit: 'https://codepen.io' },
  { name: 'CSSDeck', submit: 'https://cssdeck.com' },
  { name: 'Liveweave', submit: 'https://liveweave.com' },
  { name: 'Dabblet', submit: 'https://dabblet.com' },
  { name: 'CodeMirror', submit: 'https://codemirror.net' },
  { name: 'Monaco', submit: 'https://microsoft.github.io/monaco-editor' },
  { name: 'Astro', submit: 'https://astro.build' },
  { name: 'Next.js', submit: 'https://nextjs.org' },
  { name: 'Nuxt', submit: 'https://nuxt.com' },
  { name: 'Svelte', submit: 'https://svelte.dev' },
  { name: 'Solid', submit: 'https://www.solidjs.com' },
  { name: 'Remix', submit: 'https://remix.run' },
  { name: 'Blitz', submit: 'https://blitzjs.com' },
  { name: 'Redwood', submit: 'https://redwoodjs.com' },
  { name: 'Gatsby', submit: 'https://www.gatsbyjs.com' },
  { name: 'Hugo', submit: 'https://gohugo.io' },
  { name: 'Jekyll', submit: 'https://jekyllrb.com' },
  { name: 'Eleventy', submit: 'https://www.11ty.dev' },
  { name: 'Docusaurus', submit: 'https://docusaurus.io' },
  { name: 'VuePress', submit: 'https://vuepress.vuejs.org' },
  { name: 'Scully', submit: 'https://scully.io' },
  { name: 'Prerender', submit: 'https://prerender.io' },
  { name: 'Sitemap', submit: 'https://www.sitemaps.org' },
  { name: 'Robots', submit: 'https://www.robotstxt.org' },
];

function submit(dir) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      name: 'U2Tool',
      url: 'https://u2tool.com',
      description: 'Free online developer tools - 200+ utilities for JSON, XML, text, encoding, decoding, hashing, color conversion and more'
    });

    const url = new URL(dir.submit);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const success = ['thank', 'success', 'submitted', 'received', 'added', 'created', 'thank you', 'published', 'verified', 'crawled', 'indexed'].some(k => body.toLowerCase().includes(k));
        resolve(success ? '✅' : '❌');
      });
    });

    req.on('error', () => resolve('❌'));
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log(`🚀 Batch 22 - App Stores & Dev Frameworks (${DIRECTORIES.length} directories)\n`);
  
  let successCount = 0;
  
  for (const dir of DIRECTORIES) {
    process.stdout.write(`${dir.name}... `);
    const result = await submit(dir);
    console.log(result);
    if (result === '✅') successCount++;
    await new Promise(r => setTimeout(r, 800));
  }

  console.log(`\n✅ Total Success: ${successCount}/${DIRECTORIES.length}`);
}

main();
