import { glob } from 'glob';
import * as fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';

const distDir = path.resolve('dist');

async function main(): Promise<void> {
  console.log('🏁 Starting JSON-LD trailing slash & structure validation...');
  const htmlFiles = await glob('**/*.html', { cwd: distDir, absolute: true });
  
  if (htmlFiles.length === 0) {
    console.warn('⚠️ No HTML files found in dist/. Please run `npm run build` first.');
    return;
  }

  let hasErrors = false;
  let schemasChecked = 0;

  for (const file of htmlFiles) {
    const html = await fs.readFile(file, 'utf-8');
    const $ = cheerio.load(html);
    
    const jsonLdScripts = $('script[type="application/ld+json"]');
    for (const el of jsonLdScripts) {
      const content = $(el).html();
      if (!content) continue;
      
      let data;
      try {
        data = JSON.parse(content);
      } catch (e) {
        console.error(`❌ Invalid JSON-LD in ${file}`);
        hasErrors = true;
        continue;
      }
      
      // JSON-LD can be an object or an array of objects
      const items = Array.isArray(data) ? data : [data];
      
      for (const item of items) {
        // Many structures nest schemas in @graph
        const entities = item['@graph'] ? item['@graph'] : [item];
        
        for (const entity of entities) {
          if (!entity) continue;
          schemasChecked++;
          const type = entity['@type'];
          
          // Check BreadcrumbList
          if (type === 'BreadcrumbList' && Array.isArray(entity.itemListElement)) {
            for (const listElement of entity.itemListElement) {
              if (listElement.item) {
                const url = listElement.item;
                if (typeof url === 'string' && url !== 'https://www.u2tool.com' && url.startsWith('https://www.u2tool.com') && !url.endsWith('/')) {
                  console.error(`❌ Breadcrumb item URL missing trailing slash in ${file}:\n   Found: ${url}`);
                  hasErrors = true;
                }
              }
            }
          }
          
          // Check other common schema types that have URL
          if (typeof entity.url === 'string') {
            const url = entity.url;
            if (url !== 'https://www.u2tool.com' && url.startsWith('https://www.u2tool.com') && !url.endsWith('/')) {
              console.error(`❌ ${type || 'Entity'} url missing trailing slash in ${file}:\n   Found: ${url}`);
              hasErrors = true;
            }
          }
        }
      }
    }
  }

  if (hasErrors) {
    console.error('❌ JSON-LD validation failed due to trailing slash rule violations.');
    process.exit(1);
  }
  
  console.log(`✅ JSON-LD validation passed! Checked ${schemasChecked} entities across ${htmlFiles.length} files.`);
}

main().catch((err) => {
  console.error(`JSON-LD validation script error: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
