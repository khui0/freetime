<script lang="ts">
  import { locations, types } from "$lib/sbu";
  import { timeTo12Hour, timeToS } from "$lib/time";

  let {
    event,
    dim = false,
    subtle = false,
    expand,
  }: {
    event: CalendarEvent;
    dim?: boolean;
    subtle?: boolean;
    expand: Function;
  } = $props();

  let button: HTMLButtonElement | undefined = $state();

  let length = $derived((timeToS(event.to) - timeToS(event.from)) / 3600);
  let location = $derived(event.location ? locations[event.location] : null);
</script>

<button
  bind:this={button}
  class="leading-tight absolute z-10 top-0 left-[1px] right-[1px] text-accent-content rounded-lg text-xs h-4 flex flex-col items-center justify-center @container hover:shadow-[0_0_0_2px] hover:shadow-base-content hover:z-20 transition-shadow {!dim
    ? 'bg-accent'
    : 'bg-accent/50'} {subtle ? 'opacity-30' : ''} transition-colors tracking-tight"
  style="height: {length * 4}rem; transform: translateY({(parseInt(event.from.split(':')[1]) / 60) *
    4}rem);"
  onclick={() => {
    expand({
      selected: event,
      rect: button?.getBoundingClientRect(),
    });
  }}
>
  <div class="hidden @[3rem]:block">
    <p>{event.title} {event.number}</p>
    <p>
      {types[event.type]}
      <span>{timeTo12Hour(event.from)} - {timeTo12Hour(event.to)} </span>
    </p>
    <p class="hidden @[8rem]:inline">
      {#if event.online}
        Online
      {:else if event.location}
        {location?.short || location?.name} {event.room}
      {/if}
    </p>
  </div>
  <div class="@[3rem]:hidden">
    <p class="rotate-90 whitespace-nowrap">{event.title} {event.number}</p>
  </div>
</button>
