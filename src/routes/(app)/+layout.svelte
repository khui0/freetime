<script lang="ts">
  import { page } from "$app/stores";
  import { settings } from "$lib/settings";

  import PhHouse from "~icons/ph/house";
  import PhHouseFill from "~icons/ph/house-fill";
  import PhCalendarDots from "~icons/ph/calendar-dots";
  import PhCalendarDotsFill from "~icons/ph/calendar-dots-fill";
  import PhUsers from "~icons/ph/users";
  import PhUsersFill from "~icons/ph/users-fill";
  import PhList from "~icons/ph/list";
  import PhListBold from "~icons/ph/list-bold";

  import { onMount } from "svelte";
  import { currentUser, ready, init } from "$lib/pocketbase";

  onMount(() => {
    if (!$currentUser || $ready) return;
    init();
  });
</script>

<main class={$settings.tallNavigation === "true" ? "pb-[calc(49px+2rem)]" : "pb-[49px]"}>
  <slot></slot>
</main>
<div class="fixed z-50 left-0 right-0 -top-20 h-20 bg-base-100"></div>
<nav
  class="fixed bottom-0 left-0 right-0 bg-base-100/50 backdrop-blur-lg z-40 flex justify-around border-t text-xl print:hidden"
  class:pb-8={$settings.tallNavigation === "true"}
>
  <a href="/home" class="p-3 active:scale-90 active:text-base-content/50 transition-all">
    {#if $page.url.pathname === "/home"}
      <PhHouseFill></PhHouseFill>
    {:else}
      <PhHouse></PhHouse>
    {/if}
  </a>
  <a href="/calendar" class="p-3 active:scale-90 active:text-base-content/50 transition-all">
    {#if $page.url.pathname === "/calendar"}
      <PhCalendarDotsFill></PhCalendarDotsFill>
    {:else}
      <PhCalendarDots></PhCalendarDots>
    {/if}
  </a>
  <a href="/friends" class="p-3 active:scale-90 active:text-base-content/50 transition-all">
    {#if $page.url.pathname === "/friends"}
      <PhUsersFill></PhUsersFill>
    {:else}
      <PhUsers></PhUsers>
    {/if}</a
  >
  <a href="/settings" class="p-3 active:scale-90 active:text-base-content/50 transition-all">
    {#if $page.url.pathname === "/settings"}
      <PhListBold></PhListBold>
    {:else}
      <PhList></PhList>
    {/if}</a
  >
</nav>
