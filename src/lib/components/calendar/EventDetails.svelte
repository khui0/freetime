<script lang="ts">
  import { msToUnits, timeToMs, timeUntil } from "$lib/time";
  import { update } from "$lib/utilities";
  import { onMount } from "svelte";
  import CourseDays from "../widgets/CourseDays.svelte";
  import CourseLocation from "../widgets/CourseLocation.svelte";
  import CourseRadialProgress from "../widgets/CourseRadialProgress.svelte";
  import CourseTimes from "../widgets/CourseTimes.svelte";
  import CourseTitle from "../widgets/CourseTitle.svelte";

  let {
    event,
  }: {
    event: CalendarEvent;
  } = $props();

  let inClass: boolean = $state(false);
  let today: boolean = $state(false);

  let until: string = $state("");
  let progress: number = $state(0);
  let remaining: {
    hours: string;
    minutes: string;
  } = $state({ hours: "0", minutes: "0" });

  onMount(() => {
    update(() => {
      today = event.days[(new Date().getDay() + 13) % 7];

      const now = Date.now();
      const start = timeToMs(event.from);
      const end = timeToMs(event.to);

      inClass = start <= now && now < end;

      if (inClass) {
        progress = ((now - start) / (end - start)) * 100;

        let time;
        if (now < start) {
          time = msToUnits(start - now);
        } else if (now < end) {
          time = msToUnits(end - now);
        }

        if (time) {
          remaining = {
            hours: time?.hours.toString() || "",
            minutes: (time?.minutes + 1).toString().padStart(2, "0"),
          };
        }
      }

      if (today) {
        until = timeUntil(event?.from, event?.to) || "";
      }
    });
  });
</script>

<CourseTitle {...event}></CourseTitle>
<div class="flex flex-wrap items-center justify-between gap-x-2">
  <div class="my-2">
    <CourseTimes {...event}></CourseTimes>
  </div>
  <CourseDays {...event}></CourseDays>
</div>
<CourseLocation {...event}></CourseLocation>
