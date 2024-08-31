<script lang="ts">
  import { title } from "$lib/store";

  import PhArrowLeft from "~icons/ph/arrow-left";

  import Event from "./Event.svelte";
</script>

<div class="px-4 py-2">
  <div class="flex gap-1 justify-between">
    <button
      class="btn btn-square btn-sm rounded-full"
      on:click={() => {
        history.back();
      }}
    >
      <PhArrowLeft></PhArrowLeft>
    </button>
    <button class="btn btn-sm">Add class</button>
  </div>
  <div class="py-2 grid grid-cols-1 md:grid-cols-2 gap-2">
    <Event></Event>
    <Event></Event>
  </div>
</div>
