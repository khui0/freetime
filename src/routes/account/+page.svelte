<script lang="ts">
  import { title } from "$lib/store";
  $title = "Account";

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

<div class="flex flex-col gap-4 w-[min(100%,800px)] mx-auto p-4">
  <div class="flex gap-2 border rounded-box p-4">
    <!-- Username -->
    <div class="flex-1">
      <form on:submit|preventDefault={updateUsername} class="flex gap-1">
        <label class="flex flex-col text-xs w-full">
          <span class="px-2">Username</span>
          <input
            class="input input-bordered input-sm w-full"
            type="text"
            bind:value={newUsername}
          />
        </label>
        <button class="btn btn-sm self-end" on:click={updateUsername}>
          {#if !usernameState?.loading}
            Update
          {:else}
            <span class="loading loading-spinner loading-sm"></span>
          {/if}
        </button>
      </form>
      {#if usernameState?.error}
        <p class="text-xs text-error mx-2 my-1">{usernameState?.error}</p>
      {/if}
    </div>
    <!-- Email -->
    <div class="flex-1">
      <form on:submit|preventDefault={updateEmail} class="flex gap-1">
        <label class="flex flex-col text-xs w-full">
          <span class="px-2">Email address</span>
          <input type="email" class="input input-bordered input-sm w-full" bind:value={newEmail} />
        </label>
        <button class="btn btn-sm self-end" on:click={updateEmail}>
          {#if !emailState.loading}
            Update
          {:else}
            <span class="loading loading-spinner loading-sm"></span>
          {/if}
        </button>
      </form>
      {#if emailState?.error}
        <p class="text-xs text-error mx-2 my-1">{emailState?.error}</p>
      {/if}
      {#if emailSuccess}
        <p class="text-xs text-success mx-2 my-1">{emailSuccess}</p>
      {/if}
    </div>
  </div>
  <div class="flex flex-col gap-2 border rounded-box p-4 items-start">
    <button class="btn btn-sm" on:click={resetPassword}>Request password reset</button>
    {#if passwordSuccess}
      <p class="text-xs text-success mx-2 my-1">{passwordSuccess}</p>
    {/if}
    <button class="btn btn-sm" on:click={signOut}>Sign out</button>
    <button class="btn btn-sm btn-error" on:click={deleteAccount}>Delete account</button>
  </div>
</div>

<Confirm bind:this={confirm}></Confirm>
