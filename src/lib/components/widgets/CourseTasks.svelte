<script lang="ts">
  let {
    title,
    number,
    class: classList = "",
  }: { title: string; number: string; class?: string } = $props();

  import { currentUser, ready, tasks } from "$lib/pocketbase";
  import { normalizeCourse } from "$lib/utilities";
  import { onMount } from "svelte";

  let id: string;
  let taskList: TaskData[] = $state([]);

  let course = $derived(normalizeCourse(`${title} ${number}`));
  let matched = $derived(
    taskList
      .filter((item) => item.course === course)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
  );

  onMount(() => {
    ready.subscribe(async (ready) => {
      if (!$currentUser || !ready) return;

      // Retrieve own schedule
      const t = $tasks.find((r) => r.user === $currentUser?.id);
      id = t?.id || "";
      taskList = structuredClone(t?.tasks);
    });
  });
</script>

{#if matched.length > 0}
  <a href="/tasks"><h3 class="font-bold {classList}">Tasks</h3></a>
  <div class="flex flex-col">
    {#each matched as task}
      <div class="text-sm flex justify-between flex-wrap">
        <p class="italic">{task.title}</p>
        {#if task.date}
          <p class="text-base-content/50">
            {new Date(task.date).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        {/if}
      </div>
    {/each}
  </div>
{/if}
