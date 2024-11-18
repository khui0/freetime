<script lang="ts">
  import { timeToMs } from "$lib/time";
  import { update } from "$lib/utilities";
  import { settings } from "$lib/settings";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

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

  let parent: HTMLElement | undefined = $state();
  let rect: DOMRect | undefined = $derived(parent?.getBoundingClientRect());
  let hovering: boolean = $state(false);

  onMount(() => {
    parent?.addEventListener("pointerenter", () => {
      hovering = true;
    });
    parent?.addEventListener("pointerleave", () => {
      hovering = false;
    });
  });
</script>

<li>
  <a {href} class="h-9 flex items-center" bind:this={parent}>
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
      {$settings.obfuscateUsernames !== "true"
        ? username
        : username.slice(0, 1).toUpperCase() + "*".repeat(username.length - 1)}
    {/if}
  </a>
</li>

{#if compact && rect && hovering}
  <div
    in:fly={{ x: -10, duration: 250 }}
    out:fly={{ x: -10, duration: 250 }}
    class="absolute flex items-center pointer-events-none left-[3.5rem] z-50"
    style="top: {rect.top}px; height: {rect.height}px"
  >
    <div class="bg-base-100 rounded-badge px-2 py-1 border mx-1">
      {$settings.obfuscateUsernames !== "true"
        ? username
        : username.slice(0, 1).toUpperCase() + "*".repeat(username.length - 1)}
    </div>
  </div>
{/if}
