import { spawn } from 'node:child_process';

const forwardedArgs = process.argv.slice(2);
const validatorArgs = [
  '--import',
  'tsx/esm',
  'scripts/validation/validate-tool-page-render-contract.ts',
  ...forwardedArgs,
];
const hasConfiguredBaseUrl = forwardedArgs.includes('--base-url')
  || Boolean(process.env.FETCH_BASE_URL)
  || Boolean(process.env.PROD_BASE_URL);
const commandArgs = hasConfiguredBaseUrl
  ? validatorArgs
  : [
      'scripts/validation/run-with-preview.mjs',
      '--',
      process.execPath,
      ...validatorArgs,
    ];

const child = spawn(process.execPath, commandArgs, {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
});

child.once('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});
child.once('exit', (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});
