#!/bin/bash

# 批量修复图表生成器组件中的TypeScript错误

# 要修复的文件列表
CHART_COMPONENTS=$(find src/components/tools -name "*ChartGenerator.svelte")

# 修复EChartsWrapper.svelte中的导出问题
sed -i '' 's/export { type EChartsOption };/export { type EChartsOption, type EChartsWrapperRef };/' src/components/tools/EChartsWrapper.svelte

# 修复每个图表生成器组件
for file in $CHART_COMPONENTS; do
  echo "修复文件: $file"
  
  # 修复事件处理程序中的类型问题
  sed -i '' 's/event.target.files/event.target as HTMLInputElement).files/' $file
  sed -i '' 's/e.target.value/(e.target as HTMLInputElement).value/' $file
  sed -i '' 's/e.target.value/(e.target as HTMLSelectElement).value/' $file
  
  # 修复fontWeight类型问题
  sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/' $file
  
  # 修复函数参数数量不匹配的问题
  sed -i '' 's/alert(t("csvImportSuccess", { count: /alert(t("csvImportSuccess"/' $file
  
  # 修复chartRef的类型问题
  sed -i '' 's/let chartRef = \$state(null);/let chartRef = \$state<EChartsWrapperRef | null>(null);/' $file
  
  # 修复fileInputRef的类型问题
  sed -i '' 's/let fileInputRef = \$state(null);/let fileInputRef = \$state<HTMLInputElement | null>(null);/' $file

done

echo "修复完成！"
