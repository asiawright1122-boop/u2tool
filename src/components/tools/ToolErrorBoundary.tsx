'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

/**
 * ToolErrorBoundary - 工具组件错误边界
 * 
 * 捕获工具组件加载或运行时的错误，显示友好的错误信息并提供重试功能
 * 
 * @see Requirements 1.4
 */

interface Props {
  children: ReactNode;
  /** 工具名称，用于错误信息显示 */
  toolName?: string;
  /** 自定义错误回调 */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ToolErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    
    // 调用自定义错误回调
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // 在开发环境下输出错误信息
    if (process.env.NODE_ENV === 'development') {
      console.error('ToolErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div 
          className="tool-error-boundary min-h-[300px] flex items-center justify-center"
          role="alert"
          aria-live="assertive"
        >
          <div className="text-center p-6 max-w-md">
            {/* 错误图标 */}
            <div className="text-5xl mb-4" aria-hidden="true">
              ⚠️
            </div>
            
            {/* 错误标题 */}
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {this.props.toolName 
                ? `Failed to load ${this.props.toolName}`
                : 'Something went wrong'
              }
            </h2>
            
            {/* 错误描述 */}
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              An error occurred while loading this tool. Please try again.
            </p>
            
            {/* 开发环境显示错误详情 */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <summary className="cursor-pointer text-red-600 dark:text-red-400 font-medium">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs text-red-800 dark:text-red-300 overflow-auto max-h-40">
                  {this.state.error.message}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            {/* 重试按钮 */}
            <button
              onClick={this.handleRetry}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Retry loading the tool"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
