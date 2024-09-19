<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  import { timeToMs, timeUntil } from "$lib/time";
  import pluralize from "pluralize";

  import PhX from "~icons/ph/x";

  const dispatch = createEventDispatcher();

  export let username: string;
  export let action: string = "";
  export let href: string = "";

  export let schedule: CalendarEvent[] = [];

  export let index: number = 0;

  interface Status {
    inClass: boolean;
    details: string[];
  }

  let status: Status | undefined;

  setInterval(() => {
    status = getStatus();
  }, 1000);

  function getStatus(): Status | undefined {
    const day = (new Date().getDay() + 13) % 7;
    const today = schedule.filter((event) => event.days[day]);

    if (today.length === 0) return;

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
        `${current.title} ${current.number} ends in ${timeUntil(current.from, current.to, true)}`,
      );
      details.push(`\n${pluralize("class", rest.length, true)} left today`);
    } else {
      if (rest.length === 0) {
        details.push("Done for the day");
      } else {
        details.push(`Next class is in ${timeUntil(rest[0].from, rest[0].to, true)}`);
        details.push(`\n${pluralize("class", rest.length, true)} left today`);
      }
    }

    return {
      inClass,
      details,
    };
  }
</script>

<div
  in:fade={{ duration: 250, delay: 50 * index }}
  class="flex rounded-box border pr-4 mb-4 first:mt-4 {schedule.length > 0
    ? 'active:opacity-50 transition-opacity'
    : ''}"
>
  <a
    class="flex-1 flex items-center gap-2 py-4 px-4 rounded-l-box"
    {href}
    class:hover:cursor-default={schedule.length === 0}
  >
    {#if schedule.length > 0}
      <div
        class="w-3 h-3 rounded-full flex-none {status
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
    on:click={() => {
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
