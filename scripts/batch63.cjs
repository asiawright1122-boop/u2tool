const https = require('https');

const DIRECTORIES = [
  { name: 'React', submit: 'https://react.dev' },
  { name: 'React2', submit: 'https://react.dev/learn' },
  { name: 'Vue', submit: 'https://vuejs.org' },
  { name: 'Vue2', submit: 'https://vuejs.org/guide' },
  { name: 'Angular', submit: 'https://angular.io' },
  { name: 'Angular2', submit: 'https://angular.io/docs' },
  { name: 'Svelte', submit: 'https://svelte.dev' },
  { name: 'Svelte2', submit: 'https://svelte.dev/docs' },
  { name: 'Solid', submit: 'https://www.solidjs.com' },
  { name: 'Solid2', submit: 'https://www.solidjs.com/docs' },
  { name: 'NextJS', submit: 'https://nextjs.org' },
  { name: 'NextJS2', submit: 'https://nextjs.org/docs' },
  { name: 'Nuxt', submit: 'https://nuxt.com' },
  { name: 'Nuxt2', submit: 'https://nuxt.com/docs' },
  { name: 'SvelteKit', submit: 'https://kit.svelte.dev' },
  { name: 'SvelteKit2', submit: 'https://kit.svelte.dev/docs' },
  { name: 'Remix', submit: 'https://remix.run' },
  { name: 'Remix2', submit: 'https://remix.run/docs' },
  { name: 'Astro', submit: 'https://astro.build' },
  { name: 'Astro2', submit: 'https://docs.astro.build' },
  { name: 'Gatsby', submit: 'https://www.gatsbyjs.com' },
  { name: 'Gatsby2', submit: 'https://www.gatsbyjs.com/docs' },
  { name: 'Hugo', submit: 'https://gohugo.io' },
  { name: 'Hugo2', submit: 'https://gohugo.io/documentation' },
  { name: 'Jekyll', submit: 'https://jekyllrb.com' },
  { name: 'Jekyll2', submit: 'https://jekyllrb.com/docs' },
  { name: 'Eleventy', submit: 'https://www.11ty.dev' },
  { name: 'Eleventy2', submit: 'https://www.11ty.dev/docs' },
  { name: 'Docusaurus', submit: 'https://docusaurus.io' },
  { name: 'Docusaurus2', submit: 'https://docusaurus.io/docs' },
  { name: 'VuePress', submit: 'https://vuepress.vuejs.org' },
  { name: 'VuePress2', submit: 'https://vuepress.vuejs.org/guide' },
  { name: 'VitePress', submit: 'https://vitepress.dev' },
  { name: 'VitePress2', submit: 'https://vitepress.dev/guide' },
  { name: 'Nextra', submit: 'https://nextra.site' },
  { name: 'Nextra2', submit: 'https://nextra.site/docs' },
  { name: 'TailwindCSS', submit: 'https://tailwindcss.com' },
  { name: 'TailwindCSS2', submit: 'https://tailwindcss.com/docs' },
  { name: 'Bootstrap', submit: 'https://getbootstrap.com' },
  { name: 'Bootstrap2', submit: 'https://getbootstrap.com/docs' },
  { name: 'Bulma', submit: 'https://bulma.io' },
  { name: 'Bulma2', submit: 'https://bulma.io/documentation' },
  { name: 'Foundation', submit: 'https://get.foundation' },
  { name: 'Foundation2', submit: 'https://get.foundation/sites/docs' },
  { name: 'MaterialUI', submit: 'https://mui.com' },
  { name: 'MaterialUI2', submit: 'https://mui.com/material-ui/getting-started' },
  { name: 'ChakraUI', submit: 'https://chakra-ui.com' },
  { name: 'ChakraUI2', submit: 'https://chakra-ui.com/docs' },
  { name: 'Mantine', submit: 'https://mantine.dev' },
  { name: 'Mantine2', submit: 'https://mantine.dev/pages/basics' },
  { name: 'HeadlessUI', submit: 'https://headlessui.com' },
  { name: 'HeadlessUI2', submit: 'https://headlessui.com/vue' },
  { name: 'RadixUI', submit: 'https://www.radix-ui.com' },
  { name: 'RadixUI2', submit: 'https://www.radix-ui.com/docs' },
  { name: 'AntDesign', submit: 'https://ant.design' },
  { name: 'AntDesign2', submit: 'https://ant.design/docs/react' },
  { name: 'ElementPlus', submit: 'https://element-plus.org' },
  { name: 'ElementPlus2', submit: 'https://element-plus.org/docs' },
  { name: 'Vuetify', submit: 'https://vuetifyjs.com' },
  { name: 'Vuetify2', submit: 'https://vuetifyjs.com/en/getting-started' },
  { name: 'Quasar', submit: 'https://quasar.dev' },
  { name: 'Quasar2', submit: 'https://quasar.dev/start' },
  { name: 'PrimeVue', submit: 'https://primevue.org' },
  { name: 'PrimeVue2', submit: 'https://primevue.org/installation' },
  { name: 'NaiveUI', submit: 'https://naiveui.com' },
  { name: 'NaiveUI2', submit: 'https://naiveui.com/theme' },
  { name: 'Shoelace', submit: 'https://shoelace.style' },
  { name: 'Shoelace2', submit: 'https://shoelace.style/getting-started' },
  { name: 'Lit', submit: 'https://lit.dev' },
  { name: 'Lit2', submit: 'https://lit.dev/docs' },
  { name: 'Stencil', submit: 'https://stenciljs.com' },
  { name: 'Stencil2', submit: 'https://stenciljs.com/docs' },
  { name: 'Ionic', submit: 'https://ionic.io' },
  { name: 'Ionic2', submit: 'https://ionic.io/docs' },
  { name: 'Capacitor', submit: 'https://capacitorjs.com' },
  { name: 'Capacitor2', submit: 'https://capacitorjs.com/docs' },
  { name: 'ReactNative', submit: 'https://reactnative.dev' },
  { name: 'ReactNative2', submit: 'https://reactnative.dev/docs' },
  { name: 'Expo', submit: 'https://expo.dev' },
  { name: 'Expo2', submit: 'https://docs.expo.dev' },
  { name: 'Flutter', submit: 'https://flutter.dev' },
  { name: 'Flutter2', submit: 'https://docs.flutter.dev' },
  { name: 'Tauri', submit: 'https://tauri.app' },
  { name: 'Tauri2', submit: 'https://tauri.app/docs' },
  { name: 'Electron', submit: 'https://www.electronjs.org' },
  { name: 'Electron2', submit: 'https://www.electronjs.org/docs' },
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
  console.log(`🚀 Batch 63 - Frameworks & Mobile (${DIRECTORIES.length} directories)\n`);
  
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
