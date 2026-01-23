'use client';

/**
 * 懒加载 ECharts 组件
 * 
 * 解决 ECharts 同步加载导致页面卡死的问题。
 * 使用动态导入和 Suspense 实现真正的懒加载。
 */

import { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import type { EChartsOption, ECharts } from 'echarts';

interface LazyEChartsProps {
  option: EChartsOption;
  style?: React.CSSProperties;
  className?: string;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  theme?: string | object;
  onChartReady?: (chart: ECharts) => void;
  onEvents?: Record<string, (params: any) => void>;
}

export interface LazyEChartsRef {
  getEchartsInstance: () => ECharts | null;
}

// 加载状态组件
function ChartLoading() {
  return (
    <div className="flex items-center justify-center h-full min-h-[300px] bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">加载图表中...</p>
      </div>
    </div>
  );
}

// 错误状态组件
function ChartError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex items-center justify-center h-full min-h-[300px] bg-red-50 dark:bg-red-900/20 rounded-lg">
      <div className="text-center">
        <p className="text-red-500 dark:text-red-400 mb-2">图表加载失败</p>
        <button
          onClick={onRetry}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
        >
          重试
        </button>
      </div>
    </div>
  );
}

const LazyECharts = forwardRef<LazyEChartsRef, LazyEChartsProps>(function LazyECharts(
  { option, style, className, notMerge = true, lazyUpdate = false, theme, onChartReady, onEvents },
  ref
) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [echarts, setEcharts] = useState<typeof import('echarts/core') | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ECharts | null>(null);
  const mountedRef = useRef(true);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    getEchartsInstance: () => chartInstance.current,
  }));

  // 加载 ECharts
  const loadECharts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 使用 requestIdleCallback 在空闲时加载
      await new Promise<void>((resolve) => {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => resolve(), { timeout: 2000 });
        } else {
          setTimeout(resolve, 0);
        }
      });

      if (!mountedRef.current) return;

      // 动态导入 ECharts
      const [echartsCore, { CanvasRenderer }] = await Promise.all([
        import('echarts/core'),
        import('echarts/renderers'),
      ]);

      if (!mountedRef.current) return;

      // 导入基础组件
      const [charts, components, features] = await Promise.all([
        import('echarts/charts'),
        import('echarts/components'),
        import('echarts/features'),
      ]);

      if (!mountedRef.current) return;

      // 注册组件
      echartsCore.use([
        charts.BarChart,
        charts.LineChart,
        charts.PieChart,
        charts.ScatterChart,
        charts.RadarChart,
        charts.FunnelChart,
        charts.GaugeChart,
        charts.HeatmapChart,
        charts.TreemapChart,
        charts.SankeyChart,
        charts.SunburstChart,
        charts.CandlestickChart,
        charts.BoxplotChart,
        charts.GraphChart,
        charts.TreeChart,
        charts.ParallelChart,
        charts.PictorialBarChart,
        charts.ThemeRiverChart,
        charts.CustomChart,
        charts.EffectScatterChart,
        charts.LinesChart,
        charts.MapChart,
        components.TitleComponent,
        components.TooltipComponent,
        components.GridComponent,
        components.LegendComponent,
        components.ToolboxComponent,
        components.DataZoomComponent,
        components.VisualMapComponent,
        components.TimelineComponent,
        components.CalendarComponent,
        components.GraphicComponent,
        components.MarkPointComponent,
        components.MarkLineComponent,
        components.MarkAreaComponent,
        components.DatasetComponent,
        components.TransformComponent,
        components.PolarComponent,
        components.RadarComponent,
        components.ParallelComponent,
        components.AriaComponent,
        features.LabelLayout,
        features.UniversalTransition,
        CanvasRenderer,
      ]);

      if (!mountedRef.current) return;

      setEcharts(echartsCore);
      setIsLoading(false);
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err : new Error('Failed to load ECharts'));
        setIsLoading(false);
      }
    }
  }, []);

  // 初始化加载
  useEffect(() => {
    mountedRef.current = true;
    loadECharts();

    return () => {
      mountedRef.current = false;
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [loadECharts]);

  // 初始化图表
  useEffect(() => {
    if (!echarts || !chartRef.current || isLoading) return;

    // 如果已有实例，先销毁
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    // 创建新实例
    chartInstance.current = echarts.init(chartRef.current, theme);
    chartInstance.current.setOption(option, notMerge);

    // 绑定事件
    if (onEvents) {
      Object.entries(onEvents).forEach(([eventName, handler]) => {
        chartInstance.current?.on(eventName, handler);
      });
    }

    // 回调
    if (onChartReady && chartInstance.current) {
      onChartReady(chartInstance.current);
    }

    // 响应式
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [echarts, isLoading, theme, onChartReady, onEvents, notMerge]);

  // 更新选项
  useEffect(() => {
    if (chartInstance.current && !isLoading) {
      chartInstance.current.setOption(option, notMerge);
    }
  }, [option, notMerge, isLoading]);

  if (error) {
    return <ChartError onRetry={loadECharts} />;
  }

  if (isLoading) {
    return <ChartLoading />;
  }

  return (
    <div
      ref={chartRef}
      style={style}
      className={className}
    />
  );
});

export default LazyECharts;
