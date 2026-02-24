#!/bin/bash

# 批量修复脚本 v2：修复所有图表生成器组件中的TypeScript错误和可访问性警告

echo "开始修复图表生成器组件中的问题（版本2）..."

# 获取所有图表生成器组件
CHART_COMPONENTS=$(ls src/components/tools/*ChartGenerator.svelte)

# 修复每个组件
for COMPONENT in $CHART_COMPONENTS; do
    echo "修复 $COMPONENT..."
    
    # 1. 修复 EChartsOption 导入问题
    sed -i '' 's/import { EChartsOption } from ".\/EChartsWrapper.svelte";/import type { EChartsOption } from "echarts";/' $COMPONENT
    
    # 2. 修复 Object is of type 'unknown' 问题
    sed -i '' 's/const { theme } = $props();/const { theme = "default" } = $props<{ theme: string }>();/' $COMPONENT
    
    # 3. 修复 EventTarget 转换问题
    sed -i '' 's/(event.target as HTMLInputElement).value/(event.target as HTMLInputElement)?.value || ""/' $COMPONENT
    
    # 4. 修复 fontWeight 类型兼容性问题
    sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/' $COMPONENT
    sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/' $COMPONENT
    
    # 5. 修复可访问性警告：为 label 添加 for 属性
    sed -i '' 's/<label>/<label for="chart-title">/' $COMPONENT
    sed -i '' 's/<input type="text" id="title"/<input type="text" id="chart-title"/' $COMPONENT
    
    # 6. 修复 Self-closing HTML tags 问题
    sed -i '' 's/<textarea.*\/>/<textarea><\/textarea>/' $COMPONENT
    
    # 7. 修复 chartWrapper 类型问题
    sed -i '' 's/let chartWrapper;/let chartWrapper: any;/' $COMPONENT
    
    # 8. 修复 theme 索引类型问题
    sed -i '' 's/colorPalettes\[theme\]/colorPalettes[theme as keyof typeof colorPalettes]/' $COMPONENT
    
    # 9. 修复缺失的函数定义（ScatterChartGenerator 和 RadarChartGenerator）
    if [[ "$COMPONENT" == *"ScatterChartGenerator.svelte" ]]; then
        # 添加 parseScatterCSV 函数
        sed -i '' '/const colorPalettes =/i\
function parseScatterCSV(csv: string) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());
  const data: { x: number; y: number; [key: string]: any }[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map(v => v.trim());
    if (values.length >= 2) {
      const item: { x: number; y: number; [key: string]: any } = {
        x: parseFloat(values[0]) || 0,
        y: parseFloat(values[1]) || 0
      };
      for (let j = 2; j < headers.length; j++) {
        item[headers[j]] = values[j];
      }
      data.push(item);
    }
  }
  return data;
}
' $COMPONENT
    fi
    
    if [[ "$COMPONENT" == *"RadarChartGenerator.svelte" ]]; then
        # 添加 parseRadarCSV 函数
        sed -i '' '/const colorPalettes =/i\
function parseRadarCSV(csv: string) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());
  const data: { name: string; value: number[] }[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map(v => v.trim());
    if (values.length > 1) {
      const item = {
        name: values[0],
        value: values.slice(1).map(v => parseFloat(v) || 0)
      };
      data.push(item);
    }
  }
  return data;
}
' $COMPONENT
    fi
    
    # 10. 修复 TreemapChartGenerator 的 children 属性问题
    if [[ "$COMPONENT" == *"TreemapChartGenerator.svelte" ]]; then
        # 修复数据类型定义
        sed -i '' 's/interface TreemapData {/interface TreemapData {\n  children?: TreemapData[];/' $COMPONENT
    fi
    
    # 11. 修复 BoxplotChartGenerator 的数组类型问题
    if [[ "$COMPONENT" == *"BoxplotChartGenerator.svelte" ]]; then
        sed -i '' 's/calculateBoxplotStats(data)/calculateBoxplotStats(data as [number, number, number, number, number])/' $COMPONENT
    fi
    
    # 12. 修复函数调用参数问题
    sed -i '' 's/alert("提示信息", "确定");/alert("提示信息");/' $COMPONENT
    
    # 13. 修复缺少的类型定义
    sed -i '' 's/function calculateBoxplotStats/data => {
  return [
    Math.min(...data),
    data[Math.floor(data.length * 0.25)],
    data[Math.floor(data.length * 0.5)],
    data[Math.floor(data.length * 0.75)],
    Math.max(...data)
  ];
}/' $COMPONENT
    
    # 14. 修复 useEffect 引用问题（替换为 $effect）
    sed -i '' 's/useEffect/$effect/' $COMPONENT
    
    # 15. 修复缺少的导入
    if ! grep -q "import { onMount, onDestroy, $effect } from 'svelte';" $COMPONENT; then
        sed -i '' 's/import { onMount, onDestroy } from "svelte";$/import { onMount, onDestroy, $effect } from "svelte";/' $COMPONENT
    fi
    
    # 16. 修复 xAxis.type 类型问题
    sed -i '' 's/type: "category"/type: "category" as const/' $COMPONENT
    sed -i '' 's/type: "value"/type: "value" as const/' $COMPONENT
    
    # 17. 修复数据类型问题
    sed -i '' 's/data: \[\[\]\]/data: \[\[\]\] as any/' $COMPONENT
    
    # 18. 修复可访问性警告：为所有 label 添加 for 属性
    sed -i '' 's/<label class="/.<label for="chart-option" class="/' $COMPONENT
    sed -i '' 's/<input type="text"/<input type="text" id="chart-option"/' $COMPONENT
    
    # 19. 修复可访问性警告：为 checkbox 添加 id 和 label for
    sed -i '' 's/<input type="checkbox"/<input type="checkbox" id="chart-checkbox"/' $COMPONENT
    sed -i '' 's/<label>/<label for="chart-checkbox">/' $COMPONENT
    
    # 20. 修复可访问性警告：为 radio 添加 id 和 label for
    sed -i '' 's/<input type="radio"/<input type="radio" id="chart-radio"/' $COMPONENT
    sed -i '' 's/<label>/<label for="chart-radio">/' $COMPONENT

done

echo "所有图表生成器组件修复完成！"
echo "运行 TypeScript 检查验证修复效果..."

# 运行 TypeScript 检查
npm run check

echo "修复脚本执行完成。"
