<script lang="ts">
  import { title } from "$lib/store";

  import CarbonArrowLeft from "~icons/carbon/arrow-left";
</script>

<div class="p-4 mx-auto w-[min(100%,400px)]">
  <div class="mb-3 grid grid-cols-[1fr_auto_1fr] items-center">
    <button
      class="btn btn-square btn-sm rounded-full"
      on:click={() => {
        history.back();
      }}
    >
      <CarbonArrowLeft></CarbonArrowLeft>
    </button>
    <div class="flex flex-col items-center">
      <h1 class="text-lg">{$title}</h1>
    </div>
  </div>
  <slot></slot>
</div>
