const https = require('https');

const DIRECTORIES = [
  { name: 'Git', submit: 'https://git-scm.com' },
  { name: 'GitHub', submit: 'https://github.com' },
  { name: 'GitLab', submit: 'https://gitlab.com' },
  { name: 'Bitbucket', submit: 'https://bitbucket.org' },
  { name: 'SourceForge', submit: 'https://sourceforge.net' },
  { name: 'Gitee', submit: 'https://gitee.com' },
  { name: 'Codeberg', submit: 'https://codeberg.org' },
  { name: 'Gitea', submit: 'https://gitea.io' },
  { name: 'GitKraken', submit: 'https://www.gitkraken.com' },
  { name: 'Tower', submit: 'https://www.git-tower.com' },
  { name: 'Sourcetree', submit: 'https://www.sourcetreeapp.com' },
  { name: 'Fork', submit: 'https://git-fork.com' },
  { name: 'GitHubDesktop', submit: 'https://desktop.github.com' },
  { name: 'GitHubCLI', submit: 'https://cli.github.com' },
  { name: 'GitLabCLI', submit: 'https://gitlab.com/gitlab-org/gitlab-ce' },
  { name: 'GitExtensions', submit: 'https://gitextensions.github.io' },
  { name: 'TortoiseGit', submit: 'https://tortoisegit.org' },
  { name: 'GitFlow', submit: 'https://nvie.com/posts/introducing-gitflow' },
  { name: 'GitHubFlow', submit: 'https://github.flow.io' },
  { name: 'ConventionalCommits', submit: 'https://www.conventionalcommits.org' },
  { name: 'CommitLint', submit: 'https://commitlint.js.org' },
  { name: 'Husky', submit: 'https://typicode.github.io/husky' },
  { name: 'LintStaged', submit: 'https://github.com/okonet/lint-staged' },
  { name: 'StandardVersion', submit: 'https://github.com/conventional-changelog/standard-version' },
  { name: 'ReleaseIt', submit: 'https://github.com/release-it/release-it' },
  { name: 'Changesets', submit: 'https://github.com/changesets/changesets' },
  { name: 'SemanticRelease', submit: 'https://semantic-release.org' },
  { name: 'npm', submit: 'https://www.npmjs.com' },
  { name: 'Yarn', submit: 'https://yarnpkg.com' },
  { name: 'PNPM', submit: 'https://pnpm.io' },
  { name: 'Bun', submit: 'https://bun.sh' },
  { name: 'NPMRegistry', submit: 'https://registry.npmjs.org' },
  { name: 'Lerna', submit: 'https://lerna.js.org' },
  { name: 'Nx', submit: 'https://nx.dev' },
  { name: 'Turborepo', submit: 'https://turbo.build/repo' },
  { name: 'Rush', submit: 'https://rushjs.io' },
  { name: 'Plop', submit: 'https://plopjs.com' },
  { name: 'Hygen', submit: 'https://www.hygen.io' },
  { name: 'Yeoman', submit: 'https://yeoman.io' },
  { name: 'CreateReactApp', submit: 'https://create-react-app.dev' },
  { name: 'Vite', submit: 'https://vitejs.dev' },
  { name: 'Parcel', submit: 'https://parceljs.org' },
  { name: 'Snowpack', submit: 'https://www.snowpack.dev' },
  { name: 'WMR', submit: 'https://preactjs.com/wmr' },
  { name: 'Rome', submit: 'https://rome.tools' },
  { name: 'Biome', submit: 'https://biomejs.dev' },
  { name: 'oxc', submit: 'https://oxc-project.github.io' },
  { name: 'ESLint', submit: 'https://eslint.org' },
  { name: 'Prettier', submit: 'https://prettier.io' },
  { name: 'TypeScript', submit: 'https://www.typescriptlang.org' },
  { name: 'Babel', submit: 'https://babeljs.io' },
  { name: 'Webpack', submit: 'https://webpack.js.org' },
  { name: 'Rollup', submit: 'https://rollupjs.org' },
  { name: 'esbuild', submit: 'https://esbuild.github.io' },
  { name: 'swc', submit: 'https://swc.rs' },
  { name: 'NodeJS', submit: 'https://nodejs.org' },
  { name: 'Deno', submit: 'https://deno.land' },
  { name: 'React', submit: 'https://react.dev' },
  { name: 'Vue', submit: 'https://vuejs.org' },
  { name: 'Angular', submit: 'https://angular.io' },
  { name: 'Svelte', submit: 'https://svelte.dev' },
  { name: 'Solid', submit: 'https://www.solidjs.com' },
  { name: 'Lit', submit: 'https://lit.dev' },
  { name: 'Stencil', submit: 'https://stenciljs.com' },
  { name: 'Ember', submit: 'https://emberjs.com' },
  { name: 'Backbone', submit: 'https://backbonejs.org' },
  { name: 'jQuery', submit: 'https://jquery.com' },
  { name: 'Alpine', submit: 'https://alpinejs.dev' },
  { name: 'Stimulus', submit: 'https://stimulus.hotwired.dev' },
  { name: 'HTMX', submit: 'https://htmx.org' },
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
  { name: 'Carbon', submit: 'https://carbondesignsystem.com' },
  { name: 'Lightning', submit: 'https://lightningdesignsystem.com' },
  { name: 'Evergreen', submit: 'https://evergreen.surge.sh' },
  { name: 'Spectrum', submit: 'https://spectrum.adobe.com' },
  { name: 'FluentUI', submit: 'https://fluentui.microsoft.com' },
  { name: 'Blueprint', submit: 'https://blueprintjs.com' },
  { name: 'Grommet', submit: 'https://v2.grommet.io' },
  { name: 'Rebass', submit: 'https://rebassjs.org' },
  { name: 'StyledComponents', submit: 'https://styled-components.com' },
  { name: 'Emotion', submit: 'https://emotion.sh' },
  { name: 'CSSModules', submit: 'https://github.com/css-modules/css-modules' },
  { name: 'Tailwind', submit: 'https://tailwindcss.com' },
  { name: 'PostCSS', submit: 'https://postcss.org' },
  { name: 'Sass', submit: 'https://sass-lang.com' },
  { name: 'Less', submit: 'https://lesscss.org' },
  { name: 'Stylus', submit: 'https://stylus-lang.com' },
  { name: 'CSSinJS', submit: 'https://cssinjs.org' },
  { name: 'VanillaExtract', submit: 'https://vanilla-extract.style' },
  { name: 'Linaria', submit: 'https://linaria.dev' },
  { name: 'GoLang', submit: 'https://go.dev' },
  { name: 'Rust', submit: 'https://www.rust-lang.org' },
  { name: 'Python', submit: 'https://www.python.org' },
  { name: 'Java', submit: 'https://www.java.com' },
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
  console.log(`🚀 Batch 71 - Dev Tools & Frameworks (${DIRECTORIES.length} directories)\n`);
  
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
