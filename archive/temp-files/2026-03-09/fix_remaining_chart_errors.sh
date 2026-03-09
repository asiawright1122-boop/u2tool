#!/bin/bash

# 修复剩余的TypeScript错误和可访问性警告

# 获取所有图表生成器组件文件
CHART_COMPONENTS=$(find src/components/tools -name "*ChartGenerator.svelte")

# 遍历每个文件并修复错误
for FILE in $CHART_COMPONENTS; do
  echo "修复 $FILE 中的剩余错误..."
  
  # 1. 修复Object is of type 'unknown'错误 - 修复scope定义
  # 首先找到图表类型名称
  CHART_TYPE=$(basename "$FILE" .svelte | sed 's/ChartGenerator//')
  sed -i '' "s/translations\['tools'\]\['[a-z-]*'\]/translations['tools']['${CHART_TYPE}']/g" "$FILE"
  
  # 2. 修复fontWeight类型不兼容错误 - 添加as const断言
  sed -i '' 's/fontWeight: '"'"'"'bold'"'"'"'/fontWeight: '"'"'"'bold'"'"'"' as const/g' "$FILE"
  sed -i '' 's/fontWeight: '"'"'"'normal'"'"'"'/fontWeight: '"'"'"'normal'"'"'"' as const/g' "$FILE"
  
  # 3. 修复Cannot invoke an object which is possibly 'undefined'错误
  sed -i '' 's/chartRef\.getEchartsInstance()/chartRef?.getEchartsInstance()/g' "$FILE"
  
  # 4. 修复Expected 1 arguments, but got 2错误 - 修复alert函数调用
  sed -i '' 's/alert(t('\''csvImportSuccess'\''), { count: totalPoints }))/alert(t('\''csvImportSuccess'\'').replace('\''{count}'\'', String(totalPoints)))/g' "$FILE"
  
  # 5. 修复Property 'value' does not exist on type 'never'错误 - 修复fileInputRef类型
  sed -i '' 's/let fileInputRef = $state(null);/let fileInputRef = $state<HTMLInputElement | null>(null);/g' "$FILE"
  
  # 6. 修复Self-closing HTML tags for non-void elements警告
  sed -i '' 's/<textarea\([^>]*\)\/>/<textarea\1><\/textarea>/g' "$FILE"
  
  # 7. 修复A form label must be associated with a control警告 - 为label添加for属性
  # 为每个没有for属性的label添加for属性
  sed -i '' 's/<label class="block text-sm font-medium mb-1">\([^<]*\)<\/label>/<label for="\1" class="block text-sm font-medium mb-1">\1<\/label>/g' "$FILE"
  
  echo "修复完成: $FILE"
done

echo "所有图表生成器组件的剩余错误已修复！"
