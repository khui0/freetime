<script lang="ts">
  import { title } from "$lib/store";
</script>

<svelte:head>
  <title>{$title}{$title ? " - " : ""}Freetime</title>
  <meta
    name="description"
    content="Social schedule viewer for Stony Brook University! Navigate to your classes, see when they start
    (and end), and share it with your friends!"
  />
</svelte:head>

<div class="sticky top-0 bg-accent p-2 text-center text-sm">
  <p>Freetime's backend is currently down. This will be restored soon!</p>
</div>
<slot></slot>
