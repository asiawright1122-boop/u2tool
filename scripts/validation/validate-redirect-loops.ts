import fs from 'node:fs';
import path from 'node:path';

const REDIRECTS_CONFIG_PATH = path.resolve(process.cwd(), 'src/config/gsc-redirects.json');
const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

function getCorePath(p: string): string {
  if (!p) return '';
  // Remove query parameters or hash
  let clean = p.split('?')[0].split('#')[0];
  
  // Normalize slashes
  clean = clean.replace(/\/+/g, '/');
  
  // Strip leading and trailing slashes for segmentation
  const segments = clean.split('/').filter(Boolean);
  
  let coreSegments = segments;
  if (segments.length > 0 && LOCALES.includes(segments[0].toLowerCase())) {
    coreSegments = segments.slice(1);
  }
  
  const corePath = '/' + coreSegments.join('/').toLowerCase();
  return corePath === '/' ? '/' : corePath.replace(/\/$/, '');
}

function main() {
  console.log('🏁 Starting Redirect Loop Validation...');

  if (!fs.existsSync(REDIRECTS_CONFIG_PATH)) {
    console.error(`❌ Error: Config file not found at: ${REDIRECTS_CONFIG_PATH}`);
    process.exit(1);
  }

  let redirectsData: Record<string, string>;
  try {
    const rawContent = fs.readFileSync(REDIRECTS_CONFIG_PATH, 'utf-8');
    redirectsData = JSON.parse(rawContent);
  } catch (err: any) {
    console.error('❌ Error: Failed to parse redirects config JSON:', err.message);
    process.exit(1);
  }

  // 1. Build adjacency list of core paths
  const graph = new Map<string, string>();
  for (const [source, target] of Object.entries(redirectsData)) {
    const srcCore = getCorePath(source);
    const tgtCore = getCorePath(target);
    
    if (!srcCore || !tgtCore) {
      console.warn(`⚠️ Warning: Skipping invalid mapping entry [${source} -> ${target}]`);
      continue;
    }
    
    if (graph.has(srcCore)) {
      console.warn(`⚠️ Warning: Duplicate redirect source detected for core path: ${srcCore}`);
    }
    graph.set(srcCore, tgtCore);
  }

  // 2. DFS Cycle Detection (0=Unvisited, 1=Visiting, 2=Visited)
  const colors = new Map<string, number>();
  const pathStack: string[] = [];
  let hasCycles = false;

  function dfs(node: string): boolean {
    colors.set(node, 1); // Mark as visiting
    pathStack.push(node);

    const nextNode = graph.get(node);
    if (nextNode) {
      const nextColor = colors.get(nextNode) || 0;
      if (nextColor === 1) {
        // Cycle found!
        const cycleStartIndex = pathStack.indexOf(nextNode);
        const cyclePath = pathStack.slice(cycleStartIndex).concat(nextNode);
        console.error(`❌ Loop detected: ${cyclePath.join(' -> ')}`);
        hasCycles = true;
        return true;
      } else if (nextColor === 0) {
        if (dfs(nextNode)) {
          return true;
        }
      }
    }

    pathStack.pop();
    colors.set(node, 2); // Mark as visited
    return false;
  }

  for (const node of graph.keys()) {
    if ((colors.get(node) || 0) === 0) {
      dfs(node);
    }
  }

  if (hasCycles) {
    console.error('\n❌ Build blocked: Found redirect loop(s) in configuration. Please fix the loops above.');
    process.exit(1);
  }

  // 3. Multi-hop (Chain) redirect detection
  let chainsCount = 0;
  for (const startNode of graph.keys()) {
    const chain: string[] = [startNode];
    let current = startNode;
    
    while (graph.has(current)) {
      const next = graph.get(current)!;
      // Safeguard against cycles (already checked but good practice)
      if (chain.includes(next)) {
        break;
      }
      chain.push(next);
      current = next;
    }
    
    if (chain.length > 2) {
      chainsCount++;
      console.warn(`⚠️ Warning: Multi-hop redirect detected: ${chain.join(' -> ')}`);
      console.warn(`   Tip: Flatten this chain to: "${chain[0]} -> ${chain[chain.length - 1]}" to preserve link juice.`);
    }
  }

  console.log(`\n✅ Redirect Loop Validation passed. Verified ${graph.size} rules.`);
  if (chainsCount > 0) {
    console.log(`ℹ️ Found ${chainsCount} chain warning(s). It is recommended to flatten them but they are not blocking.`);
  }
}

main();
