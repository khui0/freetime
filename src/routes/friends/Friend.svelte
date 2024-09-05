<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { timeToMs, timeUntil } from "$lib/time";
  import pluralize from "pluralize";

  const dispatch = createEventDispatcher();

  export let username: string;
  export let action: string = "Remove";
  export let href: string = "";

  export let schedule: CalendarEvent[] = [];

  interface Status {
    inClass: boolean;
    message: string;
  }

  let status: Status = getStatus();

  setInterval(() => {
    status = getStatus();
  }, 1000);

  function getStatus(): Status {
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

    let message: string = "";

    if (inClass) {
      message = `${current.title} ${current.number} ends in ${timeUntil(current.from, current.to, true)}`;
      message += `\n${pluralize("class", rest.length + 1, true)} left today`;
    } else {
      if (rest.length === 0) {
        message = "Done for the day";
      } else {
        message = `Next class is in ${timeUntil(rest[0].from, rest[0].to, true)}`;
        message += `\n${pluralize("class", rest.length + 1, true)} left today`;
      }
    }

    return {
      inClass,
      message,
    };
  }
</script>

<div class="flex rounded-box border pr-4 mb-4 first:mt-4">
  <a class="flex-1 flex items-center gap-2 pl-4 py-4 rounded-box" {href}>
    <div
      class="w-3 h-3 rounded-full bg-base-300 flex-none {status.inClass
        ? 'bg-warning'
        : 'bg-success'}"
    ></div>
    <p class="pl-1 py-2">{username}</p>
    <p class="px-2 text-sm text-base-content/50 whitespace-pre-wrap">{status.message}</p>
  </a>
  <button
    class="btn btn-sm self-center"
    on:click={() => {
      dispatch("action");
    }}
    >{action}
  </button>
</div>
