<script lang="ts">
  import { title } from "$lib/store";
  $title = "Edit schedule";

  import { settings } from "$lib/settings";
  import { ready, pb, currentUser, schedules } from "$lib/pocketbase";
  import { fade, fly } from "svelte/transition";
  import { beforeNavigate, goto } from "$app/navigation";

  import PhArrowLeft from "~icons/ph/arrow-left";

  import TopBar from "$lib/components/TopBar.svelte";
  import Event from "./Event.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import Alert from "$lib/components/Alert.svelte";
  import Confirm from "$lib/components/Confirm.svelte";
  import { onMount } from "svelte";

  import { parse, isMac } from "$lib/utilities";

  let modal: Modal;
  let importText: string;

  let alert: Alert;
  let confirm: Confirm;

  let id: string;
  let events: CalendarEvent[] = [];

  let leaveAnyways: boolean = false;

  onMount(async () => {
    ready.subscribe(async (ready) => {
      if (!$currentUser || !ready) return;

      // Retrieve own schedule
      const schedule = $schedules.find((r) => r.user === $currentUser?.id);
      id = schedule?.id || "";
      events = structuredClone(schedule?.schedule);
    });
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
    const valid = events.every((event) => isValid(event)) || events.length === 0;
    if (valid) {
      pb.collection("schedules")
        .update(id, { schedule: events })
        .then(() => {
          saved = true;
        })
        .catch(() => {
          alert.prompt("Unable to save schedule", "An unforeseen error was encountered.");
        });
    } else {
      alert.prompt("Invalid data", "One or more classes have missing fields!");
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

  function beforeUnload(e: BeforeUnloadEvent) {
    if (!saved) {
      e.preventDefault();
      return "";
    }
  }

  beforeNavigate(async ({ to, cancel }) => {
    if (!saved && to && !leaveAnyways) {
      cancel();
      confirm
        .prompt("Unsaved changes", "Are you sure you want to leave? Changes will be lost!", "Leave")
        .then(() => {
          leaveAnyways = true;
          goto(to.url.pathname);
        })
        .catch(() => {});
    }
  });
</script>

<svelte:window on:beforeunload={beforeUnload} />

<TopBar>
  <button
    class="btn btn-square btn-sm rounded-full"
    on:click={() => {
      history.back();
    }}
  >
    <PhArrowLeft></PhArrowLeft>
  </button>
  <div class="flex gap-2 flex-wrap justify-end">
    <button class="btn btn-sm" on:click={modal.show}>Import from SOLAR</button>
    <button class="btn btn-sm" on:click={addEvent}>Add class</button>
  </div>
</TopBar>
<div
  class="grid grid-cols-1 {events.length > 0
    ? 'md:grid-cols-2'
    : ''} gap-4 overflow-auto p-4 flex-1 pb-16"
  use:scrollToBottom={events}
>
  {#if events.length > 0}
    {#each events as event, i}
      <div in:fade|global={{ duration: 250, delay: 50 * i }}>
        <Event
          index={i}
          bind:data={event}
          on:delete={() => {
            events = events.filter((item) => item !== event);
            saved = false;
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
  class="fixed bottom-0 right-0 flex gap-2 justify-end m-4 items-center drop-shadow-lg {$settings.tallNavigation ===
  'true'
    ? 'pb-[calc(49px+2rem)]'
    : 'pb-[49px]'}"
>
  {#if !saved}
    <div in:fly={{ duration: 250, y: 10 }} out:fly={{ duration: 250, y: 10 }} class="relative">
      <div class="bg-accent absolute inset-0 z-[-1] rounded-btn animate-ping"></div>
      <button class="btn btn-sm btn-accent" on:click={save}>Save</button>
    </div>
  {/if}
</div>

<Alert bind:this={alert}></Alert>
<Confirm bind:this={confirm}></Confirm>
<Modal title="Import schedule" bind:this={modal}>
  {@const ctrlKey = isMac() ? "⌘" : "Ctrl"}
  <p>
    1. Log into SOLAR. Then, go to <code>
      Student Records & Registration > Enrollment > My Class Schedule
    </code>
  </p>
  <p>
    2. Click <code>Printer Friendly Page</code> at the bottom of the page
  </p>
  <p>3. Select all the text on the page</p>
  <p><kbd class="kbd">{ctrlKey}</kbd> + <kbd class="kbd">A</kbd></p>
  <p>4. Copy it</p>
  <p><kbd class="kbd">{ctrlKey}</kbd> + <kbd class="kbd">C</kbd></p>
  <p>5. Paste it into the textbox below.</p>
  <p><kbd class="kbd">{ctrlKey}</kbd> + <kbd class="kbd">V</kbd></p>
  <label class="flex flex-col text-xs my-2">
    <span class="px-2">Paste text from SOLAR</span>
    <textarea class="textarea textarea-bordered resize-none" rows="5" bind:value={importText}
    ></textarea>
  </label>
  <p class="text-sm">NOTE: This may not work reliably</p>
  <button
    class="btn btn-sm"
    on:click={() => {
      events = parse(importText) || [];
      importText = "";
      saved = false;
      modal.close();
      alert.prompt(
        "Attempted to import schedule",
        "Information may not be accurate, you may need to manually edit some fields. Changes are not applied until you click save.",
      );
    }}>Import</button
  >
</Modal>

<style>
  code {
    @apply bg-base-200 rounded-md text-sm font-bold px-1 py-0.5;
  }
</style>
