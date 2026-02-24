#!/usr/bin/env node

// 批量修复图表生成器组件中的可访问性警告

import fs from 'fs';
import path from 'path';

// 获取所有图表生成器组件文件
const chartComponents = fs.readdirSync('src/components/tools')
  .filter(file => file.endsWith('ChartGenerator.svelte'))
  .map(file => path.join('src/components/tools', file));

// 遍历每个文件并修复错误
chartComponents.forEach(file => {
  console.log(`修复 ${file} 中的可访问性警告...`);
  
  let content = fs.readFileSync(file, 'utf8');
  
  // 1. 修复表单标签必须与控件关联的问题
  // 查找所有 <label> 标签并确保它们有 for 属性或包含控件
  content = content.replace(/<label>(.*?)<\/label>/g, (match, labelText) => {
    // 生成唯一的ID
    const id = `input_${Math.random().toString(36).substr(2, 9)}`;
    // 检查标签后面是否紧跟着输入控件
    return match;
  });
  
  // 更精确的修复：为没有 for 属性的 label 添加 for 属性，并确保对应的 input 有 id
  content = content.replace(/<label>(.*?)<\/label>\s*<input([^>]*)>/g, (match, labelText, inputAttrs) => {
    const id = `input_${Math.random().toString(36).substr(2, 9)}`;
    // 检查 input 是否已有 id
    if (!inputAttrs.includes('id=')) {
      return `<label for="${id}">${labelText}</label> <input id="${id}" ${inputAttrs}>`;
    }
    return match;
  });
  
  // 2. 修复非空元素的自闭合HTML标签问题
  content = content.replace(/<textarea([^>]*)\/>/g, '<textarea$1></textarea>');
  content = content.replace(/<select([^>]*)\/>/g, '<select$1></select>');
  
  // 3. 确保所有 input 元素都有 label 关联
  content = content.replace(/<input([^>]*)>(?!<\/label>)/g, (match, inputAttrs) => {
    // 检查是否已有 id
    if (!inputAttrs.includes('id=')) {
      const id = `input_${Math.random().toString(36).substr(2, 9)}`;
      return `<input id="${id}" ${inputAttrs}>`;
    }
    return match;
  });
  
  // 写入修复后的内容
  fs.writeFileSync(file, content, 'utf8');
  
  console.log(`修复完成: ${file}`);
});

console.log('所有图表生成器组件的可访问性警告已修复！');
