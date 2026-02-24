#!/bin/bash

# 精确修复图表生成器组件中的导入和类型错误

# 获取所有图表生成器组件文件
CHART_COMPONENTS=$(find src/components/tools -name "*ChartGenerator.svelte")

# 遍历每个文件并修复错误
for FILE in $CHART_COMPONENTS; do
  echo "修复 $FILE 中的导入和类型错误..."
  
  # 1. 修复EChartsOption导入错误 - 从echarts直接导入
  # 先删除错误的导入
  sed -i '' '/import EChartsWrapper, { type EChartsWrapperRef, type EChartsOption } from/d' "$FILE"
  sed -i '' '/import { EChartsOption } from/d' "$FILE"
  
  # 然后添加正确的导入
  if grep -q "import EChartsWrapper" "$FILE"; then
    sed -i '' '/import EChartsWrapper/a\
  import type { EChartsOption } from "echarts";
' "$FILE"
  else
    # 如果没有EChartsWrapper导入，添加完整的导入
    sed -i '' '/import { useChartTheme }/i\
  import EChartsWrapper, { type EChartsWrapperRef } from '"'"'./EChartsWrapper.svelte'"'"';\
  import type { EChartsOption } from "echarts";
' "$FILE"
  fi
  
  # 2. 修复Object is of type 'unknown'错误 - 添加类型断言
  sed -i '' 's/const scope = translations\['\''tools'\''\]\['\''[a-z-]*'\''\] as Record<string, unknown> || {}/const scope = (translations\['\''tools'\''\]\['\''[a-z-]*'\''\] as Record<string, unknown>) || {}/g' "$FILE"
  
  # 3. 修复Element implicitly has an 'any' type错误 - 添加类型断言
  sed -i '' 's/colors\[theme\]/colors[theme as keyof typeof colors]/g' "$FILE"
  sed -i '' 's/colorThemes\[theme\]/colorThemes[theme as keyof typeof colorThemes]/g' "$FILE"
  
  # 4. 修复Property 'getEchartsInstance' does not exist on type 'never'错误
  sed -i '' 's/let chartRef = $state<null>(null);/let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);/g' "$FILE"
  
  # 5. 修复'e.target' is possibly 'null'和Property 'value' does not exist on type 'EventTarget'错误
  sed -i '' 's/e\.target\.value/(e.target as HTMLInputElement).value/g' "$FILE"
  sed -i '' 's/event\.target\.value/(event.target as HTMLInputElement).value/g' "$FILE"
  sed -i '' 's/e\.target\.files/(e.target as HTMLInputElement).files/g' "$FILE"
  sed -i '' 's/event\.target\.files/(event.target as HTMLInputElement).files/g' "$FILE"
  
  # 6. 修复fontWeight类型不兼容错误
  sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/g' "$FILE"
  sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/g' "$FILE"
  
  # 7. 修复组件类型不匹配错误
  sed -i '' 's/bind:this={chartRef}/bind:this={chartRef as any}/g' "$FILE"
  
  # 8. 修复参数类型错误
  sed -i '' 's/formatter: (params) =>/formatter: (params: any) =>/g' "$FILE"
  
  # 9. 修复数组类型错误
  sed -i '' 's/boxplotData\[\([0-9]*\)\] as \[number, number, number, number, number\]/boxplotData[\1] as [number, number, number, number, number]/g' "$FILE"
  
  # 10. 修复fileInputRef类型错误
  sed -i '' 's/let fileInputRef = $state<null>(null);/let fileInputRef = $state<HTMLInputElement | null>(null);/g' "$FILE"
  
  # 11. 修复alert函数调用错误
  sed -i '' 's/alert(t('\''csvImportSuccess'\'', { count: totalPoints }))/alert(t('\''csvImportSuccess'\'').replace('\''{count}'\'', String(totalPoints)))/g' "$FILE"
  
  echo "修复完成: $FILE"
done

echo "所有图表生成器组件的导入和类型错误已修复！"
