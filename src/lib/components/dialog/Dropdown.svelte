<script lang="ts">
  import { createEventDispatcher, onMount, tick, type Snippet } from "svelte";
  import { fly } from "svelte/transition";

  const dispatch = createEventDispatcher();

  import PhX from "~icons/ph/x";

  let {
    children,
  }: {
    children: Snippet;
  } = $props();

  let element: HTMLElement | undefined = $state();
  let shown: boolean = $state(false);

  let up: boolean = $state(false);

  export async function show(r: DOMRect) {
    // Position dropdown appropriately
    const w = document.body.offsetWidth;
    const h = document.body.offsetHeight;
    const offset = window.scrollY;
    const right = r.left < w - r.right;
    const bottom = r.bottom < h - r.top;
    const width = (right ? w - r.left : r.right) - 16;
    const MIN_WIDTH = Math.min(w - 16 * 2, 400);
    const diff = Math.max(0, MIN_WIDTH - width);
    up = !bottom;
    shown = true;
    await tick();
    if (!element) return;
    element.style.removeProperty("left");
    element.style.removeProperty("right");
    element.style.removeProperty("top");
    element.style.removeProperty("bottom");
    if (right) {
      element.style.left = r.left - diff + "px";
    } else {
      element.style.right = w - r.right - diff + "px";
    }
    if (bottom) {
      element.style.top = r.bottom + offset + "px";
    } else {
      element.style.bottom = h - r.top - offset + "px";
    }
    element.style.width = Math.max(width, MIN_WIDTH) + "px";
    dispatch("show");
  }

  export function close() {
    shown = false;
    dispatch("close");
  }

  onMount(() => {
    window.addEventListener("resize", () => {
      shown = false;
    });
    document.addEventListener("pointerdown", (e) => {
      if (!shown) return;
      const inside = e.target instanceof Node && element?.contains(e.target);
      if (!inside) close();
    });
    document.addEventListener("keydown", (e) => {
      if (shown && e.key === "Escape") {
        close();
      }
    });
  });
</script>

{#if shown}
  <div
    in:fly={{ duration: 200, y: up ? 10 : -10 }}
    out:fly={{ duration: 200, y: up ? 10 : -10 }}
    bind:this={element}
    class="absolute z-50 rounded-box border p-4 bg-base-100 max-w-[32rem] text-base shadow-xl"
  >
    {@render children?.()}
    <button
      class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
      aria-label="Close"
      onclick={close}
    >
      <PhX></PhX>
    </button>
  </div>
{/if}
