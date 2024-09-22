<script lang="ts">
  import { onMount } from "svelte";
  import { timeToMs, timeUntil, msToUnits, eventDuration, timeTo12Hour } from "$lib/time";
  import { types, locations } from "$lib/sbu";
  import PhArrowRight from "~icons/ph/arrow-right";
  import PhMapPin from "~icons/ph/map-pin";

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

<div class="flex justify-between">
  <div class="flex gap-4">
    {#if inClass && today}
      <div
        class="radial-progress bg-base-200 border-base-200 border-4 text-sm"
        style="--value:{progress}; --size:3rem; --thickness:0.25rem;"
        role="progressbar"
      >
        <p>{remaining.hours}<span class="animate-pulse">:</span>{remaining.minutes}</p>
      </div>
    {/if}
    <div class="flex flex-col gap-2 text-base-content/75">
      <p>{types[event.type]}</p>
      {#if until}
        <p>{until}</p>
      {/if}
    </div>
  </div>
  <div class="flex flex-col gap-2 text-base-content/75 items-end">
    <p class="flex items-center gap-2 flex-wrap justify-end">
      {timeTo12Hour(event.from, true)}
      <span class:animate-pulse={inClass && today}><PhArrowRight></PhArrowRight></span>
      {timeTo12Hour(event.to, true)}
    </p>
    <p class="text-end">{eventDuration(event.from, event.to)}</p>
  </div>
</div>
<hr />
<div class="flex gap-1">
  {#each days as day, i}
    {#if i < 5 || event.days[5] || event.days[6]}
      <p
        class="border border-base-content rounded-full w-8 h-8 flex items-center justify-center"
        class:opacity-50={!event.days[i]}
      >
        {day}
      </p>
    {/if}
  {/each}
</div>
<hr />
<div class="flex gap-2 items-center flex-wrap mt-1">
  <p class="border border-base-content w-fit h-fit px-2 rounded-badge">
    {event.room}
  </p>
  <p>{locations[event.location].name}</p>
  {#if locations[event.location].maps}
    <a href={locations[event.location].maps} class="btn btn-sm btn-square">
      <PhMapPin></PhMapPin>
    </a>
  {/if}
</div>
