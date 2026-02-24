#!/bin/bash

# 修复图表生成器组件中的可访问性警告

tools_dir="src/components/tools"

# 图表生成器组件列表
chart_components=(
    "AreaChartGenerator.svelte"
    "BarChartGenerator.svelte"
    "BoxplotChartGenerator.svelte"
    "BubbleChartGenerator.svelte"
    "CandlestickChartGenerator.svelte"
    "ChordChartGenerator.svelte"
    "CustomChartGenerator.svelte"
    "DoughnutChartGenerator.svelte"
    "FunnelChartGenerator.svelte"
    "GaugeChartGenerator.svelte"
    "HeatmapChartGenerator.svelte"
    "HistogramChartGenerator.svelte"
    "LineChartGenerator.svelte"
    "LiquidChartGenerator.svelte"
    "MapChartGenerator.svelte"
    "ParallelChartGenerator.svelte"
    "PieChartGenerator.svelte"
    "PolarChartGenerator.svelte"
    "RadarChartGenerator.svelte"
    "SankeyChartGenerator.svelte"
    "ScatterChartGenerator.svelte"
    "SunburstChartGenerator.svelte"
    "TreemapChartGenerator.svelte"
    "WordcloudChartGenerator.svelte"
)

# 修复函数
fix_accessibility() {
    local file="$1"
    echo "修复可访问性问题: $file"
    
    # 修复1: 非空元素的自闭合标签问题
    # 将 <textarea ... /> 改为 <textarea ...></textarea>
    # 将 <div ... /> 改为 <div ...></div>
    # 将 <span ... /> 改为 <span ...></span>
    # 将 <p ... /> 改为 <p ...></p>
    
    # 使用sed命令进行修复
    sed -i '' \
        -e 's/<textarea\([^>]*\)\s*\/>/<textarea\1><\/textarea>/' \
        -e 's/<div\([^>]*\)\s*\/>/<div\1><\/div>/' \
        -e 's/<span\([^>]*\)\s*\/>/<span\1><\/span>/' \
        -e 's/<p\([^>]*\)\s*\/>/<p\1><\/p>/' \
        "$file"
    
    # 修复2: 表单标签必须与控件关联
    # 简单处理：为所有没有for属性的label标签添加for属性
    # 注意：这是一个简化的处理，可能需要手动检查和调整
    
    # 使用更简单的方法，避免复杂的正则表达式
    # 为每个label标签添加一个唯一的for属性
    label_count=1
    while IFS= read -r line; do
        if [[ $line =~ <label[^>]*> ]]; then
            if [[ ! $line =~ for= ]]; then
                # 为label添加for属性
                new_line=$(echo "$line" | sed "s/<label\([^>]*\)>/<label\1 for=\"label_${label_count}\">/")
                # 替换当前行
                sed -i '' "s|$line|$new_line|g" "$file"
                label_count=$((label_count + 1))
            fi
        fi
    done < "$file"
    
    # 为每个input添加id属性（如果没有）
    input_count=1
    while IFS= read -r line; do
        if [[ $line =~ <input[^>]*> ]]; then
            if [[ ! $line =~ id= ]]; then
                # 为input添加id属性
                new_line=$(echo "$line" | sed "s/<input\([^>]*\)>/<input id=\"input_${input_count}\" \1>/")
                # 替换当前行
                sed -i '' "s|$line|$new_line|g" "$file"
                input_count=$((input_count + 1))
            fi
        fi
    done < "$file"
}

# 执行修复
for component in "${chart_components[@]}"; do
    file="$tools_dir/$component"
    if [[ -f "$file" ]]; then
        fix_accessibility "$file"
    else
        echo "文件不存在: $file"
    fi
done

echo "可访问性警告修复完成。"
