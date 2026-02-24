#!/bin/bash

# 修复图表生成器组件中的语法错误

# 要修复的文件列表
CHART_COMPONENTS=$(find src/components/tools -name "*ChartGenerator.svelte")

# 修复每个图表生成器组件
for file in $CHART_COMPONENTS; do
  echo "修复文件: $file"
  
  # 修复事件处理程序中的括号不匹配问题
  sed -i '' 's/event.target as HTMLInputElement).files/(event.target as HTMLInputElement).files/' $file
  
  # 修复其他可能的语法错误
  sed -i '' 's/let chartRef = \$state<EChartsWrapperRef | null>(null);/let chartRef = \$state(null);/' $file
  sed -i '' 's/let fileInputRef = \$state<HTMLInputElement | null>(null);/let fileInputRef = \$state(null);/' $file

done

echo "语法错误修复完成！"
