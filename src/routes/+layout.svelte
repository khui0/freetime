<script lang="ts">
  import { title } from "$lib/store";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
  <title>{$title}{$title ? " - " : ""}Freetime</title>
  <meta
    name="description"
    content="Social schedule viewer for Stony Brook University! Navigate to your classes, see when they start
    (and end), and share it with your friends!"
  />
</svelte:head>

{@render children?.()}
