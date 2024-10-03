<script lang="ts">
  /** @type {import('./$types').PageData} */
  export let data;

  import { title } from "$lib/store";
  $title = data.username;

  import { onMount } from "svelte";

  import { settings } from "$lib/settings";
  import { ready, currentUser, schedules } from "$lib/pocketbase";

  import PhArrowLeft from "~icons/ph/arrow-left";

  import Calendar from "$lib/components/Calendar.svelte";
  import CalendarModal from "$lib/components/CalendarModal.svelte";

  let details: CalendarModal;

  let selfData: CalendarEvent[] = [];
  let singleView: boolean = false;
  let viewOffset: number = 0;

  $: events = [data.schedule, selfData];

  onMount(() => {
    ready.subscribe(async (ready) => {
      if (!$currentUser || !ready) return;
      // Get own schedule
      selfData = $schedules.find((r) => r.user === $currentUser?.id)?.schedule;
    });
  });
</script>

{#if data?.schedule?.length > 0}
  <div class="px-4 pt-4 flex gap-2 items-center justify-between">
    <div class="flex gap-4 items-center flex-wrap">
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
    <div class="ml-auto flex gap-2 flex-wrap justify-end">
      <button
        class="btn btn-sm"
        on:click={() => {
          singleView = !singleView;
          viewOffset = singleView ? (new Date().getDay() + 13) % 7 : 0;
        }}>{!singleView ? "Today" : "Week"}</button
      >
    </div>
  </div>
  <div>
    <Calendar
      bind:data={events}
      columns={singleView ? 1 : $settings.showWeekend === "true" ? 7 : 5}
      offset={viewOffset}
      multiplier={!singleView ? 1 : 2}
      on:expand={(e) => {
        details.show(e.detail.selected);
      }}
      on:selectday={(e) => {
        singleView = !singleView;
        viewOffset = singleView ? e.detail.day : 0;
      }}
    ></Calendar>
  </div>
{:else}
  <div class="grid h-screen">
    <p class="text-base-content/50 text-xl place-self-center text-center">No schedule found</p>
  </div>
{/if}

<CalendarModal bind:this={details}></CalendarModal>
