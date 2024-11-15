<script lang="ts">
  let { days }: { days: boolean[] } = $props();

  const DAYS_OF_WEEK = ["M", "T", "W", "T", "F", "S", "S"];
</script>

<div class="flex gap-1 my-2">
  {#each DAYS_OF_WEEK as day, i}
    {#if i < 5 || days[5] || days[6]}
      <p
        class="border rounded-full w-8 h-8 flex items-center justify-center {days[i]
          ? 'bg-base-300'
          : 'border-base-300 bg-transparent'}"
      >
        {day}
      </p>
    {/if}
  {/each}
</div>
