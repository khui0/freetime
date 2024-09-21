<script lang="ts">
  import { onMount } from "svelte";
  import { timeToMs, timeUntil, timeUntilShort, eventDuration, timeTo12Hour } from "$lib/time";
  import { types, locations } from "$lib/sbu";
  import PhArrowRight from "~icons/ph/arrow-right";
  import PhMapPin from "~icons/ph/map-pin";

  export let event: CalendarEvent;

  let until: string;
  let untilShort: string;

  let inClass: boolean;

  onMount(() => {
    update();
    setInterval(update, 1000);

    function update() {
      const today = event.days[(new Date().getDay() + 13) % 7];

      const now = Date.now();
      const start = timeToMs(event.from);
      const end = timeToMs(event.to);

      inClass = start <= now && now < end;

      if (today) {
        until = timeUntil(event?.from, event?.to) || "";
        untilShort = timeUntilShort(event?.from, event?.to) || "";
      }
    }
  });
</script>

<div class="flex items-start justify-between text-base-content/75">
  <div class="flex flex-col gap-2">
    <p>{types[event.type]}</p>
    {#if until}
      <p>{until}</p>
    {/if}
  </div>
  <div class="flex flex-col gap-2">
    <p class="flex items-center gap-2 whitespace-nowrap">
      {timeTo12Hour(event.from, true)}
      <span class:animate-pulse={inClass}><PhArrowRight></PhArrowRight></span>
      {timeTo12Hour(event.to, true)}
    </p>
    <p class="text-end">{eventDuration(event.from, event.to)}</p>
  </div>
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
