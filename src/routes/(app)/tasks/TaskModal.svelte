<script lang="ts">
  import Modal from "$lib/components/dialog/Modal.svelte";
  import { isMac } from "$lib/utilities";

  export function show() {
    editMode = false;
    modal?.show();
    description = "";
    course = "";
  }

  export function showEdit() {
    editMode = true;
    modal?.show();
  }

  export function close() {
    modal?.close();
  }

  let modal: Modal | undefined = $state();
  let editMode: boolean = $state(false);
  let ctrlKey = $derived(isMac() ? "⌘" : "Ctrl");

  let {
    title = $bindable(""),
    description = $bindable(""),
    course = $bindable(""),
    date = $bindable(""),
    courses,
    onsubmit,
  }: {
    title: string;
    description: string;
    course: string;
    date: string;
    courses: string[];
    onsubmit?: Function;
  } = $props();

  function onkeydown(e: KeyboardEvent) {
    const ctrlKey = isMac() ? e.metaKey : e.ctrlKey;
    if (ctrlKey && e.key === "Enter") {
      e.preventDefault();
      onsubmit?.();
    }
  }
</script>

<Modal bind:this={modal} title={editMode ? "Edit task" : "New task"}>
  <div class="flex flex-col gap-4">
    <input
      type="text"
      class="input input-bordered"
      placeholder="Title"
      bind:value={title}
      {onkeydown}
    />
    <textarea
      class="textarea textarea-bordered"
      placeholder="Description"
      bind:value={description}
      {onkeydown}
    ></textarea>
    <div class="flex flex-col input input-bordered h-auto py-2 gap-1">
      <input type="text" class="flex-1" placeholder="Course" bind:value={course} {onkeydown} />
      <div class="flex flex-wrap gap-2 -mx-2">
        {#each courses as item}
          <button
            class="btn btn-xs"
            onclick={() => {
              course = item;
            }}
          >
            {item}
          </button>
        {/each}
      </div>
    </div>
    <input type="datetime-local" class="input input-bordered" bind:value={date} />
    <div class="flex justify-end gap-2">
      <button
        class="btn btn-sm hover:btn-accent"
        onclick={() => {
          onsubmit?.();
        }}
      >
        {editMode ? "Edit" : "Create"} task ({ctrlKey} + Enter)
      </button>
    </div>
  </div>
</Modal>
