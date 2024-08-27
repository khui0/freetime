<script lang="ts">
  import { DeferredPromise } from "@open-draft/deferred-promise";
  import Modal from "./Modal.svelte";

  let modal: Modal;

  let result: DeferredPromise<string> | null;

  let titleText: string;
  let bodyText: string;
  let actionText: string;

  let additionalClasses: string;
  let disabled: boolean = false;

  let interval: number = 0;

  export function prompt(
    title: string,
    body: string,
    action: string,
    destructive: boolean = false,
  ) {
    result = new DeferredPromise();
    titleText = title;
    bodyText = body;
    clearInterval(interval);
    if (destructive) {
      additionalClasses = "btn-error";

      const seconds: number = 10;
      let current: number = seconds;

      actionText = seconds.toString();
      disabled = true;

      interval = setInterval(() => {
        if (current > 1) {
          current--;
          actionText = current.toString();
        } else {
          clearInterval(interval);
          actionText = action;
          disabled = false;
        }
      }, 1000);
    } else {
      actionText = action;
    }
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
>
  <p>{bodyText}</p>
  <form method="dialog" class="flex gap-2 mt-4" slot="buttons">
    <button class="btn btn-sm flex-1">Cancel</button>
    <button
      class="btn btn-sm flex-1 {additionalClasses}"
      on:click={() => {
        result?.resolve("");
      }}
      {disabled}
    >
      {actionText}
    </button>
  </form>
</Modal>
