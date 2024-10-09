<script lang="ts">
  import Modal from "./Modal.svelte";
  import EventDetails from "./EventDetails.svelte";

  let modal: Modal;
  let selected: CalendarEvent;

  export function show(event: CalendarEvent) {
    selected = event;
    modal.show();
  }
</script>

<Modal bind:this={modal} transparent>
  {#if selected}
    {#key selected}
      <EventDetails event={selected}></EventDetails>
    {/key}
  {/if}
</Modal>
