<script lang="ts">
  import Modal from "./Modal.svelte";

  let modal: Modal;

  export function show() {
    modal.show();
  }

  import { currentUser, schedules } from "$lib/pocketbase";
  import { locations, types } from "$lib/sbu";
  import { timeToS } from "$lib/time";
  import * as ics from "ics";
  import saveAs from "file-saver";
  import pluralize from "pluralize";

  $: schedule = $schedules.find((item) => item.user === $currentUser?.id)?.schedule;
  $: events = schedule?.map((event: CalendarEvent) => {
    const hours = parseInt(event.from.split(":")[0]);
    const minutes = parseInt(event.from.split(":")[1]);
    const start = startDate(event.days);
    return {
      start: [start.year, start.month, start.day, hours, minutes],
      duration: duration(event.from, event.to),
      title: `${event.title} ${event.number}`,
      description: `${types[event.type]}`,
      location: `${event.room.toUpperCase()} - ${locations[event.location].name}`,
      geo: {
        lat: parseFloat(locations[event.location].lat || "0"),
        lon: parseFloat(locations[event.location].lon || "0"),
      },
      recurrenceRule: rrule(event.days),
    };
  });
  $: ical = ics.createEvents(events).value;

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
    return `FREQ=WEEKLY;BYDAY=${array.join(",")};INTERVAL=1`;
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
</script>

<Modal bind:this={modal} title="Export ICS">
  {#if ical}
    <p>Generated a calendar file for {pluralize("event", events.length, true)}:</p>
    <ul>
      {#each events as event}
        <li>{event.title} - {event.location}</li>
      {/each}
    </ul>
    <button class="btn btn-sm" on:click={save}>Export</button>
  {:else}
    <p>Unable to generate ICS file</p>
  {/if}
</Modal>
