<script lang="ts">
  import { title } from "$lib/store";
  $title = "Edit schedule";

  import { settings } from "$lib/settings";
  import { pb, currentUser, ensureScheduleExists } from "$lib/pocketbase";
  import { fade } from "svelte/transition";

  import PhArrowLeft from "~icons/ph/arrow-left";
  import PhWarning from "~icons/ph/warning";

  import TopBar from "$lib/components/TopBar.svelte";
  import Event from "./Event.svelte";
  import Alert from "$lib/components/Alert.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import { onMount } from "svelte";

  import { parse } from "$lib/utilities";

  let modal: Modal;
  let importText: string;

  let alert: Alert;

  let id: string;
  let events: CalendarEvent[] = [];

  onMount(async () => {
    if (!$currentUser) return;
    await ensureScheduleExists();

    // Create record if it doesn't exist
    await pb
      .collection("schedules")
      .getFirstListItem(`user="${$currentUser?.id}"`)
      .catch(() => {
        pb.collection("schedules").create({ user: $currentUser?.id, schedule: [] });
      });

    // Load schedule from database
    const list = await pb.collection("schedules").getFullList();
    const schedule = list.find((record) => record.user === $currentUser?.id);
    id = schedule?.id || "";
    events = schedule?.schedule;
  });

  function addEvent() {
    // Create new empty event
    events[events.length] = {
      title: "",
      number: "",
      days: [false, false, false, false, false, false, false],
      from: "",
      to: "",
      location: "",
      room: "",
      type: "",
    };
    saved = false;
    scrollEnabled = true;
  }

  let saved: boolean = true;

  function save() {
    const valid = !events.some((event) => !isValid(event));
    if (events.length === 0) return;
    if (valid) {
      console.log(id);
      pb.collection("schedules")
        .update(id, { schedule: events })
        .then(() => {
          saved = true;
        })
        .catch(() => {
          alert.prompt("Unable to save schedule", "An unforeseen error was encountered.");
        });
    } else {
      alert.prompt("Invalid class", "One or more classes have missing fields!");
    }
  }

  function isValid(event: CalendarEvent) {
    return Object.values(event).every((value) => value !== "");
  }

  let scrollEnabled: boolean = false;

  const scrollToBottom = (_node: HTMLElement, _: any) => {
    return {
      update() {
        if (!scrollEnabled) return;
        window.scroll({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      },
    };
  };
</script>

<TopBar>
  <button
    class="btn btn-square btn-sm rounded-full"
    on:click={() => {
      history.back();
    }}
  >
    <PhArrowLeft></PhArrowLeft>
  </button>
  <div class="flex gap-2">
    <button class="btn btn-sm" on:click={modal.show}>Import from SOLAR</button>
    <button class="btn btn-sm" on:click={addEvent}>Add class</button>
  </div>
</TopBar>
<div
  class="grid grid-cols-1 {events.length > 0
    ? 'md:grid-cols-2'
    : ''} gap-4 overflow-auto p-4 flex-1 mb-24"
  use:scrollToBottom={events}
>
  {#if events.length > 0}
    {#each events as event, i}
      <div in:fade|global={{ duration: 250, delay: 50 * i }} out:fade|global={{ duration: 250 }}>
        <Event
          bind:data={event}
          on:delete={() => {
            events = events.filter((item) => item !== event);
          }}
          on:input={() => {
            saved = false;
          }}
        ></Event>
      </div>
    {/each}
  {:else}
    <p class="text-base-content/50 text-xl text-center">Add your first class!</p>
  {/if}
</div>
<div
  class="fixed bottom-0 right-0 flex gap-2 justify-end m-4 items-center {$settings.tallNavigation ===
  'true'
    ? 'pb-[calc(49px+2rem)]'
    : 'pb-[49px]'}"
>
  {#if !saved}
    <p
      in:fade={{ duration: 250 }}
      class="px-3 min-h-8 bg-base-200 rounded-btn text-sm flex items-center gap-2"
    >
      <span><PhWarning></PhWarning></span>You have unsaved changes
    </p>
  {/if}
  <button class="btn btn-sm btn-accent" on:click={save}>Save</button>
</div>

<Alert bind:this={alert}></Alert>
<Modal title="Import schedule" bind:this={modal}>
  <p>
    1. In SOLAR, go to <code>Student Records & Registration > Enrollment > My Class Schedule</code>
  </p>
  <p>2. Select all the text on the page and copy</p>
  <label class="flex flex-col text-xs my-2">
    <span class="px-2">Paste text from SOLAR</span>
    <textarea class="textarea textarea-bordered resize-none" rows="5" bind:value={importText}
    ></textarea>
  </label>
  <button
    class="btn btn-sm"
    on:click={() => {
      events = parse(importText) || [];
      importText = "";
      console.log(events)
      saved = false;
      modal.close();
      alert.prompt(
        "Attempted to import schedule",
        "Information may not be accurate, you may need to manually edit some fields. Changes are not applied until you click save.",
      );
    }}>Import</button
  >
</Modal>
