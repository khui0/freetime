<script lang="ts">
  import { settings } from "$lib/settings";
  import { onMount, type Snippet } from "svelte";

  import CalendarItem from "./CalendarItem.svelte";

  import PhClock from "~icons/ph/clock";

  import EventDetails from "$lib/components/calendar/EventDetails.svelte";
  import Dropdown from "$lib/components/dialog/Dropdown.svelte";
  import { update } from "$lib/utilities";

  let dropdown: Dropdown | undefined = $state();
  let selected: CalendarEvent | undefined = $state();

  let time: string | undefined = $state();
  let progress: number = $state(-1);

  const START = 8;
  const END = 22;

  let {
    data = $bindable([]),
    headers = ["M", "T", "W", "T", "F", "S", "S"],
    columns = 5,
    multiplier = data.length,
    offset = 0,
    children,
    select,
  }: {
    data: CalendarEvent[][];
    headers?: string[];
    columns: number;
    multiplier?: number;
    offset: number;
    children: Snippet;
    select: Function;
  } = $props();

  onMount(() => {
    update(() => {
      const now = new Date();
      const tzo = now.getTimezoneOffset() * 60000;
      const hour = ((Date.now() - tzo) % 8.64e7) / 3.6e6;
      progress = (hour - START) / 12;
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
<div class="z-30 sticky top-0 flex flex-col bg-base-100 border-b">
  {@render children?.()}
  <div class="flex px-4 pt-2 text-base-content/50 text-sm">
    <p class="flex items-center justify-center mr-2 w-10"><PhClock></PhClock></p>
    {#each Array(Math.min(columns, headers.length)) as _, i}
      {@const today = (new Date().getDay() + 13) % 7 === i + offset}
      <button
        class="flex-1 btn font-normal px-0 min-h-0 h-6 rounded-t-lg rounded-b-none {today
          ? 'bg-base-200/50 border-transparent'
          : 'btn-ghost'}"
        onclick={() => {
          select(i);
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
    {#each Array(END - START + 1) as _, row}
      {@const period = row > 4 ? " PM" : " AM"}
      {@const time = row !== 4 ? ((row + START) % 12) + period : "Noon"}
      <div class="relative text-xs text-base-content/50 {row !== END - START ? 'h-16' : 'h-0'}">
        <p class="absolute w-full -translate-y-1/2">{time}</p>
      </div>
    {/each}
  </div>
  <div class="w-2 py-4">
    {#each Array(END - START) as _, row}
      <div
        class="relative text-sm text-base-content/50 {row !== END - START ? 'h-16' : 'h-0'} {row ===
        0
          ? 'border-y'
          : 'border-b'}"
      ></div>
    {/each}
  </div>
  <!-- Schedule -->
  {#each Array(Math.min(columns, headers.length) * multiplier) as _, col}
    {@const today = (new Date().getDay() + 13) % 7 === Math.floor(col / multiplier) + offset}
    <div class="flex-1 py-4 {today && $settings.highlightToday === 'true' ? 'bg-base-200/50' : ''}">
      {#each Array(END - START) as _, row}
        {@const event = data[col % multiplier]?.find(
          (item) =>
            parseInt(item.from.split(":")[0]) === row + START &&
            item.days[Math.floor(col / multiplier) + offset],
        )}
        {@const user = col % multiplier === 0}
        <div class="relative h-16 {row === 0 ? 'border-y' : 'border-b'}">
          {#if event}
            <CalendarItem
              {event}
              dim={!today && $settings.dimOtherDays === "true"}
              subtle={!user}
              expand={(e: any) => {
                selected = e.selected;
                dropdown?.show(e.rect);
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
      class="absolute top-0 bg-accent text-accent-content rounded-badge text-xs tracking-tight w-10 -translate-y-1/2 text-center"
    >
      {time}
    </p>
  </div>
</div>

<Dropdown bind:this={dropdown}>
  {#if selected}
    <EventDetails event={selected}></EventDetails>
  {/if}
</Dropdown>
