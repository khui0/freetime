<script lang="ts">
  import { pb } from "$lib/pocketbase";
  import { onMount } from "svelte";

  import PhClock from "~icons/ph/clock";

  function timeToS(time: string) {
    const parts = time.split(":");
    const hours = parseInt(parts[0]) * 3600;
    const minutes = parseInt(parts[1]) * 60;
    return hours + minutes;
  }

  function timeTo12Hour(time: string) {
    const parts = time.split(":");
    const hours = parseInt(parts[0]);
    return (hours > 12 ? hours % 12 : hours).toString() + ":" + parts[1];
  }

  let showWeekend: boolean = false;

  interface Item {
    class: string;
    number: string;
    from: string;
    to: string;
    location: string;
    room: string;
    type: string;
  }

  let data: Item[][] = [];

  let time: string;
  let progress: number = -1;

  onMount(() => {
    pb.collection("schedules")
      .getFullList()
      .then((res) => (data = res[0].schedule));

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
  <div class="px-4 flex gap-2 items-center">
    <button class="btn btn-sm">Show today</button>
    <label class="label cursor-pointer w-fit gap-2">
      <span class="label-text">Show weekend</span>
      <input type="checkbox" class="toggle" bind:checked={showWeekend} />
    </label>
    <div class="ml-auto">
      <button class="btn btn-sm">Edit schedule</button>
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
        {@const event = data[j]?.find((item) => parseInt(item.from.split(":")[0]) === i + 8)}
        {#if event}
          {@const length = (timeToS(event.to) - timeToS(event.from)) / 3600}
          <div class="relative">
            <button
              class="absolute z-10 top-0 w-full bg-accent text-accent-content rounded-md text-xs h-4 flex flex-col items-center justify-center"
              style="height: {length * 4}rem; transform: translateY({(parseInt(
                event.from.split(':')[1],
              ) /
                60) *
                4}rem);"
            >
              <p>{event.class} {event.number}</p>
              <p>{event.type}</p>
              <p>{timeTo12Hour(event.from)} - {timeTo12Hour(event.to)}</p>
              <p>{event.location} {event.room}</p>
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
