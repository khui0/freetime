<script lang="ts">
  import { DeferredPromise } from "@open-draft/deferred-promise";
  import Modal from "./Modal.svelte";

  import PhWarningLight from "~icons/ph/warning-light";

  let modal: Modal | undefined = $state();

  let result: DeferredPromise<string> | null | undefined = $state();

  let titleText: string | undefined = $state();
  let bodyText: string | undefined = $state();

  let additionalClasses: string;

  export function prompt(title: string, body: string) {
    result = new DeferredPromise();
    titleText = title;
    bodyText = body;
    modal?.show();
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
  {#snippet icon()}
    <span class="text-5xl">
      <PhWarningLight></PhWarningLight>
    </span>
  {/snippet}
  <p>{bodyText}</p>
  {#snippet buttons()}
    <form method="dialog" class="flex gap-2 mt-4">
      <button
        class="btn btn-sm flex-1 {additionalClasses}"
        onclick={() => {
          result?.resolve("");
        }}
      >
        Okay
      </button>
    </form>
  {/snippet}
</Modal>
