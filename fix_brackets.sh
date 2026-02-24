#!/bin/bash

# 修复图表生成器组件中的括号不匹配问题

# 要修复的文件列表
CHART_COMPONENTS=$(find src/components/tools -name "*ChartGenerator.svelte")

# 修复每个图表生成器组件
for file in $CHART_COMPONENTS; do
  echo "修复文件: $file"
  
  # 修复双括号问题
  sed -i '' 's/((event.target as HTMLInputElement)/(event.target as HTMLInputElement/' $file
  sed -i '' 's/((e.target as HTMLInputElement)/(e.target as HTMLInputElement/' $file
  sed -i '' 's/((e.target as HTMLSelectElement)/(e.target as HTMLSelectElement/' $file
  
  # 修复缺少右括号的问题
  sed -i '' 's/(event.target as HTMLInputElement).files?.[0];/(event.target as HTMLInputElement).files?.[0];/' $file

done

echo "括号修复完成！"
