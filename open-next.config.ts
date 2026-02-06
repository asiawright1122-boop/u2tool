import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      // 禁用增量缓存（使用外部存储）
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
    // 排除大型依赖
    minify: true,
  },
  edgeExternals: [
    "node:crypto",
    // 大型库标记为外部
    "echarts",
    "echarts/core",
    "echarts-for-react",
    "pdfjs-dist",
    "jspdf",
    "xlsx",
  ],
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
};

export default config;
