<script lang="ts">
  import { title } from "$lib/store";
  $title = "Tasks";

  import { currentUser, pb, ready, schedules } from "$lib/pocketbase";
  import { onMount } from "svelte";

  import Confirm from "$lib/components/dialog/Confirm.svelte";
  import Modal from "$lib/components/dialog/Modal.svelte";
  import TopBar from "$lib/components/TopBar.svelte";
  import Task from "./Task.svelte";

  import PhDotsThreeVerticalBold from "~icons/ph/dots-three-vertical-bold";
  import PhPlus from "~icons/ph/plus";
  import PhChecks from "~icons/ph/checks";

  import { isMac } from "$lib/utilities";

  let confirm: Confirm | undefined = $state();
  let taskModal: Modal | undefined = $state();

  let usernameField: string = $state("");
  let descriptionField: string = $state("");
  let courseField: string = $state("");

  let error: string = $state("");
  let loading: boolean = $state(false);

  let ctrlKey = $derived(isMac() ? "⌘" : "Ctrl");

  let uniqueCourses: string[] = $state([]);

  onMount(() => {
    ready.subscribe(async (ready) => {
      if (!$currentUser || !ready) return;

      // Retrieve own schedule
      const schedule = $schedules.find((r) => r.user === $currentUser?.id)?.schedule;
      uniqueCourses = [
        ...new Set(
          schedule.map((course: CalendarEvent) => `${course.title.toUpperCase()} ${course.number}`),
        ),
      ] as string[];
    });
  });

  function clearTaskModal() {
    usernameField = "";
    descriptionField = "";
    courseField = "";
  }

  function clearCompleted() {
    confirm
      ?.prompt("Clear completed tasks", "Completed tasks will be removed permanently", "Clear")
      .then(() => {
        console.log("hi");
      });
  }

  function createTask() {
    taskModal?.close();
    clearTaskModal();
  }
</script>

<TopBar>
  <h2 class="text-2xl font-bold tracking-tight">Tasks</h2>
  <div class="flex gap-2 flex-wrap justify-end">
    <button class="btn btn-sm" onclick={taskModal?.show}>
      <PhPlus></PhPlus>
      New task
    </button>
    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn btn-sm btn-square">
        <PhDotsThreeVerticalBold></PhDotsThreeVerticalBold>
      </div>
      <ul
        role="menu"
        tabindex="0"
        class="dropdown-content my-2 menu bg-base-100 border rounded-box z-[1] w-52 p-2 shadow-lg"
      >
        <li>
          <button onclick={clearCompleted}>
            <PhChecks></PhChecks>Clear completed
          </button>
        </li>
      </ul>
    </div>
  </div>
</TopBar>
<div class="flex flex-col px-4 w-[min(100%,800px)] mx-auto">
  <form
    class="flex"
    onsubmit={(e) => {
      e.preventDefault();
      taskModal?.show();
    }}
  >
    <input
      type="text"
      class="input input-bordered mt-4 flex-1"
      placeholder="Add task"
      bind:value={usernameField}
    />
  </form>
  <div class="flex flex-col py-8">
    <Task title="Testing" description="testing" course="cse114" completed={false} />
  </div>
</div>

<svelte:window
  onkeydown={(e: KeyboardEvent) => {
    const ctrlKey = isMac() ? e.metaKey : e.ctrlKey;
    if (ctrlKey && e.key === "Enter") {
      e.preventDefault();
      createTask();
    }
  }}
/>

<Modal
  bind:this={taskModal}
  title="New task"
  onshow={() => {
    error = "";
  }}
>
  <div class="flex flex-col gap-4">
    <input
      type="text"
      class="input input-bordered"
      placeholder="Title"
      bind:value={usernameField}
    />
    <textarea
      class="textarea textarea-bordered"
      placeholder="Description"
      bind:value={descriptionField}
    ></textarea>
    <div class="flex flex-col input input-bordered h-auto py-2 gap-1">
      <input type="text" class="flex-1" placeholder="Course" bind:value={courseField} />
      <div class="flex flex-wrap gap-2 -mx-2">
        {#each uniqueCourses as course}
          <button
            class="btn btn-xs"
            onclick={() => {
              courseField = course;
            }}
          >
            {course}
          </button>
        {/each}
      </div>
    </div>
    <div class="flex justify-end gap-2">
      <button class="btn btn-sm hover:btn-accent" onclick={createTask}>
        {#if !loading}
          Create task ({ctrlKey} + Enter)
        {:else}
          <span class="loading loading-spinner loading-sm"></span>
        {/if}
      </button>
    </div>
  </div>
</Modal>

<Confirm bind:this={confirm}></Confirm>
