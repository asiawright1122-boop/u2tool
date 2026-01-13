# 颜色格式转换指南：HEX、RGB、HSL 等详解

理解颜色格式对于 Web 开发者和设计师至关重要。本指南详细解释不同的颜色模型、何时使用每种格式，以及如何在它们之间转换。

## 颜色模型概述

### RGB（红、绿、蓝）

最常见的数字颜色模型，基于加色混合：

```
格式：rgb(红, 绿, 蓝)
范围：每个通道 0-255
示例：rgb(255, 99, 71) - 番茄红
```

**工作原理**：组合红、绿、蓝光。值越高 = 颜色越亮。

```
rgb(255, 0, 0)     = 纯红
rgb(0, 255, 0)     = 纯绿
rgb(0, 0, 255)     = 纯蓝
rgb(255, 255, 255) = 白色
rgb(0, 0, 0)       = 黑色
```

### RGBA（RGB + 透明度）

带透明度的 RGB：

```
格式：rgba(红, 绿, 蓝, 透明度)
透明度范围：0（完全透明）到 1（完全不透明）
示例：rgba(255, 99, 71, 0.5) - 50% 透明的番茄红
```

### HEX（十六进制）

RGB 的紧凑表示：

```
格式：#RRGGBB 或 #RGB（简写）
范围：00-FF（十六进制的 0-255）
示例：#FF6347 - 番茄红
```

**从 RGB 转换**：
```
RGB(255, 99, 71)
255 = FF, 99 = 63, 71 = 47
HEX = #FF6347
```

**简写**：当成对相同时，使用 3 位数字：
```
#FF6600 = #F60
#AABBCC = #ABC
```

### 带透明度的 HEX

8 位十六进制包含透明度：

```
格式：#RRGGBBAA
示例：#FF634780 - 50% 透明的番茄红
```

### HSL（色相、饱和度、亮度）

对人类更直观：

```
格式：hsl(色相, 饱和度%, 亮度%)
色相：0-360（色轮度数）
饱和度：0-100%（灰色到鲜艳）
亮度：0-100%（黑色到白色）
示例：hsl(9, 100%, 64%) - 番茄红
```

**色轮位置**：
```
0°/360° = 红色
60°  = 黄色
120° = 绿色
180° = 青色
240° = 蓝色
300° = 品红
```

### HSLA（HSL + 透明度）

带透明度的 HSL：

```
格式：hsla(色相, 饱和度%, 亮度%, 透明度)
示例：hsla(9, 100%, 64%, 0.5) - 50% 透明的番茄红
```

### HSV/HSB（色相、饱和度、明度/亮度）

设计软件中常见：

```
格式：hsv(色相, 饱和度%, 明度%)
与 HSL 类似但亮度计算不同
用于：Photoshop、Illustrator
```

### CMYK（青、品红、黄、黑）

用于印刷设计：

```
格式：cmyk(青%, 品红%, 黄%, 黑%)
示例：cmyk(0%, 61%, 72%, 0%) - 番茄红
```

**注意**：CMYK 是减色（基于油墨），RGB 是加色（基于光）。屏幕和印刷品上的颜色可能看起来不同。

## 何时使用每种格式

| 格式 | 最适合 | 优点 | 缺点 |
|------|--------|------|------|
| HEX | CSS、网页设计 | 紧凑、广泛支持 | 难以阅读/修改 |
| RGB | 程序化颜色操作 | 易于数学运算 | 不直观 |
| HSL | 创建配色方案 | 直观调整 | 不太常见 |
| CMYK | 印刷设计 | 准确的印刷颜色 | 不适用于网页 |

### 使用场景

**HEX**：
- CSS 样式表
- 设计规范
- 品牌指南

**RGB/RGBA**：
- JavaScript 颜色操作
- Canvas 绘图
- 动态颜色生成

**HSL/HSLA**：
- 创建颜色变体
- 无障碍调整
- 主题生成

## 颜色转换公式

### RGB 转 HEX

```javascript
function rgbToHex(r, g, b) {
  return '#' + [r, g, b]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

rgbToHex(255, 99, 71); // "#ff6347"
```

### HEX 转 RGB

```javascript
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

hexToRgb("#ff6347"); // { r: 255, g: 99, b: 71 }
```

### RGB 转 HSL

```javascript
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
```

## 使用 HSL 创建配色方案

HSL 使创建和谐的配色方案变得容易：

### 互补色

色轮上相对的颜色（相差 180°）：

```css
:root {
  --primary: hsl(200, 70%, 50%);      /* 蓝色 */
  --complement: hsl(20, 70%, 50%);    /* 橙色 (200 + 180 = 380 - 360 = 20) */
}
```

### 类似色

色轮上相邻的颜色（相差 30°）：

```css
:root {
  --color1: hsl(200, 70%, 50%);  /* 蓝色 */
  --color2: hsl(230, 70%, 50%);  /* 蓝紫色 */
  --color3: hsl(170, 70%, 50%);  /* 青色 */
}
```

### 三等分色

均匀分布（相差 120°）：

```css
:root {
  --color1: hsl(0, 70%, 50%);    /* 红色 */
  --color2: hsl(120, 70%, 50%);  /* 绿色 */
  --color3: hsl(240, 70%, 50%);  /* 蓝色 */
}
```

### 亮度变体

创建深浅色调：

```css
:root {
  --primary-100: hsl(200, 70%, 90%);  /* 最浅 */
  --primary-300: hsl(200, 70%, 70%);
  --primary-500: hsl(200, 70%, 50%);  /* 基础 */
  --primary-700: hsl(200, 70%, 30%);
  --primary-900: hsl(200, 70%, 10%);  /* 最深 */
}
```

## 颜色无障碍

### 对比度（WCAG）

| 级别 | 正常文本 | 大文本 |
|------|----------|--------|
| AA | 4.5:1 | 3:1 |
| AAA | 7:1 | 4.5:1 |

### 计算对比度

```javascript
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1, color2) {
  const l1 = getLuminance(...color1);
  const l2 = getLuminance(...color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
```

### 色盲考虑

- **不要仅依赖颜色**传达信息
- 在颜色旁边使用图案、标签或图标
- 使用色盲模拟器测试
- 常见类型：红色盲、绿色盲、蓝色盲

## 推荐工具

### U2Tool 颜色转换器

[U2Tool 颜色转换器](https://www.u2tool.com/zh/tools/color-converter) 提供：

- ✅ HEX、RGB、HSL、HSV、CMYK 之间转换
- ✅ 实时颜色预览
- ✅ 一键复制任何格式
- ✅ 颜色选择器工具
- ✅ 完全在浏览器中运行

### 使用方法

1. 访问 [颜色转换器](https://www.u2tool.com/zh/tools/color-converter)
2. 以任何格式输入颜色
3. 即时查看所有格式的转换结果
4. 复制所需格式

## 常见问题

### 为什么颜色在不同屏幕上看起来不同？

屏幕有不同的颜色配置文件、亮度和校准。为了颜色一致：
- 使用颜色配置文件（网页用 sRGB）
- 校准显示器
- 在多个设备上测试

### 什么时候应该使用 HEX vs RGB？

静态 CSS 值使用 HEX（代码更简洁）。当需要以下情况时使用 RGB/RGBA：
- 透明度（RGBA）
- 程序化颜色操作
- 动态颜色生成

### 如何使颜色变浅或变深？

使用 HSL，调整 L（亮度）值：
- 变浅：增加 L（例如 50% → 70%）
- 变深：减少 L（例如 50% → 30%）

### HSL 和 HSV 有什么区别？

两者都使用色相和饱和度，但：
- HSL：亮度（0% = 黑色，100% = 白色，50% = 纯色）
- HSV：明度/亮度（0% = 黑色，100% = 纯色）

HSL 对于创建色调和阴影更直观。

### 如何准确地将 CMYK 转换为 RGB？

CMYK 到 RGB 的转换是近似的，因为它们使用不同的颜色模型。对于准确的印刷颜色，使用专业的颜色管理软件和 ICC 配置文件。

## 总结

理解颜色格式有助于您在 Web 开发和设计中更高效地处理颜色。使用 [U2Tool 颜色转换器](https://www.u2tool.com/zh/tools/color-converter) 进行快速转换，使用 HSL 创建和谐的配色方案。

关键要点：
- CSS 用 HEX，编程用 RGB，设计用 HSL
- 使用 HSL 轻松创建颜色变体
- 始终检查颜色对比度以确保无障碍
- 在多个设备上测试颜色
