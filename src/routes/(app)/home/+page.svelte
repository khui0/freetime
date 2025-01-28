<script lang="ts">
  import { title } from "$lib/store";
  $title = "";

  import { currentUser, ready, schedules } from "$lib/pocketbase";
  import { settings } from "$lib/settings";
  import { timeToMs, timeUntil, timeUntilShort } from "$lib/time";
  import { update } from "$lib/utilities";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  import TodayProgress from "$lib/components/widgets/TodayProgress.svelte";

  import CourseLocation from "$lib/components/widgets/CourseLocation.svelte";
  import CourseTimes from "$lib/components/widgets/CourseTimes.svelte";

  import PhCalendarDots from "~icons/ph/calendar-dots";
  import PhPencilSimple from "~icons/ph/pencil-simple";
  import FloatingBar from "$lib/components/FloatingBar.svelte";

  let data: CalendarEvent[] = $state([]);

  let status:
    | {
        message: string;
        greeting: string;
        event: CalendarEvent;
        inClass: boolean;
        classesRemaining: number;
        classesToday: number;
        currentRemaining: number;
      }
    | undefined = $state();

  let until: string;
  let untilShort: string;

  onMount(() => {
    ready.subscribe(async (ready) => {
      if (!$currentUser || !ready) return;

      // Retrieve own schedule
      data = $schedules.find((r) => r.user === $currentUser?.id)?.schedule;

      update(() => {
        status = getStatus();
        until = timeUntil(status.event?.from, status.event?.to) || "";
        untilShort = timeUntilShort(status.event?.from, status.event?.to) || "";
      });
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

    const rest = today
      .filter((event) => timeToMs(event.from) > Date.now())
      .sort((a, b) => timeToMs(a.from) - timeToMs(b.from));
    const inClass = current !== undefined;
    let message: string = "";

    if (today.length === 0) {
      message = "No classes today";
    } else if (inClass) {
      message = `${current.title} ${current.number} ends in ${timeUntil(current.from, current.to, true)}`;
    } else {
      if (rest.length === 0) {
        message = "Done for the day!";
      } else {
        message = `${rest[0].title} ${rest[0].number} starts in ${timeUntil(rest[0].from, rest[0].to, true)}`;
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
      currentRemaining: current
        ? 100 -
          ((timeToMs(current?.to) - Date.now()) * 100) /
            (timeToMs(current.to) - timeToMs(current.from))
        : 0,
    };
  }
</script>

<div
  class="flex flex-col p-8 gap-6 w-[min(100%,800px)] justify-center mx-auto {$settings.tallNavigation ===
  'true'
    ? 'h-[calc(100svh-49px-2rem)]'
    : 'h-[calc(100svh-49px)]'}"
>
  {#if status}
    {@const newUser = data.length === 0 && $ready}
    <div class="flex flex-col gap-4">
      <div class="flex gap-2 items-center justify-between">
        <h1 class="font-bold text-4xl tracking-tight">
          {newUser ? "Welcome" : status.greeting}!
        </h1>
      </div>
      <p class="text-xl tracking-tight">
        {newUser ? "Start by adding your classes!" : status.message}
      </p>
    </div>
    {#if status.event}
      <div class="flex flex-col gap-2 pl-2 border-l-2">
        <CourseTimes {...status.event}></CourseTimes>
        <CourseLocation {...status.event}></CourseLocation>
      </div>
    {/if}
    {#if status.classesToday > 0}
      <div class=" flex flex-col gap-4">
        <p class="text-lg">
          <span class="font-bold bg-base-200 py-1 px-2 rounded-lg">
            {status.classesToday - status.classesRemaining}/{status.classesToday}
          </span> classes completed
        </p>
        <TodayProgress></TodayProgress>
      </div>
    {/if}
    <FloatingBar shadow={false}>
      <a href={newUser ? "/edit" : "/calendar"} class="btn btn-sm rounded-full">
        <PhCalendarDots></PhCalendarDots>
        {newUser ? "Add classes" : "View calendar"}
      </a>
      <a href="/edit" class="btn btn-square rounded-full btn-sm">
        <PhPencilSimple></PhPencilSimple>
      </a>
    </FloatingBar>
  {/if}
</div>
