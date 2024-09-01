<script lang="ts">
  import { fade } from "svelte/transition";

  import PhArrowLeft from "~icons/ph/arrow-left";

  import Event from "./Event.svelte";

  interface Data {
    title: string;
    number: string;
    days: boolean[];
    from: string;
    to: string;
    location: string;
    room: string;
  }

  let events: Data[] = [];

  const emptyEvent: Data = {
    title: "",
    number: "",
    days: [false, false, false, false, false, false, false],
    from: "",
    to: "",
    location: "",
    room: "",
  };

  let saved: boolean = true;

  function addEvent() {
    events[events.length] = { ...emptyEvent };
    saved = false;
  }

  function transformEvents() {}
</script>

<div class="flex flex-col px-4 h-full">
  <div class="flex gap-1 justify-between border-b py-2">
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
  >
    {#if events.length > 0}
      {#each events as event}
        <Event
          bind:data={event}
          on:delete={() => {
            events = events.filter((item) => item !== event);
          }}
        ></Event>
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
    <button class="btn btn-sm btn-accent">Save</button>
  </div>
</div>
