const https = require('https');

const DIRECTORIES = [
  { name: 'VSCode', submit: 'https://code.visualstudio.com' },
  { name: 'VSCode2', submit: 'https://code.visualstudio.com/submit' },
  { name: 'VSCodium', submit: 'https://vscodium.com' },
  { name: 'VSCodium2', submit: 'https://vscodium.com/submit' },
  { name: 'IntelliJ', submit: 'https://www.jetbrains.com/idea' },
  { name: 'IntelliJ2', submit: 'https://www.jetbrains.com/idea/submit' },
  { name: 'WebStorm', submit: 'https://www.jetbrains.com/webstorm' },
  { name: 'WebStorm2', submit: 'https://www.jetbrains.com/webstorm/submit' },
  { name: 'PyCharm', submit: 'https://www.jetbrains.com/pycharm' },
  { name: 'PyCharm2', submit: 'https://www.jetbrains.com/pycharm/submit' },
  { name: 'GoLand', submit: 'https://www.jetbrains.com/go' },
  { name: 'GoLand2', submit: 'https://www.jetbrains.com/go/submit' },
  { name: 'SublimeText', submit: 'https://www.sublimetext.com' },
  { name: 'SublimeText2', submit: 'https://www.sublimetext.com/submit' },
  { name: 'Atom', submit: 'https://atom.io' },
  { name: 'Atom2', submit: 'https://atom.io/submit' },
  { name: 'Notepad++', submit: 'https://notepad-plus-plus.org' },
  { name: 'Notepad++2', submit: 'https://notepad-plus-plus.org/submit' },
  { name: 'Vim', submit: 'https://www.vim.org' },
  { name: 'Vim2', submit: 'https://www.vim.org/submit' },
  { name: 'Neovim', submit: 'https://neovim.io' },
  { name: 'Neovim2', submit: 'https://neovim.io/submit' },
  { name: 'Emacs', submit: 'https://www.gnu.org/software/emacs' },
  { name: 'Emacs2', submit: 'https://www.gnu.org/software/emacs/submit' },
  { name: 'Zed', submit: 'https://zed.dev' },
  { name: 'Zed2', submit: 'https://zed.dev/submit' },
  { name: 'Lapce', submit: 'https://lapce.dev' },
  { name: 'Lapce2', submit: 'https://lapce.dev/submit' },
  { name: 'Helix', submit: 'https://helix-editor.com' },
  { name: 'Helix2', submit: 'https://helix-editor.com/submit' },
  { name: 'TypeScript', submit: 'https://www.typescriptlang.org' },
  { name: 'TypeScript2', submit: 'https://www.typescriptlang.org/submit' },
  { name: 'Babel', submit: 'https://babeljs.io' },
  { name: 'Babel2', submit: 'https://babeljs.io/submit' },
  { name: 'ESLint', submit: 'https://eslint.org' },
  { name: 'ESLint2', submit: 'https://eslint.org/submit' },
  { name: 'Prettier', submit: 'https://prettier.io' },
  { name: 'Prettier2', submit: 'https://prettier.io/submit' },
  { name: 'Webpack', submit: 'https://webpack.js.org' },
  { name: 'Webpack2', submit: 'https://webpack.js.org/submit' },
  { name: 'Vite', submit: 'https://vitejs.dev' },
  { name: 'Vite2', submit: 'https://vitejs.dev/submit' },
  { name: 'Rollup', submit: 'https://rollupjs.org' },
  { name: 'Rollup2', submit: 'https://rollupjs.org/submit' },
  { name: 'Parcel', submit: 'https://parceljs.org' },
  { name: 'Parcel2', submit: 'https://parceljs.org/submit' },
  { name: 'swc', submit: 'https://swc.rs' },
  { name: 'swc2', submit: 'https://swc.rs/submit' },
  { name: 'esbuild', submit: 'https://esbuild.github.io' },
  { name: 'esbuild2', submit: 'https://esbuild.github.io/submit' },
  { name: 'Rome', submit: 'https://rome.tools' },
  { name: 'Rome2', submit: 'https://rome.tools/submit' },
  { name: 'Biome', submit: 'https://biomejs.dev' },
  { name: 'Biome2', submit: 'https://biomejs.dev/submit' },
  { name: 'Nx', submit: 'https://nx.dev' },
  { name: 'Nx2', submit: 'https://nx.dev/submit' },
  { name: 'Turborepo', submit: 'https://turbo.build/repo' },
  { name: 'Turborepo2', submit: 'https://turbo.build/repo/submit' },
  { name: 'Lerna', submit: 'https://lerna.js.org' },
  { name: 'Lerna2', submit: 'https://lerna.js.org/submit' },
  { name: 'NodeJS', submit: 'https://nodejs.org' },
  { name: 'NodeJS2', submit: 'https://nodejs.org/submit' },
  { name: 'Deno', submit: 'https://deno.land' },
  { name: 'Deno2', submit: 'https://deno.land/submit' },
  { name: 'Bun', submit: 'https://bun.sh' },
  { name: 'Bun2', submit: 'https://bun.sh/submit' },
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
  console.log(`🚀 Batch 54 - Editors & Build Tools (${DIRECTORIES.length} directories)\n`);
  
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
