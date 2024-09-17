<script lang="ts">
  import { title } from "$lib/store";
  $title = "Account";

  import { base } from "$app/paths";
  import { currentUser, pb, signOut } from "$lib/pocketbase";
  import { z } from "zod";
  import { onMount } from "svelte";

  import Confirm from "$lib/components/Confirm.svelte";
  import TopBar from "$lib/components/TopBar.svelte";

  import PhArrowLeft from "~icons/ph/arrow-left";

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

<TopBar>
  <button
    class="btn btn-square btn-sm rounded-full"
    on:click={() => {
      history.back();
    }}
  >
    <PhArrowLeft></PhArrowLeft>
  </button>
</TopBar>
<div class="flex flex-col gap-4 w-[min(100%,800px)] mx-auto p-4">
  <div class="flex gap-2 border rounded-box p-4 flex-wrap">
    <!-- Username -->
    <form on:submit|preventDefault={updateUsername} class="flex-1 flex gap-1 min-w-[250px]">
      <label class="flex flex-col text-xs w-full">
        <span class="px-2">Username</span>
        <div class="flex gap-1">
          <input
            class="input input-bordered input-sm w-full"
            type="text"
            bind:value={newUsername}
          />
          <button class="btn btn-sm" on:click={updateUsername}>
            {#if !usernameState?.loading}
              Update
            {:else}
              <span class="loading loading-spinner loading-sm"></span>
            {/if}
          </button>
        </div>
        {#if usernameState?.error}
          <p class="text-xs text-error mx-2 mt-1">{usernameState?.error}</p>
        {/if}
      </label>
    </form>
    <!-- Email -->
    <form on:submit|preventDefault={updateEmail} class="flex-1 flex gap-1 min-w-[250px]">
      <label class="flex flex-col text-xs w-full">
        <span class="px-2">Email address</span>
        <div class="flex gap-1">
          <input type="email" class="input input-bordered input-sm w-full" bind:value={newEmail} />
          <button class="btn btn-sm" on:click={updateEmail}>
            {#if !emailState.loading}
              Update
            {:else}
              <span class="loading loading-spinner loading-sm"></span>
            {/if}
          </button>
        </div>
        {#if emailState?.error}
          <p class="text-xs text-error mx-2 mt-1">{emailState?.error}</p>
        {/if}
        {#if emailSuccess}
          <p class="text-xs text-success mx-2 mt-1">{emailSuccess}</p>
        {/if}
      </label>
    </form>
  </div>
  <div class="flex flex-col gap-2 border rounded-box p-4 items-start">
    <button class="btn btn-sm" on:click={signOut}>Sign out</button>
    <button class="btn btn-sm" on:click={resetPassword}>Request password reset</button>
    {#if passwordSuccess}
      <p class="text-xs text-success mx-2 my-1">{passwordSuccess}</p>
    {/if}
    <button class="btn btn-sm btn-error" on:click={deleteAccount}>Delete account</button>
  </div>
</div>

<Confirm bind:this={confirm}></Confirm>
