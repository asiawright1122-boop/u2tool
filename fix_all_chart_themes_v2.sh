#!/bin/bash

# 批量修复所有图表组件中的 chartTheme 定义位置问题

for file in /Users/kaka/Dev/u2tool/src/components/tools/*ChartGenerator.svelte; do
    get_chart_line=$(grep -n "function getChartOption" "$file" | head -1 | cut -d: -f1)
    theme_line=$(grep -n "const chartTheme = useChartTheme()" "$file" | head -1 | cut -d: -f1)
    
    if [ -n "$get_chart_line" ] && [ -n "$theme_line" ] && [ "$get_chart_line" -lt "$theme_line" ]; then
        echo "Fixing $file..."
        
        # 找到 getChartOption 函数的前一行
        prev_line=$((get_chart_line - 1))
        
        # 检查在 getChartOption 之前是否已经有 chartTheme 定义
        if ! sed -n "1,${prev_line}p" "$file" | grep -q "const chartTheme = useChartTheme()"; then
            # 在 getChartOption 之前插入 chartTheme
            sed -i '' "${prev_line}a\\
\\
  const chartTheme = useChartTheme();
" "$file"
            echo "Added chartTheme before getChartOption"
        fi
        
        # 删除重复的 chartTheme 定义（只保留第一个）
        # 使用 awk 来删除重复行
        awk '
            /const chartTheme = useChartTheme\(\)/ {
                if (!seen) {
                    print
                    seen = 1
                }
                next
            }
            { print }
        ' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
        echo "Removed duplicate chartTheme definitions"
        
        echo "Fixed $file"
    fi
done

echo "All done!"
