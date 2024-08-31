<script lang="ts">
  let modal: HTMLDialogElement;

  import PhX from "~icons/ph/x";

  export function show() {
    modal.showModal();
  }

  export let title: string;
</script>

<dialog class="modal backdrop:bg-black/10" bind:this={modal} on:close>
  <div class="modal-box rounded-box p-4">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4" aria-label="Close">
        <PhX></PhX>
      </button>
    </form>
    <div class="flex flex-col gap-2 pl-1">
      <h2 class="font-bold text-2xl self-start pr-8">{title}</h2>
      <slot></slot>
    </div>
    <slot name="buttons"></slot>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
