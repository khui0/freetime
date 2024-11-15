<script lang="ts">
  import { title } from "$lib/store";
  $title = "Inbox";

  import { friends, pb } from "$lib/pocketbase";

  import TopBar from "$lib/components/TopBar.svelte";
  import Friend from "../Friend.svelte";

  import PhArrowLeft from "~icons/ph/arrow-left";
  import PhTrayArrowDown from "~icons/ph/tray-arrow-down";
  import PhTrayArrowUp from "~icons/ph/tray-arrow-up";

  let error: string = $state("");
  let loading: boolean = $state(false);

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
  <div class="flex items-center gap-4">
    <button
      class="btn btn-square btn-sm rounded-full"
      onclick={() => {
        history.back();
      }}
    >
      <PhArrowLeft></PhArrowLeft>
    </button>
    <h2 class="text-2xl font-bold tracking-tight">Inbox</h2>
  </div>
  <div class="flex gap-2 flex-wrap justify-end"></div>
</TopBar>
<div class="flex flex-col px-4 w-[min(100%,800px)] mx-auto">
  <div class="flex flex-col py-4">
    <h2 class="text-base-content/50 mx-2 mb-2 inline-flex items-center gap-2">
      <PhTrayArrowDown></PhTrayArrowDown>
      Incoming requests ({$friends?.requests?.length})
    </h2>
    {#each $friends?.requests as friend}
      <Friend
        username={friend.username}
        action="Accept"
        onaction={() => {
          addFriend(friend.username);
        }}
      >
        added you!</Friend
      >
    {/each}
    <h2 class="text-base-content/50 mx-2 mb-2 inline-flex items-center gap-2">
      <PhTrayArrowUp></PhTrayArrowUp>
      Outgoing requests
    </h2>
    {#each $friends?.outgoing as friend}
      <Friend
        username={friend.username}
        action="Cancel"
        onaction={() => {
          removeFriend(friend.id);
        }}
      ></Friend>
    {/each}
  </div>
</div>
