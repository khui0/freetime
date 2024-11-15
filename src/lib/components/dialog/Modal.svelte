<script lang="ts">
  import { createBubbler } from "svelte/legacy";

  const bubble = createBubbler();
  let modal: HTMLDialogElement | undefined = $state();

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  import PhX from "~icons/ph/x";

  export function show() {
    modal?.showModal();
    dispatch("show");
  }

  export function close() {
    modal?.close();
    dispatch("close");
  }

  interface Props {
    title?: string;
    additionalClasses?: string;
    centered?: boolean;
    transparent?: boolean;
    icon?: import("svelte").Snippet;
    children?: import("svelte").Snippet;
    buttons?: import("svelte").Snippet;
  }

  let {
    title = "",
    additionalClasses = "",
    centered = false,
    transparent = false,
    icon,
    children,
    buttons,
  }: Props = $props();
</script>

<dialog
  class="modal {transparent ? 'backdrop:bg-transparent' : 'backdrop:bg-black/10'}"
  bind:this={modal}
  onclose={bubble("close")}
>
  <div
    class="modal-box rounded-box p-4 border {transparent ? 'shadow-lg' : ''} {additionalClasses}"
  >
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4" aria-label="Close">
        <PhX></PhX>
      </button>
    </form>
    <div class="flex flex-col gap-2 h-full" class:items-center={centered}>
      {@render icon?.()}
      {#if title !== ""}
        <h2 class="font-bold text-2xl {centered ? '' : 'self-start pr-8'}">{title}</h2>
      {/if}
      {@render children?.()}
    </div>
    {@render buttons?.()}
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
