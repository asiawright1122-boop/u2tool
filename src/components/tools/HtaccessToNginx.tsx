'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function HtaccessToNginx() {
  const t = useTranslations('tools.htaccess-to-nginx');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const convertRules: Array<{
    pattern: RegExp;
    convert: (match: RegExpMatchArray) => string;
  }> = [
    // RewriteEngine
    {
      pattern: /RewriteEngine\s+On/gi,
      convert: () => '# Rewrite engine is always on in Nginx'
    },
    // RewriteBase
    {
      pattern: /RewriteBase\s+(\S+)/gi,
      convert: (m) => `# RewriteBase ${m[1]} - handled by location block`
    },
    // RewriteCond %{REQUEST_FILENAME} !-f
    {
      pattern: /RewriteCond\s+%\{REQUEST_FILENAME\}\s+!-f/gi,
      convert: () => 'if (!-f $request_filename) {'
    },
    // RewriteCond %{REQUEST_FILENAME} !-d
    {
      pattern: /RewriteCond\s+%\{REQUEST_FILENAME\}\s+!-d/gi,
      convert: () => 'if (!-d $request_filename) {'
    },
    // RewriteCond %{HTTPS} off
    {
      pattern: /RewriteCond\s+%\{HTTPS\}\s+off/gi,
      convert: () => 'if ($scheme = http) {'
    },
    // RewriteCond %{HTTP_HOST} ^www\.
    {
      pattern: /RewriteCond\s+%\{HTTP_HOST\}\s+\^www\\\./gi,
      convert: () => 'if ($host ~* ^www\\.) {'
    },
    // RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
    {
      pattern: /RewriteRule\s+\^\(\.\*\)\$\s+https:\/\/%\{HTTP_HOST\}\/\$1\s+\[R=301,L\]/gi,
      convert: () => '    return 301 https://$host$request_uri;\n}'
    },
    // RewriteRule ^(.*)$ /index.php [L]
    {
      pattern: /RewriteRule\s+\^\(\.\*\)\$\s+\/index\.php\s*\[.*L.*\]/gi,
      convert: () => '    try_files $uri $uri/ /index.php?$query_string;\n}'
    },
    // RewriteRule simple redirect
    {
      pattern: /RewriteRule\s+\^(\S+)\s+(\S+)\s+\[R=(\d+).*\]/gi,
      convert: (m) => `rewrite ^/${m[1]} ${m[2]} permanent;  # ${m[3]} redirect`
    },
    // RewriteRule rewrite
    {
      pattern: /RewriteRule\s+\^(\S+)\s+(\S+)\s+\[L\]/gi,
      convert: (m) => `rewrite ^/${m[1]} ${m[2]} last;`
    },
    // ErrorDocument
    {
      pattern: /ErrorDocument\s+(\d+)\s+(\S+)/gi,
      convert: (m) => `error_page ${m[1]} ${m[2]};`
    },
    // DirectoryIndex
    {
      pattern: /DirectoryIndex\s+(.+)/gi,
      convert: (m) => `index ${m[1]};`
    },
    // Options -Indexes
    {
      pattern: /Options\s+-Indexes/gi,
      convert: () => 'autoindex off;'
    },
    // Options +Indexes
    {
      pattern: /Options\s+\+Indexes/gi,
      convert: () => 'autoindex on;'
    },
    // Header set
    {
      pattern: /Header\s+set\s+(\S+)\s+"([^"]+)"/gi,
      convert: (m) => `add_header ${m[1]} "${m[2]}";`
    },
    // Header always set
    {
      pattern: /Header\s+always\s+set\s+(\S+)\s+"([^"]+)"/gi,
      convert: (m) => `add_header ${m[1]} "${m[2]}" always;`
    },
    // ExpiresByType
    {
      pattern: /ExpiresByType\s+(\S+)\s+"access plus (\d+)\s+(\w+)"/gi,
      convert: (m) => {
        const unit = m[3].toLowerCase();
        const time = m[2] + (unit.startsWith('day') ? 'd' : unit.startsWith('month') ? 'M' : unit.startsWith('year') ? 'y' : 'h');
        return `# ${m[1]}: expires ${time}`;
      }
    },
    // Deny from all
    {
      pattern: /Deny\s+from\s+all/gi,
      convert: () => 'deny all;'
    },
    // Allow from all
    {
      pattern: /Allow\s+from\s+all/gi,
      convert: () => 'allow all;'
    },
    // Allow from IP
    {
      pattern: /Allow\s+from\s+(\S+)/gi,
      convert: (m) => `allow ${m[1]};`
    },
    // SetEnvIf
    {
      pattern: /SetEnvIf\s+(\S+)\s+"([^"]+)"\s+(\S+)/gi,
      convert: (m) => `# SetEnvIf ${m[1]} "${m[2]}" ${m[3]} - use map or if in Nginx`
    },
    // php_value / php_flag
    {
      pattern: /php_(value|flag)\s+(\S+)\s+(\S+)/gi,
      convert: (m) => `# php_${m[1]} ${m[2]} ${m[3]} - set in php.ini or fastcgi_param`
    },
  ];

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const result = input;
    const lines = result.split('\n');
    const convertedLines: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        convertedLines.push(trimmedLine.startsWith('#') ? trimmedLine : '');
        continue;
      }

      let converted = false;
      for (const rule of convertRules) {
        const match = trimmedLine.match(rule.pattern);
        if (match) {
          convertedLines.push(rule.convert(match));
          converted = true;
          break;
        }
      }

      if (!converted) {
        convertedLines.push(`# TODO: ${trimmedLine}`);
      }
    }

    // Wrap in server block
    const nginxConfig = `server {
    listen 80;
    server_name example.com;
    root /var/www/html;

${convertedLines.map(l => l ? '    ' + l : '').join('\n')}
}`;

    setOutput(nginxConfig);
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    setInput(`# Sample .htaccess file
RewriteEngine On
RewriteBase /

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

# Remove www
RewriteCond %{HTTP_HOST} ^www\\.
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

# Front controller
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.php [L]

# Error pages
ErrorDocument 404 /404.html
ErrorDocument 500 /500.html

# Security headers
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"

# Disable directory listing
Options -Indexes`);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4">
        <button
          onClick={loadSample}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
        >
          {t('loadSample')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">{t('htaccessInput')}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="tool-textarea h-80 font-mono text-sm"
            placeholder={t('placeholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t('nginxOutput')}</label>
          <textarea
            value={output}
            readOnly
            className="tool-textarea h-80 font-mono text-sm bg-gray-800"
          />
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={convert}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          {tg('convert')}
        </button>
        <button
          onClick={copyOutput}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          disabled={!output}
        >
          {copied ? tg('copied') : tg('copy')}
        </button>
      </div>

      <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg text-sm">
        <p className="text-yellow-400 font-medium mb-2">{t('note')}</p>
        <p className="text-gray-300">{t('noteText')}</p>
      </div>
    </div>
  );
}
