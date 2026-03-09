#!/usr/bin/env node
import fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';

/**
 * 安装 Git Hooks
 */

async function installHooks() {
  console.log('🔧 安装 Git Hooks...\n');
  
  const gitDir = path.join(process.cwd(), '.git');
  
  // 检查是否是 Git 仓库
  if (!(await fs.pathExists(gitDir))) {
    console.error('❌ 当前目录不是 Git 仓库');
    process.exit(1);
  }
  
  const hooksDir = path.join(gitDir, 'hooks');
  await fs.ensureDir(hooksDir);
  
  // 安装 pre-commit hook
  const preCommitSource = path.join(process.cwd(), 'scripts/git-hooks/pre-commit.sh');
  const preCommitTarget = path.join(hooksDir, 'pre-commit');
  
  if (!(await fs.pathExists(preCommitSource))) {
    console.error('❌ 未找到 pre-commit.sh 文件');
    process.exit(1);
  }
  
  // 复制文件
  await fs.copy(preCommitSource, preCommitTarget);
  
  // 设置执行权限 (Unix/Linux/macOS)
  if (process.platform !== 'win32') {
    await fs.chmod(preCommitTarget, 0o755);
  }
  
  console.log('✅ pre-commit hook 已安装');
  console.log(`   位置: ${preCommitTarget}`);
  console.log();
  console.log('💡 提示:');
  console.log('   - Hook 会在每次提交前自动运行');
  console.log('   - 检查临时文件、console.log 和 debugger');
  console.log('   - 运行 ESLint 检查代码质量');
  console.log('   - 如需跳过检查，使用 git commit --no-verify');
  console.log();
}

installHooks().catch(error => {
  console.error('❌ 安装失败:', error);
  process.exit(1);
});
