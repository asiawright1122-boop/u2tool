const https = require('https');

const DIRECTORIES = [
  { name: 'TypeScript', submit: 'https://www.typescriptlang.org' },
  { name: 'Babel', submit: 'https://babeljs.io' },
  { name: 'ESLint', submit: 'https://eslint.org' },
  { name: 'Prettier', submit: 'https://prettier.io' },
  { name: 'Webpack', submit: 'https://webpack.js.org' },
  { name: 'Vite', submit: 'https://vitejs.dev' },
  { name: 'Rollup', submit: 'https://rollupjs.org' },
  { name: 'Parcel', submit: 'https://parceljs.org' },
  { name: 'Snowpack', submit: 'https://www.snowpack.dev' },
  { name: 'Turbopack', submit: 'https://turbo.build/pack' },
  { name: 'swc', submit: 'https://swc.rs' },
  { name: 'esbuild', submit: 'https://esbuild.github.io' },
  { name: 'Node', submit: 'https://nodejs.org' },
  { name: 'Deno', submit: 'https://deno.land' },
  { name: 'Bun', submit: 'https://bun.sh' },
  { name: 'React', submit: 'https://react.dev' },
  { name: 'Vue', submit: 'https://vuejs.org' },
  { name: 'Angular', submit: 'https://angular.io' },
  { name: 'SvelteKit', submit: 'https://kit.svelte.dev' },
  { name: 'Qwik', submit: 'https://qwik.builder.io' },
  { name: 'Fresh', submit: 'https://fresh.deno.dev' },
  { name: 'Lit', submit: 'https://lit.dev' },
  { name: 'Stencil', submit: 'https://stenciljs.com' },
  { name: 'Ember', submit: 'https://emberjs.com' },
  { name: 'Backbone', submit: 'https://backbonejs.org' },
  { name: 'jQuery', submit: 'https://jquery.com' },
  { name: 'Alpine', submit: 'https://alpinejs.dev' },
  { name: 'Stimulus', submit: 'https://stimulus.hotwired.dev' },
  { name: 'HTMX', submit: 'https://htmx.org' },
  { name: 'Alpine2', submit: 'https://alpinejs.dev' },
  { name: 'Tailwind', submit: 'https://tailwindcss.com' },
  { name: 'Bootstrap', submit: 'https://getbootstrap.com' },
  { name: 'Bulma', submit: 'https://bulma.io' },
  { name: 'Foundation', submit: 'https://get.foundation' },
  { name: 'Material', submit: 'https://m3.material.io' },
  { name: 'Chakra', submit: 'https://chakra-ui.com' },
  { name: 'Mantine', submit: 'https://mantine.dev' },
  { name: 'Radix', submit: 'https://www.radix-ui.com' },
  { name: 'HeadlessUI', submit: 'https://headlessui.com' },
  { name: 'AntD', submit: 'https://ant.design' },
  { name: 'Element', submit: 'https://element-plus.org' },
  { name: 'Vuetify', submit: 'https://vuetifyjs.com' },
  { name: 'Quasar', submit: 'https://quasar.dev' },
  { name: 'PrimeVue', submit: 'https://primevue.org' },
  { name: 'NaiveUI', submit: 'https://naiveui.com' },
  { name: 'Shoelace', submit: 'https://shoelace.style' },
  { name: 'Shoelace2', submit: 'https://shoelace.style' },
  { name: 'Carbon', submit: 'https://carbondesignsystem.com' },
  { name: 'Lightning', submit: 'https://lightningdesignsystem.com' },
  { name: 'Evergreen', submit: 'https://evergreen.surge.sh' },
  { name: 'Spectrum', submit: 'https://spectrum.adobe.com' },
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
  console.log(`🚀 Batch 23 - JS Frameworks & UI Libraries (${DIRECTORIES.length} directories)\n`);
  
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
