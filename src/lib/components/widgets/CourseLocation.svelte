<script lang="ts">
  import { locations } from "$lib/sbu";
  import PhArrowSquareOut from "~icons/ph/arrow-square-out";

  let { room, location }: { room: string; location: string } = $props();
</script>

<div class="flex gap-2 items-center flex-wrap mt-1">
  <p class="border border-base-content w-fit h-fit px-1.5 rounded-lg text-sm">
    {room}
  </p>
  {#if locations[location].maps}
    <a href={locations[location].maps} class="inline-flex gap-1 items-center hover:underline">
      <p>{locations[location].name}</p>
      <span class="mb-0.5"><PhArrowSquareOut></PhArrowSquareOut></span>
    </a>
  {:else}
    <p>{locations[location].name}</p>
  {/if}
</div>
