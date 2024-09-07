<script lang="ts">
  let modal: HTMLDialogElement;

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  import PhX from "~icons/ph/x";

  export function show() {
    modal.showModal();
    dispatch("show");
  }

  export function close() {
    modal.close();
    dispatch("close");
  }

  export let title: string;

  export let additionalClasses: string = "";
  export let centered: boolean = false;
</script>

<dialog class="modal backdrop:bg-black/10" bind:this={modal} on:close>
  <div class="modal-box rounded-box p-4 {additionalClasses}">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4" aria-label="Close">
        <PhX></PhX>
      </button>
    </form>
    <div class="flex flex-col gap-2 pl-1" class:items-center={centered}>
      <slot name="icon"></slot>
      <h2 class="font-bold text-2xl {centered ? '' : 'self-start pr-8'}">{title}</h2>
      <slot></slot>
    </div>
    <slot name="buttons"></slot>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
