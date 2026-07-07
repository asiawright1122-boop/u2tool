import { rm } from 'node:fs/promises';

const targetDir = new URL('../public/messages/', import.meta.url);

if (process.env.U2TOOL_CLEAN_PUBLIC_MESSAGES !== '1') {
  console.log('Keeping public/messages so a running dev server can continue serving split message assets.');
  process.exit(0);
}

await rm(targetDir, { recursive: true, force: true });
