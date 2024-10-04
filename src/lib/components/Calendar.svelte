<script lang="ts">
  import { settings } from "$lib/settings";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  import CalendarItem from "./CalendarItem.svelte";

  import PhClock from "~icons/ph/clock";

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

<div
  class="z-20 sticky top-0 px-4 pt-2 text-base-content/50 bg-base-100/50 backdrop-blur-lg text-sm border-b flex"
>
  <p class="flex items-center justify-center mr-2 w-12"><PhClock></PhClock></p>
  {#each Array(Math.min(columns, headers.length)) as _, i}
    {@const today = (new Date().getDay() + 13) % 7 === i + offset}
    <button
      class="flex-1 btn font-normal px-0 min-h-0 h-8 rounded-b-none {today ? 'bg-base-200' : 'btn-ghost'}"
      on:click={() => {
        dispatch("selectday", { day: i });
      }}
    >
      {headers[i + offset]}
    </button>
  {/each}
</div>
{#each Array(13) as _, i}
  <div class="relative mx-4 text-center h-16 flex" class:border-b={i !== 12}>
    <p class="text-sm text-base-content/50 self-center mr-2 w-12">
      {i !== 4 ? (i + 8) % 12 : 12}:00
    </p>
    {#key data}
      {#each Array(Math.min(columns, headers.length) * multiplier) as _, j}
        {@const today = (new Date().getDay() + 13) % 7 === Math.floor(j / multiplier) + offset}
        {@const event = data[j % multiplier]?.find(
          (item) =>
            parseInt(item.from.split(":")[0]) === i + 8 &&
            item.days[Math.floor(j / multiplier) + offset],
        )}
        {@const user = j % multiplier === 0}
        <div
          class="flex-1 relative {today && $settings.highlightToday === 'true'
            ? 'bg-base-200/50'
            : ''}"
        >
          {#if event}
            <CalendarItem
              {event}
              dim={!today && $settings.dimOtherDays === "true"}
              subtle={!user}
              on:expand
            ></CalendarItem>
          {/if}
        </div>
        <!-- Current time indicator -->
        {#if i === 0}
          <div class="z-10 absolute w-full" style="transform: translateY({progress * 48}rem)">
            <div
              class="absolute top-0 px-4 w-full h-0.5 bg-accent -translate-y-1/2 rounded-l-full"
            ></div>
            <p
              class="absolute top-0 bg-accent text-accent-content rounded-badge text-sm w-12 -translate-y-1/2"
            >
              {time}
            </p>
          </div>
        {/if}
      {/each}
    {/key}
  </div>
{/each}
