<script lang="ts">
  import { title } from "$lib/store";
  $title = "Register";

  import { pb } from "$lib/pocketbase";

  import FormField from "$lib/components/FormField.svelte";
  import FormErrors from "$lib/components/FormErrors.svelte";

  let username: Result;
  let email: Result;
  let password: Result;
  let passwordConfirm: Result;

  let errors: String[] = [];

  let loading: boolean = false;

  async function submit() {
    validate();
    try {
      if (username.success && email.success && password.success && passwordConfirm.success) {
        loading = true;
        await pb.collection("users").create({
          username,
          email,
          password,
          passwordConfirm,
        });
        // Send verification email
        if (email.success) {
          pb.collection("users").requestVerification(email.success);
          window.location.href = `${window.location.origin}/verify?email=${encodeURIComponent(email.success)}`;
        }
      }
    } catch (err) {
      setTimeout(() => {
        errors = ["Unable to create account"];
        loading = false;
      }, 3000);
    }
  }

  function validate() {
    loading = false;
    errors = [];
    if (username.error) errors.push(username.error);
    if (email.error) errors.push(email.error);
    if (password.error) errors.push(password.error);
    if (passwordConfirm.error) errors.push(passwordConfirm.error);
  }
</script>

<form on:submit|preventDefault={submit} class="flex flex-col gap-3">
  <FormField type="username" bind:result={username}></FormField>
  <FormField type="email" bind:result={email}></FormField>
  <FormField type="password" bind:result={password}></FormField>
  <FormField type="password" placeholder="Confirm password" bind:result={passwordConfirm}
  ></FormField>
  <FormErrors bind:errors></FormErrors>
  <button class="btn btn-accent" on:click={submit}>
    {#if !loading}
      Register
    {:else}
      <span class="loading loading-spinner loading-sm"></span>
    {/if}
  </button>
  <div class="flex justify-evenly text-sm">
    <a class="link" href="/sign-in">Sign in</a>
  </div>
</form>
