<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Imports
  import { describe, it, expect } from 'vitest';
  import { getSkeletonVariant, SkeletonVariant } from './ToolSkeleton.svelte';

</script>

<!-- TODO: 手动转换 - No JSX return found -->
