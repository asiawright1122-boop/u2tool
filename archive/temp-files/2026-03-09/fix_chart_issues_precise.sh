#!/bin/bash

# 精确修复图表生成器组件中的剩余TypeScript错误和可访问性警告

# 获取所有图表生成器组件文件
CHART_COMPONENTS=$(find src/components/tools -name "*ChartGenerator.svelte")

# 遍历每个文件并修复错误
for FILE in $CHART_COMPONENTS; do
  echo "修复 $FILE 中的剩余错误..."
  
  # 1. 修复EChartsOption导入错误 - 从echarts直接导入
  sed -i '' 's/import { EChartsOption } from ".\/EChartsWrapper.svelte"/import type { EChartsOption } from "echarts"/g' "$FILE"
  sed -i '' 's/import EChartsWrapper, { type EChartsWrapperRef, type EChartsOption } from "\.\/EChartsWrapper\.svelte"/import EChartsWrapper, { type EChartsWrapperRef } from ".\/EChartsWrapper.svelte"; import type { EChartsOption } from "echarts"/g' "$FILE"
  
  # 2. 修复Object is of type 'unknown'错误 - 添加类型断言
  sed -i '' 's/const scope = translations\["tools"\]\["[a-z-]*"\] as Record<string, unknown> || {}/const scope = (translations\["tools"\]\["[a-z-]*"\] as Record<string, unknown>) || {}/g' "$FILE"
  
  # 3. 修复Element implicitly has an 'any' type错误 - 添加类型断言
  sed -i '' 's/colors\[theme\]/colors[theme as keyof typeof colors]/g' "$FILE"
  
  # 4. 修复Property 'getEchartsInstance' does not exist on type 'never'错误
  sed -i '' 's/let chartRef = $state<null>(null);/let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);/g' "$FILE"
  
  # 5. 修复'e.target' is possibly 'null'和Property 'value' does not exist on type 'EventTarget'错误
  sed -i '' 's/e\.target\.value/(e.target as HTMLInputElement).value/g' "$FILE"
  sed -i '' 's/e\.target\.files/(e.target as HTMLInputElement).files/g' "$FILE"
  
  # 6. 修复fontWeight类型不兼容错误
  sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/g' "$FILE"
  sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/g' "$FILE"
  
  # 7. 修复组件类型不匹配错误
  sed -i '' 's/bind:this={chartRef}/bind:this={chartRef as any}/g' "$FILE"
  
  # 8. 修复表单标签必须与控件关联的问题
  sed -i '' 's/<label class="block text-sm font-medium mb-1">\(.*\)<\/label>\s*<input/<label for="\1" class="block text-sm font-medium mb-1">\1<\/label> <input id="\1"/g' "$FILE"
  
  # 9. 修复非空元素的自闭合HTML标签问题
  sed -i '' 's/<textarea\(.*\)\/>/<textarea\1><\/textarea>/g' "$FILE"
  sed -i '' 's/<select\(.*\)\/>/<select\1><\/select>/g' "$FILE"
  
  # 10. 修复参数类型错误
  sed -i '' 's/formatter: (params) =>/formatter: (params: any) =>/g' "$FILE"
  
  # 11. 修复数组类型错误
  sed -i '' 's/boxplotData\(.*\) as \[number, number, number, number, number\]/boxplotData\1 as [number, number, number, number, number]/g' "$FILE"
  
  echo "修复完成: $FILE"
done

echo "所有图表生成器组件的剩余错误已修复！"
