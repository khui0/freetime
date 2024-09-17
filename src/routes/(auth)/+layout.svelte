<script lang="ts">
  import { title } from "$lib/store";

  import PhArrowLeft from "~icons/ph/arrow-left";
</script>

<div class="absolute z-50 inset-0 flex items-center justify-center bg-base-100">
  <div class="p-4 w-[min(100%,400px)]">
    <div class="mb-3 grid grid-cols-[1fr_auto_1fr] items-center">
      <button
        class="btn btn-square btn-sm rounded-full"
        on:click={() => {
          history.back();
        }}
      >
        <PhArrowLeft></PhArrowLeft>
      </button>
      <div class="flex flex-col items-center">
        <h1 class="text-lg">{$title}</h1>
      </div>
    </div>
    <slot></slot>
  </div>
</div>
