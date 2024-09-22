<script lang="ts">
  /** @type {import('./$types').PageData} */
  export let data;

  import { title, ready } from "$lib/store";
  $title = data.username;

  import { onMount } from "svelte";

  import { settings } from "$lib/settings";
  import { pb, currentUser } from "$lib/pocketbase";

  import PhArrowLeft from "~icons/ph/arrow-left";

  import Calendar from "$lib/components/Calendar.svelte";
  import CalendarModal from "$lib/components/CalendarModal.svelte";

  let details: CalendarModal;

  let selfData: CalendarEvent[] = [];

  $: events = [data.schedule];

  onMount(() => {
    ready.subscribe(async (ready) => {
      if (!$currentUser || !ready) return;
      const list = await pb.collection("schedules").getFullList();
      const schedule = list.find((record) => record.user === $currentUser?.id);
      selfData = schedule?.schedule;
    });
  });
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
  <div>
    <Calendar
      bind:data={events}
      columns={$settings.showWeekend === "true" ? 7 : 5}
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

<CalendarModal bind:this={details}></CalendarModal>
