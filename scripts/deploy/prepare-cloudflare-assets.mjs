import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
const assetsIgnorePath = path.join(distDir, '.assetsignore');
const contents = '_worker.js\n';

if (!fs.existsSync(distDir)) {
  console.error(`dist directory not found: ${distDir}`);
  process.exit(1);
}

fs.writeFileSync(assetsIgnorePath, contents, 'utf8');
console.log(`Wrote ${assetsIgnorePath}`);
