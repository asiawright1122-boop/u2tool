import { test, expect } from '@playwright/test';

test.describe('响应式设计测试', () => {
  test('桌面端布局正确', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    // Header 应该可见
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // 导航链接应该可见
    const navLinks = page.locator('a').filter({ hasText: /tools|工具/i });
    await expect(navLinks.first()).toBeVisible();
  });

  test('平板端布局正确', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });

  test('移动端布局正确', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Header 应该可见
    await expect(page.locator('header')).toBeVisible();
    
    // Hero 标题应该可见
    await expect(page.locator('h1')).toBeVisible();
    
    // 内容不应该溢出
    const body = page.locator('body');
    const bodyBox = await body.boundingBox();
    expect(bodyBox?.width).toBeLessThanOrEqual(375);
  });

  test('移动端工具页面可用', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/tools/json-formatter');
    
    // 工具输入区应该可见且可交互
    const textarea = page.locator('textarea').first();
    await expect(textarea).toBeVisible();
    
    // 可以输入内容
    await textarea.fill('{"test": true}');
  });

  test('移动端工具列表页可用', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/tools');
    
    // 工具卡片应该可见
    const toolCards = page.locator('a[href*="/tools/"]');
    expect(await toolCards.count()).toBeGreaterThan(0);
    
    // 点击工具应该可以导航
    await toolCards.first().click();
    await expect(page).toHaveURL(/\/tools\/.+/);
  });
});

test.describe('可访问性测试', () => {
  test('页面有正确的语义结构', async ({ page }) => {
    await page.goto('/');
    
    // 应该有 main 或主要内容区
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // 应该有 header
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // 应该有 footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('链接有明确的文本', async ({ page }) => {
    await page.goto('/');
    
    const links = page.locator('a');
    const count = await links.count();
    
    for (let i = 0; i < Math.min(count, 20); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      // 链接应该有文本或 aria-label
      expect(text?.trim() || ariaLabel).toBeTruthy();
    }
  });

  test('按钮可通过键盘访问', async ({ page }) => {
    await page.goto('/tools/uuid-generator');
    
    // Tab 到第一个按钮
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // 检查是否有元素获得焦点
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});

test.describe('性能基础测试', () => {
  test('首页加载时间合理', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // 首页应该在 5 秒内加载完成
    expect(loadTime).toBeLessThan(5000);
  });

  test('工具页面加载时间合理', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/tools/json-formatter');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // 工具页面应该在 5 秒内加载完成
    expect(loadTime).toBeLessThan(5000);
  });

  test('页面无 JavaScript 错误', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    await page.goto('/');
    await page.goto('/tools');
    await page.goto('/tools/json-formatter');
    
    // 不应该有 JS 错误
    expect(errors).toHaveLength(0);
  });
});
