<script lang="ts">
  import { title } from "$lib/store";
  $title = "Tasks";

  import { currentUser, pb, ready, schedules, tasks } from "$lib/pocketbase";
  import { onMount, tick } from "svelte";

  import Alert from "$lib/components/dialog/Alert.svelte";
  import Confirm from "$lib/components/dialog/Confirm.svelte";
  import Modal from "$lib/components/dialog/Modal.svelte";
  import TopBar from "$lib/components/TopBar.svelte";
  import Task from "./Task.svelte";

  import PhDotsThreeVerticalBold from "~icons/ph/dots-three-vertical-bold";
  import PhPlus from "~icons/ph/plus";
  import PhChecks from "~icons/ph/checks";

  import { isMac } from "$lib/utilities";

  let alert: Alert | undefined = $state();
  let confirm: Confirm | undefined = $state();
  let taskModal: Modal | undefined = $state();

  let titleField: string = $state("");
  let descriptionField: string = $state("");
  let courseField: string = $state("");

  let error: string = $state("");
  let loading: boolean = $state(false);

  let ctrlKey = $derived(isMac() ? "⌘" : "Ctrl");

  let uniqueCourses: string[] = $state([]);

  let id: string;
  let taskList: TaskData[] = $state([]);

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

      // Retrieve own schedule
      const t = $tasks.find((r) => r.user === $currentUser?.id);
      id = t?.id || "";
      taskList = structuredClone(t?.tasks);
    });
  });

  function clearTaskModal() {
    titleField = "";
    descriptionField = "";
    courseField = "";
  }

  function clearCompleted() {
    confirm
      ?.prompt("Clear completed tasks", "Completed tasks will be removed permanently", "Clear")
      .then(() => {
        taskList = taskList.filter((item) => !item.completed);
        saveTasks();
      });
  }

  function createTask() {
    taskModal?.close();
    taskList[taskList.length] = {
      title: titleField,
      description: descriptionField,
      course: courseField,
      completed: false,
    };
    saveTasks();
    clearTaskModal();
  }

  $inspect(taskList);

  async function saveTasks() {
    loading = true;
    pb.collection("tasks")
      .update(id, { tasks: taskList })
      .then(() => {
        loading = false;
      })
      .catch(() => {
        loading = false;
        alert?.prompt("Unable to add task", "An unforeseen error was encountered.");
      });
  }

  function onkeydown(e: KeyboardEvent) {
    const ctrlKey = isMac() ? e.metaKey : e.ctrlKey;
    if (ctrlKey && e.key === "Enter") {
      e.preventDefault();
      createTask();
    }
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
      bind:value={titleField}
      {onkeydown}
    />
  </form>
  <div class="flex flex-col py-8">
    {#if taskList}
      {#each taskList.filter((item) => !item.completed) as task}
        <Task
          {...task}
          bind:completed={task.completed}
          oninput={async () => {
            await tick();
            saveTasks();
          }}
        />
      {/each}
      {#if taskList.some((item) => item.completed)}
        <h2 class="mb-2 mx-1 font-medium">Completed</h2>
      {/if}
      {#each taskList.filter((item) => item.completed) as task}
        <Task
          {...task}
          bind:completed={task.completed}
          oninput={async () => {
            await tick();
            saveTasks();
          }}
        />
      {/each}
    {/if}
  </div>
</div>
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
      bind:value={titleField}
      {onkeydown}
    />
    <textarea
      class="textarea textarea-bordered"
      placeholder="Description"
      bind:value={descriptionField}
      {onkeydown}
    ></textarea>
    <div class="flex flex-col input input-bordered h-auto py-2 gap-1">
      <input type="text" class="flex-1" placeholder="Course" bind:value={courseField} {onkeydown} />
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

<Alert bind:this={alert}></Alert>
<Confirm bind:this={confirm}></Confirm>
