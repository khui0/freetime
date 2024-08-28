<script lang="ts">
  import { title } from "$lib/store";
  import { page } from "$app/stores";

  import { currentUser } from "$lib/pocketbase";

  import PhHouse from "~icons/ph/house";
  import PhHouseFill from "~icons/ph/house-fill";
  import PhUsers from "~icons/ph/users";
  import PhUsersFill from "~icons/ph/users-fill";
  import PhUserCircle from "~icons/ph/user-circle";
  import PhUserCircleFill from "~icons/ph/user-circle-fill";
</script>

<svelte:head>
  <title>{$title}{$title ? " - " : ""}Free Time</title>
</svelte:head>

<div class="flex flex-col h-full">
  <header class="flex gap-2 items-center p-2 border-b">
    <div class="flex-1">
      <h1 class="mx-1">SBU Free Time</h1>
    </div>
    <div class="flex gap-1 items-center">
      {#if $currentUser}
        <p>{$currentUser.username}</p>
      {:else}
        <a class="btn btn-sm" href="/sign-in">Sign in</a>
        <a class="btn btn-sm" href="/register">Register</a>
      {/if}
    </div>
  </header>
  <main class="flex-1 p-4"><slot></slot></main>
  <nav class="flex justify-evenly border-t">
    <a href="/" class="p-3">
      {#if $page.url.pathname === "/"}
        <PhHouseFill></PhHouseFill>
      {:else}
        <PhHouse></PhHouse>
      {/if}
    </a>
    <a href="/friends" class="p-3">
      {#if $page.url.pathname === "/friends"}
        <PhUsersFill></PhUsersFill>
      {:else}
        <PhUsers></PhUsers>
      {/if}</a
    >
    <a href="/account" class="p-3">
      {#if $page.url.pathname === "/account"}
        <PhUserCircleFill></PhUserCircleFill>
      {:else}
        <PhUserCircle></PhUserCircle>
      {/if}</a
    >
  </nav>
</div>
