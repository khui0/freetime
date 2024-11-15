<script lang="ts">
  let {
    progress,
    remaining,
  }: {
    progress: number;
    remaining: {
      hours: string;
      minutes: string;
    };
  } = $props();
</script>

<div
  class="radial-progress bg-base-200 border-base-200 text-base-content border-4 text-sm flex-shrink-0"
  style="--value:{progress}; --size:3rem; --thickness:0.25rem;"
  role="progressbar"
>
  <p>{remaining?.hours}<span class="animate-pulse">:</span>{remaining?.minutes}</p>
</div>
