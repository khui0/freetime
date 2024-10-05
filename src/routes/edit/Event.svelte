<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import PhTrash from "~icons/ph/trash";
  import Confirm from "$lib/components/Confirm.svelte";
  import { locations, types } from "$lib/sbu";

  const dispatch = createEventDispatcher();

  let confirm: Confirm;

  export let index: number = -1;

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
  <div class="flex items-center gap-2">
    <h2 class="font-bold text-2xl pl-1">
      {#if index !== -1}
        <span class="text-base-content/50">{index + 1}.</span>
      {/if}
      {data.title && data.number ? `${data.title.toUpperCase()} ${data.number}` : "New class"}
    </h2>
    {#if data.type}
      <p class="border border-base-content px-1.5 rounded-lg text-sm">{data.type.toUpperCase()}</p>
    {/if}
  </div>
  <div class="flex gap-1 pr-10 flex-wrap">
    <label class="flex flex-col text-xs">
      <span class="px-2">Course</span>
      <input
        type="text"
        class="input input-bordered input-sm w-28"
        placeholder="e.g. CSE"
        bind:value={data.title}
        on:input={() => {
          dispatch("input");
          data.title = data.title.toUpperCase();
        }}
      />
    </label>
    <label class="flex flex-col text-xs">
      <span class="px-2">Number</span>
      <input
        type="text"
        class="input input-bordered input-sm w-28"
        placeholder="e.g. 101"
        inputmode="numeric"
        bind:value={data.number}
        on:input={() => {
          dispatch("input");
          data.number = data.number.replace(/[^0-9]/, "");
        }}
      />
    </label>
    <label class="flex flex-col text-xs">
      <span class="px-2">Type</span>
      <select
        class="select select-bordered select-sm w-full"
        bind:value={data.type}
        on:input={() => {
          dispatch("input");
        }}
      >
        {#each Object.keys(types) as key}
          <option value={key}>{types[key]}</option>
        {/each}
      </select>
    </label>
  </div>
  <div class="flex gap-1 flex-wrap justify-between">
    <div class="flex gap-1 flex-wrap">
      <label class="flex flex-col text-xs">
        <span class="px-2">Start time</span>
        <input
          type="time"
          class="input input-bordered input-sm w-full"
          bind:value={data.from}
          on:input={() => {
            dispatch("input");
          }}
        />
      </label>
      <label class="flex flex-col text-xs">
        <span class="px-2">End time</span>
        <input
          type="time"
          class="input input-bordered input-sm w-full"
          bind:value={data.to}
          on:input={() => {
            dispatch("input");
          }}
        />
      </label>
    </div>
    <div>
      <p class="text-xs px-2">Days</p>
      <div class="flex gap-1 flex-wrap">
        {#each ["M", "T", "W", "T", "F", "S", "S"] as day, i}
          <button
            class="btn btn-square btn-sm rounded-full font-normal {data.days[i]
              ? 'bg-base-300'
              : 'border-base-300 bg-transparent'}"
            on:click={() => {
              dispatch("input");
              data.days[i] = !data.days[i];
            }}
          >
            {day}
          </button>
        {/each}
      </div>
    </div>
  </div>
  <div class="flex gap-1 w-full">
    <label class="flex flex-col text-xs">
      <span class="px-2">Location</span>
      <select
        class="select select-bordered select-sm max-w-48"
        bind:value={data.location}
        on:input={() => {
          dispatch("input");
        }}
      >
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
        class="input input-bordered input-sm w-28"
        bind:value={data.room}
        on:input={() => {
          dispatch("input");
          data.room = data.room.toUpperCase();
        }}
      />
    </label>
  </div>
</div>

<Confirm bind:this={confirm}></Confirm>
