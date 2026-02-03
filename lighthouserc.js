/**
 * Lighthouse CI 配置
 * 
 * 用于在 CI/CD 中运行 Lighthouse 性能测试
 * 
 * @see https://github.com/GoogleChrome/lighthouse-ci
 * @see .kiro/specs/pagespeed-optimization/design.md
 */

module.exports = {
  ci: {
    collect: {
      // 测试的 URL 列表
      url: [
        'http://localhost:3000/en',
        'http://localhost:3000/en/tools',
        'http://localhost:3000/en/tools/json-formatter',
        'http://localhost:3000/en/tools/base64',
      ],
      // 每个 URL 运行次数
      numberOfRuns: 3,
      // 启动服务器命令
      startServerCommand: 'npm run start',
      // 等待服务器启动
      startServerReadyPattern: 'ready on',
      startServerReadyTimeout: 30000,
      // Chrome 配置
      settings: {
        preset: 'desktop',
        // 模拟桌面环境
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        // 禁用节流以获得更准确的结果
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      // 性能预算断言
      assertions: {
        // Core Web Vitals
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        
        // LCP
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        
        // TBT (Total Blocking Time)
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        
        // CLS
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        
        // 其他重要指标
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'speed-index': ['warn', { maxNumericValue: 3400 }],
        'interactive': ['warn', { maxNumericValue: 3800 }],
        
        // 资源优化
        'uses-text-compression': 'off',
        'uses-responsive-images': 'warn',
        'uses-optimized-images': 'warn',
        'uses-webp-images': 'warn',
        'render-blocking-resources': 'warn',
        
        // 缓存
        'uses-long-cache-ttl': 'warn',
      },
    },
    upload: {
      // 上传到临时存储（可选）
      target: 'temporary-public-storage',
    },
  },
};
