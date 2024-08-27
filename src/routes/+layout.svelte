<script lang="ts">
  import { title } from "$lib/store";
</script>

<svelte:head>
  <title>{$title}{$title ? " - " : ""}Free Time</title>
</svelte:head>

<slot></slot>
