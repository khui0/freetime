<script lang="ts">
  import { normalizeCourse } from "$lib/utilities";

  let {
    title,
    description,
    course,
    completed = $bindable(false),
    onclick,
    oninput,
  }: {
    title: string;
    description: string;
    course: string;
    completed: boolean;
    onclick?: Function;
    oninput?: Function;
  } = $props();
</script>

<div class="rounded-box border p-3 mb-4 last:mb-0">
  <div class="flex items-center gap-x-2" class:opacity-50={completed}>
    <input
      type="checkbox"
      class="checkbox"
      bind:checked={completed}
      onclick={() => {
        oninput?.();
      }}
    />
    <button
      class="flex-1 flex flex-wrap items-center gap-x-4"
      onclick={() => {
        onclick?.();
      }}
    >
      <p>{title}</p>
      <p class="text-sm text-base-content/50">{description}</p>
    </button>
    {#if course}
      <p class="border border-base-content w-fit h-fit px-1.5 rounded-lg text-sm">
        {normalizeCourse(course)}
      </p>
    {/if}
  </div>
</div>
