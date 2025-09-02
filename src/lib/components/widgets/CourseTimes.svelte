<script lang="ts">
  import { eventDurationCompact, timeTo12Hour } from "$lib/time";

  let { from, to }: { from: string; to: string } = $props();
</script>

<p>
  {timeTo12Hour(from, true)}
  &mdash;
  {timeTo12Hour(to, true)}
  ({eventDurationCompact(from, to)})
</p>
