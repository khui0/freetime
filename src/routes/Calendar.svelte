<script lang="ts">
  import PhClock from "~icons/ph/clock";

  interface Item {
    class: string;
    number: string;
    from: string;
    to: string;
    location: string;
    room: string;
    type: string;
  }

  const sampleData: Item[][] = [];

  function timeToS(time: string) {
    const parts = time.split(":");
    const hours = parseInt(parts[0]) * 3600;
    const minutes = parseInt(parts[1]) * 60;
    return hours + minutes;
  }
</script>

<div class="flex flex-col">
  <div
    class="z-10 sticky top-0 mx-4 py-2 bg-base-100 p grid grid-cols-[3rem_repeat(7,1fr)] text-center text-sm border-b"
  >
    <p class="flex justify-center"><PhClock></PhClock></p>
    <p>M</p>
    <p>T</p>
    <p>W</p>
    <p>T</p>
    <p>F</p>
    <p>S</p>
    <p>S</p>
  </div>
  {#each Array(13) as _, i}
    <!-- Row -->
    <div
      class="mx-4 grid grid-cols-[3rem_repeat(7,1fr)] text-center h-16"
      class:border-b={i !== 12}
    >
      <p class="text-sm text-base-content/50 self-center">{i + 8}:00</p>
      {#each Array(7) as _, j}
        {@const event = sampleData[j]?.find((item) => parseInt(item.from.split(":")[0]) === i + 8)}
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
