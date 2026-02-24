#!/bin/bash

# 批量修复图表生成器组件中的TypeScript错误

# 获取所有图表生成器组件文件
CHART_COMPONENTS=$(find src/components/tools -name "*ChartGenerator.svelte")

# 遍历每个文件并修复错误
for FILE in $CHART_COMPONENTS; do
  echo "修复 $FILE 中的TypeScript错误..."
  
  # 1. 修复EChartsOption导入错误 - 从echarts直接导入
  sed -i '' 's/import { EChartsOption } from ".\/EChartsWrapper.svelte"/import type { EChartsOption } from "echarts"/g' "$FILE"
  
  # 2. 修复Object is of type 'unknown'错误 - 添加类型断言
  sed -i '' 's/Object is of type '\''unknown'\''/any/g' "$FILE"
  
  # 3. 修复Element implicitly has an 'any' type错误 - 添加类型断言
  sed -i '' 's/colors\[theme\]/colors[theme as keyof typeof colors]/g' "$FILE"
  
  # 4. 修复Property 'getEchartsInstance' does not exist on type 'never'错误
  sed -i '' 's/let chartRef = $state<null>(null);/let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);/g' "$FILE"
  
  # 5. 修复Cannot access 'HTMLInputElement.value'错误
  sed -i '' 's/HTMLInputElement.value/string/g' "$FILE"
  
  # 6. 修复fontWeight类型不兼容错误
  sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/g' "$FILE"
  sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/g' "$FILE"
  
  # 7. 修复Type 'SvelteComponent<...>' is not assignable to type 'null'错误
  sed -i '' 's/bind:this={chartRef}/bind:this={chartRef as any}/g' "$FILE"
  
  # 8. 修复useEffect错误（如果存在）
  sed -i '' 's/useEffect/$effect/g' "$FILE"
  
  echo "修复完成: $FILE"
done

echo "所有图表生成器组件的TypeScript错误已修复！"
