<script lang="ts">
  import Modal from "$lib/components/dialog/Modal.svelte";

  let modal: Modal | undefined = $state();

  export function show() {
    modal?.show();
  }

  import { currentUser, schedules } from "$lib/pocketbase";
  import { locations, types } from "$lib/sbu";
  import { timeToS } from "$lib/time";
  import saveAs from "file-saver";
  import * as ics from "ics";
  import pluralize from "pluralize";

  function save() {
    if (!ical) return;
    const blob = new Blob([ical], { type: "text/calendar" });
    saveAs(blob, `freetime-${$currentUser?.username}-schedule.ics`);
  }

  function duration(from: string, to: string) {
    if (!from || !to) return;
    const seconds = timeToS(to) - timeToS(from);
    const minutes = seconds / 60;
    const hours = minutes / 60;
    return {
      hours: Math.floor(hours),
      minutes: Math.floor(minutes % 60),
    };
  }

  function rrule(days: boolean[]) {
    const strings = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
    const array = strings.filter((_, i) => days[i]);
    return `FREQ=WEEKLY;BYDAY=${array.join(",")};INTERVAL=1;UNTIL=${lastDayOfClasses()}`;
  }

  function lastDayOfClasses() {
    const date = new Date();
    const endDates = ["2025-01-24", "2025-05-10", "2025-12-08"];
    let selected = endDates.find((item) => date <= new Date(item));

    if (selected) {
      return new Date(selected).toISOString().replace(/(\.000)|[-,:,]/g, "");
    }
    return null;
  }

  function lastDayOfClassesHumanReadable() {
    const date = new Date();
    const endDates = ["2025-01-24", "2025-05-10", "2025-12-08"];
    let selected = endDates.find((item) => date <= new Date(item));

    if (selected) {
      const end = new Date(selected);
      const tzo = end.getTimezoneOffset() * 60000;
      const adjusted = new Date(end.getTime() + tzo);
      return adjusted.toLocaleDateString();
    }
    return null;
  }

  function startDate(days: boolean[]) {
    const target = (days.findIndex((i) => i) + 1) % 7;
    const d = new Date();
    const diff = target - d.getDay();
    const adjusted = new Date(d.setDate(d.getDate() + diff));
    return {
      year: adjusted.getFullYear(),
      month: adjusted.getMonth() + 1,
      day: adjusted.getDate(),
    };
  }

  let schedule = $derived($schedules.find((item) => item.user === $currentUser?.id)?.schedule);

  let events = $derived(
    schedule?.map((event: CalendarEvent) => {
      const hours = parseInt(event.from.split(":")[0]);
      const minutes = parseInt(event.from.split(":")[1]);
      const start = startDate(event.days);
      const result: { [key: string]: any } = {
        start: [start.year, start.month, start.day, hours, minutes],
        startOutputType: "local",
        duration: duration(event.from, event.to),
        title: `${event.title} ${event.number}`,
        description: `${types[event.type]}`,
        recurrenceRule: rrule(event.days),
        productId: "-//KENNYHUI//NONSGML freetime.kennyhui.dev//EN",
      };
      if (event.location) {
        result.location = `${event.room.toUpperCase()} - ${locations[event.location].name}`;
      }
      return result;
    }),
  );

  let ical = $derived(ics.createEvents(events).value);
</script>

<Modal bind:this={modal} title="Export iCalendar">
  {#if ical}
    <p>Generated an iCalendar file for {pluralize("event", events.length, true)}:</p>
    <ul>
      {#each events as event}
        <li class="flex justify-between flex-wrap border-b">
          <p>{event.title}</p>
          <p>{event.location}</p>
        </li>
      {/each}
    </ul>
    <p>Classes End: {lastDayOfClassesHumanReadable()}</p>
    <button class="btn btn-sm" onclick={save}>Export (.ics)</button>
  {:else}
    <p>Unable to generate file</p>
  {/if}
</Modal>
