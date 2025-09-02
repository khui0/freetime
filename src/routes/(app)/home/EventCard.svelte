<script lang="ts">
  import CourseLocation from "$lib/components/widgets/CourseLocation.svelte";
  import CourseTimes from "$lib/components/widgets/CourseTimes.svelte";
  import CourseTitle from "$lib/components/widgets/CourseTitle.svelte";
  import { timeToMs, timeUntil } from "$lib/time";

  let {
    event,
  }: {
    event: CalendarEvent;
  } = $props();

  let next = $derived(timeToMs(event.from) > Date.now());
</script>

<div class="flex flex-wrap justify-between items-center p-4 border rounded-box">
  <div class="flex flex-col gap-2">
    <CourseTitle {...event} />
    <CourseTimes {...event} />
    <CourseLocation {...event} />
  </div>
  <div>
    <p class="border my-1 border-base-content px-1.5 rounded-lg text-sm">
      {#if next}
        in
      {/if}
      {timeUntil(event.from, event.to, true)}
      {#if !next}
        left
      {/if}
    </p>
  </div>
</div>
