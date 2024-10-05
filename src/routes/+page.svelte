<script lang="ts">
  import { title } from "$lib/store";
  $title = "";

  import { ready, currentUser, schedules } from "$lib/pocketbase";
  import { timeToMs, timeUntil, timeUntilShort } from "$lib/time";
  import { settings } from "$lib/settings";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  import CalendarModalDetails from "$lib/components/CalendarModalDetails.svelte";
  import ClassesProgress from "$lib/components/ClassesProgress.svelte";

  import Welcome from "$lib/components/Welcome.svelte";
  import Onboarding from "$lib/components/Onboarding.svelte";

  import PhPencilSimple from "~icons/ph/pencil-simple";

  let data: CalendarEvent[] = [];

  let status: {
    message: string;
    greeting: string;
    event: CalendarEvent;
    inClass: boolean;
    classesRemaining: number;
    classesToday: number;
  };

  let until: string;
  let untilShort: string;

  onMount(() => {
    ready.subscribe(async (ready) => {
      if (!$currentUser || !ready) return;

      // Retrieve own schedule
      data = $schedules.find((r) => r.user === $currentUser?.id)?.schedule;

      update();
      setInterval(update, 1000);
      function update() {
        status = getStatus();
        until = timeUntil(status.event?.from, status.event?.to) || "";
        untilShort = timeUntilShort(status.event?.from, status.event?.to) || "";
      }
    });
  });

  function getStatus() {
    const day = (new Date().getDay() + 13) % 7;
    const today = data.filter((event) => event.days[day]);

    const current = today.find((event) => {
      const now = Date.now();
      const start = timeToMs(event.from);
      const end = timeToMs(event.to);
      return now >= start && now < end;
    });

    const hour = new Date().getHours();

    const rest = today.filter((event) => timeToMs(event.from) > Date.now());
    const inClass = current !== undefined;
    let message: string = "";

    if (today.length === 0) {
      message = "No classes today";
    } else if (inClass) {
      message = `Class ends in ${timeUntil(current.from, current.to, true)}`;
    } else {
      if (rest.length === 0) {
        message = "Done for the day!";
      } else {
        message = `Next class is in ${timeUntil(rest[0].from, rest[0].to, true)}`;
      }
    }

    let greeting: string = "";

    if (hour < 12) {
      greeting = "Good morning";
    } else if (hour < 18) {
      greeting = "Good afternoon";
    } else if (hour < 21) {
      greeting = "Good evening";
    } else {
      greeting = "Good night";
    }

    return {
      message,
      greeting,
      event: current || rest[0],
      inClass,
      classesRemaining: rest.length + (current ? 1 : 0),
      classesToday: today.length,
    };
  }
</script>

<div
  class="flex flex-col px-4 py-8 gap-6 w-[min(100%,800px)] justify-center mx-auto {$settings.tallNavigation ===
  'true'
    ? 'h-[calc(100svh-49px-2rem)]'
    : 'h-[calc(100svh-49px)]'}"
>
  {#if status}
    <div class="flex flex-col gap-4 px-4" in:fade={{ duration: 250 }}>
      <div class="flex gap-2 items-center justify-between">
        <h1 class="font-bold text-4xl">{status.greeting}!</h1>
        <a href="/edit" class="btn btn-square rounded-full btn-sm"
          ><PhPencilSimple></PhPencilSimple></a
        >
      </div>
      <p class="text-xl">{status.message}</p>
    </div>
    {#if status.event}
      <div
        class="rounded-box border p-4 flex flex-col gap-2 h-fit"
        in:fade|global={{ duration: 250, delay: 50 }}
      >
        <CalendarModalDetails event={status.event}></CalendarModalDetails>
      </div>
    {/if}
    {#if status.classesToday > 0}
      <div
        class="px-4 flex flex-col gap-4"
        in:fade|global={{ duration: 250, delay: 50 + (status.event ? 50 : 0) }}
      >
        <p class="text-xl font-bold">
          <span class="bg-base-300 py-1 px-2 rounded-lg">
            {status.classesToday - status.classesRemaining}/{status.classesToday}
          </span> classes completed
        </p>
        <ClassesProgress
          value={status.classesToday - status.classesRemaining}
          max={status.classesToday}
          inProgress={status.inClass}
        ></ClassesProgress>
      </div>
    {/if}
    <a
      in:fade|global={{ duration: 250, delay: 100 + (status.event ? 50 : 0) }}
      href="/calendar"
      class="btn btn-sm rounded-full self-center">View calendar</a
    >
  {/if}
</div>

{#if !$currentUser}
  <Welcome></Welcome>
{:else if data.length === 0 && $ready}
  <Onboarding></Onboarding>
{/if}
