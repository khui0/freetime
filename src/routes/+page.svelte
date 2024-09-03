<script lang="ts">
  import { title } from "$lib/store";
  $title = "";

  import { currentUser, pb } from "$lib/pocketbase";
  import { onMount } from "svelte";

  import { locations, types } from "$lib/sbu";
  import { timeTo12Hour, eventDuration } from "$lib/time";

  import Calendar from "$lib/components/Calendar.svelte";
  import Modal from "$lib/components/Modal.svelte";

  let data: CalendarEvent[] = [];

  let modal: Modal;
  let selected: CalendarEvent;

  onMount(async () => {
    // Create record if it doesn't exist
    await pb
      .collection("schedules")
      .getFirstListItem(`user="${$currentUser?.id}"`)
      .catch(() => {
        pb.collection("schedules").create({ user: $currentUser?.id, schedule: [] });
      });

    const list = await pb.collection("schedules").getFullList();
    const schedule = list.find((record) => record.user === $currentUser?.id);
    data = schedule?.schedule;
  });
</script>

<div class="flex flex-col">
  <div class="px-4 pt-2 flex gap-2 items-center">
    <button class="btn btn-sm">Today</button>
    <div class="ml-auto">
      <a class="btn btn-sm" href="/edit">Edit schedule</a>
    </div>
  </div>
  <Calendar
    bind:data
    on:expand={(e) => {
      selected = e.detail.selected;
      modal.show();
    }}
  ></Calendar>
</div>

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
