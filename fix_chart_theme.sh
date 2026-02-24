#!/bin/bash

for file in /Users/kaka/Dev/u2tool/src/components/tools/*ChartGenerator.svelte; do
    get_chart_line=$(grep -n "function getChartOption" "$file" | head -1 | cut -d: -f1)
    theme_line=$(grep -n "const chartTheme = useChartTheme()" "$file" | head -1 | cut -d: -f1)
    
    if [ -n "$get_chart_line" ] && [ -n "$theme_line" ] && [ "$get_chart_line" -lt "$theme_line" ]; then
        echo "Fixing $file..."
        
        # Find the line before getChartOption function
        prev_line=$((get_chart_line - 1))
        
        # Insert chartTheme before getChartOption
        sed -i '' "${prev_line}a\\
  const chartTheme = useChartTheme();
" "$file"
        
        # Remove the duplicate chartTheme definition
        sed -i '' "/^  const chartTheme = useChartTheme();$/d" "$file"
        
        # Re-add chartTheme before getChartOption if it was removed
        if ! grep -q "const chartTheme = useChartTheme()" "$file"; then
            sed -i '' "${prev_line}a\\
  const chartTheme = useChartTheme();
" "$file"
        fi
        
        echo "Fixed $file"
    fi
done

echo "Done!"
