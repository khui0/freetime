<script lang="ts">
  import { title } from "$lib/store";
  $title = "Calendar";

  import { ready, currentUser, schedules } from "$lib/pocketbase";
  import { onMount } from "svelte";
  import { settings } from "$lib/settings";

  import Calendar from "$lib/components/Calendar.svelte";
  import CalendarModal from "$lib/components/CalendarModal.svelte";
  import Onboarding from "$lib/components/Onboarding.svelte";

  import PhPencilSimple from "~icons/ph/pencil-simple";

  let details: CalendarModal;

  let data: CalendarEvent[][] = [];
  let date: string = "";

  let singleView: boolean = false;
  let viewOffset: number = 0;

  onMount(() => {
    ready.subscribe(async (ready) => {
      if (!$currentUser || !ready) return;

      // Retrieve own schedule
      data = [$schedules.find((r) => r.user === $currentUser?.id)?.schedule];

      update();
      setInterval(update, 1000);
      function update() {
        date = new Date().toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });
      }
    });
  });
</script>

{#if data.length > 0}
  <Calendar
    bind:data
    columns={singleView ? 1 : $settings.showWeekend === "true" ? 7 : 5}
    offset={viewOffset}
    on:expand={(e) => {
      details.show(e.detail.selected);
    }}
    on:selectday={(e) => {
      singleView = !singleView;
      viewOffset = singleView ? e.detail.day : 0;
    }}
  >
    <div class="px-4 pt-2 flex gap-2 items-center mt-2">
      <h1 class="text-2xl font-bold tracking-tight">{date}</h1>
      <div class="ml-auto flex gap-2 flex-wrap justify-end">
        <button
          class="btn btn-sm"
          on:click={() => {
            singleView = !singleView;
            viewOffset = singleView ? (new Date().getDay() + 13) % 7 : 0;
          }}>{!singleView ? "Today" : "Week"}</button
        >
        <a class="btn btn-sm btn-square" href="/edit"><PhPencilSimple></PhPencilSimple></a>
      </div>
    </div>
  </Calendar>
{/if}

{#if data.length === 0 && ready}
  <Onboarding></Onboarding>
{/if}

<CalendarModal bind:this={details}></CalendarModal>
