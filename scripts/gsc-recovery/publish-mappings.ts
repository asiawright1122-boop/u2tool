import fs from 'node:fs';
import path from 'node:path';

const REDIRECTS_CONFIG_PATH = path.resolve(process.cwd(), 'src/config/gsc-redirects.json');

async function main() {
  console.log('🏁 Starting Cloudflare KV redirects publication...');

  // 1. Check redirects JSON file existence and validity
  if (!fs.existsSync(REDIRECTS_CONFIG_PATH)) {
    console.error(`❌ Error: Config file not found at: ${REDIRECTS_CONFIG_PATH}`);
    process.exit(1);
  }

  let redirectsData: Record<string, string>;
  try {
    const rawContent = fs.readFileSync(REDIRECTS_CONFIG_PATH, 'utf-8');
    redirectsData = JSON.parse(rawContent);
  } catch (err: any) {
    console.error('❌ Error: Failed to parse redirects config JSON:', err.message);
    process.exit(1);
  }

  // 2. Validate format and entry count
  if (!redirectsData || typeof redirectsData !== 'object' || Array.isArray(redirectsData)) {
    console.error('❌ Error: Invalid config format. Expected a JSON object.');
    process.exit(1);
  }

  const keysCount = Object.keys(redirectsData).length;
  if (keysCount === 0) {
    console.error('❌ Error: No redirect rules found in config. Blocked publishing empty rules.');
    process.exit(1);
  }

  console.log(`✓ Validated redirects configuration. Found ${keysCount} rule(s).`);

  // 3. Check Cloudflare KV credentials in environment variables
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const kvNamespaceId = process.env.CLOUDFLARE_KV_NAMESPACE_ID;

  if (!apiToken || !accountId || !kvNamespaceId) {
    console.error('❌ Error: Missing required Cloudflare credentials in environment variables.');
    console.error('Please configure the following:');
    console.error(`- CLOUDFLARE_API_TOKEN:      ${apiToken ? '✓ SET' : '❌ MISSING'}`);
    console.error(`- CLOUDFLARE_ACCOUNT_ID:     ${accountId ? '✓ SET' : '❌ MISSING'}`);
    console.error(`- CLOUDFLARE_KV_NAMESPACE_ID: ${kvNamespaceId ? '✓ SET' : '❌ MISSING'}`);
    process.exit(1);
  }

  const rulesString = JSON.stringify(redirectsData);
  const targetUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${kvNamespaceId}/values/gsc-recovery-rules`;

  console.log(`🌐 Publishing table to Cloudflare KV Namespace: ${kvNamespaceId}...`);

  try {
    const response = await fetch(targetUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'text/plain',
      },
      body: rulesString,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Cloudflare API Error (Status ${response.status}):`, errorText);
      process.exit(1);
    }

    const resJson: any = await response.json().catch(() => ({}));
    if (resJson.success === false) {
      console.error('❌ Cloudflare API returned success = false:', JSON.stringify(resJson.errors));
      process.exit(1);
    }

    console.log(`\n🎉 Success! Successfully published ${keysCount} redirect rules to key "gsc-recovery-rules".`);
  } catch (err: any) {
    console.error('❌ Network error during Cloudflare API request:', err.message);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Unexpected error in publish script:', err);
  process.exit(1);
});
