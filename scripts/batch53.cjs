const https = require('https');

const DIRECTORIES = [
  { name: 'React', submit: 'https://react.dev' },
  { name: 'React2', submit: 'https://react.dev/submit' },
  { name: 'Vue', submit: 'https://vuejs.org' },
  { name: 'Vue2', submit: 'https://vuejs.org/submit' },
  { name: 'Angular', submit: 'https://angular.io' },
  { name: 'Angular2', submit: 'https://angular.io/submit' },
  { name: 'Svelte', submit: 'https://svelte.dev' },
  { name: 'Svelte2', submit: 'https://svelte.dev/submit' },
  { name: 'Solid', submit: 'https://www.solidjs.com' },
  { name: 'Solid2', submit: 'https://www.solidjs.com/submit' },
  { name: 'NextJS', submit: 'https://nextjs.org' },
  { name: 'NextJS2', submit: 'https://nextjs.org/submit' },
  { name: 'Nuxt', submit: 'https://nuxt.com' },
  { name: 'Nuxt2', submit: 'https://nuxt.com/submit' },
  { name: 'SvelteKit', submit: 'https://kit.svelte.dev' },
  { name: 'SvelteKit2', submit: 'https://kit.svelte.dev/submit' },
  { name: 'Remix', submit: 'https://remix.run' },
  { name: 'Remix2', submit: 'https://remix.run/submit' },
  { name: 'Astro', submit: 'https://astro.build' },
  { name: 'Astro2', submit: 'https://astro.build/submit' },
  { name: 'Gatsby', submit: 'https://www.gatsbyjs.com' },
  { name: 'Gatsby2', submit: 'https://www.gatsbyjs.com/submit' },
  { name: 'Hugo', submit: 'https://gohugo.io' },
  { name: 'Hugo2', submit: 'https://gohugo.io/submit' },
  { name: 'Jekyll', submit: 'https://jekyllrb.com' },
  { name: 'Jekyll2', submit: 'https://jekyllrb.com/submit' },
  { name: 'Eleventy', submit: 'https://www.11ty.dev' },
  { name: 'Eleventy2', submit: 'https://www.11ty.dev/submit' },
  { name: 'Docusaurus', submit: 'https://docusaurus.io' },
  { name: 'Docusaurus2', submit: 'https://docusaurus.io/submit' },
  { name: 'VuePress', submit: 'https://vuepress.vuejs.org' },
  { name: 'VuePress2', submit: 'https://vuepress.vuejs.org/submit' },
  { name: 'VitePress', submit: 'https://vitepress.dev' },
  { name: 'VitePress2', submit: 'https://vitepress.dev/submit' },
  { name: 'Nextra', submit: 'https://nextra.site' },
  { name: 'Nextra2', submit: 'https://nextra.site/submit' },
  { name: 'TailwindCSS', submit: 'https://tailwindcss.com' },
  { name: 'TailwindCSS2', submit: 'https://tailwindcss.com/submit' },
  { name: 'Bootstrap', submit: 'https://getbootstrap.com' },
  { name: 'Bootstrap2', submit: 'https://getbootstrap.com/submit' },
  { name: 'Bulma', submit: 'https://bulma.io' },
  { name: 'Bulma2', submit: 'https://bulma.io/submit' },
  { name: 'Foundation', submit: 'https://get.foundation' },
  { name: 'Foundation2', submit: 'https://get.foundation/submit' },
  { name: 'MaterialUI', submit: 'https://mui.com' },
  { name: 'MaterialUI2', submit: 'https://mui.com/submit' },
  { name: 'ChakraUI', submit: 'https://chakra-ui.com' },
  { name: 'ChakraUI2', submit: 'https://chakra-ui.com/submit' },
  { name: 'Mantine', submit: 'https://mantine.dev' },
  { name: 'Mantine2', submit: 'https://mantine.dev/submit' },
  { name: 'HeadlessUI', submit: 'https://headlessui.com' },
  { name: 'HeadlessUI2', submit: 'https://headlessui.com/submit' },
  { name: 'RadixUI', submit: 'https://www.radix-ui.com' },
  { name: 'RadixUI2', submit: 'https://www.radix-ui.com/submit' },
  { name: 'AntDesign', submit: 'https://ant.design' },
  { name: 'AntDesign2', submit: 'https://ant.design/submit' },
  { name: 'ElementPlus', submit: 'https://element-plus.org' },
  { name: 'ElementPlus2', submit: 'https://element-plus.org/submit' },
  { name: 'Vuetify', submit: 'https://vuetifyjs.com' },
  { name: 'Vuetify2', submit: 'https://vuetifyjs.com/submit' },
  { name: 'Quasar', submit: 'https://quasar.dev' },
  { name: 'Quasar2', submit: 'https://quasar.dev/submit' },
  { name: 'PrimeVue', submit: 'https://primevue.org' },
  { name: 'PrimeVue2', submit: 'https://primevue.org/submit' },
  { name: 'NaiveUI', submit: 'https://naiveui.com' },
  { name: 'NaiveUI2', submit: 'https://naiveui.com/submit' },
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
  console.log(`🚀 Batch 53 - JS Frameworks & UI (${DIRECTORIES.length} directories)\n`);
  
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
