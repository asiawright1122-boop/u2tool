import { afterEach, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import net from 'node:net';
import { spawn, execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const runnerPath = path.resolve('scripts/validation/run-with-preview.mjs');
const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true }); });

async function fixture() {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'u2tool-preview-test-'));
  roots.push(cwd);
  fs.mkdirSync(path.join(cwd, 'dist/client'), { recursive: true });
  const socket = net.createServer();
  await new Promise<void>(resolve => socket.listen(0, '127.0.0.1', resolve));
  const port = (socket.address() as net.AddressInfo).port;
  await new Promise<void>(resolve => socket.close(() => resolve()));
  // Real child HTTP server: serve only files from this fixture's build.
  const server = `const http=require('node:http'),fs=require('node:fs');
    http.createServer((req,res)=>{try{res.end(fs.readFileSync('dist/client'+req.url))}
    catch{res.writeHead(404).end()}}).listen(${port},'127.0.0.1');`;
  return { cwd, port, server, options: { cwd, env: { ...process.env, PRODUCTION_PREVIEW_PORT: String(port) },
    previewCommand: [process.execPath, '-e', server], timeoutMs: 1000, shutdownMs: 500, stdio: 'ignore' } };
}

async function portClosed(port: number) {
  const server = net.createServer();
  await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  await new Promise<void>(resolve => server.close(() => resolve()));
}

it('requires a managed loopback origin, never an implicit development or public server', async () => {
  const { getManagedPreviewUrl } = await import('./run-with-preview.mjs');
  expect(() => getManagedPreviewUrl({})).toThrow(/managed preview/i);
  expect(() => getManagedPreviewUrl({ U2TOOL_PREVIEW_URL: 'https://www.u2tool.com' })).toThrow(/loopback/i);
  expect(getManagedPreviewUrl({ U2TOOL_PREVIEW_URL: 'http://127.0.0.1:4567' })).toBe('http://127.0.0.1:4567');
});

it.skipIf(process.platform === 'win32')('accepts EPERM only for a group with no live processes', async () => {
  const { groupAlive } = await import('./run-with-preview.mjs');
  const group = Number(execFileSync('ps', ['-o', 'pgid=', '-p', String(process.pid)], { encoding: 'utf8' }).trim());
  const probe = vi.spyOn(process, 'kill').mockImplementation(() => { throw Object.assign(new Error('denied'), { code: 'EPERM' }); });
  try {
    expect(groupAlive({ pid: 2_000_000_000 })).toBe(false);
    expect(() => groupAlive({ pid: group })).toThrow('denied');
  } finally { probe.mockRestore(); }
});

it.each([0, 7])('shares one origin and releases its server when the command exits %s', async code => {
  const { runWithPreview } = await import('./run-with-preview.mjs');
  const f = await fixture();
  const command = `const e=process.env;const url='http://127.0.0.1:${f.port}';
    if(!['BASE_URL','FETCH_BASE_URL','PROD_BASE_URL','U2TOOL_PREVIEW_URL'].every(k=>e[k]===url))process.exit(99);
    require('node:fs').writeFileSync('ran','yes');process.exit(${code});`;
  expect(await runWithPreview(process.execPath, ['-e', command], { ...f.options,
    env: { ...f.options.env, PROD_BASE_URL: 'https://wrong.example' } })).toBe(code);
  expect(fs.existsSync(path.join(f.cwd, 'ran'))).toBe(true);
  expect(fs.readdirSync(path.join(f.cwd, 'dist/client'))).toEqual([]);
  await portClosed(f.port);
});

it('rejects an occupied port without reusing or terminating its owner', async () => {
  const { runWithPreview } = await import('./run-with-preview.mjs');
  const f = await fixture();
  const foreign = http.createServer((_req, res) => res.end('foreign'));
  await new Promise<void>(resolve => foreign.listen(f.port, '127.0.0.1', resolve));
  try {
    await expect(runWithPreview(process.execPath, ['-e', 'process.exit(0)'], f.options)).rejects.toThrow(/in use/i);
    expect(await (await fetch(`http://127.0.0.1:${f.port}`)).text()).toBe('foreign');
    expect(fs.readdirSync(path.join(f.cwd, 'dist/client'))).toEqual([]);
  } finally { await new Promise<void>(resolve => foreign.close(() => resolve())); }
});

it('rejects a healthy but unrelated HTTP response instead of accepting robots.txt alone', async () => {
  const { runWithPreview } = await import('./run-with-preview.mjs');
  const f = await fixture();
  const wrongServer = `require('node:http').createServer((req,res)=>res.end('wrong build')).listen(${f.port},'127.0.0.1')`;
  await expect(runWithPreview(process.execPath, ['-e', "require('node:fs').writeFileSync('ran','bad')"],
    { ...f.options, previewCommand: [process.execPath, '-e', wrongServer] })).rejects.toThrow(/timed out/i);
  expect(fs.existsSync(path.join(f.cwd, 'ran'))).toBe(false);
  expect(fs.readdirSync(path.join(f.cwd, 'dist/client'))).toEqual([]);
  await portClosed(f.port);
});

it('fails promptly when preview spawn fails, removing its readiness file', async () => {
  const { runWithPreview } = await import('./run-with-preview.mjs');
  const f = await fixture();
  await expect(runWithPreview(process.execPath, ['-e', 'process.exit(0)'],
    { ...f.options, previewCommand: [path.join(f.cwd, 'missing-command')] })).rejects.toThrow();
  expect(fs.readdirSync(path.join(f.cwd, 'dist/client'))).toEqual([]);
  await portClosed(f.port);
});

it('cleans its preview when the validation command cannot spawn', async () => {
  const { runWithPreview } = await import('./run-with-preview.mjs');
  const f = await fixture();
  await expect(runWithPreview(path.join(f.cwd, 'missing-command'), [], f.options)).rejects.toThrow();
  expect(fs.readdirSync(path.join(f.cwd, 'dist/client'))).toEqual([]);
  await portClosed(f.port);
});

it('terminates the validation child if its preview unexpectedly exits', async () => {
  const { runWithPreview } = await import('./run-with-preview.mjs');
  const f = await fixture();
  const preview = `${f.server} setInterval(()=>{if(require('node:fs').existsSync('ran'))process.exit(9)},20);`;
  await expect(runWithPreview(process.execPath, ['-e',
    "require('node:fs').writeFileSync('ran',String(process.pid));setInterval(()=>{},1000)"],
  { ...f.options, previewCommand: [process.execPath, '-e', preview] })).rejects.toThrow(/preview exited/i);
  const pid = Number(fs.readFileSync(path.join(f.cwd, 'ran'), 'utf8'));
  expect(() => process.kill(pid, 0)).toThrow();
  await portClosed(f.port);
});

it.skipIf(process.platform === 'win32').each([['SIGTERM', 143], ['SIGINT', 130]] as const)('%s propagates failure and cleans validation descendants and preview', async (signal, code) => {
  const f = await fixture();
  const stage = `const cp=require('node:child_process'),fs=require('node:fs');
    const child=cp.spawn(process.execPath,['-e','setInterval(()=>{},1000)'],{stdio:'ignore'});
    fs.writeFileSync('ran',JSON.stringify([process.pid,child.pid]));setInterval(()=>{},1000);`;
  const bootstrap = `const {runWithPreview}=await import(${JSON.stringify(pathToFileURL(runnerPath).href)});
    process.exitCode=await runWithPreview(process.execPath,['-e',${JSON.stringify(stage)}],${JSON.stringify(f.options)});`;
  const child = spawn(process.execPath, ['--input-type=module', '-e', bootstrap], { stdio: 'ignore' });
  const done = new Promise<number | null>(resolve => child.once('exit', resolve));
  try {
    await expect.poll(() => fs.existsSync(path.join(f.cwd, 'ran')), { timeout: 5000 }).toBe(true);
    child.kill(signal);
    expect(await done).toBe(code);
    const pids = JSON.parse(fs.readFileSync(path.join(f.cwd, 'ran'), 'utf8')) as number[];
    for (const pid of pids) await expect.poll(() => { try { process.kill(pid, 0); return true; } catch { return false; } }).toBe(false);
    expect(fs.readdirSync(path.join(f.cwd, 'dist/client'))).toEqual([]);
    await portClosed(f.port);
  } finally { if (child.exitCode === null && child.signalCode === null) child.kill('SIGTERM'); }
}, 10000);
