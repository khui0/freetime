<script lang="ts">
  import Modal from "./Modal.svelte";

  import PhArrowRight from "~icons/ph/arrow-right";
  import PhMapPin from "~icons/ph/map-pin";

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
    <div class="flex gap-1 justify-between text-base-content/75">
      <h2>{types[selected?.type]}</h2>
      <p class="flex items-center gap-2">
        {timeTo12Hour(selected?.from, true)}
        <span><PhArrowRight></PhArrowRight></span>
        {timeTo12Hour(selected?.to, true)}
      </p>
    </div>
    <div class="flex gap-1 justify-between text-base-content/75">
      <p>
        {#if today}
          {until}
        {/if}
      </p>
      <p class="text-end">{eventDuration(selected?.from, selected?.to)}</p>
    </div>
    <hr />
    <div class="flex gap-2 items-center flex-wrap mt-2">
      <p class="border border-base-content w-fit h-fit px-2 rounded-badge">{selected?.room}</p>
      <p>{locations[selected?.location].name}</p>
      {#if locations[selected?.location].maps}
        <a href={locations[selected?.location].maps} class="btn btn-sm btn-square">
          <PhMapPin></PhMapPin>
        </a>
      {/if}
    </div>
  {/if}
</Modal>
