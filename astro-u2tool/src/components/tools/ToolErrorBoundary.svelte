<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Types
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

</script>

<!-- TODO: 手动转换 - No JSX return found -->
