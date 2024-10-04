<script lang="ts">
  export let value: number;
  export let max: number;
  export let inProgress: boolean = false;
</script>

<div class="grid gap-1 h-6 w-full" style="grid-template-columns: repeat({max}, 1fr);">
  {#each Array(max) as _, i}
    {@const blink = inProgress && i === value}
    <div
      class="rounded-lg h-full {i <= value ? 'bg-accent' : 'bg-base-200'} transition-colors"
      class:animate-pulse={blink}
    ></div>
  {/each}
</div>
