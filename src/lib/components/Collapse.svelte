<script lang="ts">
  import PhCaretUp from "~icons/ph/caret-up";
  import PhCaretDown from "~icons/ph/caret-down";

  export let title: string;

  let checked: boolean = false;
</script>

<label class="cursor-pointer select-none px-2 py-1">
  <span class="text-sm text-base-content/50 flex justify-between">
    {title}
    <label class="swap swap-rotate">
      <input type="checkbox" bind:checked />
      <span class="swap-off">
        <PhCaretDown></PhCaretDown>
      </span>
      <span class="swap-on">
        <PhCaretUp></PhCaretUp>
      </span>
    </label>
  </span>
  <input type="checkbox" class="hidden" bind:checked />
</label>
<div class="flex flex-col overflow-hidden {checked ? 'h-fit' : 'h-0'} border-b">
  <slot></slot>
</div>
