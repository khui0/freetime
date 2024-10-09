<script lang="ts">
  import { settings } from "$lib/settings";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  import CalendarItem from "./CalendarItem.svelte";

  import PhClock from "~icons/ph/clock";

  import Dropdown from "$lib/components/Dropdown.svelte";
  import EventDetails from "$lib/components/EventDetails.svelte";
  let dropdown: Dropdown;
  let selected: CalendarEvent;

  let time: string;
  let progress: number = -1;

  export let data: CalendarEvent[][] = [];

  export let headers: string[] = ["M", "T", "W", "T", "F", "S", "S"];
  export let columns: number = 5;
  export let multiplier: number = data.length;
  export let offset: number = 0;

  onMount(() => {
    setInterval(() => {
      const now = new Date();
      const tzo = now.getTimezoneOffset() * 60000;
      const hour = ((Date.now() % 8.64e7) - tzo) / 3.6e6;
      progress = (hour - 8) / 12;
      time = now
        .toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
        .replace(/AM|PM/, "");
    }, 100);
  });
</script>

<!-- Header -->
<div class="z-20 sticky top-0 flex flex-col bg-base-100/50 backdrop-blur-lg border-b">
  <slot></slot>
  <div class="flex px-4 pt-2 text-base-content/50 text-sm">
    <p class="flex items-center justify-center mr-2 w-10"><PhClock></PhClock></p>
    {#each Array(Math.min(columns, headers.length)) as _, i}
      {@const today = (new Date().getDay() + 13) % 7 === i + offset}
      <button
        class="flex-1 btn font-normal px-0 min-h-0 h-8 rounded-b-none {today
          ? 'bg-base-200'
          : 'btn-ghost'}"
        on:click={() => {
          dispatch("selectday", { day: i });
        }}
      >
        {headers[i + offset]}
      </button>
    {/each}
  </div>
</div>
<!-- Body -->
<div class="relative flex mx-4">
  <!-- Time column -->
  <div class="w-10 text-end pr-1 py-4">
    {#each Array(14) as _, row}
      {@const time = row !== 4 ? ((row + 8) % 12) + " PM" : "Noon"}
      <div class="relative text-xs text-base-content/50 {row !== 13 ? 'h-16' : 'h-0'}">
        <p class="absolute w-full -translate-y-1/2">{time}</p>
      </div>
    {/each}
  </div>
  <div class="w-2 py-4">
    {#each Array(13) as _, row}
      <div
        class="relative text-sm text-base-content/50 {row !== 13 ? 'h-16' : 'h-0'} {row === 0
          ? 'border-y'
          : 'border-b'}"
      ></div>
    {/each}
  </div>
  <!-- Schedule -->
  {#each Array(Math.min(columns, headers.length) * multiplier) as _, col}
    {@const today = (new Date().getDay() + 13) % 7 === Math.floor(col / multiplier) + offset}
    <div class="flex-1 py-4 {today && $settings.highlightToday === 'true' ? 'bg-base-200/50' : ''}">
      {#each Array(13) as _, row}
        {@const event = data[col % multiplier]?.find(
          (item) =>
            parseInt(item.from.split(":")[0]) === row + 8 &&
            item.days[Math.floor(col / multiplier) + offset],
        )}
        {@const user = col % multiplier === 0}
        <div class="relative h-16 {row === 0 ? 'border-y' : 'border-b'}">
          {#if event}
            <CalendarItem
              {event}
              dim={!today && $settings.dimOtherDays === "true"}
              subtle={!user}
              on:expand={(e) => {
                selected = e.detail.selected;
                dropdown.show(e.detail.rect);
              }}
            ></CalendarItem>
          {/if}
        </div>
      {/each}
    </div>
  {/each}
  <div class="absolute w-full" style="transform: translateY({progress * 48 + 1}rem)">
    <div class="absolute top-0 px-4 w-full h-0.5 bg-accent -translate-y-1/2 rounded-l-full"></div>
    <p
      class="absolute top-0 bg-accent text-accent-content rounded-badge text-sm tracking-tight w-10 -translate-y-1/2 text-center"
    >
      {time}
    </p>
  </div>
</div>

<Dropdown bind:this={dropdown}>
  <EventDetails event={selected}></EventDetails>
</Dropdown>
