<script lang="ts">
  import { title } from "$lib/store";
  $title = "Calendar";

  import { currentUser, pb, ensureScheduleExists, ensureFriendsExist } from "$lib/pocketbase";
  import { onMount } from "svelte";

  import Calendar from "$lib/components/Calendar.svelte";
  import EventDetails from "$lib/components/EventDetails.svelte";

  import Onboarding from "$lib/components/Onboarding.svelte";

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

<div class="flex flex-col mt-2 pb-[49px]">
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
  {#if data.length > 0}
    <Calendar
      bind:data
      on:expand={(e) => {
        details.show(e.detail.selected);
      }}
    ></Calendar>
  {:else}
    <div class="flex flex-col items-center justify-center gap-4">
      <h1 class="text-2xl font-bold">Welcome to Freetime</h1>
      <p>Add your schedule to get started</p>
      <a href="/edit" class="btn btn-sm btn-accent">Add schedule</a>
    </div>
  {/if}
</div>

{#if data.length === 0}
  <Onboarding></Onboarding>
{/if}

<EventDetails bind:this={details}></EventDetails>
