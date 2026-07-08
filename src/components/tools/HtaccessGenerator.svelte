<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['htaccess-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.htaccess-generator.${key}`;
  }

  let config = $state({
    forceHttps: true,
    forceWww: false,
    removeWww: true,
    enableGzip: true,
    enableCaching: true,
    blockHotlinking: false,
    customErrorPages: false,
    error404: '/404.html',
    error500: '/500.html',
    blockIps: '',
    redirects: '',
  });

  let output = $state('');

  // Functions
  function generate() {
    let htaccess = `# Generated .htaccess file
# Created: ${new Date().toISOString().split('T')[0]}

`;

    // Force HTTPS
    if (config.forceHttps) {
      htaccess += `# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

`;
    }

    // WWW handling
    if (config.forceWww) {
      htaccess += `# Force WWW
RewriteEngine On
RewriteCond %{HTTP_HOST} !^www\\. [NC]
RewriteRule ^(.*)$ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

`;
    } else if (config.removeWww) {
      htaccess += `# Remove WWW
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www\\.(.*)$ [NC]
RewriteRule ^(.*)$ https://%1%{REQUEST_URI} [L,R=301]

`;
    }

    // Gzip compression
    if (config.enableGzip) {
      htaccess += `# Enable Gzip Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
  AddOutputFilterByType DEFLATE application/json
</IfModule>

`;
    }

    // Browser caching
    if (config.enableCaching) {
      htaccess += `# Enable Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Images
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  
  # CSS and JavaScript
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  
  # Fonts
  ExpiresByType font/ttf "access plus 1 year"
  ExpiresByType font/otf "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  
  # HTML
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

`;
    }

    // Block hotlinking
    if (config.blockHotlinking) {
      htaccess += `# Block Hotlinking
RewriteEngine On
RewriteCond %{HTTP_REFERER} !^$
RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?yourdomain\\.com [NC]
RewriteRule \\.(jpg|jpeg|png|gif|webp|svg)$ - [F,NC,L]

`;
    }

    // Custom error pages
    if (config.customErrorPages) {
      htaccess += `# Custom Error Pages
ErrorDocument 404 ${config.error404}
ErrorDocument 500 ${config.error500}

`;
    }

    // Block IPs
    if (config.blockIps.trim()) {
      const ips = config.blockIps.split('\n').filter(ip => ip.trim());
      if (ips.length > 0) {
        htaccess += `# Block IP Addresses
<RequireAll>
  Require all granted
${ips.map(ip => `  Require not ip ${ip.trim()}`).join('\n')}
</RequireAll>

`;
      }
    }

    // Custom redirects
    if (config.redirects.trim()) {
      const redirectLines = config.redirects.split('\n').filter(r => r.trim());
      if (redirectLines.length > 0) {
        htaccess += `# Custom Redirects
${redirectLines.map(r => {
  const [from, to] = r.split(' ').filter(Boolean);
  if (from && to) {
    return `Redirect 301 ${from} ${to}`;
  }
  return '';
}).filter(Boolean).join('\n')}

`;
      }
    }

    // Security headers
    htaccess += `# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Disable directory browsing
Options -Indexes

# Protect .htaccess file
<Files .htaccess>
  Order allow,deny
  Deny from all
</Files>
`;

    output = htaccess;
  }
  function copyOutput() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-6">
      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <h3 class="font-semibold">{t('urlSettings')}</h3>
          {#each [
            { key: 'forceHttps', label: t('forceHttps') },
            { key: 'forceWww', label: t('forceWww') },
            { key: 'removeWww', label: t('removeWww') },
          ] as { key, label } (key)}
<label  class="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config[key as keyof typeof config] as boolean}
                onchange={(e) => {
                  const newConfig = { ...config, [key]: e.target.checked };
                  if (key === 'forceWww' && e.target.checked) {
                    newConfig.removeWww = false;
                  }
                  if (key === 'removeWww' && e.target.checked) {
                    newConfig.forceWww = false;
                  }
                  config = newConfig;
                }}
                class="w-4 h-4 rounded"
              />
              <span>{label}</span>
            </label>
{/each}

          <h3 class="font-semibold pt-4">{t('performance')}</h3>
          {#each [
            { key: 'enableGzip', label: t('enableGzip') },
            { key: 'enableCaching', label: t('enableCaching') },
          ] as { key, label } (key)}
<label  class="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config[key as keyof typeof config] as boolean}
                onchange={(e) => config = { ...config, [key]: e.target.checked }}
                class="w-4 h-4 rounded"
              />
              <span>{label}</span>
            </label>
{/each}

          <h3 class="font-semibold pt-4">{t('security')}</h3>
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.blockHotlinking}
              onchange={(e) => config = { ...config, blockHotlinking: e.target.checked }}
              class="w-4 h-4 rounded"
            />
            <span>{t('blockHotlinking')}</span>
          </label>
        </div>

        <div class="space-y-4">
          <div>
            <label class="flex items-center gap-3 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={config.customErrorPages}
                onchange={(e) => config = { ...config, customErrorPages: e.target.checked }}
                class="w-4 h-4 rounded"
              />
              <span class="font-semibold">{t('customErrorPages')}</span>
            </label>
            {#if config.customErrorPages}
<div class="space-y-2 ml-7">
                <input
                  type="text"
                  value={config.error404}
                  onchange={(e) => config = { ...config, error404: e.target.value }}
                  placeholder="404 page path"
                  class="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  value={config.error500}
                  onchange={(e) => config = { ...config, error500: e.target.value }}
                  placeholder="500 page path"
                  class="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
                />
              </div>
{/if}
          </div>

          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('blockIps')}</label>
            <textarea
              value={config.blockIps}
              onchange={(e) => config = { ...config, blockIps: e.target.value }}
              class="w-full h-20 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-gray-900 dark:text-white"
              placeholder="192.168.1.1&#10;10.0.0.0/8"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('redirects')}</label>
            <textarea
              value={config.redirects}
              onchange={(e) => config = { ...config, redirects: e.target.value }}
              class="w-full h-20 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-gray-900 dark:text-white"
              placeholder="/old-page /new-page&#10;/blog /articles"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <button onclick={generate} class="btn-primary px-6 py-2 rounded-lg">
          {t('generate')}
        </button>
        <button
          onclick={copyOutput}
          disabled={!output}
          class="btn-secondary px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {t('copy')}
        </button>
      </div>

      {#if output}
<div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('output')}</label>
          <textarea
            value={output}
            readOnly
            class="w-full h-96 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm text-gray-900 dark:text-white focus:outline-none"></textarea>
        </div>
{/if}
    </div>
  
