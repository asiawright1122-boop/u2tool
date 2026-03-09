#!/bin/bash

# Pre-commit hook
# 检查临时文件、console.log、debugger 和运行 ESLint

set -e

echo "🔍 运行 pre-commit 检查..."

# 获取暂存的文件
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
  echo "✅ 没有暂存的文件"
  exit 0
fi

# 检查临时文件
echo ""
echo "📁 检查临时文件..."
TEMP_FILES=$(echo "$STAGED_FILES" | grep -E '(^fix_.*\.(sh|js|ts)$|^test_.*\.(js|ts)$|^temp_|^[0-9]+$|\.tmp$|\.bak$)' || true)

if [ -n "$TEMP_FILES" ]; then
  echo "❌ 发现临时文件，不允许提交:"
  echo "$TEMP_FILES" | sed 's/^/  /'
  echo ""
  echo "请使用以下命令取消暂存:"
  echo "$TEMP_FILES" | sed 's/^/  git reset HEAD /'
  echo ""
  echo "或运行清理脚本:"
  echo "  npm run cleanup:temp-files"
  exit 1
fi

# 检查 console.log 和 debugger
echo ""
echo "🔍 检查调试代码..."
JS_TS_FILES=$(echo "$STAGED_FILES" | grep -E '\.(js|ts|jsx|tsx|svelte|astro)$' | grep -v '^scripts/' || true)

if [ -n "$JS_TS_FILES" ]; then
  CONSOLE_LOG_FILES=""
  DEBUGGER_FILES=""
  
  for file in $JS_TS_FILES; do
    if [ -f "$file" ]; then
      # 检查 console.log (排除注释)
      if grep -n 'console\.log' "$file" | grep -v '//' | grep -v '/\*' > /dev/null; then
        CONSOLE_LOG_FILES="$CONSOLE_LOG_FILES\n  $file"
      fi
      
      # 检查 debugger
      if grep -n 'debugger' "$file" | grep -v '//' | grep -v '/\*' > /dev/null; then
        DEBUGGER_FILES="$DEBUGGER_FILES\n  $file"
      fi
    fi
  done
  
  if [ -n "$CONSOLE_LOG_FILES" ]; then
    echo "⚠️  警告: 发现 console.log 语句:"
    echo -e "$CONSOLE_LOG_FILES"
    echo ""
    echo "建议在提交前移除 console.log"
  fi
  
  if [ -n "$DEBUGGER_FILES" ]; then
    echo "❌ 发现 debugger 语句，不允许提交:"
    echo -e "$DEBUGGER_FILES"
    echo ""
    echo "请移除所有 debugger 语句后再提交"
    exit 1
  fi
fi

# 运行 ESLint 检查
echo ""
echo "🔧 运行 ESLint 检查..."
LINTABLE_FILES=$(echo "$STAGED_FILES" | grep -E '\.(js|ts|jsx|tsx)$' | grep -v '\.d\.ts$' || true)

if [ -n "$LINTABLE_FILES" ]; then
  # 检查是否配置了 ESLint
  if [ -f "eslint.config.js" ] || [ -f "eslint.config.mjs" ] || [ -f "eslint.config.cjs" ] || [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ]; then
    # 只检查暂存的文件
    if ! npx eslint $LINTABLE_FILES 2>/dev/null; then
      echo ""
      echo "❌ ESLint 检查失败"
      echo "请修复错误后再提交，或使用 --no-verify 跳过检查（不推荐）"
      exit 1
    fi
  else
    echo "⚠️  未找到 ESLint 配置，跳过 ESLint 检查"
  fi
fi

echo ""
echo "✅ Pre-commit 检查通过"
echo ""
echo "提示: 如需跳过检查，使用 git commit --no-verify（仅在紧急情况下使用）"

exit 0
