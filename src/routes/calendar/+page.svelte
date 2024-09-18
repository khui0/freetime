<script lang="ts">
  import { title, ready } from "$lib/store";
  $title = "Calendar";

  import { currentUser, pb } from "$lib/pocketbase";
  import { onMount } from "svelte";

  import Calendar from "$lib/components/Calendar.svelte";
  import EventDetails from "$lib/components/EventDetails.svelte";
  import Onboarding from "$lib/components/Onboarding.svelte";

  import PhPencilSimple from "~icons/ph/pencil-simple";

  let data: CalendarEvent[] = [];

  let details: EventDetails;

  let date: string = "";

  onMount(() => {
    ready.subscribe(async (ready) => {
      if (!$currentUser || !ready) return;

      const list = await pb.collection("schedules").getFullList();
      const schedule = list.find((record) => record.user === $currentUser?.id);
      data = schedule?.schedule;

      update();
      setInterval(update, 1000);
      function update() {
        date = new Date().toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "short",
        });
      }
    });
  });
</script>

<div class="flex flex-col mt-2">
  <div class="px-4 pt-2 flex gap-2 items-center">
    <h1 class="text-2xl font-bold">{date}</h1>
    <!-- <button class="btn btn-sm">Today</button> -->
    <div class="ml-auto">
      <a class="btn btn-sm btn-square" href="/edit"><PhPencilSimple></PhPencilSimple></a>
    </div>
  </div>
  {#if data.length > 0}
    <Calendar
      bind:data
      on:expand={(e) => {
        details.show(e.detail.selected);
      }}
    ></Calendar>
  {/if}
</div>

{#if data.length === 0 && ready}
  <Onboarding></Onboarding>
{/if}

<EventDetails bind:this={details}></EventDetails>
