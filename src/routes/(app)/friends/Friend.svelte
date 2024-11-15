<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  import { timeToMs, timeUntilShort } from "$lib/time";
  import pluralize from "pluralize";

  import PhX from "~icons/ph/x";

  const dispatch = createEventDispatcher();

  let {
    username,
    action = "",
    href = "",
    schedule = [],
    index = 0,
  }: {
    username: string;
    action?: string;
    href?: string;
    schedule?: CalendarEvent[];
    index?: number;
  } = $props();

  interface Status {
    inClass: boolean;
    details: string[];
    offHours: boolean;
  }

  let status: Status | undefined = $state();

  status = getStatus();
  setInterval(() => {
    status = getStatus();
  }, 1000);

  function getStatus(): Status | undefined {
    const day = (new Date().getDay() + 13) % 7;
    const today = schedule.filter((event) => event.days[day]);

    const current = today.find((event) => {
      const now = Date.now();
      const start = timeToMs(event.from);
      const end = timeToMs(event.to);
      return now >= start && now < end;
    });

    const rest = today.filter((event) => timeToMs(event.from) > Date.now());

    const inClass = current !== undefined;

    let details: string[] = [];

    if (today.length === 0) {
      details.push("No classes today");
    } else if (inClass) {
      details.push(
        `${current.title} ${current.number} ends in ${timeUntilShort(current.from, current.to)}`,
      );
      details.push(`\n${pluralize("class", rest.length, true)} left`);
    } else {
      if (rest.length === 0) {
        details.push("Done for the day");
      } else {
        details.push(
          `${rest[0].title} ${rest[0].number} starts in ${timeUntilShort(rest[0].from, rest[0].to)}`,
        );
        details.push(`\n${pluralize("class", rest.length, true)} left`);
      }
    }

    const hour = new Date().getHours();
    const offHours = hour < 8 || hour >= 20;

    return {
      inClass,
      details,
      offHours,
    };
  }
</script>

<div
  in:fade={{ duration: 250, delay: 50 * index }}
  class="flex rounded-box border pr-3 mb-4 last:mb-0 {schedule.length > 0
    ? 'active:opacity-50 transition-opacity'
    : ''}"
>
  <a
    class="flex-1 flex items-center gap-2 py-2 px-4 rounded-l-box"
    {href}
    class:hover:cursor-default={schedule.length === 0}
  >
    {#if schedule.length > 0}
      <div
        class="w-3 h-3 rounded-full flex-none {status && !status.offHours
          ? status.inClass
            ? 'bg-warning'
            : 'bg-success'
          : 'bg-base-300'} transition-colors"
      ></div>
    {/if}
    <p class="pl-1 py-2">{username}</p>
    {#if schedule.length}
      <div class="px-2 text-sm text-base-content/50 flex justify-between w-full flex-wrap gap-x-4">
        {#if status}
          {#each status.details as detail}
            <p>{detail}</p>
          {/each}
        {:else}
          <span class="loading loading-spinner loading-xs"></span>
        {/if}
      </div>
    {/if}
  </a>
  <button
    class="btn btn-sm self-center"
    class:btn-square={!action}
    onclick={() => {
      dispatch("action");
    }}
  >
    {#if action}
      {action}
    {:else}
      <PhX></PhX>
    {/if}
  </button>
</div>
