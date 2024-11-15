<script lang="ts">
  import { title } from "$lib/store";
  $title = "Calendar";

  import { currentUser, ready, schedules } from "$lib/pocketbase";
  import { settings } from "$lib/settings";
  import { onMount } from "svelte";

  import Calendar from "$lib/components/calendar/Calendar.svelte";

  import PhDotsThreeVerticalBold from "~icons/ph/dots-three-vertical-bold";
  import PhDownloadSimple from "~icons/ph/download-simple";
  import PhPencilSimple from "~icons/ph/pencil-simple";

  import ExportModal from "./ExportModal.svelte";
  let exportModal: ExportModal | undefined = $state();

  let data: CalendarEvent[][] = $state([]);
  let status = $state({
    long: "",
    short: "",
  });

  let singleView: boolean = $state(false);
  let viewOffset: number = $state(0);

  onMount(() => {
    ready.subscribe(async (ready) => {
      if (!$currentUser || !ready) return;

      // Retrieve own schedule
      data = [$schedules.find((r) => r.user === $currentUser?.id)?.schedule];

      update();
      setInterval(update, 1000);
      function update() {
        status.long = new Date().toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });
        status.short = new Date().toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
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
    on:selectday={(e) => {
      singleView = !singleView;
      viewOffset = singleView ? e.detail.day : 0;
    }}
  >
    <div class="px-4 pt-2 flex gap-2 items-center mt-2">
      <h1 class="text-2xl font-bold tracking-tight hidden sm:inline">{status.long}</h1>
      <h1 class="text-2xl font-bold tracking-tight sm:hidden">{status.short}</h1>
      <div class="ml-auto flex gap-2 flex-wrap justify-end">
        <button
          class="btn btn-sm"
          onclick={() => {
            singleView = !singleView;
            viewOffset = singleView ? (new Date().getDay() + 13) % 7 : 0;
          }}>{!singleView ? "Today" : "Week"}</button
        >
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-sm btn-square">
            <PhDotsThreeVerticalBold></PhDotsThreeVerticalBold>
          </div>
          <ul
            role="menu"
            tabindex="0"
            class="dropdown-content my-2 menu bg-base-100 border rounded-box z-[1] w-52 p-2 shadow-lg"
          >
            <li><a href="/edit"><PhPencilSimple></PhPencilSimple>Edit</a></li>
            <li>
              <button onclick={exportModal?.show}>
                <PhDownloadSimple></PhDownloadSimple>Export (.ics)
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Calendar>
{/if}

<ExportModal bind:this={exportModal}></ExportModal>
