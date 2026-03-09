#!/usr/bin/env node

import { checkAllSpecs, printSpecsSummary, printSpecStatus } from './check-spec-status.js';
import { parseArgs } from 'node:util';

// CLI 入口
const { values } = parseArgs({
  options: {
    verbose: {
      type: 'boolean',
      short: 'v',
      default: false,
    },
    'specs-dir': {
      type: 'string',
      short: 'd',
      default: '.kiro/specs',
    },
    help: {
      type: 'boolean',
      short: 'h',
      default: false,
    },
  },
  allowPositionals: false,
});

if (values.help) {
  console.log(`
活跃 Spec 列表工具

用法:
  npx tsx scripts/spec-lifecycle/list-active-specs.ts [选项]

选项:
  -v, --verbose          显示详细信息
  -d, --specs-dir <dir>  指定 spec 目录（默认: .kiro/specs）
  -h, --help             显示帮助信息

示例:
  # 列出所有活跃的 spec
  npx tsx scripts/spec-lifecycle/list-active-specs.ts

  # 显示详细信息
  npx tsx scripts/spec-lifecycle/list-active-specs.ts --verbose
`);
  process.exit(0);
}

const specsDir = values['specs-dir'] as string;
const verbose = values.verbose as boolean;

checkAllSpecs(specsDir)
  .then(statuses => {
    printSpecsSummary(statuses);
    
    if (verbose) {
      console.log('\n=== 详细信息 ===');
      for (const status of statuses) {
        printSpecStatus(status);
      }
    }
  })
  .catch(error => {
    console.error('错误:', error);
    process.exit(1);
  });
