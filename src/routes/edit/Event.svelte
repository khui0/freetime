<script lang="ts">
  import PhTrash from "~icons/ph/trash";

  import Confirm from "$lib/components/Confirm.svelte";

  import data from "$lib/assets/locations.json";

  interface Locations {
    [key: string]: {
      name: string;
      short?: string;
    };
  }

  const locations: Locations = data;

  let confirm: Confirm;
</script>

<div class="relative rounded-box border p-4 flex flex-col gap-2">
  <button class="absolute top-4 right-4 btn btn-square btn-sm rounded-full hover:btn-error">
    <PhTrash></PhTrash>
  </button>
  <div class="flex gap-1 pr-10">
    <label class="flex flex-col text-xs">
      <span class="px-2">Course</span>
      <input type="text" class="input input-bordered input-sm w-full" placeholder="e.g. CSE" />
    </label>
    <label class="flex flex-col text-xs">
      <span class="px-2">Number</span>
      <input type="text" class="input input-bordered input-sm w-full" placeholder="e.g. 101" />
    </label>
  </div>
  <div class="flex gap-1 flex-wrap">
    {#each ["M", "T", "W", "T", "F", "S", "S"] as day, i}
      <button class="btn btn-square rounded-full {i === 1 ? '' : 'border-base-300 bg-transparent'}">
        {day}
      </button>
    {/each}
  </div>
  <div class="flex gap-1 flex-wrap">
    <label class="flex flex-col text-xs">
      <span class="px-2">Start time</span>
      <input type="time" class="input input-bordered input-sm w-full" />
    </label>
    <label class="flex flex-col text-xs">
      <span class="px-2">End time</span>
      <input type="time" class="input input-bordered input-sm w-full" />
    </label>
  </div>
  <div class="flex gap-1 w-full">
    <label class="flex flex-col text-xs">
      <span class="px-2">Room</span>
      <select class="select select-bordered select-sm w-full">
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
      <input type="text" class="input input-bordered input-sm w-full" />
    </label>
  </div>
</div>

<Confirm bind:this={confirm}></Confirm>
