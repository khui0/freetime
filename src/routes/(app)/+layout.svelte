<script lang="ts">
  import { page } from "$app/stores";
  import { settings } from "$lib/settings";

  import PhCalendarDots from "~icons/ph/calendar-dots";
  import PhCalendarDotsFill from "~icons/ph/calendar-dots-fill";
  import PhCaretLeft from "~icons/ph/caret-left";
  import PhCaretRight from "~icons/ph/caret-right";
  import PhHouse from "~icons/ph/house";
  import PhHouseFill from "~icons/ph/house-fill";
  import PhList from "~icons/ph/list";
  import PhListBold from "~icons/ph/list-bold";
  import PhUsers from "~icons/ph/users";
  import PhUsersFill from "~icons/ph/users-fill";

  import LogoSmall from "$lib/components/LogoSmall.svelte";
  import { currentUser, init, ready } from "$lib/pocketbase";
  import { onMount, type Snippet } from "svelte";
  import TodayProgress from "$lib/components/widgets/TodayProgress.svelte";

  let { children }: { children: Snippet } = $props();

  let compact: boolean = $state(false);

  let hideProgress: boolean = $state(false);

  onMount(() => {
    compact = $settings.compact === "true";
    if ($currentUser && !$ready) {
      init();
    }
  });

  $effect(() => {
    $settings.compact = compact ? "true" : "false";
  });
</script>

<div class="h-full sm:hidden">
  <main class={$settings.tallNavigation === "true" ? "pb-[calc(49px+2rem)]" : "pb-[49px]"}>
    {@render children?.()}
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
      {/if}
    </a>
    <a href="/settings" class="p-3 active:scale-90 active:text-base-content/50 transition-all">
      {#if $page.url.pathname === "/settings"}
        <PhListBold></PhListBold>
      {:else}
        <PhList></PhList>
      {/if}
    </a>
  </nav>
</div>

<div class="sm:flex h-full hidden">
  <div
    class="flex shrink-0 flex-col border-r border-base-200 {compact
      ? 'w-[4rem]'
      : 'w-[12.75rem]'} transition-[width]"
  >
    <header class="flex items-center p-3 {compact ? 'justify-center' : 'justify-between'}">
      {#if !compact}
        <a href="/home" class="ml-2">
          <LogoSmall></LogoSmall>
        </a>
      {/if}
      <label class="btn btn-square btn-ghost swap btn-sm">
        <input type="checkbox" bind:checked={compact} />
        <span class="swap-on">
          <PhCaretRight></PhCaretRight>
        </span>
        <span class="swap-off">
          <PhCaretLeft></PhCaretLeft>
        </span>
      </label>
    </header>
    <div class="flex flex-1 flex-col">
      <ul class="menu">
        <li>
          <a href="/home" class="h-9 flex items-center">
            {#if $page.url.pathname === "/home"}
              <PhHouseFill></PhHouseFill>
            {:else}
              <PhHouse></PhHouse>
            {/if}
            {#if !compact}
              Home
            {/if}
          </a>
        </li>
        <li>
          <a href="/calendar" class="h-9 flex items-center">
            {#if $page.url.pathname === "/calendar"}
              <PhCalendarDotsFill></PhCalendarDotsFill>
            {:else}
              <PhCalendarDots></PhCalendarDots>
            {/if}
            {#if !compact}
              Calendar
            {/if}
          </a>
        </li>
        <li>
          <a href="/friends" class="h-9 flex items-center">
            {#if $page.url.pathname === "/friends"}
              <PhUsersFill></PhUsersFill>
            {:else}
              <PhUsers></PhUsers>
            {/if}
            {#if !compact}
              Friends
            {/if}
          </a>
        </li>
      </ul>
    </div>
    <ul class="menu">
      <li>
        <a href="/settings" class="h-9 flex items-center">
          {#if $page.url.pathname === "/settings"}
            <PhListBold></PhListBold>
          {:else}
            <PhList></PhList>
          {/if}
          {#if !compact}
            Settings
          {/if}
        </a>
      </li>
    </ul>
    <div class="p-3 {hideProgress || compact || $page.url.pathname === '/home' ? 'hidden' : ''}">
      <TodayProgress class="!h-3" bind:empty={hideProgress}></TodayProgress>
    </div>
  </div>
  <main class="flex-1 overflow-auto">
    {@render children()}
  </main>
</div>
