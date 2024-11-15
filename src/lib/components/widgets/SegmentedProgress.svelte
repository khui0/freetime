<script lang="ts">
  let {
    value,
    max,
    progress = 100,
    class: classList,
  }: {
    value: number;
    max: number;
    progress?: number;
    class?: string;
  } = $props();
</script>

<div
  class="grid gap-1 h-5 w-full rounded-full overflow-hidden {classList}"
  style="grid-template-columns: repeat({max}, 1fr);"
>
  {#each Array(max) as _, i}
    {@const inProgress = progress < 100 && i === value}
    <div class="rounded-md h-full bg-base-200 overflow-hidden">
      <div
        class="bg-accent h-full transition-[width] rounded-sm"
        style="width: {i < value ? 100 : inProgress ? progress : 0}%;"
      ></div>
    </div>
  {/each}
</div>
