<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<div class="flex items-center justify-center h-full p-10">
  <div class="w-[min(100%,400px)]">
    {@render children()}
  </div>
</div>
