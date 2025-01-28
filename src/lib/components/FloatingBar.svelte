<script lang="ts">
  import { settings } from "$lib/settings";
  import type { Snippet } from "svelte";

  let { children, shadow = true }: { children?: Snippet; shadow?: boolean } = $props();
</script>

<div
  class="fixed bottom-0 right-0 flex gap-2 justify-end m-4 items-center {shadow
    ? 'drop-shadow-lg'
    : ''} sm:pb-0 {$settings.tallNavigation === 'true' ? 'pb-[calc(49px+2rem)]' : 'pb-[49px]'}"
>
  {@render children?.()}
</div>
