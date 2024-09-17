<script lang="ts">
  import { title } from "$lib/store";
  import { page } from "$app/stores";

  import PhHouse from "~icons/ph/house";
  import PhHouseFill from "~icons/ph/house-fill";
  import PhCalendarDots from "~icons/ph/calendar-dots";
  import PhCalendarDotsFill from "~icons/ph/calendar-dots-fill";
  import PhUsers from "~icons/ph/users";
  import PhUsersFill from "~icons/ph/users-fill";
  import PhGear from "~icons/ph/gear";
  import PhGearFill from "~icons/ph/gear-fill";
</script>

<svelte:head>
  <title>{$title}{$title ? " - " : ""}SB Freetime</title>
  <meta
    name="description"
    content="Social college schedule viewer for Stony Brook University. Share your class schedule with your friends! Find when everyone's free and easily plan meetups!"
  />
</svelte:head>

<slot></slot>
<nav
  class="fixed bottom-0 left-0 right-0 bg-base-100/50 backdrop-blur-lg z-40 flex justify-evenly border-t"
>
  <a href="/" class="p-3 active:scale-90 transition-transform">
    {#if $page.url.pathname === "/"}
      <PhHouseFill></PhHouseFill>
    {:else}
      <PhHouse></PhHouse>
    {/if}
  </a>
  <a href="/calendar" class="p-3 active:scale-90 transition-transform">
    {#if $page.url.pathname === "/calendar"}
      <PhCalendarDotsFill></PhCalendarDotsFill>
    {:else}
      <PhCalendarDots></PhCalendarDots>
    {/if}
  </a>
  <a href="/friends" class="p-3 active:scale-90 transition-transform">
    {#if $page.url.pathname === "/friends"}
      <PhUsersFill></PhUsersFill>
    {:else}
      <PhUsers></PhUsers>
    {/if}</a
  >
  <a href="/settings" class="p-3 active:scale-90 transition-transform">
    {#if $page.url.pathname === "/settings"}
      <PhGearFill></PhGearFill>
    {:else}
      <PhGear></PhGear>
    {/if}</a
  >
</nav>
