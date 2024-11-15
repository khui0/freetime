<script lang="ts">
  import { DeferredPromise } from "@open-draft/deferred-promise";
  import Modal from "./Modal.svelte";

  import PhWarningLight from "~icons/ph/warning-light";

  let modal: Modal;

  let result: DeferredPromise<string> | null;

  let titleText: string;
  let bodyText: string;

  let additionalClasses: string;

  export function prompt(title: string, body: string) {
    result = new DeferredPromise();
    titleText = title;
    bodyText = body;
    modal.show();
    return result;
  }
</script>

<Modal
  title={titleText}
  bind:this={modal}
  on:close={() => {
    result?.reject();
  }}
  additionalClasses="max-w-sm items-center"
  centered
>
  <span slot="icon" class="text-5xl">
    <PhWarningLight></PhWarningLight>
  </span>
  <p>{bodyText}</p>
  <form method="dialog" class="flex gap-2 mt-4" slot="buttons">
    <button
      class="btn btn-sm flex-1 {additionalClasses}"
      on:click={() => {
        result?.resolve("");
      }}
    >
      Okay
    </button>
  </form>
</Modal>
