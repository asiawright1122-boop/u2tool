const https = require('https');

const DIRECTORIES = [
  { name: 'Stripe', submit: 'https://stripe.com' },
  { name: 'Stripe2', submit: 'https://stripe.com/submit' },
  { name: 'PayPal', submit: 'https://www.paypal.com' },
  { name: 'PayPal2', submit: 'https://www.paypal.com/submit' },
  { name: 'Braintree', submit: 'https://www.braintree.com' },
  { name: 'Braintree2', submit: 'https://www.braintree.com/submit' },
  { name: 'Square', submit: 'https://squareup.com' },
  { name: 'Square2', submit: 'https://squareup.com/submit' },
  { name: 'Adyen', submit: 'https://www.adyen.com' },
  { name: 'Adyen2', submit: 'https://www.adyen.com/submit' },
  { name: 'Razorpay', submit: 'https://razorpay.com' },
  { name: 'Razorpay2', submit: 'https://razorpay.com/submit' },
  { name: 'Paddle', submit: 'https://paddle.com' },
  { name: 'Paddle2', submit: 'https://paddle.com/submit' },
  { name: 'Chargebee', submit: 'https://www.chargebee.com' },
  { name: 'Chargebee2', submit: 'https://www.chargebee.com/submit' },
  { name: 'Recurly', submit: 'https://recurly.com' },
  { name: 'Recurly2', submit: 'https://recurly.com/submit' },
  { name: 'Zuora', submit: 'https://www.zuora.com' },
  { name: 'Zuora2', submit: 'https://www.zuora.com/submit' },
  { name: 'CloudPayments', submit: 'https://cloudpayments.ru' },
  { name: 'CloudPayments2', submit: 'https://cloudpayments.ru/submit' },
  { name: 'PayU', submit: 'https://www.payu.com' },
  { name: 'PayU2', submit: 'https://www.payu.com/submit' },
  { name: '2Checkout', submit: 'https://www.2checkout.com' },
  { name: '2Checkout2', submit: 'https://www.2checkout.com/submit' },
  { name: 'AuthorizeNet', submit: 'https://www.authorize.net' },
  { name: 'AuthorizeNet2', submit: 'https://www.authorize.net/submit' },
  { name: 'Mollie', submit: 'https://www.mollie.com' },
  { name: 'Mollie2', submit: 'https://www.mollie.com/submit' },
  { name: 'Klarna', submit: 'https://www.klarna.com' },
  { name: 'Klarna2', submit: 'https://www.klarna.com/submit' },
  { name: 'Afterpay', submit: 'https://www.afterpay.com' },
  { name: 'Afterpay2', submit: 'https://www.afterpay.com/submit' },
  { name: 'Affirm', submit: 'https://www.affirm.com' },
  { name: 'Affirm2', submit: 'https://www.affirm.com/submit' },
  { name: 'Shopify', submit: 'https://www.shopify.com' },
  { name: 'Shopify2', submit: 'https://www.shopify.com/submit' },
  { name: 'WooCommerce', submit: 'https://woocommerce.com' },
  { name: 'WooCommerce2', submit: 'https://woocommerce.com/submit' },
  { name: 'BigCommerce', submit: 'https://www.bigcommerce.com' },
  { name: 'BigCommerce2', submit: 'https://www.bigcommerce.com/submit' },
  { name: 'Magento', submit: 'https://business.adobe.com/products/magento/magento-commerce.html' },
  { name: 'Magento2', submit: 'https://business.adobe.com/products/magento/magento-commerce.html/submit' },
  { name: 'PrestaShop', submit: 'https://www.prestashop.com' },
  { name: 'PrestaShop2', submit: 'https://www.prestashop.com/submit' },
  { name: 'Volusion', submit: 'https://www.volusion.com' },
  { name: 'Volusion2', submit: 'https://www.volusion.com/submit' },
  { name: 'Lightspeed', submit: 'https://www.lightspeedhq.com' },
  { name: 'Lightspeed2', submit: 'https://www.lightspeedhq.com/submit' },
  { name: 'Vend', submit: 'https://www.vendhq.com' },
  { name: 'Vend2', submit: 'https://www.vendhq.com/submit' },
  { name: 'Clover', submit: 'https://www.clover.com' },
  { name: 'Clover2', submit: 'https://www.clover.com/submit' },
  { name: 'SquarePOS', submit: 'https://squareup.com/pos' },
  { name: 'SquarePOS2', submit: 'https://squareup.com/pos/submit' },
  { name: 'Toast', submit: 'https://www.toasttab.com' },
  { name: 'Toast2', submit: 'https://www.toasttab.com/submit' },
  { name: 'C Gustav', submit: 'https://www.c Gustav.com' },
  { name: 'CGustav2', submit: 'https://www.c Gustav.com/submit' },
  { name: 'Insight', submit: 'https://www.insight.com' },
  { name: 'Insight2', submit: 'https://www.insight.com/submit' },
  { name: 'CDW', submit: 'https://www.cdw.com' },
  { name: 'CDW2', submit: 'https://www.cdw.com/submit' },
  { name: 'Newegg', submit: 'https://www.newegg.com' },
  { name: 'Newegg2', submit: 'https://www.newegg.com/submit' },
  { name: 'TigerDirect', submit: 'https://www.tigerdirect.com' },
  { name: 'TigerDirect2', submit: 'https://www.tigerdirect.com/submit' },
  { name: 'BestBuy', submit: 'https://www.bestbuy.com' },
  { name: 'BestBuy2', submit: 'https://www.bestbuy.com/submit' },
  { name: 'Walmart', submit: 'https://www.walmart.com' },
  { name: 'Walmart2', submit: 'https://www.walmart.com/submit' },
  { name: 'Target', submit: 'https://www.target.com' },
  { name: 'Target2', submit: 'https://www.target.com/submit' },
  { name: 'Amazon', submit: 'https://www.amazon.com' },
  { name: 'Amazon2', submit: 'https://www.amazon.com/submit' },
  { name: 'eBay', submit: 'https://www.ebay.com' },
  { name: 'eBay2', submit: 'https://www.ebay.com/submit' },
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
  console.log(`🚀 Batch 60 - Payments & E-commerce (${DIRECTORIES.length} directories)\n`);
  
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
