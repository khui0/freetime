<script lang="ts">
  import { title } from "$lib/store";
</script>

<svelte:head>
  <title>{$title}{$title ? " - " : ""}Freetime</title>
  <meta
    name="description"
    content="Social college schedule viewer for Stony Brook University. Share your class schedule with your friends! Find when everyone's free and easily plan meetups!"
  />
</svelte:head>

<slot></slot>
