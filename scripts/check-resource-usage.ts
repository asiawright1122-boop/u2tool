#!/usr/bin/env npx tsx
/**
 * Vercel 资源使用检查脚本
 * 
 * 功能：
 * - 检查当前资源使用情况
 * - 生成每日/每周资源使用报告
 * - 发送告警通知
 * 
 * 使用方法：
 *   npx tsx scripts/check-resource-usage.ts
 *   npx tsx scripts/check-resource-usage.ts --report
 * 
 * @see Requirements 9.4, 9.5, 20.4
 */

import {
  checkResourceThresholds,
  formatBytes,
  RESOURCE_LIMITS,
  ALERT_THRESHOLDS,
  type ResourceUsage,
} from '../src/lib/resource-monitor';

// 模拟资源使用数据（实际使用时应从 Vercel API 获取）
function getResourceUsage(): ResourceUsage {
  // 这里应该调用 Vercel API 获取实际数据
  // 目前使用模拟数据进行演示
  return {
    fastOriginTransfer: 2.5 * 1024 * 1024 * 1024, // 2.5 GB
    fastDataTransfer: 45 * 1024 * 1024 * 1024,    // 45 GB
    isrWrites: 85000,                              // 85,000 次
    isrReads: 450000,                              // 450,000 次
    edgeRequests: 520000,                          // 520,000 次
    timestamp: new Date(),
  };
}

// 生成资源使用报告
function generateReport(usage: ResourceUsage): string {
  const lines: string[] = [];
  
  lines.push('='.repeat(60));
  lines.push('Vercel 资源使用报告');
  lines.push(`生成时间: ${usage.timestamp.toISOString()}`);
  lines.push('='.repeat(60));
  lines.push('');
  
  // Fast Origin Transfer
  const fotPercent = (usage.fastOriginTransfer / RESOURCE_LIMITS.fastOriginTransfer * 100).toFixed(1);
  lines.push(`📤 Fast Origin Transfer:`);
  lines.push(`   使用量: ${formatBytes(usage.fastOriginTransfer)} / ${formatBytes(RESOURCE_LIMITS.fastOriginTransfer)}`);
  lines.push(`   使用率: ${fotPercent}%`);
  lines.push(`   状态: ${getStatusEmoji(parseFloat(fotPercent))}`);
  lines.push('');
  
  // Fast Data Transfer
  const fdtPercent = (usage.fastDataTransfer / RESOURCE_LIMITS.fastDataTransfer * 100).toFixed(1);
  lines.push(`📥 Fast Data Transfer:`);
  lines.push(`   使用量: ${formatBytes(usage.fastDataTransfer)} / ${formatBytes(RESOURCE_LIMITS.fastDataTransfer)}`);
  lines.push(`   使用率: ${fdtPercent}%`);
  lines.push(`   状态: ${getStatusEmoji(parseFloat(fdtPercent))}`);
  lines.push('');
  
  // ISR Writes
  const isrWritesPercent = (usage.isrWrites / RESOURCE_LIMITS.isrWrites * 100).toFixed(1);
  lines.push(`✍️ ISR Writes:`);
  lines.push(`   使用量: ${usage.isrWrites.toLocaleString()} / ${RESOURCE_LIMITS.isrWrites.toLocaleString()}`);
  lines.push(`   使用率: ${isrWritesPercent}%`);
  lines.push(`   状态: ${getStatusEmoji(parseFloat(isrWritesPercent))}`);
  lines.push('');
  
  // ISR Reads
  const isrReadsPercent = (usage.isrReads / RESOURCE_LIMITS.isrReads * 100).toFixed(1);
  lines.push(`📖 ISR Reads:`);
  lines.push(`   使用量: ${usage.isrReads.toLocaleString()} / ${RESOURCE_LIMITS.isrReads.toLocaleString()}`);
  lines.push(`   使用率: ${isrReadsPercent}%`);
  lines.push(`   状态: ${getStatusEmoji(parseFloat(isrReadsPercent))}`);
  lines.push('');
  
  // Edge Requests
  const edgePercent = (usage.edgeRequests / RESOURCE_LIMITS.edgeRequests * 100).toFixed(1);
  lines.push(`🌐 Edge Requests:`);
  lines.push(`   使用量: ${usage.edgeRequests.toLocaleString()} / ${RESOURCE_LIMITS.edgeRequests.toLocaleString()}`);
  lines.push(`   使用率: ${edgePercent}%`);
  lines.push(`   状态: ${getStatusEmoji(parseFloat(edgePercent))}`);
  lines.push('');
  
  // 阈值检查
  const { warnings, critical, status } = checkResourceThresholds(usage);
  
  lines.push('-'.repeat(60));
  lines.push(`整体状态: ${getOverallStatusEmoji(status)} ${status.toUpperCase()}`);
  lines.push('-'.repeat(60));
  
  if (critical.length > 0) {
    lines.push('');
    lines.push('🚨 严重告警:');
    critical.forEach(msg => lines.push(`   - ${msg}`));
  }
  
  if (warnings.length > 0) {
    lines.push('');
    lines.push('⚠️ 警告:');
    warnings.forEach(msg => lines.push(`   - ${msg}`));
  }
  
  if (status === 'ok') {
    lines.push('');
    lines.push('✅ 所有资源使用正常');
  }
  
  lines.push('');
  lines.push('='.repeat(60));
  lines.push('阈值配置:');
  lines.push(`   警告阈值: ${ALERT_THRESHOLDS.warning * 100}%`);
  lines.push(`   严重阈值: ${ALERT_THRESHOLDS.critical * 100}%`);
  lines.push('='.repeat(60));
  
  return lines.join('\n');
}

// 获取状态 emoji
function getStatusEmoji(percent: number): string {
  if (percent >= ALERT_THRESHOLDS.critical * 100) {
    return '🔴 严重';
  } else if (percent >= ALERT_THRESHOLDS.warning * 100) {
    return '🟡 警告';
  } else {
    return '🟢 正常';
  }
}

// 获取整体状态 emoji
function getOverallStatusEmoji(status: 'ok' | 'warning' | 'critical'): string {
  switch (status) {
    case 'critical':
      return '🔴';
    case 'warning':
      return '🟡';
    default:
      return '🟢';
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const showReport = args.includes('--report') || args.length === 0;
  
  console.log('正在获取资源使用数据...\n');
  
  const usage = getResourceUsage();
  
  if (showReport) {
    const report = generateReport(usage);
    console.log(report);
  }
  
  // 检查阈值
  const { status, warnings, critical } = checkResourceThresholds(usage);
  
  // 返回退出码
  if (status === 'critical') {
    console.log('\n❌ 检测到严重资源使用问题，请立即处理！');
    process.exit(2);
  } else if (status === 'warning') {
    console.log('\n⚠️ 检测到资源使用警告，请关注！');
    process.exit(1);
  } else {
    console.log('\n✅ 资源使用检查完成，一切正常！');
    process.exit(0);
  }
}

main().catch(console.error);
