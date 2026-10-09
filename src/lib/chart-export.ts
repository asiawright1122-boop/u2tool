import type { ECharts } from 'echarts';
import SVGPainter from 'zrender/lib/svg/Painter.js';

/** Export the current layout, including word-cloud placement and graph pan/zoom.
 * Canvas getDataURL({type:'svg'}) silently returns PNG. An isolated SVG painter
 * serializes the existing display list without rerunning a randomized layout.
 * This adapter is intentionally limited to the two recovery chart tools.
 */
export function getChartExportUrl(chart: ECharts, format: 'png' | 'svg', backgroundColor: string): string {
  if (format === 'png') {
    return chart.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor });
  }
  // ECharts bundles a nominal Storage type in its .d.ts; at runtime this is
  // the same locked zrender 6.1.0 instance. Keep the type bridge at this seam.
  const storage = chart.getZr().storage as unknown as ConstructorParameters<typeof SVGPainter>[1];
  const painter = new SVGPainter(document.createElement('div'), storage, {
    width: chart.getWidth(), height: chart.getHeight(), ssr: true,
  });
  try {
    painter.setBackgroundColor(backgroundColor);
    const svg = painter.renderToString({ cssAnimation: false, cssEmphasis: false });
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  } finally {
    // Dispose only this detached painter, never the live chart or its storage.
    painter.dispose();
  }
}
