<script lang="ts">
  import { title } from "$lib/store";
  $title = "";

  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { timeToMs, timeUntil, eventDuration, timeTo12Hour } from "$lib/time";
  import { currentUser, pb, ensureScheduleExists, ensureFriendsExist } from "$lib/pocketbase";
  import { types, locations } from "$lib/sbu";

  import PhArrowRight from "~icons/ph/arrow-right";

  import Welcome from "$lib/components/Welcome.svelte";

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

  onMount(async () => {
    if (!$currentUser) return;
    await ensureScheduleExists();
    await ensureFriendsExist();

    const list = await pb.collection("schedules").getFullList();
    const schedule = list.find((record) => record.user === $currentUser?.id);
    data = schedule?.schedule;

    update();
    setInterval(update, 1000);

    function update() {
      status = getStatus();
      until = timeUntil(status.event?.from, status.event?.to) || "";
    }
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
      message = "You have no classes today";
    } else if (inClass) {
      message = "You are currently in";
    } else {
      if (rest.length === 0) {
        message = "You're all done for the day!";
      } else {
        message = `Your next class is in ${timeUntil(rest[0].from, rest[0].to, true)}`;
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

<div class="h-full flex flex-col px-4 py-8 gap-6 w-[min(100%,800px)] justify-center mx-auto">
  {#if status}
    <div class="flex flex-col gap-4 px-4" in:fade={{ duration: 250 }}>
      <h1 class="font-bold text-2xl">{status.greeting}, {$currentUser?.username}!</h1>
      <p class="text-xl font-bold">{status.message}</p>
    </div>
    {#if status.event}
      <div class="rounded-box border p-4 flex flex-col gap-2 h-fit">
        <h2 class="font-bold text-2xl pl-1">{status.event.title} {status.event.number}</h2>
        <div class="flex gap-1 justify-between px-1">
          <h2>{types[status.event.type]}</h2>
          <p class="flex items-center gap-2">
            {timeTo12Hour(status.event.from, true)}
            <span><PhArrowRight></PhArrowRight></span>
            {timeTo12Hour(status.event.to, true)}
          </p>
        </div>
        <div class="flex gap-1 justify-between px-1">
          <p>
            {until}
          </p>
          <p>{eventDuration(status.event.from, status.event.to)}</p>
        </div>
        <hr />
        <div class="flex gap-2 items-center flex-wrap mt-2">
          <p class="border border-base-content w-fit h-fit px-2 rounded-badge">
            {status.event.room}
          </p>
          <p>{locations[status.event.location].name}</p>
        </div>
        {#if locations[status.event.location].maps}
          <a href={locations[status.event.location].maps} class="btn btn-sm self-start mt-2">
            Open in Google Maps
          </a>
        {/if}
      </div>
    {/if}
    <div class="px-4 flex flex-col gap-4" in:fade={{ duration: 250, delay: 50 }}>
      <p class="text-xl font-bold">
        <span class="bg-base-300 py-1 px-2 rounded-lg">
          {status.classesToday - status.classesRemaining}/{status.classesToday}
        </span> classes completed
      </p>
      <progress
        class="progress progress-accent"
        value={status.classesToday - status.classesRemaining}
        max={status.classesToday}
      ></progress>
    </div>
  {/if}
</div>

{#if !$currentUser}
  <Welcome></Welcome>
{/if}
