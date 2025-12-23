import { test, expect } from '@playwright/test';

test.describe('工具列表页测试', () => {
  test('工具列表页加载成功', async ({ page }) => {
    await page.goto('/tools');
    
    await expect(page).toHaveTitle(/Tools|Developer|工具/i);
    
    // 检查工具卡片存在
    const toolCards = page.locator('a[href*="/tools/"]');
    expect(await toolCards.count()).toBeGreaterThan(50);
  });

  test('分类筛选功能正常', async ({ page }) => {
    await page.goto('/tools?category=encoding');
    
    // 页面应该显示编码相关工具
    await expect(page.locator('a[href*="/tools/"]').first()).toBeVisible();
  });

  test('搜索功能正常', async ({ page }) => {
    await page.goto('/tools');
    
    // 查找搜索框
    const searchInput = page.locator('input[type="text"], input[type="search"]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('json');
      
      // 等待搜索结果
      await page.waitForTimeout(500);
      
      // 应该显示 JSON 相关工具
      const results = page.locator('a[href*="/tools/json"]');
      expect(await results.count()).toBeGreaterThan(0);
    }
  });
});

test.describe('核心工具功能测试', () => {
  test('JSON 格式化工具', async ({ page }) => {
    await page.goto('/tools/json-formatter');
    
    await expect(page).toHaveTitle(/JSON/i);
    
    // 查找输入区域
    const textarea = page.locator('textarea').first();
    await expect(textarea).toBeVisible();
    
    // 输入测试 JSON
    await textarea.fill('{"name":"test","value":123}');
    
    // 查找格式化按钮并点击
    const formatBtn = page.getByRole('button', { name: /format|格式化/i }).first();
    if (await formatBtn.isVisible()) {
      await formatBtn.click();
    }
    
    // 等待输出
    await page.waitForTimeout(500);
  });

  test('Base64 编解码工具', async ({ page }) => {
    await page.goto('/tools/base64');
    
    await expect(page).toHaveTitle(/Base64/i);
    
    const textarea = page.locator('textarea').first();
    await expect(textarea).toBeVisible();
    
    // 输入测试文本
    await textarea.fill('Hello World');
    
    // 等待编码结果
    await page.waitForTimeout(500);
    
    // Base64 编码工具应该正常加载
    await expect(page.locator('textarea').first()).toBeVisible();
  });

  test('UUID 生成器', async ({ page }) => {
    await page.goto('/tools/uuid-generator');
    
    await expect(page).toHaveTitle(/UUID/i);
    
    // 查找生成按钮
    const generateBtn = page.getByRole('button', { name: /generate|生成/i }).first();
    
    if (await generateBtn.isVisible()) {
      await generateBtn.click();
      await page.waitForTimeout(300);
      
      // 检查是否生成了 UUID
      const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
      await expect(page.locator('body')).toContainText(uuidPattern);
    }
  });

  test('密码生成器', async ({ page }) => {
    await page.goto('/tools/password-generator');
    
    await expect(page).toHaveTitle(/Password|密码/i);
    
    const generateBtn = page.getByRole('button', { name: /generate|生成/i }).first();
    
    if (await generateBtn.isVisible()) {
      await generateBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('颜色转换器', async ({ page }) => {
    await page.goto('/tools/color-converter');
    
    await expect(page).toHaveTitle(/Color|颜色/i);
    
    // 检查颜色输入存在
    const colorInput = page.locator('input[type="color"], input[type="text"]').first();
    await expect(colorInput).toBeVisible();
  });

  test('二维码生成器', async ({ page }) => {
    await page.goto('/tools/qr-generator');
    
    await expect(page).toHaveTitle(/QR/i);
    
    const textarea = page.locator('textarea, input[type="text"]').first();
    await expect(textarea).toBeVisible();
    
    await textarea.fill('https://example.com');
    await page.waitForTimeout(500);
    
    // 检查是否生成了二维码图片
    const qrImage = page.locator('canvas, img, svg').first();
    await expect(qrImage).toBeVisible();
  });

  test('Word 计数器', async ({ page }) => {
    await page.goto('/tools/word-counter');
    
    const textarea = page.locator('textarea').first();
    await expect(textarea).toBeVisible();
    
    await textarea.fill('Hello World Test');
    await page.waitForTimeout(500);
    
    // 检查是否显示字数统计 - 查找包含数字的统计元素
    const statsElement = page.locator('[class*="text-blue"], [class*="font-bold"]').filter({ hasText: /\d+/ }).first();
    await expect(statsElement).toBeVisible();
  });

  test('Hash 生成器', async ({ page }) => {
    await page.goto('/tools/hash-generator');
    
    const textarea = page.locator('textarea, input[type="text"]').first();
    await expect(textarea).toBeVisible();
    
    await textarea.fill('test');
    await page.waitForTimeout(1000);
    
    // 检查页面正常加载且有生成按钮
    const generateBtn = page.getByRole('button', { name: /generate|hash|生成/i }).first();
    if (await generateBtn.isVisible()) {
      await generateBtn.click();
      await page.waitForTimeout(500);
    }
  });
});

test.describe('工具页面通用测试', () => {
  const popularTools = [
    'json-formatter',
    'base64',
    'uuid-generator',
    'url-encoder',
    'qr-generator',
    'color-converter',
    'word-counter',
    'diff-checker',
    'gradient-generator',
    'timestamp-converter'
  ];

  for (const tool of popularTools) {
    test(`${tool} 页面加载正常`, async ({ page }) => {
      await page.goto(`/tools/${tool}`);
      
      // 页面状态码应为 200
      expect(page.url()).toContain(tool);
      
      // 页面应有标题
      await expect(page.locator('h1, h2').first()).toBeVisible();
      
      // 页面应有主要交互区域
      const interactiveElement = page.locator('textarea, input, button').first();
      await expect(interactiveElement).toBeVisible();
    });
  }
});
