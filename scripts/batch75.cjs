const https = require('https');

const DIRECTORIES = [
  { name: 'Stripe', submit: 'https://stripe.com' },
  { name: 'PayPal', submit: 'https://www.paypal.com' },
  { name: 'Braintree', submit: 'https://www.braintree.com' },
  { name: 'Square', submit: 'https://squareup.com' },
  { name: 'Adyen', submit: 'https://www.adyen.com' },
  { name: 'Razorpay', submit: 'https://razorpay.com' },
  { name: 'Paddle', submit: 'https://paddle.com' },
  { name: 'Chargebee', submit: 'https://www.chargebee.com' },
  { name: 'Recurly', submit: 'https://recurly.com' },
  { name: 'Zuora', submit: 'https://www.zuora.com' },
  { name: '2Checkout', submit: 'https://www.2checkout.com' },
  { name: 'AuthorizeNet', submit: 'https://www.authorize.net' },
  { name: 'Mollie', submit: 'https://www.mollie.com' },
  { name: 'Shopify', submit: 'https://www.shopify.com' },
  { name: 'WooCommerce', submit: 'https://woocommerce.com' },
  { name: 'BigCommerce', submit: 'https://www.bigcommerce.com' },
  { name: 'Magento', submit: 'https://magento.com' },
  { name: 'PrestaShop', submit: 'https://www.prestashop.com' },
  { name: 'Volusion', submit: 'https://www.volusion.com' },
  { name: 'Lightspeed', submit: 'https://www.lightspeedhq.com' },
  { name: 'Vend', submit: 'https://www.vendhq.com' },
  { name: 'Clover', submit: 'https://www.clover.com' },
  { name: 'Toast', submit: 'https://www.toasttab.com' },
  { name: 'Insight', submit: 'https://www.insight.com' },
  { name: 'CDW', submit: 'https://www.cdw.com' },
  { name: 'Newegg', submit: 'https://www.newegg.com' },
  { name: 'TigerDirect', submit: 'https://www.tigerdirect.com' },
  { name: 'BestBuy', submit: 'https://www.bestbuy.com' },
  { name: 'Walmart', submit: 'https://www.walmart.com' },
  { name: 'Target', submit: 'https://www.target.com' },
  { name: 'Amazon', submit: 'https://www.amazon.com' },
  { name: 'eBay', submit: 'https://www.ebay.com' },
  { name: 'Etsy', submit: 'https://www.etsy.com' },
  { name: 'Shop', submit: 'https://shop.app' },
  { name: 'Gumroad', submit: 'https://gumroad.com' },
  { name: 'LemonSqueezy', submit: 'https://www.lemonsqueezy.com' },
  { name: 'Gumroad2', submit: 'https://gumroad.com/discover' },
  { name: 'Kofi', submit: 'https://ko-fi.com' },
  { name: 'Patreon', submit: 'https://www.patreon.com' },
  { name: 'BuyMeACoffee', submit: 'https://www.buymeacoffee.com' },
  { name: 'Liberapay', submit: 'https://liberapay.com' },
  { name: 'OpenCollective', submit: 'https://opencollective.com' },
  { name: 'GitHubSponsors', submit: 'https://github.com/sponsors' },
  { name: 'VSCode', submit: 'https://code.visualstudio.com' },
  { name: 'VSCodium', submit: 'https://vscodium.com' },
  { name: 'IntelliJ', submit: 'https://www.jetbrains.com/idea' },
  { name: 'WebStorm', submit: 'https://www.jetbrains.com/webstorm' },
  { name: 'PyCharm', submit: 'https://www.jetbrains.com/pycharm' },
  { name: 'GoLand', submit: 'https://www.jetbrains.com/go' },
  { name: 'Sublime', submit: 'https://www.sublimetext.com' },
  { name: 'Atom', submit: 'https://atom.io' },
  { name: 'Notepad++', submit: 'https://notepad-plus-plus.org' },
  { name: 'Vim', submit: 'https://www.vim.org' },
  { name: 'Neovim', submit: 'https://neovim.io' },
  { name: 'Emacs', submit: 'https://www.gnu.org/software/emacs' },
  { name: 'Zed', submit: 'https://zed.dev' },
  { name: 'Lapce', submit: 'https://lapce.dev' },
  { name: 'Helix', submit: 'https://helix-editor.com' },
  { name: 'Atom', submit: 'https://atom.io' },
  { name: 'Brackets', submit: 'https://brackets.io' },
  { name: 'Bluefish', submit: 'https://bluefish.openoffice.nl' },
  { name: 'Geany', submit: 'https://www.geany.org' },
  { name: 'SciTE', submit: 'https://www.scintilla.org/SciTE' },
  { name: 'Textadept', submit: 'https://orbitalquark.github.io/textadept' },
  { name: 'UltraEdit', submit: 'https://www.ultraedit.com' },
  { name: 'PSPad', submit: 'https://pspad.com' },
  { name: 'EmEditor', submit: 'https://www.emeditor.com' },
  { name: 'Typora', submit: 'https://typora.io' },
  { name: 'Obsidian', submit: 'https://obsidian.md' },
  { name: 'Notion', submit: 'https://www.notion.so' },
  { name: 'RoamResearch', submit: 'https://roamresearch.com' },
  { name: 'Logseq', submit: 'https://logseq.com' },
  { name: 'Craft', submit: 'https://craft.do' },
  { name: 'Bear', submit: 'https://bear.app' },
  { name: 'Evernote', submit: 'https://evernote.com' },
  { name: 'OneNote', submit: 'https://www.onenote.com' },
  { name: 'GoogleKeep', submit: 'https://keep.google.com' },
  { name: 'AppleNotes', submit: 'https://www.icloud.com/notes' },
  { name: 'Simplenote', submit: 'https://simplenote.com' },
  { name: 'StandardNotes', submit: 'https://standardnotes.org' },
  { name: 'Joplin', submit: 'https://joplinapp.org' },
  { name: 'TiddlyWiki', submit: 'https://tiddlywiki.com' },
  { name: 'Dillinger', submit: 'https://dillinger.io' },
  { name: 'StackEdit', submit: 'https://stackedit.io' },
  { name: 'HackMD', submit: 'https://hackmd.io' },
  { name: 'QOwnNotes', submit: 'https://www.qownnotes.org' },
  { name: 'Zettlr', submit: 'https://www.zettlr.com' },
  { name: 'Ghost', submit: 'https://ghost.org' },
  { name: 'WordPress', submit: 'https://wordpress.org' },
  { name: 'Webflow', submit: 'https://webflow.com' },
  { name: 'Squarespace', submit: 'https://www.squarespace.com' },
  { name: 'Wix', submit: 'https://www.wix.com' },
  { name: 'Weebly', submit: 'https://www.weebly.com' },
  { name: 'Carrd', submit: 'https://carrd.co' },
  { name: 'Readymag', submit: 'https://readymag.com' },
  { name: 'Format', submit: 'https://format.com' },
  { name: 'Duda', submit: 'https://www.duda.co' },
  { name: 'Site123', submit: 'https://www.site123.com' },
  { name: 'Weblium', submit: 'https://weblium.com' },
  { name: 'Tilda', submit: 'https://tilda.cc' },
  { name: 'Ucraft', submit: 'https://www.ucraft.com' },
  { name: 'PageCloud', submit: 'https://www.pagecloud.com' },
  { name: 'Strikingly', submit: 'https://strikingly.com' },
  { name: 'ZohoSites', submit: 'https://www.zoho.com/sites' },
  { name: 'GoogleSites', submit: 'https://sites.google.com' },
  { name: 'Webnode', submit: 'https://www.webnode.com' },
  { name: 'IM Creator', submit: 'https://imcreator.com' },
  { name: 'Wix', submit: 'https://www.wix.com' },
  { name: 'GoDaddy', submit: 'https://www.godaddy.com' },
  { name: 'Namecheap', submit: 'https://www.namecheap.com' },
  { name: 'Domain', submit: 'https://domain.com' },
  { name: 'Name', submit: 'https://www.name.com' },
  { name: 'Hover', submit: 'https://www.hover.com' },
  { name: 'Gandi', submit: 'https://www.gandi.net' },
  { name: 'Register', submit: 'https://www.register.com' },
  { name: 'NetworkSolutions', submit: 'https://www.networksolutions.com' },
  { name: 'Domain', submit: 'https://domains.google' },
  { name: 'Cloudflare', submit: 'https://www.cloudflare.com' },
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
  console.log(`🚀 Batch 75 - Payments, CMS & Domains (${DIRECTORIES.length} directories)\n`);
  
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
