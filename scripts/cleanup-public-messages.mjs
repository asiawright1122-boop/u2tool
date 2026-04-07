import { rm } from 'node:fs/promises';

const targetDir = new URL('../public/messages/', import.meta.url);

await rm(targetDir, { recursive: true, force: true });
