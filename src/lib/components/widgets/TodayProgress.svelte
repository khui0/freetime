<script lang="ts">
  import { currentUser, ready, schedules } from "$lib/pocketbase";
  import { timeToMs } from "$lib/time";
  import { update } from "$lib/utilities";
  import { onMount } from "svelte";

  import SegmentedProgress from "./SegmentedProgress.svelte";

  let data: CalendarEvent[] = $state([]);

  let value: number = $state(0);
  let max: number = $state(0);
  let progress: number = $state(0);

  let { class: classList }: { class?: string } = $props();

  onMount(() => {
    ready.subscribe(async (ready) => {
      if (!$currentUser || !ready) return;

      // Retrieve own schedule
      data = $schedules.find((r) => r.user === $currentUser?.id)?.schedule;

      update(() => {
        const day = (new Date().getDay() + 13) % 7;
        const today = data.filter((event) => event.days[day]);

        const current = today.find((event) => {
          const now = Date.now();
          const start = timeToMs(event.from);
          const end = timeToMs(event.to);
          return now >= start && now < end;
        });

        const rest = today.filter((event) => timeToMs(event.from) > Date.now());

        max = today.length;
        value = today.length - rest.length - (current ? 1 : 0);
        progress = current
          ? 100 -
            ((timeToMs(current?.to) - Date.now()) * 100) /
              (timeToMs(current.to) - timeToMs(current.from))
          : 0;
      });
    });
  });
</script>

<SegmentedProgress {value} {max} {progress} class={classList}></SegmentedProgress>
