#!/bin/bash

# Pre-commit hook
# 检查代码质量，防止提交临时文件和调试代码

echo "🔍 运行 pre-commit 检查..."

# 获取暂存的文件
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
  echo "✅ 没有暂存的文件"
  exit 0
fi

# 检查临时文件
echo "📁 检查临时文件..."
TEMP_FILES=$(echo "$STAGED_FILES" | grep -E '^(fix_|test_|temp_|[0-9]+$|.*\.tmp$|.*\.bak$)')
if [ -n "$TEMP_FILES" ]; then
  echo "❌ 发现临时文件，请移除后再提交:"
  echo "$TEMP_FILES"
  echo ""
  echo "提示: 使用 git reset HEAD <file> 取消暂存"
  exit 1
fi

# 检查 console.log 和 debugger
echo "🐛 检查调试代码..."
JS_TS_FILES=$(echo "$STAGED_FILES" | grep -E '\.(js|ts|jsx|tsx|svelte)$')
if [ -n "$JS_TS_FILES" ]; then
  CONSOLE_LOGS=$(git diff --cached | grep -E '^\+.*console\.(log|debug|info|warn)')
  DEBUGGERS=$(git diff --cached | grep -E '^\+.*debugger')
  
  if [ -n "$CONSOLE_LOGS" ]; then
    echo "⚠️  发现 console.log 语句:"
    echo "$CONSOLE_LOGS"
    echo ""
  fi
  
  if [ -n "$DEBUGGERS" ]; then
    echo "❌ 发现 debugger 语句:"
    echo "$DEBUGGERS"
    echo ""
    echo "请移除 debugger 语句后再提交"
    exit 1
  fi
fi

# 运行 ESLint (仅检查暂存的文件)
echo "🔧 运行 ESLint..."
if [ -n "$JS_TS_FILES" ]; then
  npx eslint $JS_TS_FILES --max-warnings 0
  if [ $? -ne 0 ]; then
    echo "❌ ESLint 检查失败"
    echo ""
    echo "提示: 运行 'npm run lint' 查看所有错误"
    exit 1
  fi
fi

echo "✅ Pre-commit 检查通过"
echo ""
echo "提示: 如需跳过检查，使用 git commit --no-verify"
exit 0
