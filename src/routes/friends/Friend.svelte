<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let username: string;
  export let action: string = "Remove";
  export let href: string = "";
</script>

<div class="flex py-2">
  <a class="flex-1 flex items-center gap-2" {href}>
    <p class="pl-1">{username}</p>
  </a>
  <button
    class="btn btn-sm self-center"
    on:click={() => {
      dispatch("action");
    }}>{action}</button
  >
</div>
