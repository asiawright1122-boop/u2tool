export type ToolCategory =
  | 'text'
  | 'encoding'
  | 'generators'
  | 'converters'
  | 'development'
  | 'security'
  | 'network'
  | 'image'
  | 'math'
  | 'charts'
  | 'office'
  | 'lifestyle'
  | 'finance'
  | 'fun';

export interface Tool {
  slug: string;
  category: ToolCategory;
  icon: string;
  component: string;
  popular?: boolean;
}
