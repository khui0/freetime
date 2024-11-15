<script lang="ts">
  import { onMount, type Snippet } from "svelte";

  let {
    interval = 1000,
    children,
    onupdate,
  }: {
    interval?: number;
    children?: Snippet;
    onupdate: Function;
  } = $props();

  onMount(() => {
    onupdate();
    setInterval(onupdate, interval);
  });
</script>

{@render children?.()}
