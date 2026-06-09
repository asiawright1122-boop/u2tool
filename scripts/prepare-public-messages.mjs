import { cp, mkdir, rm } from 'node:fs/promises';

const sourceDir = new URL('../src/messages/', import.meta.url);
const targetDir = new URL('../public/messages/', import.meta.url);

await rm(targetDir, { recursive: true, force: true });
await new Promise(resolve => setTimeout(resolve, 100)); // 稍作延时确保文件系统释放锁
await mkdir(targetDir, { recursive: true });
await cp(sourceDir, targetDir, { recursive: true, force: true });
