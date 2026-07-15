<script lang="ts">
  import TypingSpeedTest from '@/components/tools/TypingSpeedTest.svelte';

  interface Props {
    translations: Record<string, unknown>;
  }

  let { translations }: Props = $props();
  let mounted = $state(true);
</script>

<button data-typing-fixture-toggle onclick={() => { mounted = !mounted; }}>Toggle</button>
{#if mounted}
  <TypingSpeedTest locale="en" {translations} />
{/if}
