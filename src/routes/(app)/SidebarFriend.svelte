<script lang="ts">
  import { timeToMs } from "$lib/time";
  import { update } from "$lib/utilities";

  let {
    username,
    href = "",
    compact,
    schedule = [],
  }: {
    username: string;
    href?: string;
    compact: boolean;
    schedule?: CalendarEvent[];
  } = $props();

  interface Status {
    inClass: boolean;
    offHours: boolean;
  }

  let status: Status | undefined = $state();

  update(() => {
    status = getStatus();
  });

  function getStatus(): Status | undefined {
    const day = (new Date().getDay() + 13) % 7;
    const today = schedule.filter((event) => event.days[day]);

    const current = today.find((event) => {
      const now = Date.now();
      const start = timeToMs(event.from);
      const end = timeToMs(event.to);
      return now >= start && now < end;
    });

    const inClass = current !== undefined;

    const hour = new Date().getHours();
    const offHours = hour < 8 || hour >= 20;

    return {
      inClass,
      offHours,
    };
  }
</script>

<li>
  <a {href} class="h-9 flex items-center">
    <div class="w-[1.2em] flex items-center justify-center">
      <div
        class="w-3 h-3 rounded-full flex-none {status && !status.offHours
          ? status.inClass
            ? 'bg-warning'
            : 'bg-success'
          : 'bg-base-300'} transition-colors"
      ></div>
    </div>
    {#if !compact}
      {username}
    {/if}
  </a>
</li>
