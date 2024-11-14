<script lang="ts">
  export let value: number;
  export let max: number;
  export let progress: number = 0;
</script>

<div
  class="grid gap-1 h-5 w-full rounded-full overflow-hidden"
  style="grid-template-columns: repeat({max}, 1fr);"
>
  {#each Array(max) as _, i}
    {@const current = progress && i === value}
    <div class="rounded-md h-full bg-base-200 overflow-hidden">
      <div
        class="bg-accent h-full transition-[width] rounded-sm"
        style="width: {i < value ? 100 : current ? progress : 0}%;"
      ></div>
    </div>
  {/each}
</div>
