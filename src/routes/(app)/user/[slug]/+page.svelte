<script lang="ts">
  let { data }: { data: PageData } = $props();

  import { title } from "$lib/store";
  $title = data.username;

  import { onMount } from "svelte";

  import { currentUser, ready, schedules } from "$lib/pocketbase";
  import { settings } from "$lib/settings";

  import PhArrowLeft from "~icons/ph/arrow-left";

  import Calendar from "$lib/components/calendar/Calendar.svelte";
  import type { PageData } from "./$types";

  let selfData: CalendarEvent[] = $state([]);
  let singleView: boolean = $state(false);
  let viewOffset: number = $state(0);

  let events = $state([data.schedule]);

  $effect(() => {
    events = [data.schedule, selfData];
  });

  onMount(() => {
    ready.subscribe(async (ready) => {
      if (!$currentUser || !ready) return;
      // Get own schedule
      selfData = $schedules.find((r) => r.user === $currentUser?.id)?.schedule;
    });
  });
</script>

{#if data?.schedule?.length > 0}
  <Calendar
    bind:data={events}
    columns={singleView ? 1 : $settings.showWeekend === "true" ? 7 : 5}
    offset={viewOffset}
    multiplier={!singleView ? 1 : 2}
    select={(day: number) => {
      singleView = !singleView;
      viewOffset = singleView ? day : 0;
    }}
  >
    <div class="px-4 pt-4 flex gap-2 items-center justify-between">
      <div class="flex gap-4 items-center flex-wrap">
        <button
          class="btn btn-square btn-sm rounded-full"
          onclick={() => {
            history.back();
          }}
        >
          <PhArrowLeft></PhArrowLeft>
        </button>
        <h2 class="font-bold text-2xl tracking-tight">{data.username}</h2>
      </div>
      <div class="ml-auto flex gap-2 flex-wrap justify-end">
        <button
          class="btn btn-sm"
          onclick={() => {
            singleView = !singleView;
            viewOffset = singleView ? (new Date().getDay() + 13) % 7 : 0;
          }}>{!singleView ? "Today" : "Week"}</button
        >
      </div>
    </div>
  </Calendar>
{:else}
  <div class="grid h-screen">
    <p class="text-base-content/50 text-xl place-self-center text-center">No schedule found</p>
  </div>
{/if}
