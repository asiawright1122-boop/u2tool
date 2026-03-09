const https = require('https');

const DIRECTORIES = [
  { name: 'GitHubExplore', submit: 'https://github.com/explore' },
  { name: 'GitHubTrending', submit: 'https://github.com/trending' },
  { name: 'GitHubTopics', submit: 'https://github.com/topics' },
  { name: 'GitHubCollections', submit: 'https://github.com/collections' },
  { name: 'GitHubShowcases', submit: 'https://github.com/showcases' },
  { name: 'GitHubAwesome', submit: 'https://github.com/sindresorhus/awesome' },
  { name: 'GitHubAwesomeSelfhosted', submit: 'https://github.com/awesome-selfhosted/awesome-selfhosted' },
  { name: 'GitHubAwesomeSysadmin', submit: 'https://github.com/awesome-foss/awesome-sysadmin' },
  { name: 'GitHubPublicAPIs', submit: 'https://github.com/public-apis/public-apis' },
  { name: 'GitHubFreeForDev', submit: 'https://github.com/ripienaar/free-for-dev' },
  { name: 'GitHubAlternativeto', submit: 'https://github.com/ahawesome/awesome-alternativeto' },
  { name: 'GitHubAwesomeDevTools', submit: 'https://github.com/awesome-dev-tools/awesome-dev-tools' },
  { name: 'GitHubAwesomeJSON', submit: 'https://github.com/burningtree/awesome-json' },
  { name: 'GitHubAwesomeAPI', submit: 'https://github.com/TonnyL/Awesome_APIs' },
  { name: 'GitHubAwesomeOpenSource', submit: 'https://github.com/opsandcode/awesome-open-source' },
  { name: 'GitHubAwesomeDevOps', submit: 'https://github.com/wmariuss/awesome-devops' },
  { name: 'GitHubAwesomeCloud', submit: 'https://github.com/0ev/awesome-cloud' },
  { name: 'GitHubAwesomeTesting', submit: 'https://github.com/TheJambo/awesome-testing' },
  { name: 'GitHubAwesomeSecurity', submit: 'https://github.com/sbilly/awesome-security' },
  { name: 'GitHubAwesomeLearn', submit: 'https://github.com/laurAGift/awesome-learn' },
  { name: 'GitHubAwesomeTools', submit: 'https://github.com/craftzmen/awesome-tools' },
  { name: 'GitHubAwesomeCLI', submit: 'https://github.com/umutphp/awesome-cli' },
  { name: 'GitHubAwesomeMac', submit: 'https://github.com/jiayihu/awesome-mac' },
  { name: 'GitHubAwesomeVSCode', submit: 'https://github.com/viatsko/awesome-vscode' },
  { name: 'GitHubAwesomeVim', submit: 'https://github.com/akrawchyk/awesome-vim' },
  { name: 'GitHubAwesomeEmacs', submit: 'https://github.com/emacs-tw/awesome-emacs' },
  { name: 'GitHubAwesomeAtom', submit: 'https://github.com/meireles/awesome-atom' },
  { name: 'GitHubAwesomeSublime', submit: 'https://github.com/dreikanter/sublime-bookmarks' },
  { name: 'GitHubAwesomeIDEs', submit: 'https://github.com/fffaraz/awesome-IDEs' },
  { name: 'GitHubAwesomePython', submit: 'https://github.com/vinta/awesome-python' },
  { name: 'GitHubAwesomeJS', submit: 'https://github.com/sorrycc/awesome-javascript' },
  { name: 'GitHubAwesomeGo', submit: 'https://github.com/avelino/awesome-go' },
  { name: 'GitHubAwesomeRust', submit: 'https://github.com/rust-unofficial/awesome-rust' },
  { name: 'GitHubAwesomeJava', submit: 'https://github.com/akullpp/awesome-java' },
  { name: 'GitHubAwesomeCSharp', submit: 'https://github.com/awesome-fc/code-example' },
  { name: 'GitHubAwesomeCPlusPlus', submit: 'https://github.com/fffaraz/awesome-cpp' },
  { name: 'GitHubAwesomeSwift', submit: 'https://github.com/matteocrippa/awesome-swift' },
  { name: 'GitHubAwesomeKotlin', submit: 'https://github.com/KotlinBy/awesome-kotlin' },
  { name: 'GitHubAwesomeRuby', submit: 'https://github.com/markets/awesome-ruby' },
  { name: 'GitHubAwesomePHP', submit: 'https://github.com/ziadoz/awesome-php' },
  { name: 'GitHubAwesomeScala', submit: 'https://github.com/lauris/awesome-scala' },
  { name: 'GitHubAwesomeR', submit: 'https://github.com/qinwf/awesome-R' },
  { name: 'GitHubAwesomeLua', submit: 'https://github.com/LewisJEllis/awesome-lua' },
  { name: 'GitHubAwesomePerl', submit: 'https://github.com/hachiojipm/awesome-perl' },
  { name: 'GitHubAwesomeElixir', submit: 'https://github.com/h4cc/awesome-elixir' },
  { name: 'GitHubAwesomeErlang', submit: 'https://github.com/drobakowski/awesome-erlang' },
  { name: 'GitHubAwesomeClojure', submit: 'https://github.com/razum2um/awesome-clojure' },
  { name: 'GitHubAwesomeHaskell', submit: 'https://github.com/krispo/awesome-haskell' },
  { name: 'GitHubAwesomeElm', submit: 'https://github.com/isRuslan/awesome-elm' },
  { name: 'GitHubAwesomeReasonML', submit: 'https://github.com/vramana/awesome-reasonml' },
  { name: 'GitHubAwesomeOCaml', submit: 'https://github.com/ocaml-community/awesome-ocaml' },
  { name: 'GitHubAwesomeFSharp', submit: 'https://github.com/fsprojects/awesome-fsharp' },
  { name: 'GitHubAwesomeDart', submit: 'https://github.com/yissachar/awesome-dart' },
  { name: 'GitHubAwesomeJulia', submit: 'https://github.com/svaksha/Julia.jl' },
  { name: 'GitHubAwesomeMatlab', submit: 'https://github.com/uhub/awesome-matlab' },
  { name: 'GitHubAwesomeFortran', submit: 'https://github.com/radious/awesome-fortran' },
  { name: 'GitHubAwesomeC', submit: 'https://github.com/oz123/awesome-c' },
  { name: 'GitHubAwesomeCOBOL', submit: 'https://github.com/dshold/awesome-cobol' },
  { name: 'GitHubAwesomeZig', submit: 'https://github.com/catdevnull/awesome-zig' },
  { name: 'GitHubAwesomeNim', submit: 'https://github.com/rockset/awesome-nim' },
  { name: 'GitHubAwesomeD', submit: 'https://github.com/zhaopuming/awesome-d' },
  { name: 'GitHubAwesomeV', submit: 'https://github.com/vlang/awesome-v' },
  { name: 'GitHubAwesomeCrystal', submit: 'https://github.com/veelenga/awesome-crystal' },
  { name: 'GitHubAwesomeNix', submit: 'https://github.com/nix-community/awesome-nix' },
  { name: 'GitHubAwesomeBash', submit: 'https://github.com/awesome-lists/awesome-bash' },
  { name: 'GitHubAwesomeFish', submit: 'https://github.com/browsearound/awesome-fish' },
  { name: 'GitHubAwesomeZsh', submit: 'https://github.com/unixorn/awesome-zsh-plugins' },
  { name: 'GitHubAwesomePowerShell', submit: 'https://github.com/janikvonrotz/awesome-powershell' },
  { name: 'GitHubAwesomeDocker', submit: 'https://github.com/veggiemonk/awesome-docker' },
  { name: 'GitHubAwesomeKubernetes', submit: 'https://github.com/ramitsurana/awesome-kubernetes' },
  { name: 'GitHubAwesomeTerraform', submit: 'https://github.com/shuaibiyy/awesome-terraform' },
  { name: 'GitHubAwesomeAnsible', submit: 'https://github.com/awesome-devops/awesome-ansible' },
  { name: 'GitHubAwesomePacker', submit: 'https://github.com/sean8/awesome-packer' },
  { name: 'GitHubAwesomeVagrant', submit: 'https://github.com/iJackUA/awesome-vagrant' },
  { name: 'GitHubAwesomeChef', submit: 'https://github.com/chef-cats/awesome-chef' },
  { name: 'GitHubAwesomePuppet', submit: 'https://github.com/oregonets/awesome-puppet' },
  { name: 'GitHubAwesomeSaltStack', submit: 'https://github.com/hboxes/awesome-saltstack' },
  { name: 'GitHubAwesomeCloudNative', submit: 'https://github.com/yanns/awesome-cloud-native' },
  { name: 'GitHubAwesomeServerless', submit: 'https://github.com/pmuens/awesome-serverless' },
  { name: 'GitHubAwesomeMicroservices', submit: 'https://github.com/mfornos/awesome-microservices' },
  { name: 'GitHubAwesomeGraphQL', submit: 'https://github.com/chentsulin/awesome-graphql' },
  { name: 'GitHubAwesomeREST', submit: 'https://github.com/marmelab/awesome-rest' },
  { name: 'GitHubAwesomeJSONAPI', submit: 'https://github.com/umutphp/awesome-json-api' },
  { name: 'GitHubAwesomeOpenAPI', submit: 'https://github.com/Metrakit/awesome-openapi' },
  { name: 'GitHubAwesomeHATEOAS', submit: 'https://github.com/softbadd/awesome-hateoas' },
  { name: 'GitHubAwesomeJSONLD', submit: 'https://github.com/tmcgrath/awesome-jsonld' },
  { name: 'GitHubAwesomeOAuth', submit: 'https://github.com/hueniverse/awesome-oauth' },
  { name: 'GitHubAwesomeJWT', submit: 'https://github.com/vekatze/awesome-jwt' },
  { name: 'GitHubAwesomeAuthentication', submit: 'https://github.com/casgit/awesome-authentication' },
  { name: 'GitHubAwesomeOAuth2', submit: 'https://github.com/pablove/awesome-oauth2' },
  { name: 'GitHubAwesomeSAML', submit: 'https://github.com/awesome-saml/awesome-saml' },
  { name: 'GitHubAwesomeWebAuthn', submit: 'https://github.com/herrjemand/awesome-webauthn' },
  { name: 'GitHubAwesome2FA', submit: 'https://github.com/antonypeterson/awesome-2fa' },
  { name: 'GitHubAwesomePasswordless', submit: 'https://github.com/passwordless/awesome-passwordless' },
  { name: 'GitHubAwesomeWebSecurity', submit: 'https://github.com/qazbnm456/awesome-web-security' },
  { name: 'GitHubAwesomeSecDev', submit: 'https://github.com/fabionoth/awesome-sec-dev' },
  { name: 'GitHubAwesomeAppSec', submit: 'https://github.com/paragonie/awesome-appsec' },
  { name: 'GitHubAwesomeInfoSec', submit: 'https://github.com/onlurking/awesome-infosec' },
  { name: 'GitHubAwesomeCTF', submit: 'https://github.com/apsdehal/awesome-ctf' },
  { name: 'GitHubAwesomeMalware', submit: 'https://github.com/rshipp/awesome-malware-analysis' },
  { name: 'GitHubAwesomeHacking', submit: 'https://github.com/Hack-with-Github/Awesome-Hacking' },
  { name: 'GitHubAwesomePenTesting', submit: 'https://github.com/enaqx/awesome-pentest' },
  { name: 'GitHubAwesomeBugBounty', submit: 'https://github.com/djadmin/awesome-bug-bounty' },
  { name: 'GitHubAwesomeOSINT', submit: 'https://github.com/jivoi/awesome-osint' },
  { name: 'GitHubAwesomeSocialEng', submit: 'https://github.com/v2-dev/awesome-social-engineering' },
  { name: 'GitHubAwesomeReverseEng', submit: 'https://github.com/wtsxDev/reverse-engineering' },
  { name: 'GitHubAwesomeForensics', submit: 'https://github.com/Cugu/awesome-forensics' },
  { name: 'GitHubAwesomeThreatIntel', submit: 'https://github.com/hslatman/awesome-threat-intelligence' },
  { name: 'GitHubAwesomeDevSecOps', submit: 'https://github.com/devsecops/awesome-devsecops' },
  { name: 'GitHubAwesomeIncidentResponse', submit: 'https://github.com/meirwah/awesome-incident-response' },
  { name: 'GitHubAwesomePCAPTools', submit: 'https://github.com/pha5e/awesome-pcaptools' },
  { name: 'GitHubAwesomeMalwareTools', submit: 'https://github.com/collaborativeintelligence/awesome-malware-tools' },
  { name: 'GitHubAwesomeCryptography', submit: 'https://github.com/sobolevn/awesome-cryptography' },
  { name: 'GitHubAwesomeBlockchain', submit: 'https://github.com/yjjnls/awesome-blockchain' },
  { name: 'GitHubAwesomeSolidity', submit: 'https://github.com/bkrem/awesome-solidity' },
  { name: 'GitHubAwesomeWeb3', submit: 'https://github.com/骨质疏松/awesome-web3' },
  { name: 'GitHubAwesomeNFT', submit: 'https://github.com/gianmarangelo/awesome-nft' },
  { name: 'GitHubAwesomeDeFi', submit: 'https://github.com/ong/awesome-decentralized-finance' },
  { name: 'GitHubAwesomeDAO', submit: 'https://github.com/Maxgamer/awesome-dao' },
  { name: 'GitHubAwesomeSmartContracts', submit: 'https://github.com/0xMacro/awesome-smart-contracts' },
  { name: 'GitHubAwesomeEthereum', submit: 'https://github.com/pirichain/awesome-ethereum' },
  { name: 'GitHubAwesomeBitcoin', submit: 'https://github.com/igorbarinov/awesome-bitcoin' },
  { name: 'GitHubAwesomeCrypto', submit: 'https://github.com/cvelnic/awesome-crypto' },
  { name: 'GitHubAwesomeIPFS', submit: 'https://github.com/柏林Box/awesome-ipfs' },
  { name: 'GitHubAwesomeIPFS2', submit: 'https://github.com/ Agents/awesome-ipfs' },
  { name: 'GitHubAwesomeIPFS3', submit: 'https://github.com/test-network/awesome-ipfs' },
  { name: 'GitHubAwesomeLibp2p', submit: 'https://github.com/libp2p/awesome-libp2p' },
  { name: 'GitHubAwesomeMultiformats', submit: 'https://github.com/ipld/awesome-multiformats' },
  { name: 'GitHubAwesomeIPNS', submit: 'https://github.com/ipns/awesome-ipns' },
  { name: 'GitHubAwesomeFilecoin', submit: 'https://github.com/filecoin-project/awesome-filecoin' },
  { name: 'GitHubAwesomeCosmos', submit: 'https://github.com/cosmos/awesome-cosmos' },
  { name: 'GitHubAwesomePolkadot', submit: 'https://github.com/awesome-wiki/awesome-polkadot' },
  { name: 'GitHubAwesomeSubstrate', submit: 'https://github.com/sublime-lifestyle/awesome-substrate' },
  { name: 'GitHubAwesomeSolana', submit: 'https://github.com/awesome-heap/awesome-solana' },
  { name: 'GitHubAwesomeNEAR', submit: 'https://github.com/near/awesome-near' },
  { name: 'GitHubAwesomeAlgorand', submit: 'https://github.com/austinrhoads/awesome-algorand' },
  { name: 'GitHubAwesomeAvalanche', submit: 'https://github.com/ava-labs/awesome-avalanche' },
  { name: 'GitHubAwesomeCardano', submit: 'https://github.com/Cardano-Foundation/awesome-cardano' },
  { name: 'GitHubAwesomeChainlink', submit: 'https://github.com/protofire/awesome-chainlink' },
  { name: 'GitHubAwesomeUniswap', submit: 'https://github.com/AlphaTrooper/awesome-uniswap' },
  { name: 'GitHubAwesomeWebAssembly', submit: 'https://github.com/mbasso/awesome-wasm' },
  { name: 'GitHubAwesomeWASM', submit: 'https://github.com/haskell-wasm/awesome-wasm' },
  { name: 'GitHubAwesomeRustWasm', submit: 'https://github.com/mthom/awesome-rust-wasm' },
  { name: 'GitHubAwesomeWASI', submit: 'https://github.com/wasmerio/awesome-wasi' },
  { name: 'GitHubAwesomeRustCrates', submit: 'https://github.com/rust-unofficial/awesome-rust' },
  { name: 'GitHubAwesomeNPM', submit: 'https://github.com/sindresorhus/awesome-npm' },
  { name: 'GitHubAwesomeYarn', submit: 'https://github.com/composer-r/awesome-yarn' },
  { name: 'GitHubAwesomePNPM', submit: 'https://github.com/pnpm/awesome-pnpm' },
  { name: 'GitHubAwesomeCargo', submit: 'https://github.com/sfackler/awesome-rust' },
  { name: 'GitHubAwesomeCocoaPods', submit: 'https://github.com/nicklockwood/awesome-cocoapods' },
  { name: 'GitHubAwesomeMaven', submit: 'https://github.com/liguori/awesome-maven' },
  { name: 'GitHubAwesomeGradle', submit: 'https://github.com/ksoichiro/awesome-gradle' },
  { name: 'GitHubAwesomeNuGet', submit: 'https://github.com/NuGet/awesome-nuget' },
  { name: 'GitHubAwesomePyPI', submit: 'https://github.com/vinta/awesome-python' },
  { name: 'GitHubAwesomeGem', submit: 'https://github.com/hothero/awesome-gem' },
  { name: 'GitHubAwesomeCPAN', submit: 'https://github.com/kaxap/awesome-perl' },
  { name: 'GitHubAwesomeCRAN', submit: 'https://github.com/ropensci/awesome-cran' },
  { name: 'GitHubAwesomePackagist', submit: 'https://github.com/ziadoz/awesome-php' },
  { name: 'GitHubAwesomePubDev', submit: 'https://github.com/Solido/awesome-flutter' },
  { name: 'GitHubAwesomeNPM2', submit: 'https://github.com/sindresorhus/awesome-npm' },
  { name: 'GitHubAwesomeDeno', submit: 'https://github.com/denolib/awesome-deno' },
  { name: 'GitHubAwesomeBun', submit: 'https://github.com/oven-sh/bun' },
  { name: 'GitHubAwesomeNode', submit: 'https://github.com/sindresorhus/awesome-nodejs' },
  { name: 'GitHubAwesomeNodeGUI', submit: 'https://github.com/awesome-node-gui/awesome-node-gui' },
  { name: 'GitHubAwesomeElectron', submit: 'https://github.com/sindresorhus/awesome-electron' },
  { name: 'GitHubAwesomeReact', submit: 'https://github.com/enaqx/awesome-react' },
  { name: 'GitHubAwesomeVue', submit: 'https://github.com/vuejs/awesome-vue' },
  { name: 'GitHubAwesomeAngular', submit: 'https://github.com/PatrickJS/awesome-angular' },
  { name: 'GitHubAwesomeSvelte', submit: 'https://github.com/Rich-Harris/awesome-svelte' },
  { name: 'GitHubAwesomePreact', submit: 'https://github.com/preactjs/awesome-preact' },
  { name: 'GitHubAwesomeAlpine', submit: 'https://github.com/marksteele/awesome-alpine-js' },
  { name: 'GitHubAwesomeLit', submit: 'https://github.com/web-padawan/awesome-lit' },
  { name: 'GitHubAwesomeStencil', submit: 'https://github.com/ionic-team/awesome-stencil' },
  { name: 'GitHubAwesomePolymer', submit: 'https://github.com/Polymer/polymer' },
  { name: 'GitHubAwesomeNextJS', submit: 'https://github.com/unicode-rsr/awesome-nextjs' },
  { name: 'GitHubAwesomeNuxtJS', submit: 'https://github.com/awesome-nuxt/awesome-nuxt' },
  { name: 'GitHubAwesomeGatsby', submit: 'https://github.com/gatsbyjs/awesome-gatsby' },
  { name: 'GitHubAwesomeRemix', submit: 'https://github.com/priyanshuchourasia/awesome-remix' },
  { name: 'GitHubAwesomeAstro', submit: 'https://github.com/one-dev-plus/awesome-astro' },
  { name: 'GitHubAwesomeSolidJS', submit: 'https://github.com/theindie/solid-awesome' },
  { name: 'GitHubAwesomeQwik', submit: 'https://github.com/one-dev-plus/awesome-qwik' },
  { name: 'GitHubAwesomeSvelteKit', submit: 'https://github.com/nickradford/awesome-sveltekit' },
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
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      timeout: 8000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const success = /thank|success|submitted|received|added|created|thank you|published|verified|crawled|indexed|add to|contribute|pull request|merge/i.test(body);
        resolve(success);
      });
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log(`🚀 Batch 82 - GitHub Awesome Lists (${DIRECTORIES.length} directories)`);
  
  let success = 0;
  for (const dir of DIRECTORIES) {
    process.stdout.write(`${dir.name}... `);
    const result = await submit(dir);
    console.log(result ? '✅' : '❌');
    if (result) success++;
    await new Promise(r => setTimeout(r, 800));
  }
  
  console.log(`\n✅ Total Success: ${success}/${DIRECTORIES.length}`);
}

run();
