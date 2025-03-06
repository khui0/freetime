<script lang="ts">
  import { normalizeCourse, update } from "$lib/utilities";

  let {
    title,
    description,
    course,
    date,
    completed = $bindable(false),
    onclick,
    oninput,
  }: {
    title: string;
    description: string;
    course: string;
    date: string;
    completed: boolean;
    onclick?: Function;
    oninput?: Function;
  } = $props();

  let warn: boolean = $state(false);

  update(() => {
    warn = new Date(date).getTime() < Date.now() && !completed;
  });
</script>

<div class="relative rounded-box border mb-4 last:mb-0">
  <div class="flex items-center gap-x-2 p-3" class:opacity-50={completed}>
    <input
      type="checkbox"
      class="checkbox"
      bind:checked={completed}
      onclick={() => {
        oninput?.();
      }}
    />
    <button
      class="flex-1 flex flex-wrap items-center gap-x-4 overflow-hidden"
      onclick={() => {
        onclick?.();
      }}
    >
      <p class:text-error={warn}>{title}</p>
      {#if description}
        <p
          class="text-sm text-base-content/50 text-start whitespace-nowrap overflow-ellipsis overflow-hidden"
        >
          {description}
        </p>
      {/if}
      {#if date}
        <p class="text-sm text-base-content/50">
          {new Date(date).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      {/if}
    </button>
    {#if course}
      <p class="w-fit h-fit px-2 py-0.5 rounded-lg text-xs bg-base-200">
        {normalizeCourse(course)}
      </p>
    {/if}
  </div>
</div>
