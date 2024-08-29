<script lang="ts">
  import { pb } from "$lib/pocketbase";
  import { onMount } from "svelte";

  import PhClock from "~icons/ph/clock";

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

  onMount(() => {
    pb.collection("schedules")
      .getFullList()
      .then((res) => (data = res[0].schedule));
  });

  function timeToS(time: string) {
    const parts = time.split(":");
    const hours = parseInt(parts[0]) * 3600;
    const minutes = parseInt(parts[1]) * 60;
    return hours + minutes;
  }
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
    class="z-10 sticky top-0 mx-4 py-2 bg-base-100 text-center text-sm border-b grid {showWeekend
      ? 'grid-cols-[3rem_repeat(7,1fr)]'
      : 'grid-cols-[3rem_repeat(5,1fr)]'}"
  >
    <p class="flex justify-center"><PhClock></PhClock></p>
    <p>M</p>
    <p>T</p>
    <p>W</p>
    <p>T</p>
    <p>F</p>
    {#if showWeekend}
      <p>S</p>
      <p>S</p>
    {/if}
  </div>
  {#each Array(13) as _, i}
    <!-- Row -->
    <div
      class="mx-4 text-center h-16 grid {showWeekend
        ? 'grid-cols-[3rem_repeat(7,1fr)]'
        : 'grid-cols-[3rem_repeat(5,1fr)]'}"
      class:border-b={i !== 12}
    >
      <p class="text-sm text-base-content/50 self-center">{i + 8}:00</p>
      {#each Array(showWeekend ? 7 : 5) as _, j}
        {@const event = data[j]?.find((item) => parseInt(item.from.split(":")[0]) === i + 8)}
        {#if event}
          {@const length = (timeToS(event.to) - timeToS(event.from)) / 3600}
          <div class="relative">
            <div
              class="absolute top-0 w-full bg-accent text-accent-content rounded-md text-xs h-4"
              style="height: {length * 4}rem; transform: translateY({(parseInt(
                event.from.split(':')[1],
              ) /
                60) *
                4}rem);"
            >
              <p>{event.class} {event.number}</p>
              <p>{event.type}</p>
              <p>{event.from} - {event.to}</p>
              <p>{event.location}</p>
              <p>{event.room}</p>
            </div>
          </div>
        {:else}
          <div></div>
        {/if}
      {/each}
    </div>
  {/each}
</div>
