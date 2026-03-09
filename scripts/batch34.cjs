const https = require('https');

const DIRECTORIES = [
  { name: 'VSCode', submit: 'https://code.visualstudio.com' },
  { name: 'VSCode2', submit: 'https://marketplace.visualstudio.com' },
  { name: 'VSCodium', submit: 'https://vscodium.com' },
  { name: 'IntelliJ', submit: 'https://www.jetbrains.com/idea' },
  { name: 'WebStorm', submit: 'https://www.jetbrains.com/webstorm' },
  { name: 'PyCharm', submit: 'https://www.jetbrains.com/pycharm' },
  { name: 'GoLand', submit: 'https://www.jetbrains.com/go' },
  { name: 'Rider', submit: 'https://www.jetbrains.com/rider' },
  { name: 'CLion', submit: 'https://www.jetbrains.com/clion' },
  { name: 'DataGrip', submit: 'https://www.jetbrains.com/datagrip' },
  { name: 'RubyMine', submit: 'https://www.jetbrains.com/rubymine' },
  { name: 'PHPStorm', submit: 'https://www.jetbrains.com/phpstorm' },
  { name: 'AppCode', submit: 'https://www.jetbrains.com/objc' },
  { name: 'Aqua', submit: 'https://www.jetbrains.com/aqua' },
  { name: 'Sublime', submit: 'https://www.sublimetext.com' },
  { name: 'Atom', submit: 'https://atom.io' },
  { name: 'Notepad++', submit: 'https://notepad-plus-plus.org' },
  { name: 'Vim', submit: 'https://www.vim.org' },
  { name: 'Neovim', submit: 'https://neovim.io' },
  { name: 'Emacs', submit: 'https://www.gnu.org/software/emacs' },
  { name: 'Spacemacs', submit: 'https://www.spacemacs.org' },
  { name: 'DoomEmacs', submit: 'https://github.com/doomemacs/doomemacs' },
  { name: 'Kate', submit: 'https://kate-editor.org' },
  { name: 'gedit', submit: 'https://gedit.org' },
  { name: 'Brackets', submit: 'https://brackets.io' },
  { name: 'Bluefish', submit: 'https://bluefish.openoffice.nl' },
  { name: 'Coda', submit: 'https://panic.com/coda' },
  { name: 'Espresso', submit: 'https://espressoapp.com' },
  { name: 'BBEdit', submit: 'https://www.barebones.com/bbedit' },
  { name: 'TextMate', submit: 'https://macromates.com' },
  { name: 'Nova', submit: 'https://panic.com/nova' },
  { name: 'Zed', submit: 'https://zed.dev' },
  { name: 'Lapce', submit: 'https://lapce.dev' },
  { name: 'Helix', submit: 'https://helix-editor.com' },
  { name: 'Kakoune', submit: 'https://kakoune.org' },
  { name: 'LiteXL', submit: 'https://lite-xl.com' },
  { name: 'Micro', submit: 'https://github.com/zyedidia/micro' },
  { name: 'Nano', submit: 'https://www.nano-editor.org' },
  { name: 'Leafpad', submit: 'https://github.com/leafpad/leafpad' },
  { name: 'Mousepad', submit: 'https://github.com/codebrainz/mousepad' },
  { name: 'Geany', submit: 'https://www.geany.org' },
  { name: 'SciTE', submit: 'https://www.scintilla.org/SciTE' },
  { name: 'Textadept', submit: 'https://orbitalquark.github.io/textadept' },
  { name: 'SynWrite', submit: 'https://github.com/Alexey-T/SynWrite' },
  { name: 'EditPlus', submit: 'https://www.editplus.com' },
  { name: 'UltraEdit', submit: 'https://www.ultraedit.com' },
  { name: 'PSPad', submit: 'https://pspad.com' },
  { name: 'Notepad2', submit: 'https://github.com/zufuliu/notepad2' },
  { name: 'ConText', submit: 'https://www.contexteditor.org' },
  { name: 'EmEditor', submit: 'https://www.emeditor.com' },
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
  console.log(`🚀 Batch 34 - Code Editors (${DIRECTORIES.length} directories)\n`);
  
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
