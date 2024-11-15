<script lang="ts">
  import { run, createBubbler } from "svelte/legacy";

  const bubble = createBubbler();
  import { createEventDispatcher, type Snippet } from "svelte";

  interface Option {
    name: string;
    value: string;
  }

  let {
    title,
    type,
    value = $bindable(""),
    options = [],
    maxlength = undefined,
    placeholder = "",
    text = "",
    href = "",
    icon,
    children,
  }: {
    title: string;
    type: "checkbox" | "toggle" | "select" | "text" | "button" | "link";
    value?: string;
    options?: Option[];
    maxlength?: number | undefined;
    placeholder?: string;
    text?: string;
    href?: string;
    icon?: Snippet;
    children?: Snippet;
  } = $props();

  let checkbox: HTMLInputElement | undefined = $state();

  $effect(() => {
    if (checkbox) checkbox.checked = value === "true";
  });

  const dispatch = createEventDispatcher();
</script>

<div class="flex flex-col gap-2 items-center rounded-box border px-4 py-3">
  <div class="flex flex-col items-center text-center">
    <p class="text-2xl">{@render icon?.()}</p>
    <h3>{title}</h3>
    <p class="text-sm text-base-content/50">{@render children?.()}</p>
  </div>
  {#if type === "checkbox" || type === "toggle"}
    <input
      type="checkbox"
      class={type === "checkbox" ? "checkbox rounded-md" : "toggle"}
      bind:this={checkbox}
      oninput={() => {
        value = checkbox?.checked ? "true" : "false";
      }}
    />
  {:else if type === "select"}
    <select class="select select-bordered select-sm w-fit" bind:value>
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
        onclick={() => {
          dispatch("save", {
            value,
          });
        }}
        >Save
      </button>
    </div>
  {:else if type === "button"}
    <button class="btn btn-sm" onclick={bubble("click")}>{text}</button>
  {:else if type === "link"}
    <a class="btn btn-sm" {href}>{text}</a>
  {/if}
</div>
