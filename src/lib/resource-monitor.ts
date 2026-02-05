/**
 * 资源监控服务
 * 
 * 功能：
 * - 记录 ISR 重新生成事件
 * - 检查资源使用阈值
 * - 发送告警通知
 * 
 * @see Requirements 9.1, 9.3, 20.2, 20.3
 */

// 资源使用数据结构
export interface ResourceUsage {
  fastOriginTransfer: number; // 字节
  fastDataTransfer: number;   // 字节
  isrWrites: number;          // 次数
  isrReads: number;           // 次数
  edgeRequests: number;       // 次数
  timestamp: Date;
}

// ISR 重新生成事件
export interface ISRRegenerationEvent {
  type: 'isr_regeneration';
  path: string;
  locale?: string;
  timestamp: string;
  duration?: number; // 毫秒
}

// 资源阈值配置（Vercel Hobby Plan 限制）
export const RESOURCE_LIMITS = {
  fastOriginTransfer: 10 * 1024 * 1024 * 1024, // 10 GB
  fastDataTransfer: 100 * 1024 * 1024 * 1024,  // 100 GB
  isrWrites: 200000,                            // 200,000 次
  isrReads: 1000000,                            // 1,000,000 次
  edgeRequests: 1000000,                        // 1,000,000 次
};

// 告警阈值（百分比）
export const ALERT_THRESHOLDS = {
  warning: 0.5,  // 50%
  critical: 0.8, // 80%
};

// 内存中的事件日志（用于开发和调试）
const eventLog: ISRRegenerationEvent[] = [];
const MAX_LOG_SIZE = 1000;

/**
 * 记录 ISR 重新生成事件
 */
export function logISRRegeneration(
  pagePath: string,
  locale?: string,
  duration?: number
): void {
  const event: ISRRegenerationEvent = {
    type: 'isr_regeneration',
    path: pagePath,
    locale,
    timestamp: new Date().toISOString(),
    duration,
  };
  
  // 添加到内存日志
  eventLog.push(event);
  if (eventLog.length > MAX_LOG_SIZE) {
    eventLog.shift(); // 移除最旧的事件
  }
  
  // 发送到监控服务（如果配置了）
  if (process.env.MONITORING_ENDPOINT) {
    sendToMonitoring(event).catch(() => {
      // 静默失败，不影响主流程
    });
  }
  
  // 本地日志（开发环境）
  if (process.env.NODE_ENV === 'development') {
    console.log('[ISR Regeneration]', event);
  }
}

/**
 * 发送事件到监控服务
 */
async function sendToMonitoring(event: ISRRegenerationEvent): Promise<void> {
  const endpoint = process.env.MONITORING_ENDPOINT;
  if (!endpoint) return;
  
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MONITORING_API_KEY || ''}`,
      },
      body: JSON.stringify(event),
    });
  } catch {
    // 静默失败
  }
}

/**
 * 检查资源使用阈值
 */
export function checkResourceThresholds(usage: ResourceUsage): {
  warnings: string[];
  critical: string[];
  status: 'ok' | 'warning' | 'critical';
} {
  const warnings: string[] = [];
  const critical: string[] = [];
  
  // 检查 Fast Origin Transfer
  const fotPercent = usage.fastOriginTransfer / RESOURCE_LIMITS.fastOriginTransfer;
  if (fotPercent >= ALERT_THRESHOLDS.critical) {
    critical.push(`Fast Origin Transfer 已使用 ${(fotPercent * 100).toFixed(1)}%（${formatBytes(usage.fastOriginTransfer)} / ${formatBytes(RESOURCE_LIMITS.fastOriginTransfer)}）`);
  } else if (fotPercent >= ALERT_THRESHOLDS.warning) {
    warnings.push(`Fast Origin Transfer 已使用 ${(fotPercent * 100).toFixed(1)}%（${formatBytes(usage.fastOriginTransfer)} / ${formatBytes(RESOURCE_LIMITS.fastOriginTransfer)}）`);
  }
  
  // 检查 Fast Data Transfer
  const fdtPercent = usage.fastDataTransfer / RESOURCE_LIMITS.fastDataTransfer;
  if (fdtPercent >= ALERT_THRESHOLDS.critical) {
    critical.push(`Fast Data Transfer 已使用 ${(fdtPercent * 100).toFixed(1)}%（${formatBytes(usage.fastDataTransfer)} / ${formatBytes(RESOURCE_LIMITS.fastDataTransfer)}）`);
  } else if (fdtPercent >= ALERT_THRESHOLDS.warning) {
    warnings.push(`Fast Data Transfer 已使用 ${(fdtPercent * 100).toFixed(1)}%（${formatBytes(usage.fastDataTransfer)} / ${formatBytes(RESOURCE_LIMITS.fastDataTransfer)}）`);
  }
  
  // 检查 ISR Writes
  const isrWritesPercent = usage.isrWrites / RESOURCE_LIMITS.isrWrites;
  if (isrWritesPercent >= ALERT_THRESHOLDS.critical) {
    critical.push(`ISR Writes 已使用 ${(isrWritesPercent * 100).toFixed(1)}%（${usage.isrWrites.toLocaleString()} / ${RESOURCE_LIMITS.isrWrites.toLocaleString()}）`);
  } else if (isrWritesPercent >= ALERT_THRESHOLDS.warning) {
    warnings.push(`ISR Writes 已使用 ${(isrWritesPercent * 100).toFixed(1)}%（${usage.isrWrites.toLocaleString()} / ${RESOURCE_LIMITS.isrWrites.toLocaleString()}）`);
  }
  
  // 检查 ISR Reads
  const isrReadsPercent = usage.isrReads / RESOURCE_LIMITS.isrReads;
  if (isrReadsPercent >= ALERT_THRESHOLDS.critical) {
    critical.push(`ISR Reads 已使用 ${(isrReadsPercent * 100).toFixed(1)}%（${usage.isrReads.toLocaleString()} / ${RESOURCE_LIMITS.isrReads.toLocaleString()}）`);
  } else if (isrReadsPercent >= ALERT_THRESHOLDS.warning) {
    warnings.push(`ISR Reads 已使用 ${(isrReadsPercent * 100).toFixed(1)}%（${usage.isrReads.toLocaleString()} / ${RESOURCE_LIMITS.isrReads.toLocaleString()}）`);
  }
  
  // 检查 Edge Requests
  const edgePercent = usage.edgeRequests / RESOURCE_LIMITS.edgeRequests;
  if (edgePercent >= ALERT_THRESHOLDS.critical) {
    critical.push(`Edge Requests 已使用 ${(edgePercent * 100).toFixed(1)}%（${usage.edgeRequests.toLocaleString()} / ${RESOURCE_LIMITS.edgeRequests.toLocaleString()}）`);
  } else if (edgePercent >= ALERT_THRESHOLDS.warning) {
    warnings.push(`Edge Requests 已使用 ${(edgePercent * 100).toFixed(1)}%（${usage.edgeRequests.toLocaleString()} / ${RESOURCE_LIMITS.edgeRequests.toLocaleString()}）`);
  }
  
  // 确定整体状态
  let status: 'ok' | 'warning' | 'critical' = 'ok';
  if (critical.length > 0) {
    status = 'critical';
  } else if (warnings.length > 0) {
    status = 'warning';
  }
  
  return { warnings, critical, status };
}

/**
 * 格式化字节数
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 获取 ISR 重新生成事件日志
 */
export function getISREventLog(): ISRRegenerationEvent[] {
  return [...eventLog];
}

/**
 * 清除事件日志（用于测试）
 */
export function clearEventLog(): void {
  eventLog.length = 0;
}

/**
 * 获取事件统计
 */
export function getEventStats(): {
  total: number;
  byPath: Record<string, number>;
  byLocale: Record<string, number>;
  last24h: number;
} {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  
  const byPath: Record<string, number> = {};
  const byLocale: Record<string, number> = {};
  let last24h = 0;
  
  for (const event of eventLog) {
    // 按路径统计
    byPath[event.path] = (byPath[event.path] || 0) + 1;
    
    // 按语言统计
    if (event.locale) {
      byLocale[event.locale] = (byLocale[event.locale] || 0) + 1;
    }
    
    // 最近 24 小时统计
    if (new Date(event.timestamp).getTime() > oneDayAgo) {
      last24h++;
    }
  }
  
  return {
    total: eventLog.length,
    byPath,
    byLocale,
    last24h,
  };
}

/**
 * 估算每月资源消耗
 */
export function estimateMonthlyUsage(
  dailyStats: { isrRegenerations: number; pageViews: number; avgPageSize: number }
): ResourceUsage {
  const daysInMonth = 30;
  
  return {
    // 假设每次 ISR 重新生成传输约 500KB
    fastOriginTransfer: dailyStats.isrRegenerations * 500 * 1024 * daysInMonth,
    // 页面浏览量 × 平均页面大小
    fastDataTransfer: dailyStats.pageViews * dailyStats.avgPageSize * daysInMonth,
    // ISR 写入次数
    isrWrites: dailyStats.isrRegenerations * daysInMonth,
    // ISR 读取次数（假设是写入的 10 倍）
    isrReads: dailyStats.isrRegenerations * 10 * daysInMonth,
    // Edge 请求（假设是页面浏览量的 3 倍，包括静态资源）
    edgeRequests: dailyStats.pageViews * 3 * daysInMonth,
    timestamp: new Date(),
  };
}
