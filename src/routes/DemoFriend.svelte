<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    name,
    busy = false,
    children,
  }: {
    name: string;
    busy?: boolean;
    children?: Snippet;
  } = $props();
</script>

<div class="flex flex-col gap-4">
  <div class="flex rounded-box border bg-base-100">
    <div class="flex-1 flex items-center gap-2 py-2 px-4 rounded-l-box">
      <div
        class="w-3 h-3 rounded-full flex-none {busy
          ? 'bg-warning'
          : 'bg-success'} transition-colors"
      ></div>
      <p class="pl-1 py-2">{name}</p>
      <div class="px-2 text-sm text-base-content/50 flex justify-between w-full flex-wrap gap-x-4">
        {@render children?.()}
      </div>
    </div>
  </div>
</div>
