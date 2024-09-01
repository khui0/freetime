<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import PhTrash from "~icons/ph/trash";
  import Confirm from "$lib/components/Confirm.svelte";
  import rawLocations from "$lib/assets/locations.json";

  const dispatch = createEventDispatcher();

  const locations: Locations = rawLocations;

  let confirm: Confirm;

  export let data: CalendarEvent = {
    title: "",
    number: "",
    days: [false, false, false, false, false, false, false],
    from: "",
    to: "",
    location: "",
    room: "",
    type: "",
  };
</script>

<div class="relative rounded-box border p-4 flex flex-col gap-2 h-fit">
  <button
    class="absolute top-4 right-4 btn btn-square btn-sm rounded-full hover:btn-error"
    on:click={() => {
      confirm
        .prompt(
          "Delete this event?",
          "This event will be deleted! (Changes will be applied on save)",
          "Delete",
        )
        .then(() => {
          dispatch("delete");
        })
        .catch(() => {});
    }}
  >
    <PhTrash></PhTrash>
  </button>
  <h2 class="font-bold text-2xl pl-1">
    {data.title && data.number ? `${data.title.toUpperCase()} ${data.number}` : "New class"}
  </h2>
  <div class="flex gap-1 pr-10">
    <label class="flex flex-col text-xs">
      <span class="px-2">Course</span>
      <input
        type="text"
        class="input input-bordered input-sm w-full"
        placeholder="e.g. CSE"
        bind:value={data.title}
        on:input={() => {
          data.title = data.title.toUpperCase();
        }}
      />
    </label>
    <label class="flex flex-col text-xs">
      <span class="px-2">Number</span>
      <input
        type="text"
        class="input input-bordered input-sm w-full"
        placeholder="e.g. 101"
        inputmode="numeric"
        bind:value={data.number}
        on:input={() => {
          data.number = data.number.replace(/[^0-9]/, "");
        }}
      />
    </label>
  </div>
  <div class="flex gap-1 flex-wrap">
    <label class="flex flex-col text-xs">
      <span class="px-2">Type</span>
      <select class="select select-bordered select-sm w-full" bind:value={data.type}>
        <option value="lecture">Lecture</option>
        <option value="recitation">Recitation</option>
        <option value="independent">Independent Study</option>
        <option value="seminar">Seminar</option>
        <option value="online">Online</option>
        <option value="laboratory">Laboratory</option>
        <option value="studio">Studio</option>
      </select>
    </label>
  </div>
  <div class="flex gap-1 flex-wrap">
    {#each ["M", "T", "W", "T", "F", "S", "S"] as day, i}
      <button
        class="btn btn-square rounded-full {data.days[i]
          ? 'bg-base-300'
          : 'border-base-300 bg-transparent'}"
        on:click={() => {
          data.days[i] = !data.days[i];
        }}
      >
        {day}
      </button>
    {/each}
  </div>
  <div class="flex gap-1 flex-wrap">
    <label class="flex flex-col text-xs">
      <span class="px-2">Start time</span>
      <input type="time" class="input input-bordered input-sm w-full" bind:value={data.from} />
    </label>
    <label class="flex flex-col text-xs">
      <span class="px-2">End time</span>
      <input type="time" class="input input-bordered input-sm w-full" bind:value={data.to} />
    </label>
  </div>
  <div class="flex gap-1 w-full">
    <label class="flex flex-col text-xs">
      <span class="px-2">Location</span>
      <select class="select select-bordered select-sm w-full" bind:value={data.location}>
        {#if locations}
          {#each Object.keys(locations) as key}
            {@const location = locations[key]}
            <option value={key}>{location.name}</option>
          {/each}
        {/if}
      </select>
    </label>
    <label class="flex flex-col text-xs">
      <span class="px-2">Room</span>
      <input
        type="text"
        class="input input-bordered input-sm w-full"
        bind:value={data.room}
        on:input={() => {
          data.room = data.room.toUpperCase();
        }}
      />
    </label>
  </div>
</div>

<Confirm bind:this={confirm}></Confirm>
