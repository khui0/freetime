<script lang="ts">
  import { title } from "$lib/store";
  $title = "Account";

  import { currentUser, pb, signOut } from "$lib/pocketbase";
  import { z } from "zod";
  import { onMount } from "svelte";

  import Confirm from "$lib/components/dialog/Confirm.svelte";
  import TopBar from "$lib/components/TopBar.svelte";

  import PhArrowLeft from "~icons/ph/arrow-left";

  interface FormState {
    error: string;
    loading: boolean;
  }

  let confirm: Confirm;

  let newUsername: string;

  let usernameState: FormState = {
    error: "",
    loading: false,
  };

  onMount(() => {
    newUsername = $currentUser?.username;
  });

  function deleteAccount() {
    confirm
      .prompt(
        "Are you sure you want to delete your account?",
        "Doing so is permanent and cannot be undone!",
        "Delete",
        true,
      )
      .then(async () => {
        await pb.collection("users").delete($currentUser?.id);
        window.location.replace("/");
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
  <div class="flex items-center justify-between">
    <p class="px-3 text-base-content/50">{$currentUser?.email}</p>
    <button class="btn btn-sm" on:click={signOut}>Sign out</button>
  </div>
  <!-- Username -->
  <form on:submit|preventDefault={updateUsername} class="flex-1 flex gap-1 min-w-[250px]">
    <label class="flex flex-col text-xs w-full">
      <span class="px-2">Username</span>
      <div class="flex gap-2">
        <input class="input input-bordered input-sm w-full" type="text" bind:value={newUsername} />
        <button class="btn btn-sm" on:click={updateUsername}>
          {#if !usernameState?.loading}
            Change
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
  <div class="flex gap-2 justify-center py-4">
    <button class="btn btn-sm btn-error" on:click={deleteAccount}>Delete account...</button>
  </div>
</div>

<Confirm bind:this={confirm}></Confirm>
