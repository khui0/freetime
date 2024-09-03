<script lang="ts">
  /** @type {import('./$types').PageData} */
  export let data;

  import { title } from "$lib/store";
  $title = data.username;

  import PhArrowLeft from "~icons/ph/arrow-left";

  import { locations, types } from "$lib/sbu";
  import { timeTo12Hour, eventDuration } from "$lib/time";

  import Calendar from "$lib/components/Calendar.svelte";
  import Modal from "$lib/components/Modal.svelte";

  let modal: Modal;
  let selected: CalendarEvent;
</script>

{#if data?.schedule?.length > 0}
  <div class="px-4 pt-2 flex gap-2 items-center">
    <button
      class="btn btn-square btn-sm rounded-full"
      on:click={() => {
        history.back();
      }}
    >
      <PhArrowLeft></PhArrowLeft>
    </button>
    <h2 class="font-bold text-2xl">{data.username}</h2>
  </div>
  <Calendar
    bind:data={data.schedule}
    on:expand={(e) => {
      selected = e.detail.selected;
      modal.show();
    }}
  ></Calendar>
{:else}
  <div class="grid h-full">
    <p class="text-base-content/50 text-xl place-self-center text-center">No schedule found</p>
  </div>
{/if}

<Modal title="{selected?.title} {selected?.number}" bind:this={modal}>
  {#if selected}
    <div class="flex gap-1 justify-between text-lg">
      <h2>{types[selected?.type]}</h2>
      <p>{timeTo12Hour(selected?.from, true)} - {timeTo12Hour(selected?.to, true)}</p>
    </div>
    <div class="flex gap-1 justify-between">
      <p class="border border-base-content w-fit h-fit px-2 rounded-badge">{selected?.room}</p>
      <p class="text-lg">{eventDuration(selected?.from, selected?.to)}</p>
    </div>
    <p>{locations[selected?.location].name}</p>
    {#if locations[selected?.location].maps}
      <a href={locations[selected?.location].maps} class="btn btn-sm self-start mb-1">
        Open in Google Maps
      </a>
    {/if}
  {/if}
</Modal>
