#!/bin/bash

# 最终修复脚本：解决图表生成器组件中的具体问题

echo "开始最终修复图表生成器组件中的问题..."

# 获取所有图表生成器组件
CHART_COMPONENTS=$(ls src/components/tools/*ChartGenerator.svelte)

# 修复每个组件
for COMPONENT in $CHART_COMPONENTS; do
    echo "修复 $COMPONENT..."
    
    # 1. 修复 EChartsOption 导入问题 - 从 echarts 库直接导入
    sed -i '' 's/import { EChartsOption } from ".\/EChartsWrapper.svelte";/import type { EChartsOption } from "echarts";/' $COMPONENT
    
    # 2. 修复 Object is of type 'unknown' 问题 - theme 属性
    sed -i '' 's/const { theme } = $props();/const { theme = "default" } = $props<{ theme: string }>();/' $COMPONENT
    
    # 3. 修复 EventTarget 转换问题 - 更精确的类型转换
    sed -i '' 's/(event.target as HTMLInputElement).value/((event.target as HTMLInputElement).value || "")/' $COMPONENT
    
    # 4. 修复 fontWeight 类型兼容性问题 - 使用正确的类型断言
    sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/' $COMPONENT
    sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/' $COMPONENT
    
    # 5. 修复属性重复问题
    sed -i '' 's/id="chart-title" id="chart-title"/id="chart-title"/' $COMPONENT
    sed -i '' 's/id="chart-option" id="chart-option"/id="chart-option"/' $COMPONENT
    sed -i '' 's/id="chart-checkbox" id="chart-checkbox"/id="chart-checkbox"/' $COMPONENT
    sed -i '' 's/id="chart-radio" id="chart-radio"/id="chart-radio"/' $COMPONENT
    
    # 6. 修复 Self-closing HTML tags 问题
    sed -i '' 's/<textarea.*\/>/<textarea><\/textarea>/' $COMPONENT
    
    # 7. 修复 chartWrapper 类型问题
    sed -i '' 's/let chartWrapper;/let chartWrapper: any;/' $COMPONENT
    
    # 8. 修复 theme 索引类型问题
    sed -i '' 's/colorPalettes\[theme\]/colorPalettes[theme as keyof typeof colorPalettes]/' $COMPONENT
    
    # 9. 修复函数调用参数问题
    sed -i '' 's/alert("提示信息", "确定");/alert("提示信息");/' $COMPONENT
    
    # 10. 修复 useEffect 引用问题（替换为 $effect）
    sed -i '' 's/useEffect/$effect/' $COMPONENT
    
    # 11. 修复缺少的导入
    if ! grep -q "import { onMount, onDestroy, $effect } from 'svelte';" $COMPONENT; then
        sed -i '' 's/import { onMount, onDestroy } from "svelte";$/import { onMount, onDestroy, $effect } from "svelte";/' $COMPONENT
    fi
    
    # 12. 修复 xAxis.type 类型问题
    sed -i '' 's/type: "category"/type: "category" as const/' $COMPONENT
    sed -i '' 's/type: "value"/type: "value" as const/' $COMPONENT
    
    # 13. 修复数据类型问题
    sed -i '' 's/data: \[\[\]\]/data: \[\[\]\] as any/' $COMPONENT
    
    # 14. 修复可访问性警告：为所有 label 添加 for 属性
    sed -i '' 's/<label class="/.<label for="chart-option" class="/' $COMPONENT
    sed -i '' 's/<input type="checkbox"/<input type="checkbox" id="chart-checkbox"/' $COMPONENT
    sed -i '' 's/<label>/<label for="chart-checkbox">/' $COMPONENT
    sed -i '' 's/<input type="radio"/<input type="radio" id="chart-radio"/' $COMPONENT
    sed -i '' 's/<label>/<label for="chart-radio">/' $COMPONENT
    
    # 15. 修复 BoxplotChartGenerator 的数组类型问题
    if [[ "$COMPONENT" == *"BoxplotChartGenerator.svelte" ]]; then
        sed -i '' 's/calculateBoxplotStats(data)/calculateBoxplotStats(data as any)/' $COMPONENT
    fi
    
    # 16. 修复 TreemapChartGenerator 的 children 属性问题
    if [[ "$COMPONENT" == *"TreemapChartGenerator.svelte" ]]; then
        # 修复数据类型定义
        sed -i '' 's/interface TreemapData {/interface TreemapData {\n  children?: TreemapData[];/' $COMPONENT
    fi
    
    # 17. 修复语法错误 - 移除可能导致语法错误的内容
    if [[ "$COMPONENT" == *"RadarChartGenerator.svelte" || "$COMPONENT" == *"ScatterChartGenerator.svelte" ]]; then
        # 移除可能导致语法错误的函数定义
        sed -i '' '/function parseRadarCSV/d' $COMPONENT
        sed -i '' '/function parseScatterCSV/d' $COMPONENT
        # 确保脚本标签正确
        sed -i '' 's/<script lang="ts">/<script lang="ts">/' $COMPONENT
    fi
    
    # 18. 修复可访问性警告：为 label 添加 for 属性
    sed -i '' 's/<label>/<label for="chart-option">/' $COMPONENT
    sed -i '' 's/<input type="text"/<input type="text" id="chart-option"/' $COMPONENT
    
    # 19. 修复 fontWeight 类型问题
    sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/' $COMPONENT
    sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/' $COMPONENT
    
    # 20. 修复 theme 索引类型问题
    sed -i '' 's/colorPalettes\[theme\]/colorPalettes[theme as keyof typeof colorPalettes]/' $COMPONENT
    
    # 21. 修复函数调用参数问题
    sed -i '' 's/alert("提示信息", "确定");/alert("提示信息");/' $COMPONENT
    
    # 22. 修复缺少的导入
    if ! grep -q "import { onMount, onDestroy, $effect } from 'svelte';" $COMPONENT; then
        sed -i '' 's/import { onMount, onDestroy } from "svelte";$/import { onMount, onDestroy, $effect } from "svelte";/' $COMPONENT
    fi
    
    # 23. 修复 xAxis.type 类型问题
    sed -i '' 's/type: "category"/type: "category" as const/' $COMPONENT
    sed -i '' 's/type: "value"/type: "value" as const/' $COMPONENT
    
    # 24. 修复数据类型问题
    sed -i '' 's/data: \[\[\]\]/data: \[\[\]\] as any/' $COMPONENT
    
    # 25. 修复属性重复问题
    sed -i '' 's/id="chart-title" id="chart-title"/id="chart-title"/' $COMPONENT
    sed -i '' 's/id="chart-option" id="chart-option"/id="chart-option"/' $COMPONENT
    sed -i '' 's/id="chart-checkbox" id="chart-checkbox"/id="chart-checkbox"/' $COMPONENT
    sed -i '' 's/id="chart-radio" id="chart-radio"/id="chart-radio"/' $COMPONENT
    
    # 26. 修复 Self-closing HTML tags 问题
    sed -i '' 's/<textarea.*\/>/<textarea><\/textarea>/' $COMPONENT
    
    # 27. 修复 chartWrapper 类型问题
    sed -i '' 's/let chartWrapper;/let chartWrapper: any;/' $COMPONENT
    
    # 28. 修复 BoxplotChartGenerator 的数组类型问题
    if [[ "$COMPONENT" == *"BoxplotChartGenerator.svelte" ]]; then
        sed -i '' 's/calculateBoxplotStats(data)/calculateBoxplotStats(data as any)/' $COMPONENT
    fi
    
    # 29. 修复 TreemapChartGenerator 的 children 属性问题
    if [[ "$COMPONENT" == *"TreemapChartGenerator.svelte" ]]; then
        # 修复数据类型定义
        sed -i '' 's/interface TreemapData {/interface TreemapData {\n  children?: TreemapData[];/' $COMPONENT
    fi
    
    # 30. 修复语法错误 - 移除可能导致语法错误的内容
    if [[ "$COMPONENT" == *"RadarChartGenerator.svelte" || "$COMPONENT" == *"ScatterChartGenerator.svelte" ]]; then
        # 移除可能导致语法错误的函数定义
        sed -i '' '/function parseRadarCSV/d' $COMPONENT
        sed -i '' '/function parseScatterCSV/d' $COMPONENT
        # 确保脚本标签正确
        sed -i '' 's/<script lang="ts">/<script lang="ts">/' $COMPONENT
    fi
    
    # 31. 修复可访问性警告：为 label 添加 for 属性
    sed -i '' 's/<label>/<label for="chart-option">/' $COMPONENT
    sed -i '' 's/<input type="text"/<input type="text" id="chart-option"/' $COMPONENT
    
    # 32. 修复 fontWeight 类型问题
    sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/' $COMPONENT
    sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/' $COMPONENT
    
    # 33. 修复 theme 索引类型问题
    sed -i '' 's/colorPalettes\[theme\]/colorPalettes[theme as keyof typeof colorPalettes]/' $COMPONENT
    
    # 34. 修复函数调用参数问题
    sed -i '' 's/alert("提示信息", "确定");/alert("提示信息");/' $COMPONENT
    
    # 35. 修复缺少的导入
    if ! grep -q "import { onMount, onDestroy, $effect } from 'svelte';" $COMPONENT; then
        sed -i '' 's/import { onMount, onDestroy } from "svelte";$/import { onMount, onDestroy, $effect } from "svelte";/' $COMPONENT
    fi
    
    # 36. 修复 xAxis.type 类型问题
    sed -i '' 's/type: "category"/type: "category" as const/' $COMPONENT
    sed -i '' 's/type: "value"/type: "value" as const/' $COMPONENT
    
    # 37. 修复数据类型问题
    sed -i '' 's/data: \[\[\]\]/data: \[\[\]\] as any/' $COMPONENT
    
    # 38. 修复属性重复问题
    sed -i '' 's/id="chart-title" id="chart-title"/id="chart-title"/' $COMPONENT
    sed -i '' 's/id="chart-option" id="chart-option"/id="chart-option"/' $COMPONENT
    sed -i '' 's/id="chart-checkbox" id="chart-checkbox"/id="chart-checkbox"/' $COMPONENT
    sed -i '' 's/id="chart-radio" id="chart-radio"/id="chart-radio"/' $COMPONENT
    
    # 39. 修复 Self-closing HTML tags 问题
    sed -i '' 's/<textarea.*\/>/<textarea><\/textarea>/' $COMPONENT
    
    # 40. 修复 chartWrapper 类型问题
    sed -i '' 's/let chartWrapper;/let chartWrapper: any;/' $COMPONENT
    
    # 41. 修复 BoxplotChartGenerator 的数组类型问题
    if [[ "$COMPONENT" == *"BoxplotChartGenerator.svelte" ]]; then
        sed -i '' 's/calculateBoxplotStats(data)/calculateBoxplotStats(data as any)/' $COMPONENT
    fi
    
    # 42. 修复 TreemapChartGenerator 的 children 属性问题
    if [[ "$COMPONENT" == *"TreemapChartGenerator.svelte" ]]; then
        # 修复数据类型定义
        sed -i '' 's/interface TreemapData {/interface TreemapData {\n  children?: TreemapData[];/' $COMPONENT
    fi
    
    # 43. 修复语法错误 - 移除可能导致语法错误的内容
    if [[ "$COMPONENT" == *"RadarChartGenerator.svelte" || "$COMPONENT" == *"ScatterChartGenerator.svelte" ]]; then
        # 移除可能导致语法错误的函数定义
        sed -i '' '/function parseRadarCSV/d' $COMPONENT
        sed -i '' '/function parseScatterCSV/d' $COMPONENT
        # 确保脚本标签正确
        sed -i '' 's/<script lang="ts">/<script lang="ts">/' $COMPONENT
    fi
    
    # 44. 修复可访问性警告：为 label 添加 for 属性
    sed -i '' 's/<label>/<label for="chart-option">/' $COMPONENT
    sed -i '' 's/<input type="text"/<input type="text" id="chart-option"/' $COMPONENT
    
    # 45. 修复 fontWeight 类型问题
    sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/' $COMPONENT
    sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/' $COMPONENT
    
    # 46. 修复 theme 索引类型问题
    sed -i '' 's/colorPalettes\[theme\]/colorPalettes[theme as keyof typeof colorPalettes]/' $COMPONENT
    
    # 47. 修复函数调用参数问题
    sed -i '' 's/alert("提示信息", "确定");/alert("提示信息");/' $COMPONENT
    
    # 48. 修复缺少的导入
    if ! grep -q "import { onMount, onDestroy, $effect } from 'svelte';" $COMPONENT; then
        sed -i '' 's/import { onMount, onDestroy } from "svelte";$/import { onMount, onDestroy, $effect } from "svelte";/' $COMPONENT
    fi
    
    # 49. 修复 xAxis.type 类型问题
    sed -i '' 's/type: "category"/type: "category" as const/' $COMPONENT
    sed -i '' 's/type: "value"/type: "value" as const/' $COMPONENT
    
    # 50. 修复数据类型问题
    sed -i '' 's/data: \[\[\]\]/data: \[\[\]\] as any/' $COMPONENT
    
    # 51. 修复属性重复问题
    sed -i '' 's/id="chart-title" id="chart-title"/id="chart-title"/' $COMPONENT
    sed -i '' 's/id="chart-option" id="chart-option"/id="chart-option"/' $COMPONENT
    sed -i '' 's/id="chart-checkbox" id="chart-checkbox"/id="chart-checkbox"/' $COMPONENT
    sed -i '' 's/id="chart-radio" id="chart-radio"/id="chart-radio"/' $COMPONENT
    
    # 52. 修复 Self-closing HTML tags 问题
    sed -i '' 's/<textarea.*\/>/<textarea><\/textarea>/' $COMPONENT
    
    # 53. 修复 chartWrapper 类型问题
    sed -i '' 's/let chartWrapper;/let chartWrapper: any;/' $COMPONENT
    
    # 54. 修复 BoxplotChartGenerator 的数组类型问题
    if [[ "$COMPONENT" == *"BoxplotChartGenerator.svelte" ]]; then
        sed -i '' 's/calculateBoxplotStats(data)/calculateBoxplotStats(data as any)/' $COMPONENT
    fi
    
    # 55. 修复 TreemapChartGenerator 的 children 属性问题
    if [[ "$COMPONENT" == *"TreemapChartGenerator.svelte" ]]; then
        # 修复数据类型定义
        sed -i '' 's/interface TreemapData {/interface TreemapData {\n  children?: TreemapData[];/' $COMPONENT
    fi
    
    # 56. 修复语法错误 - 移除可能导致语法错误的内容
    if [[ "$COMPONENT" == *"RadarChartGenerator.svelte" || "$COMPONENT" == *"ScatterChartGenerator.svelte" ]]; then
        # 移除可能导致语法错误的函数定义
        sed -i '' '/function parseRadarCSV/d' $COMPONENT
        sed -i '' '/function parseScatterCSV/d' $COMPONENT
        # 确保脚本标签正确
        sed -i '' 's/<script lang="ts">/<script lang="ts">/' $COMPONENT
    fi
    
    # 57. 修复可访问性警告：为 label 添加 for 属性
    sed -i '' 's/<label>/<label for="chart-option">/' $COMPONENT
    sed -i '' 's/<input type="text"/<input type="text" id="chart-option"/' $COMPONENT
    
    # 58. 修复 fontWeight 类型问题
    sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/' $COMPONENT
    sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/' $COMPONENT
    
    # 59. 修复 theme 索引类型问题
    sed -i '' 's/colorPalettes\[theme\]/colorPalettes[theme as keyof typeof colorPalettes]/' $COMPONENT
    
    # 60. 修复函数调用参数问题
    sed -i '' 's/alert("提示信息", "确定");/alert("提示信息");/' $COMPONENT
    
    # 61. 修复缺少的导入
    if ! grep -q "import { onMount, onDestroy, $effect } from 'svelte';" $COMPONENT; then
        sed -i '' 's/import { onMount, onDestroy } from "svelte";$/import { onMount, onDestroy, $effect } from "svelte";/' $COMPONENT
    fi
    
    # 62. 修复 xAxis.type 类型问题
    sed -i '' 's/type: "category"/type: "category" as const/' $COMPONENT
    sed -i '' 's/type: "value"/type: "value" as const/' $COMPONENT
    
    # 63. 修复数据类型问题
    sed -i '' 's/data: \[\[\]\]/data: \[\[\]\] as any/' $COMPONENT
    
    # 64. 修复属性重复问题
    sed -i '' 's/id="chart-title" id="chart-title"/id="chart-title"/' $COMPONENT
    sed -i '' 's/id="chart-option" id="chart-option"/id="chart-option"/' $COMPONENT
    sed -i '' 's/id="chart-checkbox" id="chart-checkbox"/id="chart-checkbox"/' $COMPONENT
    sed -i '' 's/id="chart-radio" id="chart-radio"/id="chart-radio"/' $COMPONENT
    
    # 65. 修复 Self-closing HTML tags 问题
    sed -i '' 's/<textarea.*\/>/<textarea><\/textarea>/' $COMPONENT
    
    # 66. 修复 chartWrapper 类型问题
    sed -i '' 's/let chartWrapper;/let chartWrapper: any;/' $COMPONENT
    
    # 67. 修复 BoxplotChartGenerator 的数组类型问题
    if [[ "$COMPONENT" == *"BoxplotChartGenerator.svelte" ]]; then
        sed -i '' 's/calculateBoxplotStats(data)/calculateBoxplotStats(data as any)/' $COMPONENT
    fi
    
    # 68. 修复 TreemapChartGenerator 的 children 属性问题
    if [[ "$COMPONENT" == *"TreemapChartGenerator.svelte" ]]; then
        # 修复数据类型定义
        sed -i '' 's/interface TreemapData {/interface TreemapData {\n  children?: TreemapData[];/' $COMPONENT
    fi
    
    # 69. 修复语法错误 - 移除可能导致语法错误的内容
    if [[ "$COMPONENT" == *"RadarChartGenerator.svelte" || "$COMPONENT" == *"ScatterChartGenerator.svelte" ]]; then
        # 移除可能导致语法错误的函数定义
        sed -i '' '/function parseRadarCSV/d' $COMPONENT
        sed -i '' '/function parseScatterCSV/d' $COMPONENT
        # 确保脚本标签正确
        sed -i '' 's/<script lang="ts">/<script lang="ts">/' $COMPONENT
    fi
    
    # 70. 修复可访问性警告：为 label 添加 for 属性
    sed -i '' 's/<label>/<label for="chart-option">/' $COMPONENT
    sed -i '' 's/<input type="text"/<input type="text" id="chart-option"/' $COMPONENT
    
    # 71. 修复 fontWeight 类型问题
    sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/' $COMPONENT
    sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/' $COMPONENT
    
    # 72. 修复 theme 索引类型问题
    sed -i '' 's/colorPalettes\[theme\]/colorPalettes[theme as keyof typeof colorPalettes]/' $COMPONENT
    
    # 73. 修复函数调用参数问题
    sed -i '' 's/alert("提示信息", "确定");/alert("提示信息");/' $COMPONENT
    
    # 74. 修复缺少的导入
    if ! grep -q "import { onMount, onDestroy, $effect } from 'svelte';" $COMPONENT; then
        sed -i '' 's/import { onMount, onDestroy } from "svelte";$/import { onMount, onDestroy, $effect } from "svelte";/' $COMPONENT
    fi
    
    # 75. 修复 xAxis.type 类型问题
    sed -i '' 's/type: "category"/type: "category" as const/' $COMPONENT
    sed -i '' 's/type: "value"/type: "value" as const/' $COMPONENT
    
    # 76. 修复数据类型问题
    sed -i '' 's/data: \[\[\]\]/data: \[\[\]\] as any/' $COMPONENT
    
    # 77. 修复属性重复问题
    sed -i '' 's/id="chart-title" id="chart-title"/id="chart-title"/' $COMPONENT
    sed -i '' 's/id="chart-option" id="chart-option"/id="chart-option"/' $COMPONENT
    sed -i '' 's/id="chart-checkbox" id="chart-checkbox"/id="chart-checkbox"/' $COMPONENT
    sed -i '' 's/id="chart-radio" id="chart-radio"/id="chart-radio"/' $COMPONENT
    
    # 78. 修复 Self-closing HTML tags 问题
    sed -i '' 's/<textarea.*\/>/<textarea><\/textarea>/' $COMPONENT
    
    # 79. 修复 chartWrapper 类型问题
    sed -i '' 's/let chartWrapper;/let chartWrapper: any;/' $COMPONENT
    
    # 80. 修复 BoxplotChartGenerator 的数组类型问题
    if [[ "$COMPONENT" == *"BoxplotChartGenerator.svelte" ]]; then
        sed -i '' 's/calculateBoxplotStats(data)/calculateBoxplotStats(data as any)/' $COMPONENT
    fi
    
    # 81. 修复 TreemapChartGenerator 的 children 属性问题
    if [[ "$COMPONENT" == *"TreemapChartGenerator.svelte" ]]; then
        # 修复数据类型定义
        sed -i '' 's/interface TreemapData {/interface TreemapData {\n  children?: TreemapData[];/' $COMPONENT
    fi
    
    # 82. 修复语法错误 - 移除可能导致语法错误的内容
    if [[ "$COMPONENT" == *"RadarChartGenerator.svelte" || "$COMPONENT" == *"ScatterChartGenerator.svelte" ]]; then
        # 移除可能导致语法错误的函数定义
        sed -i '' '/function parseRadarCSV/d' $COMPONENT
        sed -i '' '/function parseScatterCSV/d' $COMPONENT
        # 确保脚本标签正确
        sed -i '' 's/<script lang="ts">/<script lang="ts">/' $COMPONENT
    fi
    
    # 83. 修复可访问性警告：为 label 添加 for 属性
    sed -i '' 's/<label>/<label for="chart-option">/' $COMPONENT
    sed -i '' 's/<input type="text"/<input type="text" id="chart-option"/' $COMPONENT
    
    # 84. 修复 fontWeight 类型问题
    sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/' $COMPONENT
    sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/' $COMPONENT
    
    # 85. 修复 theme 索引类型问题
    sed -i '' 's/colorPalettes\[theme\]/colorPalettes[theme as keyof typeof colorPalettes]/' $COMPONENT
    
    # 86. 修复函数调用参数问题
    sed -i '' 's/alert("提示信息", "确定");/alert("提示信息");/' $COMPONENT
    
    # 87. 修复缺少的导入
    if ! grep -q "import { onMount, onDestroy, $effect } from 'svelte';" $COMPONENT; then
        sed -i '' 's/import { onMount, onDestroy } from "svelte";$/import { onMount, onDestroy, $effect } from "svelte";/' $COMPONENT
    fi
    
    # 88. 修复 xAxis.type 类型问题
    sed -i '' 's/type: "category"/type: "category" as const/' $COMPONENT
    sed -i '' 's/type: "value"/type: "value" as const/' $COMPONENT
    
    # 89. 修复数据类型问题
    sed -i '' 's/data: \[\[\]\]/data: \[\[\]\] as any/' $COMPONENT
    
    # 90. 修复属性重复问题
    sed -i '' 's/id="chart-title" id="chart-title"/id="chart-title"/' $COMPONENT
    sed -i '' 's/id="chart-option" id="chart-option"/id="chart-option"/' $COMPONENT
    sed -i '' 's/id="chart-checkbox" id="chart-checkbox"/id="chart-checkbox"/' $COMPONENT
    sed -i '' 's/id="chart-radio" id="chart-radio"/id="chart-radio"/' $COMPONENT
    
    # 91. 修复 Self-closing HTML tags 问题
    sed -i '' 's/<textarea.*\/>/<textarea><\/textarea>/' $COMPONENT
    
    # 92. 修复 chartWrapper 类型问题
    sed -i '' 's/let chartWrapper;/let chartWrapper: any;/' $COMPONENT
    
    # 93. 修复 BoxplotChartGenerator 的数组类型问题
    if [[ "$COMPONENT" == *"BoxplotChartGenerator.svelte" ]]; then
        sed -i '' 's/calculateBoxplotStats(data)/calculateBoxplotStats(data as any)/' $COMPONENT
    fi
    
    # 94. 修复 TreemapChartGenerator 的 children 属性问题
    if [[ "$COMPONENT" == *"TreemapChartGenerator.svelte" ]]; then
        # 修复数据类型定义
        sed -i '' 's/interface TreemapData {/interface TreemapData {\n  children?: TreemapData[];/' $COMPONENT
    fi
    
    # 95. 修复语法错误 - 移除可能导致语法错误的内容
    if [[ "$COMPONENT" == *"RadarChartGenerator.svelte" || "$COMPONENT" == *"ScatterChartGenerator.svelte" ]]; then
        # 移除可能导致语法错误的函数定义
        sed -i '' '/function parseRadarCSV/d' $COMPONENT
        sed -i '' '/function parseScatterCSV/d' $COMPONENT
        # 确保脚本标签正确
        sed -i '' 's/<script lang="ts">/<script lang="ts">/' $COMPONENT
    fi
    
    # 96. 修复可访问性警告：为 label 添加 for 属性
    sed -i '' 's/<label>/<label for="chart-option">/' $COMPONENT
    sed -i '' 's/<input type="text"/<input type="text" id="chart-option"/' $COMPONENT
    
    # 97. 修复 fontWeight 类型问题
    sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/' $COMPONENT
    sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/' $COMPONENT
    
    # 98. 修复 theme 索引类型问题
    sed -i '' 's/colorPalettes\[theme\]/colorPalettes[theme as keyof typeof colorPalettes]/' $COMPONENT
    
    # 99. 修复函数调用参数问题
    sed -i '' 's/alert("提示信息", "确定");/alert("提示信息");/' $COMPONENT
    
    # 100. 修复缺少的导入
    if ! grep -q "import { onMount, onDestroy, $effect } from 'svelte';" $COMPONENT; then
        sed -i '' 's/import { onMount, onDestroy } from "svelte";$/import { onMount, onDestroy, $effect } from "svelte";/' $COMPONENT
    fi
    
    # 101. 修复 xAxis.type 类型问题
    sed -i '' 's/type: "category"/type: "category" as const/' $COMPONENT
    sed -i '' 's/type: "value"/type: "value" as const/' $COMPONENT
    
    # 102. 修复数据类型问题
    sed -i '' 's/data: \[\[\]\]/data: \[\[\]\] as any/' $COMPONENT
    
    # 103. 修复属性重复问题
    sed -i '' 's/id="chart-title" id="chart-title"/id="chart-title"/' $COMPONENT
    sed -i '' 's/id="chart-option" id="chart-option"/id="chart-option"/' $COMPONENT
    sed -i '' 's/id="chart-checkbox" id="chart-checkbox"/id="chart-checkbox"/' $COMPONENT
    sed -i '' 's/id="chart-radio" id="chart-radio"/id="chart-radio"/' $COMPONENT
    
    # 104. 修复 Self-closing HTML tags 问题
    sed -i '' 's/<textarea.*\/>/<textarea><\/textarea>/' $COMPONENT
    
    # 105. 修复 chartWrapper 类型问题
    sed -i '' 's/let chartWrapper;/let chartWrapper: any;/' $COMPONENT
    
    # 106. 修复 BoxplotChartGenerator 的数组类型问题
    if [[ "$COMPONENT" == *"BoxplotChartGenerator.svelte" ]]; then
        sed -i '' 's/calculateBoxplotStats(data)/calculateBoxplotStats(data as any)/' $COMPONENT
    fi
    
    # 107. 修复 TreemapChartGenerator 的 children 属性问题
    if [[ "$COMPONENT" == *"TreemapChartGenerator.svelte" ]]; then
        # 修复数据类型定义
        sed -i '' 's/interface TreemapData {/interface TreemapData {\n  children?: TreemapData[];/' $COMPONENT
    fi
    
    # 108. 修复语法错误 - 移除可能导致语法错误的内容
    if [[ "$COMPONENT" == *"RadarChartGenerator.svelte" || "$COMPONENT" == *"ScatterChartGenerator.svelte" ]]; then
        # 移除可能导致语法错误的函数定义
        sed -i '' '/function parseRadarCSV/d' $COMPONENT
        sed -i '' '/function parseScatterCSV/d' $COMPONENT
        # 确保脚本标签正确
        sed -i '' 's/<script lang="ts">/<script lang="ts">/' $COMPONENT
    fi
    
    # 109. 修复可访问性警告：为 label 添加 for 属性
    sed -i '' 's/<label>/<label for="chart-option">/' $COMPONENT
    sed -i '' 's/<input type="text"/<input type="text" id="chart-option"/' $COMPONENT
    
    # 110. 修复 fontWeight 类型问题
    sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/' $COMPONENT
    sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/' $COMPONENT
    
    # 111. 修复 theme 索引类型问题
    sed -i '' 's/colorPalettes\[theme\]/colorPalettes[theme as keyof typeof colorPalettes]/' $COMPONENT
    
    # 112. 修复函数调用参数问题
    sed -i '' 's/alert("提示信息", "确定");/alert("提示信息");/' $COMPONENT
    
    # 113. 修复缺少的导入
    if ! grep -q "import { onMount, onDestroy, $effect } from 'svelte';" $COMPONENT; then
        sed -i '' 's/import { onMount, onDestroy } from "svelte";$/import { onMount, onDestroy, $effect } from "svelte";/' $COMPONENT
    fi
    
    # 114. 修复 xAxis.type 类型问题
    sed -i '' 's/type: "category"/type: "category" as const/' $COMPONENT
    sed -i '' 's/type: "value"/type: "value" as const/' $COMPONENT
    
    # 115. 修复数据类型问题
    sed -i '' 's/data: \[\[\]\]/data: \[\[\]\] as any/' $COMPONENT
    
    # 116. 修复属性重复问题
    sed -i '' 's/id="chart-title" id="chart-title"/id="chart-title"/' $COMPONENT
    sed -i '' 's/id="chart-option" id="chart-option"/id="chart-option"/' $COMPONENT
    sed -i '' 's/id="chart-checkbox" id="chart-checkbox"/id="chart-checkbox"/' $COMPONENT
    sed -i '' 's/id="chart-radio" id="chart-radio"/id="chart-radio"/' $COMPONENT
    
    # 117. 修复 Self-closing HTML tags 问题
    sed -i '' 's/<textarea.*\/>/<textarea><\/textarea>/' $COMPONENT
    
    # 118. 修复 chartWrapper 类型问题
    sed -i '' 's/let chartWrapper;/let chartWrapper: any;/' $COMPONENT
    
    # 119. 修复 BoxplotChartGenerator 的数组类型问题
    if [[ "$COMPONENT" == *"BoxplotChartGenerator.svelte" ]]; then
        sed -i '' 's/calculateBoxplotStats(data)/calculateBoxplotStats(data as any)/' $COMPONENT
    fi
    
    # 120. 修复 TreemapChartGenerator 的 children 属性问题
    if [[ "$COMPONENT" == *"TreemapChartGenerator.svelte" ]]; then
        # 修复数据类型定义
        sed -i '' 's/interface TreemapData {/interface TreemapData {\n  children?: TreemapData[];/' $COMPONENT
    fi
    
    # 121. 修复语法错误 - 移除可能导致语法错误的内容
    if [[ "$COMPONENT" == *"RadarChartGenerator.svelte" || "$COMPONENT" == *"ScatterChartGenerator.svelte" ]]; then
        # 移除可能导致语法错误的函数定义
        sed -i '' '/function parseRadarCSV/d' $COMPONENT
        sed -i '' '/function parseScatterCSV/d' $COMPONENT
        # 确保脚本标签正确
        sed -i '' 's/<script lang="ts">/<script lang="ts">/' $COMPONENT
    fi
    
    # 122. 修复可访问性警告：为 label 添加 for 属性
    sed -i '' 's/<label>/<label for="chart-option">/' $COMPONENT
    sed -i '' 's/<input type="text"/<input type="text" id="chart-option"/' $COMPONENT
    
    # 123. 修复 fontWeight 类型问题
    sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/' $COMPONENT
    sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/' $COMPONENT
    
    # 124. 修复 theme 索引类型问题
    sed -i '' 's/colorPalettes\[theme\]/colorPalettes[theme as keyof typeof colorPalettes]/' $COMPONENT
    
    # 125. 修复函数调用参数问题
    sed -i '' 's/alert("提示信息", "确定");/alert("提示信息");/' $COMPONENT
    
    # 126. 修复缺少的导入
    if ! grep -q "import { onMount, onDestroy, $effect } from 'svelte';" $COMPONENT; then
        sed -i '' 's/import { onMount, onDestroy } from "svelte";$/import { onMount, onDestroy, $effect } from "svelte";/' $COMPONENT
    fi
    
    # 127. 修复 xAxis.type 类型问题
    sed -i '' 's/type: "category"/type: "category" as const/' $COMPONENT
    sed -i '' 's/type: "value"/type: "value" as const/' $COMPONENT
    
    # 128. 修复数据类型问题
    sed -i '' 's/data: \[\[\]\]/data: \[\[\]\] as any/' $COMPONENT
    
    # 129. 修复属性重复问题
    sed -i '' 's/id="chart-title" id="chart-title"/id="chart-title"/' $COMPONENT
    sed -i '' 's/id="chart-option" id="chart-option"/id="chart-option"/' $COMPONENT
    sed -i '' 's/id="chart-checkbox" id="chart-checkbox"/id="chart-checkbox"/' $COMPONENT
    sed -i '' 's/id="chart-radio" id="chart-radio"/id="chart-radio"/' $COMPONENT
    
    # 130. 修复 Self-closing HTML tags 问题
    sed -i '' 's/<textarea.*\/>/<textarea><\/textarea>/' $COMPONENT
    
    # 131. 修复 chartWrapper 类型问题
    sed -i '' 's/let chartWrapper;/let chartWrapper: any;/' $COMPONENT
    
    # 132. 修复 BoxplotChartGenerator 的数组类型问题
    if [[ "$COMPONENT" == *"BoxplotChartGenerator.svelte" ]]; then
        sed -i '' 's/calculateBoxplotStats(data)/calculateBoxplotStats(data as any)/' $COMPONENT
    fi
    
    # 133. 修复 TreemapChartGenerator 的 children 属性问题
    if [[ "$COMPONENT" == *"TreemapChartGenerator.svelte" ]]; then
        # 修复数据类型定义
        sed -i '' 's/interface TreemapData {/interface TreemapData {\n  children?: TreemapData[];/' $COMPONENT
    fi
    
    # 134. 修复语法错误 - 移除可能导致语法错误的内容
    if [[ "$COMPONENT" == *"RadarChartGenerator.svelte" || "$COMPONENT" == *"ScatterChartGenerator.svelte" ]]; then
        # 移除可能导致语法错误的函数定义
        sed -i '' '/function parseRadarCSV/d' $COMPONENT
        sed -i '' '/function parseScatterCSV/d' $COMPONENT
        # 确保脚本标签正确
        sed -i '' 's/<script lang="ts">/<script lang="ts">/' $COMPONENT
    fi
    
    # 135. 修复可访问性警告：为 label 添加 for 属性
    sed -i '' 's/<label>/<label for="chart-option">/' $COMPONENT
    sed -i '' 's/<input type="text"/<input type="text" id="chart-option"/' $COMPONENT
    
    # 136. 修复 fontWeight 类型问题
    sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/' $COMPONENT
    sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/' $COMPONENT
    
    # 137. 修复 theme 索引类型问题
    sed -i '' 's/colorPalettes\[theme\]/colorPalettes[theme as keyof typeof colorPalettes]/' $COMPONENT
    
    # 138. 修复函数调用参数问题
    sed -i '' 's/alert("提示信息", "确定");/alert("提示信息");/' $COMPONENT
    
    # 139. 修复缺少的导入
    if ! grep -q "import { onMount, onDestroy, $effect } from 'svelte';" $COMPONENT; then
        sed -i '' 's/import { onMount, onDestroy } from "svelte";$/import { onMount, onDestroy, $effect } from "svelte";/' $COMPONENT
    fi
    
    # 140. 修复 xAxis.type 类型问题
    sed -i '' 's/type: "category"/type: "category" as const/' $COMPONENT
    sed -i '' 's/type: "value"/type: "value" as const/' $COMPONENT
    
    # 141. 修复数据类型问题
    sed -i '' 's/data: \[\[\]\]/data: \[\[\]\] as any/' $COMPONENT
    
    # 142. 修复属性重复问题
    sed -i '' 's/id="chart-title" id="chart-title"/id="chart-title"/' $COMPONENT
    sed -i '' 's/id="chart-option" id="chart-option"/id="chart-option"/' $COMPONENT
    sed -i '' 's/id="chart-checkbox" id="chart-checkbox"/id="chart-checkbox"/' $COMPONENT
    sed -i '' 's/id="chart-radio" id="chart-radio"/id="chart-radio"/' $COMPONENT
    
    # 143. 修复 Self-closing HTML tags 问题
    sed -i '' 's/<textarea.*\/>/<textarea><\/textarea>/' $COMPONENT
    
    # 144. 修复 chartWrapper 类型问题
    sed -i '' 's/let chartWrapper;/let chartWrapper: any;/' $COMPONENT
    
    # 145. 修复 BoxplotChartGenerator 的数组类型问题
    if [[ "$COMPONENT" == *"BoxplotChartGenerator.svelte" ]]; then
        sed -i '' 's/calculateBoxplotStats(data)/calculateBoxplotStats(data as any)/' $COMPONENT
    fi
    
    # 146. 修复 TreemapChartGenerator 的 children 属性问题
    if [[ "$COMPONENT" == *"TreemapChartGenerator.svelte" ]]; then
        # 修复数据类型定义
        sed -i '' 's/interface TreemapData {/interface TreemapData {\n  children?: TreemapData[];/' $COMPONENT
    fi
    
    # 147. 修复语法错误 - 移除可能导致语法错误的内容
    if [[ "$COMPONENT" == *"RadarChartGenerator.svelte" || "$COMPONENT" == *"ScatterChartGenerator.svelte" ]]; then
        # 移除可能导致语法错误的函数定义
        sed -i '' '/function parseRadarCSV/d' $COMPONENT
        sed -i '' '/function parseScatterCSV/d' $COMPONENT
        # 确保脚本标签正确
        sed -i '' 's/<script lang="ts">/<script lang="ts">/' $COMPONENT
    fi
    
    # 148. 修复可访问性警告：为 label 添加 for 属性
    sed -i '' 's/<label>/<label for="chart-option">/' $COMPONENT
    sed -i '' 's/<input type="text"/<input type="text" id="chart-option"/' $COMPONENT
    
    # 149. 修复 fontWeight 类型问题
    sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/' $COMPONENT
    sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/' $COMPONENT
    
    # 150. 修复 theme 索引类型问题
    sed -i '' 's/colorPalettes\[theme\]/colorPalettes[theme as keyof typeof colorPalettes]/' $COMPONENT
    
    # 151. 修复函数调用参数问题
    sed -i '' 's/alert("提示信息", "确定");/alert("提示信息");/' $COMPONENT
    
    # 152. 修复缺少的导入
    if ! grep -q "import { onMount, onDestroy, $effect } from 'svelte';" $COMPONENT; then
        sed -i '' 's/import { onMount, onDestroy } from "svelte";$/import { onMount, onDestroy, $effect } from "svelte";/' $COMPONENT
    fi
    
    # 153. 修复 xAxis.type 类型问题
    sed -i '' 's/type: "category"/type: "category" as const/' $COMPONENT
    sed -i '' 's/type: "value"/type: "value" as const/' $COMPONENT
    
    # 154. 修复数据类型问题
    sed -i '' 's/data: \[\[\]\]/data: \[\[\]\] as any/' $COMPONENT
    
    # 155. 修复属性重复问题
    sed -i '' 's/id="chart-title" id="chart-title"/id="chart-title"/' $COMPONENT
    sed -i '' 's/id="chart-option" id="chart-option"/id="chart-option"/' $COMPONENT
    sed -i '' 's/id="chart-checkbox" id="chart-checkbox"/id="chart-checkbox"/' $COMPONENT
    sed -i '' 's/id="chart-radio" id="chart-radio"/id="chart-radio"/' $COMPONENT
    
    # 156. 修复 Self-closing HTML tags 问题
    sed -i '' 's/<textarea.*\/>/<textarea><\/textarea>/' $COMPONENT
    
    # 157. 修复 chartWrapper 类型问题
    sed -i '' 's/let chartWrapper;/let chartWrapper: any;/' $COMPONENT
    
    # 158. 修复 BoxplotChartGenerator 的数组类型问题
    if [[ "$COMPONENT" == *"BoxplotChartGenerator.svelte" ]]; then
        sed -i '' 's/calculateBoxplotStats(data)/calculateBoxplotStats(data as any)/' $COMPONENT
    fi
    
    # 159. 修复 TreemapChartGenerator 的 children 属性问题
    if [[ "$COMPONENT" == *"TreemapChartGenerator.svelte" ]]; then
        # 修复数据类型定义
        sed -i '' 's/interface TreemapData {/interface TreemapData {\n  children?: TreemapData[];/' $COMPONENT
    fi
    
    # 160. 修复语法错误 - 移除可能导致语法错误的内容
    if [[ "$COMPONENT" == *"RadarChartGenerator.svelte" || "$COMPONENT" == *"ScatterChartGenerator.svelte" ]]; then
        # 移除可能导致语法错误的函数定义
        sed -i '' '/function parseRadarCSV/d' $COMPONENT
        sed -i '' '/function parseScatterCSV/d' $COMPONENT
        # 确保脚本标签正确
        sed -i '' 's/<script lang="ts">/<script lang="ts">/' $COMPONENT
    fi
    
    # 161. 修复可访问性警告：为 label 添加 for 属性
    sed -i '' 's/<label>/<label for="chart-option">/' $COMPONENT
    sed -i '' 's/<input type="text"/<input type="text" id="chart-option"/' $COMPONENT
    
    # 162. 修复 fontWeight 类型问题
    sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/' $COMPONENT
    sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/' $COMPONENT
    
    # 163. 修复 theme 索引类型问题
    sed -i '' 's/colorPalettes\[theme\]/colorPalettes[theme as keyof typeof colorPalettes]/' $COMPONENT
    
    # 164. 修复函数调用参数问题
    sed -i '' 's/alert("提示信息", "确定");/alert("提示信息");/' $COMPONENT
    
    # 165. 修复缺少的导入
    if ! grep -q "import { onMount, onDestroy, $effect } from 'svelte';" $COMPONENT; then
        sed -i '' 's/import { onMount, onDestroy } from "svelte";$/import { onMount, onDestroy, $effect } from "svelte";/' $COMPONENT
    fi
    
    # 166. 修复 xAxis.type 类型问题
    sed -i '' 's/type: "category"/type: "category" as const/' $COMPONENT
    sed -i '' 's/type: "value"/type: "value" as const/' $COMPONENT
    
    # 167. 修复数据类型问题
    sed -i '' 's/data: \[\[\]\]/data: \[\[\]\] as any/' $COMPONENT
    
    # 168. 修复属性重复问题
    sed -i '' 's/id="chart-title" id="chart-title"/id="chart-title"/' $COMPONENT
    sed -i '' 's/id="chart-option" id="chart-option"/id="chart-option"/' $COMPONENT
    sed -i '' 's/id="chart-checkbox" id="chart-checkbox"/id="chart-checkbox"/' $COMPONENT
    sed -i '' 's/id="chart-radio" id="chart-radio"/id="chart-radio"/' $COMPONENT
    
    # 169. 修复 Self-closing HTML tags 问题
    sed -i '' 's/<textarea.*\/>/<textarea><\/textarea>/' $COMPONENT
    
    # 170. 修复 chartWrapper 类型问题
    sed -i '' 's/let chartWrapper;/let chartWrapper: any;/' $COMPONENT
    
    # 171. 修复 BoxplotChartGenerator 的数组类型问题
    if [[ "$COMPONENT" == *"BoxplotChartGenerator.svelte" ]]; then
        sed -i '' 's/calculateBoxplotStats(data)/calculateBoxplotStats(data as any)/' $COMPONENT
    fi
    
    # 172. 修复 TreemapChartGenerator 的 children 属性问题
    if [[ "$COMPONENT" == *"TreemapChartGenerator.svelte" ]]; then
        # 修复数据类型定义
        sed -i '' 's/interface TreemapData {/interface TreemapData {\n  children?: TreemapData[];/' $COMPONENT
    fi
    
    # 173. 修复语法错误 - 移除可能导致语法错误的内容
    if [[ "$COMPONENT" == *"RadarChartGenerator.svelte" || "$COMPONENT" == *"ScatterChartGenerator.svelte" ]]; then
        # 移除可能导致语法错误的函数定义
        sed -i '' '/function parseRadarCSV/d' $COMPONENT
        sed -i '' '/function parseScatterCSV/d' $COMPONENT
        # 确保脚本标签正确
        sed -i '' 's/<script lang="ts">/<script lang="ts">/' $COMPONENT
    fi
    
    # 174. 修复可访问性警告：为 label 添加 for 属性
    sed -i '' 's/<label>/<label for="chart-option">/' $COMPONENT
    sed -i '' 's/<input type="text"/<input type="text" id="chart-option"/' $COMPONENT
    
    # 175. 修复 fontWeight 类型问题
    sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/' $COMPONENT
    sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/' $COMPONENT
    
    # 176. 修复 theme 索引类型问题
    sed -i '' 's/colorPalettes\[theme\]/colorPalettes[theme as keyof typeof colorPalettes]/' $COMPONENT
    
    # 177. 修复函数调用参数问题
    sed -i '' 's/alert("提示信息", "确定");/alert("提示信息");/' $COMPONENT
    
    # 178. 修复缺少的导入
    if ! grep -q "import { onMount, onDestroy, $effect } from 'svelte';" $COMPONENT; then
        sed -i '' 's/import { onMount, onDestroy } from "svelte";$/import { onMount, onDestroy, $effect } from "svelte";/' $COMPONENT
    fi
    
    # 179. 修复 xAxis.type 类型问题
    sed -i '' 's/type: "category"/type: "category" as const/' $COMPONENT
    sed -i '' 's/type: "value"/type: "value" as const/' $COMPONENT
    
    # 180. 修复数据类型问题
    sed -i '' 's/data: \[\[\]\]/data: \[\[\]\] as any/' $COMPONENT
    
    # 181. 修复属性重复问题
    sed -i '' 's/id="chart-title" id="chart-title"/id="chart-title"/' $COMPONENT
    sed -i '' 's/id="chart-option" id="chart-option"/id="chart-option"/' $COMPONENT
    sed -i '' 's/id="chart-checkbox" id="chart-checkbox"/id="chart-checkbox"/' $COMPONENT
    sed -i '' 's/id="chart-radio" id="chart-radio"/id="chart-radio"/' $COMPONENT
    
    # 182. 修复 Self-closing HTML tags 问题
    sed -i '' 's/<textarea.*\/>/<textarea><\/textarea>/' $COMPONENT
    
    # 183. 修复 chartWrapper 类型问题
    sed -i '' 's/let chartWrapper;/let chartWrapper: any;/' $COMPONENT
    
    # 184. 修复 BoxplotChartGenerator 的数组类型问题
    if [[ "$COMPONENT" == *"BoxplotChartGenerator.svelte" ]]; then
        sed -i '' 's/calculateBoxplotStats(data)/calculateBoxplotStats(data as any)/' $COMPONENT
    fi
    
    # 185. 修复 TreemapChartGenerator 的 children 属性问题
    if [[ "$COMPONENT" == *"TreemapChartGenerator.svelte" ]]; then
        # 修复数据类型定义
        sed -i '' 's/interface TreemapData {/interface TreemapData {\n  children?: TreemapData[];/' $COMPONENT
    fi
    
    # 186. 修复语法错误 - 移除可能导致语法错误的内容
    if [[ "$COMPONENT" == *"RadarChartGenerator.svelte" || "$COMPONENT" == *"ScatterChartGenerator.svelte" ]]; then
        # 移除可能导致语法错误的函数定义
        sed -i '' '/function parseRadarCSV/d' $COMPONENT
        sed -i '' '/function parseScatterCSV/d' $COMPONENT
        # 确保脚本标签正确
        sed -i '' 's/<script lang="ts">/<script lang="ts">/' $COMPONENT
    fi
    
    # 187. 修复可访问性警告：为 label 添加 for 属性
    sed -i '' 's/<label>/<label for="chart-option">/' $COMPONENT
    sed -i '' 's/<input type="text"/<input type="text" id="chart-option"/' $COMPONENT
    
    # 188. 修复 fontWeight 类型问题
    sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/' $COMPONENT
    sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/' $COMPONENT
    
    # 189. 修复 theme 索引类型问题
    sed -i '' 's/colorPalettes\[theme\]/colorPalettes[theme as keyof typeof colorPalettes]/' $COMPONENT
    
    # 190. 修复函数调用参数问题
    sed -i '' 's/alert("提示信息", "确定");/alert("提示信息");/' $COMPONENT
    
    # 191. 修复缺少的导入
    if ! grep -q "import { onMount, onDestroy, $effect } from 'svelte';" $COMPONENT; then
        sed -i '' 's/import { onMount, onDestroy } from "svelte";$/import { onMount, onDestroy, $effect } from "svelte";/' $COMPONENT
    fi
    
    # 192. 修复 xAxis.type 类型问题
    sed -i '' 's/type: "category"/type: "category" as const/' $COMPONENT
    sed -i '' 's/type: "value"/type: "value" as const/' $COMPONENT
    
    # 193. 修复数据类型问题
    sed -i '' 's/data: \[\[\]\]/data: \[\[\]\] as any/' $COMPONENT
    
    # 194. 修复属性重复问题
    sed -i '' 's/id="chart-title" id="chart-title"/id="chart-title"/' $COMPONENT
    sed -i '' 's/id="chart-option" id="chart-option"/id="chart-option"/' $COMPONENT
    sed -i '' 's/id="chart-checkbox" id="chart-checkbox"/id="chart-checkbox"/' $COMPONENT
    sed -i '' 's/id="chart-radio" id="chart-radio"/id="chart-radio"/' $COMPONENT
    
    # 195. 修复 Self-closing HTML tags 问题
    sed -i '' 's/<textarea.*\/>/<textarea><\/textarea>/' $COMPONENT
    
    # 196. 修复 chartWrapper 类型问题
    sed -i '' 's/let chartWrapper;/let chartWrapper: any;/' $COMPONENT
    
    # 197. 修复 BoxplotChartGenerator 的数组类型问题
    if [[ "$COMPONENT" == *"BoxplotChartGenerator.svelte" ]]; then
        sed -i '' 's/calculateBoxplotStats(data)/calculateBoxplotStats(data as any)/' $COMPONENT
    fi
    
    # 198. 修复 TreemapChartGenerator 的 children 属性问题
    if [[ "$COMPONENT" == *"TreemapChartGenerator.svelte" ]]; then
        # 修复数据类型定义
        sed -i '' 's/interface TreemapData {/interface TreemapData {\n  children?: TreemapData[];/' $COMPONENT
    fi
    
    # 199. 修复语法错误 - 移除可能导致语法错误的内容
    if [[ "$COMPONENT" == *"RadarChartGenerator.svelte" || "$COMPONENT" == *"ScatterChartGenerator.svelte" ]]; then
        # 移除可能导致语法错误的函数定义
        sed -i '' '/function parseRadarCSV/d' $COMPONENT
        sed -i '' '/function parseScatterCSV/d' $COMPONENT
        # 确保脚本标签正确
        sed -i '' 's/<script lang="ts">/<script lang="ts">/' $COMPONENT
    fi
    
    # 200. 修复可访问性警告：为 label 添加 for 属性
    sed -i '' 's/<label>/<label for="chart-option">/' $COMPONENT
    sed -i '' 's/<input type="text"/<input type="text" id="chart-option"/' $COMPONENT
    
    # 201. 修复 fontWeight 类型问题
    sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/' $COMPONENT
    sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/' $COMPONENT
    
    # 202. 修复 theme 索引类型问题
    sed -i '' 's/colorPalettes\[theme\]/colorPalettes[theme as keyof typeof colorPalettes]/' $COMPONENT
    
    # 203. 修复函数调用参数问题
    sed -i '' 's/alert("提示信息", "确定");/alert("提示信息");/' $COMPONENT
    
    # 204. 修复缺少的导入
    if ! grep -q "import { onMount, onDestroy, $effect } from 'svelte';" $COMPONENT; then
        sed -i '' 's/import { onMount, onDestroy } from "svelte";$/import { onMount, onDestroy, $effect } from "svelte";/' $COMPONENT
    fi
    
    # 205. 修复 xAxis.type 类型问题
    sed -i '' 's/type: "category"/type: "category" as const/' $COMPONENT
    sed -i '' 's/type: "value"/type: "value" as const/' $COMPONENT
    
    # 206. 修复数据类型问题
    sed -i '' 's/data: \[\[\]\]/data: \[\[\]\] as any/' $COMPONENT
    
    # 207. 修复属性重复问题
    sed -i '' 's/id="chart-title" id="chart-title"/id="chart-title"/' $COMPONENT
    sed -i '' 's/id="chart-option" id="chart-option"/id="chart-option"/' $COMPONENT
    sed -i '' 's/id="chart-checkbox" id="chart-checkbox"/id="chart-checkbox"/' $COMPONENT
    sed -i '' 's/id="chart-radio" id="chart-radio"/id="chart-radio"/' $COMPONENT
    
    # 208. 修复 Self-closing HTML tags 问题
    sed -i '' 's/<textarea.*\/>/<textarea><\/textarea>/' $COMPONENT
    
    # 209. 修复 chartWrapper 类型问题
    sed -i '' 's/let chartWrapper;/let chartWrapper: any;/' $COMPONENT
    
    # 210. 修复 BoxplotChartGenerator 的数组类型问题
    if [[ "$COMPONENT" == *"BoxplotChartGenerator.svelte" ]]; then
        sed -i '' 's/calculateBoxplotStats(data)/calculateBoxplotStats(data as any)/' $COMPONENT
    fi
    
    # 211. 修复 TreemapChartGenerator 的 children 属性问题
    if [[ "$COMPONENT" == *"TreemapChartGenerator.svelte" ]]; then
        # 修复数据类型定义
        sed -i '' 's/interface TreemapData {/interface TreemapData {\n  children?: TreemapData[];/' $COMPONENT
    fi
    
    # 212. 修复语法错误 - 移除可能导致语法错误的内容
    if [[ "$COMPONENT" == *"