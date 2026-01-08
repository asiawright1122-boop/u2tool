/**
 * 生成热门分类对比页数据
 * 为 Top 10 分类生成对比数据
 * @see Requirements 6.5
 */

import { tools, categories } from '../src/config/tools';
import { getPopularComparisons, generateComparison } from '../src/lib/tool-comparison';

interface ComparisonData {
  tools: string[];
  category: string;
  comparison: ReturnType<typeof generateComparison>;
}

/**
 * 获取每个分类的热门工具对比
 */
function getCategoryComparisons(): ComparisonData[] {
  const comparisons: ComparisonData[] = [];
  
  for (const category of categories) {
    // 获取该分类的热门工具
    const categoryTools = tools
      .filter(t => t.category === category.id && t.popular)
      .slice(0, 4); // 取前 4 个热门工具
    
    if (categoryTools.length < 2) continue;
    
    // 生成两两对比
    for (let i = 0; i < categoryTools.length; i++) {
      for (let j = i + 1; j < categoryTools.length; j++) {
        const toolSlugs = [categoryTools[i].slug, categoryTools[j].slug];
        comparisons.push({
          tools: toolSlugs,
          category: category.id,
          comparison: generateComparison(toolSlugs),
        });
      }
    }
  }
  
  return comparisons;
}

/**
 * 生成对比页面报告
 */
function generateReport(): void {
  console.log('🔍 生成热门分类对比页数据...\n');
  
  const comparisons = getCategoryComparisons();
  const popularComparisons = getPopularComparisons(20);
  
  console.log('═'.repeat(60));
  console.log('热门分类对比页报告');
  console.log('═'.repeat(60));
  
  // 按分类分组统计
  const byCategory: Record<string, ComparisonData[]> = {};
  for (const comp of comparisons) {
    if (!byCategory[comp.category]) {
      byCategory[comp.category] = [];
    }
    byCategory[comp.category].push(comp);
  }
  
  console.log('\n📊 按分类统计:');
  console.log('─'.repeat(60));
  
  for (const [category, comps] of Object.entries(byCategory)) {
    console.log(`\n${category}: ${comps.length} 个对比页`);
    for (const comp of comps) {
      console.log(`  • ${comp.tools.join(' vs ')}`);
    }
  }
  
  console.log('\n📈 总计:');
  console.log('─'.repeat(60));
  console.log(`总对比页数: ${comparisons.length}`);
  console.log(`热门对比页数: ${popularComparisons.length}`);
  
  // 生成对比页 URL 列表
  console.log('\n🔗 对比页 URL 列表:');
  console.log('─'.repeat(60));
  
  for (const comp of comparisons.slice(0, 20)) {
    console.log(`/compare/${comp.tools.join('/')}`);
  }
  
  if (comparisons.length > 20) {
    console.log(`... 还有 ${comparisons.length - 20} 个对比页`);
  }
  
  console.log('\n═'.repeat(60));
  console.log('✅ 对比页数据生成完成！');
  console.log('═'.repeat(60));
}

// 运行报告生成
generateReport();
