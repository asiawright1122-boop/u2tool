#!/bin/bash

# 精确修复所有图表生成器组件中的剩余TypeScript错误

# 获取所有图表生成器组件文件
CHART_COMPONENTS=$(find src/components/tools -name "*ChartGenerator.svelte")

# 遍历每个文件并修复错误
for FILE in $CHART_COMPONENTS; do
  echo "修复 $FILE 中的剩余错误..."
  
  # 1. 修复Object is of type 'unknown'错误 - 修复scope定义
  # 使用文件名来确定图表类型
  if [[ "$FILE" == *"BarChartGenerator.svelte"* ]]; then
    sed -i '' "s/translations\['tools'\]\['\[a-z-\]*'\]/translations['tools']['bar-chart-generator']/g" "$FILE"
  elif [[ "$FILE" == *"LineChartGenerator.svelte"* ]]; then
    sed -i '' "s/translations\['tools'\]\['\[a-z-\]*'\]/translations['tools']['line-chart-generator']/g" "$FILE"
  elif [[ "$FILE" == *"PieChartGenerator.svelte"* ]]; then
    sed -i '' "s/translations\['tools'\]\['\[a-z-\]*'\]/translations['tools']['pie-chart-generator']/g" "$FILE"
  elif [[ "$FILE" == *"AreaChartGenerator.svelte"* ]]; then
    sed -i '' "s/translations\['tools'\]\['\[a-z-\]*'\]/translations['tools']['area-chart-generator']/g" "$FILE"
  elif [[ "$FILE" == *"DoughnutChartGenerator.svelte"* ]]; then
    sed -i '' "s/translations\['tools'\]\['\[a-z-\]*'\]/translations['tools']['doughnut-chart-generator']/g" "$FILE"
  elif [[ "$FILE" == *"HeatmapChartGenerator.svelte"* ]]; then
    sed -i '' "s/translations\['tools'\]\['\[a-z-\]*'\]/translations['tools']['heatmap-chart-generator']/g" "$FILE"
  elif [[ "$FILE" == *"BoxplotChartGenerator.svelte"* ]]; then
    sed -i '' "s/translations\['tools'\]\['\[a-z-\]*'\]/translations['tools']['boxplot-chart-generator']/g" "$FILE"
  elif [[ "$FILE" == *"PolarBarChartGenerator.svelte"* ]]; then
    sed -i '' "s/translations\['tools'\]\['\[a-z-\]*'\]/translations['tools']['polar-bar-chart-generator']/g" "$FILE"
  elif [[ "$FILE" == *"RadarChartGenerator.svelte"* ]]; then
    sed -i '' "s/translations\['tools'\]\['\[a-z-\]*'\]/translations['tools']['radar-chart-generator']/g" "$FILE"
  elif [[ "$FILE" == *"StackedBarChartGenerator.svelte"* ]]; then
    sed -i '' "s/translations\['tools'\]\['\[a-z-\]*'\]/translations['tools']['stacked-bar-chart-generator']/g" "$FILE"
  fi
  
  # 2. 修复Cannot invoke an object which is possibly 'undefined'错误
  sed -i '' 's/chartRef\.getEchartsInstance()/chartRef?.getEchartsInstance()/g' "$FILE"
  
  # 3. 修复fontWeight类型不兼容错误 - 添加as const断言
  sed -i '' "s/fontWeight: 'bold'/fontWeight: 'bold' as const/g" "$FILE"
  sed -i '' "s/fontWeight: 'normal'/fontWeight: 'normal' as const/g" "$FILE"
  
  # 4. 修复Expected 1 arguments, but got 2错误 - 修复alert函数调用
  sed -i '' "s/alert(t('csvImportSuccess'), { count: totalPoints }))/alert(t('csvImportSuccess').replace('{count}', String(totalPoints)))/g" "$FILE"
  
  echo "修复完成: $FILE"
done

echo "所有图表生成器组件的剩余错误已修复！"
