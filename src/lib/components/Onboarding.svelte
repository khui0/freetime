<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  let ready: boolean = false;

  onMount(() => {
    ready = true;
  });
</script>

<div class="fixed inset-0 z-50 bg-base-100">
  <div class="flex flex-col gap-4 items-center justify-center p-10 h-full">
    {#if ready}
      <div in:fade={{ duration: 1000 }} class="text-center">
        <h1 class="text-2xl font-bold">Welcome to SB Freetime</h1>
      </div>
      <p in:fade={{ duration: 1000, delay: 250 }}>Start by adding your schedule</p>
      <a in:fade={{ duration: 1000, delay: 500 }} href="/edit" class="btn btn-accent">
        Add schedule
      </a>
    {/if}
  </div>
</div>
