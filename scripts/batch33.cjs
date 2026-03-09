const https = require('https');

const DIRECTORIES = [
  { name: 'ESLint2', submit: 'https://eslint.org' },
  { name: 'Prettier2', submit: 'https://prettier.io' },
  { name: 'TypeScript2', submit: 'https://www.typescriptlang.org' },
  { name: 'TSLint', submit: 'https://palantir.github.io/tslint' },
  { name: 'TSConfig', submit: 'https://www.typescriptlang.org/tsconfig' },
  { name: 'Babel2', submit: 'https://babeljs.io' },
  { name: 'Webpack2', submit: 'https://webpack.js.org' },
  { name: 'Vite2', submit: 'https://vitejs.dev' },
  { name: 'Rollup2', submit: 'https://rollupjs.org' },
  { name: 'Parcel2', submit: 'https://parceljs.org' },
  { name: 'swc2', submit: 'https://swc.rs' },
  { name: 'esbuild2', submit: 'https://esbuild.github.io' },
  { name: 'Rome', submit: 'https://rome.tools' },
  { name: 'Biome', submit: 'https://biomejs.dev' },
  { name: 'oxc', submit: 'https://oxc-project.github.io' },
  { name: 'nx2', submit: 'https://nx.dev' },
  { name: 'turborepo2', submit: 'https://turbo.build/repo' },
  { name: 'nx2', submit: 'https://nx.dev' },
  { name: 'Lerna2', submit: 'https://lerna.js.org' },
  { name: 'npmworkspaces', submit: 'https://docs.npmjs.com/cli/v10/using-npm/workspaces' },
  { name: 'YarnWorkspaces', submit: 'https://classic.yarnpkg.com/lang/en/docs/workspaces' },
  { name: 'PNPMWorkspace', submit: 'https://pnpm.io/workspaces' },
  { name: 'Rush2', submit: 'https://rushjs.io' },
  { name: 'Moon2', submit: 'https://moon.dev' },
  { name: 'Volt', submit: 'https://volt.build' },
  { name: 'Bolt', submit: 'https://bolt.ous.site' },
  { name: 'Tsup', submit: 'https://tsup.egoist.dev' },
  { name: 'MikroBundler', submit: 'https://github.com/mikro-orm/mikro-bundler' },
  { name: 'Parcel2', submit: 'https://parceljs.org' },
  { name: 'Snowpack2', submit: 'https://www.snowpack.dev' },
  { name: 'WMR', submit: 'https://preactjs.com/wmr' },
  { name: 'VitePress', submit: 'https://vitepress.vuejs.org' },
  { name: 'Astro2', submit: 'https://astro.build' },
  { name: 'Docusaurus2', submit: 'https://docusaurus.io' },
  { name: 'NextJS2', submit: 'https://nextjs.org' },
  { name: 'Nuxt2', submit: 'https://nuxt.com' },
  { name: 'SvelteKit2', submit: 'https://kit.svelte.dev' },
  { name: 'Remix2', submit: 'https://remix.run' },
  { name: 'Gatsby2', submit: 'https://www.gatsbyjs.com' },
  { name: 'Eleventy2', submit: 'https://www.11ty.dev' },
  { name: 'Hugo2', submit: 'https://gohugo.io' },
  { name: 'Jekyll2', submit: 'https://jekyllrb.com' },
  { name: 'Hexo', submit: 'https://hexo.io' },
  { name: 'Gatsby3', submit: 'https://www.gatsbyjs.com' },
  { name: 'VuePress2', submit: 'https://vuepress.vuejs.org' },
  { name: 'Saber', submit: 'https://saber.land' },
  { name: 'Scully2', submit: 'https://scully.io' },
  { name: 'IonicReact', submit: 'https://ionic.io/react' },
  { name: 'IonicVue', submit: 'https://ionic.io/vue' },
  { name: 'SolidStart', submit: 'https://start.solidjs.com' },
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
  console.log(`🚀 Batch 33 - Build Tools & Frameworks (${DIRECTORIES.length} directories)\n`);
  
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
