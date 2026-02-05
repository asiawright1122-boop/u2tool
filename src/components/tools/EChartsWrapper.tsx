'use client';

/**
 * ECharts 包装组件
 * 
 * 提供统一的 ECharts 配置和懒加载支持。
 * 所有图表组件应该使用这个包装器而不是直接导入 echarts-for-react。
 */

import { forwardRef, useState, useEffect, useRef, useCallback } from 'react';
import type { EChartsOption, ECharts } from 'echarts';

// 加载状态组件
function ChartLoading({ height = '400px' }: { height?: string }) {
  return (
    <div 
      className="flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse"
      style={{ height, minHeight: '200px' }}
    >
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">加载图表...</p>
      </div>
    </div>
  );
}

// 错误状态组件
function ChartError({ onRetry, height = '400px' }: { onRetry?: () => void; height?: string }) {
  return (
    <div 
      className="flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg"
      style={{ height, minHeight: '200px' }}
    >
      <div className="text-center p-4">
        <svg className="w-10 h-10 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-red-600 dark:text-red-400 text-sm mb-2">图表加载失败</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            重试
          </button>
        )}
      </div>
    </div>
  );
}

export interface EChartsWrapperProps {
  option: EChartsOption;
  style?: React.CSSProperties;
  className?: string;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  theme?: string | object;
  onChartReady?: (chart: ECharts) => void;
  onEvents?: Record<string, (params: any) => void>;
  showLoading?: boolean;
  loadingOption?: object;
}

export interface EChartsWrapperRef {
  getEchartsInstance: () => ECharts | undefined;
}

/**
 * ECharts 包装组件
 * 使用动态导入实现真正的懒加载
 */
const EChartsWrapper = forwardRef<EChartsWrapperRef, EChartsWrapperProps>(
  function EChartsWrapper(props, ref) {
    const {
      option,
      style = { height: '400px', width: '100%' },
      className,
      notMerge = true,
      lazyUpdate = false,
      theme,
      onChartReady,
      onEvents,
      showLoading,
      loadingOption,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [ReactEChartsCore, setReactEChartsCore] = useState<any>(null);
    const [echarts, setEcharts] = useState<any>(null);
    const chartRef = useRef<any>(null);
    const mountedRef = useRef(true);

    // 暴露方法
    React.useImperativeHandle(ref, () => ({
      getEchartsInstance: () => chartRef.current?.getEchartsInstance?.(),
    }));

    // 懒加载 ECharts
    const loadECharts = useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 使用 requestIdleCallback 延迟加载
        await new Promise<void>((resolve) => {
          if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => resolve(), { timeout: 1000 });
          } else {
            setTimeout(resolve, 10);
          }
        });

        if (!mountedRef.current) return;

        // 并行加载所有依赖
        const [
          reactEChartsModule,
          echartsCore,
          { CanvasRenderer },
          charts,
          components,
          features,
        ] = await Promise.all([
          import('echarts-for-react/lib/core'),
          import('echarts/core'),
          import('echarts/renderers'),
          import('echarts/charts'),
          import('echarts/components'),
          import('echarts/features'),
        ]);

        if (!mountedRef.current) return;

        // 注册所有组件
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
          components.SingleAxisComponent,
          features.LabelLayout,
          features.UniversalTransition,
          CanvasRenderer,
        ]);

        if (!mountedRef.current) return;

        setReactEChartsCore(() => reactEChartsModule.default);
        setEcharts(echartsCore);
        setIsLoading(false);
      } catch (err) {
        if (mountedRef.current) {
          console.error('Failed to load ECharts:', err);
          setError(err instanceof Error ? err : new Error('Failed to load ECharts'));
          setIsLoading(false);
        }
      }
    }, []);

    // 初始化
    useEffect(() => {
      mountedRef.current = true;
      loadECharts();

      return () => {
        mountedRef.current = false;
      };
    }, [loadECharts]);

    // 获取高度
    const height = typeof style?.height === 'string' ? style.height : '400px';

    if (error) {
      return <ChartError onRetry={loadECharts} height={height} />;
    }

    if (isLoading || !ReactEChartsCore || !echarts) {
      return <ChartLoading height={height} />;
    }

    return (
      <ReactEChartsCore
        ref={chartRef}
        echarts={echarts}
        option={option}
        style={style}
        className={className}
        notMerge={notMerge}
        lazyUpdate={lazyUpdate}
        theme={theme}
        onChartReady={onChartReady}
        onEvents={onEvents}
        showLoading={showLoading}
        loadingOption={loadingOption}
      />
    );
  }
);

// 需要导入 React
import React from 'react';

export default EChartsWrapper;

// 导出类型
export type { EChartsOption, ECharts };
