import { cp, mkdir, rm } from 'node:fs/promises';

const sourceDir = new URL('../src/messages/', import.meta.url);
const targetDir = new URL('../public/messages/', import.meta.url);

await rm(targetDir, { recursive: true, force: true });
await mkdir(new URL('../public/', import.meta.url), { recursive: true });
await cp(sourceDir, targetDir, { recursive: true });
