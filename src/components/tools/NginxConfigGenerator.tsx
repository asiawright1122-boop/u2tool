'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function NginxConfigGenerator() {
  const t = useTranslations('tools.nginx-config-generator');
  const [config, setConfig] = useState({
    serverName: 'example.com',
    rootPath: '/var/www/html',
    enableSsl: true,
    sslCertPath: '/etc/letsencrypt/live/example.com/fullchain.pem',
    sslKeyPath: '/etc/letsencrypt/live/example.com/privkey.pem',
    enableGzip: true,
    enableCaching: true,
    proxyPass: '',
    phpFpm: false,
    phpSocket: '/var/run/php/php8.1-fpm.sock',
  });
  const [output, setOutput] = useState('');

  const generate = () => {
    let nginx = `# Nginx configuration for ${config.serverName}
# Generated: ${new Date().toISOString().split('T')[0]}

`;

    // HTTP to HTTPS redirect
    if (config.enableSsl) {
      nginx += `# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name ${config.serverName} www.${config.serverName};
    return 301 https://${config.serverName}$request_uri;
}

`;
    }

    // Main server block
    nginx += `server {
    ${config.enableSsl ? `listen 443 ssl http2;
    listen [::]:443 ssl http2;` : `listen 80;
    listen [::]:80;`}
    
    server_name ${config.serverName} www.${config.serverName};
    root ${config.rootPath};
    index index.html index.htm${config.phpFpm ? ' index.php' : ''};

`;

    // SSL configuration
    if (config.enableSsl) {
      nginx += `    # SSL Configuration
    ssl_certificate ${config.sslCertPath};
    ssl_certificate_key ${config.sslKeyPath};
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;
    
    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

`;
    }

    // Gzip compression
    if (config.enableGzip) {
      nginx += `    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

`;
    }

    // Caching
    if (config.enableCaching) {
      nginx += `    # Static file caching
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|pdf|woff|woff2|ttf|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

`;
    }

    // Proxy pass
    if (config.proxyPass) {
      nginx += `    # Reverse Proxy
    location / {
        proxy_pass ${config.proxyPass};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

`;
    } else {
      nginx += `    # Main location
    location / {
        try_files $uri $uri/ ${config.phpFpm ? '/index.php?$query_string' : '=404'};
    }

`;
    }

    // PHP-FPM
    if (config.phpFpm && !config.proxyPass) {
      nginx += `    # PHP-FPM Configuration
    location ~ \\.php$ {
        fastcgi_pass unix:${config.phpSocket};
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    # Deny access to .htaccess files
    location ~ /\\.ht {
        deny all;
    }

`;
    }

    // Security headers
    nginx += `    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Logging
    access_log /var/log/nginx/${config.serverName}.access.log;
    error_log /var/log/nginx/${config.serverName}.error.log;
}
`;

    setOutput(nginx);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('serverName')} (Domain)</label>
            <input
              type="text"
              value={config.serverName}
              onChange={(e) => setConfig({ ...config, serverName: e.target.value })}
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              placeholder={t('exampleDomain')}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('rootPath')}</label>
            <input
              type="text"
              value={config.rootPath}
              onChange={(e) => setConfig({ ...config, rootPath: e.target.value })}
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              placeholder="/var/www/html"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('proxyPass')}</label>
            <input
              type="text"
              value={config.proxyPass}
              onChange={(e) => setConfig({ ...config, proxyPass: e.target.value })}
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              placeholder="http://localhost:3000"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">{t('features')}</h3>
          {[
            { key: 'enableSsl', label: t('enableSsl') },
            { key: 'enableGzip', label: t('enableGzip') },
            { key: 'enableCaching', label: t('enableCaching') },
            { key: 'phpFpm', label: t('enablePhp') },
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

          {config.enableSsl && (
            <div className="space-y-2 pt-2">
              <input
                type="text"
                value={config.sslCertPath}
                onChange={(e) => setConfig({ ...config, sslCertPath: e.target.value })}
                placeholder="SSL Certificate Path"
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
              <input
                type="text"
                value={config.sslKeyPath}
                onChange={(e) => setConfig({ ...config, sslKeyPath: e.target.value })}
                placeholder="SSL Key Path"
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
            </div>
          )}

          {config.phpFpm && (
            <div className="pt-2">
              <input
                type="text"
                value={config.phpSocket}
                onChange={(e) => setConfig({ ...config, phpSocket: e.target.value })}
                placeholder="PHP-FPM Socket Path"
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
            </div>
          )}
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
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('output')}</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-96 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
