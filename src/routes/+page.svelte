<script lang="ts">
  import { title } from "$lib/store";
  $title = "";

  import { currentUser, pb, ensureScheduleExists, ensureFriendsExist } from "$lib/pocketbase";
  import { onMount } from "svelte";

  import Calendar from "$lib/components/Calendar.svelte";
  import EventDetails from "$lib/components/EventDetails.svelte";

  let data: CalendarEvent[] = [];

  let details: EventDetails;

  onMount(async () => {
    if (!$currentUser) return;
    await ensureScheduleExists();
    await ensureFriendsExist();

    const list = await pb.collection("schedules").getFullList();
    const schedule = list.find((record) => record.user === $currentUser?.id);
    data = schedule?.schedule;
  });
</script>

<div class="flex flex-col">
  <div class="px-4 pt-2 flex gap-2 items-center">
    <button class="btn btn-sm">Today</button>
    <div class="ml-auto">
      <a class="btn btn-sm" href="/edit">
        {#if data.length > 0}
          Edit schedule
        {:else}
          Add schedule
        {/if}
      </a>
    </div>
  </div>
  <Calendar
    bind:data
    on:expand={(e) => {
      details.show(e.detail.selected);
    }}
  ></Calendar>
</div>

<EventDetails bind:this={details}></EventDetails>
