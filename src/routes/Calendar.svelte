<script lang="ts">
  import { currentUser, pb } from "$lib/pocketbase";
  import { settings } from "$lib/settings";
  import { onMount } from "svelte";
  import pluralize from "pluralize";

  import rawLocations from "$lib/assets/locations.json";

  import PhClock from "~icons/ph/clock";

  import Modal from "$lib/components/Modal.svelte";

  const locations: Locations = rawLocations;
  const types: { [key: string]: string } = {
    lecture: "Lecture",
    recitation: "Recitation",
    independent: "Independent Study",
    seminar: "Seminar",
    online: "Online",
    laboratory: "Laboratory",
    studio: "Studio",
  };

  function timeToS(time: string) {
    const parts = time.split(":");
    const hours = parseInt(parts[0]) * 3600;
    const minutes = parseInt(parts[1]) * 60;
    return hours + minutes;
  }

  function timeTo12Hour(time: string, dayPeriod: boolean = false) {
    if (!time) return;
    const parts = time.split(":");
    const hours = parseInt(parts[0]);
    const period = parseInt(parts[0]) >= 12 ? " PM" : " AM";
    return (
      (hours > 12 ? hours % 12 : hours).toString() + ":" + parts[1] + (dayPeriod ? period : "")
    );
  }

  function eventDuration(from: string, to: string) {
    if (!from || !to) return;
    const seconds = timeToS(to) - timeToS(from);
    const minutes = seconds / 60;
    const hours = minutes / 60;
    return (
      (Math.floor(hours) > 0 ? pluralize("hour", Math.floor(hours), true) : "") +
      " " +
      pluralize("minute", Math.floor(minutes % 60), true)
    );
  }

  let showWeekend: boolean = $settings.showWeekend === "true";

  let data: CalendarEvent[] = [];

  let time: string;
  let progress: number = -1;

  let modal: Modal;
  let selected: CalendarEvent;

  onMount(() => {
    pb.collection("schedules")
      .getFullList()
      .then((res) => (data = res[0].schedule))
      .catch(() => {
        // Create new record if it doesn't exist.
        pb.collection("schedules").create({ user: $currentUser?.id, schedule: [] });
      });

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

<div class="flex flex-col">
  <div class="px-4 pt-2 flex gap-2 items-center">
    <button class="btn btn-sm">Show today</button>
    <div class="ml-auto">
      <a class="btn btn-sm" href="/edit">Edit schedule</a>
    </div>
  </div>
  <div
    class="z-20 sticky top-0 mx-4 py-2 bg-base-100 text-sm border-b grid {showWeekend
      ? 'grid-cols-[3rem_repeat(7,1fr)]'
      : 'grid-cols-[3rem_repeat(5,1fr)]'}"
  >
    <p class="flex items-center justify-center"><PhClock></PhClock></p>
    {#each Array(showWeekend ? 7 : 5) as _, day}
      {@const days = ["M", "T", "W", "T", "F", "S", "S"]}
      {@const today = new Date().getDay() === (day + 1) % 7}
      <button class="btn font-normal min-h-0 h-6" class:btn-ghost={!today}>{days[day]}</button>
    {/each}
  </div>
  {#each Array(13) as _, i}
    <div
      class="relative mx-4 text-center h-16 grid {showWeekend
        ? 'grid-cols-[3rem_repeat(7,1fr)]'
        : 'grid-cols-[3rem_repeat(5,1fr)]'}"
      class:border-b={i !== 12}
    >
      <p class="text-sm text-base-content/50 self-center">{i !== 4 ? (i + 8) % 12 : 12}:00</p>
      {#each Array(showWeekend ? 7 : 5) as _, j}
        {@const event = data?.find(
          (item) => parseInt(item.from.split(":")[0]) === i + 8 && item.days[j],
        )}
        {#if event}
          {@const length = (timeToS(event.to) - timeToS(event.from)) / 3600}
          {@const location = locations[event.location]}
          <div class="relative">
            <button
              class="absolute z-10 top-0 w-full bg-accent text-accent-content rounded-md text-xs h-4 flex flex-col items-center justify-center @container"
              style="height: {length * 4}rem; transform: translateY({(parseInt(
                event.from.split(':')[1],
              ) /
                60) *
                4}rem);"
              on:click={() => {
                selected = event;
                modal.show();
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
            <div class="px-4 w-full h-0.5 bg-accent"></div>
            <p class="bg-accent text-accent-content rounded-badge text-sm w-12 -translate-y-1/2">
              {time}
            </p>
          </div>
        {/if}
      {/each}
    </div>
  {/each}
</div>

<Modal title="{selected?.title} {selected?.number}" bind:this={modal}>
  {#if selected}
    <div class="flex gap-1 justify-between text-lg font-light">
      <h2>{types[selected?.type]}</h2>
      <p>{timeTo12Hour(selected?.from, true)} - {timeTo12Hour(selected?.to, true)}</p>
    </div>
    <div class="flex gap-1 justify-between">
      <p class="border border-base-content w-fit h-fit px-2 rounded-badge">{selected?.room}</p>
      <p class="text-lg font-light">{eventDuration(selected?.from, selected?.to)}</p>
    </div>
    <p>{locations[selected?.location].name}</p>
    {#if locations[selected?.location].maps}
      <a href={locations[selected?.location].maps} class="btn btn-sm self-start mb-1">
        Open in Google Maps
      </a>
    {/if}
  {/if}
</Modal>
