<script lang="ts">
  import { title } from "$lib/store";
  $title = "Friends";

  import Modal from "$lib/components/Modal.svelte";

  let addModal: Modal;
  let usernameField: string;
  let error: string;

  let loading: boolean = false;

  import { currentUser, pb } from "$lib/pocketbase";
  import { onMount } from "svelte";
  import type { RecordModel } from "pocketbase";

  let self: RecordModel;
  let others: RecordModel[];

  onMount(async () => {
    // Create friends record if it doesn't exist
    await pb
      .collection("friends")
      .getFirstListItem(`user="${$currentUser?.id}"`)
      .catch(() => {
        pb.collection("friends").create({ user: $currentUser?.id, friends: [] });
      });

    // List all friend lists that contain username
    const list = await pb.collection("friends").getFullList({
      expand: "friends,user",
    });

    // Own friends list
    self = list.filter((record) => record.user === $currentUser?.id)[0];
    // List of people who have you added
    others = list
      .filter((record) => record.user !== $currentUser?.id)
      .map((record) => record?.expand?.user);

    console.log(self.friends, others);
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
</script>

<div class="flex flex-col px-4 h-full">
  <div class="flex gap-1 justify-between border-b py-2 items-center">
    <h2>4 friends</h2>
    <div class="flex gap-1">
      <button class="btn btn-sm" on:click={addModal.show}>Add friend</button>
    </div>
  </div>
</div>

<Modal bind:this={addModal} title="Add friend">
  <label class="flex flex-col text-xs">
    <span class="px-2">Username</span>
    <input type="text" class="input input-bordered input-sm w-full" bind:value={usernameField} />
    {#if error}
      <p class="text-xs text-error mx-2 mt-1">{error}</p>
    {/if}
  </label>
  <p class="text-sm">Your username is <b>{$currentUser?.username}</b></p>
  <button
    class="btn btn-sm"
    on:click={() => {
      addFriend(usernameField);
    }}
    >{#if !loading}
      Send friend request
    {:else}
      <span class="loading loading-spinner loading-sm"></span>
    {/if}
  </button>
</Modal>
