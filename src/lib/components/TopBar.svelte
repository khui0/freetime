<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<div
  class="sticky top-0 p-4 bg-base-100/50 backdrop-blur-lg z-10 flex gap-1 justify-between items-center border-b"
>
  {@render children?.()}
</div>
