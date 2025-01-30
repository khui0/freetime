<script lang="ts">
  import { title } from "$lib/store";
  $title = "Friends";

  import { currentUser, friends, pb, schedules } from "$lib/pocketbase";
  import { onMount } from "svelte";
  import { settings } from "$lib/settings";

  import Confirm from "$lib/components/dialog/Confirm.svelte";
  import Modal from "$lib/components/dialog/Modal.svelte";
  import TopBar from "$lib/components/TopBar.svelte";
  import Friend from "./Friend.svelte";

  import PhUserPlus from "~icons/ph/user-plus";
  import PhTray from "~icons/ph/tray";

  let confirm: Confirm | undefined = $state();

  let addModal: Modal | undefined = $state();
  let usernameField: string = $state("");

  let error: string = $state("");
  let loading: boolean = $state(false);

  let sortedFriends = $derived.by(() => {
    const order = JSON.parse($settings.friendsOrder || "[]");
    return $friends?.friends.toSorted(
      (a, b) => order.indexOf(a.username) - order.indexOf(b.username),
    );
  });

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
      error = "User not found (usernames are case sensitive!)";
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
    <a href="/friends/inbox" class="btn btn-sm">
      <PhTray></PhTray>
      Inbox ({$friends?.requests?.length})
    </a>
    <button class="btn btn-sm" onclick={addModal?.show}>
      <PhUserPlus></PhUserPlus>
      Add friend
    </button>
  </div>
</TopBar>
<div class="flex flex-col px-4 w-[min(100%,800px)] mx-auto">
  {#if sortedFriends}
    <div class="flex flex-col py-4">
      {#each sortedFriends as friend, i}
        <Friend
          index={i}
          username={friend.username}
          href="/user/{friend.username}"
          schedule={$schedules.find((record) => record.user === friend.id)?.schedule}
          onaction={() => {
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
  onshow={() => {
    error = "";
  }}
>
  <form
    class="flex flex-col gap-4"
    onsubmit={(e) => {
      e.preventDefault();
      addFriend(usernameField);
    }}
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
        <a href="/account" class="btn btn-xs">Change </a>
      </div>
      <p class="bg-base-200 px-2 py-1 rounded-lg w-fit text-sm">
        <span class="font-bold">freetime</span>.kennyhui.dev
      </p>
    </div>
    <div class="flex justify-end gap-2">
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
    </div>
  </form>
</Modal>

<Confirm bind:this={confirm}></Confirm>
