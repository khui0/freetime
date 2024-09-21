<script lang="ts">
  import Modal from "./Modal.svelte";
  import CalendarModalDetails from "./CalendarModalDetails.svelte";

  let modal: Modal;
  let selected: CalendarEvent;

  export function show(event: CalendarEvent) {
    selected = event;
    modal.show();
  }
</script>

<Modal title="{selected?.title} {selected?.number}" bind:this={modal}>
  {#if selected}
    {#key selected}
      <CalendarModalDetails event={selected}></CalendarModalDetails>
    {/key}
  {/if}
</Modal>
