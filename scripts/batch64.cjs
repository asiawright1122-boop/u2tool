const https = require('https');

const DIRECTORIES = [
  { name: 'TypeScript', submit: 'https://www.typescriptlang.org' },
  { name: 'TypeScript2', submit: 'https://www.typescriptlang.org/docs' },
  { name: 'JavaScript', submit: 'https://www.javascript.com' },
  { name: 'JavaScript2', submit: 'https://www.javascript.com/learn' },
  { name: 'Python', submit: 'https://www.python.org' },
  { name: 'Python2', submit: 'https://docs.python.org' },
  { name: 'Java', submit: 'https://www.java.com' },
  { name: 'Java2', submit: 'https://docs.oracle.com/javase' },
  { name: 'Go', submit: 'https://go.dev' },
  { name: 'Go2', submit: 'https://go.dev/doc' },
  { name: 'Rust', submit: 'https://www.rust-lang.org' },
  { name: 'Rust2', submit: 'https://doc.rust-lang.org' },
  { name: 'C', submit: 'https://en.cppreference.com' },
  { name: 'C2', submit: 'https://en.cppreference.com/w' },
  { name: 'CPP', submit: 'https://cplusplus.com' },
  { name: 'CPP2', submit: 'https://cplusplus.com/doc' },
  { name: 'CSharp', submit: 'https://learn.microsoft.com/dotnet/csharp' },
  { name: 'CSharp2', submit: 'https://docs.microsoft.com/dotnet/csharp' },
  { name: 'PHP', submit: 'https://www.php.net' },
  { name: 'PHP2', submit: 'https://www.php.net/docs' },
  { name: 'Ruby', submit: 'https://www.ruby-lang.org' },
  { name: 'Ruby2', submit: 'https://www.ruby-lang.org/en/documentation' },
  { name: 'Swift', submit: 'https://www.swift.org' },
  { name: 'Swift2', submit: 'https://docs.swift.org/swift-book' },
  { name: 'Kotlin', submit: 'https://kotlinlang.org' },
  { name: 'Kotlin2', submit: 'https://kotlinlang.org/docs' },
  { name: 'Scala', submit: 'https://www.scala-lang.org' },
  { name: 'Scala2', submit: 'https://docs.scala-lang.org' },
  { name: 'R', submit: 'https://www.r-project.org' },
  { name: 'R2', submit: 'https://cran.r-project.org/doc' },
  { name: 'Dart', submit: 'https://dart.dev' },
  { name: 'Dart2', submit: 'https://dart.dev/guides' },
  { name: 'Lua', submit: 'https://www.lua.org' },
  { name: 'Lua2', submit: 'https://www.lua.org/docs.html' },
  { name: 'Perl', submit: 'https://www.perl.org' },
  { name: 'Perl2', submit: 'https://perldoc.perl.org' },
  { name: 'Haskell', submit: 'https://www.haskell.org' },
  { name: 'Haskell2', submit: 'https://www.haskell.org/documentation' },
  { name: 'Elixir', submit: 'https://elixir-lang.org' },
  { name: 'Elixir2', submit: 'https://elixir-lang.org/getting-started' },
  { name: 'Erlang', submit: 'https://www.erlang.org' },
  { name: 'Erlang2', submit: 'https://www.erlang.org/doc' },
  { name: 'Clojure', submit: 'https://clojure.org' },
  { name: 'Clojure2', submit: 'https://clojure.org/guides' },
  { name: 'FSharp', submit: 'https://fsharp.org' },
  { name: 'FSharp2', submit: 'https://docs.microsoft.com/dotnet/fsharp' },
  { name: 'VB', submit: 'https://learn.microsoft.com/dotnet/visual-basic' },
  { name: 'VB2', submit: 'https://docs.microsoft.com/dotnet/visual-basic' },
  { name: 'ObjectiveC', submit: 'https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC' },
  { name: 'ObjectiveC2', submit: 'https://developer.apple.com/documentation' },
  { name: 'Shell', submit: 'https://www.shell.com' },
  { name: 'Shell2', submit: 'https://www.shell.com/learning' },
  { name: 'Bash', submit: 'https://www.gnu.org/software/bash' },
  { name: 'Bash2', submit: 'https://www.gnu.org/software/bash/manual' },
  { name: 'PowerShell', submit: 'https://docs.microsoft.com/powershell' },
  { name: 'PowerShell2', submit: 'https://docs.microsoft.com/powershell/scripting' },
  { name: 'SQL', submit: 'https://www.sqlcourse.com' },
  { name: 'SQL2', submit: 'https://www.sqlcourse.com/learn' },
  { name: 'GraphQL', submit: 'https://graphql.org' },
  { name: 'GraphQL2', submit: 'https://graphql.org/learn' },
  { name: 'JSON', submit: 'https://www.json.org' },
  { name: 'JSON2', submit: 'https://www.json.org/json-en.html' },
  { name: 'XML', submit: 'https://www.w3.org/XML' },
  { name: 'XML2', submit: 'https://www.w3.org/XML/Schema' },
  { name: 'YAML', submit: 'https://yaml.org' },
  { name: 'YAML2', submit: 'https://yaml.org/spec' },
  { name: 'TOML', submit: 'https://toml.io' },
  { name: 'TOML2', submit: 'https://toml.io/en/v1.0.0' },
  { name: 'Markdown', submit: 'https://daringfireball.net/projects/markdown' },
  { name: 'Markdown2', submit: 'https://daringfireball.net/projects/markdown/syntax' },
  { name: 'HTML', submit: 'https://html.spec.whatwg.org' },
  { name: 'HTML2', submit: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
  { name: 'CSS', submit: 'https://www.w3.org/Style/CSS' },
  { name: 'CSS2', submit: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
  { name: 'Sass', submit: 'https://sass-lang.com' },
  { name: 'Sass2', submit: 'https://sass-lang.com/documentation' },
  { name: 'Less', submit: 'https://lesscss.org' },
  { name: 'Less2', submit: 'https://lesscss.org/usage' },
  { name: 'Stylus', submit: 'https://stylus-lang.com' },
  { name: 'Stylus2', submit: 'https://stylus-lang.com/docs' },
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
  console.log(`🚀 Batch 64 - Programming Languages (${DIRECTORIES.length} directories)\n`);
  
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
