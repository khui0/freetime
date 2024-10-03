<script lang="ts">
  export let value: number;
  export let max: number;
</script>

<div class="grid gap-1 h-6 w-full" style="grid-template-columns: repeat({max}, 1fr);">
  {#each Array(max) as _, i}
    <div
      class="rounded-md h-full {i < value ? 'bg-accent' : 'bg-base-200'} transition-colors"
    ></div>
  {/each}
</div>
