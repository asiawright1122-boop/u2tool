#!/bin/bash

for file in /Users/kaka/Dev/u2tool/src/components/tools/*ChartGenerator.svelte; do
    get_chart_line=$(grep -n "function getChartOption" "$file" | head -1 | cut -d: -f1)
    theme_line=$(grep -n "const chartTheme = useChartTheme()" "$file" | head -1 | cut -d: -f1)
    
    if [ -n "$get_chart_line" ] && [ -n "$theme_line" ] && [ "$get_chart_line" -lt "$theme_line" ]; then
        echo "Fixing $file..."
        
        # Find the line before getChartOption function
        prev_line=$((get_chart_line - 1))
        
        # Check if there's already a chartTheme definition before getChartOption
        if ! sed -n "1,${prev_line}p" "$file" | grep -q "const chartTheme = useChartTheme()"; then
            # Insert chartTheme before getChartOption
            sed -i '' "${prev_line}a\\
\\
  const chartTheme = useChartTheme();
" "$file"
            echo "Added chartTheme at line $((prev_line + 1))"
        fi
        
        # Remove duplicate chartTheme definitions (keep only the first one)
        # Use a more reliable method to remove duplicates
        awk '/const chartTheme = useChartTheme\(\)/ { if (!seen++) print; next } { print }' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
        echo "Removed duplicate chartTheme definitions"
        
        echo "Fixed $file"
    fi
done

echo "Done!"
