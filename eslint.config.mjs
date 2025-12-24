import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  // 基础 JS 推荐规则
  js.configs.recommended,
  
  // TypeScript 推荐规则
  ...tseslint.configs.recommended,
  
  // 全局变量配置
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        React: "readonly",
        JSX: "readonly",
      },
    },
  },
  
  // 全局忽略
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "public/**",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
      "next-env.d.ts",
    ],
  },
  
  // TypeScript 文件规则
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // 允许未使用的变量以下划线开头，包括 catch 参数
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // 允许 any 类型（渐进式迁移）
      "@typescript-eslint/no-explicit-any": "warn",
      // 允许空函数
      "@typescript-eslint/no-empty-function": "off",
      // 允许 require
      "@typescript-eslint/no-require-imports": "off",
      // 允许 case 块中的声明
      "no-case-declarations": "off",
    },
  },
  
  // JavaScript 文件规则
  {
    files: ["**/*.js", "**/*.mjs"],
    rules: {
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  }
);
