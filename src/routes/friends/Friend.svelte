<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let username: string;
  export let action: string = "Remove";
  export let href: string = "";
</script>

<div class="flex rounded-box border p-4 mb-4 first:mt-4">
  <a class="flex-1 flex items-center gap-2" {href}>
    <p class="pl-1 py-2">{username}</p>
  </a>
  <button
    class="btn btn-sm self-center"
    on:click={() => {
      dispatch("action");
    }}>{action}</button
  >
</div>
