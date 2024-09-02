<script lang="ts">
  import { pb } from "$lib/pocketbase";
  import { fade } from "svelte/transition";

  import PhArrowLeft from "~icons/ph/arrow-left";

  import Event from "./Event.svelte";
  import Alert from "$lib/components/Alert.svelte";
  import { onMount } from "svelte";

  let alert: Alert;

  let id: string;
  let events: CalendarEvent[] = [];

  onMount(async () => {
    // Load schedule from database
    const collection = await pb.collection("schedules").getFullList();
    id = collection[0].id;
    events = collection[0].schedule;
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

  const scrollToBottom = (node: HTMLElement, _: any) => {
    return {
      update() {
        if (!scrollEnabled) return;
        node.scroll({
          top: node.scrollHeight,
          behavior: "smooth",
        });
      },
    };
  };
</script>

<div class="flex flex-col px-4 h-full">
  <div class="flex gap-1 justify-between border-b py-2 items-center">
    <button
      class="btn btn-square btn-sm rounded-full"
      on:click={() => {
        history.back();
      }}
    >
      <PhArrowLeft></PhArrowLeft>
    </button>
    <button class="btn btn-sm" on:click={addEvent}>Add class</button>
  </div>
  <div
    class="grid grid-cols-1 {events.length > 0
      ? 'md:grid-cols-2'
      : ''} gap-2 overflow-auto py-2 flex-1"
    use:scrollToBottom={events}
  >
    {#if events.length > 0}
      {#each events as event}
        <div in:fade|global={{ duration: 100 }} out:fade|global={{ duration: 100 }}>
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
      <p class="text-base-content/50 text-xl place-self-center text-center">No classes added</p>
    {/if}
  </div>
  <div class="flex gap-1 justify-end border-t py-2 items-center">
    {#if !saved}
      <p in:fade={{ duration: 100 }} class="px-2">
        <span class="font-bold">Warning</span>: you have unsaved changes
      </p>
    {/if}
    <button class="btn btn-sm btn-accent" on:click={save}>Save</button>
  </div>
</div>

<Alert bind:this={alert}></Alert>
