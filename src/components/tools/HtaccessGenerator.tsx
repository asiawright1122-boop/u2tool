'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function HtaccessGenerator() {
  const t = useTranslations('tools.htaccess-generator');
  const [config, setConfig] = useState({
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
  const [output, setOutput] = useState('');

  const generate = () => {
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

    setOutput(htaccess);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold">{t('urlSettings')}</h3>
          {[
            { key: 'forceHttps', label: t('forceHttps') },
            { key: 'forceWww', label: t('forceWww') },
            { key: 'removeWww', label: t('removeWww') },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config[key as keyof typeof config] as boolean}
                onChange={(e) => {
                  const newConfig = { ...config, [key]: e.target.checked };
                  if (key === 'forceWww' && e.target.checked) {
                    newConfig.removeWww = false;
                  }
                  if (key === 'removeWww' && e.target.checked) {
                    newConfig.forceWww = false;
                  }
                  setConfig(newConfig);
                }}
                className="w-4 h-4 rounded"
              />
              <span>{label}</span>
            </label>
          ))}

          <h3 className="font-semibold pt-4">{t('performance')}</h3>
          {[
            { key: 'enableGzip', label: t('enableGzip') },
            { key: 'enableCaching', label: t('enableCaching') },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config[key as keyof typeof config] as boolean}
                onChange={(e) => setConfig({ ...config, [key]: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span>{label}</span>
            </label>
          ))}

          <h3 className="font-semibold pt-4">{t('security')}</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.blockHotlinking}
              onChange={(e) => setConfig({ ...config, blockHotlinking: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span>{t('blockHotlinking')}</span>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-3 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={config.customErrorPages}
                onChange={(e) => setConfig({ ...config, customErrorPages: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="font-semibold">{t('customErrorPages')}</span>
            </label>
            {config.customErrorPages && (
              <div className="space-y-2 ml-7">
                <input
                  type="text"
                  value={config.error404}
                  onChange={(e) => setConfig({ ...config, error404: e.target.value })}
                  placeholder="404 page path"
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={config.error500}
                  onChange={(e) => setConfig({ ...config, error500: e.target.value })}
                  placeholder="500 page path"
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">{t('blockIps')}</label>
            <textarea
              value={config.blockIps}
              onChange={(e) => setConfig({ ...config, blockIps: e.target.value })}
              className="w-full h-20 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 font-mono text-sm"
              placeholder="192.168.1.1&#10;10.0.0.0/8"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">{t('redirects')}</label>
            <textarea
              value={config.redirects}
              onChange={(e) => setConfig({ ...config, redirects: e.target.value })}
              className="w-full h-20 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 font-mono text-sm"
              placeholder="/old-page /new-page&#10;/blog /articles"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={generate} className="btn-primary px-6 py-2 rounded-lg">
          {t('generate')}
        </button>
        <button
          onClick={copyOutput}
          disabled={!output}
          className="btn-secondary px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {t('copy')}
        </button>
      </div>

      {output && (
        <div>
          <label className="block text-sm text-gray-300 mb-2">{t('output')}</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-96 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
