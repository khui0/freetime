<script lang="ts">
  import { title } from "$lib/store";
  $title = "Edit schedule";

  import { beforeNavigate, goto } from "$app/navigation";
  import { currentUser, pb, ready, schedules } from "$lib/pocketbase";
  import { fly } from "svelte/transition";

  import PhArrowLeft from "~icons/ph/arrow-left";
  import PhPlus from "~icons/ph/plus";

  import Alert from "$lib/components/dialog/Alert.svelte";
  import Confirm from "$lib/components/dialog/Confirm.svelte";
  import Modal from "$lib/components/dialog/Modal.svelte";
  import TopBar from "$lib/components/TopBar.svelte";
  import { onMount } from "svelte";
  import Event from "./Event.svelte";

  import { isMac, parse } from "$lib/utilities";
  import FloatingBar from "$lib/components/FloatingBar.svelte";

  let modal: Modal | undefined = $state();
  let importText: string = $state("");

  let alert: Alert | undefined = $state();
  let confirm: Confirm | undefined = $state();

  let id: string;
  let events: CalendarEvent[] = $state([]);

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
      online: false,
    };
    saved = false;
    scrollEnabled = true;
  }

  let saved: boolean = $state(true);

  function save() {
    const valid = events.every((event) => isValid(event)) || events.length === 0;
    if (valid) {
      pb.collection("schedules")
        .update(id, { schedule: events })
        .then(() => {
          saved = true;
        })
        .catch(() => {
          alert?.prompt("Unable to save schedule", "An unforeseen error was encountered.");
        });
    } else {
      alert?.prompt("Invalid data", "One or more classes have missing fields!");
    }
  }

  function isValid(event: CalendarEvent) {
    return (
      event.title !== "" &&
      event.number !== "" &&
      event.type !== "" &&
      event.from !== "" &&
      event.to !== ""
    );
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
        ?.prompt(
          "Unsaved changes",
          "Are you sure you want to leave? Changes will be lost!",
          "Leave",
        )
        .then(() => {
          leaveAnyways = true;
          goto(to.url.pathname);
        })
        .catch(() => {});
    }
  });
</script>

<svelte:window onbeforeunload={beforeUnload} />

<TopBar>
  <button
    class="btn btn-square btn-sm rounded-full"
    onclick={() => {
      history.back();
    }}
  >
    <PhArrowLeft></PhArrowLeft>
  </button>
  <div class="flex gap-2 flex-wrap justify-end">
    <button class="btn btn-sm" onclick={modal?.show}>Import from SOLAR</button>
    <button class="btn btn-sm" onclick={addEvent}>
      <PhPlus></PhPlus>
      Add class
    </button>
  </div>
</TopBar>
<div class="flex flex-col px-4 w-[min(100%,800px)] mx-auto pb-12" use:scrollToBottom={events}>
  {#if events.length > 0}
    {#each events as event, i}
      {@const empty = !saved && !isValid(event)}
      <div class="border-b last:border-none py-4">
        <Event
          index={i}
          {empty}
          bind:data={events[i]}
          ondelete={() => {
            events = events.filter((item) => item !== event);
            saved = false;
          }}
          oninput={() => {
            saved = false;
          }}
        ></Event>
      </div>
    {/each}
  {:else}
    <p class="text-base-content/50 text-xl text-center py-4">
      Add your first class or import your schedule from SOLAR
    </p>
    <div class="flex gap-2 flex-wrap self-center">
      <button class="btn btn-sm" onclick={modal?.show}>Import from SOLAR</button>
      <button class="btn btn-sm" onclick={addEvent}><PhPlus></PhPlus> Add class</button>
    </div>
  {/if}
</div>
<FloatingBar>
  {#if !saved}
    <div in:fly={{ duration: 250, y: 10 }} out:fly={{ duration: 250, y: 10 }} class="relative">
      <div class="bg-accent absolute inset-0 z-[-1] rounded-btn animate-ping"></div>
      <button class="btn btn-sm btn-accent" onclick={save}>Save</button>
    </div>
  {/if}
</FloatingBar>
<Alert bind:this={alert}></Alert>
<Confirm bind:this={confirm}></Confirm>
<Modal title="Import schedule" bind:this={modal}>
  {@const ctrlKey = isMac() ? "⌘" : "Ctrl"}
  <p>
    1. Open <a
      class="link"
      href="https://it.stonybrook.edu/services/solar"
      target="_blank"
      rel="noopener noreferrer">SOLAR</a
    >. Then, navigate to
    <code> Student Records & Registration > Enrollment > My Class Schedule </code>
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
  <button
    class="btn btn-sm"
    onclick={() => {
      events = parse(importText) || [];
      importText = "";
      saved = false;
      modal?.close();
      alert?.prompt(
        "Attempted to import schedule",
        "Imported schedule may not be accurate. It's recommended to manually check each class. Changes are not applied until you click save.",
      );
    }}>Import</button
  >
</Modal>

<style>
  code {
    @apply bg-base-200 rounded-md text-sm font-bold px-1 py-0.5;
  }
</style>
