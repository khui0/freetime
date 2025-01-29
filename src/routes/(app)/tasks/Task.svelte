<script lang="ts">
  import { fade } from "svelte/transition";

  let {
    title,
    description,
    course,
    completed = $bindable(false),
    onclick,
  }: {
    title: string;
    description: string;
    course: string;
    completed: boolean;
    onclick?: Function;
  } = $props();

  function normalizeCourse(course: string) {
    const COURSE_REGEX = /([A-z]{3}).*([0-9]{3})/;
    const parts = course.match(COURSE_REGEX);
    if (!parts) return course;
    return `${parts[1].toUpperCase()} ${parts[2]}`;
  }
</script>

<div in:fade={{ duration: 250 }} class="rounded-box border p-3 mb-4 last:mb-0">
  <div class="flex items-center gap-x-2" class:opacity-50={completed}>
    <input type="checkbox" class="checkbox" bind:checked={completed} />
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
