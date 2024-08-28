<script lang="ts">
  import { title } from "$lib/store";
  $title = "Account"

  import { base } from "$app/paths";
  import { currentUser, pb, signOut } from "$lib/pocketbase";
  import { z } from "zod";
  import { onMount } from "svelte";

  import Confirm from "$lib/components/Confirm.svelte";
  interface FormState {
    error: string;
    loading: boolean;
  }

  let confirm: Confirm;

  let newUsername: string;
  let newEmail: string;

  let usernameState: FormState = {
    error: "",
    loading: false,
  };
  let emailState: FormState = {
    error: "",
    loading: false,
  };

  let emailSuccess: string = "";
  let passwordSuccess: string = "";

  onMount(() => {
    newUsername = $currentUser?.username;
    newEmail = $currentUser?.email;
  });

  function deleteAccount() {
    confirm
      .prompt(
        "Are you sure you want to delete your account?",
        "This action is permanent!",
        "Delete",
        true,
      )
      .then(async () => {
        await pb.collection("users").delete($currentUser?.id);
        window.location.replace(`${base}/goodbye`);
      });
  }

  async function updateUsername() {
    const result = z
      .string()
      .min(3, "Username must be at least 3 characters")
      .safeParse(newUsername);
    if (result.success) {
      usernameState.loading = true;
      usernameState.error = "";
      try {
        await pb.collection("users").update($currentUser?.id, { username: result.data });
        usernameState.loading = false;
      } catch (err) {
        setTimeout(() => {
          usernameState.loading = false;
        }, 3000);
      }
    } else {
      usernameState.error = result.error.errors[0].message;
      usernameState.loading = false;
    }
  }

  async function updateEmail() {
    const result = z.string().email("Enter a valid email address").safeParse(newEmail);
    if (result.success) {
      emailState.loading = true;
      emailState.error = "";
      try {
        await pb.collection("users").requestEmailChange(result.data);
        emailSuccess = "Check your new email address to confirm the change";
        emailState.loading = false;
      } catch (err) {
        setTimeout(() => {
          emailState.loading = false;
        }, 3000);
      }
    } else {
      emailState.error = result.error.errors[0].message;
      emailState.loading = false;
    }
  }

  async function resetPassword() {
    await pb.collection("users").requestPasswordReset($currentUser?.email);
    passwordSuccess = "Check your email address to reset your password";
  }
</script>

<div class="flex flex-col gap-3">
  <button class="btn btn-sm" on:click={signOut}>Sign out</button>
  <!-- Username -->
  <h2 class="font-light">Username</h2>
  <form on:submit|preventDefault={updateUsername} class="flex gap-3">
    <input
      class="input input-bordered flex-1"
      type="text"
      placeholder="Username"
      bind:value={newUsername}
    />
    <button class="btn" on:click={updateUsername}>
      {#if !usernameState?.loading}
        Update
      {:else}
        <span class="loading loading-spinner loading-sm"></span>
      {/if}
    </button>
  </form>
  {#if usernameState?.error}
    <p class="text-sm text-error">{usernameState?.error}</p>
  {/if}
  <!-- Email -->
  <h2 class=" font-light">Email</h2>
  <form on:submit|preventDefault={updateEmail} class="flex gap-3">
    <input
      type="email"
      class="input input-bordered flex-1"
      placeholder="Email address"
      bind:value={newEmail}
    />
    <button class="btn" on:click={updateEmail}>
      {#if !emailState.loading}
        Update
      {:else}
        <span class="loading loading-spinner loading-sm"></span>
      {/if}
    </button>
  </form>
  {#if emailState?.error}
    <p class="text-sm text-error">{emailState?.error}</p>
  {/if}
  {#if emailSuccess}
    <p class="text-sm text-success">{emailSuccess}</p>
  {/if}
  <!-- Password -->
  <h2 class=" font-light">Password</h2>
  <button class="btn" on:click={resetPassword}>Request password reset</button>
  {#if passwordSuccess}
    <p class="text-sm text-success">{passwordSuccess}</p>
  {/if}
  <!-- Delete account -->
  <h2 class=" font-light">Delete account</h2>
  <button class="btn btn-error" on:click={deleteAccount}>Delete account</button>
</div>

<Confirm bind:this={confirm}></Confirm>
