<script lang="ts">
  /** @type {import('./$types').PageData} */
  export let data;

  import { title } from "$lib/store";
  $title = data.username;

  import PhArrowLeft from "~icons/ph/arrow-left";

  import TopBar from "$lib/components/TopBar.svelte";
  import Calendar from "$lib/components/Calendar.svelte";
  import EventDetails from "$lib/components/EventDetails.svelte";

  let details: EventDetails;
</script>

{#if data?.schedule?.length > 0}
  <div class="px-4 pt-4 flex gap-2 items-center justify-between">
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
  <div class="mb-11">
    <Calendar
      bind:data={data.schedule}
      on:expand={(e) => {
        details.show(e.detail.selected);
      }}
    ></Calendar>
  </div>
{:else}
  <div class="grid h-screen">
    <p class="text-base-content/50 text-xl place-self-center text-center">No schedule found</p>
  </div>
{/if}

<EventDetails bind:this={details}></EventDetails>
