<script lang="ts">
  import { title } from "$lib/store";
  $title = "Tasks";

  import { currentUser, pb, ready, schedules, tasks } from "$lib/pocketbase";
  import { onMount } from "svelte";

  import Alert from "$lib/components/dialog/Alert.svelte";
  import Confirm from "$lib/components/dialog/Confirm.svelte";
  import TopBar from "$lib/components/TopBar.svelte";
  import Task from "./Task.svelte";

  import PhChecks from "~icons/ph/checks";
  import PhDotsThreeVerticalBold from "~icons/ph/dots-three-vertical-bold";
  import PhPlus from "~icons/ph/plus";

  import { endOfToday, isMac } from "$lib/utilities";
  import TaskModal from "./TaskModal.svelte";

  const TZO = new Date().getTimezoneOffset() * 60000;

  let alert: Alert | undefined = $state();
  let confirm: Confirm | undefined = $state();
  let taskModal: TaskModal | undefined = $state();

  let titleField: string = $state("");
  let descriptionField: string = $state("");
  let courseField: string = $state("");
  let dateField: string = $state(endOfToday());

  let loading: boolean = $state(false);

  let uniqueCourses: string[] = $state([]);

  let id: string;
  let taskList: TaskData[] = $state([]);

  let editing: number | null = $state(null);

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
    dateField = endOfToday();
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
      date: dateField,
      completed: false,
    };
    saveTasks();
    clearTaskModal();
  }

  function editTask(index: number) {
    taskModal?.close();
    taskList[index] = {
      title: titleField,
      description: descriptionField,
      course: courseField,
      date: dateField,
      completed: false,
    };
    saveTasks();
    clearTaskModal();
  }

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
    <button
      class="btn btn-sm"
      onclick={() => {
        editing = null;
        taskModal?.show();
      }}
    >
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
      editing = null;
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
      {#each taskList
        .filter((item) => !item.completed)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) as task}
        <Task
          {...task}
          bind:completed={task.completed}
          oninput={async () => {
            setTimeout(saveTasks, 500);
          }}
          onclick={() => {
            editing = taskList.indexOf(task);
            titleField = task.title;
            descriptionField = task.description;
            courseField = task.course;
            dateField = task.date;
            taskModal?.showEdit();
          }}
        />
      {/each}
      {#if taskList.some((item) => item.completed)}
        <h2 class="mb-2 mx-1 font-medium">Completed</h2>
      {/if}
      {#each taskList
        .filter((item) => item.completed)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) as task}
        <Task
          {...task}
          bind:completed={task.completed}
          oninput={async () => {
            setTimeout(saveTasks, 500);
          }}
        />
      {/each}
    {/if}
  </div>
</div>
<TaskModal
  bind:this={taskModal}
  bind:title={titleField}
  bind:description={descriptionField}
  bind:course={courseField}
  bind:date={dateField}
  courses={uniqueCourses}
  onsubmit={() => {
    if (editing !== null) {
      editTask(editing);
    } else {
      createTask();
    }
  }}
/>
<Alert bind:this={alert}></Alert>
<Confirm bind:this={confirm}></Confirm>
