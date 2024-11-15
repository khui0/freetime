<script lang="ts">
  import { DeferredPromise } from "@open-draft/deferred-promise";
  import Modal from "./Modal.svelte";

  let modal: Modal | undefined = $state();

  let result: DeferredPromise<string> | null | undefined = $state();

  let titleText: string | undefined = $state();
  let bodyText: string | undefined = $state();
  let actionText: string | undefined = $state();

  let additionalClasses: string | undefined = $state();
  let disabled: boolean = $state(false);

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
    modal?.show();
    return result;
  }
</script>

<Modal
  title={titleText}
  bind:this={modal}
  onclose={() => {
    result?.reject();
  }}
>
  <p>{bodyText}</p>
  {#snippet buttons()}
    <form method="dialog" class="flex gap-2 mt-4">
      <button class="btn btn-sm flex-1">Cancel</button>
      <button
        class="btn btn-sm flex-1 {additionalClasses}"
        onclick={() => {
          result?.resolve("");
        }}
        {disabled}
      >
        {actionText}
      </button>
    </form>
  {/snippet}
</Modal>
