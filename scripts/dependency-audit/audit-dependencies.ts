#!/usr/bin/env node
import fs from 'fs-extra';
import { execSync } from 'child_process';
import depcheck from 'depcheck';

/**
 * 依赖审计
 * 检查安全漏洞、过时依赖和未使用依赖
 */

interface SecurityVulnerability {
  name: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  via: string[];
  range: string;
}

interface OutdatedDependency {
  name: string;
  current: string;
  wanted: string;
  latest: string;
  type: 'dependencies' | 'devDependencies';
}

interface AuditReport {
  timestamp: string;
  vulnerabilities: SecurityVulnerability[];
  outdated: OutdatedDependency[];
  unused: string[];
  summary: {
    totalVulnerabilities: number;
    criticalVulnerabilities: number;
    highVulnerabilities: number;
    outdatedCount: number;
    unusedCount: number;
  };
}

/**
 * 运行安全审计
 */
async function runSecurityAudit(): Promise<SecurityVulnerability[]> {
  console.log('🔒 运行安全审计...');
  
  try {
    const output = execSync('npm audit --json', { encoding: 'utf-8' });
    const auditData = JSON.parse(output);
    
    const vulnerabilities: SecurityVulnerability[] = [];
    
    if (auditData.vulnerabilities) {
      for (const [name, vuln] of Object.entries(auditData.vulnerabilities as any)) {
        vulnerabilities.push({
          name,
          severity: vuln.severity,
          via: Array.isArray(vuln.via) ? vuln.via.map((v: any) => typeof v === 'string' ? v : v.name) : [],
          range: vuln.range || 'unknown',
        });
      }
    }
    
    return vulnerabilities;
  } catch (error: any) {
    // npm audit 在发现漏洞时会返回非零退出码
    if (error.stdout) {
      try {
        const auditData = JSON.parse(error.stdout);
        const vulnerabilities: SecurityVulnerability[] = [];
        
        if (auditData.vulnerabilities) {
          for (const [name, vuln] of Object.entries(auditData.vulnerabilities as any)) {
            vulnerabilities.push({
              name,
              severity: vuln.severity,
              via: Array.isArray(vuln.via) ? vuln.via.map((v: any) => typeof v === 'string' ? v : v.name) : [],
              range: vuln.range || 'unknown',
            });
          }
        }
        
        return vulnerabilities;
      } catch {
        console.warn('⚠️  无法解析审计结果');
        return [];
      }
    }
    return [];
  }
}

/**
 * 检查过时依赖
 */
async function checkOutdated(): Promise<OutdatedDependency[]> {
  console.log('📦 检查过时依赖...');
  
  try {
    const output = execSync('npm outdated --json', { encoding: 'utf-8' });
    const outdatedData = JSON.parse(output);
    
    const outdated: OutdatedDependency[] = [];
    
    for (const [name, info] of Object.entries(outdatedData as any)) {
      outdated.push({
        name,
        current: info.current,
        wanted: info.wanted,
        latest: info.latest,
        type: info.type || 'dependencies',
      });
    }
    
    return outdated;
  } catch (error: any) {
    // npm outdated 在发现过时依赖时会返回非零退出码
    if (error.stdout) {
      try {
        const outdatedData = JSON.parse(error.stdout);
        const outdated: OutdatedDependency[] = [];
        
        for (const [name, info] of Object.entries(outdatedData as any)) {
          outdated.push({
            name,
            current: info.current,
            wanted: info.wanted,
            latest: info.latest,
            type: info.type || 'dependencies',
          });
        }
        
        return outdated;
      } catch {
        console.warn('⚠️  无法解析过时依赖结果');
        return [];
      }
    }
    return [];
  }
}

/**
 * 检查未使用依赖
 */
async function checkUnused(): Promise<string[]> {
  console.log('🔍 检查未使用依赖...');
  
  try {
    const result = await depcheck(process.cwd(), {
      ignoreBinPackage: true,
      skipMissing: true,
      ignorePatterns: [
        'dist',
        'node_modules',
        '.astro',
        'benchmarks',
        'archive',
      ],
    });
    
    return result.dependencies;
  } catch (error) {
    console.warn('⚠️  检查未使用依赖失败:', error);
    return [];
  }
}

/**
 * 运行完整审计
 */
async function runAudit(): Promise<AuditReport> {
  console.log('🔍 开始依赖审计\n');
  
  const vulnerabilities = await runSecurityAudit();
  const outdated = await checkOutdated();
  const unused = await checkUnused();
  
  const report: AuditReport = {
    timestamp: new Date().toISOString(),
    vulnerabilities,
    outdated,
    unused,
    summary: {
      totalVulnerabilities: vulnerabilities.length,
      criticalVulnerabilities: vulnerabilities.filter(v => v.severity === 'critical').length,
      highVulnerabilities: vulnerabilities.filter(v => v.severity === 'high').length,
      outdatedCount: outdated.length,
      unusedCount: unused.length,
    },
  };
  
  return report;
}

/**
 * 打印审计结果
 */
function printReport(report: AuditReport): void {
  console.log('\n📊 依赖审计报告\n');
  console.log(`时间戳: ${new Date(report.timestamp).toLocaleString('zh-CN')}\n`);
  
  // 安全漏洞
  if (report.vulnerabilities.length > 0) {
    console.log(`🔴 发现 ${report.vulnerabilities.length} 个安全漏洞:`);
    console.log(`  严重: ${report.summary.criticalVulnerabilities}`);
    console.log(`  高危: ${report.summary.highVulnerabilities}`);
    console.log(`  中危: ${report.vulnerabilities.filter(v => v.severity === 'moderate').length}`);
    console.log(`  低危: ${report.vulnerabilities.filter(v => v.severity === 'low').length}`);
    console.log();
    
    // 显示严重和高危漏洞
    const criticalAndHigh = report.vulnerabilities.filter(v => v.severity === 'critical' || v.severity === 'high');
    if (criticalAndHigh.length > 0) {
      console.log('严重和高危漏洞:');
      for (const vuln of criticalAndHigh.slice(0, 10)) {
        console.log(`  • ${vuln.name} (${vuln.severity})`);
        if (vuln.via.length > 0) {
          console.log(`    通过: ${vuln.via.join(', ')}`);
        }
      }
      if (criticalAndHigh.length > 10) {
        console.log(`  ... 还有 ${criticalAndHigh.length - 10} 个漏洞`);
      }
      console.log();
    }
  } else {
    console.log('✅ 未发现安全漏洞\n');
  }
  
  // 过时依赖
  if (report.outdated.length > 0) {
    console.log(`📦 发现 ${report.outdated.length} 个过时依赖:`);
    for (const dep of report.outdated.slice(0, 10)) {
      console.log(`  • ${dep.name}: ${dep.current} → ${dep.latest}`);
    }
    if (report.outdated.length > 10) {
      console.log(`  ... 还有 ${report.outdated.length - 10} 个依赖`);
    }
    console.log();
  } else {
    console.log('✅ 所有依赖都是最新的\n');
  }
  
  // 未使用依赖
  if (report.unused.length > 0) {
    console.log(`🗑️  发现 ${report.unused.length} 个未使用依赖:`);
    for (const dep of report.unused.slice(0, 10)) {
      console.log(`  • ${dep}`);
    }
    if (report.unused.length > 10) {
      console.log(`  ... 还有 ${report.unused.length - 10} 个依赖`);
    }
    console.log();
  } else {
    console.log('✅ 没有未使用的依赖\n');
  }
}

/**
 * 生成审计报告
 */
async function generateReport(report: AuditReport, outputPath: string = 'docs/DEPENDENCY_AUDIT.md'): Promise<void> {
  const content = `# 依赖审计报告

生成时间: ${new Date(report.timestamp).toLocaleString('zh-CN')}

## 总结

- **安全漏洞**: ${report.summary.totalVulnerabilities} (严重: ${report.summary.criticalVulnerabilities}, 高危: ${report.summary.highVulnerabilities})
- **过时依赖**: ${report.summary.outdatedCount}
- **未使用依赖**: ${report.summary.unusedCount}

## 安全漏洞

${report.vulnerabilities.length > 0 ? report.vulnerabilities.map(v => 
  `### ${v.name} (${v.severity})\n- 范围: ${v.range}\n- 通过: ${v.via.join(', ')}`
).join('\n\n') : '✅ 未发现安全漏洞'}

## 过时依赖

${report.outdated.length > 0 ? report.outdated.map(d => 
  `- **${d.name}**: ${d.current} → ${d.latest} (${d.type})`
).join('\n') : '✅ 所有依赖都是最新的'}

## 未使用依赖

${report.unused.length > 0 ? report.unused.map(d => `- ${d}`).join('\n') : '✅ 没有未使用的依赖'}

## 建议

${report.summary.criticalVulnerabilities > 0 ? '⚠️  **立即修复严重漏洞**: 运行 `npm audit fix --force`' : ''}
${report.summary.highVulnerabilities > 0 ? '\n⚠️  **尽快修复高危漏洞**: 运行 `npm audit fix`' : ''}
${report.summary.outdatedCount > 0 ? '\n📦 **更新过时依赖**: 运行 `npm update` 或手动更新主要版本' : ''}
${report.summary.unusedCount > 0 ? '\n🗑️  **移除未使用依赖**: 运行 `npm uninstall <package-name>`' : ''}
`;

  await fs.writeFile(outputPath, content, 'utf-8');
  console.log(`✅ 报告已生成: ${outputPath}`);
}

// CLI 入口
async function main() {
  try {
    const report = await runAudit();
    printReport(report);
    await generateReport(report);
  } catch (error) {
    console.error('❌ 审计失败:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { runAudit, printReport, generateReport };
