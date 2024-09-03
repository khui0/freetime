<script lang="ts">
  import { settings } from "$lib/settings";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  import { locations, types } from "$lib/sbu";
  import { timeTo12Hour, timeToS } from "$lib/time";

  import PhClock from "~icons/ph/clock";

  const dispatch = createEventDispatcher();

  let showWeekend: boolean = $settings.showWeekend === "true";

  let time: string;
  let progress: number = -1;

  export let data: CalendarEvent[] = [];

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
  class="z-20 sticky top-0 mx-4 py-2 bg-base-100 text-sm border-b grid {showWeekend
    ? 'grid-cols-[3.5rem_repeat(7,1fr)]'
    : 'grid-cols-[3.5rem_repeat(5,1fr)]'}"
>
  <p class="flex items-center justify-center mr-2"><PhClock></PhClock></p>
  {#each Array(showWeekend ? 7 : 5) as _, day}
    {@const days = ["M", "T", "W", "T", "F", "S", "S"]}
    {@const today = new Date().getDay() === (day + 1) % 7}
    <button class="btn font-normal min-h-0 h-6" class:btn-ghost={!today}>{days[day]}</button>
  {/each}
</div>
{#each Array(13) as _, i}
  <div
    class="relative mx-4 text-center h-16 grid {showWeekend
      ? 'grid-cols-[3.5rem_repeat(7,1fr)]'
      : 'grid-cols-[3.5rem_repeat(5,1fr)]'}"
    class:border-b={i !== 12}
  >
    <p class="text-sm text-base-content/50 self-center mr-2">{i !== 4 ? (i + 8) % 12 : 12}:00</p>
    {#each Array(showWeekend ? 7 : 5) as _, j}
      {@const event = data?.find(
        (item) => parseInt(item.from.split(":")[0]) === i + 8 && item.days[j],
      )}
      {#if event}
        {@const length = (timeToS(event.to) - timeToS(event.from)) / 3600}
        {@const location = locations[event.location]}
        <div class="relative mx-[1px]">
          <button
            class="absolute z-10 top-0 w-full bg-accent text-accent-content rounded-md text-xs h-4 flex flex-col items-center justify-center @container"
            style="height: {length * 4}rem; transform: translateY({(parseInt(
              event.from.split(':')[1],
            ) /
              60) *
              4}rem);"
            on:click={() => {
              dispatch("expand", {
                selected: event,
              });
            }}
          >
            <p>{event.title} {event.number}</p>
            <p>{types[event.type]}</p>
            <p>{timeTo12Hour(event.from)} - {timeTo12Hour(event.to)}</p>
            <p class="hidden @[8rem]:inline">{location.short || location.name} {event.room}</p>
          </button>
        </div>
      {:else}
        <div></div>
      {/if}
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
  </div>
{/each}
