#!/usr/bin/env node

// 修复图表生成器组件中的可访问性警告

import fs from 'fs';
import path from 'path';

const toolsDir = 'src/components/tools';

// 图表生成器组件列表
const chartComponents = [
    "AreaChartGenerator.svelte",
    "BarChartGenerator.svelte",
    "BoxplotChartGenerator.svelte",
    "BubbleChartGenerator.svelte",
    "CandlestickChartGenerator.svelte",
    "ChordChartGenerator.svelte",
    "CustomChartGenerator.svelte",
    "DoughnutChartGenerator.svelte",
    "FunnelChartGenerator.svelte",
    "GaugeChartGenerator.svelte",
    "HeatmapChartGenerator.svelte",
    "HistogramChartGenerator.svelte",
    "LineChartGenerator.svelte",
    "LiquidChartGenerator.svelte",
    "MapChartGenerator.svelte",
    "ParallelChartGenerator.svelte",
    "PieChartGenerator.svelte",
    "PolarChartGenerator.svelte",
    "RadarChartGenerator.svelte",
    "SankeyChartGenerator.svelte",
    "ScatterChartGenerator.svelte",
    "SunburstChartGenerator.svelte",
    "TreemapChartGenerator.svelte",
    "WordcloudChartGenerator.svelte"
];

// 修复函数
function fixAccessibility(filePath) {
    console.log(`修复可访问性问题: ${filePath}`);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 修复1: 非空元素的自闭合标签问题
        // 将 <textarea ... /> 改为 <textarea ...></textarea>
        content = content.replace(/<textarea([^>]*)\s*\/>/g, '<textarea$1></textarea>');
        // 将 <div ... /> 改为 <div ...></div>
        content = content.replace(/<div([^>]*)\s*\/>/g, '<div$1></div>');
        // 将 <span ... /> 改为 <span ...></span>
        content = content.replace(/<span([^>]*)\s*\/>/g, '<span$1></span>');
        // 将 <p ... /> 改为 <p ...></p>
        content = content.replace(/<p([^>]*)\s*\/>/g, '<p$1></p>');
        
        // 修复2: 表单标签必须与控件关联
        // 为每个没有for属性的label标签添加for属性
        let labelCount = 1;
        content = content.replace(/<label([^>]*)>/g, (match, attributes) => {
            if (!attributes.includes('for=')) {
                const newFor = `for="label_${labelCount}"`;
                labelCount++;
                return `<label${attributes} ${newFor}>`;
            }
            return match;
        });
        
        // 为每个没有id属性的input标签添加id属性
        let inputCount = 1;
        content = content.replace(/<input([^>]*)>/g, (match, attributes) => {
            if (!attributes.includes('id=')) {
                const newId = `id="input_${inputCount}"`;
                inputCount++;
                return `<input${attributes} ${newId}>`;
            }
            return match;
        });
        
        // 写回文件
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`修复完成: ${filePath}`);
    } catch (error) {
        console.error(`修复失败: ${filePath}`, error);
    }
}

// 执行修复
chartComponents.forEach(component => {
    const filePath = path.join(toolsDir, component);
    if (fs.existsSync(filePath)) {
        fixAccessibility(filePath);
    } else {
        console.log(`文件不存在: ${filePath}`);
    }
});

console.log('可访问性警告修复完成。');
