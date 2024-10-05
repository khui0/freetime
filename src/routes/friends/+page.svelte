<script lang="ts">
  import { title } from "$lib/store";
  $title = "Friends";

  import { ready, currentUser, pb, schedules, friends as friendsList } from "$lib/pocketbase";
  import { onMount } from "svelte";
  import type { RecordModel } from "pocketbase";

  import Friend from "./Friend.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import Confirm from "$lib/components/Confirm.svelte";
  import TopBar from "$lib/components/TopBar.svelte";

  let confirm: Confirm;

  let addModal: Modal;
  let usernameField: string;
  let error: string;

  let outgoingModal: Modal;

  let requestsModal: Modal;

  let loading: boolean = false;

  let self: RecordModel;
  let others: RecordModel[];

  let friends: RecordModel[] = [];
  let outgoing: RecordModel[] = [];
  let requests: RecordModel[] = [];

  onMount(() => {
    ready.subscribe((ready) => {
      if (!$currentUser || !ready) return;

      updateFriends();
      friendsList.subscribe(updateFriends);
    });
  });

  async function updateFriends() {
    // List all friend lists that contain username
    const list = structuredClone($friendsList);

    // Own friends list
    self = list.filter((record) => record.user === $currentUser?.id)[0];
    // List of people who have you added
    others = list
      .filter((record) => record.user !== $currentUser?.id)
      .map((record) => record?.expand?.user);

    friends = calculateFriends();
    outgoing = calculateOutgoing();
    requests = calculateRequests();

    // Set own schedule visibility
    const scheduleId = (
      await pb.collection("schedules").getFirstListItem(`user="${$currentUser?.id}"`)
    ).id;
    pb.collection("schedules").update(scheduleId, {
      viewers: friends.map((record) => record.id),
    });
  }

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
    const friend = await getUserId(username);
    if (!friend) {
      error = "Username not found";
      loading = false;
      return;
    }
    pb.collection("friends")
      .update(self.id, {
        friends: [...self.friends, friend],
      })
      .then(() => {
        addModal.close();
        usernameField = "";
        error = "";
        loading = false;
      });
  }

  async function removeFriend(id: string) {
    pb.collection("friends").update(self.id, {
      friends: self.friends.filter((user: string) => user !== id),
    });
  }

  function calculateFriends(): RecordModel[] {
    return (
      self?.expand?.friends?.filter((record: RecordModel) =>
        others.map((item) => item.id).includes(record.id),
      ) || []
    );
  }

  function calculateOutgoing(): RecordModel[] {
    return (
      self?.expand?.friends?.filter(
        (record: RecordModel) => !others.map((item) => item.id).includes(record.id),
      ) || []
    );
  }

  function calculateRequests(): RecordModel[] {
    return others.filter((item) => !self?.friends?.includes(item.id));
  }
</script>

<TopBar>
  <h2 class="text-2xl font-bold">Friends</h2>
  <div class="flex gap-2 flex-wrap justify-end">
    <button class="btn btn-sm" on:click={addModal.show}>Add friend</button>
  </div>
</TopBar>
<div class="flex gap-2 px-4 pt-4">
  <button class="btn btn-sm" on:click={outgoingModal.show}>
    Outgoing {#if outgoing.length > 0}
      ({outgoing.length})
    {/if}
  </button>
  <button class="btn btn-sm" on:click={requestsModal.show}>
    Incoming {#if requests.length > 0}
      ({requests.length})
    {/if}
  </button>
</div>
<div class="flex flex-col px-4">
  {#if friends}
    <div class="flex flex-col">
      {#each friends as friend, i}
        <Friend
          index={i}
          username={friend.username}
          href="/user/{friend.username}"
          schedule={$schedules.find((record) => record.user === friend.id)?.schedule}
          on:action={() => {
            confirm
              .prompt(
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
    on:submit|preventDefault={() => {
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
      <p>Your username is <b>{$currentUser?.username}</b></p>
      <p class="bg-base-200 px-2 py-1 rounded-lg w-fit">
        <span class="font-bold">freetime</span>.kennyhui.dev
      </p>
    </div>
    <button
      class="btn btn-sm hover:btn-accent"
      on:click={() => {
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

<Modal title="Outgoing requests" bind:this={outgoingModal} additionalClasses="h-full">
  {#if outgoing && outgoing.length > 0}
    <div class="overflow-auto">
      {#each outgoing as friend}
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

<Modal title="Incoming requests" bind:this={requestsModal} additionalClasses="h-full">
  {#if requests && requests.length > 0}
    <div class="overflow-auto">
      {#each requests as friend}
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
