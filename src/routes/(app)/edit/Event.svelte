<script lang="ts">
  import Confirm from "$lib/components/dialog/Confirm.svelte";
  import { locations, types } from "$lib/sbu";
  import { onMount } from "svelte";

  import { fly } from "svelte/transition";
  import PhCaretDown from "~icons/ph/caret-down";
  import PhCaretUp from "~icons/ph/caret-up";
  import PhTrash from "~icons/ph/trash";

  let confirm: Confirm | undefined = $state();

  let expanded: boolean = $state(false);

  let {
    empty = false,
    index = -1,
    data = $bindable({
      title: "",
      number: "",
      days: [false, false, false, false, false, false, false],
      from: "",
      to: "",
      location: "",
      room: "",
      type: "",
    }),
    oninput,
    ondelete,
  }: {
    empty: boolean;
    index: number;
    data: CalendarEvent;
    oninput?: Function;
    ondelete?: Function;
  } = $props();

  export function expand() {
    expanded = true;
  }

  onMount(() => {
    if (empty) expand();
  });
</script>

<div>
  <label class="flex items-center gap-2 cursor-pointer">
    <h2 class="font-bold text-xl pl-1">
      {#if index !== -1}
        <span class="text-base-content/50 font-normal">{index + 1}.</span>
      {/if}
      {data.title && data.number ? `${data.title.toUpperCase()} ${data.number}` : "New class"}
    </h2>
    {#if data.type}
      <p class="border border-base-content px-1.5 rounded-lg text-xs select-none">
        {data.type.toUpperCase()}
      </p>
    {/if}
    <div class="ml-auto flex gap-2">
      <label class="swap swap-rotate btn btn-square btn-sm">
        <input type="checkbox" bind:checked={expanded} />
        <span class="swap-off">
          <PhCaretDown></PhCaretDown>
        </span>
        <span class="swap-on">
          <PhCaretUp></PhCaretUp>
        </span>
      </label>
      <button
        class="btn btn-square btn-sm hover:btn-error"
        onclick={() => {
          confirm
            ?.prompt(
              "Delete this event?",
              "This event will be deleted! (Changes will be applied on save)",
              "Delete",
            )
            .then(() => {
              ondelete?.();
            })
            .catch(() => {});
        }}
      >
        <PhTrash></PhTrash>
      </button>
    </div>
    <input type="checkbox" class="hidden" bind:checked={expanded} />
  </label>
  {#if expanded}
    <div
      in:fly={{ duration: 200, y: -10 }}
      out:fly={{ duration: 200, y: -10 }}
      class="flex flex-col gap-1 mt-2"
    >
      <div class="flex gap-1 pr-10 flex-wrap">
        <label class="flex flex-col text-xs">
          <span class="px-2">Course</span>
          <input
            type="text"
            class="input input-bordered input-sm w-28"
            placeholder="e.g. CSE"
            bind:value={data.title}
            oninput={() => {
              oninput?.();
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
            oninput={() => {
              oninput?.();
              data.number = data.number.replace(/[^0-9]/, "");
            }}
          />
        </label>
        <label class="flex flex-col text-xs">
          <span class="px-2">Type</span>
          <select
            class="select select-bordered select-sm w-full"
            bind:value={data.type}
            oninput={() => {
              oninput?.();
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
              oninput={() => {
                oninput?.();
              }}
            />
          </label>
          <label class="flex flex-col text-xs">
            <span class="px-2">End time</span>
            <input
              type="time"
              class="input input-bordered input-sm w-full"
              bind:value={data.to}
              oninput={() => {
                oninput?.();
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
                onclick={() => {
                  oninput?.();
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
            oninput={() => {
              oninput?.();
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
            oninput={() => {
              oninput?.();
              data.room = data.room.toUpperCase();
            }}
          />
        </label>
      </div>
    </div>
  {/if}
</div>

<Confirm bind:this={confirm}></Confirm>
