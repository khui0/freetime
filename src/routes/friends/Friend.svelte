<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let username: string;
  export let action: string = "Remove";
</script>

<button class="flex gap-1 items-center justify-between p-2" on:click>
  <p>{username}</p>
  <button
    class="btn btn-sm"
    on:click={() => {
      dispatch("action");
    }}>{action}</button
  >
</button>
