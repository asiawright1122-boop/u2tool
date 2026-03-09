#!/usr/bin/env node
import fs from 'fs-extra';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 安装 Git Hooks
 */
async function installHooks(): Promise<void> {
  console.log('🔧 安装 Git Hooks...\n');
  
  const gitHooksDir = path.join(process.cwd(), '.git', 'hooks');
  const sourceDir = __dirname;
  
  // 检查 .git 目录是否存在
  if (!(await fs.pathExists(path.join(process.cwd(), '.git')))) {
    console.error('❌ 未找到 .git 目录，请确保在 Git 仓库中运行此脚本');
    process.exit(1);
  }
  
  // 确保 hooks 目录存在
  await fs.ensureDir(gitHooksDir);
  
  // 安装 pre-commit hook
  const preCommitSource = path.join(sourceDir, 'pre-commit.sh');
  const preCommitDest = path.join(gitHooksDir, 'pre-commit');
  
  if (!(await fs.pathExists(preCommitSource))) {
    console.error(`❌ 未找到 pre-commit.sh 文件: ${preCommitSource}`);
    process.exit(1);
  }
  
  // 复制文件
  await fs.copy(preCommitSource, preCommitDest, { overwrite: true });
  
  // 设置执行权限 (Unix/Linux/macOS)
  if (process.platform !== 'win32') {
    await fs.chmod(preCommitDest, 0o755);
  }
  
  console.log('✅ pre-commit hook 已安装');
  console.log(`   位置: ${preCommitDest}`);
  console.log();
  console.log('📝 Hook 功能:');
  console.log('   • 检查临时文件');
  console.log('   • 检查 console.log 和 debugger');
  console.log('   • 运行 ESLint 检查');
  console.log();
  console.log('💡 提示:');
  console.log('   • 如需跳过检查，使用: git commit --no-verify');
  console.log('   • 仅在紧急情况下跳过检查');
  console.log();
}

// CLI 入口
async function main() {
  try {
    await installHooks();
  } catch (error) {
    console.error('❌ 安装失败:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { installHooks };
