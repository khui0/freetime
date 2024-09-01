<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import PhFloppyDisk from "~icons/ph/floppy-disk";

  interface Option {
    name: string;
    value: string;
  }

  export let title: string;
  export let type: "checkbox" | "select" | "text" | "button";
  export let value: string = "";
  export let options: Option[] = [];
  export let maxlength: number | undefined = undefined;
  export let placeholder: string = "";
  export let text: string = "";

  let checkbox: HTMLInputElement;

  $: value,
    (() => {
      if (checkbox) {
        checkbox.checked = value === "true";
      }
    })();

  const dispatch = createEventDispatcher();
</script>

<div class="flex flex-col gap-2">
  <div class="rounded-box pl-4 p-2 border">
    <label class="label cursor-pointer gap-2 items-center p-1">
      <span class="label-text text-base">{title}</span>
      {#if type === "checkbox"}
        <input
          type="checkbox"
          class="checkbox rounded-md"
          bind:this={checkbox}
          on:input={() => {
            value = checkbox.checked ? "true" : "false";
          }}
        />
      {:else if type === "select"}
        <select class="select select-bordered select-sm w-full max-w-xs" bind:value>
          {#each options as option}
            <option value={option.value}>{option.name}</option>
          {/each}
        </select>
      {:else if type === "text"}
        <div class="flex flex-row gap-1">
          <input
            type="text"
            class="input input-bordered input-sm w-full max-w-xs"
            bind:value
            {maxlength}
            {placeholder}
          />
          <button
            class="btn btn-sm"
            on:click={() => {
              dispatch("save", {
                value,
              });
            }}
            >Save
          </button>
        </div>
      {:else if type === "button"}
        <button class="btn btn-sm" on:click>{text}</button>
      {/if}
    </label>
  </div>
  <p class="mx-4 text-sm mb-4 text-base-content/50"><slot></slot></p>
</div>
