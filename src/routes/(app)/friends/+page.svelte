<script lang="ts">
  import { preventDefault } from "svelte/legacy";

  import { title } from "$lib/store";
  $title = "Friends";

  import { currentUser, friends, pb, schedules } from "$lib/pocketbase";
  import { onMount } from "svelte";

  import { goto } from "$app/navigation";
  import Confirm from "$lib/components/dialog/Confirm.svelte";
  import Modal from "$lib/components/dialog/Modal.svelte";
  import TopBar from "$lib/components/TopBar.svelte";
  import Friend from "./Friend.svelte";

  let confirm: Confirm | undefined = $state();

  let addModal: Modal | undefined = $state();
  let usernameField: string = $state("");
  let error: string = $state("");

  let outgoingModal: Modal | undefined = $state();
  let requestsModal: Modal | undefined = $state();

  let loading: boolean = $state(false);

  onMount(() => {
    friends.subscribe((friends) => {
      // Update own schedule visibility to account for new friends
      const scheduleId = $schedules?.find((r) => r.user === $currentUser?.id)?.id;
      scheduleId &&
        pb.collection("schedules").update(scheduleId, {
          viewers: friends.friends.map((record) => record.id),
        });
    });
  });

  async function getUserId(username: string) {
    const result = await pb
      .collection("users")
      .getFirstListItem(`username="${username}"`)
      .catch(() => {
        return;
      });
    return result?.id;
  }

  async function addFriend(username: string) {
    loading = true;
    const self = $friends?.self;
    const target = await getUserId(username);
    if (!target) {
      error = "User not found";
      loading = false;
      return;
    } else if (!self) {
      error = "Unexpected error occurred";
      loading = false;
      return;
    }
    pb.collection("friends")
      .update(self.id, {
        friends: [...self.friends, target],
      })
      .then(() => {
        addModal?.close();
        usernameField = "";
        error = "";
        loading = false;
      });
  }

  async function removeFriend(id: string) {
    const self = $friends?.self;
    if (!self) return;
    pb.collection("friends").update(self.id, {
      friends: self.friends.filter((user: string) => user !== id),
    });
  }
</script>

<TopBar>
  <h2 class="text-2xl font-bold tracking-tight">Friends</h2>
  <div class="flex gap-2 flex-wrap justify-end">
    <button class="btn btn-sm" onclick={addModal?.show}>Add friend</button>
  </div>
</TopBar>
<div class="flex gap-2 px-4 pt-4 w-[min(100%,800px)] mx-auto">
  <button class="btn btn-sm" onclick={outgoingModal?.show}>
    Outgoing {#if $friends?.outgoing?.length > 0}
      ({$friends?.outgoing.length})
    {/if}
  </button>
  <button class="btn btn-sm" onclick={requestsModal?.show}>
    Incoming {#if $friends?.requests?.length > 0}
      ({$friends?.requests?.length})
    {/if}
  </button>
</div>
<div class="flex flex-col px-4 w-[min(100%,800px)] mx-auto">
  {#if $friends?.friends}
    <div class="flex flex-col py-4">
      {#each $friends?.friends as friend, i}
        <Friend
          index={i}
          username={friend.username}
          href="/user/{friend.username}"
          schedule={$schedules.find((record) => record.user === friend.id)?.schedule}
          on:action={() => {
            confirm
              ?.prompt(
                "Remove friend?",
                `Are you sure you want to remove ${friend.username}?`,
                "Remove",
              )
              .then(() => {
                removeFriend(friend.id);
              });
          }}
        ></Friend>
      {/each}
    </div>
  {/if}
</div>

<Modal
  bind:this={addModal}
  title="Add friend"
  on:show={() => {
    error = "";
  }}
>
  <form
    class="flex flex-col gap-4"
    onsubmit={preventDefault(() => {
      addFriend(usernameField);
    })}
  >
    <label class="flex flex-col text-xs">
      <span class="px-2">Username</span>
      <input
        type="text"
        class="input input-bordered input-sm w-full"
        bind:value={usernameField}
        autocomplete="off"
      />
      {#if error}
        <p class="text-xs text-error mx-2 mt-1">{error}</p>
      {/if}
    </label>
    <div class="flex justify-between items-center flex-wrap">
      <div class="flex items-center gap-2">
        <p>Your username is <b>{$currentUser?.username}</b></p>
        <button
          class="btn btn-xs"
          onclick={() => {
            goto("/account");
          }}>Change</button
        >
      </div>
      <p class="bg-base-200 px-2 py-1 rounded-lg w-fit text-sm">
        <span class="font-bold">freetime</span>.kennyhui.dev
      </p>
    </div>
    <button
      class="btn btn-sm hover:btn-accent"
      onclick={() => {
        addFriend(usernameField);
      }}
      >{#if !loading}
        Send friend request
      {:else}
        <span class="loading loading-spinner loading-sm"></span>
      {/if}
    </button>
  </form>
</Modal>

<Modal title="Outgoing requests" bind:this={outgoingModal} additionalClasses="max-h-full">
  {#if $friends?.outgoing && $friends?.outgoing.length > 0}
    <div class="overflow-auto">
      {#each $friends?.outgoing as friend}
        <Friend
          username={friend.username}
          action="Cancel"
          on:action={() => {
            removeFriend(friend.id);
          }}
        ></Friend>
      {/each}
    </div>
  {/if}
</Modal>

<Modal title="Incoming requests" bind:this={requestsModal} additionalClasses="max-h-full">
  {#if $friends?.requests && $friends?.requests.length > 0}
    <div class="overflow-auto">
      {#each $friends?.requests as friend}
        <Friend
          username={friend.username}
          action="Accept"
          on:action={() => {
            addFriend(friend.username);
          }}
        ></Friend>
      {/each}
    </div>
  {/if}
</Modal>

<Confirm bind:this={confirm}></Confirm>
