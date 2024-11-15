<script lang="ts">
  import { timeTo12Hour, eventDurationMedium } from "$lib/time";

  let { from, to }: { from: string; to: string } = $props();
</script>

<p>
  {timeTo12Hour(from, true)}
  &mdash;
  {timeTo12Hour(to, true)}
  ({eventDurationMedium(from, to)})
</p>
