/**
 * 核心类型定义
 */

export interface WebVitalsReport {
  ttfb: number
  lcp: number
  inp: number
  cls: number
  fcp: number
  recommendations: string[]
}

export interface MiddlewareReport {
  executionTime: number
  localeDetectionTime: number
  geoLookupTime: number
  rewriteTime: number
  codeSize: number
  bottlenecks: Bottleneck[]
}

export interface Bottleneck {
  type: 'locale-detection' | 'geo-lookup' | 'rewrite' | 'other'
  duration: number
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
}

export interface TranslationReport {
  totalSize: number
  loadTime: number
  filesAnalyzed: number
  largeFiles: Array<{ path: string; size: number }>
  recommendations: string[]
}

export interface OptimizationResult {
  success: boolean
  changes: string[]
  estimatedImprovement: number
  warnings: string[]
}

export interface DiagnosticReport {
  id: string
  timestamp: Date
  domain: string
  performance: {
    webVitals?: WebVitalsReport
    middleware?: MiddlewareReport
    translations?: TranslationReport
  }
  issues: ConfigIssue[]
  recommendations: Recommendation[]
  priorityScore: number
  estimatedImpact: 'high' | 'medium' | 'low'
}

export interface ConfigIssue {
  id: string
  category: 'performance' | 'configuration' | 'compatibility'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  affectedArea: string
  detectedAt: Date
}

export interface Recommendation {
  id: string
  relatedIssues: string[]
  priority: number
  title: string
  description: string
  implementation: string
  estimatedEffort: 'low' | 'medium' | 'high'
  estimatedImpact: 'low' | 'medium' | 'low'
  codeExample?: string
}
