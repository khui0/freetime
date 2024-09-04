<script lang="ts">
  import Modal from "./Modal.svelte";

  import PhArrowRight from "~icons/ph/arrow-right";

  import { locations, types } from "$lib/sbu";
  import { timeTo12Hour, eventDuration, timeUntil } from "$lib/time";

  let modal: Modal;
  let selected: CalendarEvent;

  let interval: number;
  let until: string;

  export function show(event: CalendarEvent) {
    clearInterval(interval);
    update();
    interval = setInterval(update, 100);

    function update() {
      until = timeUntil(event.from, event.to) || "";
    }

    selected = event;
    modal.show();
  }
</script>

<Modal title="{selected?.title} {selected?.number}" bind:this={modal}>
  {@const today = selected?.days[(new Date().getDay() + 13) % 7]}
  {#if selected}
    <div class="flex gap-1 justify-between">
      <h2>{types[selected?.type]}</h2>
      <p class="flex items-center gap-2">
        {timeTo12Hour(selected?.from, true)}
        <span><PhArrowRight></PhArrowRight></span>
        {timeTo12Hour(selected?.to, true)}
      </p>
    </div>
    <div class="flex gap-1 justify-between">
      <p>
        {#if today}
          {until}
        {/if}
      </p>
      <p>{eventDuration(selected?.from, selected?.to)}</p>
    </div>
    <hr />
    <div class="flex gap-2 items-center flex-wrap">
      <p class="border border-base-content w-fit h-fit px-2 rounded-badge">{selected?.room}</p>
      <p>{locations[selected?.location].name}</p>
    </div>
    {#if locations[selected?.location].maps}
      <a href={locations[selected?.location].maps} class="btn btn-sm self-start mb-1 mt-2">
        Open in Google Maps
      </a>
    {/if}
  {/if}
</Modal>
