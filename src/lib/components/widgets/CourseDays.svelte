<script lang="ts">
  let { days }: { days: boolean[] } = $props();

  const DAYS_OF_WEEK = ["M", "T", "W", "T", "F", "S", "S"];
</script>

<div class="flex gap-1 my-2">
  {#each DAYS_OF_WEEK as day, i}
    {#if i < 5 || days[5] || days[6]}
      <p
        class="font-bold rounded-lg w-8 h-8 flex items-center bg-base-300 justify-center {days[i]
          ? ''
          : 'opacity-25'}"
      >
        {day}
      </p>
    {/if}
  {/each}
</div>
