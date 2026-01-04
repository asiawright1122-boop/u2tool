# 检查 Yandex 验证码环境变量

## 问题诊断

生产环境显示旧验证码 `d3e0d052e17a742e`，而不是新验证码 `8ca42f005723223b`。

## 原因

Vercel 环境变量中设置了 `YANDEX_SITE_VERIFICATION`，覆盖了代码中的默认值。

## 解决步骤

### 方法 1：更新 Vercel 环境变量（推荐）

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择项目 `u2tool`
3. 进入 **Settings** → **Environment Variables**
4. 查找 `YANDEX_SITE_VERIFICATION`
5. 点击编辑，将值改为：`8ca42f005723223b`
6. 保存更改
7. 重新部署（或等待自动部署）

### 方法 2：删除环境变量

如果不想使用环境变量，可以删除它：
1. 在 Vercel 环境变量列表中
2. 找到 `YANDEX_SITE_VERIFICATION`
3. 点击删除
4. 代码会使用默认值 `8ca42f005723223b`
5. 重新部署

## 验证

更新后，运行验证脚本：

```bash
npx ts-node scripts/verify-yandex-meta.ts
```

或者手动检查：
```bash
curl -sL https://www.u2tool.com | grep -o 'yandex-verification[^>]*'
```

应该显示：`yandex-verification" content="8ca42f005723223b"`
