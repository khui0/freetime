<script lang="ts">
  import { title } from "$lib/store";
  $title = "Reset password";

  import { pb } from "$lib/pocketbase";

  import FormErrors from "$lib/components/form/FormErrors.svelte";
  import FormField from "$lib/components/form/FormField.svelte";

  let email: Result;

  let errors: String[] = [];
  let success: string = "";

  let loading: boolean = false;

  async function submit() {
    validate();
    if (email.success) {
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
    if (email.error) errors.push(email.error);
  }
</script>

<form on:submit|preventDefault={submit} class="flex flex-col gap-3">
  <FormField type="email" bind:result={email}></FormField>
  <FormErrors bind:errors></FormErrors>
  <button class="btn" on:click={submit}>
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
