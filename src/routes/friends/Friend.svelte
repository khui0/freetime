<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let username: string;
  export let action: string = "Remove";
  export let href: string = "";
</script>

<a class="flex gap-1 items-center justify-between py-2" {href}>
  <p class="pl-1">{username}</p>
  <button
    class="btn btn-sm"
    on:click={() => {
      dispatch("action");
    }}>{action}</button
  >
</a>
