<script lang="ts">
  import { preventDefault } from "svelte/legacy";

  import { title } from "$lib/store";
  $title = "Reset password";

  import { pb } from "$lib/pocketbase";

  import FormErrors from "$lib/components/form/FormErrors.svelte";
  import FormField from "$lib/components/form/FormField.svelte";

  let email: Result | undefined = $state();

  let errors: String[] = $state([]);
  let success: string = $state("");

  let loading: boolean = $state(false);

  async function submit() {
    validate();
    if (email?.success) {
      loading = true;
      await pb.collection("users").requestPasswordReset(email.success);
      setTimeout(() => {
        loading = false;
        success = "Email sent if there an account exists with this email";
      }, 3000);
    }
  }

  function validate() {
    loading = false;
    errors = [];
    if (email?.error) errors.push(email.error);
  }
</script>

<form onsubmit={preventDefault(submit)} class="flex flex-col gap-3">
  <FormField type="email" bind:result={email}></FormField>
  <FormErrors bind:errors></FormErrors>
  <button class="btn" onclick={submit}>
    {#if !loading}
      Reset
    {:else}
      <span class="loading loading-spinner loading-sm"></span>
    {/if}
  </button>
  {#if success}
    <p class="text-sm text-success">{success}</p>
  {/if}
</form>
