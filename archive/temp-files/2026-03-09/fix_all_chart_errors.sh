#!/bin/bash

# 批量修复所有图表生成器组件中的TypeScript错误

# 获取所有图表生成器组件文件
CHART_COMPONENTS=$(find src/components/tools -name "*ChartGenerator.svelte")

# 遍历每个文件并修复错误
for FILE in $CHART_COMPONENTS; do
  echo "修复 $FILE 中的TypeScript错误..."
  
  # 1. 修复Object is of type 'unknown'错误 - 修复scope定义
  # 首先找到图表类型名称
  CHART_TYPE=$(basename "$FILE" .svelte | sed 's/ChartGenerator//')
  sed -i '' "s/translations\['tools'\]\['\[a-z-]*\']/translations['tools']['${CHART_TYPE}']/g" "$FILE"
  
  # 2. 修复Element implicitly has an 'any' type错误 - 添加类型断言
  sed -i '' 's/colorThemes\[colorTheme\]/colorThemes[colorTheme as keyof typeof colorThemes]/g' "$FILE"
  sed -i '' 's/colors\[theme\]/colors[theme as keyof typeof colors]/g' "$FILE"
  
  # 3. 修复Property 'getEchartsInstance' does not exist on type 'never'错误
  sed -i '' 's/let chartRef = $state(null);/let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);/g' "$FILE"
  
  # 4. 修复fontWeight类型不兼容错误
  sed -i '' 's/fontWeight: '"'"'"'bold'"'"'"'/fontWeight: '"'"'"'bold'"'"'"' as const/g' "$FILE"
  sed -i '' 's/fontWeight: '"'"'"'normal'"'"'"'/fontWeight: '"'"'"'normal'"'"'"' as const/g' "$FILE"
  
  # 5. 修复组件类型不匹配错误
  sed -i '' 's/bind:this={chartRef}/bind:this={chartRef as any}/g' "$FILE"
  
  echo "修复完成: $FILE"
done

echo "所有图表生成器组件的TypeScript错误已修复！"
