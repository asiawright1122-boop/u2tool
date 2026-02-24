#!/bin/bash

# 批量修复脚本：修复所有图表生成器组件中的TypeScript错误和可访问性警告

echo "开始修复图表生成器组件中的问题..."

# 获取所有图表生成器组件
CHART_COMPONENTS=$(ls src/components/tools/*ChartGenerator.svelte)

# 修复每个组件
for COMPONENT in $CHART_COMPONENTS; do
    echo "修复 $COMPONENT..."
    
    # 1. 修复 Object is of type 'unknown' 问题
    sed -i '' 's/const { theme } = $props();/const { theme = "default" } = $props<{ theme: string }>();/' $COMPONENT
    
    # 2. 修复 Element implicitly has an 'any' type 问题（theme 索引）
    sed -i '' 's/colorPalettes\[theme\]/colorPalettes[theme as keyof typeof colorPalettes]/' $COMPONENT
    
    # 3. 修复 Property 'getEchartsInstance' does not exist on type 'never' 问题
    sed -i '' 's/let chartWrapper;/let chartWrapper: any;/' $COMPONENT
    
    # 4. 修复 HTMLInputElement.value 访问问题
    sed -i '' 's/HTMLInputElement.value/string/' $COMPONENT
    
    # 5. 修复 fontWeight 类型兼容性问题
    sed -i '' 's/fontWeight: "bold"/fontWeight: "bold" as const/' $COMPONENT
    sed -i '' 's/fontWeight: "normal"/fontWeight: "normal" as const/' $COMPONENT
    
    # 6. 修复可访问性警告：为 label 添加 for 属性
    sed -i '' 's/<label>/<label for="chart-title">/' $COMPONENT
    sed -i '' 's/<input type="text" id="title"/<input type="text" id="chart-title"/' $COMPONENT
    
    # 7. 修复 Self-closing HTML tags 问题
    sed -i '' 's/<textarea.*\/>/<textarea><\/textarea>/' $COMPONENT
    
    # 8. 修复 useEffect 引用问题
    sed -i '' 's/useEffect/$effect/' $COMPONENT
    
done

echo "所有图表生成器组件修复完成！"
echo "运行 TypeScript 检查验证修复效果..."

# 运行 TypeScript 检查
npm run check

echo "修复脚本执行完成。"
