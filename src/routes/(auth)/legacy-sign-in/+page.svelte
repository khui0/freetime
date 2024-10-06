<script lang="ts">
  import { title } from "$lib/store";
  $title = "Sign in";

  import { currentUser, pb } from "$lib/pocketbase";

  import FormField from "$lib/components/FormField.svelte";
  import FormErrors from "$lib/components/FormErrors.svelte";

  let email: Result;
  let password: Result;

  let errors: String[] = [];

  let loading: boolean = false;

  currentUser.subscribe((value: any) => {
    if (value !== null) {
      window.location.replace("/");
    }
  });

  async function submit() {
    validate();
    try {
      if (email.success && password.success) {
        loading = true;
        await pb.collection("users").authWithPassword(email.success, password.success);
      }
    } catch (err) {
      setTimeout(() => {
        errors = ["Invalid credentials"];
        loading = false;
      }, 3000);
    }
  }

  function validate() {
    loading = false;
    errors = [];
    if (email.error) errors.push(email.error);
    if (password.error) errors.push(password.error);
  }
</script>

<form on:submit|preventDefault={submit} class="flex flex-col gap-3">
  <p class="text-center text-sm">
    Email sign in is now deprecated. Consider signing in through Google. If you need to have your
    account email changed to your Gmail, contact
    <a class="link" href="mailto:support@kennyhui.dev">support@kennyhui.dev</a>
  </p>
  <FormField type="email" bind:result={email}></FormField>
  <FormField type="password" bind:result={password}></FormField>
  <FormErrors bind:errors></FormErrors>
  <button class="btn" on:click={submit}>
    {#if !loading}
      Sign in
    {:else}
      <span class="loading loading-spinner loading-sm"></span>
    {/if}
  </button>
  <div class="flex justify-evenly text-sm">
    <a class="link" href="/reset-password">Reset password</a>
  </div>
</form>
