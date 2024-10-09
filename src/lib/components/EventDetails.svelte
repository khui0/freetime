<script lang="ts">
  import { onMount } from "svelte";
  import { timeToMs, timeUntil, msToUnits, eventDurationShort, timeTo12Hour } from "$lib/time";
  import { locations } from "$lib/sbu";
  import PhArrowRight from "~icons/ph/arrow-right";
  import PhArrowSquareOut from "~icons/ph/arrow-square-out";

  export let event: CalendarEvent;

  const days = ["M", "T", "W", "T", "F", "S", "S"];

  let inClass: boolean;
  let today: boolean;

  let until: string;
  let progress: number = 0;
  let remaining: {
    hours: string;
    minutes: string;
  };

  onMount(() => {
    update();
    setInterval(update, 1000);

    function update() {
      today = event.days[(new Date().getDay() + 13) % 7];

      const now = Date.now();
      const start = timeToMs(event.from);
      const end = timeToMs(event.to);

      inClass = start <= now && now < end;

      if (inClass) {
        progress = ((now - start) / (end - start)) * 100;

        let time;
        if (now < start) {
          time = msToUnits(start - now);
        } else if (now < end) {
          time = msToUnits(end - now);
        }

        if (time) {
          remaining = {
            hours: time?.hours.toString() || "",
            minutes: (time?.minutes + 1).toString().padStart(2, "0"),
          };
        }
      }

      if (today) {
        until = timeUntil(event?.from, event?.to) || "";
      }
    }
  });
</script>

<div class="flex gap-2 items-center">
  <h2 class="text-2xl font-bold tracking-tight">{event.title} {event.number}</h2>
  <p class="border border-base-content px-1.5 rounded-lg text-sm">{event.type.toUpperCase()}</p>
</div>
<div class="flex gap-2 text-base-content/75 items-center justify-between h-12">
  {#if inClass && today}
    <div
      class="radial-progress bg-base-200 border-base-200 text-base-content border-4 text-sm flex-shrink-0"
      style="--value:{progress}; --size:3rem; --thickness:0.25rem;"
      role="progressbar"
    >
      <p>{remaining.hours}<span class="animate-pulse">:</span>{remaining.minutes}</p>
    </div>
  {/if}
  {#if until && !inClass}
    <p>{until}</p>
  {/if}
  <p class="flex items-center gap-2 flex-wrap justify-end">
    {timeTo12Hour(event.from, true)}
    <span><PhArrowRight></PhArrowRight></span>
    {timeTo12Hour(event.to, true)}
    ({eventDurationShort(event.from, event.to)})
  </p>
</div>
<div class="flex gap-1 my-2">
  {#each days as day, i}
    {#if i < 5 || event.days[5] || event.days[6]}
      <p
        class="border rounded-full w-8 h-8 flex items-center justify-center {event.days[i]
          ? 'bg-base-300'
          : 'border-base-300 bg-transparent'}"
      >
        {day}
      </p>
    {/if}
  {/each}
</div>
<div class="flex gap-2 items-center flex-wrap mt-1">
  <p class="border border-base-content w-fit h-fit px-1.5 rounded-lg text-sm">
    {event.room}
  </p>
  {#if locations[event.location].maps}
    <a href={locations[event.location].maps} class="inline-flex gap-1 items-center hover:underline">
      <p>{locations[event.location].name}</p>
      <span class="mb-0.5"><PhArrowSquareOut></PhArrowSquareOut></span>
    </a>
  {:else}
    <p>{locations[event.location].name}</p>
  {/if}
</div>
