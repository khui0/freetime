<script lang="ts">
  import { title } from "$lib/store";
  import { page } from "$app/stores";

  import { currentUser } from "$lib/pocketbase";

  import PhUser from "~icons/ph/user";

  import PhHouse from "~icons/ph/house";
  import PhHouseFill from "~icons/ph/house-fill";
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

<div class="flex flex-col h-full">
  <header class="flex gap-2 items-center justify-between p-2 border-b">
    <div>
      <h1 class="ml-2 font-bold active:scale-90 transition-transform">
        <a href="/">SB Freetime</a>
      </h1>
    </div>
    <div class="flex gap-1 items-center">
      {#if $currentUser}
        <a class="btn btn-sm btn-square rounded-full" href="/account"><PhUser></PhUser></a>
      {:else}
        <a class="btn btn-sm" href="/sign-in">Sign in</a>
        <a class="btn btn-sm" href="/register">Register</a>
      {/if}
    </div>
  </header>
  <main class="flex-1 overflow-auto"><slot></slot></main>
  <nav class="flex justify-evenly border-t">
    <a href="/" class="p-3 active:scale-90 transition-transform">
      {#if $page.url.pathname === "/"}
        <PhHouseFill></PhHouseFill>
      {:else}
        <PhHouse></PhHouse>
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
</div>