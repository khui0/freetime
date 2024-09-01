<script lang="ts">
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

  function addEvent() {
    events[events.length] = { ...emptyEvent };
  }
</script>

<div class="flex flex-col px-4 py-2 h-full">
  <div class="flex gap-1 justify-between">
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
      : ''} gap-2 overflow-auto my-2 flex-1"
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
  <div class="flex gap-1 justify-end">
    <button class="btn btn-sm btn-accent">Save</button>
  </div>
</div>
